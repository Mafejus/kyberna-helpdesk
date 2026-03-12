import api from "@/lib/api";

export interface SocketProperty {
  id: string;
  classroomId: string;
  key: string;
  label: string;
  type: "BOOLEAN" | "TEXT";
  order: number;
}

export interface SocketPropertyValue {
  id: string;
  socketId: string;
  propertyId: string;
  valueBool: boolean | null;
  valueText: string | null;
}

export interface PowerSocket {
  id: string;
  number: number;
  isWorking: boolean;
  note: string | null;
  classroomId: string;
  values: SocketPropertyValue[];
}

export const PowerSocketService = {
  // Sockets
  getSockets: async (classroomId: string): Promise<PowerSocket[]> => {
    const res = await api.get<PowerSocket[]>(`/classrooms/${classroomId}/sockets`);
    return res.data;
  },

  generateSockets: async (classroomId: string) => {
    const res = await api.post(`/classrooms/${classroomId}/sockets/generate`);
    return res.data;
  },

  createSocket: async (classroomId: string, data?: { number?: number; note?: string }): Promise<PowerSocket> => {
    const res = await api.post<PowerSocket>(`/classrooms/${classroomId}/sockets`, data ?? {});
    return res.data;
  },

  updateSocket: async (
    socketId: string,
    data: { isWorking?: boolean; note?: string; number?: number }
  ): Promise<PowerSocket> => {
    const res = await api.patch<PowerSocket>(`/sockets/${socketId}`, data);
    return res.data;
  },

  deleteSocket: async (socketId: string): Promise<void> => {
    await api.delete(`/sockets/${socketId}`);
  },

  updateValues: async (
    socketId: string,
    values: { propertyId: string; valueBool?: boolean; valueText?: string }[]
  ) => {
    const res = await api.patch(`/sockets/${socketId}/values`, { values });
    return res.data;
  },

  // Properties
  getProperties: async (classroomId: string): Promise<SocketProperty[]> => {
    const res = await api.get<SocketProperty[]>(`/classrooms/${classroomId}/socket-properties`);
    return res.data;
  },

  createProperty: async (
    classroomId: string,
    data: { key: string; label: string; type: "BOOLEAN" | "TEXT"; order?: number }
  ): Promise<SocketProperty> => {
    const res = await api.post<SocketProperty>(`/classrooms/${classroomId}/socket-properties`, data);
    return res.data;
  },

  deleteProperty: async (propId: string): Promise<void> => {
    await api.delete(`/socket-properties/${propId}`);
  },

  reorderProperties: async (classroomId: string, items: { id: string; order: number }[]) => {
    await api.patch(`/classrooms/${classroomId}/socket-properties/reorder`, items);
  },
};
