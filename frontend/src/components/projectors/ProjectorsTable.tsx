"use client";

import { Projector } from "@/services/projector.service";
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

interface ProjectorsTableProps {
  projectors: Projector[];
  isAdmin: boolean;
  onEdit: (projector: Projector) => void;
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

export function ProjectorsTable({ projectors, isAdmin, onEdit, onDelete }: ProjectorsTableProps) {
  if (projectors.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        Žádné projektory k zobrazení.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
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
            {isAdmin && <TableHead className="text-right">Akce</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {projectors.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.classroom}</TableCell>
              <TableCell>
                <div>
                  <span className="font-medium">{p.brand}</span>{" "}
                  <span className="text-muted-foreground">{p.model}</span>
                </div>
              </TableCell>
              <TableCell>{p.lampHours || "—"}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <BoolIcon value={p.isFunctional} />
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <BoolIcon value={p.hasDellDock} />
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <BoolIcon value={p.hasHdmi} />
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <BoolIcon value={p.hasHdmiExtension} />
                </div>
              </TableCell>
              <TableCell>{p.usbExtensionType || "—"}</TableCell>
              <TableCell>{formatDate(p.lastInspectionDate)}</TableCell>
              <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground" title={p.notes || ""}>{p.notes || "—"}</TableCell>
              {isAdmin && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(p)} title="Upravit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(p.id)} title="Smazat" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
