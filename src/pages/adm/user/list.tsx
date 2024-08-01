import React, { Children } from 'react';
import { Space, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { List } from '@refinedev/antd';
import { DashOutlined, UserAddOutlined } from '@ant-design/icons';
import { AdUnitsOutlined } from '@mui/icons-material';

interface DataType {
  key: number;
  name: string;
  email: string;
  criado_em: string;
  status: boolean;
  tags: string[];
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
    title: 'Criado',
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
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: 1,
    name: 'John Brown',
    email: 'email@email.com',
    criado_em: 'New York No. 1 Lake Park',
    status: true,
    tags: ['nice', 'developer'],
  },
  {
    key: 2,
    name: 'Jim Green',
    email: 'email@email.com',
    criado_em: 'London No. 1 Lake Park',
    status: true,
    tags: ['loser'],
  },
  {
    key: 3,
    name: 'Joe Black',
    email: 'email@email.com',
    criado_em: 'Sydney No. 1 Lake Park',
    status: false,
    tags: ['cool', 'teacher'],
  },
];

export const AdmUserlist = () => {

    return (
        <List breadcrumb createButtonProps={{children: "Novo Usuário", icon: <UserAddOutlined/>}}>
            <Table columns={columns} dataSource={data} />
        </List>
    )

};
