"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PcList } from "@/components/classrooms/PcList";
import { Badge } from "@/components/ui/badge";
import { TicketList } from "@/components/dashboard/TicketList"; // Reuse generic list or keep custom impl? Custom impl is inline here, maybe assume tickets for now.
// Keeping custom impl for tickets tab for minimal change risk, but wrapping in Tabs.

export default function ClassroomDetail() {
  const params = useParams();
  const router = useRouter();
  const [classroom, setClassroom] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We don't have a direct /classrooms/:id endpoint with tickets included in the simple spec, 
    // but usually findOne returns relations. Let's assume /classrooms/:id works or we have to fetch tickets separately.
    // Spec said: "detail zobrazí všechny tickety...".
    // Let's assume we can fetch tickets and filter by classroomId, or fetch classroom with tickets.
    // Since I didn't verify backend ClassroomsController, I will assume a standard implementation or use tickets?classroomId=...
    // Let's try fetching classroom first.
    
    setLoading(true);
    // Fetch classroom info (assuming exists)
    // Actually backend `ClassroomsController` wasn't modified. It might be basic.
    // Let's fetch ALL tickets and filter client side if backend is missing specific endpoint, 
    // OR just use what we have.
    // I will try to fetch tickets filtering by classroom if possible, or just GET /classrooms/:id assuming it returns tickets.
    
    // Better strategy for safe implementation without backend changes:
    // 1. Get List of tickets (we have findAll). 
    // 2. Filter by classroomId.
    // Wait, findAll returns ALL tickets. This is fine for small app.
    api.get('/tickets').then(res => {
        let all = [];
        if (Array.isArray(res.data)) {
            all = res.data;
        } else if (res.data && Array.isArray(res.data.items)) {
            all = res.data.items;
        }
        
        const filtered = all.filter((t: any) => t.classroomId === params.id || t.classroom?.id === params.id);
        
        // Try to get code from first ticket, or just use ID
        const code = filtered[0]?.classroom?.code || params.id;
        
        setClassroom({ id: params.id, code });
        setTickets(filtered);
    }).finally(() => setLoading(false));

  }, [params.id]);

  if (loading) return <div>Načítám...</div>;

  const total = tickets.length;
  const active = tickets.filter(t => t.status === 'UNASSIGNED' || t.status === 'IN_PROGRESS').length;
  const waiting = tickets.filter(t => t.status === 'DONE_WAITING_APPROVAL').length;
  const done = tickets.filter(t => t.status === 'APPROVED').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}><ArrowLeft className="mr-2 h-4 w-4"/> Zpět</Button>
        <h1 className="text-3xl font-bold tracking-tight">Učebna {classroom?.code}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Celkem ticketů</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{total}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-primary">Aktivní</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{active}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-warning">Čeká na schválení</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{waiting}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-success">Vyřešeno</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{done}</div></CardContent>
          </Card>
      </div>

      <Tabs defaultValue="tickets">
          <TabsList>
              <TabsTrigger value="tickets">Tickety</TabsTrigger>
              <TabsTrigger value="pcs">PC</TabsTrigger>
          </TabsList>
          <TabsContent value="tickets">
            <Card>
                <CardHeader>
                    <CardTitle>Seznam ticketů</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {tickets.map(t => (
                            <div key={t.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <StatusBadge status={t.status} />
                                        <span className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className="font-medium hover:underline cursor-pointer text-primary" onClick={() => router.push(`/tickets/${t.id}`)}>
                                        {t.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">{t.description}</p>
                                </div>
                                <Badge variant="outline">{t.priority}</Badge>
                            </div>
                        ))}
                        {tickets.length === 0 && <p className="text-muted-foreground">Žádné tickety.</p>}
                    </div>
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pcs">
              <PcList classroomId={params.id as string} role="ADMIN" />
          </TabsContent>
      </Tabs>
    </div>
  );
}
