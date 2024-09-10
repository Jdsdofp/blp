import React, { useState } from 'react';
import { Badge, Button,Form, Input, Modal, Space, Table, Tabs, Tag } from 'antd';
import type { TableProps } from 'antd';
import { List, useForm } from '@refinedev/antd';
import {  DeleteOutlined, IssuesCloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useInvalidate, useTable } from '@refinedev/core';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';

interface IConditions {
    c_id: number;
    c_tipo: string;
    c_condicao: []
  }


export const ListCondition = () => {
    const [isModal, setIsModal] = useState(false)
    const [modalList, setModalList] = useState(false)
    const [listCond, setListCond] = useState()
    const { tableQueryResult: companiesResult } = useTable({ resource: 'company', meta: {endpoint: 'listar-empresas'},syncWithLocation: false});
    const {tableQueryResult: condtionsResult} = useTable<IConditions>({resource: 'condition', meta: {endpoint: 'listar-condicionantes'}})
    console.log(`the return: ${condtionsResult}`)
    const invalid = useInvalidate()
    const {formProps, form, saveButtonProps } = useForm<IConditions>({resource: 'conditionalCreate', action: 'create', 
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
    

    const companiesOptions = condtionsResult.data?.data.map((company)=>({
        label: company.c_tipo,
        value: company.c_id
    }))


          
    const columns: TableProps<IConditions>['columns'] = [

        {
            key: 'c_id',
            title: 'Id',
            dataIndex: 'c_id',
            render: (_, record)=>(
                <a>#{record.c_id}</a>
            )
            
        },

        {
            key: 'c_tipo',
            title: 'Tipo',
            render: (_, {c_tipo})=>(
                <span>
                    {c_tipo}
                </span>
            )
        },

        {
            key: 'c_condicao',
            title: 'Condições',
            render: (_, record)=>(
                <Tag style={{cursor: 'pointer', borderRadius: 50}} color='cyan' onClick={()=>handleModalList(record.c_condicao)}><AssignmentTurnedInOutlinedIcon fontSize='small'/> {record.c_condicao.length}</Tag>
            )
        }
    ]

    

    const hadleCancel = () =>{
        setIsModal(false)
    
    }


    const handleModalList = (c_codicao: any) =>{
        setModalList(true)
        setListCond(c_codicao)
    }
    
    const { TabPane } = Tabs;
   
    
    return (
        <>
            <List title='Condição' breadcrumb createButtonProps={{ children: "Nova condição", onClick: ()=>{setIsModal(true)}, icon: <IssuesCloseOutlined /> }} >
                <Table columns={columns} dataSource={condtionsResult.data?.data} scroll={{ x: 'max-content' }} size='small'/>
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
                    name={"c_tipo"} 
                    style={{ maxWidth: "893px" }}  
                    rules={[{ required: true }]}  
                >  
                    <Input placeholder="Nome" />
                </Form.Item>  

                <Form.List name={"c_condicao"}>   
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


            <Modal open={modalList} onCancel={()=>setModalList(false)} styles={{body: {paddingTop: '28px'}}} okButtonProps={{hidden: true}} cancelButtonProps={{hidden: true}}>
                        <Table dataSource={listCond} size='small' bordered scroll={{x: true}}>
                            <Table.Column title='Condição' />
                        </Table>
            </Modal>

        </>
    )
};
