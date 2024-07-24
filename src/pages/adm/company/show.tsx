import { Dashboard } from "@mui/icons-material";
import { Button, Cascader, DatePicker, Form, Input, InputNumber, Radio, Select, Space, Switch, TreeSelect, Typography } from "antd";
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';


const { Title } = Typography;


export const AdmShow = () =>{
    return (
    <>
        <Title>{"Empresa"}</Title>
        <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="vertical"
        style={{ maxWidth: 600 }}
        
        >
        <Form.Item label="Razao">
            <Input />
        </Form.Item>
        <Form.Item label="Nome">
            <Input />
        </Form.Item>
        <Form.Item label="CNPJ">
            <Input />
        </Form.Item>
        <Form.Item label="UF">
            <Select>
            <Select.Option value="PI">PI</Select.Option>
            </Select>
        </Form.Item>
        <Form.Item label="Cidade">
            <Select>
            <Select.Option value="Teresina">Teresina</Select.Option>
            </Select>
        </Form.Item>

        <Form.Item>
            <Button type="primary" icon={<AppRegistrationRoundedIcon/>} block>Cadastrar</Button>
        </Form.Item>
        </Form>
    
    </>
    )
}
