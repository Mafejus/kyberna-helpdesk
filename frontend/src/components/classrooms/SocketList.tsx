"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  PowerSocket,
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
import { Zap, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SocketListProps {
  classroomId: string;
}

export function SocketList({ classroomId }: SocketListProps) {
  const [sockets, setSockets] = useState<PowerSocket[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const fetchSockets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await PowerSocketService.getSockets(classroomId);
      setSockets(data);
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Chyba",
        description: "Nepodařilo se načíst zásuvky.",
      });
    } finally {
      setLoading(false);
    }
  }, [classroomId, toast]);

  useEffect(() => {
    fetchSockets();
  }, [fetchSockets]);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      await PowerSocketService.generateSockets(classroomId);
      toast({ title: "Hotovo", description: "Zásuvky 1–50 byly vygenerovány." });
      fetchSockets();
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Chyba",
        description: "Nepodařilo se vygenerovat zásuvky.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleWorking = async (socket: PowerSocket) => {
    const updated = { ...socket, isWorking: !socket.isWorking };
    // Optimistic update
    setSockets((prev) =>
      prev.map((s) => (s.id === socket.id ? updated : s))
    );
    try {
      await PowerSocketService.updateSocket(socket.id, {
        isWorking: updated.isWorking,
      });
    } catch (e) {
      // Revert on error
      setSockets((prev) =>
        prev.map((s) => (s.id === socket.id ? socket : s))
      );
      toast({
        variant: "destructive",
        title: "Chyba",
        description: "Uložení stavu selhalo.",
      });
    }
  };

  const handleNoteUpdate = async (socket: PowerSocket, note: string) => {
    if (note === (socket.note ?? "")) return; // no change
    try {
      await PowerSocketService.updateSocket(socket.id, { note });
      setSockets((prev) =>
        prev.map((s) => (s.id === socket.id ? { ...s, note } : s))
      );
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Chyba",
        description: "Uložení poznámky selhalo.",
      });
    }
  };

  const workingCount = sockets.filter((s) => s.isWorking).length;
  const brokenCount = sockets.length - workingCount;

  // ----- Empty state -----
  if (!loading && sockets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-xl border-2 border-dashed border-muted py-20">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Zap className="h-14 w-14 opacity-30" />
          <h3 className="text-xl font-semibold text-foreground">
            Žádné zásuvky
          </h3>
          <p className="max-w-xs text-center text-sm">
            Tato učebna zatím nemá evidované zásuvky. Kliknutím níže je
            jednorázově vygenerujete.
          </p>
        </div>
        <Button
          size="lg"
          onClick={handleGenerate}
          disabled={generating}
          className="gap-2"
        >
          <Zap className="h-5 w-5" />
          {generating ? "Generuji…" : "Vygenerovat 50 zásuvek"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header / Stats */}
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
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[130px]">Číslo</TableHead>
              <TableHead className="w-[110px] text-center">Funkční</TableHead>
              <TableHead>Stav</TableHead>
              <TableHead>Poznámka</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  Načítání…
                </TableCell>
              </TableRow>
            ) : (
              sockets.map((socket) => (
                <SocketRow
                  key={socket.id}
                  socket={socket}
                  onToggle={handleToggleWorking}
                  onNoteUpdate={handleNoteUpdate}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Separate row component to isolate note input state
function SocketRow({
  socket,
  onToggle,
  onNoteUpdate,
}: {
  socket: PowerSocket;
  onToggle: (socket: PowerSocket) => void;
  onNoteUpdate: (socket: PowerSocket, note: string) => void;
}) {
  const [note, setNote] = useState(socket.note ?? "");
  const prevNoteRef = useRef(socket.note ?? "");

  // Sync external note changes (e.g. after generate)
  useEffect(() => {
    setNote(socket.note ?? "");
    prevNoteRef.current = socket.note ?? "";
  }, [socket.note]);

  const handleBlur = () => {
    onNoteUpdate(socket, note);
    prevNoteRef.current = note;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <TableRow className={!socket.isWorking ? "bg-destructive/5" : undefined}>
      <TableCell className="font-medium">
        Zásuvka #{socket.number}
      </TableCell>
      <TableCell className="text-center">
        <Switch
          checked={socket.isWorking}
          onCheckedChange={() => onToggle(socket)}
          aria-label={`Zásuvka #${socket.number} – funkční`}
        />
      </TableCell>
      <TableCell>
        {socket.isWorking ? (
          <Badge className="bg-green-600 text-white hover:bg-green-700">
            Funkční
          </Badge>
        ) : (
          <Badge variant="destructive">Nefunkční</Badge>
        )}
      </TableCell>
      <TableCell>
        <Input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Bez poznámky…"
          className="h-8 max-w-xs"
        />
      </TableCell>
    </TableRow>
  );
}
