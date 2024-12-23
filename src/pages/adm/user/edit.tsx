import { DateField, Edit, SaveButton, useForm } from "@refinedev/antd";
import { useMany, useOne, useTable, useUpdate } from "@refinedev/core";
import { Button, Form, Input, Select, Switch } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNotifications } from "../../../contexts/NotificationsContext";

interface IUserOne {
    u_id: number;
    u_nome: string;
    u_email: string;
    u_ativo: boolean;
    empresas: number[];
    filiais: number[];
    criado_em: string;
}

export const AdmUserEdit = () => {
    const { formProps, formLoading, saveButtonProps, form } = useForm<IUserOne>({
        action: "edit"
    });

    const { notifications, loading, fetchNotifications, markAsRead } = useNotifications();
        
          useEffect(() => {
            fetchNotifications();
          }, [fetchNotifications]);

    const [valueID, setValueID] = useState(null);
    const { tableQueryResult: companiesResult } = useTable({ resource: 'company', meta: {
        endpoint: 'listar-empresas'
    },
    syncWithLocation: false});


    const { data: branchesResult } = useMany({ resource: 'branches', ids: valueID ? [valueID] : []});
    
    const { id } = useParams();


    const { data } = useOne<IUserOne>({
        id,
        meta: {
            variables: {
                pat: "user",
                endpoint: "listar-usuario",
            }
        }
    });

    const companiesOptions = companiesResult?.data?.data.map((empresa)=>({
        label: empresa.e_nome,
        value: empresa.e_id,
    }))

    const branchs = branchesResult?.data?.map((filial)=>({
        label: filial.f_nome,
        value: filial.f_id
    }))

    
    const { mutate, isLoading } = useUpdate();

    const onFinish = (values) => {
        mutate({
            id: data?.data?.u_id,
            values,
            meta: {
                variables: {
                    endpoint: "editar-usuarios",
                    pat: "user",
                    values
                },
            }
        });
    };
    

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                u_nome: data.data.u_nome,
                u_email: data.data.u_email,
                u_ativo: data.data.u_ativo,
                empresas: data.data.empresas.map((e)=>({label: e?.e_nome, value: e?.e_id})),
                filiais: data.data.filiais.map((f)=>({label: f?.f_nome,  value: f?.f_id}))
            });
        }
    }, [data, form]);
    
    const handleCompanyChange = (selectedCompanyIDs) => {
        const lastSelectedID = selectedCompanyIDs[selectedCompanyIDs.length - 1];
        setValueID(lastSelectedID);
    };
    
    return (
        <Edit title="Editar Usuário" breadcrumb isLoading={formLoading} saveButtonProps={{...saveButtonProps, children: 'Salvar', loading: isLoading}}>
            <Form {...formProps} form={form} initialValues={data?.data} onFinish={onFinish}>
            
                <Form.Item
                    name="u_nome"
                    label="Nome"
                    rules={[{ required: true, message: "Nome é obrigatório" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="u_email"
                    label="Email"
                    rules={[{ required: true, message: "Email é obrigatório" }]}
                >
                    <Input />
                </Form.Item>
                

                <Form.Item name="empresas" label="Empresa" required>
                    <Select mode="multiple" defaultValue={companiesOptions} options={companiesOptions} onChange={handleCompanyChange}>
                    </Select>
                </Form.Item>

                <Form.Item name="filiais" label="Filial" required>
                    <Select mode="multiple" defaultValue={branchs} options={branchs}>
                    </Select>
                </Form.Item>

                <Form.Item label="Data Criação">
                    <DateField value={data?.data.criado_em} format="DD/MM/YYYY H:mm:ss"></DateField>
                </Form.Item>
                
                <Form.Item name="u_ativo" label="Status" valuePropName="checked">
                    <Switch checkedChildren="Ativo" unCheckedChildren="Desativado" />
                </Form.Item>
            </Form>
        </Edit>
    );
};