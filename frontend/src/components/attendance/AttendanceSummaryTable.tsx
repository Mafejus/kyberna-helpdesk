import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { AttendanceSummary } from "@/services/attendance.service";

interface Props {
  data: AttendanceSummary[];
  onViewDetail: (studentId: string) => void;
}

export function AttendanceSummaryTable({ data, onViewDetail }: Props) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Spolehlivost</TableHead>
            <TableHead>Směny (Celkem)</TableHead>
            <TableHead className="text-green-600">Odpracováno</TableHead>
            <TableHead className="text-orange-600">Pozdě</TableHead>
            <TableHead className="text-red-600">No-Show</TableHead>
            <TableHead className="text-purple-600">M. Checkout</TableHead>
            <TableHead>Odpracováno (min)</TableHead>
            <TableHead className="text-right">Akce</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
             <TableRow>
                 <TableCell colSpan={10} className="text-center h-24 text-muted-foreground">
                     Žádná data pro vybrané období.
                 </TableCell>
             </TableRow>
          ) : (
            data.map((student) => (
                <TableRow key={student.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onViewDetail(student.id)}>
                <TableCell className="font-medium">{student.fullName}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                    <Badge variant={student.reliability >= 90 ? 'default' : student.reliability >= 70 ? 'secondary' : 'destructive'}>
                        {student.reliability}%
                    </Badge>
                </TableCell>
                <TableCell>{student.totalShifts}</TableCell>
                <TableCell className="text-green-600 font-bold">{student.stats.cleanWorked}</TableCell>
                <TableCell className="text-orange-600 font-bold">{student.stats.late}</TableCell>
                <TableCell className="text-red-600 font-bold">{student.stats.noShow}</TableCell>
                <TableCell className="text-purple-600 font-bold">{student.stats.missingCheckout}</TableCell>
                <TableCell>{student.totalMinutesWorked} min</TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onViewDetail(student.id); }}>
                        <Eye className="h-4 w-4" />
                    </Button>
                </TableCell>
                </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
