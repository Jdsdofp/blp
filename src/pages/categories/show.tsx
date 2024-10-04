import { CheckCircleOutlined, CloseCircleOutlined, CommentOutlined, ExclamationCircleOutlined, IssuesCloseOutlined, MessageOutlined } from "@ant-design/icons"
import { DateField, EditButton, RefreshButton, Show, useForm } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import { List, Card, Row, Col, Modal, Popover, Spin, DatePicker, Input, Space, Button, Badge, Mentions, Tag, Avatar } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../authProvider";
import { Send } from "@mui/icons-material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';



interface ICondition {
  dc_id: number;
  dc_condicoes: { [key: string]: { status: boolean | null; date: Date | null } };
}

interface IComments {
  cd_id: number;
  cd_documento_id: number;
  cd_autor_id: number;
  usuario: string;
  cd_msg: string;
  cd_resposta: string[];
  criado_em: Date;
}

interface Icomment {
  cd_mdg: string
}

export const DocumentShow = () => {
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const filialId = queryParams.get("filialId");
  const [isModal, setIsModal] = useState<boolean>(false);
  const [isModalIdCondition, setIsModalIdCondition] = useState<any>();
  const [isModalComment, setIsModalComment] = useState<boolean>(false);
  const [isDocComment, setIsDocComment] = useState({})
  const [isIdDoComment, setIsIdDoComment] = useState<number>()
  const [checkCondicionante, setCheckCondicionante] = useState<boolean>(true);
  const [conditions, setConditions] = useState<{ [key: string]: boolean | null }>({});
  const [userTK, setUserTK] = useState<any>(JSON.parse(localStorage.getItem('refine-user')).nome)

  const { data, isInitialLoading, isLoading, refetch } = useList({
    resource: 'document',
    meta: { endpoint: `listar-documentos-status-filial/${status}/${filialId}` },
    liveMode: 'auto',
  });

  const { data: result, isLoading: car, refetch: asas } = useList<ICondition>({
    resource: 'document-condition',
    meta: { endpoint: `listar-documento-condicionante/${isModalIdCondition}` },
    liveMode: 'auto',
  });

  const { data: comments, isLoading: carComment, refetch: refetchComment } = useList<IComments>({ resource: 'comment-document', meta: { endpoint: `${isIdDoComment}/listar-comentario-documento` }, liveMode: 'auto'});

  console.log(comments)

  useEffect(() => {
    // Quando os dados de condições forem recebidos, inicialize o estado conditions
    if (result?.data?.dc_condicoes) {
      setConditions(result.data.dc_condicoes);
    }
  }, [result]);

  const [commentValue, setCommentValue] = useState<string>('');

  const handleSendComment = async () => {
    try {
        await axios.post(`${API_URL}/comment-document/${isDocComment?.d_id}/registar-comentario`, {
            cd_msg: commentValue,
        });
        // Ação após o envio bem-sucedido
        setCommentValue(''); // Limpar o campo de comentário
        refetchComment(); // Recarregar a lista de comentários
        refetch();
    } catch (error) {
        console.error("Erro ao enviar comentário:", error);
    }
};





  const toggleCondition = async (key: string) => {
    setConditions((prevConditions) => {
      const currentValue = prevConditions[key]?.status;
      let newValue;

      if (currentValue === true) {
        newValue = false;
      } else if (currentValue === false) {
        newValue = null;
      } else {
        newValue = true;
      }

      const updatedConditions = {
        ...prevConditions,
        [key]: {
          status: newValue,
          date: new Date(),
        },

      };


      // Certifique-se de que o ID da condicionante está presente
      if (isModalIdCondition && updatedConditions[key]) {

        // Chama a API para atualizar a condição via axios
        axios.put(`${API_URL}/document-condition/fechar-condicionante/${isModalIdCondition}`, {
          dc_condicoes: {
            [key]: updatedConditions[key],
          },
        })
          .then(response => {
            console.log("Condição atualizada com sucesso:", response.data);
          })
          .catch(error => {
            console.error("Erro ao atualizar condição:", error);
          });
      }

      return updatedConditions;

    });

  };

  const openModal = async () => {
    setIsModal(true);
    await asas()
  };

  const hendleOpenModalConditions = (id: any) => {
    setIsModalIdCondition(id);
  };

  const hendleCloseModalConditions = () => {
    setIsModal(false);
  };

  const hendleCheck = () => {
    setCheckCondicionante(false);
  };

  const atualiza = async () => {
    await refetch();
  };

  const updateComment = async () =>{
    await refetchComment()
  }

  const hendleOpenModalComments = (item: any) => {
    setIsDocComment(item)
    setIsModalComment(true)
  };

  const hendleCloseModalComments = () => {
    setIsModalComment(false)
  };

  const getColor = (status: any) => {
    switch (status) {
      case 'Vencido':
        return 'red-inverse';
      case 'Em processo':
        return 'cyan';
      case 'Não iniciado':
        return 'orange';
      case 'Emitido':
        return 'green';
      default:
        return 'default';
    }
  };



  return (
    <Show title={[<><span>{status}</span></>]} canEdit={false} canDelete={false} headerButtons={<RefreshButton onClick={() => atualiza()} />}>
      <List
        loading={isInitialLoading || isLoading}
        dataSource={data?.data}
        size="small"
        renderItem={item => (
          <>
            <Row gutter={16} align={"top"}>
              <Col span={8}>
                <Card
                  loading={isLoading}
                  size="small"
                  title={<><h3>{item.tipo_documentos.td_desc}</h3></>}
                  style={{ width: 300, margin: '16px', boxShadow: 'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px' }}
                  bordered
                  cover
                  hoverable
                  extra={<span id={item.d_condicionante_id} onClick={() => { openModal(); hendleOpenModalConditions(item.d_condicionante_id); }}>{item.d_condicionante_id && <IssuesCloseOutlined style={{ color: '#ebc334', fontSize: 19, cursor: 'pointer' }} />}</span>}
                  actions={[<Space><EditButton hideText shape="circle" size="small" /><Badge count={item?.d_comentarios?.length || null} size="small"><Button icon={<CommentOutlined />} size="small" shape="circle" onClick={() => { hendleOpenModalComments(item); setIsIdDoComment(item.d_id); updateComment(); atualiza() }} /></Badge></Space>]}
                >
                  <p style={{ fontSize: 12, margin: 0 }}>{item?.filiais?.f_nome}</p>
                  <p style={{ fontSize: 12, margin: 0 }}>{item?.tipo_documentos?.td_desc}</p>
                  <p style={{ fontSize: 10 }}><DateField value={item?.criado_em} format='DD/MM/YYYY · H:mm:ss' locales="pt-br" style={{ fontSize: 9 }} /></p>
                  <Space direction="vertical">
                    <Tag style={{ borderRadius: 20, padding: 3 }}><Avatar shape="circle" icon={String(item?.usuario?.u_nome).toUpperCase()[0]} size="small" /> {item?.usuario?.u_nome == JSON.parse(localStorage.getItem('refine-user')).nome ? <a style={{ fontSize: 11, margin: 3 }}>você</a> : item?.usuario?.u_nome}</Tag>
                    <Tag color={getColor(item?.d_situacao)} style={{ fontSize: 10, borderRadius: 20 }}>{item?.d_situacao}</Tag>
                  </Space>
                </Card>
              </Col>
            </Row>
          </>
        )}
      />

      <Modal
        open={isModal}
        onCancel={() => { hendleCloseModalConditions(); setCheckCondicionante(true); }}
        okButtonProps={{ disabled: checkCondicionante, onClick: () => { setCheckCondicionante(true); } }}
        cancelButtonProps={{ hidden: true }}
        footer={Object.entries(conditions || {}).filter(([key, value]) => value?.status === false).length >= 1 ? null : (<Space><Input placeholder="Nº Protocolo" /><DatePicker placeholder="Data Protocolo" locale='pt-BR' format={'DD/MM/YYYY'} /></Space>)}
      >
        <Card
          title={['Condicionante ', <IssuesCloseOutlined style={{ color: 'gray' }} />]}
          size="small"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <h4 style={{ paddingLeft: 5 }}>Condição</h4>
            <h4 style={{ paddingRight: 20 }}>Status</h4>
          </div>

          <div style={{ maxHeight: '300px', overflowY: 'auto', padding: 5, borderTop: '1px solid #575757', scrollbarColor: '#888 #f1f1f1', scrollbarWidth: 'thin' }}>
            <table style={{ width: '100%' }}>
              {car ? <Spin /> : (
                <tbody>
                  {Object.entries(conditions || {}).map(([key, value]) => (
                    <tr key={key}>
                      <td style={{ borderBottom: '1px solid #8B41F2' }}>
                        <p style={{ textTransform: 'capitalize' }}>{key}</p>
                      </td>
                      <td style={{ borderBottom: '1px solid #8B41F2' }} align="center">
                        {value?.status === true ? (
                          <Popover content={`OK - ${new Date(value?.date).toLocaleString()}`}>
                            <CheckCircleOutlined
                              onClick={() => { toggleCondition(key); hendleCheck(); }}
                              style={{ color: 'green', cursor: 'pointer' }}
                            />
                          </Popover>
                        ) : value?.status === false ? (
                          <Popover content={`Pendente - ${new Date(value?.date).toLocaleString()}`}>
                            <CloseCircleOutlined
                              onClick={() => { toggleCondition(key); hendleCheck(); }}
                              style={{ color: 'red', cursor: 'pointer' }}
                            />
                          </Popover>
                        ) : (
                          <Popover content={`N/A - ${new Date(value?.date).toLocaleString()}`}>
                            <ExclamationCircleOutlined
                              onClick={() => { toggleCondition(key); hendleCheck(); }}
                              style={{ color: 'orange', cursor: 'pointer' }}
                            />
                          </Popover>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </Card>
      </Modal>


      <Modal title={[<MessageOutlined />, ` Interações`]} open={isModalComment} onCancel={() => setIsModalComment(false)} centered footer={

        <List
        loading={carComment}
        dataSource={comments?.data}
        renderItem={(item, index) => (
          <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                  style={{ marginRight: '8px' }}
                />
              }
              title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <a style={{ fontWeight: 'bold', color: '#8B41F2' }}>
                    {userTK == item.usuario.u_nome ? 'Você' : item.usuario.u_nome}
                  </a>
                  <span style={{ fontSize: '12px', color: '#888' }}>há 3 dias</span>
                </div>
              }
              description={
                <p style={{ color: '#4a4a4a', marginTop: '4px', textAlign: 'justify' }}>
                  {item.cd_msg}
                </p>
              }
              style={{ textAlign: 'justify' }}
            />
          </List.Item>
        )}
        size="small"
        style={{
          maxHeight: 400,
          overflowY: 'auto',
          scrollbarColor: '#888 #f1f1f1',
          scrollbarWidth: 'thin',
          padding: '0 16px',
          borderRadius: '8px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        }}
        />

      }>

        <Card size="small" style={{ marginBottom: 5, border: 0 }}>

          <p style={{ fontSize: 12, margin: 0 }}>{isDocComment?.filiais?.f_nome}</p>
          <p style={{ fontSize: 12, margin: 0 }}>{isDocComment?.tipo_documentos?.td_desc}</p>
          <p style={{ fontSize: 10 }}><CalendarTodayIcon fontSize="inherit" /> <DateField value={isDocComment?.criado_em} format='DD/MM/YYYY · H:mm:ss' locales="pt-br" style={{ fontSize: 9 }} /></p>
          <Space direction="vertical">
            <Tag style={{ borderRadius: 20, padding: 3 }}><Avatar shape="circle" icon={String(isDocComment?.usuario?.u_nome).toUpperCase()[0]} size="small" /> {isDocComment?.usuario?.u_nome == JSON.parse(localStorage.getItem('refine-user')).nome ? <a style={{ fontSize: 11, margin: 3 }}>você</a> : isDocComment?.usuario?.u_nome}</Tag>
            <Tag color={getColor(isDocComment?.d_situacao)} style={{ fontSize: 10, borderRadius: 20 }}>{isDocComment?.d_situacao}</Tag>
          </Space>
        </Card>

        <Card size="small"  style={{ borderRadius: 50, width: 'auto', boxShadow: 'rgba(0, 0, 0, 0.19) 0px 2px 10px' }}>
          <Space.Compact>
            <Avatar style={{ margin: 3 }} shape="circle" icon={String(JSON.parse(localStorage.getItem('refine-user')).nome).toUpperCase()[0]} size="small" />
            <Mentions

              style={{ border: 0, width: 'auto', overflowX: 'auto' }}
              cols={60}
              autoSize
              placeholder="Comente sobre e use @ para mencionar alguém"
              options={[
                {
                  value: 'Lores Lenne',
                  label: 'Lores Lenne',
                },
                {
                  value: 'Aless',
                  label: 'Aless',
                },
                {
                  value: 'Marinas',
                  label: 'Marinas',
                },

              ]}

              value={commentValue}
              onChange={(value) => setCommentValue(value)}

            />

            <Button type="primary" shape="circle" icon={<Send />} onClick={handleSendComment} />
          </Space.Compact>
        </Card>
      </Modal>

    </Show>
  );
};
