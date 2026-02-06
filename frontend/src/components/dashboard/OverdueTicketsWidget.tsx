"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Added Button import
import { AlertTriangle, Clock } from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export function OverdueTicketsWidget() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // We need to fetch all active tickets and filter relevant ones or add a backend filter
    // For now, let's fetch all (or IN_PROGRESS/UNASSIGNED) and filter client side for 'dueAt < now'
    // A better backend query would be `?overdue=true`
    api.get('/tickets').then(res => {
        const now = Date.now();
        let allTickets = [];
        if (Array.isArray(res.data)) {
            allTickets = res.data;
        } else if (res.data && Array.isArray(res.data.items)) {
            allTickets = res.data.items;
        }
        
        const overdue = allTickets.filter((t: any) => 
            t.status !== 'APPROVED' && 
            t.status !== 'REJECTED' && 
            t.dueAt && 
            new Date(t.dueAt).getTime() < now
        );
        setTickets(overdue);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-sm text-muted-foreground">Načítám...</div>;

  return (
    <Card className="h-full border-destructive/50 bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Po termínu ({tickets.length})
        </CardTitle>
        <CardDescription>Tickety, které měly být již vyřešeny.</CardDescription>
      </CardHeader>
      <CardContent>
        {tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-muted-foreground opacity-70">
                <Clock className="h-10 w-10 mb-2 text-muted" />
                <p>Vše v pořádku!</p>
            </div>
        ) : (
            <div className="space-y-3">
                {tickets.slice(0, 5).map(t => (
                    <div key={t.id} className="flex justify-between items-center p-2 bg-background/50 rounded border cursor-pointer hover:bg-background" onClick={() => router.push(`/tickets/${t.id}`)}>
                        <div className="flex flex-col">
                            <span className="font-medium truncate max-w-[150px]">{t.title}</span>
                            <span className="text-xs text-destructive font-semibold">
                                {format(new Date(t.dueAt), 'd.M.yyyy')}
                            </span>
                        </div>
                        <Badge variant="outline">{t.classroom.code}</Badge>
                    </div>
                ))}
                {tickets.length > 5 && (
                    <Button variant="link" className="w-full text-xs" onClick={() => router.push('/tickets')}>
                        Zobrazit dalších {tickets.length - 5}...
                    </Button>
                )}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
