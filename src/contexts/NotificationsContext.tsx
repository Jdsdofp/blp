// NotificationsContext.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { API_URL, TOKEN_KEY, USER } from "../authProvider";
import { Button, notification } from "antd";
import { LogoutOutlined } from "@ant-design/icons";


interface Notification {
  n_id: string;
  n_lida: boolean;
  n_mensagem: string;
  n_criado_em: string;
}

interface NotificationsContextData {
  notifications: Notification[];
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (data: Notification) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextData | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/notifications/listar-notificacoes`);
      setNotifications(response.data);
    } catch (error) {
      notification.error({
        description: 'Sessão expirada, faça login novamente para continuar!',
        message: 'Erro 😐',
        btn: <Button onClick={()=>{
            location.href='/login';
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER)
          }} 
        icon={<LogoutOutlined color="red"/>} 
        />,
        closable: false,
        placement: 'top',
        duration: null
      })
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (data: Notification) => {
    try {
      await axios.put(`${API_URL}/notifications/marcarLido/${data.n_id}`);
      await fetchNotifications(); // Atualiza as notificações após marcar como lido
    } catch (error) {
      console.error("Erro ao marcar como lido:", error);
    }
  }, [fetchNotifications]);

  return (
    <NotificationsContext.Provider value={{ notifications, loading, fetchNotifications, markAsRead }}>
      {children}
    </NotificationsContext.Provider>
    
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications deve ser usado dentro de NotificationsProvider");
  }
  return context;
};
