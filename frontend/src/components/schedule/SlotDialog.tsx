"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { HelpdeskShift } from "@/types/schedule";
import { User } from "@/context/AuthContext";
import { UsersService } from "@/services/users.service";
import { ScheduleService } from "@/services/schedule.service";
import { LESSON_TIMES } from "@/lib/constants";
import { Loader2, Trash2, Save, ArrowLeftRight, Clock, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { format, isPast, isToday, isFuture, parseISO } from "date-fns";
import { cs } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Helper for Timer
function CheckInTimer({ startedAt, shiftStart, shiftEnd }: { startedAt: string, shiftStart?: string, shiftEnd?: string }) {
    const [elapsed, setElapsed] = useState("");
    const [status, setStatus] = useState<"waiting" | "running" | "ended">("running");

    useEffect(() => {
        const interval = setInterval(() => {
            const nowTime = new Date().getTime();
            let effectiveNow = nowTime;
            // Start from check-in time by default
            let effectiveStart = new Date(startedAt).getTime();

            // Logic: Timer counts from MAX(startedAt, shiftStart). 
            // If checking in EARLY: startedAt < shiftStart. We clamp to shiftStart.
            // If checking in LATE: startedAt > shiftStart. We use startedAt.
            
            if (shiftStart) {
                const shiftStartVal = new Date(shiftStart).getTime();
                
                // If now is BEFORE shift start, we are in "Waiting" mode
                if (nowTime < shiftStartVal) {
                    setStatus("waiting");
                    const diff = shiftStartVal - nowTime;
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                     setElapsed(`Začínáme za ${minutes}m ${seconds}s`);
                     return;
                }
                
                // Math.max ensures we take the LATEST of the two times
                if (shiftStartVal > effectiveStart) {
                     effectiveStart = shiftStartVal;
                }
            }

            if (shiftEnd) {
                const shiftEndVal = new Date(shiftEnd).getTime();
                if (nowTime > shiftEndVal) {
                    setStatus("ended");
                    effectiveNow = shiftEndVal;
                } else {
                    setStatus("running");
                }
            } else {
                setStatus("running");
            }

            const diff = effectiveNow - effectiveStart;
            // Prevent negative if weird edge case
            const safeDiff = Math.max(0, diff);
            
            const hours = Math.floor(safeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((safeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((safeDiff % (1000 * 60)) / 1000);
            
            setElapsed(`${hours}h ${minutes}m ${seconds}s`);
        }, 1000);
        return () => clearInterval(interval);
    }, [startedAt, shiftStart, shiftEnd]);

    return (
        <div className="flex flex-col items-end">
             <span className={`font-mono text-xs ${status === 'waiting' ? 'text-orange-600' : status === 'ended' ? 'text-red-600' : 'text-green-700'}`}>
                {elapsed}
            </span>
             {status === 'ended' && <span className="text-[10px] text-red-500 font-bold">KONEC SMĚNY</span>}
        </div>
    );
}

function CheckInButton({ active, onStart, onEnd, loading, myCheckIn, slotShiftId, shiftTimes, date }: any) {
    if (!active) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="w-full"><Button disabled className="w-full">Check-in Start</Button></span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Dostupné pouze v den služby.</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    // Determine state
    // The endpoint returns `myCheckIn` object if active.
    
    const isCheckedInHere = myCheckIn && myCheckIn.shiftId === slotShiftId;
    const isCheckedInElsewhere = myCheckIn && !isCheckedInHere;

    // Calc shift start/end ISO string for Timer
    let shiftStartISO;
    let shiftEndISO;
    if (shiftTimes && date) {
        // Construct ISO from date + shiftTimes.start
        shiftStartISO = `${date}T${shiftTimes.start}:00`; 
        shiftEndISO = `${date}T${shiftTimes.end}:00`;
    }

    if (isCheckedInHere) {
        return (
            <div className="w-full space-y-2">
                <div className="flex justify-between items-center text-sm bg-green-50 p-2 rounded border border-green-200 text-green-800">
                    <span className="font-semibold">Aktuálně běží</span>
                    <CheckInTimer startedAt={myCheckIn.startedAt} shiftStart={shiftStartISO} shiftEnd={shiftEndISO} />
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={onEnd} disabled={loading}>
                    Ukončit službu (Check-out)
                </Button>
            </div>
        );
    }

    if (isCheckedInElsewhere) {
        return (
             <div className="w-full p-2 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded text-xs">
                 Máš aktivní službu jinde! Nejdříve ji ukonči.
             </div>
        );
    }

    return (
        <div className="w-full">
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={onStart} disabled={loading}>
                Zahájit službu (Check-in)
            </Button>
        </div>
    )
}

interface SlotDialogProps {
  isOpen: boolean;
  onClose: () => void;
  slot: { date: string; lesson: number; time?: {start: string, end: string}; shift: HelpdeskShift } | null;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  user: User | null;
  onClaim: () => Promise<void>;
  onUnclaim: () => Promise<void>;
  onAdminSet: (studentIds: string[]) => Promise<void>;
  onAdminClear: () => Promise<void>;
  onCheckInStart?: () => Promise<void>;
  onCheckInEnd?: () => Promise<void>;
  onSwapOffer?: () => Promise<void>;
  onSwapAccept?: (swapId: string) => Promise<void>;
  onSwapCancel?: (swapId: string) => Promise<void>;
}

export function SlotDialog({ isOpen, onClose, slot, role, user, onClaim, onUnclaim, onAdminSet, onAdminClear, onCheckInStart, onCheckInEnd, onSwapOffer, onSwapAccept, onSwapCancel }: SlotDialogProps) {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<User[]>([]);
  const [myCheckIn, setMyCheckIn] = useState<any>(null);

  const [selectedStudents, setSelectedStudents] = useState<string[]>(Array(10).fill("none"));

  // Load students for admin
  useEffect(() => {
    if (isOpen && role === 'ADMIN') {
        const load = async () => {
            try {
                const data = await UsersService.getAllStudents();
                setStudents(data);
                
                if (slot?.shift?.assignees) {
                    const ids = slot.shift.assignees.map(a => a.id);
                    const newSel = Array(10).fill("none");
                    ids.forEach((id, i) => { if (i < 10) newSel[i] = id; });
                    setSelectedStudents(newSel);
                } else {
                    setSelectedStudents(Array(10).fill("none"));
                }
            } catch (e) {
                console.error("Failed to load students", e);
            }
        };
        load();
    }
  }, [isOpen, role, slot]);

  const assignees = slot?.shift.assignees || [];
  const isAssigned = user && assignees.some(a => a.id === user.id);
  const isActiveAssigned = isAssigned; 

  // Load My CheckIn status when dialog opens (if student assigned)
  useEffect(() => {
      if (isOpen && role === 'STUDENT' && isActiveAssigned) {
          const fetchCheckIn = async () => {
             try {
                 const res = await ScheduleService.getMyCheckIn();
                 setMyCheckIn(res);
             } catch(e) { console.error("Checkin fetch failed", e); }
          };
          fetchCheckIn();
      }
  }, [isOpen, role, slot, isActiveAssigned]);

  if (!slot) return null;

  const handleAction = async (action: () => Promise<void>) => {
    setLoading(true);
    try {
      await action();
      // Reload check-in status after action
      if (role === 'STUDENT') {
          const res = await ScheduleService.getMyCheckIn();
          setMyCheckIn(res);
      }
      onClose(); // Close dialog on success
    } catch (e) {
      // toast handled in parent
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAdmin = async () => {
      setLoading(true);
      try {
          const ids = selectedStudents.filter(id => id && id !== "none");
          const uniqueIds = Array.from(new Set(ids));
          await onAdminSet(uniqueIds);
          onClose();
      } catch (e) { } finally { setLoading(false); }
  };

  const isFull = slot.shift.isFull;
  const swaps = slot.shift.swaps || [];

  const dateObj = new Date(slot.date);
  const formattedDate = format(dateObj, "d. MMMM yyyy (EEEE)", { locale: cs });
  const isSlotPast = isPast(dateObj) && !isToday(dateObj); 
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary"/>
              {formattedDate} 
          </DialogTitle>
          <DialogDescription className="text-base font-semibold text-foreground">
             {slot.lesson}. hodina
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Přehled</TabsTrigger>
                <TabsTrigger value="actions">Akce</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 py-4">
                <div className="space-y-2">
                     <div className="flex justify-between items-center text-sm font-medium">
                        <span>Status:</span>
                        <div className="flex gap-2">
                             {swaps.length > 0 && <Badge className="bg-orange-500 hover:bg-orange-600">Výměna</Badge>}
                             {isSlotPast ? (
                                 <Badge variant="outline">Uplynulo</Badge>
                             ) : isFull ? (
                                 <Badge variant="destructive">Obsazeno</Badge>
                             ) : (
                                 <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">Volno</Badge>
                             )}
                        </div>
                     </div>

                     <div className="border rounded-md p-3 space-y-2">
                        <Label className="text-muted-foreground text-xs uppercase tracking-wider">Obsazení helpdesku</Label>
                        {assignees.length === 0 ? (
                             <div className="flex items-center justify-center p-4 text-muted-foreground bg-muted/30 rounded-md text-sm italic">
                                 Zatím nikdo.
                             </div>
                        ) : (
                             <div className="space-y-2">
                                 {assignees.map(a => (
                                     <div key={a.id} className="flex items-center justify-between bg-secondary/20 p-2 rounded-md">
                                         <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">{a.fullName}</span>
                                            {/* @ts-ignore swaps type issue */}
                                            {swaps.some(s => s.offeredBy.id === a.id) && <Badge variant="outline" className="text-[10px] text-orange-600 border-orange-200 bg-orange-50">Nabízí výměnu</Badge>}
                                         </div>
                                         {user?.id === a.id && <Badge className="text-[10px] h-5">Ty</Badge>}
                                     </div>
                                 ))}
                             </div>
                        )}
                     </div>
                </div>

                 {role === 'ADMIN' && (
                     <div className="pt-2">
                         <Label className="text-xs text-muted-foreground">Admin Info:</Label>
                         <p className="text-xs">ID Sloty: {slot.shift.id || "N/A"}</p>
                     </div>
                 )}
            </TabsContent>

            <TabsContent value="actions" className="space-y-4 py-4">
                {role === 'STUDENT' && (
                    <div className="grid gap-3">
                        {!isAssigned && !isFull && !isSlotPast && (
                            <Button onClick={() => handleAction(onClaim)} className="w-full bg-primary" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Přihlásit se na službu
                            </Button>
                        )}

                        {isAssigned && (
                            <div className="p-3 border rounded-md bg-muted/10 space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <Clock className="w-4 h-4"/> Docházka
                                </Label>
                                <div className="flex gap-2">
                                   <CheckInButton 
                                      active={isToday(dateObj)}
                                      onStart={() => handleAction(onCheckInStart!)} 
                                      onEnd={() => handleAction(onCheckInEnd!)} 
                                      loading={loading}
                                      myCheckIn={myCheckIn}
                                      slotShiftId={slot.shift.id}
                                      date={slot.date}
                                      shiftTimes={(LESSON_TIMES as any)[slot.lesson]}
                                   />
                                </div>
                                <p className="text-[10px] text-muted-foreground">Check-in je možný 15 minut před začátkem.</p>
                            </div>
                        )}

                        {(isAssigned || (!isAssigned && swaps.length > 0)) && !isSlotPast && (
                             <div className="p-3 border rounded-md bg-blue-50/50 space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-2 text-blue-700">
                                    <ArrowLeftRight className="w-4 h-4"/> Výměny
                                </Label>
                                
                                {isAssigned ? (
                                    // @ts-ignore swaps type issue
                                    user && swaps.some(s => s.offeredBy.id === user.id) ? (
                                        <>
                                            <p className="text-xs text-orange-700 italic">Tvoje nabídka na výměnu je aktivní.</p>
                                            {/* @ts-ignore swaps type issue */}
                                            <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleAction(async () => await onSwapCancel?.(swaps.find(s => s.offeredBy.id === user.id)!.id))}>
                                                Zrušit nabídku
                                            </Button>
                                        </>
                                    ) : (
                                        <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => handleAction(onSwapOffer!)}>
                                            Nabídnout výměnu
                                        </Button>
                                    )
                                ) : (
                                    swaps.length > 0 && (
                                        // @ts-ignore swaps type issue
                                        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleAction(async () => await onSwapAccept?.(swaps[0].id))}>
                                            {/* @ts-ignore swaps type issue */}
                                            Přijmout výměnu ({swaps[0].offeredBy.fullName})
                                        </Button>
                                    )
                                )}
                             </div>
                        )}

                        {isAssigned && !isSlotPast && (
                             <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 w-full" onClick={() => handleAction(onUnclaim)}>
                                Odhlásit se
                             </Button>
                        )}
                    </div>
                )}
                
                {role === 'ADMIN' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-2 border p-3 rounded-md max-h-[300px] overflow-y-auto">
                           <Label className="text-sm font-medium">Správa studentů (Max 10)</Label>
                           {Array.from({ length: 10 }).map((_, i) => (
                             <Select 
                                key={i} 
                                value={selectedStudents[i]} 
                                onValueChange={(val) => {
                                    const newSel = [...selectedStudents];
                                    newSel[i] = val;
                                    setSelectedStudents(newSel);
                                }}
                             >
                               <SelectTrigger className="h-8 text-xs"><SelectValue placeholder={`Student ${i + 1}`} /></SelectTrigger>
                               <SelectContent>
                                 <SelectItem value="none">-- Prázdné --</SelectItem>
                                 {students.map(s => <SelectItem key={s.id} value={s.id}>{s.fullName}</SelectItem>)}
                               </SelectContent>
                             </Select>
                           ))}
                           <Button onClick={handleSaveAdmin} disabled={loading} className="w-full mt-2">
                             <Save className="mr-2 h-4 w-4" /> Uložit obsazení
                           </Button>
                        </div>
                    </div>
                )}
            </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} size="sm">Zavřít</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
