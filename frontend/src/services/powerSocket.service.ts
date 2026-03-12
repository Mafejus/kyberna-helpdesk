import api from "@/lib/api";

export interface PowerSocket {
  id: string;
  number: number;
  isWorking: boolean;
  note: string | null;
  classroomId: string;
}

export const PowerSocketService = {
  getSockets: async (classroomId: string): Promise<PowerSocket[]> => {
    const response = await api.get<PowerSocket[]>(
      `/classrooms/${classroomId}/sockets`
    );
    return response.data;
  },

  generateSockets: async (classroomId: string) => {
    const response = await api.post(
      `/classrooms/${classroomId}/sockets/generate`
    );
    return response.data;
  },

  updateSocket: async (
    socketId: string,
    data: { isWorking?: boolean; note?: string }
  ): Promise<PowerSocket> => {
    const response = await api.patch<PowerSocket>(
      `/sockets/${socketId}`,
      data
    );
    return response.data;
  },
};
