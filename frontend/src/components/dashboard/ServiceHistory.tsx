"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle } from "lucide-react";

export function ServiceHistory() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
        try {
            const res = await api.get('/stats/me');
            setStats(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }
    load();
  }, []);

  if (loading) return null; // or skeleton
  if (!stats) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4"/> Historie služeb
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                <CheckCircle className="h-3 w-3 text-green-600"/>
                <span>Dokončeno: <strong className="text-foreground">{stats.completedServices}</strong></span>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datum</TableHead>
              <TableHead>Příchod</TableHead>
              <TableHead>Odchod</TableHead>
              <TableHead className="text-right">Trvání</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.recentHistory.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                        Zatím žádné záznamy.
                    </TableCell>
                </TableRow>
            ) : (
                stats.recentHistory.map((h: any) => {
                    const start = new Date(h.startedAt);
                    const end = h.endedAt ? new Date(h.endedAt) : null;
                    const durationMins = end ? Math.round((end.getTime() - start.getTime()) / 60000) : null;
                    
                    return (
                        <TableRow key={h.id}>
                            <TableCell className="font-medium">
                                {start.toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                {start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </TableCell>
                            <TableCell>
                                {end ? end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : <Badge variant="outline" className="text-yellow-600 border-yellow-400 bg-yellow-50">Aktivní</Badge>}
                            </TableCell>
                            <TableCell className="text-right font-mono text-xs">
                                {durationMins ? `${durationMins} min` : '-'}
                            </TableCell>
                        </TableRow>
                    );
                })
            )}
          </TableBody>
        </Table>
        </div>
      </CardContent>
    </Card>
  );
}
