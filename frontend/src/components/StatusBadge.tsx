import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type TicketStatus = 'UNASSIGNED' | 'IN_PROGRESS' | 'DONE_WAITING_APPROVAL' | 'APPROVED' | 'REJECTED';

interface StatusBadgeProps {
  status: TicketStatus | string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  UNASSIGNED: {
    label: 'Čeká na přiřazení',
    className: 'bg-slate-500 hover:bg-slate-600 text-white',
  },
  IN_PROGRESS: {
    label: 'V řešení',
    className: 'bg-primary hover:bg-primary/90 text-primary-foreground',
  },
  DONE_WAITING_APPROVAL: {
    label: 'Čeká na schválení',
    className: 'bg-warning hover:bg-warning/90 text-warning-foreground',
  },
  APPROVED: {
    label: 'Schváleno',
    className: 'bg-success hover:bg-success/90 text-success-foreground',
  },
  REJECTED: {
    label: 'Vráceno',
    className: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'bg-gray-500 text-white' };

  return (
    <Badge className={cn(config.className, className, "whitespace-nowrap")}>
      {config.label}
    </Badge>
  );
}
