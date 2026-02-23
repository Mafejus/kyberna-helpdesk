"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function PendingTicketsWidget() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [page, setPage] = useState(1);

  // Dialog states
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [action, setAction] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [note, setNote] = useState("");
  const [points, setPoints] = useState("1"); // Default difficulty

  const fetchTickets = () => {
    setLoading(true);
    // Find tickets waiting for approval
    api.get('/tickets?status=DONE_WAITING_APPROVAL')
      .then(res => {
        // Handle paginated response structure
        const data = res.data;
        if (Array.isArray(data)) {
          setTickets(data);
        } else if (data && Array.isArray(data.items)) {
          setTickets(data.items);
        } else {
          setTickets([]);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleAction = async () => {
      if (!selectedTicket || !action) return;
      try {
          if (action === 'APPROVE') {
              await api.post(`/tickets/${selectedTicket.id}/approve`, {
                  adminApprovalNote: note,
                  difficultyPoints: parseInt(points, 10)
              });
          } else {
              await api.post(`/tickets/${selectedTicket.id}/reject`, {
                  adminApprovalNote: note
              });
          }
          // Refresh
          fetchTickets();
          setSelectedTicket(null);
          setAction(null);
          setNote("");
      } catch (e) {
          console.error(e);
          alert("Chyba při akci");
      }
  };

  if (loading) return (
    <Card className="h-full border-warning/50 bg-warning/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-warning-foreground">
          <AlertCircle className="h-5 w-5" />
          Čeká na schválení
        </CardTitle>
        <CardDescription>Načítám tickety...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card border rounded-lg p-4 flex justify-between items-center">
              <div className="space-y-2 flex-1">
                <div className="flex gap-2 items-center">
                  <div className="h-3 w-10 rounded bg-muted" />
                  <div className="h-3 w-24 rounded bg-muted" />
                </div>
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>
              <div className="flex gap-2 ml-4">
                <div className="h-8 w-20 rounded bg-muted" />
                <div className="h-8 w-16 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="h-full border-warning/50 bg-warning/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-warning-foreground">
            <AlertCircle className="h-5 w-5" />
            Čeká na schválení
        </CardTitle>
        <CardDescription>Tyto tickety studenti označili jako hotové.</CardDescription>
      </CardHeader>
      <CardContent>
        {tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-muted-foreground opacity-70">
                <CheckCircle className="h-10 w-10 mb-2 text-muted" />
                <p>Vše hotovo! Žádné tickety ke schválení.</p>
            </div>
        ) : (
            <>
            <div className="space-y-4">
                {tickets.slice((page - 1) * 5, page * 5).map(t => (
                    <div key={t.id} className="bg-card border rounded-lg p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold">{t.classroom.code}</span>
                                <span className="text-muted-foreground text-sm"> | {t.assignees[0]?.user.fullName}</span>
                                <span className="text-xs text-muted-foreground"> | {new Date(t.updatedAt).toLocaleDateString()}</span>
                            </div>
                            <h4 className="font-medium text-primary hover:underline cursor-pointer" onClick={() => router.push(`/tickets/${t.id}`)}>
                                {t.title}
                            </h4>
                            {t.studentWorkNote && (
                                <p className="text-xs text-muted-foreground mt-1 italic">"{t.studentWorkNote}"</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Dialog onOpenChange={(open: boolean) => !open && setAction(null)}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-success border-success hover:bg-success/10" onClick={() => { setSelectedTicket(t); setAction('APPROVE'); }}>
                                        <CheckCircle className="h-4 w-4 mr-1" /> Schválit
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Schválit řešení: {selectedTicket?.title}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Obtížnost (Body)</Label>
                                            <div className="flex gap-2">
                                                {[1, 3, 5].map(p => (
                                                    <Button key={p} variant={points === p.toString() ? "default" : "outline"} size="sm" onClick={() => setPoints(p.toString())}>
                                                        {p} bod{p > 1 && p < 5 ? 'y' : (p === 5 ? 'ů' : '')}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Komentář admina (Volitelné)</Label>
                                            <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Skvělá práce, díky!" />
                                        </div>
                                        <Button onClick={handleAction} className="w-full bg-success hover:bg-success/90">Potvrdit schválení</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => { setSelectedTicket(t); setAction('REJECT'); }}>
                                        <XCircle className="h-4 w-4 mr-1" /> Vrátit
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Vrátit k dopracování: {selectedTicket?.title}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Důvod vrácení (Povinné)</Label>
                                            <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Není to hotové, protože..." />
                                        </div>
                                        <Button onClick={handleAction} disabled={!note} className="w-full bg-destructive hover:bg-destructive/90">Potvrdit vrácení</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                ))}
            </div>
            {tickets.length > 5 && (
                <div className="flex justify-between items-center pt-2">
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                        Předchozí
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Strana {page} z {Math.ceil(tickets.length / 5)}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(Math.ceil(tickets.length / 5), p + 1))} disabled={page >= Math.ceil(tickets.length / 5)}>
                        Další
                    </Button>
                </div>
            )}
            </>
        )}
      </CardContent>
    </Card>
  );
}
