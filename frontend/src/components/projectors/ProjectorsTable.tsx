"use client";

import { Equipment, EquipmentType } from "@/services/projector.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Pencil, Trash2 } from "lucide-react";

interface EquipmentTableProps {
  items: Equipment[];
  equipmentType: EquipmentType;
  canManage: boolean;
  onEdit: (item: Equipment) => void;
  onDelete: (id: string) => void;
}

function BoolIcon({ value }: { value: boolean }) {
  return value ? (
    <Check className="h-4 w-4 text-green-500" />
  ) : (
    <X className="h-4 w-4 text-red-500" />
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("cs-CZ");
  } catch {
    return "—";
  }
}

const E = "—";

function ActionCell({
  item,
  canManage,
  onEdit,
  onDelete,
}: {
  item: Equipment;
  canManage: boolean;
  onEdit: (item: Equipment) => void;
  onDelete: (id: string) => void;
}) {
  if (!canManage) return null;
  return (
    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon" onClick={() => onEdit(item)} title="Upravit">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(item.id)}
          title="Smazat"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </TableCell>
  );
}

function ClickableRow({
  item,
  canManage,
  onEdit,
  children,
}: {
  item: Equipment;
  canManage: boolean;
  onEdit: (item: Equipment) => void;
  children: React.ReactNode;
}) {
  return (
    <TableRow
      className={canManage ? "cursor-pointer hover:bg-muted/60" : ""}
      onClick={canManage ? () => onEdit(item) : undefined}
      title={canManage ? "Kliknutím upravíte" : undefined}
    >
      {children}
    </TableRow>
  );
}

function ProjectorRows({ items, canManage, onEdit, onDelete }: Omit<EquipmentTableProps, "equipmentType">) {
  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead>Učebna</TableHead>
          <TableHead>Značka / Model</TableHead>
          <TableHead>Nasvícené hodiny</TableHead>
          <TableHead className="text-center">Funkčnost</TableHead>
          <TableHead className="text-center">Dell Dock</TableHead>
          <TableHead className="text-center">HDMI</TableHead>
          <TableHead className="text-center">HDMI prodl.</TableHead>
          <TableHead>USB prodl.</TableHead>
          <TableHead>Poslední kontrola</TableHead>
          <TableHead>Poznámky</TableHead>
          {canManage && <TableHead className="text-right">Akce</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((p) => (
          <ClickableRow key={p.id} item={p} canManage={canManage} onEdit={onEdit}>
            <TableCell className="font-medium">{p.classroom}</TableCell>
            <TableCell>
              <span className="font-medium">{p.brand || E}</span>{" "}
              <span className="text-muted-foreground">{p.model || ""}</span>
            </TableCell>
            <TableCell>{p.lampHours || E}</TableCell>
            <TableCell className="text-center"><div className="flex justify-center"><BoolIcon value={p.isFunctional} /></div></TableCell>
            <TableCell className="text-center"><div className="flex justify-center"><BoolIcon value={p.hasDellDock} /></div></TableCell>
            <TableCell className="text-center"><div className="flex justify-center"><BoolIcon value={p.hasHdmi} /></div></TableCell>
            <TableCell className="text-center"><div className="flex justify-center"><BoolIcon value={p.hasHdmiExtension} /></div></TableCell>
            <TableCell>{p.usbExtensionType || E}</TableCell>
            <TableCell>{formatDate(p.lastInspectionDate)}</TableCell>
            <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground" title={p.notes || ""}>{p.notes || E}</TableCell>
            <ActionCell item={p} canManage={canManage} onEdit={onEdit} onDelete={onDelete} />
          </ClickableRow>
        ))}
      </TableBody>
    </>
  );
}

function HubRows({ items, canManage, onEdit, onDelete }: Omit<EquipmentTableProps, "equipmentType">) {
  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead>Učebna</TableHead>
          <TableHead>Typ hubu</TableHead>
          <TableHead>Značka / Model</TableHead>
          <TableHead className="text-center">Funkčnost</TableHead>
          <TableHead>Poslední kontrola</TableHead>
          <TableHead>Poznámky</TableHead>
          {canManage && <TableHead className="text-right">Akce</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((p) => (
          <ClickableRow key={p.id} item={p} canManage={canManage} onEdit={onEdit}>
            <TableCell className="font-medium">{p.classroom}</TableCell>
            <TableCell>{p.hubType || E}</TableCell>
            <TableCell>
              {p.brand || p.model
                ? <><span className="font-medium">{p.brand || ""}</span>{" "}<span className="text-muted-foreground">{p.model || ""}</span></>
                : E}
            </TableCell>
            <TableCell className="text-center"><div className="flex justify-center"><BoolIcon value={p.isFunctional} /></div></TableCell>
            <TableCell>{formatDate(p.lastInspectionDate)}</TableCell>
            <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground" title={p.notes || ""}>{p.notes || E}</TableCell>
            <ActionCell item={p} canManage={canManage} onEdit={onEdit} onDelete={onDelete} />
          </ClickableRow>
        ))}
      </TableBody>
    </>
  );
}

