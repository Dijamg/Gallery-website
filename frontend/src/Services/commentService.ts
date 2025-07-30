import axios from 'axios';
import { Comment } from '../types';

const API_URL = `${import.meta.env.VITE_MEDIA_API_BASE_URL}/media/comments`;

const getAll = async (): Promise<Comment[]> => {
  const response = await axios.get<Comment[]>(API_URL);
  return response.data;
};


export default { getAll };