import { api } from './api';

interface UploadResponse {
  url: string;
}

const upload = async (endpoint: string, file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post<UploadResponse>(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const uploadService = {
  uploadArticleImage: (file: File) => upload('/upload/article', file),
  uploadActivityImage: (file: File) => upload('/upload/activity', file),
  uploadAvatar: (file: File) => upload('/upload/avatar', file),
};
