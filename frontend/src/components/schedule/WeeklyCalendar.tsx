"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { LESSON_TIMES, LessonNumber } from "@/lib/constants";
import { WeekSchedule, HelpdeskShift } from "@/types/schedule";

interface WeeklyCalendarProps {
  startDate: Date;
  weekData: WeekSchedule | null;
  loading: boolean;
  onNavigate: (direction: 'prev' | 'next' | 'today') => void;
  onSlotClick: (date: string, lesson: number, shift: HelpdeskShift | null) => void;
}

export function WeeklyCalendar({ startDate, weekData, loading, onNavigate, onSlotClick }: WeeklyCalendarProps) {
  
  // Helpers to generate Mon-Fri dates based on startDate
  const getWeekDays = (start: Date) => {
    const days = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays(startDate);
  // Format date for display: "Po 16.1."
  const formatDayHeader = (date: Date) => {
    const dayName = date.toLocaleDateString('cs-CZ', { weekday: 'short' });
    const dateStr = date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' });
    return `${dayName} ${dateStr}`;
  };

  // Helper to get shift from data
  const getShift = (date: Date, lesson: number): HelpdeskShift | null => {
    if (!weekData) return null;
    const dateKey = date.toISOString().split('T')[0];
    return weekData[dateKey]?.[lesson] || null;
  };

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center gap-2">
           <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
             <CalendarIcon className="w-5 h-5 text-indigo-600" />
             Týden {startDate.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long' })}
           </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onNavigate('prev')}>
            <ChevronLeft className="w-4 h-4" /><span className="hidden sm:inline"> Předchozí</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigate('today')}>
             Dnes
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigate('next')}>
            <span className="hidden sm:inline">Další </span><ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="border rounded-md shadow-sm overflow-x-auto bg-card">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-[100px] text-center font-bold">Hodina</TableHead>
              {weekDays.map(day => (
                <TableHead key={day.toISOString()} className="text-center min-w-[140px]">
                  <div className={`py-2 px-3 rounded-md inline-block ${day.toDateString() === new Date().toDateString() ? 'bg-indigo-100 text-indigo-800' : ''}`}>
                    {formatDayHeader(day)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(LESSON_TIMES).map(([lessonStr, time]) => {
              const lesson = parseInt(lessonStr);
              return (
                <TableRow key={lesson}>
                  <TableCell className="text-center bg-muted/20 border-r p-2">
                    <div className="flex flex-col items-center justify-center">
                      <span className="font-bold text-lg text-foreground">{lesson}</span>
                      <span className="text-xs text-muted-foreground">{time.start}<br/>{time.end}</span>
                    </div>
                  </TableCell>
                  {weekDays.map(day => {
                     const shift = getShift(day, lesson);
                     const isFull = shift?.isFull;
                     const assignees = shift?.assignees || [];
                     const count = assignees.length;
                     const hasSwap = shift?.swaps && shift.swaps.length > 0;

                     return (
                       <TableCell 
                          key={day.toISOString()} 
                          className={`p-1 cursor-pointer transition-colors hover:bg-muted/50 ${isFull ? 'bg-red-50/30' : ''}`}
                          onClick={() => onSlotClick(day.toISOString().split('T')[0], lesson, shift)}
                       >
                         <div className={`h-full min-h-[60px] w-full rounded border p-2 flex flex-col gap-1 items-center justify-center text-center relative
                           ${count === 0 ? 'border-dashed border-muted text-muted-foreground' : ''}
                           ${count > 0 && count < 10 ? 'border-indigo-200 bg-indigo-50/50' : ''}
                           ${count >= 10 ? 'border-red-200 bg-red-50/50' : ''}
                           ${hasSwap ? 'border-orange-400 bg-orange-50/80 ring-1 ring-orange-300' : ''}
                         `}>
                           {hasSwap && (
                               <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 animate-pulse" title="Nabídka výměny" />
                           )}
                           {count === 0 && <span className="text-xs">Volno</span>}
                           <div className="flex flex-wrap gap-1 justify-center w-full">
                               {assignees.map(a => (
                                 <span key={a.id} className="text-[10px] px-1 bg-white/50 rounded border border-black/5 truncate max-w-[60px]" title={a.fullName}>
                                   {a.fullName.split(' ')[0]}
                                 </span>
                               ))}
                           </div>
                           {count > 0 && (
                             <Badge variant={isFull ? "destructive" : "secondary"} className="text-[10px] h-4 px-1 mt-1">
                               {isFull ? "FULL " : ""}{count}/10
                             </Badge>
                           )}
                         </div>
                       </TableCell>
                     );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
