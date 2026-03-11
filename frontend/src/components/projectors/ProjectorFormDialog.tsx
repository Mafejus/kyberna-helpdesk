"use client";

import { useState, useEffect } from "react";
import {
  Equipment,
  EquipmentType,
  ProjectorService,
  CreateEquipmentData,
} from "@/services/projector.service";
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

interface EquipmentFormDialogProps {
  open: boolean;
  onOpenChange: () => void;
  item: Equipment | null;
  equipmentType: EquipmentType;
  onSaved: () => void;
}

const TYPE_LABELS: Record<EquipmentType, string> = {
  PROJECTOR: "projektor",
  HUB: "hub",
  AUDIO: "audio vybavení",
  ACCESS_POINT: "AP",
  OTHER: "vybavení",
};

function emptyForm() {
  return {
    classroom: "",
    brand: "",
    model: "",
    isFunctional: true,
    lastInspectionDate: "",
    notes: "",
    // Projector
    hasDellDock: false,
    hasHdmi: false,
    hasHdmiExtension: false,
    usbExtensionType: "",
    lampHours: "",
    // Hub
    hubType: "",
    // Audio
    audioStatus: "",
    missingItems: "",
    // AP
    apType: "",
    hasEduroam: false,
    hasGuestNetwork: false,
  };
}

