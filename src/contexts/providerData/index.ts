import { DataProvider } from "@refinedev/core";
import axios from "axios";
import { API_URL, TOKEN_KEY } from "../../authProvider";

// Função auxiliar para mapear recursos para URLs
const getResourceUrl = (resource: string, ids: number, id: number): string => {
    const resourceMap: { [key: string]: string } = {
        users: `${API_URL}/user/listar-usuarios`,
        userCreate: `${API_URL}/user/registrar-usuario`,
        companyCreate: `${API_URL}/company/registrar-empresa`,
        companies: `${API_URL}/company/listar-empresas`,
        branches: `${API_URL}/branch/${ids}/listar-filial`,
        userOne: `${API_URL}/user/${id}/listar-usuario`,
        branchsCreate: `${API_URL}/branch/registrar-filial`
    };
    
    return resourceMap[resource] || '';
};

export const dataProvider: DataProvider = {
    getList: async ({resource, meta}) => {
        
        const endpoint = meta?.endpoint;
        const token = localStorage.getItem(TOKEN_KEY);
        try {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const { data } = await axios.get(`${API_URL}/${resource}/${endpoint}`, {
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

    getOne: async ({ id, meta }) => {
        const token = localStorage.getItem(TOKEN_KEY);
        const endpoint = meta?.variables?.endpoint;
        const pat = meta?.variables?.pat;
        
        try {
    

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const { data } = await axios.get(`${API_URL}/${pat}/${id}/${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            return {
                data
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
    },
    update: async ({id,meta}) =>{
        const token = localStorage.getItem(TOKEN_KEY);
        const endpoint = meta?.variables?.endpoint;
        const pat = meta?.variables?.pat;
        const { u_nome, u_email, u_ativo, empresas, filiais } = meta?.variables.values;
        const u_empresas_ids = empresas.map((e)=>e.value ? e.value : e)
        const u_filiais_ids = filiais.map((f)=>f.value ? f.value : f) 
        
        try {
            

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const { data } = await axios.put (`${API_URL}/${pat}/${id}/${endpoint}`, {
                u_nome: u_nome,
                u_email: u_email,
                u_ativo: u_ativo,
                u_empresas_ids: u_empresas_ids,
                u_filiais_ids: u_filiais_ids
                }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                
            });
            console.log(data)
            return {
                data: data
            };
        } catch (error) {
            throw error?.response?.data.message;
            
        }
    },
    deleteOne: async ({id, resource})=> {
        const token = localStorage.getItem(TOKEN_KEY);
        const u_id = id;
        try {
            

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const {data} = await axios.delete(`${API_URL}/user/${u_id}/deletar-usuario`,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                
            });
            //console.log(response)
            return {
                data
            };
            } catch (error) {
                return {
                    error: error?.response?.data
                };
            }
        },

    
};