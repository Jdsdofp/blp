import { Edit } from "@refinedev/antd";
import { useOne } from "@refinedev/core";
import { Form, Input } from "antd";
import { useParams } from "react-router-dom";



export const AdmUserEdit = () =>{
    const { id } = useParams();
    const { data, isLoading } = useOne({
        resource: "users",
        id,
    });

    const [form] = Form.useForm();

    // Preenche o formulário com os dados do usuário quando os dados são carregados
    if (data) {
        form.setFieldsValue(data.data);
    }

    console.log(data?.data[0]?.u_id)
    return (
        <Edit title="Editar Usuário" breadcrumb>
            <Form >
                <Form.Item > 
                    <Input defaultValue={'#'+data?.data[0].u_id} disabled/>
                </Form.Item>

                <Form.Item > 
                    <Input defaultValue={data?.data[0].u_nome}/>
                </Form.Item>

                <Form.Item > 
                    <Input defaultValue={data?.data[0].u_email}/>
                </Form.Item>

                <Form.Item > 
                    <Input defaultValue={data?.data[0].u_email}/>
                </Form.Item>
            </Form>
        </Edit>
    )
};