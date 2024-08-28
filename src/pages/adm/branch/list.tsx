import React, { useEffect, useState } from 'react';
import { Badge, Col, Form, Input, Modal, Row, Select, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { List } from '@refinedev/antd';
import { BranchesOutlined, ClearOutlined } from '@ant-design/icons';
import { useTable } from '@refinedev/core';
import InputMask from 'react-input-mask';

interface IBranchs {
    f_id: number;
    f_nome: string;
    f_cnpj: number;
    f_cidade: string;
    f_uf: string;
    f_endereco: string;
    f_latitude: number;
    f_longitude: number;
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
    const [selectedUf, setSelectedUf] = useState("");
    const [isModal, setIsModal] = useState(false)
    const { tableQueryResult: companiesResult } = useTable({ resource: 'company', meta: {endpoint: 'listar-empresas'},syncWithLocation: false});
    const {tableQueryResult: branchsResult} = useTable<IBranchs>({resource: 'branch', meta: {endpoint: 'listar-filiais'}, syncWithLocation: false, liveMode: 'auto'})

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
                .catch(error => console.error('Erro ao buscar municípios:', error));
        
    }, []);


    useEffect(() => {
        if (uf) {
            fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
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
    }, [uf]);
    
    useEffect(() => {
        if (selectedUf) {
          fetch(`https://servicodados.ibge.gov.br/api/v2/localidades/estados/${selectedUf}/municipios`)
            .then(response => response.json())
            .then(data => {
              const municipiosFormatted = data.map((municipio: any) => ({
                codigo: municipio.id,
                nome: municipio.nome
              }));
              setMunicipios(municipiosFormatted);
            })
            .catch(error => console.error('Erro ao buscar municípios:', error));
        }
      }, [selectedUf]);
    
      
    const columns: TableProps<IBranchs>['columns'] = [
        {
            key: 'f_id',
            title: 'ID',
            dataIndex: 'f_id',
            render: (f_id)=><a>#{f_id}</a>
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
    
    const unidades = ufs.map((e: any)=>({
        label: e.unidade,
        value: e.unidade
    }))

    return (
        <>
            <List breadcrumb createButtonProps={{ children: "Nova Filial", onClick: ()=>{setIsModal(true)}, icon: <BranchesOutlined /> }}>
                <Table columns={columns} dataSource={branchsResult.data?.data} scroll={{ x: 'max-content' }} size='small'/>
            </List>

            <Modal title='Cadastrar Filial' open={isModal} onCancel={hadleCancel} centered>
                <Form layout="vertical" style={{ width: '100%' }}>
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
                            <Form.Item label="Código" name="e_nome">
                                <Input type='number' allowClear={{ clearIcon: <ClearOutlined /> }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="CNPJ" name="e_cnpj" rules={[{ required: true, message: "CNPJ da empresa é obrigatório" }]}>
                                <InputMask mask="99.999.999/9999-99">
                                    {(inputProps: any) => <Input {...inputProps} placeholder="00.000.000/0000-00" allowClear={{ clearIcon: <ClearOutlined /> }} />}
                                </InputMask>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="UF" name="f_uf" rules={[{ required: true, message: "UF é obrigatória" }]}>
                                <Select showSearch allowClear onChange={(value) => setUf(value)} options={unidades} />
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
                            <Form.Item label="Latitude" name="latitude" rules={[{ required: true, message: "Latitude é obrigatória" }]}>
                                <InputMask mask="-99.999999">
                                    {(inputProps: any) => <Input {...inputProps} placeholder="00.000000" allowClear={{ clearIcon: <ClearOutlined /> }} />}
                                </InputMask>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item label="Longitude" name="longitude" rules={[{ required: true, message: "Longitude é obrigatória" }]}>
                                <InputMask mask="-99.999999">
                                    {(inputProps: any) => <Input {...inputProps} placeholder="00.000000" allowClear={{ clearIcon: <ClearOutlined /> }} />}
                                </InputMask>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

        </>
    )
};
