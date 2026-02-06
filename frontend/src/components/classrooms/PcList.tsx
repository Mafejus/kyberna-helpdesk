"use client";

import { useState, useEffect, useCallback } from "react";
import { ClassroomPc, ClassroomPcService, PcProperty } from "@/services/classroomPc.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, RefreshCw, Check, X, Plus, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PcListProps {
  classroomId: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
}

export function PcList({ classroomId, role }: PcListProps) {
  const [pcs, setPcs] = useState<ClassroomPc[]>([]);
  const [properties, setProperties] = useState<PcProperty[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Property management state
  const [newPropLabel, setNewPropLabel] = useState("");
  const [newPropType, setNewPropType] = useState<'BOOLEAN'|'TEXT'>("BOOLEAN");

  const { toast } = useToast();
  
  // Permissions
  const canManageProperties = role === "ADMIN" || role === "TEACHER" || role === "STUDENT"; // Requirement: Student can manage properties
  const canManagePcs = role === "ADMIN" || role === "TEACHER" || role === "STUDENT";
  
  // Student can edit values
  const canEditValues = true; 

  const fetchData = useCallback(async () => {
    try {
        setLoading(true);
        const [pcsData, propsData] = await Promise.all([
            ClassroomPcService.getAll(classroomId),
            ClassroomPcService.getProperties(classroomId)
        ]);
        setPcs(pcsData);
        setProperties(propsData);
    } catch (error) {
        console.error("Failed to fetch PCs/Props", error);
        toast({
            variant: "destructive",
            title: "Chyba",
            description: "Nepodařilo se načíst data.",
        });
    } finally {
        setLoading(false);
    }
  }, [classroomId, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGenerate = async () => {
      try {
          await ClassroomPcService.generate(classroomId);
          toast({ title: "Hotovo", description: "PC 1-30 byly vygenerovány.", });
          fetchData();
      } catch (error) {
          toast({ variant: "destructive", title: "Chyba", description: "Nepodařilo se vygenerovat PC.", });
      }
  };

  const handleDeletePc = async (pcId: string) => {
      if (!confirm("Opravdu smazat toto PC?")) return;
      try {
          await ClassroomPcService.delete(classroomId, pcId);
          setPcs(prev => prev.filter(p => p.id !== pcId));
          toast({ title: "Smazáno", description: "PC bylo odstraněno." });
      } catch (error) {
          toast({ variant: "destructive", title: "Chyba", description: "Nepodařilo se smazat PC." });
      }
  };
  
  const handleAddPc = async () => {
      // Find highest number to auto-suggest? Or just ask user.
      // Requirement: student can add. 
      // Simple implementation: Add next number.
      // Or prompt. Let's just create "New PC" and let them rename.
      const currentCount = pcs.length;
      const nextLabel = (currentCount + 1).toString();
      
      try {
          const newPc = await ClassroomPcService.create(classroomId, { label: nextLabel });
          setPcs(prev => [...prev, { ...newPc, values: [] }]); // Optimistic add
      } catch (error) {
          toast({ variant: "destructive", title: "Chyba", description: "Nepodařilo se vytvořit PC." });
      }
  };

  const handleUpdatePcNote = async (pcId: string, note: string) => {
      try {
        await ClassroomPcService.update(classroomId, pcId, { note });
        setPcs(prev => prev.map(p => p.id === pcId ? { ...p, note } : p));
      } catch (e) {
          toast({ variant: "destructive", title: "Chyba", description: "Uložení selhalo." });
      }
  };
  
  const handleUpdatePcLabel = async (pcId: string, label: string) => {
      try {
        await ClassroomPcService.update(classroomId, pcId, { label });
        setPcs(prev => prev.map(p => p.id === pcId ? { ...p, label } : p));
      } catch (e) {
         toast({ variant: "destructive", title: "Chyba", description: "Uložení selhalo." });
      }
  };

  const handleUpdateValue = async (pcId: string, propertyId: string, valueBool?: boolean) => {
    // Optimistic
    setPcs(prev => prev.map(p => {
        if (p.id !== pcId) return p;
        const existingValIndex = p.values.findIndex(v => v.propertyId === propertyId);
        let newValues = [...p.values];
        if (existingValIndex > -1) {
            newValues[existingValIndex] = { ...newValues[existingValIndex], valueBool: valueBool ?? null };
        } else {
            // Mock ID
            newValues.push({ id: 'temp', pcId, propertyId, valueBool: valueBool ?? null, valueText: null });
        }
        return { ...p, values: newValues };
    }));

    try {
        await ClassroomPcService.updateValues(classroomId, pcId, [{ propertyId, valueBool }]);
    } catch (error) {
        toast({ variant: "destructive", title: "Chyba", description: "Uložení hodnoty selhalo." });
        fetchData(); // Revert
    }
  };

  const handleAddProperty = async () => {
      if (!newPropLabel) return;
      try {
          const key = newPropLabel.toLowerCase().replace(/\s+/g, '-');
          await ClassroomPcService.createProperty(classroomId, { 
              key, 
              label: newPropLabel, 
              type: newPropType, 
              order: properties.length + 1 
          });
          setNewPropLabel("");
          fetchData();
          toast({ title: "Přidáno", description: "Sloupec byl přidán." });
      } catch (e) {
          toast({ variant: "destructive", title: "Chyba", description: "Nepodařilo se přidat sloupec." });
      }
  };
  
  const handleDeleteProperty = async (propId: string) => {
      if (!confirm("Smazat tento sloupec a všechna data v něm?")) return;
      try {
          await ClassroomPcService.deleteProperty(classroomId, propId);
          fetchData();
      } catch (e) {
          toast({ variant: "destructive", title: "Chyba", description: "Nepodařilo se smazat sloupec." });
      }
  };

  const DynamicCell = ({ pc, property }: { pc: ClassroomPc, property: PcProperty }) => {
      const val = pc.values.find(v => v.propertyId === property.id);
      
      if (property.type === 'BOOLEAN') {
          const boolVal = val?.valueBool || false;
          
          if (!canEditValues) {
             return boolVal ? <Badge className="bg-green-600">Ano</Badge> : <Badge variant="destructive">Ne</Badge>; 
          }

          return (
            <div 
                className={`cursor-pointer px-2 py-1 rounded inline-flex items-center justify-center gap-1 border ${boolVal ? 'border-green-600 bg-green-100 text-green-800' : 'border-red-600 bg-red-100 text-red-800'}`}
                onClick={() => handleUpdateValue(pc.id, property.id, !boolVal)}
            >
                {boolVal ? <Check size={14} /> : <X size={14} />}
                <span className="text-xs font-semibold">{boolVal ? "Ano" : "Ne"}</span>
            </div>
          );
      }
      return <span>-</span>; // Text not fully impl yet per requirements focus
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-card p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-4">
             <h2 className="text-xl font-semibold">Seznam PC</h2>
             <div className="flex gap-2 text-sm text-muted-foreground">
                 <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-600 rounded-full"></span> V pořádku</span>
                 <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-600 rounded-full"></span> Chyba/Ne</span>
             </div>
        </div>
        
        <div className="flex gap-2">
            {canManageProperties && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm"><Settings className="w-4 h-4 mr-2"/> Spravovat sloupce</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Správa sloupců</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                            <div className="flex gap-2 items-end">
                                <div className="grid gap-1.5 flex-1">
                                    <Label>Název nového sloupce</Label>
                                    <Input value={newPropLabel} onChange={e => setNewPropLabel(e.target.value)} placeholder="Např. Antivirus" />
                                </div>
                                <div className="grid gap-1.5 w-[120px]">
                                    <Label>Typ</Label>
                                    <Select value={newPropType} onValueChange={(v:any) => setNewPropType(v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BOOLEAN">Ano/Ne</SelectItem>
                                            {/* TEXT omitted for simplicity unless requested */}
                                            <SelectItem value="TEXT">Text</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleAddProperty}><Plus className="w-4 h-4"/></Button>
                            </div>
                            <div className="border rounded p-2 space-y-2 max-h-[300px] overflow-auto">
                                {properties.map(p => (
                                    <div key={p.id} className="flex justify-between items-center p-2 bg-secondary/50 rounded">
                                        <span>{p.label} <span className="text-xs text-muted-foreground">({p.type})</span></span>
                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteProperty(p.id)}><Trash2 className="w-4 h-4 text-destructive"/></Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            
            {(role === 'ADMIN' || role === 'TEACHER' || role === 'STUDENT') && (
                 <Button variant="outline" size="sm" onClick={handleGenerate} disabled={pcs.length > 0}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Gen. 1-30
                </Button>
            )}
            
            {canManagePcs && (
                 <Button size="sm" onClick={handleAddPc}>
                    <Plus className="mr-2 h-4 w-4" /> Přidat PC
                </Button>
            )}
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">PC</TableHead>
              {properties.map(p => (
                  <TableHead key={p.id} className="text-center min-w-[100px]">{p.label}</TableHead>
              ))}
              <TableHead>Jiné / Poznámka</TableHead>
              {canManagePcs && <TableHead className="w-[50px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow><TableCell colSpan={properties.length + 3} className="text-center py-8">Načítání...</TableCell></TableRow>
            ) : pcs.length === 0 ? (
                <TableRow><TableCell colSpan={properties.length + 3} className="text-center py-8 text-muted-foreground">Žádné PC.</TableCell></TableRow>
            ) : (
                pcs.map((pc) => (
                    <TableRow key={pc.id}>
                        <TableCell className="font-medium p-2">
                             <Input 
                                className="h-7 w-16 px-1 text-center" 
                                defaultValue={pc.label} 
                                onBlur={(e) => handleUpdatePcLabel(pc.id, e.target.value)}
                                disabled={!canManagePcs}
                            />
                        </TableCell>
                        
                        {properties.map(p => (
                            <TableCell key={p.id} className="text-center p-2">
                                <DynamicCell pc={pc} property={p} />
                            </TableCell>
                        ))}
                        
                        <TableCell className="p-2">
                            <Input 
                                defaultValue={pc.note || ""} 
                                className="h-8 w-full min-w-[150px]" 
                                onBlur={(e) => handleUpdatePcNote(pc.id, e.target.value)}
                                disabled={!canManagePcs}
                                placeholder="Poznámka..."
                            />
                        </TableCell>
                        
                        {canManagePcs && (
                            <TableCell className="p-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeletePc(pc.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        )}
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
