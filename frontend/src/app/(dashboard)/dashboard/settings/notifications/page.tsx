"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"; // Assuming this exists or similar
import api from "@/lib/api"; // Assuming axios instance
import { Loader2 } from "lucide-react";

// Types
enum NotificationType {
  TICKET_APPROVED = 'TICKET_APPROVED',
  TICKET_RETURNED = 'TICKET_RETURNED',
  TICKET_PRIORITY_CHANGED = 'TICKET_PRIORITY_CHANGED',
  TICKET_DUE_DATE_CHANGED = 'TICKET_DUE_DATE_CHANGED',
  TICKET_ASSIGNED = 'TICKET_ASSIGNED',
  TICKET_UNASSIGNED = 'TICKET_UNASSIGNED',
  TICKET_WAITING_APPROVAL = 'TICKET_WAITING_APPROVAL',
  
  // SLOT_CHANGED_BY_ADMIN = 'SLOT_CHANGED_BY_ADMIN', // Not listed in user groups but exists
  // SLOT_CANCELLED_LATE = 'SLOT_CANCELLED_LATE',
  
  SWAP_OFFER_CREATED = 'SWAP_OFFER_CREATED',
  SWAP_OFFER_ACCEPTED = 'SWAP_OFFER_ACCEPTED',
  SWAP_OFFER_CANCELLED = 'SWAP_OFFER_CANCELLED',
}

const GROUPS = [
  {
    title: "Tickety",
    items: [
      { type: NotificationType.TICKET_ASSIGNED, label: "Přidělení k ticketu", desc: "Když jsi přidán(a) jako řešitel." },
      { type: NotificationType.TICKET_UNASSIGNED, label: "Odebrání z ticketu", desc: "Když jsi odebrán(a) z ticketu." },
      { type: NotificationType.TICKET_APPROVED, label: "Schválení ticketu", desc: "Když je ticket schválen (+ body)." },
      { type: NotificationType.TICKET_RETURNED, label: "Vrácení ticketu", desc: "Když je ticket vrácen k dopracování." },
      { type: NotificationType.TICKET_WAITING_APPROVAL, label: "Odevzdáno ke kontrole", desc: "Když student odevzdá ticket." },
    ]
  },
  {
    title: "Termíny a Priorita",
    items: [
      { type: NotificationType.TICKET_PRIORITY_CHANGED, label: "Změna priority", desc: "Když se změní priorita ticketu." },
      { type: NotificationType.TICKET_DUE_DATE_CHANGED, label: "Změna termínu", desc: "Když se změní deadline." },
    ]
  },
  {
    title: "Služby a Plánování",
    items: [
      { type: NotificationType.SWAP_OFFER_CREATED, label: "Nová nabídka výměny", desc: "Když někdo nabízí výměnu směny." },
      { type: NotificationType.SWAP_OFFER_ACCEPTED, label: "Výměna přijata", desc: "Když je nabídka výměny přijata (tvá nebo tebou)." },
      { type: NotificationType.SWAP_OFFER_CANCELLED, label: "Výměna zrušena", desc: "Když je nabídka zrušena." },
    ]
  }
];

export default function NotificationSettingsPage() {
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});
  const [availableTypes, setAvailableTypes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const res = await api.get('/notification-preferences/me');
      // Backend returns array: [{ type, enabled }, ...] strictly filtered by role
      const data = res.data; 
      
      const prefMap: Record<string, boolean> = {};
      const typeSet = new Set<string>();

      if (Array.isArray(data)) {
        data.forEach((p: { type: string, enabled: boolean }) => {
            prefMap[p.type] = p.enabled;
            typeSet.add(p.type);
        });
      }

      setPreferences(prefMap);
      setAvailableTypes(typeSet);
    } catch (error) {
      console.error(error);
      toast({ title: "Chyba načítání nastavení", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (type: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [type]: checked
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Backend expects array of updates
      // We can send only changed, or all available. Sending all available is safer/easier.
      const payload = Array.from(availableTypes).map(type => ({
          type,
          enabled: preferences[type] ?? true // Default to true if somehow missing
      }));

      await api.patch('/notification-preferences/me', payload);
      toast({ title: "Nastavení uloženo", description: "Vaše preference byly aktualizovány." });
    } catch (error) {
      console.error(error);
      toast({ title: "Chyba ukládání", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
     return <div className="flex justify-center p-10"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  // Filter groups
  const visibleGroups = GROUPS.map(group => ({
      ...group,
      items: group.items.filter(item => availableTypes.has(item.type))
  })).filter(group => group.items.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Nastavení notifikací</h2>
            <p className="text-muted-foreground">Vyberte, které upozornění chcete dostávat.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Uložit změny
        </Button>
      </div>

      <div className="grid gap-6">
        {visibleGroups.length === 0 ? (
            <p className="text-muted-foreground">Pro vaši roli nejsou k dispozici žádná nastavení notifikací.</p>
        ) : (
            visibleGroups.map((group, i) => (
            <Card key={i}>
                <CardHeader className="pb-2">
                <CardTitle className="text-lg">{group.title}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 pt-4">
                {group.items.map((item) => {
                    const isChecked = preferences[item.type] !== false; 
                    
                    return (
                    <div key={item.type} className="flex items-center justify-between space-x-4 border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex-1 space-y-1">
                        <Label htmlFor={item.type} className="text-base font-medium leading-none cursor-pointer">
                            {item.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            {item.desc}
                        </p>
                        </div>
                        <Switch
                        id={item.type}
                        checked={isChecked}
                        onCheckedChange={(checked) => handleToggle(item.type, checked)}
                        />
                    </div>
                    );
                })}
                </CardContent>
            </Card>
            ))
        )}
      </div>
    </div>
  );
}
