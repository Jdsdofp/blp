import { DataProvider } from "@refinedev/core";
import axios from "axios";
import { API_URL, TOKEN_KEY } from "../../authProvider";


export const dataProviderCond: DataProvider = {
    
    update: async ({ id, resource, variables }) => {
        const token = localStorage.getItem(TOKEN_KEY);
        const dc_id = id;

        console.log(id)
        
        try {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            
            // Executa uma requisição PUT ou PATCH com os dados que deseja atualizar
            const { data } = await axios.put(`${API_URL}/${resource}/${dc_id}`, variables, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            return {
                data, // Retorna os dados de resposta da API
            };
            
        } catch (error) {
            return {
                error: error?.response?.data, // Retorna o erro, se houver
            };
        }
    }
    
    
};