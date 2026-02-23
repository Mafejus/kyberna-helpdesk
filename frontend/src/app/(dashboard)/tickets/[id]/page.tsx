"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeft, User, MessageSquare, Paperclip, Trash2, Crown, Plus, Download, CalendarClock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuditTimeline } from "@/components/tickets/AuditTimeline";

export default function TicketDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  // Actions State
  const [workNote, setWorkNote] = useState("");
  const [comment, setComment] = useState("");
  const [points, setPoints] = useState("1");
  const [approvalNote, setApprovalNote] = useState("");

  // Admin Manage State
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchTicket = (silent = false) => {
      if (!silent) setLoading(true);
      api.get(`/tickets/${id}`).then(res => setTicket(res.data)).finally(() => {
          if (!silent) setLoading(false);
      });
  };

  useEffect(() => {
    fetchTicket();
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const u = JSON.parse(userStr);
        setCurrentUser(u);
        if (u.role === 'ADMIN') {
            api.get('/users?role=STUDENT').then(res => setAllStudents(res.data)).catch(() => {});
        }
    }
  }, [id]);

  const optimisticUpdate = (patch: Partial<any>) => {
      setTicket((prev: any) => prev ? { ...prev, ...patch } : prev);
  };

  const handleClaim = async () => {
      const prev = ticket;
      optimisticUpdate({ status: 'IN_PROGRESS', assignees: [...(ticket.assignees || []), { userId: currentUser?.id, orderIndex: 1, user: { id: currentUser?.id, fullName: currentUser?.fullName } }] });
      try { await api.post(`/tickets/${id}/claim`); toast({ title: "Přebráno" }); fetchTicket(true); }
      catch(e) { toast({ variant: "destructive", title: "Chyba" }); setTicket(prev); }
  };

  const handleJoin = async () => {
      const prev = ticket;
      optimisticUpdate({ assignees: [...(ticket.assignees || []), { userId: currentUser?.id, orderIndex: ticket.assignees.length + 1, user: { id: currentUser?.id, fullName: currentUser?.fullName } }] });
      try { await api.post(`/tickets/${id}/join`); toast({ title: "Přidáno k řešení" }); fetchTicket(true); }
      catch(e) { toast({ variant: "destructive", title: "Chyba" }); setTicket(prev); }
  };

  const handleLeave = async () => {
      const prev = ticket;
      optimisticUpdate({ assignees: ticket.assignees.filter((a: any) => a.userId !== currentUser?.id) });
      try { await api.post(`/tickets/${id}/leave`); toast({ title: "Opuštěno" }); fetchTicket(true); }
      catch(e) { toast({ variant: "destructive", title: "Chyba" }); setTicket(prev); }
  };

  const handleMarkDone = async () => {
      const prev = ticket;
      optimisticUpdate({ status: 'DONE_WAITING_APPROVAL', studentWorkNote: workNote });
      try { await api.post(`/tickets/${id}/mark-done`, { note: workNote }); toast({ title: "Hotovo, čeká na schválení" }); fetchTicket(true); }
      catch(e) { toast({ variant: "destructive", title: "Chyba" }); setTicket(prev); }
  };

  const handleApprove = async () => {
      const prev = ticket;
      optimisticUpdate({ status: 'APPROVED', adminApprovalNote: approvalNote, difficultyPoints: parseInt(points) });
      try { await api.post(`/tickets/${id}/approve`, { adminApprovalNote: approvalNote, difficultyPoints: parseInt(points) }); toast({ title: "Schváleno" }); fetchTicket(true); }
      catch(e) { toast({ variant: "destructive", title: "Chyba" }); setTicket(prev); }
  };

  const handleReject = async () => {
      const prev = ticket;
      optimisticUpdate({ status: 'REJECTED', adminApprovalNote: approvalNote });
      try {
          await api.post(`/tickets/${id}/reject`, { adminApprovalNote: approvalNote, penaltyPoints: parseInt(points) });
          toast({ title: "Vráceno s penalizací" });
          fetchTicket(true);
      } catch(e) {
          toast({ variant: "destructive", title: "Chyba" });
          setTicket(prev);
      }
  };

  const handleRework = async () => {
      const prev = ticket;
      optimisticUpdate({ status: 'IN_PROGRESS' });
      try {
          await api.post(`/tickets/${id}/rework`);
          toast({ title: "Vráceno do řešení (Rework)" });
          fetchTicket(true);
      } catch (e) {
          toast({ variant: "destructive", title: "Chyba při reworku" });
          setTicket(prev);
      }
  };


  const handleDelete = async () => {
    try {
        await api.delete(`/tickets/${id}`);
        toast({ title: "Ticket smazán" });
        router.push('/dashboard/admin'); // Or just /tickets
    } catch (e) {
        toast({ variant: "destructive", title: "Chyba při mazání" });
    }
  };

  const handleAddComment = async () => {
      if (!comment.trim()) return;
      try { await api.post(`/tickets/${id}/comments`, { message: comment }); setComment(""); fetchTicket(true); } catch(e) { toast({ variant: "destructive", title: "Chyba" }); }
  };

  const handleManageAssignee = async (action: 'ADD' | 'REMOVE' | 'SET_FIRST', userId: string) => {
      try {
           await api.post(`/tickets/${id}/assignees`, { action, userId });
           toast({ title: "Aktualizováno" });
           fetchTicket(true);
      } catch(e) { toast({ variant: "destructive", title: "Chyba" }); }
  };

  const handleDownload = async (attId: string, fileName: string) => {
      try {
          const response = await api.get(`/tickets/${id}/attachments/${attId}`, { 
              responseType: 'blob' 
          });
          
          // Try to get content-type from headers, default to generic binary
          const contentType = response.headers['content-type'] || 'application/octet-stream';
          const blob = new Blob([response.data], { type: contentType });
          
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
      } catch (e: any) {
          if (e.response?.status === 403) {
              toast({ variant: "destructive", title: "Přístup odepřen", description: "Nemáte oprávnění stáhnout tento soubor." });
          } else if (e.response?.status === 404) {
              toast({ variant: "destructive", title: "Soubor nenalezen", description: "Soubor již neexistuje na serveru." });
          } else {
              toast({ variant: "destructive", title: "Chyba stahování", description: "Nastala neočekávaná chyba." });
          }
      }
  }

  if (loading) return <div>Načítám...</div>;
  if (!ticket) return <div>Nenalezeno</div>;

  const isAssignee = ticket.assignees.some((a: any) => a.userId === currentUser?.id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <Button variant="ghost" onClick={() => router.back()}><ArrowLeft className="mr-2 h-4 w-4"/> Zpět</Button>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
          <div className="space-y-1">
              <h1 className="text-3xl font-bold">{ticket.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground flex-wrap">
                  <Badge variant="outline">{ticket.classroom.code}</Badge>
                  <span>•</span>
                  <span>{ticket.createdBy.fullName}</span>
                  <span>•</span>
                  <span>{new Date(ticket.createdAt).toLocaleString()}</span>
              </div>
          </div>
          <div className="flex items-center gap-2">
              {(ticket.priority === 'HIGH' || ticket.priority === 'CRITICAL') && <Badge variant="destructive">Vysoká priorita</Badge>}
              <StatusBadge status={ticket.status} className="text-lg py-1 px-3" />
              
              {/* ADMIN PRIORITY SELECTOR */}
              {currentUser?.role === 'ADMIN' && (
                  <Select value={ticket.priority} onValueChange={(val) => {
                      api.patch(`/tickets/${id}/priority`, { priority: val }).then(() => { toast({ title: "Priorita změnena" }); fetchTicket(true); });
                  }}>
                      <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Priorita" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="LOW">Nízká</SelectItem>
                          <SelectItem value="NORMAL">Normální</SelectItem>
                          <SelectItem value="HIGH">Vysoká</SelectItem>
                      </SelectContent>
                  </Select>
              )}

              {/* ADMIN DELETE BUTTON */}
              {currentUser?.role === 'ADMIN' && (
                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                      <DialogTrigger asChild>
                          <Button variant="destructive" size="icon" title="Smazat ticket">
                              <Trash2 className="h-4 w-4"/>
                          </Button>
                      </DialogTrigger>
                      <DialogContent>
                          <DialogHeader>
                              <DialogTitle>Opravdu smazat ticket?</DialogTitle>
                              <DialogDescription>
                                  Tato akce je nevratná. Smaže se ticket, všechny komentáře a přílohy.
                              </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Zrušit</Button>
                              <Button variant="destructive" onClick={handleDelete}>Smazat trvale</Button>
                          </DialogFooter>
                      </DialogContent>
                  </Dialog>
              )}
          </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
              {/* DESCRIPTION & ATTACHMENTS */}
              <Card>
                  <CardHeader><CardTitle>Popis</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                      <p className="whitespace-pre-wrap">{ticket.description}</p>
                      
                      {ticket.attachments?.length > 0 && (
                          <div className="space-y-2">
                              <h4 className="text-sm font-semibold flex items-center gap-2"><Paperclip className="h-4 w-4"/> Přílohy</h4>
                              <div className="grid gap-2">
                                  {ticket.attachments.map((att: any) => (
                                      <div key={att.id} className="flex items-center justify-between p-2 border rounded bg-muted/20">
                                          <div className="truncate text-sm">{att.originalName}</div>
                                          <Button variant="ghost" size="sm" onClick={() => handleDownload(att.id, att.originalName)}>
                                              <Download className="h-4 w-4 mr-2"/> Stáhnout
                                          </Button>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}

                      {/* RESOLUTION INFO */}
                      {(ticket.studentWorkNote || ticket.adminApprovalNote) && (
                          <div className="pt-6 border-t space-y-4">
                              <h3 className="font-semibold text-lg">Řešení a hodnocení</h3>
                              {ticket.studentWorkNote && (
                                  <div className="bg-muted p-4 rounded-lg">
                                      <p className="text-sm font-semibold mb-1">Poznámka řešitele:</p>
                                      <p className="italic text-muted-foreground">"{ticket.studentWorkNote}"</p>
                                  </div>
                              )}
                              {ticket.adminApprovalNote && (
                                  <div className={`p-4 rounded-lg border ${ticket.status === 'REJECTED' ? 'bg-destructive/10 border-destructive/20' : 'bg-success/10 border-success/20'}`}>
                                      <p className="text-sm font-semibold mb-1">
                                          {ticket.status === 'REJECTED' ? 'Admin vrátil k dopracování:' : `Admin schválil (${ticket.difficultyPoints} bodů):`}
                                      </p>
                                      <p className="text-sm">"{ticket.adminApprovalNote}"</p>
                                  </div>
                              )}
                          </div>
                      )}
                  </CardContent>
              </Card>

              {/* COMMENTS */}
              <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-4 w-4"/> Komentáře</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                      {ticket.comments?.length === 0 ? (
                          <p className="text-muted-foreground text-sm">Zatím žádné komentáře.</p>
                      ) : (
                          <div className="space-y-4 max-h-[400px] overflow-y-auto">
                              {ticket.comments.map((c: any) => (
                                  <div key={c.id} className={`flex gap-3 ${c.author.id === currentUser?.id ? 'flex-row-reverse' : ''}`}>
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                          c.author.id === currentUser?.id ? 'bg-primary/20 text-primary' 
                                          : c.author.role === 'ADMIN' ? 'bg-destructive/20 text-destructive' 
                                          : 'bg-secondary'
                                      }`}>
                                          <span className="font-bold text-xs">{c.author.fullName[0]}</span>
                                      </div>
                                      <div className={`flex-1 p-3 rounded-lg max-w-[85%] ${
                                          c.author.id === currentUser?.id ? 'bg-primary/10 border border-primary/20' 
                                          : c.author.role === 'ADMIN' ? 'bg-destructive/10 border border-destructive/20' 
                                          : 'bg-muted/50'
                                      }`}>
                                          <div className={`flex justify-between items-center mb-1 ${c.author.id === currentUser?.id ? 'flex-row-reverse' : ''}`}>
                                              <span className={`font-medium text-sm ${
                                                  c.author.id === currentUser?.id ? 'text-primary'
                                                  : c.author.role === 'ADMIN' ? 'text-destructive font-bold' 
                                                  : ''
                                              }`}>
                                                  {c.author.fullName} {c.author.role === 'ADMIN' && '(Admin)'}
                                              </span>
                                              <span className="text-xs text-muted-foreground mx-2">{new Date(c.createdAt).toLocaleString()}</span>
                                          </div>
                                          <p className={`text-sm whitespace-pre-wrap ${c.author.id === currentUser?.id ? 'text-right' : ''}`}>{c.message}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                      
                      {currentUser?.role !== 'TEACHER' && (
                          <div className="flex gap-2">
                              <Textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Napsat komentář..." className="min-h-[60px]" />
                              <Button onClick={handleAddComment} size="sm" className="self-end" disabled={!comment.trim()}>Odeslat</Button>
                          </div>
                      )}
                  </CardContent>
              </Card>
              
              <AuditTimeline ticketId={id as string} />
          </div>

          <div className="space-y-6">


              {/* PLANNING PANEL */}
              <Card>
                  <CardHeader className="pb-2">
                       <CardTitle className="text-base flex items-center gap-2"><CalendarClock className="h-4 w-4"/> Plánování</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      {currentUser?.role === 'ADMIN' ? (
                          <AdminSchedulingPanel ticket={ticket} onUpdate={fetchTicket} />
                      ) : (
                          <div className="space-y-3">
                              <div>
                                  <p className="text-xs text-muted-foreground font-semibold uppercase">Termín</p>
                                  <div className={`font-medium ${new Date(ticket.dueAt).getTime() < Date.now() && ticket.status !== 'APPROVED' ? 'text-destructive' : ''}`}>
                                      {ticket.dueAt ? new Date(ticket.dueAt).toLocaleString('cs-CZ', { dateStyle: 'medium', timeStyle: 'short' }) : 'Není nastaven'}
                                      {new Date(ticket.dueAt).getTime() < Date.now() && ticket.status !== 'APPROVED' && <Badge variant="destructive" className="ml-2 text-xs">PO TERMÍNU</Badge>}
                                  </div>
                              </div>
                              {ticket.plannedAt && (
                                  <div>
                                      <p className="text-xs text-muted-foreground font-semibold uppercase">Plánováno</p>
                                      <div className="text-primary font-medium">
                                          {new Date(ticket.plannedAt).toLocaleString('cs-CZ', { dateStyle: 'medium', timeStyle: 'short' })}
                                      </div>
                                  </div>
                              )}
                          </div>
                      )}
                  </CardContent>
              </Card>

              {/* ASSIGNEES PANEL */}
              <Card>
                  <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Řešitelé</CardTitle>
                          {currentUser?.role === 'ADMIN' && (
                              <Dialog>
                                  <DialogTrigger asChild><Button size="sm" variant="outline"><Plus className="h-4 w-4"/></Button></DialogTrigger>
                                  <DialogContent>
                                      <DialogHeader><DialogTitle>Přidat řešitele</DialogTitle></DialogHeader>
                                      <div className="space-y-4 py-4">
                                          <Select onValueChange={setSelectedStudentToAdd}>
                                              <SelectTrigger><SelectValue placeholder="Vyber studenta" /></SelectTrigger>
                                              <SelectContent>
                                                  {allStudents.filter(s => !ticket.assignees.some((a:any) => a.userId === s.id)).map(s => (
                                                      <SelectItem key={s.id} value={s.id}>{s.fullName}</SelectItem>
                                                  ))}
                                              </SelectContent>
                                          </Select>
                                          <Button onClick={() => handleManageAssignee('ADD', selectedStudentToAdd)} disabled={!selectedStudentToAdd} className="w-full">Přidat</Button>
                                      </div>
                                  </DialogContent>
                              </Dialog>
                          )}
                      </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      {ticket.assignees.length === 0 ? (
                          <div className="text-sm text-muted-foreground">Nikdo nepřiřazen</div>
                      ) : (
                          <div className="space-y-2">
                              {ticket.assignees.map((a: any) => (
                                  <div key={a.userId} className="flex items-center justify-between p-2 border rounded text-sm bg-card">
                                      <div className="flex items-center gap-2">
                                          {a.orderIndex === 1 ? <Crown className="h-4 w-4 text-warning"/> : <User className="h-4 w-4 text-muted-foreground"/>}
                                          <span>{a.user.fullName}</span>
                                      </div>
                                      {currentUser?.role === 'ADMIN' && (
                                          <div className="flex gap-1">
                                              {a.orderIndex !== 1 && (
                                                  <Button size="icon" variant="ghost" className="h-6 w-6" title="Nastavit jako první" onClick={() => handleManageAssignee('SET_FIRST', a.userId)}>
                                                      <Crown className="h-3 w-3 text-muted-foreground"/>
                                                  </Button>
                                              )}
                                              <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" title="Odebrat" onClick={() => handleManageAssignee('REMOVE', a.userId)}>
                                                  <Trash2 className="h-3 w-3"/>
                                              </Button>
                                          </div>
                                      )}
                                  </div>
                              ))}
                          </div>
                      )}
                      
                      {/* STUDENT ACTIONS */}
                      {currentUser?.role === 'STUDENT' && !isAssignee && ticket.status === 'UNASSIGNED' && (
                          <Button className="w-full" onClick={handleClaim}>Převzít ticket (Claim)</Button>
                      )}
                      {currentUser?.role === 'STUDENT' && !isAssignee && ticket.status === 'IN_PROGRESS' && (
                          <Button className="w-full" variant="secondary" onClick={handleJoin}>Připojit se (Join)</Button>
                      )}
                      {currentUser?.role === 'STUDENT' && ticket.status === 'REJECTED' && (
                          <Button className="w-full bg-primary mb-2" onClick={handleRework}>Předělat ticket (Rework)</Button>
                      )}
                      {currentUser?.role === 'STUDENT' && isAssignee && ticket.status === 'IN_PROGRESS' && (
                          <div className="space-y-2 pt-2">
                              <Dialog>
                                <DialogTrigger asChild><Button variant="success" className="w-full">Označit jako hotové</Button></DialogTrigger>
                                <DialogContent>
                                    <DialogHeader><DialogTitle>Hotovo?</DialogTitle></DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <Label>Popis řešení</Label>
                                        <Textarea value={workNote} onChange={e => setWorkNote(e.target.value)} placeholder="Co jsi udělal?" />
                                        <Button onClick={handleMarkDone} className="w-full">Potvrdit</Button>
                                    </div>
                                </DialogContent>
                              </Dialog>
                              <Button variant="outline" onClick={handleLeave} className="w-full text-destructive hover:bg-destructive/10">Odejít z ticketu</Button>
                          </div>
                      )}
                  </CardContent>
              </Card>

              {/* ADMIN APPROVAL PANEL - STRICT CONDITION */}
              {currentUser?.role === 'ADMIN' && ticket.status === 'DONE_WAITING_APPROVAL' && (
                  <Card className="border-warning/50">
                      <CardHeader className="pb-2"><CardTitle className="text-base text-warning-foreground">Schvalování</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                          <div className="space-y-2">
                              <Label>Body (Odměna / Penalizace)</Label>
                              <div className="flex gap-2">
                                  {[1, 3, 5].map(p => (
                                      <Button key={p} variant={points === p.toString() ? "default" : "outline"} size="sm" onClick={() => setPoints(p.toString())} className="flex-1">
                                          {p}
                                      </Button>
                                  ))}
                              </div>
                              <p className="text-xs text-muted-foreground">Při schválení se body přičtou. Při vrácení se odečtou.</p>
                          </div>
                          <div className="space-y-2">
                              <Label>Poznámka</Label>
                              <Textarea value={approvalNote} onChange={e => setApprovalNote(e.target.value)} placeholder="Hodnocení..." className="h-20" />
                          </div>
                          <div className="flex gap-2">
                              <Button variant="success" className="flex-1" onClick={handleApprove}>Schválit</Button>
                              <Button variant="destructive" className="flex-1" onClick={handleReject}>Vrátit</Button>
                          </div>
                      </CardContent>
                  </Card>
              )}
          </div>
      </div>
    </div>
  );
}

function AdminSchedulingPanel({ ticket, onUpdate }: { ticket: any, onUpdate: () => void }) {
    const { toast } = useToast();
    const [dueAt, setDueAt] = useState(ticket.dueAt ? toLocalISO(ticket.dueAt) : '');
    const [plannedAt, setPlannedAt] = useState(ticket.plannedAt ? toLocalISO(ticket.plannedAt) : '');
    const [loading, setLoading] = useState(false);

    function toLocalISO(dateStr: string) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().slice(0, 16);
    }

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.patch(`/tickets/${ticket.id}/schedule`, {
                dueAt: dueAt ? new Date(dueAt).toISOString() : undefined,
                plannedAt: plannedAt ? new Date(plannedAt).toISOString() : null,
            });
            toast({ title: "Plánování uloženo" });
            onUpdate();
        } catch (e) {
            toast({ variant: "destructive", title: "Chyba ukládání" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Termín splatnosti (povinné)</Label>
                <input 
                  type="datetime-local" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={dueAt}
                  onChange={(e) => setDueAt(e.target.value)}
                  required
                />
            </div>
            <div className="space-y-2">
                <Label>Plánováno na (Volitelné)</Label>
                <div className="flex gap-2">
                    <input 
                      type="datetime-local" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={plannedAt}
                      onChange={(e) => setPlannedAt(e.target.value)}
                    />
                    <Button variant="outline" size="icon" onClick={() => setPlannedAt('')} title="Vymazat"><Trash2 className="h-4 w-4"/></Button>
                </div>
            </div>
            <Button className="w-full" onClick={handleSave} disabled={loading || !dueAt}>
                {loading ? "Ukládám..." : "Uložit změny"}
            </Button>
        </div>
    );
}
