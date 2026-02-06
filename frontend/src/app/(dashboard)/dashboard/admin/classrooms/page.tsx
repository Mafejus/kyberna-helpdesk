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
  const [code, setCode] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'ADMIN';

  const fetchClassrooms = () => api.get('/classrooms').then(res => setClassrooms(res.data));
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
          {classrooms.map(c => (
              <Card key={c.id} className="hover:bg-accent/50 transition-colors">
                  <CardContent className="flex items-center justify-between p-4">
                      {/* For Students, we link to the detail page. Path is specific for admin but page logic is generic? 
                          Wait, the detail link was `/dashboard/admin/classrooms/${c.id}` in original code.
                          But detail page is at `src/app/(dashboard)/dashboard/classrooms/[id]/page.tsx`??
                          No, I checked listing of `.../dashboard/classrooms/[id]`.
                          But the link in original file was `/dashboard/admin/classrooms/${c.id}`.
                          This suggests the file generic one I saw earlier `src/app/(dashboard)/dashboard/classrooms/[id]/page.tsx` 
                          might be ACCESSIBLE via `/dashboard/classrooms/:id` URL. 
                          The admin link probably went to a DIFFERENT page or the same one if routed?
                          
                          I see `(dashboard)/dashboard/admin/classrooms/page.tsx` (this file).
                          And `(dashboard)/dashboard/classrooms/[id]/page.tsx`.
                          
                          If I verify the file structure again:
                          `src/app/(dashboard)/dashboard/admin/classrooms/page.tsx` -> /dashboard/admin/classrooms
                          `src/app/(dashboard)/dashboard/classrooms/[id]/page.tsx` -> /dashboard/classrooms/:id (Generic?)
                          
                          The link previously was `href={/dashboard/admin/classrooms/${c.id}}`. 
                          If I point to `/dashboard/classrooms/${c.id}` it should use the generic page.
                          Let's try pointing to generic page. All roles should use it.
                      */}
                      
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
