import axios from 'axios';
import { Comment } from '../types';

const API_URL = 'http://localhost:8081/api/media/comments';

const getAll = async (): Promise<Comment[]> => {
  const response = await axios.get<Comment[]>(API_URL);
  return response.data;
};


export default { getAll };