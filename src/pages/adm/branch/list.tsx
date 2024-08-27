import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { DateField, DeleteButton, EditButton, List, ShowButton } from '@refinedev/antd';
import { BranchesOutlined, UserAddOutlined } from '@ant-design/icons';
import { BaseRecord, useList, useTable } from '@refinedev/core';
import Link from 'antd/es/typography/Link';

interface IBranchs {
  f_id: number;
  f_nome: string;
  f_cnpj: number;
  f_cidade: string;
  f_uf: string;
  f_endereco: string;
  empresa: object;
  f_criado_em: Date;
}


export const AdmBranchlist = () => {
    const {tableQueryResult: branchsResult} = useTable<IBranchs>({resource: 'branch', meta: {endpoint: 'listar-filiais'}, syncWithLocation: false})


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
            key: 'f_cidade',
            title: 'Cidade',
            render: (_, record)=>(
                <span>{record.f_cidade}-{record.f_uf}</span>
            )
        }
    ]

    return (
      <List breadcrumb createButtonProps={{ children: "Nova Filial", icon: <BranchesOutlined /> }}>
         <Table columns={columns} dataSource={branchsResult.data?.data}/>
      </List>
    )

};
