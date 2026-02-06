import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertOctagon, XCircle, Clock, Timer, UserCheck } from "lucide-react";
import { CurrentAttendanceStatus } from "@/services/attendance.service";

interface Props {
  totalShifts: number;
  workedShifts: number;
  lateShifts: number;
  noShowShifts: number;
  missingCheckoutShifts: number;
  currentStatus: CurrentAttendanceStatus | null;
}

export function AttendanceStatsCards({ 
  totalShifts, workedShifts, lateShifts, noShowShifts, missingCheckoutShifts, currentStatus 
}: Props) {
    
  const currentSlotSummary = currentStatus?.currentSlot 
    ? `${currentStatus.currentSlot.users.length} na službě (${currentStatus.currentSlot.users.map(u => u.fullName).join(', ')})`
    : 'Nikdo nemá službu';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Odpracováno
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{workedShifts} / {totalShifts}</div>
          <p className="text-xs text-muted-foreground">
            Směn v pořádku nebo s pozdním příchodem
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Problémy (Late / No-Show)
          </CardTitle>
          <AlertOctagon className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lateShifts} / {noShowShifts}</div>
          <p className="text-xs text-muted-foreground">
            Pozdní příchody / Nedostavení se
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Chybějící Checkout
          </CardTitle>
          <Timer className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{missingCheckoutShifts}</div>
          <p className="text-xs text-muted-foreground">
            Směny bez konce
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Právě probíhá
          </CardTitle>
          <UserCheck className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate text-sm" title={currentSlotSummary}>
             {currentStatus?.currentSlot ? (
                 <span className="text-lg">{currentStatus.currentSlot.users.length > 0 ? currentStatus.currentSlot.users.length + " studentů" : "Prázdný slot"}</span>
             ) : (
                 <span className="text-lg text-gray-500">Mimo provoz</span>
             )}
          </div>
          <p className="text-xs text-muted-foreground truncate h-4" title={currentSlotSummary}>
             {currentStatus?.currentSlot?.users.map(u => u.fullName).join(', ')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
