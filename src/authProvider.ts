import { useUpdatePassword, type AuthProvider } from "@refinedev/core";
import axios from "axios";

const API_URL = 'http://localhost:8080';

export const TOKEN_KEY = "refine-auth";
export const USER = "refine-user";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const { data } = await axios.post(`${API_URL}/user/login`, {
        u_email: email,
        u_senha: password,
      });

      if(data?.status){
        return {
          success: true,
          redirectTo: "/forgot-password"
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
          message: error.response?.data?.message || "Invalid username or password",
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
    const user = JSON.parse(localStorage.getItem(USER));

    if (token) {
      return {
        id: user.id,
        name: user.nome,
        avatar: "https://i.pravatar.cc/300",
      };
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },

  updatePassword: async ({ password, confirmPassword }) => {
    // Lógica para atualizar a senha do usuário aqui

    // Se a atualização for bem-sucedida
    return {
      success: true,
      redirectTo: "/forgot-password",
    };

    // Se a atualização não for bem-sucedida
    return {
      success: false,
      error: {
        name: "UpdatePasswordError",
        message: "Failed to update password",
      },
    };
  },

};