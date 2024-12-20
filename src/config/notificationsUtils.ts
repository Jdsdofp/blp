
import axios from 'axios';
import { API_URL } from '../authProvider';

export const fetchNotifications = async () => {
  const response = await axios.post(`${API_URL}/notifications/listar-notificacoes`);
  return response.data; // Retorna as notificações para serem usadas
};
