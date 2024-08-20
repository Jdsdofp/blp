import { DateField, Edit, useForm } from "@refinedev/antd";
import { useOne } from "@refinedev/core";
import { Form, Input, Switch } from "antd";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

interface IUserOne {
    u_id: number;
    u_nome: string;
    u_email: string;
    u_ativo: boolean;
    criado_em: string;
}

export const AdmUserEdit = () => {
    const [form] = Form.useForm();
    const { id } = useParams();
    const { formProps, formLoading } = useForm<IUserOne>();

    const { data } = useOne<IUserOne>({
        id,
        meta: {
            variables: {
                pat: "user",
                endpoint: "listar-usuario",
            }
        },
    });

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                u_nome: data.data.u_nome,
                u_email: data.data.u_email,
                u_ativo: data.data.u_ativo,
            });
        }
    }, [data, form]);

    return (
        <Edit title="Editar Usuário" breadcrumb isLoading={formLoading}>
            <Form {...formProps} form={form} initialValues={data?.data}>
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