import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { DateField, DeleteButton, EditButton, List, ShowButton } from '@refinedev/antd';
import { UserAddOutlined } from '@ant-design/icons';
import { BaseRecord, useTable } from '@refinedev/core';
import Link from 'antd/es/typography/Link';
import { useNotifications } from '../../../contexts/NotificationsContext';

interface DataType {
  key: number;
  name: string;
  email: string;
  criado_em: Date;
  u_ativo: boolean;
  acoes: [string];
  empresa: number[];
}


export const AdmUserlist = () => {
  const { notifications, loading, fetchNotifications, markAsRead } = useNotifications();
      
        useEffect(() => {
          fetchNotifications();
        }, [fetchNotifications]);

  const hendleDelete = (record)=>{
    if(record){
      tableQueryResult.refetch()
    }

  } 

  const { tableQueryResult } = useTable({ resource: "user", syncWithLocation: true, liveMode: "auto", meta: {
    endpoint: "listar-usuarios"
  } })
  
  useEffect(()=>{
    tableQueryResult.refetch();
  },[])
  
  const columns: TableProps<DataType>['columns'] = [
    {
        title: 'ID',
        dataIndex: 'u_id',
        key: 'u_id',
        render: (text) => <a>#{text}</a>,
      },
    {
    title: 'Nome',
    dataIndex: 'u_nome',
    key: 'u_nome',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Email',
    dataIndex: 'u_email',
    key: 'u_email',
  },
  {
    title: 'Data criação',
    dataIndex: 'criado_em',
    key: 'criado_em',
    render: (_, {criado_em})=>(
      <>
          <DateField style={{fontSize: 11}} type='secondary' value={criado_em} format='DD/MM/YYYY HH:mm:ss' />
      </>
    )
  },
  {
    title: 'Status',
    dataIndex: 'u_ativo',
    key: 'u_ativo',
    render: (_, {u_ativo})=>(
      <>
        {
          <Tag color={u_ativo ? "success" : "error"}>{u_ativo ? "Ativado" : "Desativado"}</Tag>
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
        <EditButton hideText size='small' recordItemId={record.u_id}/>
        { record.u_empresas_ids.length || record.u_filiais_ids.length ? null : (
          <DeleteButton hideText size='small' confirmTitle='Deseja realmente excluir?' confirmCancelText='Não' confirmOkText='Sim' recordItemId={record.u_id} onSuccess={()=>hendleDelete(record)} successNotification={false}/>
        )}
      </Space>
    
    )
  },
  {
    title: 'Empresa',
    dataIndex: 'u_empresas_ids',
    key: 'u_empresas_ids',
    render: (empresas)=>(
      <span>
        {empresas.slice(0, 4).map((id: any)=>(
             <Tag key={id} color='geekblue'><Link type='secondary'>{id}</Link></Tag>
        ))}

        {empresas.length > 4 && <Tag key="Mais">...</Tag>}
      </span>
    )
  }
];


    return (
      <List breadcrumb createButtonProps={{ children: "Novo Usuário", icon: <UserAddOutlined /> }}>
        
          <Table dataSource={tableQueryResult.data?.data} columns={columns} scroll={{ x: 'max-content' }} loading={tableQueryResult.isLoading}/>
        
      </List>
    )

};
