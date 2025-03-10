import { io } from 'socket.io-client';
import { API_URL } from '../authProvider';

const socket = io('http://10.11.3.42:8080', {
    withCredentials: false,  // Habilita o envio de cookies, se necessário
  });
  
  // Conectar ao socket uma única vez
  if (!socket.connected) {
    socket.on('connect', () => {
      //console.log('Conectado ao servidor:', socket.id);
      socket.emit('join', socket.id);  // Exemplo de como enviar um evento de entrada para uma "sala"
    });
  }

 export default socket;


