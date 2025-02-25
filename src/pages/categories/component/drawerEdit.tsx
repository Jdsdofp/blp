import { Drawer, Form, Input, DatePicker, Select, Button, message } from "antd";
import React, { useEffect } from "react";
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import axios from "axios";
import { API_URL } from "../../../authProvider";
import useMessage from "antd/es/message/useMessage";

interface DrawerEditProps {
  open: boolean;
  onCancel: () => void;
  onOk: (values: FormValues) => void;
  title?: string;
  data?: FormValues;
}

interface FormValues {
  d_id: number;
  d_data_pedido: Dayjs;
  d_data_emissao: Dayjs;
  d_data_vencimento: Dayjs;
  d_num_protocolo: string;
}

export default function DrawerEdit({
  open,
  title,
  onCancel,
  onOk,
  data,
}: DrawerEditProps) {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        d_data_pedido: dayjs(data.d_data_pedido),
        d_data_emissao: dayjs(data.d_data_emissao),
        d_data_vencimento: dayjs(data.d_data_vencimento)
      });
    }
  }, [data, form]);

  const [ messageApi, contextHolder ] = message.useMessage()
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const {d_id} = data;

      const response = await axios.put(`${API_URL}/document/editar-documento/${d_id}`, 
        {
          d_data_pedido: values?.d_data_pedido,
          d_data_emissao: values?.d_data_emissao,
          d_data_vencimento: values?.d_data_vencimento,
          d_num_protocolo: values?.d_num_protocolo,
        })

        messageApi.info(response?.data?.message)

      onOk(values);
      onCancel(); // Fecha o drawer após o submit
    } catch (error) {
      console.error('Validação falhou:', error);
    }
  };

  return (
    <Drawer
      open={open}
      title={title || 'Edição de Documento'}
      onClose={onCancel}
      width={600}
      style={{borderRadius: 10}}
      placement="right"
      destroyOnClose
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Cancelar
          </Button>
          <Button type="dashed" onClick={handleSubmit} style={{ backgroundColor: '#1890ff', color: 'white', border: 'none', padding: '5px 15px', borderRadius: 4 }}>
            Salvar
          </Button>
        </div>
      }
    >
       {contextHolder}
      <Form
        form={form}
        layout="vertical"
        initialValues={data}
        style={{ height: '100%' }}
      >
        <Form.Item
          label="Data do Pedido"
          name="d_data_pedido"
          rules={[{ required: true, message: 'Campo obrigatório' }]}
          hidden={data?.d_data_pedido === '1970-01-01'}
        >
          <DatePicker
            format="DD/MM/YYYY"
            style={{ width: '100%' }}
            
            
          />
        </Form.Item>

        <Form.Item
          label="Data de Emissão"
          name="d_data_emissao"
          rules={[{ required: true, message: 'Campo obrigatório' }]}
          hidden={data?.d_data_emissao === '1970-01-01'}
        >
          <DatePicker
            format="DD/MM/YYYY"
            style={{ width: '100%' }}
            
          />
        </Form.Item>

        <Form.Item
          label="Data de Vencimento"
          name="d_data_vencimento"
          rules={[{ required: true, message: 'Campo obrigatório' }]}
          hidden={data?.d_data_vencimento === '1970-01-01'}
        >
          <DatePicker
            format="DD/MM/YYYY"
            style={{ width: '100%' }}
            
          />
        </Form.Item>

        <Form.Item
          label="Número do Protocolo"
          name="d_num_protocolo"
          rules={[{ required: true, message: 'Campo obrigatório' }]}
          
        >
          <Input/>
        </Form.Item>
      </Form>
     
    </Drawer>
  );
}