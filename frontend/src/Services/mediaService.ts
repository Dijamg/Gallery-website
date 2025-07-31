import axios from 'axios';
import { MediaItem } from '../types';
import authHeader from './auth-headers';

const API_URL = `${import.meta.env.VITE_MEDIA_BACKEND_BASE_URL}/media/`;

const getAll = async (): Promise<MediaItem[]> => {
  const response = await axios.get<MediaItem[]>(API_URL);
  return response.data;
};

const getVideos = async (): Promise<MediaItem[]> => {
  const response = await axios.get<MediaItem[]>(`${API_URL}videos`);
  return response.data;
};

const getImages = async (): Promise<MediaItem[]> => {
  const response = await axios.get<MediaItem[]>(`${API_URL}images`);
  return response.data;
};

const addMedia = async (formData: FormData): Promise<MediaItem> => {
  try {
    const response = await axios.post<MediaItem>(`${API_URL}upload`, formData, { 
      headers: {
        ...authHeader(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error("Error adding media:", error.message);
    throw error;
  } 
};

const deleteMedia = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}${id}/delete`, { headers: authHeader() });
};


const incrementViewCount = async (id: number): Promise<void> => {
  await axios.patch(`${API_URL}${id}/increment-views`, { headers: authHeader() });
};

export default { getAll, getVideos, getImages, addMedia, deleteMedia, incrementViewCount };