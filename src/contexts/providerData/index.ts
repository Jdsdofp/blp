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
        branchsCreate: `${API_URL}/branch/registrar-filial`,
        typeDocument: `${API_URL}/type-document/registrar-tipo-documento`,
        listTypeDocument: `${API_URL}/type-document/listar-tipo-documentos`,
        conditionalCreate: `${API_URL}/condition/registrar-condicionante`,
        documentCreate: `${API_URL}/document/registrar-documento`,
        listarDocumentos: `${API_URL}/document//listar-documentos`,
        commentCreate: `${API_URL}/comment-document/${id}/registar-comentario`
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
        console.log('meu resource', resource)
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
            console.log(error);
            throw error;
        }
    },
    update: async ({ id, meta }) => {
        const token = localStorage.getItem(TOKEN_KEY);
        const endpoint = meta?.variables?.endpoint;
        const pat = meta?.variables?.pat;
        const values = meta?.variables?.values; // Objeto genérico de valores de atualização
    
        // Verifique se 'values' está definido
        if (!values) {
            throw new Error("Os valores de atualização não foram fornecidos.");
        }
    
        // Se houver empresas e filiais, tratamos separadamente
        if (values?.empresas && values?.filiais) {
            values.u_empresas_ids = values.empresas.map(e => e.value ? e.value : e);
            values.u_filiais_ids = values.filiais.map(f => f.value ? f.value : f);
    
            // Remover empresas e filiais do objeto principal após o mapeamento
            delete values.empresas;
            delete values.filiais;
        }
    
        try {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
            // Chamada genérica para o endpoint com os valores fornecidos
            const { data } = await axios.put(`${API_URL}/${pat}/${id}/${endpoint}`, values, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            console.log(data);
            return {
                data: data,
            };
        } catch (error) {
            console.error("Erro na atualização:", error?.response?.data || error?.message || error);
            throw new Error(error?.response?.data?.message || "Erro na atualização");
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