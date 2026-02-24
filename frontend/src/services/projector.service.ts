import api from '@/lib/api';

export interface Projector {
  id: string;
  classroom: string;
  hasDellDock: boolean;
  isFunctional: boolean;
  hasHdmi: boolean;
  hasHdmiExtension: boolean;
  usbExtensionType: string | null;
  brand: string;
  model: string;
  lampHours: string | null;
  lastInspectionDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectorData {
  classroom: string;
  brand: string;
  model: string;
  hasDellDock?: boolean;
  isFunctional?: boolean;
  hasHdmi?: boolean;
  hasHdmiExtension?: boolean;
  usbExtensionType?: string;
  lampHours?: string;
  lastInspectionDate?: string;
  notes?: string;
}

export type UpdateProjectorData = Partial<CreateProjectorData>;

export const ProjectorService = {
  getAll: async () => {
    const response = await api.get<Projector[]>('/projectors');
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await api.get<Projector>(`/projectors/${id}`);
    return response.data;
  },

  create: async (data: CreateProjectorData) => {
    const response = await api.post<Projector>('/projectors', data);
    return response.data;
  },

  update: async (id: string, data: UpdateProjectorData) => {
    const response = await api.patch<Projector>(`/projectors/${id}`, data);
    return response.data;
  },

  remove: async (id: string) => {
    const response = await api.delete(`/projectors/${id}`);
    return response.data;
  },
};