function AudioRows({ items, canManage, onEdit, onDelete }: Omit<EquipmentTableProps, "equipmentType">) {
  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead>Učebna</TableHead>
          <TableHead>Stav</TableHead>
          <TableHead>Chybí / Potřeba</TableHead>
          <TableHead>Značka / Model</TableHead>
          <TableHead className="text-center">Funkčnost</TableHead>
          <TableHead>Poslední kontrola</TableHead>
          <TableHead>Poznámky</TableHead>
          {canManage && <TableHead className="text-right">Akce</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((p) => (
          <ClickableRow key={p.id} item={p} canManage={canManage} onEdit={onEdit}>
            <TableCell className="font-medium">{p.classroom}</TableCell>
            <TableCell>
              <span className={
                p.audioStatus === "Hotovo" ? "text-green-600 font-medium" :
                p.audioStatus === "Nedokončené" ? "text-amber-600 font-medium" :
                p.audioStatus === "Bez ozvučení" ? "text-red-600 font-medium" : ""
              }>
                {p.audioStatus || E}
              </span>
            </TableCell>
            <TableCell className="max-w-[250px] text-sm text-muted-foreground" title={p.missingItems || ""}>{p.missingItems || E}</TableCell>
            <TableCell>
              {p.brand || p.model
                ? <><span className="font-medium">{p.brand || ""}</span>{" "}<span className="text-muted-foreground">{p.model || ""}</span></>
                : E}
            </TableCell>
            <TableCell className="text-center"><div className="flex justify-center"><BoolIcon value={p.isFunctional} /></div></TableCell>
            <TableCell>{formatDate(p.lastInspectionDate)}</TableCell>
            <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground" title={p.notes || ""}>{p.notes || E}</TableCell>
            <ActionCell item={p} canManage={canManage} onEdit={onEdit} onDelete={onDelete} />
          </ClickableRow>
        ))}
      </TableBody>
    </>
  );
}

function AccessPointRows({ items, canManage, onEdit, onDelete }: Omit<EquipmentTableProps, "equipmentType">) {
  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead>Učebna</TableHead>
          <TableHead>Typ AP</TableHead>
          <TableHead>Model</TableHead>
          <TableHead className="text-center">Eduroam</TableHead>
          <TableHead className="text-center">Kyberna-host</TableHead>
          <TableHead className="text-center">Funkčnost</TableHead>
          <TableHead>Poslední kontrola</TableHead>
          <TableHead>Poznámky</TableHead>
          {canManage && <TableHead className="text-right">Akce</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((p) => (
          <ClickableRow key={p.id} item={p} canManage={canManage} onEdit={onEdit}>
            <TableCell className="font-medium">{p.classroom}</TableCell>
            <TableCell>{p.apType || E}</TableCell>
            <TableCell>{p.model || E}</TableCell>
            <TableCell className="text-center"><div className="flex justify-center"><BoolIcon value={p.hasEduroam} /></div></TableCell>
            <TableCell className="text-center"><div className="flex justify-center"><BoolIcon value={p.hasGuestNetwork} /></div></TableCell>
            <TableCell className="text-center"><div className="flex justify-center"><BoolIcon value={p.isFunctional} /></div></TableCell>
            <TableCell>{formatDate(p.lastInspectionDate)}</TableCell>
            <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground" title={p.notes || ""}>{p.notes || E}</TableCell>
            <ActionCell item={p} canManage={canManage} onEdit={onEdit} onDelete={onDelete} />
          </ClickableRow>
        ))}
      </TableBody>
    </>
  );
}

function OtherRows({ items, canManage, onEdit, onDelete }: Omit<EquipmentTableProps, "equipmentType">) {
  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead>Učebna</TableHead>
          <TableHead>Název</TableHead>
          <TableHead>Značka / Model</TableHead>
          <TableHead className="text-center">Funkčnost</TableHead>
          <TableHead>Poslední kontrola</TableHead>
          <TableHead>Poznámky</TableHead>
          {canManage && <TableHead className="text-right">Akce</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((p) => (
          <ClickableRow key={p.id} item={p} canManage={canManage} onEdit={onEdit}>
            <TableCell className="font-medium">{p.classroom}</TableCell>
            <TableCell className="font-medium">{p.brand || E}</TableCell>
            <TableCell>
              {p.model
                ? <span className="text-muted-foreground">{p.model}</span>
                : E}
            </TableCell>
            <TableCell className="text-center"><div className="flex justify-center"><BoolIcon value={p.isFunctional} /></div></TableCell>
            <TableCell>{formatDate(p.lastInspectionDate)}</TableCell>
            <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground" title={p.notes || ""}>{p.notes || E}</TableCell>
            <ActionCell item={p} canManage={canManage} onEdit={onEdit} onDelete={onDelete} />
          </ClickableRow>
        ))}
      </TableBody>
    </>
  );
}

const EMPTY_TEXT: Record<EquipmentType, string> = {
  PROJECTOR: "Žádné projektory k zobrazení.",
  HUB: "Žádné huby k zobrazení.",
  AUDIO: "Žádná audio technika k zobrazení.",
  ACCESS_POINT: "Žádná APčka k zobrazení.",
  OTHER: "Žádné ostatní vybavení k zobrazení.",
};

export function EquipmentTable({ items, equipmentType, canManage, onEdit, onDelete }: EquipmentTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        {EMPTY_TEXT[equipmentType]}
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table className="min-w-[700px]">
        {equipmentType === "PROJECTOR" && <ProjectorRows items={items} canManage={canManage} onEdit={onEdit} onDelete={onDelete} />}
        {equipmentType === "HUB" && <HubRows items={items} canManage={canManage} onEdit={onEdit} onDelete={onDelete} />}
        {equipmentType === "AUDIO" && <AudioRows items={items} canManage={canManage} onEdit={onEdit} onDelete={onDelete} />}
        {equipmentType === "ACCESS_POINT" && <AccessPointRows items={items} canManage={canManage} onEdit={onEdit} onDelete={onDelete} />}
        {equipmentType === "OTHER" && <OtherRows items={items} canManage={canManage} onEdit={onEdit} onDelete={onDelete} />}
      </Table>
    </div>
  );
}

export { EquipmentTable as ProjectorsTable };
