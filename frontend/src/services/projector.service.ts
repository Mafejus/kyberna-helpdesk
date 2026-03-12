import api from '@/lib/api';

export type EquipmentType = 'PROJECTOR' | 'AUDIO' | 'HUB' | 'ACCESS_POINT' | 'OTHER';
export type PropertyType = 'BOOLEAN' | 'TEXT';

export interface EquipmentPropertyDef {
  id: string;
  equipmentType: EquipmentType;
  key: string;
  label: string;
  type: PropertyType;
  order: number;
}

export interface EquipmentPropertyValue {
  id: string;
  equipmentId: string;
  propertyId: string;
  valueBool: boolean | null;
  valueText: string | null;
  property: EquipmentPropertyDef;
}

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
  // Dynamic properties
  propertyValues: EquipmentPropertyValue[];
  createdAt: string;
  updatedAt: string;
}

// Legacy aliases
export type Projector = Equipment;

export interface CreateEquipmentData {
  equipmentType?: EquipmentType;
  classroom: string;
  brand?: string;
  model?: string;
  isFunctional?: boolean;
  lastInspectionDate?: string;
  notes?: string;
  hasDellDock?: boolean;
  hasHdmi?: boolean;
  hasHdmiExtension?: boolean;
  usbExtensionType?: string;
  lampHours?: string;
  hubType?: string;
  audioStatus?: string;
  missingItems?: string;
  apType?: string;
  hasEduroam?: boolean;
  hasGuestNetwork?: boolean;
}

export type CreateProjectorData = CreateEquipmentData;
export type UpdateEquipmentData = Partial<CreateEquipmentData>;
export type UpdateProjectorData = UpdateEquipmentData;

export interface CreatePropertyData {
  equipmentType: EquipmentType;
  key: string;
  label: string;
  type?: PropertyType;
  order?: number;
}

export interface PropertyValueItem {
  propertyId: string;
  valueBool?: boolean;
  valueText?: string;
}

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

  // Property definitions
  getProperties: async (type: EquipmentType) => {
    const response = await api.get<EquipmentPropertyDef[]>('/projectors/property-defs', {
      params: { type },
    });
    return response.data;
  },

  createProperty: async (data: CreatePropertyData) => {
    const response = await api.post<EquipmentPropertyDef>('/projectors/property-defs', data);
    return response.data;
  },

  deleteProperty: async (id: string) => {
    const response = await api.delete(`/projectors/property-defs/${id}`);
    return response.data;
  },

  // Property values
  updateValues: async (equipmentId: string, values: PropertyValueItem[]) => {
    const response = await api.patch(`/projectors/${equipmentId}/values`, { values });
    return response.data;
  },
};