export function EquipmentFormDialog({
  open,
  onOpenChange,
  item,
  equipmentType,
  onSaved,
}: EquipmentFormDialogProps) {
  const isEdit = !!item;
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const set = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (item) {
      setForm({
        classroom: item.classroom,
        brand: item.brand || "",
        model: item.model || "",
        isFunctional: item.isFunctional,
        lastInspectionDate: item.lastInspectionDate
          ? item.lastInspectionDate.split("T")[0]
          : "",
        notes: item.notes || "",
        hasDellDock: item.hasDellDock,
        hasHdmi: item.hasHdmi,
        hasHdmiExtension: item.hasHdmiExtension,
        usbExtensionType: item.usbExtensionType || "",
        lampHours: item.lampHours || "",
        hubType: item.hubType || "",
        audioStatus: item.audioStatus || "",
        missingItems: item.missingItems || "",
        apType: item.apType || "",
        hasEduroam: item.hasEduroam,
        hasGuestNetwork: item.hasGuestNetwork,
      });
    } else {
      setForm(emptyForm());
    }
  }, [item, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const data: CreateEquipmentData = {
      equipmentType,
      classroom: form.classroom,
      brand: form.brand || undefined,
      model: form.model || undefined,
      isFunctional: form.isFunctional,
      lastInspectionDate: form.lastInspectionDate || undefined,
      notes: form.notes || undefined,
      // Projector
      hasDellDock: form.hasDellDock,
      hasHdmi: form.hasHdmi,
      hasHdmiExtension: form.hasHdmiExtension,
      usbExtensionType: form.usbExtensionType || undefined,
      lampHours: form.lampHours || undefined,
      // Hub
      hubType: form.hubType || undefined,
      // Audio
      audioStatus: form.audioStatus || undefined,
      missingItems: form.missingItems || undefined,
      // AP
      apType: form.apType || undefined,
      hasEduroam: form.hasEduroam,
      hasGuestNetwork: form.hasGuestNetwork,
    };

    try {
      if (isEdit && item) {
        await ProjectorService.update(item.id, data);
      } else {
        await ProjectorService.create(data);
      }
      onSaved();
    } catch (err) {
      console.error("Failed to save equipment", err);
    } finally {
      setSaving(false);
    }
  };

  const label = TYPE_LABELS[equipmentType];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `Upravit ${label}` : `Přidat ${label}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common: Classroom */}
          <div className="space-y-2">
            <Label htmlFor="classroom">Učebna *</Label>
            <Input
              id="classroom"
              value={form.classroom}
              onChange={(e) => set("classroom", e.target.value)}
              placeholder="např. 202"
              required
            />
          </div>

          {/* PROJECTOR fields */}
          {equipmentType === "PROJECTOR" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Značka *</Label>
                  <Input
                    id="brand"
                    value={form.brand}
                    onChange={(e) => set("brand", e.target.value)}
                    placeholder="např. Epson"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={form.model}
                    onChange={(e) => set("model", e.target.value)}
                    placeholder="např. EB-990U"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lampHours">Nasvícené hodiny</Label>
                  <Input
                    id="lampHours"
                    value={form.lampHours}
                    onChange={(e) => set("lampHours", e.target.value)}
                    placeholder="např. 2232+205"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastInspectionDate">Datum kontroly</Label>
                  <Input
                    id="lastInspectionDate"
                    type="date"
                    value={form.lastInspectionDate}
                    onChange={(e) => set("lastInspectionDate", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="usbExtensionType">Prodlužovač USB</Label>
                <Input
                  id="usbExtensionType"
                  value={form.usbExtensionType}
                  onChange={(e) => set("usbExtensionType", e.target.value)}
                  placeholder="např. ano USB-A, ano USB-C"
                />
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isFunctional">Funkční</Label>
                  <Switch id="isFunctional" checked={form.isFunctional} onCheckedChange={(v) => set("isFunctional", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hasDellDock">Dell Dock</Label>
                  <Switch id="hasDellDock" checked={form.hasDellDock} onCheckedChange={(v) => set("hasDellDock", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hasHdmi">HDMI</Label>
                  <Switch id="hasHdmi" checked={form.hasHdmi} onCheckedChange={(v) => set("hasHdmi", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hasHdmiExtension">HDMI prodlužovač</Label>
                  <Switch id="hasHdmiExtension" checked={form.hasHdmiExtension} onCheckedChange={(v) => set("hasHdmiExtension", v)} />
                </div>
              </div>
            </>
          )}

          {/* HUB fields */}
          {equipmentType === "HUB" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="hubType">Typ hubu</Label>
                <Input
                  id="hubType"
                  value={form.hubType}
                  onChange={(e) => set("hubType", e.target.value)}
                  placeholder="např. Nový Mikrotik, Starý i-tec"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Značka</Label>
                  <Input
                    id="brand"
                    value={form.brand}
                    onChange={(e) => set("brand", e.target.value)}
                    placeholder="např. Mikrotik"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={form.model}
                    onChange={(e) => set("model", e.target.value)}
                    placeholder="např. RB951G-2HnD"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastInspectionDate">Datum kontroly</Label>
                  <Input
                    id="lastInspectionDate"
                    type="date"
                    value={form.lastInspectionDate}
                    onChange={(e) => set("lastInspectionDate", e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Label htmlFor="isFunctional">Funkční</Label>
                  <Switch id="isFunctional" checked={form.isFunctional} onCheckedChange={(v) => set("isFunctional", v)} />
                </div>
              </div>
            </>
          )}

          {/* AUDIO fields */}
          {equipmentType === "AUDIO" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="audioStatus">Stav</Label>
                <Input
                  id="audioStatus"
                  value={form.audioStatus}
                  onChange={(e) => set("audioStatus", e.target.value)}
                  placeholder="např. Nedokončené, Hotovo, Bez ozvučení"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="missingItems">Chybí / Potřeba</Label>
                <Textarea
                  id="missingItems"
                  value={form.missingItems}
                  onChange={(e) => set("missingItems", e.target.value)}
                  placeholder="např. napájecí kabel 2-3 m, rozdvojka"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Značka</Label>
                  <Input
                    id="brand"
                    value={form.brand}
                    onChange={(e) => set("brand", e.target.value)}
                    placeholder="např. Yamaha"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={form.model}
                    onChange={(e) => set("model", e.target.value)}
                    placeholder="např. MG10XU"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastInspectionDate">Datum kontroly</Label>
                  <Input
                    id="lastInspectionDate"
                    type="date"
                    value={form.lastInspectionDate}
                    onChange={(e) => set("lastInspectionDate", e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Label htmlFor="isFunctional">Funkční</Label>
                  <Switch id="isFunctional" checked={form.isFunctional} onCheckedChange={(v) => set("isFunctional", v)} />
                </div>
              </div>
            </>
          )}

          {/* ACCESS_POINT fields */}
          {equipmentType === "ACCESS_POINT" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apType">Typ AP</Label>
                  <Input
                    id="apType"
                    value={form.apType}
                    onChange={(e) => set("apType", e.target.value)}
                    placeholder="např. Nový Mikrotik, Cisco"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={form.model}
                    onChange={(e) => set("model", e.target.value)}
                    placeholder="např. RB951Ui-2HnD"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastInspectionDate">Datum kontroly</Label>
                <Input
                  id="lastInspectionDate"
                  type="date"
                  value={form.lastInspectionDate}
                  onChange={(e) => set("lastInspectionDate", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isFunctional">Funkční</Label>
                  <Switch id="isFunctional" checked={form.isFunctional} onCheckedChange={(v) => set("isFunctional", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hasEduroam">Eduroam</Label>
                  <Switch id="hasEduroam" checked={form.hasEduroam} onCheckedChange={(v) => set("hasEduroam", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hasGuestNetwork">Kyberna-host</Label>
                  <Switch id="hasGuestNetwork" checked={form.hasGuestNetwork} onCheckedChange={(v) => set("hasGuestNetwork", v)} />
                </div>
              </div>
            </>
          )}

          {/* OTHER fields */}
          {equipmentType === "OTHER" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Název / Typ *</Label>
                  <Input
                    id="brand"
                    value={form.brand}
                    onChange={(e) => set("brand", e.target.value)}
                    placeholder="např. Nabíječka, Kabel, Adaptér"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model / Specifikace</Label>
                  <Input
                    id="model"
                    value={form.model}
                    onChange={(e) => set("model", e.target.value)}
                    placeholder="např. USB-C 65W"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastInspectionDate">Datum kontroly</Label>
                  <Input
                    id="lastInspectionDate"
                    type="date"
                    value={form.lastInspectionDate}
                    onChange={(e) => set("lastInspectionDate", e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Label htmlFor="isFunctional">Funkční</Label>
                  <Switch id="isFunctional" checked={form.isFunctional} onCheckedChange={(v) => set("isFunctional", v)} />
                </div>
              </div>
            </>
          )}

          {/* Common: Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Poznámky</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Volitelné poznámky..."
              rows={2}
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

// Legacy export
export { EquipmentFormDialog as ProjectorFormDialog };
