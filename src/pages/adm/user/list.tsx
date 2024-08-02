import React, { Children } from 'react';
import { Space, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { DeleteButton, EditButton, List, ShowButton } from '@refinedev/antd';
import { UserAddOutlined } from '@ant-design/icons';
import { BaseRecord, useTable } from '@refinedev/core';

interface DataType {
  key: number;
  name: string;
  email: string;
  criado_em: Date;
  status: boolean;
  acoes: [string]
}

const {Title} = Typography;

const columns: TableProps<DataType>['columns'] = [
    {
        title: 'ID',
        dataIndex: 'key',
        key: 'key',
        render: (text) => <a>{text}</a>,
      },
    {
    title: 'Nome',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Data criação',
    dataIndex: 'criado_em',
    key: 'criado_em',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (_, {status})=>(
      <>
        {
          <Tag color={status ? "blue" : "error"}>{status ? "Ativado" : "Desativado"}</Tag>
        }
      </>
    )
  },
  {
    title: 'Ações',
    dataIndex: 'acoes',
    key: 'acoes',
    render: (_, record: BaseRecord)=>(
      <Space>
        <EditButton hideText size='small'  />
        <ShowButton hideText size='small'/>
        <DeleteButton hideText size='small' confirmTitle='Deseja realmente excluir?' confirmCancelText='Não' confirmOkText='Sim'/>
      </Space>
    )
  }
];



const users = [];

for (let i = 1; i <= 100; i++) {
  users.push({
    key: i,
    name: 'Joe Black',
    email: 'email@email.com',
    criado_em: Date(), // Gera a data e hora atual
    status: true
  });
}

const data: DataType[] = users;

export const AdmUserlist = () => {
  
    return (
        <List breadcrumb createButtonProps={{children: "Novo Usuário", icon: <UserAddOutlined/>}}>
            <Table columns={columns} dataSource={data} />
        </List>
    )

};
