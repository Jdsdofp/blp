import { useUpdatePassword, type AuthProvider } from "@refinedev/core";
import { Alert, MessageArgsProps } from "antd";
import axios from "axios";
import { useId, useState } from "react";

const API_URL = 'http://localhost:8080';

export const TOKEN_KEY = "refine-auth";
export const USER = "refine-user";
export const FRIST_LOGIN = "refine-FRIST-LOG";


export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const { data } = await axios.post(`${API_URL}/user/login`, {
        u_email: email,
        u_senha: password,
      });

      if(data.status) {
        localStorage.setItem(FRIST_LOGIN, JSON.stringify(data))
        return {
          success: true,
          redirectTo: '/update-password',
          successNotification: {
            message: 'Sucesso!',
            description: 'Atualize sua senha e faça o login!!'
          }
        }
      }


      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER, JSON.stringify(data.modelUser))

        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Invalid username or password",
        },
      };
    } catch (error) {
      
      return {
        success: false,
        error: {
          name: "Erro de autenticação",
          message: error.response?.data?.message || `Erro interno: ${error.message}`,
        },
      };
    }
  },
  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      try {
        const response = await axios.get(`${API_URL}/user/auth`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.status === 200) {
          return {
            authenticated: true,
          };
        } else {
          return {
            authenticated: false,
            redirectTo: '/login',
            error: {name: 'Erro', message: 'Acesso negago ou sessão expirada'},
            logout: true,
          };
        }
      } catch (error) {
        return {
          authenticated: false,
          redirectTo: '/login',
          error: {name: 'Erro', message: 'Acesso negago ou sessão expirada'},
          logout: true,
        };
      }
    } else {
      return {
        authenticated: false,
        redirectTo: '/login',
        error: {name: 'Erro', message: 'Acesso negago ou sessão expirada'},
        logout: true,
      };
    }
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = JSON.parse(localStorage.getItem(USER))
    
    if (token) {
      return {
        id: user?.id,
        nome: user?.nome,
        avatar: "https://i.pravatar.cc/300",
      };
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },

  
  updatePassword: async ({ password}) => {
    try {
      const { userId, token } = JSON.parse(localStorage.getItem(FRIST_LOGIN));
      
      const response = await axios.post(
        `${API_URL}/user/reset-senha-inicial`,
        {
          userId: userId,
          u_senha: password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem(FRIST_LOGIN)      
      return {
        success: true,
        successNotification: {message: 'Sucesso', description: 'Efetue o login'},
        redirectTo: '/login'
      };
    } catch (error) {
      return {
        success: false,
        redirectTo: '/login',
        error: {
          name: `${error?.response?.data?.message}` || 'Não é possivel alterar senha',
          message: 'Erro',
        },
      };
    }
  }

};