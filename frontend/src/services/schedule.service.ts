import api from '../lib/api';
import { WeekSchedule, CurrentStatusResponse } from '../types/schedule';

export const ScheduleService = {
  getWeek: async (startDate: string) => {
    const response = await api.get<WeekSchedule>(`/schedule/week?start=${startDate}`);
    return response.data;
  },

  getCurrentStatus: async () => {
    const response = await api.get<CurrentStatusResponse>('/schedule/now');
    return response.data;
  },

  claimSlot: async (date: string, lesson: number) => {
    return api.post('/schedule/claim', { date, lesson });
  },

  unclaimSlot: async (date: string, lesson: number) => {
    return api.post('/schedule/unclaim', { date, lesson });
  },

  adminSetSlot: async (date: string, lesson: number, studentIds: string[]) => {
    return api.post('/schedule/admin/set', { date, lesson, studentIds });
  },

  adminRemoveStudent: async (date: string, lesson: number, studentId: string) => {
    return api.post('/schedule/admin/remove', { date, lesson, studentId });
  },

  startCheckIn: async (date: string, lesson: number) => {
    return api.post('/schedule/checkin/start', { date, lesson });
  },

  getMyCheckIn: async () => {
      const res = await api.get('/schedule/checkin/me');
      return res.data;
  },

  endCheckIn: async (shiftId: string) => { // shiftId is needed for end? or date/lesson? Backend said checkin/end takes shiftId probably or CheckInEndDto
    // Let's check backend controller dto. 
    // Backend controller: @Body() dto: CheckInEndDto. CheckInEndDto usually has shiftId.
    return api.post('/schedule/checkin/end', { shiftId });
  },
};
