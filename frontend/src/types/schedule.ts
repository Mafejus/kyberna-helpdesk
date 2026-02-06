export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
}

export interface ShiftAssignee {
  id: string; // user id
  fullName: string;
  email: string;
}

export interface HelpdeskShift {
  id: string | null;
  assignees: ShiftAssignee[];
  isFull: boolean;
  swaps?: { id: string }[];
}

export interface WeekSchedule {
  [date: string]: {
    [lesson: number]: HelpdeskShift;
  };
}

export interface SlotStatus {
  date: string;
  lesson: number;
  time: { start: string; end: string };
  assignees: ShiftAssignee[];
  until?: string; // e.g. "09:30"
}

export interface CurrentStatusResponse {
  current: SlotStatus | null;
  next: SlotStatus | null;
}
