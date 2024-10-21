import { CheckCircleOutlined, CloseCircleOutlined, CloseCircleTwoTone, CommentOutlined, DeleteOutlined, DownOutlined, ExclamationCircleOutlined, IssuesCloseOutlined, MessageOutlined, PlusCircleFilled, PlusCircleOutlined, PlusCircleTwoTone, PlusOutlined, PlusSquareOutlined, PlusSquareTwoTone, SaveOutlined, UpOutlined } from "@ant-design/icons"
import { CloneButton, DateField, EditButton, RefreshButton, Show } from "@refinedev/antd";
import { useList, useTable } from "@refinedev/core";
import { List, Card, Row, Col, Modal, Popover, Spin, DatePicker, Input, Space, Button, Badge, Mentions, Tag, Avatar, Switch, message, FloatButton, Form } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../authProvider";
import { Check, Close, CloseFullscreen, Money, PlusOne, PlusOneRounded, ReplyOutlined, Send } from "@mui/icons-material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PaidIcon from '@mui/icons-material/Paid';
import 'dayjs/locale/pt-br';
dayjs.extend(relativeTime);
dayjs.locale('pt-br');



interface ICondition {
  dc_id: number;
  dc_condicoes: { [key: string]: { status: boolean | null; date: Date | null;  users: [number]} };
  status: string;
}

interface IComments {
  cd_id: number;
  cd_documento_id: number;
  cd_autor_id: number;
  usuario: string;
  cd_msg: string;
  cd_resposta: string[];
  cd_situacao_comentario: string;
  criado_em: Date;
}

interface Icomment {
  cd_mdg: string
}

const { Search } = Input;

