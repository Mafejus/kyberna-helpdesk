"use client";

import { useState, useEffect } from "react";
import { WeeklyCalendar } from "@/components/schedule/WeeklyCalendar";
import { CurrentStatusWidget } from "@/components/schedule/CurrentStatusWidget";
import { SlotDialog } from "@/components/schedule/SlotDialog";
import { ScheduleService } from "@/services/schedule.service";
import { SwapService } from "@/services/swap.service";
import { WeekSchedule, HelpdeskShift } from "@/types/schedule";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function PlanningPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State
  const [currentDate, setCurrentDate] = useState(new Date()); // Represents "start of week" roughly or any date in current week
  const [weekData, setWeekData] = useState<WeekSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; lesson: number; shift: HelpdeskShift } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Helper to get monday of the week for a given date
  const getMonday = (d: Date) => {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  };

  const [mondayDate, setMondayDate] = useState(getMonday(new Date()));

  // Fetch Data
  const loadData = async () => {
    setLoading(true);
    try {
      const startStr = mondayDate.toISOString().split('T')[0];
      const data = await ScheduleService.getWeek(startStr);
      setWeekData(data);
    } catch (error) {
      toast({ title: "Chyba načítání rozvrhu", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [mondayDate]);

  // Handlers
  const handleNavigate = (dir: 'prev' | 'next' | 'today') => {
    const newDate = new Date(mondayDate);
    if (dir === 'today') {
      setMondayDate(getMonday(new Date()));
    } else {
      newDate.setDate(newDate.getDate() + (dir === 'next' ? 7 : -7));
      setMondayDate(newDate);
    }
  };

  const handleSlotClick = (date: string, lesson: number, shift: HelpdeskShift | null) => {
    // If Teacher -> Do nothing (Read only)
    if (user?.role === 'TEACHER') return;
    
    // Create optimistic shift object if null
    const effectiveShift = shift || { id: null, assignees: [], isFull: false };
    
    setSelectedSlot({ date, lesson, shift: effectiveShift });
    setIsDialogOpen(true);
  };

  const onClaim = async () => {
    if (!selectedSlot) return;
    try {
      await ScheduleService.claimSlot(selectedSlot.date, selectedSlot.lesson);
      toast({ title: "Úspěšně přihlášeno" });
      await loadData(); // Refresh
    } catch (error: any) {
      toast({ 
        title: "Chyba přihlášení", 
        description: error.response?.data?.message || "Něco se pokazilo.", 
        variant: "destructive" 
      });
      throw error; // Re-throw for dialog loading state
    }
  };

  const onUnclaim = async () => {
    if (!selectedSlot) return;
    try {
      await ScheduleService.unclaimSlot(selectedSlot.date, selectedSlot.lesson);
      toast({ title: "Úspěšně odhlášeno" });
      await loadData();
    } catch (error: any) {
      toast({ 
        title: "Chyba odhlášení", 
        description: error.response?.data?.message || "Něco se pokazilo.", 
        variant: "destructive" 
      });
      throw error;
    }
  };

  const onAdminClear = async () => {
    if (!selectedSlot || !selectedSlot.shift.id) return;
    // We need to loop remove or implement clear endpoint. 
    // Plan said "remove student", maybe "clear" wasn't explicitly bulk endpoint in my plan?
    // User prompt said "tlačítko vymazat slot (odebere všechny)".
    // I didn't implement bulk clear in API explicitly, but I have `adminRemove`.
    // I can just iterate over current assignees.
    // Or I implemented `adminSetSlot` which can set to empty list!
    // Yes, `adminSetSlot(date, lesson, [])` clears it.
    
    try {
      await ScheduleService.adminSetSlot(selectedSlot.date, selectedSlot.lesson, []);
      toast({ title: "Slot vymazán" });
      await loadData();
    } catch (error: any) {
       toast({ title: "Chyba", description: error.message, variant: "destructive" });
    }
  };

  const onAdminSet = async (studentIds: string[]) => {
    if (!selectedSlot) return;
    try {
      await ScheduleService.adminSetSlot(selectedSlot.date, selectedSlot.lesson, studentIds);
      toast({ title: "Slot aktualizován" });
      await loadData();
    } catch (error: any) {
       toast({ title: "Chyba", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Plánování Helpdesku</h1>
        <p className="text-muted-foreground mt-2">
          Přehled služeb nápovědy. {user?.role === 'STUDENT' ? "Klikni na slot pro přihlášení." : "Správa služeb."}
        </p>
      </div>

      <WeeklyCalendar 
        startDate={mondayDate}
        weekData={weekData}
        loading={loading}
        onNavigate={handleNavigate}
        onSlotClick={handleSlotClick}
      />

      <div className="border-t pt-8">
        <CurrentStatusWidget />
      </div>

      <SlotDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        slot={selectedSlot}
        role={user?.role || 'STUDENT'}
        user={user}
        onClaim={onClaim}
        onUnclaim={onUnclaim}
        onAdminSet={onAdminSet}
        onAdminClear={onAdminClear}
        
        onCheckInStart={async () => {
            if (!selectedSlot) return;
            try {
                await ScheduleService.startCheckIn(selectedSlot.date, selectedSlot.lesson);
                toast({ title: "Check-in zahájen" });
            } catch (e: any) {
                toast({ 
                    variant: "destructive", 
                    title: "Chyba check-in",
                    description: e.response?.data?.message || e.message || "Něco se pokazilo"
                });
            }
        }}
        onCheckInEnd={async () => {
            if (!selectedSlot || !selectedSlot.shift.id) return;
            try {
                // We need shiftId. 
                await ScheduleService.endCheckIn(selectedSlot.shift.id);
                toast({ title: "Služba ukončena" });
            } catch (e) {
                 toast({ variant: "destructive", title: "Chyba" });
            }
        }}
        onSwapOffer={async () => {
            if (!selectedSlot) return;
            try {
                await SwapService.createOffer(selectedSlot.date, selectedSlot.lesson);
                toast({ title: "Výměna nabídnuta" });
                await loadData();
            } catch(e) {
                toast({ variant: "destructive", title: "Chyba nabídky" });
            }
        }}
        onSwapAccept={async (swapId) => {
            try {
                await SwapService.acceptOffer(swapId);
                toast({ title: "Výměna přijata" });
                await loadData();
            } catch(e) {
                toast({ variant: "destructive", title: "Chyba přijetí" });
            }
        }}
      />
    </div>
  );
}
