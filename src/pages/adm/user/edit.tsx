import { Edit } from "@refinedev/antd";
import { useOne } from "@refinedev/core";
import { Form, Input } from "antd";
import { useParams } from "react-router-dom";



export const AdmUserEdit = () =>{
    const { id } = useParams();
    const { data, isLoading } = useOne({
        resource: "userOne",
        id,
    });
    
    return (
        <Edit title="Editar Usuário" breadcrumb isLoading={isLoading}>
            <Form >
                <Form.Item name="u_id"> 
                    <Input defaultValue={data?.data.u_id} disabled/>
                </Form.Item>

                <Form.Item name="u_nome"> 
                    <Input defaultValue={data?.data.u_nome}/>
                </Form.Item>

                <Form.Item name="u_email"> 
                    <Input defaultValue={data?.data.u_email}/>
                </Form.Item>

            </Form>
        </Edit>
    )
};