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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [techFilter, setTechFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

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

  const uniqueTechnicians = Array.from(new Set(workOrders.map((wo) => wo.technician || "Bez technika"))).filter(Boolean);
  const uniqueStatuses = Array.from(new Set(workOrders.map((wo) => wo.status || "Bez statusu"))).filter(Boolean);

  const filteredWorkOrders = workOrders.filter((wo) => {
    // Global filter matches title or problemDescription
    const matchesGlobal =
      globalFilter === "" ||
      (wo.title || "").toLowerCase().includes(globalFilter.toLowerCase()) ||
      (wo.problemDescription || "").toLowerCase().includes(globalFilter.toLowerCase());

    const tech = wo.technician || "Bez technika";
    const matchesTech = techFilter === "ALL" || tech === techFilter;

    const status = wo.status || "Bez statusu";
    const matchesStatus = statusFilter === "ALL" || status === statusFilter;

    return matchesGlobal && matchesTech && matchesStatus;
  });

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
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input 
          placeholder="Hledat podle názvu nebo popisu..." 
          value={globalFilter} 
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <Select value={techFilter} onValueChange={setTechFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Technik" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Všichni technici</SelectItem>
            {uniqueTechnicians.map(tech => (
              <SelectItem key={tech} value={tech}>{tech}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Všechny statusy</SelectItem>
            {uniqueStatuses.map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
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
            {filteredWorkOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">Zatím žádné výkazy práce pro zadané filtry.</TableCell>
              </TableRow>
            ) : (
              filteredWorkOrders.map(wo => (
                <TableRow key={wo.id}>
                  <TableCell className="font-semibold">{wo.orderNumber ? `#${wo.orderNumber}` : "-"}</TableCell>
                  <TableCell className="font-medium whitespace-pre-wrap min-w-[150px]">{wo.title || "-"}</TableCell>
                  <TableCell className="whitespace-pre-wrap">{wo.technician || "-"}</TableCell>
                  <TableCell className="whitespace-pre-wrap">{wo.date || "-"}</TableCell>
                  <TableCell className="whitespace-pre-wrap min-w-[200px]">{wo.problemDescription || "-"}</TableCell>
                  <TableCell className="whitespace-pre-wrap min-w-[200px]">{wo.resolution || "-"}</TableCell>
                  <TableCell>{wo.status || "-"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {wo.ticketId && (
                      <Button variant="ghost" size="sm" onClick={() => window.location.href = `/dashboard/tickets/${wo.ticketId}`} title="Zobrazit Ticket">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778"/>
                        </svg>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => openEdit(wo)} title="Upravit Výkaz">
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
