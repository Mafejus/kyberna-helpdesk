import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AttendanceService, AttendanceStudentDetail } from "@/services/attendance.service";
import { AttendanceStatusBadge } from "./AttendanceStatusBadge";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface Props {
  studentId: string | null;
  onClose: () => void;
  dateRange: { from: string; to: string };
  studentName?: string;
}

export function StudentAttendanceDetailDialog({ studentId, onClose, dateRange, studentName }: Props) {
  const [data, setData] = useState<AttendanceStudentDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (studentId) {
      setLoading(true);
      AttendanceService.getStudentDetail(studentId, dateRange.from, dateRange.to)
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [studentId, dateRange]);

  return (
    <Dialog open={!!studentId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail docházky: {studentName || 'Student'}</DialogTitle>
          <DialogDescription>
            Přehled služeb v období {dateRange.from} – {dateRange.to}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Hodina</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>Konec</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Odpracováno</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                    Žádné záznamy v tomto období.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.lesson}.</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{row.plannedStart}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{row.plannedEnd}</TableCell>
                    <TableCell>
                         {row.checkInAt ? format(new Date(row.checkInAt), 'HH:mm') : '-'}
                         {row.lateByMinutes > 0 && <span className="text-orange-600 text-xs ml-1">(+{row.lateByMinutes}m)</span>}
                    </TableCell>
                    <TableCell>{row.checkOutAt ? format(new Date(row.checkOutAt), 'HH:mm') : '-'}</TableCell>
                    <TableCell>
                      <AttendanceStatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {row.minutesWorked} min
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
