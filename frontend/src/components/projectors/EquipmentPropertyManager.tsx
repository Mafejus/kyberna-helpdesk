"use client";

import { useState } from "react";
import { EquipmentPropertyDef, EquipmentType, CreatePropertyData, ProjectorService } from "@/services/projector.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Trash2, Plus, Loader2 } from "lucide-react";

interface EquipmentPropertyManagerProps {
  equipmentType: EquipmentType;
  properties: EquipmentPropertyDef[];
  onChanged: () => void;
}

export function EquipmentPropertyManager({ equipmentType, properties, onChanged }: EquipmentPropertyManagerProps) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [type, setType] = useState<"BOOLEAN" | "TEXT">("BOOLEAN");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!label.trim()) return;
    setSaving(true);
    try {
      const key = label.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const data: CreatePropertyData = {
        equipmentType,
        key,
        label: label.trim(),
        type,
        order: properties.length + 1,
      };
      await ProjectorService.createProperty(data);
      setLabel("");
      setType("BOOLEAN");
      onChanged();
    } catch (err) {
      console.error("Failed to create property", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Smazat tento sloupec a všechna jeho data?")) return;
    setDeletingId(id);
    try {
      await ProjectorService.deleteProperty(id);
      onChanged();
    } catch (err) {
      console.error("Failed to delete property", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Spravovat vlastní sloupce">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Vlastní sloupce</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Existing properties */}
          {properties.length === 0 ? (
            <p className="text-sm text-muted-foreground">Žádné vlastní sloupce.</p>
          ) : (
            <ul className="space-y-2">
              {properties.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                  <div>
                    <span className="font-medium text-sm">{p.label}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {p.type === "BOOLEAN" ? "Ano/Ne" : "Text"}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive h-7 w-7"
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                  >
                    {deletingId === p.id
                      ? <Loader2 className="h-3 w-3 animate-spin" />
                      : <Trash2 className="h-3 w-3" />}
                  </Button>
                </li>
              ))}
            </ul>
          )}

          {/* Add new property */}
          <div className="border-t pt-4 space-y-3">
            <p className="text-sm font-medium">Přidat sloupec</p>
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="prop-label" className="text-xs">Název</Label>
                <Input
                  id="prop-label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="např. Je potřeba vyměnit"
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Typ</Label>
                <Select value={type} onValueChange={(v) => setType(v as "BOOLEAN" | "TEXT")}>
                  <SelectTrigger className="w-[110px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BOOLEAN">Ano/Ne</SelectItem>
                    <SelectItem value="TEXT">Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAdd} disabled={saving || !label.trim()} className="w-full">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Přidat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
