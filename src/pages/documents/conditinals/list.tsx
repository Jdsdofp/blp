import React, { useEffect, useState } from 'react';
import { Badge, Button, Col, Form, Input, Modal, Row, Select, Space, Table, Tabs, Tag } from 'antd';
import type { TableProps } from 'antd';
import { List, useForm } from '@refinedev/antd';
import {  BranchesOutlined, ClearOutlined, DeleteOutlined, IssuesCloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useInvalidate, useTable } from '@refinedev/core';
import InputMask from 'react-input-mask';
import { AddLocation } from '@mui/icons-material';
import axios from 'axios';

interface IBranchs {
    f_id: number;
    f_nome: string;
    f_codigo: number;
    f_cnpj: number;
    f_cidade: string;
    f_uf: string;
    f_endereco: string;
    f_latitude: string;
    f_longitude: string;
    empresa: object;
    responsavel: object;
    f_criado_em: Date;
    f_ativo: boolean;
  }


export const ListCondition = () => {
    const [isModal, setIsModal] = useState(false)
    const { tableQueryResult: companiesResult } = useTable({ resource: 'company', meta: {endpoint: 'listar-empresas'},syncWithLocation: false});
    const {tableQueryResult: branchsResult} = useTable<IBranchs>({resource: 'branch', meta: {endpoint: 'listar-filiais'}, syncWithLocation: false, liveMode: 'auto'})
    
    const invalid = useInvalidate()
    const {formProps, form, saveButtonProps } = useForm<IBranchs>({resource: 'branchsCreate', action: 'create', 
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
    }, onMutationSuccess: ()=>{
        invalid({
            resource: 'branch',
            meta: {endpoint: 'listar-filiais'},
            invalidates: ['all']
        })
    }})
    const [endereco, setEndereco] = useState({});

    

    const companiesOptions = companiesResult.data?.data.map((company)=>({
        label: company.e_nome,
        value: company.e_id
    }))


          
    const columns: TableProps<IBranchs>['columns'] = [

        {
            key: 'f_codigo',
            title: 'Num. Loja',
            dataIndex: 'f_codigo',
            render: (_, record)=>(
                <a>#{record.f_codigo}</a>
            )
            
        },

        {
            key: 'empresa',
            title: 'Empresa',
            render: (_, record: any)=>(
                <span>
                    {record?.empresa?.e_nome}
                </span>
            )
        },

        {
            key: 'f_nome',
            title: 'Nome Filial',
            dataIndex: 'f_nome'
        },

        {
            key: 'f_cnpj',
            title: 'CNPJ',
            render: (_, record)=>(
                <span>{record.f_cnpj}</span>
            )
        },

        {
            key: 'f_cidade',
            title: 'Cidade',
            render: (_, record)=>(
                <span>{record.f_cidade}</span>
            )
        },
        {
            key: 'f_uf',
            title: 'UF',
            render: (_, record)=>(
                <span>{record.f_uf}</span>
            )
        },

        {
            key: 'f_responsavel',
            title: 'Responsavel',
            render: (_, record: any)=>(
                record?.responsavel?.u_nome
            )
        },

        {
            key: 'f_ativo',
            title: 'Status',
            render: (_, {f_ativo})=>(
                <Tag color={f_ativo ? 'green' : 'error'} style={{fontSize: 10}}> <Badge color={f_ativo ? 'green': 'red'}/> {f_ativo ? 'Ativa' : 'Desativada'}</Tag>
            )
        }
    ]

    const hadleCancel = () =>{
        setIsModal(false)
    
    }
    
    const { TabPane } = Tabs;
   
    
    return (
        <>
            <List breadcrumb createButtonProps={{ children: "Nova condição", onClick: ()=>{setIsModal(true)}, icon: <IssuesCloseOutlined /> }} >
                <Table columns={columns} dataSource={branchsResult.data?.data} scroll={{ x: 'max-content' }} size='small' loading={branchsResult.isLoading}/>
            </List>

            <Modal 
            title='Condição' 
            open={isModal} 
            onCancel={hadleCancel} 
            centered 
            okButtonProps={saveButtonProps} 
            >
            <Form {...formProps} layout="vertical">  
                <Form.Item  
                    name={"firstName"} 
                    style={{ maxWidth: "893px" }}  
                    rules={[{ required: true }]}  
                >  
                    <Input placeholder="Nome" />
                </Form.Item>  

                <Form.List name={"skills"}>   
                    {(fields, { add, remove }) => {  
                        return (  
                            <>  
                                {/* Área de rolagem */}
                                <div style={{ maxHeight: '300px', overflowY: 'auto', overflowX: 'hidden'}}>
                                    {fields.map((field, index) => {  
                                        return (  
                                            <Space  
                                                key={field.key}  
                                                direction="horizontal"  
                                                style={{  
                                                    position: "relative",  
                                                    marginRight: "13px",  
                                                }}  
                                            >  
                                                <Form.Item  
                                                    name={field.name}  
                                                    label={`Condição - ${index + 1}`}  
                                                    style={{ width: "400px" }}  
                                                    rules={[{ required: true }]}  
                                                >  
                                                    <Input placeholder="Condição" />  
                                                </Form.Item>  
                                                <Button  
                                                    danger  
                                                    onClick={() => remove(field.name)}  
                                                    style={{ marginTop: "5px" }}  
                                                    icon={<DeleteOutlined />}  
                                                />  
                                            </Space>  
                                        );  
                                    })}  
                                </div>

                                {/* Botão fora da área de rolagem */}
                                <Form.Item>  
                                    <Button  
                                        type="dashed"  
                                        block  
                                        style={{ maxWidth: "893px", marginTop: "10px" }}  
                                        icon={<PlusOutlined />}  
                                        onClick={() => add()}  
                                    >  
                                        Adicionar Condição  
                                    </Button>  
                                </Form.Item> 
                                </>  
                            );  
                        }}  
                    </Form.List>  
                </Form>  
            </Modal>

        </>
    )
};
