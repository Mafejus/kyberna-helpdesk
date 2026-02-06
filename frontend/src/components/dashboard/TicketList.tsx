"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

type Ticket = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  reportedAt: string;
  plannedAt?: string;
  dueAt?: string;
  classroom: { code: string };
  assignees: { user: { fullName: string } }[];
  difficultyPoints?: number;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  studentWorkNote?: string;
  adminApprovalNote?: string;
};

type TicketListProps = {
  tickets: Ticket[];
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  title?: string;
  description?: string;
};

// Priority mapping for sorting
const PRIORITY_ORDER = { 'CRITICAL': 4, 'HIGH': 3, 'NORMAL': 2, 'LOW': 1 };

import { AlertCircle, CalendarClock, Clock } from "lucide-react"; // Imported AlertCircle

export function TicketList({ tickets, role, title, description }: TicketListProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'ALL' | 'IN_PROGRESS' | 'WAITING' | 'APPROVED' | 'REJECTED' | 'UNASSIGNED'>('ALL');
  const [readTickets, setReadTickets] = useState<string[]>([]);
  
  const getStorageKey = () => user ? `read_tickets_${user.id}` : null;

  useEffect(() => {
      const key = getStorageKey();
      if (!key) return;

      const stored = localStorage.getItem(key);
      if (stored) {
          try { setReadTickets(JSON.parse(stored)); } catch(e) {}
      } else {
        setReadTickets([]); // Clear state if switching users
      }
  }, [user]); // Re-run when user changes

  const handleTicketClick = (id: string) => {
      // Mark as read in local storage
      if (!readTickets.includes(id)) {
          const updated = [...readTickets, id];
          setReadTickets(updated);
          const key = getStorageKey();
          if (key) {
             localStorage.setItem(key, JSON.stringify(updated));
          }
      }
      router.push(`/tickets/${id}`);
  };

  const getWeight = (t: Ticket) => {
      // 1. Overdue & Unsolved = Highest Priority
      const isOverdue = t.dueAt && new Date(t.dueAt).getTime() < Date.now() && t.status !== 'APPROVED' && t.status !== 'REJECTED';
      if (isOverdue) return 1000;

      // 2. Planned (User explicitly wants these sorted)? Assuming Planned > Unplanned
      // Let's keep Simple: Overdue > (Priority + DueDate)
      return 0;
  };

  const filteredTickets = tickets.filter(t => {
      if (filter === 'ALL') return true;
      if (filter === 'WAITING') return t.status === 'DONE_WAITING_APPROVAL';
      return t.status === filter;
  }).sort((a, b) => {
     // 1. Overdue logic (Top priority)
     const overdueA = a.dueAt && new Date(a.dueAt).getTime() < Date.now() && a.status !== 'APPROVED' && a.status !== 'REJECTED';
     const overdueB = b.dueAt && new Date(b.dueAt).getTime() < Date.now() && b.status !== 'APPROVED' && b.status !== 'REJECTED';
     
     if (overdueA && !overdueB) return -1;
     if (!overdueA && overdueB) return 1;

     // 2. Priority
     const pA = PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER] || 0;
     const pB = PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER] || 0;
     if (pA !== pB) return pB - pA;

     // 3. New (Recent < 24h) - Boost
     const isNewA = (Date.now() - new Date(a.reportedAt).getTime()) < 24 * 60 * 60 * 1000;
     const isNewB = (Date.now() - new Date(b.reportedAt).getTime()) < 24 * 60 * 60 * 1000;
     if (isNewA && !isNewB) return -1;
     if (!isNewA && isNewB) return 1;
     
     // If both are new, sort by Recency (Newest First) instead of Due Date
     // This fixes the issue where newest tickets (limit +7d) appear at the bottom
     if (isNewA && isNewB) {
         return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
     }

     // 4. Status (Active > Done)
     // We want Waiting/In_progress/Unassigned ABOVE Approved/Rejected
     const isDoneA = a.status === 'APPROVED' || a.status === 'REJECTED';
     const isDoneB = b.status === 'APPROVED' || b.status === 'REJECTED';
     if (!isDoneA && isDoneB) return -1;
     if (isDoneA && !isDoneB) return 1;
     
     // 5. Due Date or Planned Date (Ascending - closest first)
     const dateA = a.plannedAt || a.dueAt;
     const dateB = b.plannedAt || b.dueAt;
     
     const timeA = dateA ? new Date(dateA).getTime() : Number.MAX_SAFE_INTEGER;
     const timeB = dateB ? new Date(dateB).getTime() : Number.MAX_SAFE_INTEGER;
     
     if (timeA !== timeB) return timeA - timeB;

     // 6. CreatedAt Desc
     return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
  });

  const getStatusVariant = (status: string) => {
      switch (status) {
          case 'APPROVED': return 'success';
          case 'REJECTED': return 'destructive';
          case 'IN_PROGRESS': return 'warning';
          case 'DONE_WAITING_APPROVAL': return 'warning';
          default: return 'outline';
      }
  };

  const getStatusLabel = (status: string) => {
      switch (status) {
          case 'APPROVED': return 'Schváleno';
          case 'REJECTED': return 'Vráceno';
          case 'IN_PROGRESS': return 'Řeší se';
          case 'DONE_WAITING_APPROVAL': return 'Čeká na schválení';
          case 'UNASSIGNED': return 'Nepřiřazeno';
          default: return status;
      }
  };

  const isOverdue = (t: Ticket) => {
      if (!t.dueAt || t.status === 'APPROVED' || t.status === 'REJECTED') return false;
      return new Date(t.dueAt).getTime() < Date.now();
  };

  const isDueSoon = (t: Ticket) => {
      if (!t.dueAt || t.status === 'APPROVED' || t.status === 'REJECTED' || isOverdue(t)) return false;
      const diff = new Date(t.dueAt).getTime() - Date.now();
      return diff > 0 && diff < 48 * 60 * 60 * 1000;
  };

  return (
    <Card>
      {title && (
          <CardHeader>
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
              <div className="flex gap-2 flex-wrap pt-2">
                  <Button variant={filter === 'ALL' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('ALL')}>Vše</Button>
                  <Button variant={filter === 'IN_PROGRESS' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('IN_PROGRESS')}>Rozpracované</Button>
                  <Button variant={filter === 'WAITING' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('WAITING')}>Čeká</Button>
                  <Button variant={filter === 'APPROVED' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('APPROVED')}>Hotové</Button>
                  <Button variant={filter === 'REJECTED' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('REJECTED')}>Vrácené</Button>
                  {/* Student "Unassigned" filter removed in favor of Dashboard Tabs */}
                  {role !== 'STUDENT' && (
                       <Button variant={filter === 'UNASSIGNED' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('UNASSIGNED')}>Volné</Button>
                  )}
              </div>
          </CardHeader>
      )}
      <CardContent className={title ? "" : "p-0"}>
          <div className="relative w-full overflow-auto">
              {filteredTickets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Žádné tickety odpovídající filtru.</div>
              ) : (
                  <table className="w-full caption-bottom text-sm text-left">
                      <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Termín</th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Třída</th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Název</th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Stav</th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Priorita</th>
                              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Řešitel</th>
                          </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                          {filteredTickets.map((t) => {
                              const overdue = isOverdue(t);
                              const dueSoon = isDueSoon(t);
                              // Logic for "NEW" indicator
                              const isRecent = (Date.now() - new Date(t.reportedAt).getTime()) < 24 * 60 * 60 * 1000;
                              const isUnread = isRecent && !readTickets.includes(t.id);

                              return (
                              <tr 
                                key={t.id} 
                                className={`border-b transition-colors hover:bg-muted cursor-pointer 
                                    ${(t.priority === 'HIGH' || t.priority === 'CRITICAL') ? 'bg-destructive/5' : ''}
                                    ${overdue ? 'bg-red-100 dark:bg-red-900/30 border-l-4 border-l-red-600' : ''}
                                `}
                                onClick={() => handleTicketClick(t.id)}
                              >
                                  <td className="p-4 align-middle whitespace-nowrap">
                                      {t.dueAt ? (
                                          <div className="flex flex-col">
                                              <span className={`font-bold flex items-center gap-1 ${overdue ? 'text-destructive' : (dueSoon ? 'text-orange-600' : '')}`}>
                                                  {overdue && <AlertCircle className="h-3 w-3" />}
                                                  {format(new Date(t.dueAt), 'd.M.')}
                                              </span>
                                              <span className={`text-xs ${overdue ? 'text-destructive/80 font-semibold' : 'text-muted-foreground'}`}>
                                                  {overdue ? 'PO TERMÍNU' : (dueSoon ? 'Brzy' : format(new Date(t.dueAt), 'HH:mm'))}
                                              </span>
                                          </div>
                                      ) : '-'}
                                  </td>
                                  <td className="p-4 align-middle font-bold">{t.classroom.code}</td>
                                  <td className="p-4 align-middle max-w-[200px] truncate relative">
                                      <div title={t.title} className="flex items-center gap-2">
                                         {t.title}
                                         {isUnread && (
                                            <span className="relative flex h-2 w-2" title="Nový ticket">
                                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                            </span>
                                         )}
                                      </div>
                                      {t.plannedAt && <div className="text-xs text-blue-600 dark:text-blue-400">Plán: {format(new Date(t.plannedAt), 'd.M. HH:mm')}</div>}
                                  </td>
                                  <td className="p-4 align-middle">
                                      <Badge variant={getStatusVariant(t.status) as any}>
                                          {getStatusLabel(t.status)}
                                      </Badge>
                                  </td>
                                  <td className="p-4 align-middle">
                                      {(t.priority === 'HIGH' || t.priority === 'CRITICAL') && <Badge className="bg-destructive hover:bg-destructive/90 text-destructive-foreground border-destructive">Vysoká</Badge>}
                                      {t.priority === 'NORMAL' && <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">Normální</Badge>}
                                      {t.priority === 'LOW' && <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30">Nízká</Badge>}
                                  </td>
                                  <td className="p-4 align-middle">
                                      {t.assignees?.[0]?.user?.fullName || '-'}
                                      {t.assignees?.length > 1 && ` (+${t.assignees.length - 1})`}
                                  </td>
                              </tr>
                          )})}
                      </tbody>
                  </table>
              )}
          </div>
      </CardContent>
    </Card>
  );
}
