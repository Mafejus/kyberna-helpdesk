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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const { toast } = useToast();

  const [editingWO, setEditingWO] = useState<any>(null);
  const [editForm, setEditForm] = useState({ department: "", payer: "", material: "", timeSpent: 0, signature: "" });
  
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
      await api.post("/work-orders/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
      department: wo.department || "",
      payer: wo.payer || "",
      material: wo.material || "",
      timeSpent: wo.timeSpent || 0,
      signature: wo.signature || "",
    });
  };

  const handleUpdate = async () => {
    if (!editingWO) return;
    try {
      await api.patch(`/work-orders/${editingWO.id}`, {
          ...editForm,
          timeSpent: Number(editForm.timeSpent)
      });
      toast({ title: "Výkaz upraven" });
      fetchWorkOrders();
      setEditingWO(null);
    } catch (e) {
      toast({ title: "Chyba při úpravě", variant: "destructive" });
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
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted text-muted-foreground border-b">
            <tr>
              <th className="px-4 py-3">Datum / Zadal</th>
              <th className="px-4 py-3">Předmět práce</th>
              <th className="px-4 py-3">Oddělení</th>
              <th className="px-4 py-3">Plátce</th>
              <th className="px-4 py-3">Materiál</th>
              <th className="px-4 py-3">Čas (h)</th>
              <th className="px-4 py-3">Podpis</th>
              <th className="px-4 py-3 text-right">Akce</th>
            </tr>
          </thead>
          <tbody>
            {workOrders.map(wo => (
              <tr key={wo.id} className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-4 py-3">
                  <div className="font-semibold">{new Date(wo.ticket?.createdAt).toLocaleDateString("cs-CZ")}</div>
                  <div className="text-xs text-muted-foreground">{wo.ticket?.createdBy?.fullName}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{wo.ticket?.title}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[200px]">{wo.ticket?.description}</div>
                </td>
                <td className="px-4 py-3">{wo.department || "-"}</td>
                <td className="px-4 py-3">{wo.payer || "-"}</td>
                <td className="px-4 py-3 truncate max-w-[150px]">{wo.material || "-"}</td>
                <td className="px-4 py-3">{wo.timeSpent || "0"}</td>
                <td className="px-4 py-3">{wo.signature || "-"}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(wo)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {workOrders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  Žádné výkazy práce nebyly nalezeny.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editingWO} onOpenChange={(open) => !open && setEditingWO(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upravit výkaz</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Oddělení</Label>
              <Input value={editForm.department} onChange={e => setEditForm({...editForm, department: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Kdo to bude platit</Label>
              <Input value={editForm.payer} onChange={e => setEditForm({...editForm, payer: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Materiál</Label>
              <Input value={editForm.material} onChange={e => setEditForm({...editForm, material: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Čas (v hodinách)</Label>
              <Input type="number" step="0.5" value={editForm.timeSpent} onChange={e => setEditForm({...editForm, timeSpent: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label>Podpis</Label>
              <Input value={editForm.signature} onChange={e => setEditForm({...editForm, signature: e.target.value})} />
            </div>
            <Button onClick={handleUpdate} className="w-full">Uložit změny</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
