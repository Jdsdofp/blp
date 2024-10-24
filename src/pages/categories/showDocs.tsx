import { DateField, Show } from "@refinedev/antd";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Row, Col, Space, Badge, Button, Avatar, Tag, Table, BackTop } from "antd";
import { AppstoreOutlined, ArrowLeftOutlined, CommentOutlined, IssuesCloseOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { RefreshButton } from "@refinedev/antd";
import { Backpack, NoBackpack, Paid } from "@mui/icons-material";
import { useState } from "react";
import { useList } from "@refinedev/core";

export const ShowDocs = () => {
  const { id } = useParams(); // Capturando o id da filial
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState('cards'); // Alterna entre 'cards' e 'table'
  const { data: result, refetch: cerregarDados } = useList({resource: 'document', meta: {endpoint: `listar-todos-documentos-filial/${id}`}})

  const data = [
    {
      key: 1, // Necessário para a tabela
      tipo_documentos: { td_desc: 'Documento A' },
      d_condicionante_id: '001',
      filiais: { f_nome: 'Filial 1' },
      criado_em: '2024-10-23T10:00:00',
      usuario: { u_nome: 'João Silva' },
      d_situacao: 'Pendente',
      d_comentarios: [],
      d_id: 1,
    },
    {
      key: 2,
      tipo_documentos: { td_desc: 'Documento B' },
      d_condicionante_id: '002',
      filiais: { f_nome: 'Filial 2' },
      criado_em: '2024-10-22T10:00:00',
      usuario: { u_nome: 'Maria Souza' },
      d_situacao: 'Aprovado',
      d_comentarios: [],
      d_id: 2,
    }
  ];

  const atualiza = async () => {
    await cerregarDados()
  };

  const openModal = () => {
    console.log('Abrindo modal...');
  };

  const hendleOpenModalConditions = (id) => {
    console.log(`Abrindo condições para id: ${id}`);
  };

  const hendleOpenModalComments = (item) => {
    console.log(`Abrindo comentários para o documento: ${item.d_id}`);
  };

  const setIsIdDoComment = (id) => {
    console.log(`Definindo id do comentário: ${id}`);
  };

  const updateComment = () => {
    console.log('Atualizando comentário...');
  };

  const setCommentStatusValue = (situacao) => {
    console.log(`Definindo situação do comentário: ${situacao}`);
  };

  const getColor = (situacao) => {
    switch (situacao) {
      case 'Pendente':
        return 'red';
      case 'Aprovado':
        return 'green';
      default:
        return 'gray';
    }
  };

  // Colunas para a visualização em tabela
  const columns = [
    {
      title: 'Documento',
      dataIndex: ['tipo_documentos', 'td_desc'],
      key: 'documento',
    },
    {
      title: 'Filial',
      dataIndex: ['filiais', 'f_nome'],
      key: 'filial',
    },
    {
      title: 'Criado em',
      dataIndex: 'criado_em',
      key: 'criado_em',
      render: (text) => <DateField value={text} format="DD/MM/YYYY · H:mm:ss" locales="pt-br" style={{ fontSize: 12 }} />,
    },
    {
      title: 'Usuário',
      dataIndex: ['usuario', 'u_nome'],
      key: 'usuario',
    },
    {
      title: 'Situação',
      dataIndex: 'd_situacao',
      key: 'situacao',
      render: (situacao) => <Tag color={getColor(situacao)}>{situacao}</Tag>,
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (item) => (
        <Space>
          <Badge count={item?.d_comentarios?.length || null} size="small">
            <Button
              icon={<CommentOutlined />}
              size="small"
              shape="circle"
              onClick={() => {
                hendleOpenModalComments(item);
                setIsIdDoComment(item.d_id);
                updateComment();
                atualiza();
                setCommentStatusValue(item.d_situacao);
              }}
            />
          </Badge>
          <Button icon={<Paid fontSize="small" />} shape="circle" style={{border: 0 }} />
        </Space>
      ),
    },
  ];


  return (
    <Show
      title={[<Button type="text" shape="circle" style={{border: 'none'}} onClick={()=>navigate(-1)} icon={<ArrowLeftOutlined />} />,  ` Documentos Filial` ]}
      canEdit={false}
      canDelete={false}
      headerButtons={
        <Space>
          <Button onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}>
            {viewMode === 'cards' ? <UnorderedListOutlined /> : <AppstoreOutlined />}
          </Button>
          <RefreshButton onClick={() => atualiza()} />
        </Space>
      }
    >
      {viewMode === 'cards' ? (
        <Row gutter={[16, 16]}>
          {result?.data.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={4} key={item.d_id}>
              <Card
                size="small"
                title={<><h3>{item.tipo_documentos.td_desc}</h3></>}
                style={{
                  width: '100%',
                  margin: '16px 0',
                  boxShadow: 'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px',
                }}
                bordered
                extra={
                  <span
                    id={item.d_condicionante_id}
                    onClick={() => {
                      openModal();
                      hendleOpenModalConditions(item.d_condicionante_id);
                    }}
                  >
                    {item.d_condicionante_id && (
                      <IssuesCloseOutlined style={{ color: '#ebc334', fontSize: 19, cursor: 'pointer' }} />
                    )}
                  </span>
                }
                actions={[
                  <Space>
                    <Badge count={item?.d_comentarios?.length || null} size="small">
                      <Button
                        icon={<CommentOutlined />}
                        size="small"
                        shape="circle"
                        onClick={() => {
                          hendleOpenModalComments(item);
                          setIsIdDoComment(item.d_id);
                          updateComment();
                          atualiza();
                          setCommentStatusValue(item.d_situacao);
                        }}
                      />
                    </Badge>
                    <Button icon={<Paid fontSize="small" />} shape="circle" style={{border: 0 }} />
                  </Space>
                ]}
              >
                <p style={{ fontSize: 12, margin: 0 }}>{item?.filiais?.f_nome}</p>
                <p style={{ fontSize: 12, margin: 0 }}>{item?.tipo_documentos?.td_desc}</p>
                <p style={{ fontSize: 10 }}>
                  <DateField value={item?.criado_em} format="DD/MM/YYYY · H:mm:ss" locales="pt-br" style={{ fontSize: 9 }} />
                </p>
                <Space direction="vertical">
                  <Tag style={{ borderRadius: 20, padding: 3 }}>
                    <Avatar shape="circle" icon={String(item?.usuario?.u_nome).toUpperCase()[0]} size="small" />{' '}
                    {item?.usuario?.u_nome}
                  </Tag>
                  <Space>
                    <Tag color={getColor(item?.d_situacao)} style={{ fontSize: 10, borderRadius: 20 }}>
                      {item?.d_situacao}
                    </Tag>
                  </Space>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Table columns={columns} dataSource={result?.data} scroll={{ x: 'max-content' }} />
      )}
    </Show>
  );
};
