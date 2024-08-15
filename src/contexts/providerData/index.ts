import { DataProvider } from "@refinedev/core";
import axios from "axios";
import { API_URL, TOKEN_KEY } from "../../authProvider";

// Função auxiliar para mapear recursos para URLs
const getResourceUrl = (resource: string, ids: number, id: any): string => {
    const resourceMap: { [key: string]: string } = {
        users: `${API_URL}/user/listar-usuarios`,
        userCreate: `${API_URL}/user/registrar-usuario`,
        companies: `${API_URL}/company/listar-empresas`,
        branches: `${API_URL}/branch/${ids}/listar-filial`,
        userOne: `${API_URL}/user/${id}/listar-usuario`
    };
    console.log("o id que ta vindo", id)
    return resourceMap[resource] || '';
};

export const dataProvider: DataProvider = {
    getList: async ({resource}) => {
        const token = localStorage.getItem(TOKEN_KEY);
        const url = getResourceUrl(resource);

        if (!url) {
            throw new Error("Recurso não suportado");
        }

        try {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            return {
                data: data,
                total: data.length,
            };
        } catch (error) {
            console.log("Houve um erro ao buscar dados");
            return {
                data: [],
                total: 0,
            };
        }
    },

    async getOne({resource, id}) {
        const token = localStorage.getItem(TOKEN_KEY);
        const url = getResourceUrl(resource, id);
        if (!url) {
            throw new Error("Recurso não suportado");
        }
        
        try {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log("data no provider", data)
            
            return {
                data: data,
                total: data.length,
            };
        } catch (error) {
            console.log("Houve um erro ao buscar dados");
            return {
                data: [],
                total: 0,
            };
        }
    },

    async getMany({resource, ids}) {
        const token = localStorage.getItem(TOKEN_KEY);
        
        const url = getResourceUrl(resource, ids);

        if (!url) {
            throw new Error("Recurso não suportado");
        }

        try {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            return {
                data: data,
                total: data.length,
            };
        } catch (error) {
            console.log("Houve um erro ao buscar dados");
            return {
                data: [],
                total: 0,
            };
        }
    },

    create: async ({ resource, variables, meta }) => {
        const token = localStorage.getItem(TOKEN_KEY);
        const url = getResourceUrl(resource);

        if (!url) {
            throw new Error("Recurso não suportado");
        }

        try {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const { data } = await axios.post(url, variables, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            return {
                data: data
            };
        } catch (error) {
            console.log("Houve um erro ao criar o recurso");
            throw error;
        }
    }
};