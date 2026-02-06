"use client";

import { useEffect, useState } from "react";
import { AuditService } from "@/services/audit.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, User, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AuditTimelineProps {
  ticketId: string;
}

export function AuditTimeline({ ticketId }: AuditTimelineProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await AuditService.getLogs({
          entityType: 'TICKET',
          entityId: ticketId,
          limit: 50 // Show last 50 actions
        });
        // Handle if data is array or object with data property
        const list = Array.isArray(data) ? data : data.data || [];
        setLogs(list);
      } catch (e) {
        console.error("Failed to load audit logs", e);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [ticketId]);

  if (loading) {
     return <Skeleton className="h-[200px] w-full" />;
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                <History className="h-4 w-4"/> Historie změn
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">Žádné záznamy v historii.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4"/> Historie změn
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative border-l ml-2 space-y-6">
          {logs.map((log) => (
            <div key={log.id} className="mb-4 ml-6 relative">
              <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-background ring-2 ring-muted top-0">
                <Activity className="h-3 w-3 text-muted-foreground" />
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <h3 className="text-sm font-medium leading-none">{formatAction(log.action)}</h3>
                  <time className="mb-1 text-xs text-muted-foreground font-mono">
                    {new Date(log.createdAt).toLocaleString()}
                  </time>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-semibold text-foreground">{log.actorName}</span>
                {log.message && ` - ${log.message}`}
              </p>
              
              {/* Optional: Diff info */}
              {log.before && log.after && (
                 <div className="mt-2 text-xs bg-muted/50 p-2 rounded font-mono">
                     {Object.keys(log.after).map(key => (
                         <div key={key} className="flex gap-2">
                             <span className="text-muted-foreground">{key}:</span>
                             <span className="line-through opacity-70">{String(log.before[key])}</span>
                             <span>&rarr;</span>
                             <span className="font-semibold">{String(log.after[key])}</span>
                         </div>
                     ))}
                 </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function formatAction(action: string) {
    // Simple mapper or just return pretty string
    return action.replace(/_/g, ' ');
}
