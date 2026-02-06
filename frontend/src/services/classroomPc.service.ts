import api from "@/lib/api";

export interface PcProperty {
  id: string;
  classroomId: string;
  key: string;
  label: string;
  type: 'BOOLEAN' | 'TEXT';
  order: number;
}

export interface PcValue {
  id: string;
  pcId: string;
  propertyId: string;
  valueBool: boolean | null;
  valueText: string | null;
}

export interface ClassroomPc {
  id: string;
  classroomId: string;
  label: string; // Changed from pcNumber
  note: string | null;
  values: PcValue[]; // Dynamic values
  updatedAt: string;
}

export interface CreatePcDto {
  label: string;
  note?: string;
}

export interface UpdatePcDto {
  label?: string;
  note?: string;
}

export const ClassroomPcService = {
  getAll: async (classroomId: string) => {
    const response = await api.get<ClassroomPc[]>(`/classrooms/${classroomId}/pcs`);
    return response.data;
  },

  getProperties: async (classroomId: string) => {
      const response = await api.get<PcProperty[]>(`/classrooms/${classroomId}/pc-properties`);
      return response.data;
  },

  create: async (classroomId: string, data: CreatePcDto) => {
    const response = await api.post<ClassroomPc>(`/classrooms/${classroomId}/pcs`, data);
    return response.data;
  },

  update: async (classroomId: string, pcId: string, data: UpdatePcDto) => {
    const response = await api.patch<ClassroomPc>(`/classrooms/${classroomId}/pcs/${pcId}`, data);
    return response.data;
  },
  
  updateValues: async (classroomId: string, pcId: string, values: { propertyId: string, valueBool?: boolean, valueText?: string }[]) => {
      const response = await api.patch<any>(`/classrooms/${classroomId}/pcs/${pcId}/values`, { values });
      return response.data;
  },

  delete: async (classroomId: string, pcId: string) => {
    await api.delete(`/classrooms/${classroomId}/pcs/${pcId}`);
  },

  generate: async (classroomId: string) => {
    const response = await api.post(`/classrooms/${classroomId}/pcs/generate`);
    return response.data;
  },

  // Property Management
  createProperty: async (classroomId: string, data: { key: string, label: string, type: 'BOOLEAN'|'TEXT', order?: number }) => {
      const response = await api.post(`/classrooms/${classroomId}/pc-properties`, data);
      return response.data;
  },

  deleteProperty: async (classroomId: string, propId: string) => {
      await api.delete(`/classrooms/${classroomId}/pc-properties/${propId}`);
  },
  
  reorderProperties: async (classroomId: string, items: { id: string, order: number }[]) => {
      await api.patch(`/classrooms/${classroomId}/pc-properties/reorder`, items);
  }
};
