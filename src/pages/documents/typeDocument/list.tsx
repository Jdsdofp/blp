import React, { useEffect, useRef, useState } from 'react';
import { Badge, Button, Col, DatePicker, Form, Input, InputNumber, message, Modal, Popconfirm, Row, Select, Space, Spin, Switch, Table, Tabs, Tag } from 'antd';
import type { TableProps } from 'antd';
import { DateField, Edit, EditButton, List, useForm } from '@refinedev/antd';
import { ClearOutlined, ClockCircleFilled, EditFilled } from '@ant-design/icons';
import { useInvalidate, useList } from '@refinedev/core';
import {  Check, CloseFullscreen, CloseSharp, Delete, DocumentScanner, EditAttributes, EditAttributesOutlined, Save, SaveAlt } from '@mui/icons-material';
import axios from 'axios';
import { API_URL } from '../../../authProvider';
import { useNotifications } from '../../../contexts/NotificationsContext';

interface ITypeDoc {
    td_id: number;
    td_desc: string;
    td_ativo: boolean;
    td_requer_condicao: boolean[];
    criado_em: Date;
    td_em_uso: Boolean;
    td_dia_alert: number;
  }


export const DocTypeDocCreate = () => {
    const { notifications, loading, fetchNotifications, markAsRead } = useNotifications();
        
          useEffect(() => {
            fetchNotifications();
          }, [fetchNotifications]);

    const [isModal, setIsModal] = useState(false)
    const [ messageApi, contextHolder ] = message.useMessage();

    //variaveis de estado
    const [idTdDesc, setIdTdDesc] = useState<number | null>(null)
    const [valueInputTdDesc, setValueInputTdDesc] = useState<any>('')
    const [resultReturn, setResultReturn] = useState<boolean | null>(null)
    const [stateIdSwitch, setStateIdSwitch] = useState<boolean>()
    const {data: typeDocsResult, isLoading, refetch} = useList({resource: 'type-document', meta: {endpoint: 'listar-tipo-documentos'}, liveMode: 'auto'})

    //variaveis de estado capture width magic...
    const spanRef = useRef({}); // Referências individuais para cada registro
    const [spanWidth, setSpanWidth] = useState({}); // Largura armazenada por ID



    const handlerInputDesc = (record) => {
        setValueInputTdDesc(record?.td_desc)
        if (record) {
            // Obtém a largura do elemento relacionado ao registro
            const width = spanRef.current[record.td_id]?.getBoundingClientRect().width || 100;
            setSpanWidth((prev) => ({
                ...prev,
                [record.td_id]: width, // Armazena a largura calculada
            }));
        }
        setIdTdDesc(record?.td_id || null); // Atualiza o ID atual para edição
    };
    
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
            messageApi.error(error?.response?.data?.message);
        }
    };
    
    const updateReqConditionTypeDoc = async (data: any, checked: boolean) =>{
        try {
            //console.log('Verificando o state de checked\n', checked)
            //console.log('Verificando o ID\n', data?.td_id)
            
            const payload = {
                state: checked
            }
            const response = await axios.put(`${API_URL}/type-document/editar-req-condicionante-tipo-doc/${data?.td_id}`, payload)
            messageApi.warning(`${response.data?.tp_doc.td_desc}, ${response?.data?.message}`)
            

            
            setStateIdSwitch(response?.data?.tp_doc.td_id === data?.td_id)
            
        } catch (error) {
            console.log('Log de erro', error)
        }
    }

    useEffect(() => {
        if (stateIdSwitch) {
            setStateIdSwitch(true);
        } else {
            setStateIdSwitch(false);
        }
      }, [stateIdSwitch]);


      useEffect(() => {
        if (spanRef?.current?.clientWidth) {
            // Obtém a largura quando o componente renderiza
            setSpanWidth(spanRef.current.getBoundingClientRect().width);
        }
    }, [valueInputTdDesc]); // Atualiza quando os dados mudam

   
    const hendleSwittchChangeTypeDoc = async (checked: boolean, record: any) => {
        try {
            await updateReqConditionTypeDoc(record, checked);
            refetch(); // Recarrega os dados da API para refletir as mudanças
        } catch (error) {
            messageApi.error("Erro ao atualizar switch");
        }
    };


    const hendlerDeleteTypeDoc = async (record: any) =>{
        try {
            const response = await axios.delete(`${API_URL}/type-document/deletar-tipo-documento/${record?.td_id}`)
            //messageApi.error(`${response.data?.tp_doc.td_desc}, ${response?.data?.message}`)
            messageApi.error(`${response?.data?.message}`)
            await refetch()
        } catch (error) {
            
        }
    }

   const updateStateTpCond = async (data: any, td_id: number) =>{
        try {
            console.info('Data of response: ', data);
            console.info('ID params: ', td_id)
        } catch (error) {
            console.log('Log of errors: ', error)
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
                                style={{ width: spanWidth[record?.td_id]+20 || "auto" }}
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
                            <p
                                ref={(el) => {
                                    if (el) spanRef.current[record.td_id] = el;
                                }}
                            >
                                {record?.td_desc}
                            </p>
                            <Space>


                                {/* BOTÃO DE EDITAR */}
                                <Button
                                    size="small"
                                    shape="circle"
                                    onClick={() => handlerInputDesc(record)}
                                    icon={<EditFilled />}
                                />
                                {/* BOTÃO DE EDITAR */}


                                {/* BOTÃO DE DELETAR CONDICIONANDO!!! */}
                                <Popconfirm
                                    title="Tem certeza que dejesa deletar"
                                    onConfirm={()=>hendlerDeleteTypeDoc(record)}
                                    okText="Sim"
                                    cancelText="Não"
                                    placement='rightTop'
                                >
                                    <Button
                                        size="small"
                                        shape="circle"
                                        disabled={record?.td_em_uso}
                                        icon={<Delete fontSize='inherit' htmlColor={record?.td_em_uso ? 'gray' : 'red' } />}
                                    />
                                </Popconfirm>
                                {/* BOTÃO DE DELETAR CONDICIONANDO!!! */}


                            </Space>
                        </>
                    )}
                </Space>
            ),
        },

        {
           key: 'td_dia_alert',
           title: 'Alerta Vencimento',
           dataIndex: 'td_dia_alert'
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
            render: (_, record) => (
                <>  
                    <Switch
                        size="small"
                        onChange={(checked) => hendleSwittchChangeTypeDoc(checked, record)}
                        checkedChildren="Sim"
                        unCheckedChildren="Não"
                        checked={record?.td_requer_condicao || false} // Usa o valor do backend
                    />
                </>
            )
        }
        ,

        {
            key: 'td_ativo',
            title: 'Status',
            align: 'center',
            width: '80px',
            render: (_, {td_ativo, td_id})=>(
                <Tag color={td_ativo ? 'green' : 'error'} style={{fontSize: 10}} onClick={ ()=>  updateStateTpCond(td_ativo, td_id)}> <Badge color={td_ativo ? 'green': 'red'}/> {td_ativo ? 'Ativo' : 'Desativado'}</Tag>
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
                                    <Form.Item  label="Padrão Vencimento" name="td_dia_alert">
                                        <InputNumber type='number' datatype='number' decimalSeparator=',' controls={false}/>    
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
