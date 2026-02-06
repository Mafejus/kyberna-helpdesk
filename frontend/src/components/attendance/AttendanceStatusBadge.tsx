import { Badge } from "@/components/ui/badge";

type Status = 'WORKED' | 'LATE' | 'NO_SHOW' | 'MISSING_CHECKOUT' | 'IN_PROGRESS' | 'UPCOMING';

interface Props {
  status: string; // string from backend
  className?: string; 
}

export function AttendanceStatusBadge({ status, className }: Props) {
  const s = status as Status;
  
  switch (s) {
    case 'WORKED':
      return <Badge className={`bg-green-500 hover:bg-green-600 ${className}`}>Odpracováno</Badge>;
    case 'LATE':
      return <Badge className={`bg-orange-500 hover:bg-orange-600 ${className}`}>Pozdě</Badge>;
    case 'NO_SHOW':
      return <Badge variant="destructive" className={className}>No-Show</Badge>; // Usually red
    case 'MISSING_CHECKOUT':
      return <Badge className={`bg-purple-500 hover:bg-purple-600 ${className}`}>Chybí checkout</Badge>;
    case 'IN_PROGRESS':
      return <Badge className={`bg-blue-500 hover:bg-blue-600 ${className}`}>Probíhá</Badge>;
    case 'UPCOMING':
      return <Badge className={`bg-gray-400 hover:bg-gray-500 ${className}`}>Budoucí</Badge>;
    default:
      return <Badge variant="outline" className={className}>{status}</Badge>;
  }
}
