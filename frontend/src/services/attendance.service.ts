import api from '@/lib/api';

export interface AttendanceSummary {
  id: string;
  fullName: string;
  email: string;
  totalShifts: number;
  workedShifts: number;
  stats: {
    cleanWorked: number;
    late: number;
    noShow: number;
    missingCheckout: number;
  };
  totalMinutesWorked: number;
  reliability: number;
}

export interface AttendanceStudentDetail {
  id: string;
  date: string;       // YYYY-MM-DD
  lesson: number;
  plannedStart?: string;
  plannedEnd?: string;
  checkInAt?: string; // ISO
  checkOutAt?: string; // ISO
  status: 'WORKED' | 'LATE' | 'NO_SHOW' | 'MISSING_CHECKOUT' | 'IN_PROGRESS' | 'UPCOMING';
  minutesWorked: number;
  lateByMinutes: number;
}

export interface AttendanceWeekData {
  [date: string]: {
     [lesson: number]: {
        assignees: {
           user: { id: string; fullName: string };
           status: string;
        }[];
     };
  };
}

export interface CurrentAttendanceStatus {
    currentSlot: {
        lesson: number;
        date: string;
        users: {
            fullName: string;
            hasCheckIn: boolean;
            checkInStart?: string;
        }[];
    } | null;
}

export const AttendanceService = {
  getSummary: async (from: string, to: string) => {
    const response = await api.get<AttendanceSummary[]>('/attendance/summary', { params: { from, to } });
    return response.data;
  },
  
  getStudentDetail: async (id: string, from?: string, to?: string) => {
    const response = await api.get<AttendanceStudentDetail[]>(`/attendance/students/${id}`, { params: { from, to } });
    return response.data;
  },
  
  getCalendarWeek: async (start: string) => {
    const response = await api.get<AttendanceWeekData>('/attendance/calendar/week', { params: { start } });
    return response.data;
  },
  
  getCurrentStatus: async () => {
    const response = await api.get<CurrentAttendanceStatus>('/attendance/now');
    return response.data;
  },
  
  getExportUrl: (from: string, to: string) => {
    // Return URL for button
    const baseURL = api.defaults.baseURL || '';
    return `${baseURL}/attendance/export?from=${from}&to=${to}`; 
    // Note: Bearer token needs to be handled? 
    // Browser navigation won't send header automatically.
    // If strict JWT is required, we might need a Blob download method.
    // But for CSV export simple link is often preferred if cookie auth or similar.
    // However, we depend on "Bearer ..." header. 
    // Best practice: download via Axios and blob.
  },
  
  downloadExport: async (from: string, to: string) => {
      const response = await api.get('/attendance/export', { 
          params: { from, to },
          responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance-${from}-${to}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
  }
};
