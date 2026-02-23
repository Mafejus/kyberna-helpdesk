"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Trash } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'ADMIN';

  const fetchClassrooms = () => {
    setLoading(true);
    api.get('/classrooms').then(res => setClassrooms(res.data)).finally(() => setLoading(false));
  };
  useEffect(() => { fetchClassrooms(); }, []);

  const handleCreate = async () => {
    try {
        await api.post('/classrooms', { code });
        toast({ title: "Třída vytvořena" });
        fetchClassrooms();
        setCode("");
    } catch (err: any) {
        toast({ title: "Chyba", description: err.response?.data?.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
      if (!confirm("Smazat?")) return;
      try {
          await api.delete(`/classrooms/${id}`);
          toast({ title: "Smazáno" });
          fetchClassrooms();
      } catch (err) {
          toast({ title: "Chyba", variant: "destructive" });
      }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Přehled tříd</h1>
      
      {isAdmin && (
          <Card>
              <CardContent className="flex items-end gap-2 p-4">
                   <div className="grid gap-2">
                       <p className="text-sm font-medium">Kód třídy</p>
                       <Input value={code} onChange={e => setCode(e.target.value)} placeholder="Např. 101" />
                   </div>
                   <Button onClick={handleCreate}>Vytvořit</Button>
              </CardContent>
          </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="flex items-center p-4">
                  <div className="h-7 w-16 rounded bg-muted" />
                </CardContent>
              </Card>
            ))
          ) : classrooms.length === 0 ? (
            <p className="text-muted-foreground col-span-full">(Žádné třídy)</p>
          ) : classrooms.map(c => (
              <Card key={c.id} className="hover:bg-accent/50 transition-colors">
                  <CardContent className="flex items-center justify-between p-4">
                      <Link href={`/dashboard/classrooms/${c.id}`} className="flex-1">
                          <span className="text-xl font-bold">{c.code}</span>
                      </Link>
                      {isAdmin && (
                          <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); handleDelete(c.id); }} className="text-destructive">
                              <Trash className="h-4 w-4" />
                          </Button>
                      )}
                  </CardContent>
              </Card>
          ))}
      </div>
    </div>
  );
}