export const DocumentShow = () => {
  // Define a localização para português
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
  const [expanded, setExpanded] = useState(false);
  const [userTK, setUserTK] = useState<any>(JSON.parse(localStorage.getItem('refine-user')).id)
  const [replyValue, setReplyValue] = useState<string>('');
  const [isReplyingToComment, setIsReplyingToComment] = useState<number | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [ messageApi, contextHolder ] = message.useMessage();
  const [isMdAddCond, setIsMdAddCond] = useState(false)


  const [form] = Form.useForm();

  const { data, isInitialLoading, isLoading, refetch } = useList({
    resource: 'document',
    meta: { endpoint: `listar-documentos-status-filial/${status}/${filialId}` },
    liveMode: 'auto',
  });

  const { tableQueryResult } = useTable({ resource: "user", syncWithLocation: true, liveMode: "auto", meta: {
    endpoint: "listar-usuarios"
  } })

  const { data: result, isLoading: car, refetch: asas, isRefetching } = useList<ICondition>({
    resource: 'document-condition',
    meta: { endpoint: `listar-documento-condicionante/${isModalIdCondition}` },
    liveMode: 'auto',
  });

  const { data: comments, isLoading: carComment, refetch: refetchComment } = useList<IComments>({ resource: 'comment-document', meta: { endpoint: `${isIdDoComment}/listar-comentario-documento` }, liveMode: 'auto' });


  useEffect(() => {
    // Quando os dados de condições forem recebidos, inicialize o estado conditions
    if (result?.data?.dc_condicoes) {
      setConditions(result.data.dc_condicoes);
    }
  }, [result]);

  const [commentValue, setCommentValue] = useState<string>('');
  const [commentStatusValue, setCommentStatusValue] = useState<string>('');
  const [visiblePopover, setVisiblePopover] = useState({}); // Armazena a visibilidade do popover por condição
  const [searchTerm, setSearchTerm] = useState('');
  const [numProtocolo, setNumProtocolo] = useState('');
  const [dataProtocolo, setDataProtocolo] = useState(null);

  const handleSendComment = async () => {
    try {
      if(commentValue == '') return messageApi.warning('Campo comentario vazio! ⚠')
      await axios.post(`${API_URL}/comment-document/${isDocComment?.d_id}/registar-comentario`, {
        cd_msg: commentValue,
        cd_situacao_comentario: commentStatusValue
      });
      // Ação após o envio bem-sucedido
      setCommentValue(''); // Limpar o campo de comentário
      refetchComment(); // Recarregar a lista de comentários
      refetch();
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
    }
  };

  

  const refreshCondition = async () =>{
    await asas();
  }


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
          users: [userTK],
          statusProcesso: data?.data.map(d=>d?.d_situacao)[0],
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

  const handleSendReply = async () => {
    if (!isReplyingToComment) return;

    try {
        await axios.patch(`${API_URL}/comment-document/${isReplyingToComment}/registrar-resposta-comentario`, {
            msg: replyValue
        });
        
        setReplyValue('');
        setIsReplyingToComment(null);
        refetchComment();
    } catch (error) {
        console.error("Erro ao enviar resposta:", error);
    } 
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

  const updateComment = async () => {
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

  
   // Filtra os usuários com base no termo de busca
   const filteredUsuarios = tableQueryResult.data?.data.filter((user) =>
    user.u_nome.toLowerCase().includes(searchTerm.toLowerCase())
);

  const handleUserToggle = (userId: number) => {
    setSelectedUserIds((prevSelected) => {
        if (prevSelected.includes(userId)) {
            return prevSelected.filter(id => id !== userId); // Remove se já estiver selecionado
        } else {
            return [...prevSelected, userId]; // Adiciona se não estiver
        }
    });
  };


  const handleSubmitAddConditions = async () => {
    try {
        // Pega os valores do formulário
        const values = await form.validateFields();
        const dc_id = isModalIdCondition;
        
        // Estrutura o payload para envio
        const payload = {
            novaCondicao: values?.c_condicao,  // Supondo que você está adicionando uma nova condição
            detalhesCondicao: {
                date: null,
                users: [userTK],  // Exemplo de usuário. Você pode pegar isso dinamicamente conforme necessário
                status: false,
                statusProcesso: data?.data.map(d=>d?.d_situacao)[0]
            }
        };

        // Envia os dados para o backend
        const response = await axios.put(`${API_URL}/document-condition/adicionar-condicoes/${dc_id}`, payload);

        messageApi.success(response?.data?.message);
        await refreshCondition()
        form.resetFields()
    } catch (error) {
      messageApi.error(error?.response?.data?.message);
    }
  };

  


  const handleSubmit = async (conditionKey) => {
    try {
        // Cria um objeto contendo os valores das condições e os IDs dos usuários selecionados
        const payload = {
            dc_condicoes: {
                [conditionKey]: conditions[conditionKey]
            },
            userIds: selectedUserIds
        };

        const dc_id = isModalIdCondition; // Substitua pelo valor correto de 'dc_id'

        // Envia a requisição para o backend com o parâmetro 'dc_id' na URL
       const {data} = await axios.patch(`${API_URL}/document-condition/atribuir-usuarios-condicao/${dc_id}`, payload);


        // Ações adicionais após o envio, como manter o modal aberto e limpar a lista de usuários selecionados
        setSelectedUserIds([]); // Limpa a lista de IDs de usuários selecionados
        setCheckCondicionante(true); // Atualize qualquer estado necessário
        messageApi.success(data?.message); // Feedback ao usuário
        await refreshCondition()
    } catch (error) {
        console.error('Erro ao enviar os dados:', error);
        message.error('Erro ao atribuir usuários. Por favor, tente novamente.');
    }
  };

  const handleCloseProcss = async (conditionID: number)=>{
 
      try {
        const dc_id = conditionID; // Substitua pelo valor correto de 'dc_id'

        const payload = {
          d_data_pedido: dataProtocolo,
          d_num_protocolo: numProtocolo
        }

        // Envia a requisição para o backend com o parâmetro 'dc_id' na URL
       const {data} = await axios.put(`${API_URL}/document-condition/fechar-processo-condicionante/${dc_id}`, payload);
       console.log(data)
       messageApi.success(data)
      } catch (error) {
        console.log('Erro ao requisiatar ', error)
      }


  }
 
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
                      style={{
                        width: 300,
                        margin: '16px',
                        boxShadow: 'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px',
                      }}
                      bordered
                      cover
                      hoverable
                      extra={
                        <span
                          id={item.d_condicionante_id}
                          onClick={() => {
                            openModal();
                            hendleOpenModalConditions(item.d_condicionante_id);
                          }}
                        >
                          {item.d_condicionante_id && (
                            <IssuesCloseOutlined style={{ color: '#ebc334', fontSize: 19, cursor: 'pointer' }} hidden={item?.d_situacao == 'Emitido' && item?.d_num_protocolo.length} />
                          )}
                        </span>
                      }
                      actions={[
                        <Space>
                          <EditButton hideText shape="circle" size="small" />
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
                        </Space>,
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
                          {item?.usuario?.u_nome === JSON.parse(localStorage.getItem('refine-user')).nome ? (
                            <a style={{ fontSize: 11, margin: 3 }}>você</a>
                          ) : (
                            item?.usuario?.u_nome
                          )}
                        </Tag>
                        <Space>
                          <Tag color={getColor(item?.d_situacao)} style={{ fontSize: 10, borderRadius: 20 }}>
                            {item?.d_situacao}
                          </Tag>

                          <Button icon={<PaidIcon fontSize="small" />} shape="circle" style={{ marginLeft: 160, border: 0 }} />
                        </Space>
                      </Space>
                    </Card>
                  </Col>
                </Row>
          </>
        )}
      />

      <Modal  
          open={isModal}
          onCancel={() => { hendleCloseModalConditions(); setCheckCondicionante(true)}}
          okButtonProps={{ disabled: checkCondicionante, onClick: () => { setCheckCondicionante(true); setNumProtocolo('')}}}
          cancelButtonProps={{ hidden: true }}
          footer={[Object.entries(conditions || {}).filter(([key, value]) => value?.status === false).length >= 1 ? null : (
              <Space>
                   <Tag color='red-inverse' style={{ fontSize: 10, borderRadius: 20 }}>{result?.data?.status}</Tag>
                  <Input placeholder="Nº Protocolo" allowClear  style={{borderRadius: 20}} onChange={(e)=>setNumProtocolo(e.target.value)} value={numProtocolo}/>
                  <DatePicker placeholder="Data Protocolo" locale='pt-BR' format={'DD/MM/YYYY'} allowClear  style={{borderRadius: 20}} onChange={(date) => setDataProtocolo(date)} value={dataProtocolo}/>
                  <Button type="primary" onClick={()=>handleCloseProcss(result?.data?.dc_id)} shape="round" icon={<Check fontSize="inherit"/>} >Fechar</Button>
              </Space>
          )]}
      >
          <Card
              title={['Condicionante ', <IssuesCloseOutlined style={{ color: 'gray' }} />]}
              size="small"
          >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <h4 style={{ paddingLeft: 5 }}>Condição</h4>
                  <h4>Status | Atribuir</h4>
              </div>

              <div style={{ maxHeight: '300px', overflowY: 'auto', padding: 5, borderTop: '1px solid #575757', scrollbarColor: '#888 #f1f1f1', scrollbarWidth: 'thin' }}>
                  <table style={{ width: '100%' }}>
                    {car ? (
                      <Spin />
                    ) : (
                      <tbody>
                        {Object.entries(conditions || {}).map(([key, value]) => (
                          <tr key={key}>
                            <td style={{ borderBottom: '1px solid #8B41F2' }}>
                              <p style={{ textTransform: 'capitalize' }}>{key}</p>
                            </td>
                            <td style={{ borderBottom: '1px solid #8B41F2', paddingRight: 10 }} align="center">
                              {value?.status === true ? (
                                <Popover content={`OK - ${new Date(value?.date).toLocaleString()}`}>
                                  <Button disabled={value?.users?.includes(userTK) && value?.statusProcesso ==  data?.data.map(d=>d?.d_situacao)[0] ? false : true} shape="circle" style={{border: 'none', height: '30px'}}>
                                    <CheckCircleOutlined
                                      
                                      onClick={() => {
                                        
                                        toggleCondition(key);
                                        hendleCheck();
                                      }}
                                      style={{ color: value?.users?.includes(userTK) && value?.statusProcesso ==  data?.data.map(d=>d?.d_situacao)[0] ? 'green' : 'gray', cursor: 'pointer' }}
                                    />
                                  </Button>
                                </Popover>
                              ) : value?.status === false ? (
                                <Popover content={`Pendente - ${new Date(value?.date).toLocaleString()}`}>
                                  <Button disabled={value?.users?.includes(userTK) && value?.statusProcesso ==  data?.data.map(d=>d?.d_situacao)[0] ? false : true} shape="circle" style={{border: 'none', height: '30px'}}>
                                    <CloseCircleOutlined
                                      
                                      onClick={() => {
                                        toggleCondition(key);
                                        hendleCheck();
                                      }}
                                      style={{ color: value?.users?.includes(userTK) && value?.statusProcesso ==  data?.data.map(d=>d?.d_situacao)[0] ? 'red' : 'gray  ', cursor: 'pointer' }}
                                    />
                                  </Button>
                                </Popover>
                              ) : (
                                <Popover content={`N/A - ${new Date(value?.date).toLocaleString()}`}>
                                  <Button disabled={value?.users?.includes(userTK) && value?.statusProcesso ==  data?.data.map(d=>d?.d_situacao)[0] ? false : true} shape="circle" style={{border: 'none', height: '30px'}}>
                                      <ExclamationCircleOutlined
                                          
                                            onClick={() => {
                                              toggleCondition(key);
                                              hendleCheck();
                                            }}
                                            style={{ color: value?.users?.includes(userTK) && value?.statusProcesso ==  data?.data.map(d=>d?.d_situacao)[0] ? 'orange' : 'gray', cursor: 'pointer' }}
                                          />
                                  </Button>
                                </Popover>
                              )}
                            </td>
                            <td style={{ borderBottom: '1px solid #8B41F2' }} align="center">
                              <Popover
                                title={[
                                  <div style={{ position: 'relative' }}>
                                    Atribuir Condições
                                    <Button
                                     
                                      shape="circle"
                                      size="small"
                                      style={{ left: 85 }}
                                      icon={<Close fontSize="inherit" />}
                                      onClick={() => setVisiblePopover(false)}
                                    />
                                  </div>
                                ]}
                                trigger="click"
                                placement="bottomLeft"
                                visible={visiblePopover[key]}
                                onVisibleChange={(visible) => setVisiblePopover((prev) => ({ ...prev, [key]: visible }))}
                                content={
                                  <div>
                                    <Search
                                      placeholder="Buscar usuário"
                                      onChange={(e) => setSearchTerm(e.target.value)}
                                      style={{ marginBottom: 8, width: '100%' }}
                                      allowClear
                                    />
                                    <List
                                      size="small"
                                      style={{ maxHeight: 300, overflowY: 'auto' }}
                                      dataSource={filteredUsuarios}
                                      renderItem={(item) => (
                                        <List.Item>
                                          <h5>{item?.u_nome}</h5>
                                          {selectedUserIds}
                                          <Switch
                                            size="small"
                                            checked={tableQueryResult.data?.data.map(id=>id?.u_id).includes(item.u_id)}
                                            onChange={() => handleUserToggle(item.u_id, key)}
                                          />
                                        </List.Item>
                                      )}
                                    />
                                    <Button
                                    
                                      type="primary"
                                      size="small"
                                      shape="round"
                                      onClick={() => {handleSubmit(key); refreshCondition()}}
                                      disabled={selectedUserIds.length === 0}
                                      loading={isRefetching}
                                    >
                                      Atribuir
                                    </Button>
                                    {contextHolder}
                                  </div>
                                }
                              >
                                 {value?.users?.includes(userTK) && value?.statusProcesso ==  data?.data.map(d=>d?.d_situacao)[0] ? (<GroupAddIcon fontSize="inherit" style={{ cursor: 'pointer' }} />) : null }
                              
                              </Popover>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                </div>
                <Button type="dashed" style={{marginTop: 10, fontSize: 12}} onClick={()=>setIsMdAddCond(true)}><PlusCircleOutlined /> Adicionar Itens</Button>
          </Card>
      </Modal>



      <Modal
        title={[<MessageOutlined />, ` Interações`]}
        open={isModalComment}
        onCancel={() => setIsModalComment(false)}
        centered
        footer={
          <List
                  loading={carComment}
                  dataSource={comments?.data}
                  renderItem={(item, index) => {
                    const hasMoreResponses = item.cd_resposta && item.cd_resposta.length > 1;
                    return (
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
                                {userTK === item.usuario.u_nome ? 'Você' : item.usuario.u_nome} -
                                 <Tag color={getColor(item?.cd_situacao_comentario)} style={{ fontSize: 8, borderRadius: 8, marginLeft: 8 }} >{item?.cd_situacao_comentario}</Tag>
                              </a>
                              <span style={{ fontSize: '12px', color: '#888' }}>{dayjs(item.criado_em).fromNow()}</span>
                            </div>
                          }
                          description={
                            <>
                              <p style={{ marginTop: '4px', textAlign: 'justify', fontSize: 11 }}>
                                {item.cd_msg}
                              </p>
                              <ReplyOutlined
                                onClick={() => {
                                  setReplyValue(`@${item.usuario?.u_nome} `); 
                                  setIsReplyingToComment(item.cd_id);
                                }}
                                style={{ cursor: 'pointer', color: 'GrayText' }}
                                fontSize="inherit"
                              />
                              {/* Campo de resposta e botão de envio */}
                              {isReplyingToComment === item.cd_id && (
                                <div style={{ marginTop: '8px' }}>
                                      <Input.TextArea
                                        value={replyValue} // Isso já deve ter o nome do usuário configurado
                                        onChange={(e) => setReplyValue(e.target.value)} // Permite que o usuário edite o texto
                                        placeholder="Digite sua resposta aqui..."
                                      />
                                  <Button
                                    type="primary"
                                    size="small"
                                    shape="round"
                                    onClick={handleSendReply}
                                    style={{ marginTop: '4px' }}
                                  >
                                    Enviar Resposta
                                  </Button>
                                </div>
                              )}
                              {/* Renderizando respostas com a linha vertical de ligação */}
                              {item.cd_resposta && item.cd_resposta.length > 0 && (
                                <div style={{  marginTop: '8px', position: 'relative' }}>
                                  {/* Linha vertical que conecta o comentário principal às respostas */}
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: '0',
                                      left: '16px',
                                      width: '15px',
                                      height: item.cd_resposta.length > 1 ? '98%' : '40%',
                                      borderLeft: '1px solid #8B41F2',
                                      borderBottom: '1px solid #8B41F2',
                                      borderBottomLeftRadius: '10px',
                                    }}
                                  ></div>
                                  <div style={{ marginLeft: '24px', paddingLeft: '10px' }}>
                                  <List
                                      dataSource={expanded ? item.cd_resposta : [item.cd_resposta[0]]}
                                      renderItem={(response) => (
                                        <List.Item style={{ padding: '2px 0' }}>
                                          <List.Item.Meta
                                            avatar={
                                              <Avatar
                                                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${response?.autor}`}
                                                size='small'
                                              />
                                            }
                                            title={
                                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <a style={{ fontWeight: 'bold', color: '#8B41F2', fontSize: 9 }}>
                                                  {userTK === response?.autor ? 'Você' : response?.autor}
                                                </a>
                                              </div>
                                            }
                                            description={
                                              <div style={{ padding: '4px', borderRadius: '4px' }}>
                                                <p
                                                  style={{
                                                    textAlign: 'justify',
                                                    margin: 0,
                                                    fontSize: '9px',
                                                    fontFamily: 'Arial, sans-serif',
                                                    whiteSpace: 'normal',
                                                    wordBreak: 'break-word',  // Quebra palavras longas
                                                    overflowWrap: 'break-word', // Permite que palavras longas quebrem
                                                    lineHeight: '1.2',
                                                    maxWidth: '100%',  // Para garantir que o texto não extrapole o contêiner
                                                  }}
                                                >
                                                  {response?.msg}
                                                </p>
                                              </div>
                                            }
                                            
                                          />
                                        </List.Item>
                                      )}
                                    />


                                    {hasMoreResponses && (
                                      <div
                                        onClick={() => setExpanded(!expanded)}
                                        style={{ cursor: 'pointer', color: '#8B41F2', marginLeft: '8px', fontSize: 12 }}
                                      >
                                        {expanded ? (
                                          <>
                                            <UpOutlined style={{ marginRight: 4 }} />
                                            Recolher respostas
                                          </>
                                        ) : (
                                          <>
                                            <DownOutlined style={{ marginRight: 4 }} />
                                            Mostrar {item.cd_resposta.length - 1} resposta(s) adicional(is)
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </>
                          }
                        />
                     </List.Item>
                );
              }}
              size="small"
              style={{
                maxHeight: 400,
                overflowY: 'auto',
                scrollbarColor: '#888 #f1f1f1',
                scrollbarWidth: 'thin',
                padding: '0 10px',
                borderRadius: '8px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              }}
        />

        }
       >
        <Card size="small" style={{ marginBottom: 5, border: 0 }}>
          <p style={{ fontSize: 12, margin: 0 }}>{isDocComment?.filiais?.f_nome}</p>
          <p style={{ fontSize: 12, margin: 0 }}>{isDocComment?.tipo_documentos?.td_desc}</p>
          <p style={{ fontSize: 10 }}>
            <CalendarTodayIcon fontSize="inherit" />{' '}
            <DateField
              value={isDocComment?.criado_em}
              format='DD/MM/YYYY · H:mm:ss'
              locales="pt-br"
              style={{ fontSize: 9 }}
            />
          </p>
          <Space direction="vertical">
            <Tag style={{ borderRadius: 20, padding: 3 }}>
              <Avatar shape="circle" icon={String(isDocComment?.usuario?.u_nome).toUpperCase()[0]} size="small" />{' '}
              {isDocComment?.usuario?.u_nome === JSON.parse(localStorage.getItem('refine-user')).nome ? (
                <a style={{ fontSize: 11, margin: 3 }}>você</a>
              ) : (
                isDocComment?.usuario?.u_nome
              )}
            </Tag>
            <Tag color={getColor(isDocComment?.d_situacao)} style={{ fontSize: 10, borderRadius: 20 }}>
              {isDocComment?.d_situacao}
            </Tag>
          </Space>
        </Card>

        <Card
          size="small"
          style={{ borderRadius: 50, width: 'auto', boxShadow: 'rgba(0, 0, 0, 0.19) 0px 2px 10px' }}
        >
          <Space.Compact>
            <Avatar
              style={{ margin: 3 }}
              shape="circle"
              icon={String(JSON.parse(localStorage.getItem('refine-user')).nome).toUpperCase()[0]}
              size="small"
            />
            <Mentions
              style={{ border: 0, width: 'auto', overflowX: 'auto' }}
              cols={60}
              autoSize
              placeholder="Comente sobre e use @ para mencionar alguém"
              options={[
                { value: 'Lores Lenne', label: 'Lores Lenne' },
                { value: 'Aless', label: 'Aless' },
                { 
                  value: 'Marinas', 
                  label: (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        size="small" 
                        style={{ marginRight: 8, backgroundColor: '#ffbf00' }} 
                        icon={String('Marinas').toUpperCase()[0]} 
                      />
                      Marinas
                    </div>
                  ),
                },
              ]}  
              onChange={(value) => setCommentValue(value)}
            />
            <Button type="primary" shape="circle" icon={<Send />} onClick={handleSendComment} />
          </Space.Compact>
            {contextHolder}
        </Card>
      </Modal>

      <Modal 
          title='Adicionar Condição' 
          centered
          open={isMdAddCond}
          onCancel={() => setIsMdAddCond(false)}
          onOk={handleSubmitAddConditions}
      >
          <Form form={form} layout="vertical">   
              <Form.Item
                  name="c_condicao" 
                  label="Condição"
                  style={{ width: "400px" }}
                  rules={[{ required: true, message: 'Insira uma condição' }]}
              >
                  <Input placeholder="Condição" />
              </Form.Item>
          </Form>
          {contextHolder}  
      </Modal>
    </Show>
  );
};
