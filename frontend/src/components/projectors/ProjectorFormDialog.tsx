"use client";

import { useState, useEffect } from "react";
import { Projector, ProjectorService, CreateProjectorData } from "@/services/projector.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface ProjectorFormDialogProps {
  open: boolean;
  onOpenChange: () => void;
  projector: Projector | null; // null = create mode
  onSaved: () => void;
}

export function ProjectorFormDialog({
  open,
  onOpenChange,
  projector,
  onSaved,
}: ProjectorFormDialogProps) {
  const isEdit = !!projector;

  const [classroom, setClassroom] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [hasDellDock, setHasDellDock] = useState(false);
  const [isFunctional, setIsFunctional] = useState(true);
  const [hasHdmi, setHasHdmi] = useState(false);
  const [hasHdmiExtension, setHasHdmiExtension] = useState(false);
  const [usbExtensionType, setUsbExtensionType] = useState("");
  const [lampHours, setLampHours] = useState("");
  const [lastInspectionDate, setLastInspectionDate] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (projector) {
      setClassroom(projector.classroom);
      setBrand(projector.brand);
      setModel(projector.model);
      setHasDellDock(projector.hasDellDock);
      setIsFunctional(projector.isFunctional);
      setHasHdmi(projector.hasHdmi);
      setHasHdmiExtension(projector.hasHdmiExtension);
      setUsbExtensionType(projector.usbExtensionType || "");
      setLampHours(projector.lampHours || "");
      setLastInspectionDate(
        projector.lastInspectionDate
          ? projector.lastInspectionDate.split("T")[0]
          : ""
      );
      setNotes(projector.notes || "");
    } else {
      // Reset for create mode
      setClassroom("");
      setBrand("");
      setModel("");
      setHasDellDock(false);
      setIsFunctional(true);
      setHasHdmi(false);
      setHasHdmiExtension(false);
      setUsbExtensionType("");
      setLampHours("");
      setLastInspectionDate("");
      setNotes("");
    }
  }, [projector, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data: CreateProjectorData = {
      classroom,
      brand,
      model,
      hasDellDock,
      isFunctional,
      hasHdmi,
      hasHdmiExtension,
      usbExtensionType: usbExtensionType || undefined,
      lampHours: lampHours || undefined,
      lastInspectionDate: lastInspectionDate || undefined,
      notes: notes || undefined,
    };

    try {
      if (isEdit && projector) {
        await ProjectorService.update(projector.id, data);
      } else {
        await ProjectorService.create(data);
      }
      onSaved();
    } catch (err) {
      console.error("Failed to save projector", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Upravit projektor" : "Přidat projektor"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="classroom">Učebna *</Label>
              <Input
                id="classroom"
                value={classroom}
                onChange={(e) => setClassroom(e.target.value)}
                placeholder="např. 202"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Značka *</Label>
              <Input
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="např. Epson"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model *</Label>
            <Input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="např. EB-990U"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lampHours">Nasvícené hodiny</Label>
              <Input
                id="lampHours"
                value={lampHours}
                onChange={(e) => setLampHours(e.target.value)}
                placeholder="např. 2232+205"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastInspectionDate">Datum kontroly</Label>
              <Input
                id="lastInspectionDate"
                type="date"
                value={lastInspectionDate}
                onChange={(e) => setLastInspectionDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="usbExtensionType">Prodlužovač USB</Label>
            <Input
              id="usbExtensionType"
              value={usbExtensionType}
              onChange={(e) => setUsbExtensionType(e.target.value)}
              placeholder="např. ano USB-A, ano USB-C"
            />
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="isFunctional">Funkční</Label>
              <Switch
                id="isFunctional"
                checked={isFunctional}
                onCheckedChange={setIsFunctional}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="hasDellDock">Dell Dock</Label>
              <Switch
                id="hasDellDock"
                checked={hasDellDock}
                onCheckedChange={setHasDellDock}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="hasHdmi">HDMI</Label>
              <Switch
                id="hasHdmi"
                checked={hasHdmi}
                onCheckedChange={setHasHdmi}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="hasHdmiExtension">HDMI prodlužovač</Label>
              <Switch
                id="hasHdmiExtension"
                checked={hasHdmiExtension}
                onCheckedChange={setHasHdmiExtension}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Poznámky</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Volitelné poznámky..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onOpenChange}>
              Zrušit
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Uložit" : "Vytvořit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
