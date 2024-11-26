import React, { useEffect, useState } from 'react';
import { Badge, Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Space, Spin, Switch, Table, Tabs, Tag } from 'antd';
import type { TableProps } from 'antd';
import { DateField, Edit, EditButton, List, useForm } from '@refinedev/antd';
import { ClearOutlined, ClockCircleFilled, EditFilled } from '@ant-design/icons';
import { useInvalidate, useList } from '@refinedev/core';
import {  Check, CloseFullscreen, CloseSharp, DocumentScanner, EditAttributes, EditAttributesOutlined, Save, SaveAlt } from '@mui/icons-material';
import axios from 'axios';
import { API_URL } from '../../../authProvider';

interface ITypeDoc {
    td_id: number;
    td_desc: string;
    td_ativo: boolean;
    td_requer_condicao: boolean;
    criado_em: Date;
  }


export const DocTypeDocCreate = () => {
    const [isModal, setIsModal] = useState(false)
    const [ messageApi, contextHolder ] = message.useMessage();

    //variaveis de estado
    const [idTdDesc, setIdTdDesc] = useState<number | null>(null)
    const [valueInputTdDesc, setValueInputTdDesc] = useState<any>('')
    const [resultReturn, setResultReturn] = useState<boolean | null>(null)

    const {data: typeDocsResult, isLoading, refetch} = useList({resource: 'type-document', meta: {endpoint: 'listar-tipo-documentos'}, liveMode: 'auto'})


    const handlerInputDesc = (record: any) =>{
        setIdTdDesc(record?.td_id)
        setValueInputTdDesc(record?.td_desc)
    }

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValueInputTdDesc(e.target.value);
    };
   

    
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


    const updateTitleTypeDoc = async (data: any) => {
        try {
            const payload = { td_desc: valueInputTdDesc };

            const response = await axios.put(
                `${API_URL}/type-document/editar-descrica-tipo-doc/${data?.td_id}`,
                payload
            );

            messageApi.info(response?.data?.message);
            setResultReturn(response?.data?.tp_doc?.td_id); // Armazena o ID retornado
            setIdTdDesc(null); // Sai do modo de edição
        } catch (error) {
            console.log('log de erro front', error);
        }
    };
    
    const updateReqConditionTypeDoc = async (data: any) =>{
        try {
            
            console.log('Data', data?.td_id)
        } catch (error) {
            console.log('Log de erro', error)
        }
    }

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
            render: (_, record: any) => (
                <Space>
                    {idTdDesc === record?.td_id ? (
                        <>
                            <Input
                                onLoad={()=>(<Spin/>)}
                                size='small'
                                value={valueInputTdDesc}
                                onChange={handleChangeInput}
                            />
                            <Button
                                size="small"
                                shape="circle"
                                onClick={async () => {
                                    await updateTitleTypeDoc(record);
                                    await refetch();
                                }}
                                icon={<Save fontSize="inherit" />}
                            />
                            <Button
                                size="small"
                                shape="circle"
                                icon={<CloseSharp fontSize='inherit'/>}
                                onClick={()=>handlerInputDesc(null)}
                            />
                        </>
                    ) : (
                        <>
                            <span>{record?.td_desc}</span>
                            <Button
                                size="small"
                                shape="circle"
                                onClick={() => handlerInputDesc(record)}
                                icon={<EditFilled />}
                            />
                        </>
                    )}
                </Space>
            ),
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
            render: (_, record)=>(
                <>
                    <Switch size='small' onClick={()=>updateReqConditionTypeDoc(record)} checkedChildren='Sim' unCheckedChildren='Não' defaultChecked/>
                </>
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
            <Table  columns={columns} scroll={{ x: 'max-content' }} size='small' dataSource={typeDocsResult?.data} loading={isLoading} />
            {contextHolder}
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
