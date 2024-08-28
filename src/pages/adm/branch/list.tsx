import React, { useEffect, useState } from 'react';
import { Badge, Form, Input, Modal, Select, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { DateField, DeleteButton, EditButton, List, ShowButton } from '@refinedev/antd';
import { BranchesOutlined, ClearOutlined, UserAddOutlined } from '@ant-design/icons';
import { BaseRecord, useList, useTable } from '@refinedev/core';
import Link from 'antd/es/typography/Link';
import InputMask from 'react-input-mask';

interface IBranchs {
  f_id: number;
  f_nome: string;
  f_cnpj: number;
  f_cidade: string;
  f_uf: string;
  f_endereco: string;
  empresa: object;
  responsavel: object;
  f_criado_em: Date;
  f_ativo: boolean;
}

const formatCNPJ = (cnpj: any) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
};

export const AdmBranchlist = () => {
    const [isModal, setIsModal] = useState(false)
    const {tableQueryResult: branchsResult} = useTable<IBranchs>({resource: 'branch', meta: {endpoint: 'listar-filiais'}, syncWithLocation: false, liveMode: 'auto'})


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
            render: (_, record)=>(
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
            render: (_, record)=>(
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

    return (
        <>
            <List breadcrumb createButtonProps={{ children: "Nova Filial", onClick: ()=>{setIsModal(true)}, icon: <BranchesOutlined /> }}>
                <Table columns={columns} dataSource={branchsResult.data?.data} scroll={{ x: 'max-content' }} size='small'/>
            </List>

            <Modal title="Cadastrar Filial" open={isModal} onCancel={hadleCancel} centered>
                    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 20 }} layout="vertical" style={{ width: '100%' }}>

                    <Form.Item label="Empresa" name="f_empresa_id" rules={[{required: true, message: 'Empresa Obrigatoria'}]}>
                        <Select >
                        <Select.Option value="PI">PI</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Nome" name="f_nome" rules={[{required: true, type: 'string', message: 'Nome da filial é obrigatorio'}]}>
                        <Input />
                    </Form.Item>
 
                    <Form.Item label="Codigo" name="e_nome">
                        <Input type='number' allowClear={{clearIcon: <ClearOutlined />}}/>
                    </Form.Item>

                    <Form.Item label="CNPJ" name="e_cnpj" rules={[{ required: true, message: "Cnpj empresa obrigatorio" }]}>
                        <InputMask mask="99.999.999/9999-99">
                            {(inputProps: any) => <Input {...inputProps} placeholder="00.000.000/0000-00" allowClear={{clearIcon: <ClearOutlined />}}/>}
                        </InputMask>
                    </Form.Item>


                    <Form.Item label="Cidade" name="e_cidade" rules={[{required: true, message: 'Cidade empresa obrigatorio'}]}>
                        <Select>
                        <Select.Option value="Teresina">Teresina</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                    </Form.Item>
                    </Form>
            </Modal>
        
        </>




    )

};
