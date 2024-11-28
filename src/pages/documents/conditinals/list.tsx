import React, { useRef, useState } from 'react';
import { Badge, Button,Form, Input, message, Modal, Space, Table, Tabs, Tag } from 'antd';
import type { TableProps } from 'antd';
import { List, useForm } from '@refinedev/antd';
import {  DeleteOutlined, EditFilled, IssuesCloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useInvalidate, useTable } from '@refinedev/core';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import { CloseSharp, Delete, Edit, Save } from '@mui/icons-material';
import axios from 'axios';
import { API_URL } from '../../../authProvider';

interface IConditions {
    c_id: number;
    c_tipo: string;
    c_condicao: []
  }


export const ListCondition = () => {
    const [messageApi, contextHolder] = message.useMessage()
    const [isModal, setIsModal] = useState(false)
    const [modalList, setModalList] = useState(false)
    const [listCond, setListCond] = useState()
    
    //VARIAVEIS CRUD
    const [inputDescTpID, setInputDescTpID] = useState<number | null>()
    const [valueInputTp, setValueInputTp] = useState<any>('')

    //VARIAVEIS CRUD LIST CONDITIONS
    const [valueInputCondition, setValueInputCondition] = useState<any>('');
    const [valueInputConditionOne, setValueInputConditionOne] = useState<any>('')





    const {tableQueryResult: condtionsResult} = useTable<IConditions>({resource: 'condition', meta: {endpoint: 'listar-condicionantes'}})
    
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


    //variaveis de estado capture width magic...
    const spanRef = useRef({}); 
    const [spanWidth, setSpanWidth] = useState({});


    //configurações de edição da descrição do tipo de documento {
        //pegando os valores do input
        const handlerInputDescType = async (record: any) =>{
            setValueInputTp(record?.c_tipo)

            if(record) {
                const width = spanRef.current[record?.c_id]?.getBoundingClientRect().width || 100;
                setSpanWidth((prev)=>({
                    ...prev,
                    [record?.c_id]: width,
                }));
            }
            setInputDescTpID(record?.c_id || null)
        }
        
        //atualizando os valores do input
        const handleChangeInputTp = (e: React.ChangeEvent<HTMLInputElement>) => {
            setValueInputTp(e.target.value);
        };

        //enviando para o back os valores de alteração
        const updateTitleDescType = async (data: any) =>{
            try {
                console.log('Return function Update', data)
                const payload = {
                    c_tipo: valueInputTp
                }
                
                const response = await axios.put(`${API_URL}/condition/editar-desc-condicionante/${data?.c_id}`, payload)
                messageApi.warning(response?.data?.message)
                await condtionsResult.refetch()

                setInputDescTpID(null)
            } catch (error) {
                messageApi.error(error?.response?.data?.message)
            }
        }
    // } configurações de edição da descrição do tipo de documento
    

    // configuração de delete da condicionante {

        //função de deletar a condicionante e suas condições
        const deleteCondition = async (data: any) =>{
            try {
                console.log('Data of response:\n', data)
                const response = await axios.delete(`${API_URL}/condition/deleta-condicionante/${data?.c_id}`)
                await condtionsResult.refetch()
                await messageApi.warning(response?.data?.message)
            } catch (error) {
                console.info('Log de erro:\n', error)
            }   
        }

    // }configuração de delete da condicionante
        
    //configuração de atualizar condição especifica {
        const updateConditionOne = async (data: any) =>{
            try {
                console.log('Data for update', valueInputCondition)
                console.log('Data referer send', data)
                await condtionsResult.refetch()
            } catch (error) {
                console.info('Log of error:', error)
            }
        }
    //} configuração de atualizar condição especifica

    

    


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
            render: (_,record)=>(
                <Space>
                    { inputDescTpID === record?.c_id ? (
                        <>
                            <Input
                                size='small' 
                                style={{ width: spanWidth[record?.c_id]+20 || "auto" }}
                                value={valueInputTp}
                                onChange={handleChangeInputTp}
                            />
                            <Button
                                size="small"
                                shape="circle"
                                onClick={()=>updateTitleDescType(record)}
                                icon={<Save fontSize="inherit" />}
                            />
                            <Button
                                size="small"
                                shape="circle"
                                icon={<CloseSharp fontSize='inherit'/>}
                                onClick={()=>handlerInputDescType(null)}
                            />

                        </>
                    ) : (
                        <>
                            <span ref={(el)=>{
                                if (el) spanRef.current[record?.c_id] = el;
                            }}>
                                {record?.c_tipo}
                            </span>
                            {/* BOTÃO DE EDITAR */}
                            <Button
                                size="small"
                                shape="circle"
                                onClick={() => handlerInputDescType(record)}
                                icon={<EditFilled />}
                            />
                            {/* BOTÃO DE EDITAR */}

                            {/* BOTÃO DE DELETAR CONDICIONANDO!!! */}
                            <Button
                                size="small"
                                shape="circle"
                                onClick={()=>deleteCondition(record)}
                                icon={<Delete fontSize='inherit' htmlColor={ 'red' } />}
                            />
                            {/* BOTÃO DE DELETAR CONDICIONANDO!!! */} 
                        </>
                    )}
                </Space>

                
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
   

    //console.info('Valor recebido da valueInputConditionOne: ', valueInputConditionOne)
    return (
        <>
            <List title='Condição' breadcrumb createButtonProps={{ children: "Nova condição", onClick: ()=>{setIsModal(true)}, icon: <IssuesCloseOutlined /> }} >
                <Table columns={columns} dataSource={condtionsResult.data?.data} scroll={{ x: 'max-content' }} size='small'/>
                {contextHolder}
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


            <Modal open={modalList} onCancel={() => setModalList(false)} styles={{ body: { paddingTop: '28px' } }} okButtonProps={{ hidden: true }} cancelButtonProps={{ hidden: true }}>
                <Table dataSource={listCond} size='small' bordered scroll={{ x: true }}>
                    <Table.Column title='Condição' key="condition" render={(_, record) =>
                    (<>
                        <Space>
                            {record === valueInputConditionOne ? (
                                <>
                                    <Input
                                        size="small"
                                        value={valueInputCondition}
                                        onChange={(e) => setValueInputCondition(e.target.value)} // Atualiza o estado com o valor do input
                                    />
                                    <Button
                                        size="small"
                                        shape="circle"
                                        icon={<Save fontSize="inherit" />}
                                        onClick={async () => {
                                            await updateConditionOne(valueInputConditionOne);
                                            await setValueInputCondition('');
                                            await setValueInputConditionOne('');
                                        }}
                                    />
                                    <Button
                                        size="small"
                                        shape="circle"
                                        icon={<CloseSharp fontSize="inherit" />}
                                        onClick={() => {
                                            setValueInputCondition('');
                                            setValueInputConditionOne('')
                                        }}
                                    />
                                </>
                            ) : (
                                <>
                                    <span style={{ marginRight: 5 }}>{record}</span>
                                    <Button
                                        shape="circle"
                                        size="small"
                                        icon={<Edit fontSize="inherit" />}
                                        onClick={async () => { await setValueInputCondition(record); await setValueInputConditionOne(record) }} // Define o valor para edição
                                    />
                                </>
                            )}
                        </Space>
                    </>
                    )} />
                </Table>
            </Modal>

        </>
    )
};
