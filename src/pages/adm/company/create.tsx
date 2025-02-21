import { Button, Card, Col, Form, Input, List, Row, Select, Table, Tag, Typography } from "antd";
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import { useInvalidate, useTable } from "@refinedev/core";
import { TableProps } from "antd";
import { useForm } from "@refinedev/antd";
import InputMask from 'react-input-mask';
import { useNotifications } from "../../../contexts/NotificationsContext";
import { useEffect } from "react";

const { Title } = Typography;

interface ICompanies {
    e_id: number;
    e_nome: string;
    e_razao: string;
    e_cnpj: number;
    e_cidade: string;
    e_uf: string;
    e_criado_em: string;
    e_ativo: boolean;
    e_criador_id: number;
}

const formatCNPJ = (cnpj: any) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
};

export const AdmCompanyCreate = () => {
    const { notifications, loading, fetchNotifications, markAsRead } = useNotifications();
        
          useEffect(() => {
            fetchNotifications();
          }, [fetchNotifications]);


    const { tableQueryResult: companiesResult } = useTable({ resource: 'company', liveMode: 'auto', meta: {
        endpoint: 'listar-empresas'
    },
    syncWithLocation: false});
    
    
    const invalid = useInvalidate();
    const {formProps, saveButtonProps, form, formLoading} = useForm<ICompanies>({
        resource: 'companyCreate',
        action: 'create',
        successNotification(data) {
            form.resetFields()
            return{
                message: `Empresa #${data?.data?.e_id} criada com sucesso!`,
                type: 'success'
            }
        },

        errorNotification(error) {
            return{
                message: error?.response.data.error,
                type: 'error'
            }
        },

        onMutationSuccess: ()=>{
            invalid({
                resource: 'companyCreate',
                invalidates: ['all']
            })
        }
    })
    
    
    const colunms: TableProps<ICompanies>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'e_id',
            key: 'key',
            filterMode: 'menu',
            render: (text) => <a>#{text}</a>
        },

        {
            title: 'Nome',
            dataIndex: 'e_nome',
            key: 'e_nome'
        },

        {
            title: 'Razão',
            dataIndex: 'e_razao',
            key: 'e_razao'
        },
        
        {
            title: 'CNPJ',
            dataIndex: 'e_cnpj',
            key: 'e_cnpj',
            render(_, record) {
                return formatCNPJ(record.e_cnpj)
            },
        },

        {
            title: 'Cidade',
            dataIndex: 'e_cidade',
            key: 'e_cidade'
        },

        {
            title: 'UF',
            dataIndex: 'e_uf',
            key: 'e_uf'
        },

        {
            title: 'Status',
            dataIndex: 'e_ativo',
            key: 'status',
            render: (_, {e_ativo})=> (
                <>
                    {
                        <Tag color={e_ativo ? 'success' : 'error'}>{e_ativo ? 'Habilitada' : 'Desabilitada'}</Tag>
                    }
                </>
            ),
        }
    ]




  return (
    <Row gutter={[16, 16]} justify="center">
      <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 7 }}>
        <Card>
            <Title level={4}>Empresa</Title>
            <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 20 }}
            layout="vertical"
            style={{ width: '100%' }}
            {...formProps}
            >
            <Form.Item label="Razão" name="e_razao" rules={[{required: true, type: 'string', message: 'Razão social empresa obrigatorio'}]}>
                <Input />
            </Form.Item>

            <Form.Item label="Nome" name="e_nome" rules={[{required: true, type: 'string', message: 'Nome da empresa obrigatorio'}]}>
                <Input />
            </Form.Item>

            <Form.Item
                label="CNPJ"
                name="e_cnpj"
                rules={[{ required: true, message: "Cnpj empresa obrigatorio" }]}
                >

                <InputMask mask="99.999.999/9999-99">
                    {(inputProps: any) => <Input {...inputProps} placeholder="00.000.000/0000-00"/>}
                </InputMask>

            </Form.Item>

            <Form.Item label="UF" name="e_uf" rules={[{required: true, message: 'UF empresa obrigatorio'}]}>
                <Select >
                <Select.Option value="PI">PI</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item label="Cidade" name="e_cidade" rules={[{required: true, message: 'Cidade empresa obrigatorio'}]}>
                <Select>
                <Select.Option value="Teresina">Teresina</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" icon={<AppRegistrationRoundedIcon />} {...saveButtonProps} loading={formLoading} block>
                Cadastrar
                </Button>
            </Form.Item>
            </Form>

        </Card>
      </Col>

      <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 12 }} lg={{ span: 14 }} xl={{ span: 17 }}>
        <List>
          <Table size="small" dataSource={companiesResult.data?.data} columns={colunms} tableLayout="fixed" loading={companiesResult.isLoading} scroll={{ x: 'max-content' }}>
            
          </Table>
        </List>
      </Col>
    </Row>
  );
};
