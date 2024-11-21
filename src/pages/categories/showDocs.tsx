import { DateField, Show } from "@refinedev/antd";
import { useNavigate, useParams } from "react-router-dom";
import { List, Card, Row, Col, Modal, Popover, Spin, DatePicker, Input, Space, Button, Badge, Mentions, Tag, Avatar, Switch, message, FloatButton, Form, Checkbox, Table } from "antd";
import { AppstoreOutlined, ArrowLeftOutlined, CommentOutlined, IssuesCloseOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { RefreshButton } from "@refinedev/antd";
import { Paid } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useList } from "@refinedev/core";
import { ModalConditions } from "./component/modalCondition";
import { API_URL } from "../../authProvider";
import axios from "axios";
import useMessage from "antd/es/message/useMessage";

interface ICondition {
  dc_id: number;
  dc_condicoes: { [key: string]: { status: boolean | null; date: Date | null;  users: [number]} };
  status: string;
}


export const ShowDocs = () => {
  const { Search } = Input;

  const { id } = useParams(); // Capturando o id da filial
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState('cards'); // Alterna entre 'cards' e 'table'
  const { data, refetch: cerregarDados } = useList({resource: 'document', meta: {endpoint: `listar-todos-documentos-filial/${id}`}})

  const [isModal, setIsModal] = useState<boolean>(false);
  const [isModalIdCondition, setIsModalIdCondition] = useState<any>();
  const [checkCondicionante, setCheckCondicionante] = useState<boolean>(true);
  const [conditions, setConditions] = useState<{ [key: string]: boolean | null }>({});
  const [expanded, setExpanded] = useState(false);
  const [userTK, setUserTK] = useState<any>(JSON.parse(localStorage.getItem('refine-user')).id);
  const [replyValue, setReplyValue] = useState<string>('');
  const [isReplyingToComment, setIsReplyingToComment] = useState<number | null>(null);
  const [ messageApi, contextHolder ] = message.useMessage();
  const [isMdAddCond, setIsMdAddCond] = useState(false);
  const [conditionUsers, setConditionUsers] = useState<number[]>([]); // Inicializa como array vazio
  const [commentValue, setCommentValue] = useState<string>('');
  const [visiblePopover, setVisiblePopover] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [numProtocolo, setNumProtocolo] = useState('');
  const [dataProtocolo, setDataProtocolo] = useState(null);
  const [dataEmissao, setDataEmissao] = useState(null);
  const [dataVencimento, setDataVencimento] = useState(null);
  const [userList, setUserList] = useState([]);
  const [loadingListUserAttr, setLoadingListUserAttr] = useState(false);
  const [users, setUsers] = useState([]);
  
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isRefetchingUsers, setIsRefetchingUsers] = useState(false);
  const [docStatusId, setDocStatusId] = useState<any>()



  const { data: result, isLoading: car, refetch: asas, isRefetching } = useList<ICondition>({
    resource: 'document-condition',
    meta: { endpoint: `listar-documento-condicionante/${isModalIdCondition}` },
    liveMode: 'auto',
  });

  useEffect(() => {
    // Quando os dados de condições forem recebidos, inicialize o estado conditions
    if (result?.data?.dc_condicoes) {
      setConditions(result?.data?.dc_condicoes);
    }
  }, [result]);

  const verifyStatusDoc = async (id) => {
    console.log("ID do documento:", id); // Verifique se o ID está sendo passado corretamente
  
    try {
      // Altere para axios.get se a rota suportar o método GET em vez de POST
      const response = await axios.get(`${API_URL}/document/listar-status-id/${id}`);
  
      // Log para verificar a resposta da API
      setDocStatusId(response.data);
      // Manipule o status do documento conforme necessário, por exemplo, atualizar o estado
    } catch (error) {
      console.error("Erro ao obter o status do documento:", error);
    }
  };
  

  const refreshCondition = async () =>{
    await asas();
  }

  const hendleCloseModalConditions = () => {
    setIsModal(false);
  };

  const atualiza = async () => {
    await cerregarDados()
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
          users: [userTK],
          statusProcesso: docStatusId,
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

  const hendleOpenModalConditions = (id) => {
    setIsModalIdCondition(id)
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

  const handleCloseAllProcss = async (conditionID: number)=>{
    console.log('ID', conditionID)
    console.log('Emissao', dataEmissao)
    console.log('Vencimento', dataVencimento)

    try {
      const dc_id = conditionID;

      const payload = {
        d_data_emissao: dataEmissao,
        d_data_vencimento: dataVencimento
      }

      const {data} = await axios.put(`${API_URL}/document-condition/fechar-processo/${dc_id}`, payload);
      
      setDataEmissao(null)
      setDataVencimento(null)

     messageApi.success(data?.message)

    } catch (error) {
      
    }
}

const handleCloseProcss = async (conditionID: number)=>{
 
  try {
    const dc_id = conditionID; // Substitua pelo valor correto de 'dc_id'

    const payload = {
      d_data_pedido: dataProtocolo,
      d_num_protocolo: numProtocolo
    }

    // Envia a requisição para o backend com o parâmetro 'dc_id' na URL
   const {data} = await axios.put(`${API_URL}/document-condition/fechar-processo-condicionante/${dc_id}`, payload);
   setNumProtocolo('')
   setDataProtocolo(null)
   messageApi.success(data?.message)
  } catch (error) {
    console.log('Erro ao requisiatar ', error)
  }


}

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
      const { data } = await axios.patch(`${API_URL}/document-condition/atribuir-usuarios-condicao/${dc_id}`, payload);

      // Ações adicionais após o envio
      setSelectedUserIds([]); // Limpa a lista de IDs de usuários selecionados
      messageApi.success(data?.message); // Feedback ao usuário
      await refreshCondition();
  } catch (error) {
      console.error('Erro ao enviar os dados:', error);
      message.error('Erro ao atribuir usuários. Por favor, tente novamente.');
  }
};

  const handleUserToggle = (id) => {
    setUsers(prevUsers => {
        const updatedUsers = prevUsers.map(user =>
            user.u_id === id ? { ...user, u_atribuido: !user.u_atribuido } : user
        );

        // Atualiza a lista de IDs dos usuários selecionados
        const newSelectedUserIds = updatedUsers
            .filter(user => user.u_atribuido)
            .map(user => user.u_id);

        setSelectedUserIds(newSelectedUserIds); // Atualiza o estado com os IDs selecionados
        return updatedUsers; // Retorna a lista atualizada
    });
  };


  const hendleCheck = () => {
    setCheckCondicionante(false);
  };

   // Função para chamar a API e listar os usuários
   const handleUserListAttr = async (dc_id, condicaoNome) => {
    try {
      setLoadingListUserAttr(true);

      const payload = {
        nome: condicaoNome
      }

      // Chamada à rota passando o id da condição e o nome da condição
      const response = await axios.post(`${API_URL}/document-condition/listar-usuarios-atribuidos-condicao/${dc_id}`, payload);

      // Define a lista de usuários no estado
      setUserList(response.data);
      setUsers(response.data)
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
    } finally {
      setLoadingListUserAttr(false);
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
          <span
                    id={item.d_condicionante_id}
                    onClick={() => {
                      openModal();
                      setIsModalIdCondition(item.d_condicionante_id);
                    }}
                  >
                    {item.d_condicionante_id && (
                      <IssuesCloseOutlined style={{ color: '#ebc334', fontSize: 19, cursor: 'pointer' }} />
                    )}
          </span>
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
          {data?.data.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={4} key={item?.d_id}>
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
                    id={item?.d_condicionante_id}
                    onClick={() => {
                      openModal();
                      hendleOpenModalConditions(item?.d_condicionante_id);
                      verifyStatusDoc(item?.d_condicionante_id);
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
        <Table columns={columns} dataSource={data?.data} scroll={{ x: 'max-content' }} />
      )}

      {/*MODAL DE CONDICIONANTES*/}
      <ModalConditions 
          isModal={isModal}
          hendleCloseModalConditions={hendleCloseModalConditions}
          checkCondicionante={checkCondicionante}
          setCheckCondicionante={setCheckCondicionante}
          numProtocolo={numProtocolo}
          setNumProtocolo={setNumProtocolo}
          dataProtocolo={dataProtocolo}
          setDataProtocolo={setDataProtocolo}
          dataEmissao={dataEmissao}
          setDataEmissao={setDataEmissao}
          dataVencimento={dataVencimento}
          setDataVencimento={setDataVencimento}
          handleCloseProcss={handleCloseProcss}
          handleCloseAllProcss={handleCloseAllProcss}
          conditions={conditions}
          car={car}
          result={result}
          data={data}
          toggleCondition={toggleCondition}
          hendleCheck={hendleCheck}
          users={users}
          handleUserToggle={handleUserToggle}
          handleSubmit={handleSubmit}
          refreshCondition={refreshCondition}
          selectedUserIds={selectedUserIds}
          isRefetching={isRefetching}
          visiblePopover={visiblePopover}
          setVisiblePopover={setVisiblePopover}
          userTK={userTK}
          setIsMdAddCond={setIsMdAddCond}
          isModalIdCondition={isModalIdCondition}
          contextHolder={contextHolder}
          handleUserListAttr={handleUserListAttr}
          docStatusId={docStatusId}
          />
    </Show>
  );
};
