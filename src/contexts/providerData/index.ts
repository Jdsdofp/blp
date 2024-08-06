
import { DataProvider } from "@refinedev/core";
import axios from "axios";
import { API_URL, TOKEN_KEY } from "../../authProvider";



export const dataProvider: DataProvider = {
    getList: async () => {
        const token = localStorage.getItem(TOKEN_KEY)
        try {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const { data } = await axios.get(`${API_URL}/user/listar-usuarios`, {
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