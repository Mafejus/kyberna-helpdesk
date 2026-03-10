import api from '@/lib/api';

export type EquipmentType = 'PROJECTOR' | 'AUDIO' | 'HUB' | 'ACCESS_POINT';

export interface Equipment {
  id: string;
  equipmentType: EquipmentType;
  classroom: string;
  brand: string | null;
  model: string | null;
  isFunctional: boolean;
  lastInspectionDate: string | null;
  notes: string | null;
  // Projector-specific
  hasDellDock: boolean;
  hasHdmi: boolean;
  hasHdmiExtension: boolean;
  usbExtensionType: string | null;
  lampHours: string | null;
  // Hub-specific
  hubType: string | null;
  // Audio-specific
  audioStatus: string | null;
  missingItems: string | null;
  // AP-specific
  apType: string | null;
  hasEduroam: boolean;
  hasGuestNetwork: boolean;
  createdAt: string;
  updatedAt: string;
}

// Legacy alias for backward compatibility
export type Projector = Equipment;

export interface CreateEquipmentData {
  equipmentType?: EquipmentType;
  classroom: string;
  brand?: string;
  model?: string;
  isFunctional?: boolean;
  lastInspectionDate?: string;
  notes?: string;
  // Projector-specific
  hasDellDock?: boolean;
  hasHdmi?: boolean;
  hasHdmiExtension?: boolean;
  usbExtensionType?: string;
  lampHours?: string;
  // Hub-specific
  hubType?: string;
  // Audio-specific
  audioStatus?: string;
  missingItems?: string;
  // AP-specific
  apType?: string;
  hasEduroam?: boolean;
  hasGuestNetwork?: boolean;
}

export type CreateProjectorData = CreateEquipmentData;
export type UpdateEquipmentData = Partial<CreateEquipmentData>;
export type UpdateProjectorData = UpdateEquipmentData;

export const ProjectorService = {
  getAll: async (type?: EquipmentType) => {
    const params = type ? { params: { type } } : {};
    const response = await api.get<Equipment[]>('/projectors', params);
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await api.get<Equipment>(`/projectors/${id}`);
    return response.data;
  },

  create: async (data: CreateEquipmentData) => {
    const response = await api.post<Equipment>('/projectors', data);
    return response.data;
  },

  update: async (id: string, data: UpdateEquipmentData) => {
    const response = await api.patch<Equipment>(`/projectors/${id}`, data);
    return response.data;
  },

  remove: async (id: string) => {
    const response = await api.delete(`/projectors/${id}`);
    return response.data;
  },
};
