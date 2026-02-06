"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCheck, MailOpen, AlertCircle, Loader2 } from "lucide-react";
import { NotificationService } from "@/services/notification.service";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await NotificationService.getAll();
      setNotifications(data);
    } catch (e) {
      toast({ variant: "destructive", title: "Chyba načítání", description: "Nepodařilo se načíst notifikace." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await NotificationService.markRead(id);
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, readAt: new Date().toISOString() } : n));
    } catch (e) {
      toast({ variant: "destructive", title: "Chyba" });
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await NotificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date().toISOString() })));
      toast({ title: "Vše označeno jako přečtené" });
    } catch (e) {
      toast({ variant: "destructive", title: "Chyba" });
    }
  };

  const unreadCount = notifications.filter(n => !n.readAt).length;

  if (loading) {
     return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifikace</h1>
          <p className="text-muted-foreground">Přehled všech vašich upozornění.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" /> Označit vše jako přečtené
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {notifications.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
               <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
               <p className="text-lg font-medium text-muted-foreground">Nemáte žádné notifikace.</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((n) => (
            <Card key={n.id} className={`transition-colors ${!n.readAt ? 'border-primary/50 bg-primary/5' : 'bg-card'}`}>
              <CardContent className="p-4 flex gap-4 items-start">
                  <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!n.readAt ? 'bg-primary' : 'bg-transparent'}`} />
                  
                  <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                          <h4 className={`text-sm font-semibold ${!n.readAt ? 'text-foreground' : 'text-muted-foreground'}`}>
                             {n.title}
                          </h4>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                             {new Date(n.createdAt).toLocaleString()}
                          </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{n.body}</p>
                      
                      {n.linkUrl && (
                          <div className="pt-2">
                             <Link href={n.linkUrl.replace('/dashboard/tickets/', '/tickets/')}>
                                <Button variant="link" className="p-0 h-auto font-semibold">Otevřít detail &rarr;</Button>
                             </Link>
                          </div>
                      )}
                  </div>

                  {!n.readAt && (
                      <Button variant="ghost" size="icon" onClick={() => handleMarkRead(n.id)} title="Označit jako přečtené">
                          <MailOpen className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </Button>
                  )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
