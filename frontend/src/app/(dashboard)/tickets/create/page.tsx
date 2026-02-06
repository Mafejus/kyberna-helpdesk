"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function CreateTicketPage() {
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [formData, setFormData] = useState({ title: "", description: "", classroomId: "" });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    api.get('/classrooms').then(res => setClassrooms(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.classroomId) return toast({ title: "Vyberte třídu", variant: "destructive" });

    setLoading(true);
    try {
        // 1. Upload file (only if selected)
        let attachments: any[] = [];
        if (file) {
            const uploadForm = new FormData();
            uploadForm.append('file', file);
            const uploadRes = await api.post('/uploads', uploadForm, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            attachments = [uploadRes.data];
        }

        // 2. Create Ticket
        await api.post('/tickets', {
            ...formData,
            attachments
        });

        toast({ title: "Ticket vytvořen!" });
        
        // Redirect based on role
        if (user?.role === 'ADMIN') router.push('/dashboard/admin');
        else if (user?.role === 'TEACHER') router.push('/dashboard/teacher');
        else router.push('/dashboard/student');
        
    } catch (err) {
        console.error(err);
        toast({ title: "Chyba", description: "Nepodařilo se vytvořit ticket", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Nahlásit problém</h1>
      <Card>
          <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                      <Label>Název problému</Label>
                      <Input 
                        placeholder="Např. Nefunkční projektor" 
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        required
                      />
                  </div>
                  
                  <div className="space-y-2">
                       <Label>Třída</Label>
                       <select 
                         className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                         value={formData.classroomId}
                         onChange={e => setFormData({...formData, classroomId: e.target.value})}
                         required
                       >
                           <option value="">Vyberte třídu</option>
                           {classrooms.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
                       </select>
                  </div>

                  <div className="space-y-2">
                      <Label>Popis</Label>
                      <Textarea 
                        placeholder="Detailní popis situace..." 
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        required
                      />
                  </div>

                  <div className="space-y-2">
                      <Label>Příloha (volitelné)</Label>
                      <Input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
                  </div>

                  <div className="flex justify-end gap-2">
                      <Button variant="outline" type="button" onClick={() => router.back()}>Zrušit</Button>
                      <Button type="submit" disabled={loading}>{loading ? 'Odesílám...' : 'Vytvořit ticket'}</Button>
                  </div>
              </form>
          </CardContent>
      </Card>
    </div>
  );
}
