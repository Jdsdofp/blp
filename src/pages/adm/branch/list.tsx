import React, { useEffect, useState } from 'react';
import { Badge, Button, Col, Form, Input, message, Modal, Popconfirm, Row, Select, Table, Tabs, Tag } from 'antd';
import type { TableProps } from 'antd';
import { List, useForm } from '@refinedev/antd';
import {  BranchesOutlined, ClearOutlined } from '@ant-design/icons';
import { useInvalidate, useTable } from '@refinedev/core';
import InputMask from 'react-input-mask';
import { AddLocation, Edit } from '@mui/icons-material';
import axios from 'axios';
import { ModalEditBranch } from './components/modalEdit';
import { API_URL } from '../../../authProvider';
import { useNotifications } from '../../../contexts/NotificationsContext';

interface IBranchs {
    f_id: number;
    f_nome: string;
    f_codigo: number;
    f_cnpj: number;
    f_cidade: string;
    f_uf: string;
    f_endereco: string;
    f_endereco_complemento: string;
    f_latitude: string;
    f_longitude: string;
    empresa: object;
    responsavel: object;
    f_criado_em: Date;
    f_ativo: boolean;
  }

const formatCNPJ = (cnpj: any) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
};

export const AdmBranchlist = () => {
    const { notifications, loading, fetchNotifications, markAsRead } = useNotifications();
    
      useEffect(() => {
        fetchNotifications();
      }, [fetchNotifications]);



    const [bdgStatus, setBagStatus] = useState<number>(0)
    const [municipios, setMunicipios] = useState([]);
    const [ufs, setUfs] = useState([])
    const [isModal, setIsModal] = useState(false)
    const { tableQueryResult: companiesResult } = useTable({ resource: 'company', meta: {endpoint: 'listar-empresas'},syncWithLocation: false});
    const {tableQueryResult: branchsResult} = useTable<IBranchs>({resource: 'branch', meta: {endpoint: 'listar-filiais'}, syncWithLocation: false, liveMode: 'auto'})
    const [iState, setIstate] = useState<boolean>()
    const [messageApi, contextHolder] = message.useMessage()
    //VARIAIVES EDIT MODAL
    const [isModalEditBranch, setIsModalEditBranch] = useState<boolean>()
    const [isDataEdit, setIsDataEdit] = useState<any>(null)
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

    useEffect(() => {
        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`)
            .then(response => response.json())
            .then(data => {
                const estadosFormatados = data.map((estado: any) => ({
                    unidade: estado.sigla,
                    nome: estado.nome
                }));
                setUfs(estadosFormatados);
            })
            .catch(error => console.error('Erro ao buscar estados:', error));
    }, []);

    useEffect(() => {
        if (!form.getFieldValue('f_uf')) {
            setMunicipios([]); // Limpar municípios quando UF estiver vazio
        }
    }, [form.getFieldValue('f_uf')]);



    const handleUfChange = (value: string) => {
        form.setFieldsValue({ f_cidade: undefined }); // Limpar o campo de cidade
        setMunicipios([]); // Limpar municípios

        if (value) {
            fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${value}/municipios`)
                .then(response => response.json())
                .then(data => {
                    const municipiosFormatados = data.map((municipio: any) => ({
                        codigo: municipio.id,
                        nome: municipio.nome
                    }));
                    setMunicipios(municipiosFormatados);
                })
                .catch(error => console.error('Erro ao buscar municípios:', error));
        }
    };

    const handleStatusEdit = async (state: boolean, f_id: number) =>{
        try {

            const newSate = !state;

            setIstate(newSate);

            const payload = {
                state: newSate
            }

            console.log('Estado', newSate)

            const response = await axios.patch(`${API_URL}/branch/status-filial/${f_id}`, payload)
            messageApi.success(response?.data?.message)
            await branchsResult.refetch()

        } catch (error) {
            console.log('Log de erro')
        }
    }

          
    const columns: TableProps<IBranchs>['columns'] = [

        {
            key: 'f_codigo',
            title: 'Nº Loja',
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
                <span>{formatCNPJ(record.f_cnpj)}</span>
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
            render: (_, {f_ativo, f_id})=>(
                <Popconfirm 
                    title={`Tem certeza que deseja ${f_ativo ? 'BAIXAR🔴' : 'ATIVAR🟢'} essa filial?`}
                    onConfirm={async ()=> await handleStatusEdit(f_ativo, f_id)}
                    okText="Sim"
                    cancelText="Não"
                >
                    <Tag color={f_ativo ? 'green' : 'error'} style={{fontSize: 10, cursor: 'pointer'}}> <Badge color={f_ativo ? 'green': 'red'}/> {f_ativo ? 'Ativa' : 'Baixada'}</Tag>
                </Popconfirm>
            )
        },

        {
            key: 'acao',
            title: 'Ações',
            render: (_, record) =>(
                <>
                    <Button size='small' shape='circle' icon={<Edit fontSize='inherit'/>} onClick={async ()=>{ await setIsModalEditBranch(true); await setIsDataEdit(record)}}/>
                </>
            )
        }
    ]

    const hadleCancel = () =>{
        setIsModal(false)
    
    }

    //MODAL EDIT
    const hadleCancelModalEdit = () =>{
        setIsModalEditBranch(false)
        
    }
    
    const unidades = ufs.map((e: any)=>({
        label: e.unidade,
        value: e.unidade
    }))


    const consultarCEP = async (cep: any) => {
        try {
            const cepLimpo = cep.replace(/\D/g, '');
            const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    
            if (response.data.erro) {
                console.error("CEP não encontrado!");
                return;
            }
    
            const { logradouro, bairro, localidade } = response.data;
    
            setEndereco({
                f_endereco_logradouro: logradouro,
                f_endereco_bairro: bairro,
                f_cidade: localidade
            });
    
            form.setFieldsValue({
                f_endereco_logradouro: logradouro,
                f_endereco_bairro: bairro,
                f_cidade: localidade
            });
    
        } catch (error) {
            console.error("Erro ao consultar o CEP:", error);
        }
    };
    

    
    const { TabPane } = Tabs;
    
    const handleBadge = () => {
        let stts = form.getFieldValue();
        let statusCount = 0;

        Object.keys(stts).forEach((key) => {
            if(stts[key]){
                statusCount++;
            }
        });

        setBagStatus(statusCount)
    };
    
    
    return (
        <>
            <List breadcrumb createButtonProps={{ children: "Nova Filial", onClick: ()=>{setIsModal(true)}, icon: <BranchesOutlined /> }} headerProps={{subTitle: <span style={{fontSize: 10}}>Total.: {branchsResult.data?.total}</span>}} >
                <Table columns={columns} dataSource={branchsResult.data?.data} scroll={{ x: 'max-content' }} size='small' loading={branchsResult.isLoading} bordered />
            
            </List>

            <Modal 
            title='Cadastrar Filial' 
            open={isModal} 
            onCancel={hadleCancel} 
            centered 
            okButtonProps={saveButtonProps} 
            >
            <Form 
                {...formProps} 
                form={form} 
                layout="vertical" 
                style={{ width: '100%' }}
                onChange={handleBadge}
            >
                
                <Tabs defaultActiveKey="1">
                        <TabPane tab={['Cadastro Filial ',  bdgStatus > 0 ? <Badge dot={bdgStatus === 0} color={bdgStatus >=3 ? 'green' : bdgStatus === 1 ? 'red' : 'yellow'} size='small'/> : null]}  icon={<BranchesOutlined size={10}/>} key="1">
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Empresa" name="f_empresa_id" rules={[{ required: true, message: 'Empresa Obrigatória' }]}>
                                        <Select options={companiesOptions}/>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Nome" name="f_nome" rules={[{ required: true, type: 'string', message: 'Nome da filial é obrigatório' }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Código" name="f_codigo">
                                        <Input type='number' allowClear={{ clearIcon: <ClearOutlined /> }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="CNPJ" name="f_cnpj" rules={[{ required: true, message: "CNPJ da empresa é obrigatório" }]}>
                                        <InputMask mask="99.999.999/9999-99">
                                            {(inputProps: any) => <Input {...inputProps} placeholder="00.000.000/0000-00" allowClear={{ clearIcon: <ClearOutlined /> }} />}
                                        </InputMask>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Insc. Municipal" name="f_insc_municipal">
                                        <Input type='number' allowClear={{ clearIcon: <ClearOutlined /> }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Insc. Estadual" name="f_insc_estadual">
                                        <Input type='number' allowClear={{ clearIcon: <ClearOutlined /> }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </TabPane>
                        
                    <TabPane tab="Endereço" icon={<AddLocation fontSize='small'/>} key="2">
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item label="UF" name="f_uf" rules={[{ required: true, message: "UF é obrigatória" }]}>
                                    <Select showSearch allowClear onChange={handleUfChange} options={unidades} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Cidade" name="f_cidade" rules={[{ required: true, message: "Cidade da empresa é obrigatória" }]}>
                                    <Select showSearch allowClear>
                                        {municipios.map((municipio: any) => (
                                            <Select.Option key={municipio.codigo} value={municipio.nome}>
                                                {municipio.nome}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Form.Item label="CEP" name="f_cep" rules={[{ required: true, message: 'CEP é obrigatório' }]}>
                                    <Input 
                                        onBlur={(e) => consultarCEP(e.target.value)} 
                                        placeholder="00000-000"
                                        allowClear={{ clearIcon: <ClearOutlined /> }} 
                                    />
                                </Form.Item>
                            </Col>


                            <Col xs={24} sm={12}>
                                    <Form.Item label="Logradouro" name="f_endereco_logradouro">
                                        <Input allowClear={{ clearIcon: <ClearOutlined /> }} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Bairro" name="f_endereco_bairro">
                                        <Input value={endereco.f_endereco_bairro} allowClear={{ clearIcon: <ClearOutlined /> }} />
                                    </Form.Item>
                                </Col>
                                
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Complemento" name="f_endereco_complemento">
                                        <Input value={endereco.f_endereco_complemento} allowClear={{ clearIcon: <ClearOutlined /> }} />
                                    </Form.Item>
                                </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Latitude" name="f_latitude">
                                    <Input placeholder="00.000000" allowClear={{ clearIcon: <ClearOutlined /> }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Longitude" name="f_longitude">
                                    <Input placeholder="00.000000" allowClear={{ clearIcon: <ClearOutlined /> }} />
                                </Form.Item>
                            </Col>
                            
                        </Row>
                    </TabPane>
                </Tabs>
            </Form>
        </Modal>

        <ModalEditBranch
            companiesOptions={companiesOptions}
            consultarCEP={consultarCEP}
            endereco={endereco}
            hadleCancelModalEdit={hadleCancelModalEdit}
            handleUfChange={handleUfChange}
            isModalEditBranch={isModalEditBranch}
            isDataEdit={isDataEdit}
            municipios={municipios}
            unidades={unidades}
            refreshTable={branchsResult}
        
        />
        {contextHolder}
        </>
    )
};
