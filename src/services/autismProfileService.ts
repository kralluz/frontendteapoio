import api from './api';

export interface AutismProfile {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  level: string;
  interests: string[];
  sensitivities: string[];
  strengths: string[];
  challenges: string[];
  notes?: string;
  photo?: string;
  parentId: string;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
  birthDate?: string;
  diagnosisDate?: string;
}

export interface CreateProfileData {
  name: string;
  age: number;
  diagnosis: string;
  level: string;
  interests: string[];
  sensitivities: string[];
  strengths: string[];
  challenges: string[];
  notes?: string;
  photo?: string;
  birthDate?: string;
  diagnosisDate?: string;
}

export const autismProfileService = {
  async getAll(): Promise<AutismProfile[]> {
    const response = await api.get<AutismProfile[]>('/autism-profiles');
    return response.data;
  },

  async getById(id: string): Promise<AutismProfile> {
    const response = await api.get<AutismProfile>(`/autism-profiles/${id}`);
    return response.data;
  },

  async create(data: CreateProfileData): Promise<AutismProfile> {
    const response = await api.post<AutismProfile>('/autism-profiles', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateProfileData>): Promise<AutismProfile> {
    const response = await api.put<AutismProfile>(`/autism-profiles/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/autism-profiles/${id}`);
  }
};
