import React, { useEffect, useState } from 'react';
import { Badge, Col, DatePicker, Form, Input, Modal, Row, Select, Switch, Table, Tabs, Tag } from 'antd';
import type { TableProps } from 'antd';
import { DateField, List, useForm } from '@refinedev/antd';
import { ClearOutlined } from '@ant-design/icons';
import { useInvalidate, useList } from '@refinedev/core';
import {  Check, DocumentScanner } from '@mui/icons-material';

interface ITypeDoc {
    td_id: number;
    td_desc: string;
    td_ativo: boolean;
    td_requer_condicao: boolean;
    criado_em: Date;
  }


export const DocTypeDocCreate = () => {
    const [isModal, setIsModal] = useState(false)

    const {data: typeDocsResult, isLoading} = useList({resource: 'type-document', meta: {endpoint: 'listar-tipo-documentos'}, liveMode: 'auto'})


    
    const invalid = useInvalidate()
    const {formProps, form } = useForm<ITypeDoc>({resource: 'typeDocument', action: 'create', 
        successNotification(data) {
        form.resetFields();
        return{
            message:  `${data?.data?.message}`,
            type: 'success'
        }
    }, errorNotification(data){
        return{
            message: `${data?.response.data.message}`,
            type: 'error'
        }
    }, onMutationSuccess: ()=> {
        invalid({
            resource: 'type-document',
            meta: {endpoint: 'listar-tipo-documentos'},
            invalidates: ['all']
        })
    }})
          
    const columns: TableProps<ITypeDoc>['columns'] = [

        {
            key: 'td_id',
            title: 'Cod.',
            dataIndex: 'td_id',
            render: (_, record)=>(
                <a>#{record.td_id}</a>
            )
            
        },

        {
            key: 'td_desc',
            title: 'Tipo Documento',
            render: (_, record: any)=>(
                <span>
                    {record?.td_desc}
                </span>
            )
        },

        {
            key: 'criado_em',
            title: 'Data Criação',
            render: (_, {criado_em})=>(
                <DateField style={{fontSize: '13px'}} value={criado_em} format='DD/MM/YYYY H:mm:ss' locales=''/>
            )
        },

        {
            key: 'td_requer_condicao',
            title: 'Req. Condicionante',
            render: (_, {td_requer_condicao})=>(
                <span style={{fontSize: '11px', color: td_requer_condicao ? 'green' : 'red', font: 'small-caption'}}>{td_requer_condicao ? 'Sim' : 'Não'}</span>
            )
        },

        {
            key: 'td_ativo',
            title: 'Status',
            align: 'center',
            width: '80px',
            render: (_, {td_ativo})=>(
                <Tag color={td_ativo ? 'green' : 'error'} style={{fontSize: 10}}> <Badge color={td_ativo ? 'green': 'red'}/> {td_ativo ? 'Ativo' : 'Desativado'}</Tag>
            )
        }
    ]




    const hadleCancel = () =>{
        setIsModal(false)
    
    }
    
    return (
        <>
            <List breadcrumb createButtonProps={{ children: "Novo Tipo Doc", onClick: ()=>{setIsModal(true)}, icon: <DocumentScanner fontSize='small' /> }} >
                <Table columns={columns} scroll={{ x: 'max-content' }} size='small' dataSource={typeDocsResult?.data} loading={isLoading} />
            </List>

            <Modal 
            title={[<DocumentScanner fontSize='inherit'/>, ' Cadastro Tipo de Documento']} 
            open={isModal} 
            onCancel={hadleCancel} 
            centered 
            onOk={() => form.submit()} // Submete o formulário ao clicar em OK
            
            >
            <Form 
                {...formProps} 
                form={form} 
                layout="vertical" 
                style={{ width: '100%' }}
            >
                
                <Tabs defaultActiveKey="1">
                        <Row gutter={16}>
                                <Col xs={24} sm={24}>
                                    <Form.Item label="Tipo Documento" name="td_desc" rules={[{ required: true, message: 'Descrição Tipo Documento Obrigatório' }]}>
                                        <Input/>    
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={24}>
                                    <Form.Item label="Requer Condicionante?" name="td_requer_condicao">
                                        <Switch checkedChildren='Sim' unCheckedChildren='Não' defaultChecked/>    
                                    </Form.Item>
                                </Col>

                        </Row>
                </Tabs>
            </Form>
        </Modal>

        </>
    )
};
