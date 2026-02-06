"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Trash, Edit, Key, MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ email: "", fullName: "", role: "STUDENT", password: "Password123!" });
  const { toast } = useToast();

  // Edit States
  const [editingUser, setEditingUser] = useState<any>(null);
  const [resettingUser, setResettingUser] = useState<any>(null);
  
  // Form States
  const [editForm, setEditForm] = useState({ fullName: "", email: "" });
  const [passwordForm, setPasswordForm] = useState("");

  const fetchUsers = () => api.get('/users').then(res => setUsers(res.data));
  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async () => {
    try {
        await api.post('/users', newUser);
        toast({ title: "Uživatel vytvořen" });
        fetchUsers();
        setNewUser({ email: "", fullName: "", role: "STUDENT", password: "Password123!" });
    } catch (err: any) {
        toast({ title: "Chyba", description: err.response?.data?.message, variant: "destructive" });
    }
  };

  const handleUpdateProfile = async () => {
      if (!editingUser) return;
      try {
          await api.patch(`/users/${editingUser.id}`, editForm);
          toast({ title: "Upraveno" });
          fetchUsers();
          setEditingUser(null);
      } catch (e) {
          toast({ title: "Chyba", variant: "destructive" });
      }
  };

  const handleResetPassword = async () => {
      if (!resettingUser) return;
      try {
          await api.patch(`/users/${resettingUser.id}/password`, { password: passwordForm });
          toast({ title: "Heslo změněno" });
          setPasswordForm("");
          setResettingUser(null);
      } catch (e: any) {
          toast({ title: "Chyba", description: e.response?.data?.message || "Min. 6 znaků", variant: "destructive" });
      }
  };

  const handleDelete = async (id: string) => {
      if (!confirm("Smazat?")) return;
      try {
          await api.delete(`/users/${id}`);
          toast({ title: "Smazáno" });
          fetchUsers();
      } catch (err) {
          toast({ title: "Chyba", variant: "destructive" });
      }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Správa uživatelů</h1>
      
      {/* Create User Card */}
      <Card>
          <CardHeader>
              <CardTitle>Nový uživatel</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-5 items-end">
               <div className="grid gap-2">
                   <Label>Jméno</Label>
                   <Input value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})} placeholder="Jan Novák" />
               </div>
               <div className="grid gap-2">
                   <Label>Email</Label>
                   <Input value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="jan@ssakhk.cz" />
               </div>
               <div className="grid gap-2">
                   <Label>Role</Label>
                   <select className="flex h-10 w-full rounded-md border bg-background px-3 text-sm ring-offset-background" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                       <option value="STUDENT">STUDENT</option>
                       <option value="TEACHER">TEACHER</option>
                       <option value="ADMIN">ADMIN</option>
                   </select>
               </div>
               <div className="grid gap-2">
                   <Label>Heslo</Label>
                   <Input value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
               </div>
               <Button onClick={handleCreate}>Vytvořit</Button>
          </CardContent>
      </Card>

      {/* Users List */}
      <div className="bg-card border rounded-lg">
          {users.map(u => (
              <div key={u.id} className="flex items-center justify-between border-b last:border-0 p-4 hover:bg-muted/50 transition-colors">
                  <div className="space-y-1">
                      <p className="font-semibold">{u.fullName}</p>
                      <p className="text-sm text-muted-foreground">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                      <Badge variant={u.role === 'ADMIN' ? 'destructive' : (u.role === 'TEACHER' ? 'default' : 'secondary')}>{u.role}</Badge>
                      
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4"/></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Akce</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => { setEditingUser(u); setEditForm({ fullName: u.fullName, email: u.email }); }}>
                                  <Edit className="mr-2 h-4 w-4" /> Upravit údaje
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setResettingUser(u); setPasswordForm(""); }}>
                                  <Key className="mr-2 h-4 w-4" /> Reset hesla
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(u.id)}>
                                  <Trash className="mr-2 h-4 w-4" /> Smazat
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                  </div>
              </div>
          ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Upravit uživatele</DialogTitle>
                  <DialogDescription>Role nelze měnit.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                  <div className="space-y-2">
                      <Label>Jméno</Label>
                      <Input value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} />
                  </div>
                  <Button onClick={handleUpdateProfile} className="w-full">Uložit změny</Button>
              </div>
          </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={!!resettingUser} onOpenChange={(open) => !open && setResettingUser(null)}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Reset hesla</DialogTitle>
                  <DialogDescription>Nastavte nové heslo pro {resettingUser?.fullName}.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                  <div className="space-y-2">
                      <Label>Nové heslo</Label>
                      <Input type="password" value={passwordForm} onChange={e => setPasswordForm(e.target.value)} placeholder="Min. 6 znaků" />
                  </div>
                  <Button onClick={handleResetPassword} className="w-full" disabled={passwordForm.length < 6}>Změnit heslo</Button>
              </div>
          </DialogContent>
      </Dialog>
    </div>
  );
}
