import { Edit } from "@refinedev/antd";
import { Form, Input } from "antd";



export const AdmUserEdit = () =>{

    return (
        <Edit title="Editar Usuário" breadcrumb>
            <Form>
                <Form.Item>
                    <Input/>
                </Form.Item>
            </Form>
        </Edit>
    )
};