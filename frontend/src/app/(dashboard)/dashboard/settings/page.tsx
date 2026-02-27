"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const [retentionDays, setRetentionDays] = useState<number>(30);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      api.get('/settings/retention')
        .then(res => setRetentionDays(res.data.days))
        .catch(err => {
          if (err.response?.status !== 403) {
             toast({ title: "Chyba načítání nastavení", variant: "destructive" });
          }
        });
    }
  }, [user, toast]);

  const handleSaveRetention = async () => {
    try {
      await api.patch('/settings/retention', { days: retentionDays });
      toast({ title: "Nastavení uloženo" });
    } catch (e) {
      toast({ title: "Chyba při ukládání", variant: "destructive" });
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Nastavení</h1>
            <p className="text-muted-foreground">Pro přístup k tomuto nastavení musíte být administrátor.</p>
        </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold">Systémová nastavení</h1>
      
      <Card>
          <CardHeader>
              <CardTitle>Archivace starých ticketů</CardTitle>
              <CardDescription>
                  Nastavte počet dní, po kterých se schválené (APPROVED) tickety automaticky zarchivují a zmizí z hlavních přehledů. (Výchozí hodnota: 30)
              </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
               <div className="grid gap-2">
                   <label className="text-sm font-medium leading-none">
                       Doba smazání schválených ticketů (ve dnech)
                   </label>
                   <div className="flex gap-2 max-w-sm">
                       <Input 
                           type="number" 
                           min="1" 
                           value={retentionDays} 
                           onChange={e => setRetentionDays(parseInt(e.target.value) || 30)} 
                       />
                       <Button onClick={handleSaveRetention}>Uložit</Button>
                   </div>
               </div>
          </CardContent>
      </Card>
    </div>
  );
}
