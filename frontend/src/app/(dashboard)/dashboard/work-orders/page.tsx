"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { FileDown, Edit, UploadCloud, Trash } from "lucide-react";
import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const { toast } = useToast();

  const [editingWO, setEditingWO] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    technician: "",
    date: "",
    problemDescription: "",
    resolution: "",
    status: "",
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchWorkOrders = () => api.get('/work-orders').then(res => setWorkOrders(res.data));
  useEffect(() => { fetchWorkOrders(); }, []);

  const handleExport = async () => {
    try {
      const res = await api.get('/work-orders/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'vykazy-prace.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast({ title: "Chyba při exportu", variant: "destructive" });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/work-orders/import", formData);
      toast({ title: "Import úspěšný", description: "Záznamy byly úspěšně naimportovány." });
      fetchWorkOrders();
    } catch (err: any) {
      toast({ title: "Chyba při importu", description: err.response?.data?.message || err.message, variant: "destructive" });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Opravdu chcete smazat VŠECHNY výkazy práce? Tato akce je nevratná.")) return;
    try {
      await api.delete("/work-orders");
      toast({ title: "Smazáno", description: "Všechny výkazy byly odstraněny." });
      fetchWorkOrders();
    } catch (err: any) {
      toast({ title: "Chyba", description: "Nepodařilo se smazat výkazy.", variant: "destructive" });
    }
  };

  const openEdit = (wo: any) => {
    setEditingWO(wo);
    setEditForm({
      title: wo.title || "",
      technician: wo.technician || "",
      date: wo.date || "",
      problemDescription: wo.problemDescription || "",
      resolution: wo.resolution || "",
      status: wo.status || "",
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingWO) return;
    try {
      await api.patch(`/work-orders/${editingWO.id}`, editForm);
      toast({ title: "Uloženo", description: "Změny byly úspěšně uloženy." });
      setEditDialogOpen(false);
      fetchWorkOrders();
    } catch (err) {
      toast({ title: "Chyba", description: "Nepodařilo se uložit změny.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Výkazy práce</h1>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImport}
          />
          <Button onClick={() => fileInputRef.current?.click()} variant="outline">
            <UploadCloud className="mr-2 h-4 w-4" /> Importovat z CSV
          </Button>
          <Button onClick={handleExport} variant="outline">
            <FileDown className="mr-2 h-4 w-4" /> Stáhnout Excel
          </Button>
          <Button onClick={handleDeleteAll} variant="destructive">
            <Trash className="mr-2 h-4 w-4" /> Smazat vše
          </Button>
        </div>
      </div>
      
      <div className="bg-card border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Název / Typ práce</TableHead>
              <TableHead>Technik</TableHead>
              <TableHead>Datum a čas</TableHead>
              <TableHead>Popis problému</TableHead>
              <TableHead>Řešení</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Akce</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">Zatím žádné výkazy práce.</TableCell>
              </TableRow>
            ) : (
              workOrders.map(wo => (
                <TableRow key={wo.id}>
                  <TableCell className="font-medium">{wo.title || "-"}</TableCell>
                  <TableCell>{wo.technician || "-"}</TableCell>
                  <TableCell>{wo.date || "-"}</TableCell>
                  <TableCell className="max-w-xs truncate" title={wo.problemDescription}>{wo.problemDescription || "-"}</TableCell>
                  <TableCell className="max-w-xs truncate" title={wo.resolution}>{wo.resolution || "-"}</TableCell>
                  <TableCell>{wo.status || "-"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(wo)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upravit výkaz práce</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Název / Typ práce</label>
              <Input 
                value={editForm.title} 
                onChange={(e) => setEditForm({...editForm, title: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Technik</label>
              <Input 
                value={editForm.technician} 
                onChange={(e) => setEditForm({...editForm, technician: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Datum a čas</label>
              <Input 
                value={editForm.date} 
                onChange={(e) => setEditForm({...editForm, date: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Popis problému</label>
              <Input 
                value={editForm.problemDescription} 
                onChange={(e) => setEditForm({...editForm, problemDescription: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Řešení</label>
              <Input 
                value={editForm.resolution} 
                onChange={(e) => setEditForm({...editForm, resolution: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Input 
                value={editForm.status} 
                onChange={(e) => setEditForm({...editForm, status: e.target.value})} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Zrušit</Button>
            <Button onClick={handleUpdate}>Uložit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
