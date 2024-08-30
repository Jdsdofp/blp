import React, { useEffect, useState } from 'react';
import { Badge, Button, Col, Form, Input, Modal, Popover, Row, Select, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { List, useForm } from '@refinedev/antd';
import { ArrowRightOutlined, BranchesOutlined, ClearOutlined, FrownTwoTone } from '@ant-design/icons';
import { useTable } from '@refinedev/core';
import InputMask from 'react-input-mask';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { BackHandOutlined } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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

const formatCNPJ = (cnpj: any) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
};

export const AdmBranchlist = () => {
    const [municipios, setMunicipios] = useState([]);
    const [uf, setUf] = useState("");
    const [ufs, setUfs] = useState([])
    const [selectedUf, setSelectedUf] = useState([]);
    const [isModal, setIsModal] = useState(false)
    const { tableQueryResult: companiesResult } = useTable({ resource: 'company', meta: {endpoint: 'listar-empresas'},syncWithLocation: false});
    const {tableQueryResult: branchsResult} = useTable<IBranchs>({resource: 'branch', meta: {endpoint: 'listar-filiais'}, syncWithLocation: false, liveMode: 'auto'})
    const {formProps, form, saveButtonProps} = useForm<IBranchs>({resource: 'branchsCreate', action: 'create'})
    const [currentStep, setCurrentStep] = useState(0); // Controle da etapa atual

    

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

          
    const columns: TableProps<IBranchs>['columns'] = [
        {
            key: 'f_id',
            title: 'ID',
            dataIndex: 'f_id',
            render: (f_id)=><a>#{f_id}</a>,
            width: 30,
            
        },

        {
            key: 'f_codigo',
            title: 'Cod. Filial',
            dataIndex: 'f_codigo',
            
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
                <span>{record.f_cidade}-{record.f_uf}</span>
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

    const handleNext = () => {
        setCurrentStep(prevStep => prevStep + 1);
    };

    const handleBack = () => {
        setCurrentStep(prevStep => prevStep - 1);
    };

    
    const unidades = ufs.map((e: any)=>({
        label: e.unidade,
        value: e.unidade
    }))

    
    
    return (
        <>
            <List breadcrumb createButtonProps={{ children: "Nova Filial", onClick: ()=>{setIsModal(true)}, icon: <BranchesOutlined /> }}>
                <Table columns={columns} dataSource={branchsResult.data?.data} scroll={{ x: 'max-content' }} size='small' loading={branchsResult.isLoading}/>
            </List>

            <Modal 
                title='Cadastrar Filial' 
                open={isModal} 
                onCancel={hadleCancel} 
                centered 
                okButtonProps={saveButtonProps} 
                loading={companiesResult.isLoading}
            >
                {currentStep === 0 && (
                <Form  {...formProps} form={form} layout="vertical" style={{ width: '100%' }}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Empresa" name="f_empresa_id" rules={[{ required: true, message: 'Empresa Obrigatória' }]}>
                                <Select options={companiesOptions} />
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
                        <Col xs={24} sm={12}>
                            <Form.Item label="Insc. Municiapal" name="f_insc_municipal">
                                <Input type='number' allowClear={{ clearIcon: <ClearOutlined /> }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Insc. Estadual" name="f_insc_estadual">
                                <Input type='number' allowClear={{ clearIcon: <ClearOutlined /> }} />
                            </Form.Item>
                        </Col>
                    </Row>
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
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Latitude" name="f_latitude">
                                <InputMask mask="-99.999999">
                                    {(inputProps: any) => <Input {...inputProps} placeholder="00.000000" allowClear={{ clearIcon: <ClearOutlined /> }} />}
                                </InputMask>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Longitude" name="f_longitude">
                                <InputMask mask="-99.999999">
                                    {(inputProps: any) => <Input {...inputProps} placeholder="00.000000" allowClear={{ clearIcon: <ClearOutlined /> }} />}
                                </InputMask>
                            </Form.Item>
                        </Col>
                        <Button size='small' type='link' onClick={handleNext}><span style={{fontSize: 10}}>Endereço</span>{<ArrowForwardIcon fontSize='small' />}</Button>
                    </Row>
                    

                    
                </Form>

                )}   
                    {currentStep === 1 && (
                        <Form {...formProps} form={form} layout="vertical" style={{ width: '100%' }}>
                        <Button size='small' type='link' onClick={handleBack}>{<ArrowBackIcon fontSize='small' />}<span style={{fontSize: 10}}>Area cadastro</span></Button>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Empresa" name="f_empresa_id" rules={[{ required: true, message: 'Empresa Obrigatória' }]}>
                                    <Select /* opções aqui */ />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Nome" name="f_nome" rules={[{ required: true, message: 'Nome da filial é obrigatório' }]}>
                                    <Input />
                                </Form.Item>

                            </Col>
                        </Row>
                    </Form>
                )}
            </Modal>

        </>
    )
};
