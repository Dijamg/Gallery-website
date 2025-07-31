import axios from 'axios';
import { Comment } from '../types';
import authHeader from './auth-headers';

const API_URL = `${import.meta.env.VITE_MEDIA_BACKEND_BASE_URL}/media`;

const getAll = async (): Promise<Comment[]> => {
  const response = await axios.get<Comment[]>(`${API_URL}/comments`);
  return response.data;
};

const getByMediaId = async (id: number): Promise<Comment[]> => {
  const response = await axios.get<Comment[]>(`${API_URL}/comments/${id}`);
  return response.data;
};

const addComment = async (id: number, formData: FormData): Promise<void> => {
  try {
   const response = await axios.post(`${API_URL}/${id}/upload-comment`, formData, {
       headers: {
       ...authHeader(),
       'Content-Type': 'multipart/form-data'
     }
   });
   return response.data;
  } catch (error: any) {
   console.error("Error adding comment:", error.message);
   throw error;
  }
 };
 
 const deleteComment = async (id: number): Promise<void> => {
   await axios.delete(`${API_URL}/comments/${id}/delete`, { headers: authHeader() });
 };


export default { getAll, addComment, deleteComment, getByMediaId };