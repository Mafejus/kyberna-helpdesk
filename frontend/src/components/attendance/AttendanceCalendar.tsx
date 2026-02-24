import { useEffect, useState, Fragment } from "react";
import { AttendanceService, AttendanceWeekData } from "@/services/attendance.service";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AttendanceStatusBadge } from "./AttendanceStatusBadge";
import { LESSON_TIMES } from "@/lib/constants";
import { ChevronLeft, ChevronRight, Check, X, Clock, AlertTriangle, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addDays, format, startOfWeek } from "date-fns";
import { cs } from "date-fns/locale";

// Helper for status icon
function StatusIcon({ status }: { status: string }) {
    switch(status) {
        case 'WORKED': return <Check className="h-3 w-3 text-green-600" />;
        case 'LATE': return <AlertTriangle className="h-3 w-3 text-orange-600" />;
        case 'NO_SHOW': return <X className="h-3 w-3 text-red-600" />;
        case 'MISSING_CHECKOUT': return <Clock className="h-3 w-3 text-purple-600" />;
        case 'IN_PROGRESS': return <Clock className="h-3 w-3 text-blue-600" />;
        default: return null;
    }
}

export function AttendanceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date()); // Any date in the week
  const [data, setData] = useState<AttendanceWeekData | null>(null);
  const [loading, setLoading] = useState(false);

  // Derive Monday of current week
  const monday = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDates = [0, 1, 2, 3, 4].map((i) => addDays(monday, i));
  const weekStartStr = format(monday, 'yyyy-MM-dd');

  useEffect(() => {
    setLoading(true);
    AttendanceService.getCalendarWeek(weekStartStr)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [weekStartStr]);

  const handlePrev = () => setCurrentDate(d => addDays(d, -7));
  const handleNext = () => setCurrentDate(d => addDays(d, 7));
  const handleToday = () => setCurrentDate(new Date());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium capitalize">
            {format(monday, 'MMMM yyyy', { locale: cs })} (Týden {format(monday, 'w')})
        </h3>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrev}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={handleToday}>Dnes</Button>
            <Button variant="outline" size="sm" onClick={handleNext}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="rounded-md border p-4 overflow-x-auto bg-card text-card-foreground shadow-sm">
        {loading && !data ? (
           <div className="space-y-2">
               {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
           </div>
        ) : (
           <div className="grid grid-cols-[auto_repeat(5,1fr)] gap-2 min-w-[800px]">
               {/* Header Row */}
               <div className="p-2 font-bold text-center border-b">Hodina</div>
               {weekDates.map(d => (
                   <div key={d.toISOString()} className="p-2 font-bold text-center border-b bg-muted/20">
                       <div className="capitalize">{format(d, 'EEEE', { locale: cs })}</div>
                       <div className="text-xs text-muted-foreground">{format(d, 'd.M.')}</div>
                   </div>
               ))}
               
               {/* Rows 1-12 */}
               {Array.from({length: 12}, (_, i) => i + 1).map(lesson => (
                   <Fragment key={lesson}>
                       <div className="p-2 text-center text-sm font-medium border-r flex flex-col justify-center bg-muted/10">
                           <span>{lesson}.</span>
                           {/* Add times if needed */}
                       </div>
                       {weekDates.map(d => {
                           const dateStr = format(d, 'yyyy-MM-dd');
                           const slot = data?.[dateStr]?.[lesson];
                           return (
                               <div key={`${dateStr}-${lesson}`} className="p-1 border rounded-sm min-h-[40px] text-xs relative hover:bg-muted/50 transition-colors">
                                   {slot?.assignees.length === 0 && <span className="text-muted-foreground/30">-</span>}
                                   <div className="flex flex-wrap gap-1">
                                       {slot?.assignees.map((a, idx) => (
                                            <div key={idx} className="flex items-center gap-1 bg-card text-card-foreground border px-1.5 py-0.5 rounded shadow-sm w-full truncate" title={`${a.user.fullName} - ${a.status}`}>
                                               <StatusIcon status={a.status} />
                                               <span className="truncate max-w-[80px]">{a.user.fullName.split(' ')[0]}</span>
                                           </div>
                                       ))}
                                   </div>
                               </div>
                           );
                       })}
                   </Fragment>
               ))}
           </div>
        )}
      </div>
    </div>
  );
}
