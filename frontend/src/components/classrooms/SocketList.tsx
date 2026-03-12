"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  PowerSocket,
  SocketProperty,
  PowerSocketService,
} from "@/services/powerSocket.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Zap,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Settings,
  Check,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SocketListProps {
  classroomId: string;
}

export function SocketList({ classroomId }: SocketListProps) {
  const [sockets, setSockets] = useState<PowerSocket[]>([]);
  const [properties, setProperties] = useState<SocketProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Property management state
  const [newPropLabel, setNewPropLabel] = useState("");
  const [newPropType, setNewPropType] = useState<"BOOLEAN" | "TEXT">("BOOLEAN");

  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [socketsData, propsData] = await Promise.all([
        PowerSocketService.getSockets(classroomId),
        PowerSocketService.getProperties(classroomId),
      ]);
      setSockets(socketsData);
      setProperties(propsData);
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Chyba", description: "Nepodařilo se načíst data." });
    } finally {
      setLoading(false);
    }
  }, [classroomId, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ---- Generate ----
  const handleGenerate = async () => {
    try {
      setGenerating(true);
      await PowerSocketService.generateSockets(classroomId);
      toast({ title: "Hotovo", description: "Zásuvky 1–50 byly vygenerovány." });
      fetchData();
    } catch {
      toast({ variant: "destructive", title: "Chyba", description: "Nepodařilo se vygenerovat zásuvky." });
    } finally {
      setGenerating(false);
    }
  };

  // ---- Add single socket ----
  const handleAddSocket = async () => {
    try {
      const newSocket = await PowerSocketService.createSocket(classroomId);
      setSockets((prev) => [...prev, newSocket]);
    } catch {
      toast({ variant: "destructive", title: "Chyba", description: "Nepodařilo se přidat zásuvku." });
    }
  };

  // ---- Delete socket ----
  const handleDeleteSocket = async (socketId: string) => {
    if (!confirm("Opravdu smazat tuto zásuvku?")) return;
    setSockets((prev) => prev.filter((s) => s.id !== socketId));
    try {
      await PowerSocketService.deleteSocket(socketId);
    } catch {
      toast({ variant: "destructive", title: "Chyba", description: "Smazání selhalo." });
      fetchData(); // revert
    }
  };

  // ---- Toggle isWorking ----
  const handleToggleWorking = async (socket: PowerSocket) => {
    const updated = { ...socket, isWorking: !socket.isWorking };
    setSockets((prev) => prev.map((s) => (s.id === socket.id ? updated : s)));
    try {
      await PowerSocketService.updateSocket(socket.id, { isWorking: updated.isWorking });
    } catch {
      setSockets((prev) => prev.map((s) => (s.id === socket.id ? socket : s)));
      toast({ variant: "destructive", title: "Chyba", description: "Uložení stavu selhalo." });
    }
  };

  const handleToggleProblem = async (socket: PowerSocket) => {
    const updated = { ...socket, hasProblem: !socket.hasProblem };
    setSockets((prev) => prev.map((s) => (s.id === socket.id ? updated : s)));
    try {
      await PowerSocketService.updateSocket(socket.id, { hasProblem: updated.hasProblem });
    } catch {
      setSockets((prev) => prev.map((s) => (s.id === socket.id ? socket : s)));
      toast({ variant: "destructive", title: "Chyba", description: "Uložení stavu selhalo." });
    }
  };

  // ---- Note update ----
  const handleNoteUpdate = async (socket: PowerSocket, note: string) => {
    if (note === (socket.note ?? "")) return;
    try {
      await PowerSocketService.updateSocket(socket.id, { note });
      setSockets((prev) => prev.map((s) => (s.id === socket.id ? { ...s, note } : s)));
    } catch {
      toast({ variant: "destructive", title: "Chyba", description: "Uložení poznámky selhalo." });
    }
  };

  // ---- Number update ----
  const handleNumberUpdate = async (socket: PowerSocket, number: number) => {
    if (number === socket.number || isNaN(number)) return;
    try {
      await PowerSocketService.updateSocket(socket.id, { number });
      setSockets((prev) =>
        prev
          .map((s) => (s.id === socket.id ? { ...s, number } : s))
          .sort((a, b) => a.number - b.number)
      );
    } catch {
      toast({ variant: "destructive", title: "Chyba", description: "Uložení čísla selhalo." });
    }
  };

  // ---- Dynamic property value toggle ----
  const handleUpdateValue = async (socketId: string, propertyId: string, valueBool?: boolean) => {
    setSockets((prev) =>
      prev.map((s) => {
        if (s.id !== socketId) return s;
        const idx = s.values.findIndex((v) => v.propertyId === propertyId);
        const newValues = [...s.values];
        if (idx > -1) {
          newValues[idx] = { ...newValues[idx], valueBool: valueBool ?? null };
        } else {
          newValues.push({ id: "temp", socketId, propertyId, valueBool: valueBool ?? null, valueText: null });
        }
        return { ...s, values: newValues };
      })
    );
    try {
      await PowerSocketService.updateValues(socketId, [{ propertyId, valueBool }]);
    } catch {
      toast({ variant: "destructive", title: "Chyba", description: "Uložení hodnoty selhalo." });
      fetchData();
    }
  };

  // ---- Property management ----
  const handleAddProperty = async () => {
    if (!newPropLabel.trim()) return;
    try {
      const key = newPropLabel.toLowerCase().replace(/\s+/g, "-");
      await PowerSocketService.createProperty(classroomId, {
        key,
        label: newPropLabel,
        type: newPropType,
        order: properties.length + 1,
      });
      setNewPropLabel("");
      fetchData();
      toast({ title: "Přidáno", description: "Sloupec byl přidán." });
    } catch {
      toast({ variant: "destructive", title: "Chyba", description: "Nepodařilo se přidat sloupec." });
    }
  };

  const handleDeleteProperty = async (propId: string) => {
    if (!confirm("Smazat tento sloupec a všechna data v něm?")) return;
    try {
      await PowerSocketService.deleteProperty(propId);
      fetchData();
    } catch {
      toast({ variant: "destructive", title: "Chyba", description: "Nepodařilo se smazat sloupec." });
    }
  };

  const workingCount = sockets.filter((s) => s.isWorking).length;
  const brokenCount = sockets.length - workingCount;
  const problemCount = sockets.filter((s) => s.hasProblem).length;
  // fixed columns: Číslo, Problém, Funkční, Stav, dynamic props, Poznámka, delete
  const colSpan = 5 + properties.length + 1;

  // ---- Empty state ----
  if (!loading && sockets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-xl border-2 border-dashed border-muted py-20">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Zap className="h-14 w-14 opacity-30" />
          <h3 className="text-xl font-semibold text-foreground">Žádné zásuvky</h3>
          <p className="max-w-xs text-center text-sm">
            Tato učebna zatím nemá evidované zásuvky.
          </p>
        </div>
        <div className="flex gap-3">
          <Button size="lg" onClick={handleGenerate} disabled={generating} className="gap-2">
            <Zap className="h-5 w-5" />
            {generating ? "Generuji…" : "Vygenerovat 50 zásuvek"}
          </Button>
          <Button size="lg" variant="outline" onClick={handleAddSocket} className="gap-2">
            <Plus className="h-5 w-5" /> Přidat zásuvku
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Zásuvky</h2>
          {sockets.length > 0 && (
            <div className="flex gap-3 text-sm">
              <span className="flex items-center gap-1.5 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                {workingCount} funkčních
              </span>
              {brokenCount > 0 && (
                <span className="flex items-center gap-1.5 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {brokenCount} nefunkčních
                </span>
              )}
              {problemCount > 0 && (
                <span className="flex items-center gap-1.5 text-orange-500">
                  <AlertCircle className="h-4 w-4" />
                  {problemCount} s problémem
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {/* Column management */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" /> Spravovat sloupce
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Správa sloupců</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2 items-end">
                  <div className="grid gap-1.5 flex-1">
                    <Label>Název nového sloupce</Label>
                    <Input
                      value={newPropLabel}
                      onChange={(e) => setNewPropLabel(e.target.value)}
                      placeholder="Např. Uzemněno"
                      onKeyDown={(e) => e.key === "Enter" && handleAddProperty()}
                    />
                  </div>
                  <div className="grid gap-1.5 w-[120px]">
                    <Label>Typ</Label>
                    <Select
                      value={newPropType}
                      onValueChange={(v: any) => setNewPropType(v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BOOLEAN">Ano/Ne</SelectItem>
                        <SelectItem value="TEXT">Text</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddProperty}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="border rounded p-2 space-y-2 max-h-[300px] overflow-auto">
                  {properties.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      Žádné vlastní sloupce.
                    </p>
                  )}
                  {properties.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center p-2 bg-secondary/50 rounded"
                    >
                      <span>
                        {p.label}{" "}
                        <span className="text-xs text-muted-foreground">({p.type})</span>
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProperty(p.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button size="sm" onClick={handleAddSocket} className="gap-1">
            <Plus className="h-4 w-4" /> Přidat zásuvku
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[110px]">Číslo</TableHead>
              <TableHead className="w-[100px] text-center">Problém</TableHead>
              <TableHead className="w-[100px] text-center">Funkční</TableHead>
              <TableHead className="w-[110px]">Stav</TableHead>
              {properties.map((p) => (
                <TableHead key={p.id} className="text-center min-w-[100px]">
                  {p.label}
                </TableHead>
              ))}
              <TableHead>Poznámka</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="py-8 text-center text-muted-foreground">
                  Načítání…
                </TableCell>
              </TableRow>
            ) : (
              sockets.map((socket) => (
                <SocketRow
                  key={socket.id}
                  socket={socket}
                  properties={properties}
                  onToggle={handleToggleWorking}
                  onToggleProblem={handleToggleProblem}
                  onNoteUpdate={handleNoteUpdate}
                  onNumberUpdate={handleNumberUpdate}
                  onUpdateValue={handleUpdateValue}
                  onDelete={handleDeleteSocket}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ---- Row component ----
function SocketRow({
  socket,
  properties,
  onToggle,
  onToggleProblem,
  onNoteUpdate,
  onNumberUpdate,
  onUpdateValue,
  onDelete,
}: {
  socket: PowerSocket;
  properties: SocketProperty[];
  onToggle: (socket: PowerSocket) => void;
  onToggleProblem: (socket: PowerSocket) => void;
  onNoteUpdate: (socket: PowerSocket, note: string) => void;
  onNumberUpdate: (socket: PowerSocket, number: number) => void;
  onUpdateValue: (socketId: string, propertyId: string, valueBool?: boolean) => void;
  onDelete: (socketId: string) => void;
}) {
  const [note, setNote] = useState(socket.note ?? "");
  const [number, setNumber] = useState(socket.number.toString());

  useEffect(() => {
    setNote(socket.note ?? "");
  }, [socket.note]);

  useEffect(() => {
    setNumber(socket.number.toString());
  }, [socket.number]);

  const rowClass = !socket.isWorking 
    ? "bg-destructive/5" 
    : (socket.hasProblem ? "bg-orange-500/10" : undefined);

  return (
    <TableRow className={rowClass}>
      {/* Number */}
      <TableCell className="p-2">
        <Input
          className="h-7 w-20 px-1 text-center"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          onBlur={() => onNumberUpdate(socket, parseInt(number))}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        />
      </TableCell>

      {/* hasProblem Switch */}
      <TableCell className="text-center">
        <Switch
          checked={socket.hasProblem}
          onCheckedChange={() => onToggleProblem(socket)}
          aria-label={`Zásuvka #${socket.number} – problém`}
          className="data-[state=checked]:bg-orange-500"
        />
      </TableCell>

      {/* isWorking Switch */}
      <TableCell className="text-center">
        <Switch
          checked={socket.isWorking}
          onCheckedChange={() => onToggle(socket)}
          aria-label={`Zásuvka #${socket.number} – funkční`}
        />
      </TableCell>

      {/* Badge */}
      <TableCell>
        {socket.isWorking ? (
          <Badge className="bg-green-600 text-white hover:bg-green-700">Funkční</Badge>
        ) : (
          <Badge variant="destructive">Nefunkční</Badge>
        )}
      </TableCell>

      {/* Dynamic property columns */}
      {properties.map((prop) => {
        const val = socket.values.find((v) => v.propertyId === prop.id);
        if (prop.type === "BOOLEAN") {
          const boolVal = val?.valueBool ?? false;
          return (
            <TableCell key={prop.id} className="text-center p-2">
              <div
                className={`cursor-pointer px-2 py-1 rounded inline-flex items-center justify-center gap-1 border ${
                  boolVal
                    ? "border-green-600 bg-green-100 text-green-800"
                    : "border-red-600 bg-red-100 text-red-800"
                }`}
                onClick={() => onUpdateValue(socket.id, prop.id, !boolVal)}
              >
                {boolVal ? <Check size={14} /> : <X size={14} />}
                <span className="text-xs font-semibold">{boolVal ? "Ano" : "Ne"}</span>
              </div>
            </TableCell>
          );
        }
        return (
          <TableCell key={prop.id} className="p-2">
            <span className="text-sm text-muted-foreground">{val?.valueText ?? "–"}</span>
          </TableCell>
        );
      })}

      {/* Note */}
      <TableCell className="p-2">
        <Input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => onNoteUpdate(socket, note)}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          placeholder="Poznámka…"
          className="h-8 w-full min-w-[130px]"
        />
      </TableCell>

      {/* Delete */}
      <TableCell className="p-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(socket.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
