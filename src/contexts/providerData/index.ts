import { DataProvider } from "@refinedev/core";
import axios from "axios";
import { API_URL, TOKEN_KEY } from "../../authProvider";

// Função auxiliar para mapear recursos para URLs
const getResourceUrl = (resource: string): string => {
    const resourceMap: { [key: string]: string } = {
        users: `${API_URL}/user/listar-usuarios`,
        companies: `${API_URL}/company/listar-empresas`,
        branches: `${API_URL}/branch/listar-filiais`
    };

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
};