import { Create } from "@refinedev/antd"
import { Form, Input, Select } from "antd"
import { SelectProps } from "antd/lib";




export const AdmUserCreate = () =>{

    const options: SelectProps['options'] = [];

        for (let i = 10; i < 35; i++) {
        options.push({
            value: i.toString(35) + i,
            label: i.toString(35) + i,
        });
        }

        const handleChange = (value: string) => {
            console.log(`selected ${value}`);
          };

    return (
        <Create title="Criar Usuário" breadcrumb saveButtonProps={{children: "Salvar" }}>
            <Form  style={{maxWidth: '100vh'}}  labelAlign="left" >
                <Form.Item >
                    <Input placeholder="Nome Completo"/>
                </Form.Item>

                <Form.Item rules={[{ required: true,  type: "email", message: "E-amil invalido"}]}>
                    <Input  placeholder="E-mail"/>
                </Form.Item>

                <Form.Item>
                <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Empresa"
                onChange={handleChange}
                options={options}
                />
                </Form.Item>

                <Form.Item>
                <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Filial"
                onChange={handleChange}
                options={options}
                />
                </Form.Item>
            </Form>
        </Create>
    )
}