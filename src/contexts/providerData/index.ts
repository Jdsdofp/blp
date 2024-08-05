
import { DataProvider } from "@refinedev/core";
import axios from "axios";
import { API_URL, TOKEN_KEY } from "../../authProvider";


const token = localStorage.getItem(TOKEN_KEY)

export const dataProvider: DataProvider = {
    getList: async () => {
        try {
            const { data } = await axios.get(`${API_URL}/user/listar-usuarios`, {
                headers: {
                    Authorization: `Bearer ${token}`,
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