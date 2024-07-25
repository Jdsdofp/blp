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

      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
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
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        id: 1,
        name: "John Doe",
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

      
      console.log(response)
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