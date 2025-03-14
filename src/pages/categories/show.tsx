import { CloseCircleOutlined, CommentOutlined, DownOutlined, IssuesCloseOutlined, LeftOutlined, Loading3QuartersOutlined, LoadingOutlined, MessageOutlined, ReconciliationOutlined, RightOutlined, UpOutlined } from "@ant-design/icons"
import { DateField, RefreshButton, Show } from "@refinedev/antd";
import { useList, useTable } from "@refinedev/core";
import { List, Card, Modal, Input, Space, Button, Badge, Mentions, Tag, Avatar, message, Form, Popover, Spin, Typography, Popconfirm, BackTop, Select } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../authProvider";
import { DeleteForever, DeleteOutline, Edit, ReplyOutlined, Send, } from "@mui/icons-material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PaidIcon from '@mui/icons-material/Paid';
import 'dayjs/locale/pt-br';
import { ModalConditions } from "./component/modalCondition";
import EqualizerIcon from '@mui/icons-material/Equalizer';
import { ModalCash } from "./component/modalCash";
import { useNotifications } from "../../contexts/NotificationsContext";
import ProgressoGrafico from "./component/modalProgress";
import GeneratePDF from "../../components/pdf-help";
import DrawerEdit from "./component/drawerEdit";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import '../categories/style.css'
dayjs.extend(relativeTime);
dayjs.locale('pt-br');

interface ICondition {
  dc_id: number;
  dc_condicoes: { [key: string]: { status: boolean | null; date: Date | null; users: [number] } };
  status: string;
  dc_criado_em: Date
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
  const { notifications, loading, fetchNotifications, markAsRead } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);



  // Define a localização para português

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const filialId = queryParams.get("filialId");
  const [isModal, setIsModal] = useState<boolean>(false);
  const [isModalIdCondition, setIsModalIdCondition] = useState<any>();
  const [isModalComment, setIsModalComment] = useState<boolean>(false);
  const [isDocComment, setIsDocComment] = useState({});
  const [isIdDoComment, setIsIdDoComment] = useState<number>()
  const [checkCondicionante, setCheckCondicionante] = useState<boolean>(true);
  const [conditions, setConditions] = useState<{ [key: string]: boolean | null }>({});
  const [expanded, setExpanded] = useState(false);
  const [userTK, setUserTK] = useState<any>(JSON.parse(localStorage.getItem('refine-user')).id);
  const [replyValue, setReplyValue] = useState<string>('');
  const [isReplyingToComment, setIsReplyingToComment] = useState<number | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isMdAddCond, setIsMdAddCond] = useState(false);
  const [usersComments, setUsersComments] = useState<[]>();
  const [conditionUsers, setConditionUsers] = useState<number[]>([]);


  const [form] = Form.useForm();

  const { data, isInitialLoading, isLoading, refetch } = useList({
    resource: 'document',
    meta: { endpoint: `listar-documentos-status-filial/${status}/${filialId}` },
    liveMode: 'auto',
  });

  const { tableQueryResult } = useTable({
    resource: "user", syncWithLocation: true, liveMode: "auto", meta: {
      endpoint: "listar-usuarios"
    }
  })

  const { data: result, isLoading: car, refetch: asas, isRefetching, } = useList<ICondition>({
    resource: 'document-condition',
    meta: { endpoint: `listar-documento-condicionante/${isModalIdCondition}` },
    liveMode: 'auto',
    enabled: !!isModalIdCondition,  // Somente buscar os dados se o ID for definido
  });

  const { data: comments, isLoading: carComment, refetch: refetchComment } = useList<IComments>({ resource: 'comment-document', meta: { endpoint: `${isIdDoComment}/listar-comentario-documento` }, liveMode: 'auto' });



  // Sincronizar as condições no estado e no formulário quando `result` mudar
  useEffect(() => {
    if (result?.data?.dc_condicoes) {
      setConditions(result?.data?.dc_condicoes);
    }
  }, [result]);

  const [commentValue, setCommentValue] = useState<string>('');
  const [commentStatusValue, setCommentStatusValue] = useState<string>('');
  const [visiblePopover, setVisiblePopover] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [numProtocolo, setNumProtocolo] = useState('');
  const [dataProtocolo, setDataProtocolo] = useState(null);
  const [dataEmissao, setDataEmissao] = useState(null);
  const [dataVencimento, setDataVencimento] = useState(null);
  const [d_flag_vitalicio, setD_flag_vitalicio] = useState<boolean>(false)
  const [userList, setUserList] = useState([]);
  const [loadingListUserAttr, setLoadingListUserAttr] = useState(false);
  const [users, setUsers] = useState([]);
  const [docStatusId, setDocStatusId] = useState<any>()

  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [numberProtocol, setNumberProtocol] = useState<number>()
  const [dataOneDoc, setDataOneDoc] = useState({})
  const [switchChecked, setSwitchChecked] = useState<boolean>(false);
  const [loadProcss, setLoadProcss] = useState(false);
  
  

  //CARROCEL STATUS
  const [statues, setStatues] = useState([])
  // Estado inicial baseado no status da URL
  const [index, setIndex] = useState(() =>
    statues.includes(status) ? statues.indexOf(status) : 0
  );
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();
  const [refetchStates, setRefetchStates] = useState(false)
  
  //MODEL CASH
  const [isModalCash, setIsModalCash] = useState<boolean>();
  const [listDebit, setListDebit] = useState([])
  const [loadingDataDebit, setLoadingDataDebit] = useState(true)

  //MODEL VIEW DOC
  const [openViewModalDoc, setOpenViewModalDoc] = useState(false)
  const [dataFilesView, setDataFilesView] = useState<any>()

  //MODEL PROGRESS
  const [openProgressId, setOpenProgressId] = useState(null);
  const [dc_id, setDc_Id] = useState<any>()
  const [dadosProgress, setDadosProgress] = useState<any>()
  const [loadProgress, setLoadProgress] = useState(false);

  //MODEL EDIT DOC
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false)
  const [dataModalEdit, setDataModalEdit] = useState<Object>({})

  const handleSendComment = async () => {
    try {
      if (commentValue == '') return messageApi.warning('Campo comentario vazio! ⚠')
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

  const refreshCondition = async () => {
    await asas();
  }

  useEffect(() => {
    console.log("d_flag_vitalicio atualizado:", d_flag_vitalicio);
  }, [d_flag_vitalicio]);



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


      const date = newValue
        ? new Date().toISOString().slice(0, 10) // Se `newValue` for verdadeiro, data atual.
        : newValue === null
          ? new Date().toISOString().slice(0, 10) // Se `newValue` for null, data atual.
          : null; // Caso contrário, null.

      console.log('Status: ', date)
      const updatedConditions = {
        ...prevConditions,
        [key]: {
          // Preserva as propriedades anteriores, como `dateCreate`
          ...prevConditions[key],
          status: newValue,
          date: date,
          users: [userTK],
          statusProcesso: docStatusId,
        },
      };

      // Certifique-se de que o ID da condicionante está presente
      if (isModalIdCondition && updatedConditions[key]) {
        // Chama a API para atualizar a condição via axios
        axios
          .put(`${API_URL}/document-condition/fechar-condicionante/${isModalIdCondition}`, {
            dc_condicoes: {
              [key]: updatedConditions[key],
            },
          })
          .then((response) => {
            console.log('Condição atualizada com sucesso:', response.data);
          })
          .catch((error) => {
            console.error('Erro ao atualizar condição:', error);
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

  const handlerDeleteComment = async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/comment-document/${id}/deletar-comentario`);

      await refetchComment()
      messageApi.success(response?.data?.message);

    } catch (error) {
      messageApi.error(error?.response?.data?.message);
    }
  }

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
    setIsDocComment(item);
    setIsModalComment(true);
    setUsersComments(tableQueryResult.data.data)
  };

  const usersCommentsAttr = usersComments?.map((result) => ({
    value: result?.u_nome,
    label: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          size="small"
          style={{ marginRight: 8, backgroundColor: '#ffbf00' }}
          icon={String(result?.u_nome).toUpperCase()[0]}
          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${result?.u_nome}`}
        />
        {result?.u_nome}
      </div>
    ),
  }))


  const hendleCloseModalComments = () => {
    setIsModalComment(false)
  };

  const getColor = (status: any) => {
    switch (status) {
      case 'Vencido': return 'red';
      case 'Em processo': return 'cyan';
      case 'Irregular': return 'orange';
      case 'Emitido': return 'green';
      case 'Não Aplicavél': return '#b0ac5d';
      default: return 'gray';
    }
  };

  // Filtra os usuários com base no termo de busca
  const filteredUsuarios = userList.filter((user) =>
    user?.u_nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserToggle = (id: number) => {
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

  // Função para chamar a API e listar os usuários
  const handleUserListAttr = async (dc_id: number, condicaoNome: any) => {
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
          dateCreate: new Date().toISOString().slice(0, 10),
          statusProcesso: data?.data.map(d => d?.d_situacao)[0]
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


  const handleCloseProcss = async (conditionID: number) => {

    try {
      setLoadProcss(true)
      const dc_id = conditionID; // Substitua pelo valor correto de 'dc_id'

      const payload = {
        d_data_pedido: dataProtocolo
      }

      // Envia a requisição para o backend com o parâmetro 'dc_id' na URL
      const { data } = await axios.put(`${API_URL}/document-condition/fechar-processo-condicionante/${dc_id}`, payload);
      setNumProtocolo('')
      setDataProtocolo(null)
      await asas()
      setLoadProcss(false)
      messageApi.success(data?.message)

    } catch (error) {
      console.log('Erro ao requisiatar ', error)
    }


  }


  const handleCloseAllProcss = async (conditionID: number) => {
    try {
      setLoadProcss(true)
      const dc_id = conditionID;

      const payload = {
        d_data_emissao: dataEmissao,
        d_data_vencimento: dataVencimento,
        d_num_protocolo: numProtocolo,
        d_flag_vitalicio: d_flag_vitalicio
      }


      console.log('Payload enviado: ', payload)

      const { data } = await axios.put(`${API_URL}/document-condition/fechar-processo/${dc_id}`, payload);

      setDataEmissao(null)
      setDataVencimento(null)
      setLoadProcss(false)
      await refetch()
      messageApi.success(data?.message)
      setNumberProtocol(data?.doc)
      await setIsModal(false)
      hendlerStatesFill()
    } catch (error) {
      console.log(error)
      messageApi.error(error?.response.data.message)
    }
  }

  const verifyStatusDoc = async (id) => {

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

  //FAZENDO AQUI A PROCURA PELO DOCUMENTO INDIVIDUAL
  const handlerDataOneData = async (id: number) => {
    try {
      // Altere para axios.get se a rota suportar o método GET em vez de POST
      const response = await axios.get(`${API_URL}/document/listar-documentos-conditionId/${id}`);

      setDataOneDoc(response?.data)
    } catch (error) {
      console.error("Erro ao obter o status do documento:", error);
    }
  }




  const handlerUpdateStateDoc = async (d_id: number, checked: any) => {

    try {
      const condiciones = result?.data?.dc_condicoes;

      const statusProcessosFalse = Object.values(condiciones)
        .filter((item) => item.status === false) // Filtra os itens com status false
        .map((item) => item.statusProcesso); // Pega apenas o statusProcesso

      const payload = {
        d_situacao: checked ? 'Irregular' : statusProcessosFalse[0]
      }

      const response = await axios.put(`${API_URL}/document/atualiza-status-irregular/${d_id}`, payload);
      await asas()
      console.log(response)
      messageApi.success(response?.data?.message)
    } catch (error) {
      console.log(error)
    }
  }



  useEffect(() => {
    if (dataOneDoc?.d_situacao === 'Irregular') {
      setSwitchChecked(true);
    } else {
      setSwitchChecked(false);
    }
  }, [dataOneDoc?.d_situacao]);

  const handleSwitchChange = (checked) => {
    setSwitchChecked(checked);
    handlerUpdateStateDoc(dataOneDoc?.d_id, checked);
  };


  const listDebits = async (d_id: number) => {
    try {
      setLoadingDataDebit(true)
      const response = await axios.get(`${API_URL}/debit/listar-custo-documento/${d_id}`)
      setLoadingDataDebit(false)
      setListDebit(response?.data)

    } catch (error) {
      console.log(error)
    }
  }

  const openModalViewDoc = async (data: any) => {
    await setOpenViewModalDoc(true)
    await setDataFilesView(data)
  }

  const totalGeral = listDebit?.reduce((acc, d) => acc + parseFloat(d.dd_valor || 0), 0);


  const handlerGraphc = async () => {
    if (!openProgress) {
      await setOpenProgress(true)
    } else {
      await setOpenProgress(false)
    }
  }

  const dadaProgress = async (id: number) => {
    try {
      setLoadProgress(true)
      const response = await axios.post(`${API_URL}/document-condition/listar-documento-condicionante-usuario/${id}`)
      await setDadosProgress(response?.data)

      setLoadProgress(false)
    } catch (error) {
      console.log('Erro: ', error)
    }
  }


  const deletarDocumento = async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/document/deletar-documento/${id}`);
      messageApi.warning(`Atenção ${response?.data?.message}`)


      await refetch()
    } catch (error) {
      console.error("Erro ao obter o status do documento:", error);
    }
  }

  const conditionDelete = (item: any) => {
    const criadoEm = new Date(item?.criado_em);
    const agora = new Date();
    const diffHoras = (agora - criadoEm) / (1000 * 60 * 60); // Diferença em horas
    const podeExcluir = diffHoras <= 72 && item?.d_situacao === 'Não iniciado';

    return podeExcluir;
  }

const hendlerStatesFill = ()=>{

      axios.get(`${API_URL}/document/listar-documentos-model/${filialId}`)
      .then(response=>setStatues(response?.data))
      .catch(error=>console.error('Log Error: ', error))

}

useEffect(()=>{

  axios.get(`${API_URL}/document/listar-documentos-model/${filialId}`)
  .then(response=>setStatues(response?.data))
  .catch(error=>console.error('Log Error: ', error))
  
},[filialId, status])



  const prevStatus = () => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? statues.length - 1 : prev - 1));
  };

  const nextStatus = () => {
    setDirection(1);
    setIndex((prev) => (prev === statues.length - 1 ? 0 : prev + 1));
  };
  

  useEffect(() => {
    // Atualiza o índice se o status da URL mudar
    if (statues.includes(status)) {
      setIndex(statues.indexOf(status));
    }
  }, [status, statues]);


  const [loadingBack, setLoadingBack] = useState(false)
  
  const handleBack = () => {
    setLoadingBack(true);
    setTimeout(() => navigate(`/document`), 100);
  };

  const [activeCard, setActiveCard] = useState(null);

  return (
    <Show title={[<><span>{status} </span><Select disabled/></>]} canEdit={false} canDelete={false}  headerProps={{ 
      onBack: ()=>{handleBack()}
    }} headerButtons={
      <>
        <RefreshButton onClick={() => {atualiza(); hendlerStatesFill()}} />
      </>}>

      <Space wrap style={{ display: "flex", justifyContent: "center",  width: "100%" }}>
        <Button
          shape="circle"
          style={{ border: 0 }}
          icon={<LeftOutlined />}
          onClick={() => {
            prevStatus();
            const prevIndex = (index - 1 + statues.length) % statues.length;
            navigate(`/document/show/?status=${statues[prevIndex] || ""}&filialId=${filialId}`);
            
          }}
        />
      
        {/* Carrossel de Status */}
        <div style={{ width: "260px", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>

          <span style={{ opacity: 0.4, fontSize: "10px", minWidth: "60px", textAlign: "center", cursor: 'pointer' }} onClick={() => {
            prevStatus();
            const prevIndex = (index - 1 + statues.length) % statues.length;
            navigate(`/document/show/?status=${statues[prevIndex] || ""}&filialId=${filialId}`);
            
          }}>
            {statues.length > 0 ? statues[(index - 1 + statues.length) % statues.length] : ""}
          </span>

         
          

          <AnimatePresence custom={direction}>
            <motion.div
              key={index}
              initial={{ x: direction * 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -direction * 50, opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#fff",
                background: getColor(statues[index] || ""),
                padding: "6px 14px",
                borderRadius: "15px",
                minWidth: "130px",
                textAlign: "center",
                margin: "0 10px",
              }}
            >
              {statues.length > 0 ? statues[index] : ""}
            </motion.div>
          </AnimatePresence>

          <span style={{ opacity: 0.4, fontSize: "10px", minWidth: "60px", textAlign: "center", cursor: 'pointer' }} onClick={() => {
            nextStatus();
            const nextIndex = (index + 1) % statues.length;
            navigate(`/document/show/?status=${statues[nextIndex] || ""}&filialId=${filialId}`);
           
          }}>
            {statues.length > 0 ? statues[(index + 1) % statues.length] : ""}
          </span>
        </div>

        <Button
          shape="circle"
          style={{ border: 0 }}
          icon={<RightOutlined />}
          onClick={() => {
            nextStatus();
            const nextIndex = (index + 1) % statues.length;
            navigate(`/document/show/?status=${statues[nextIndex] || ""}&filialId=${filialId}`);
            
          }}
        />
      </Space>

      
      <List

        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 5,
        }}
        key={data?.data.map(d => d.d_id)}
        loading={isInitialLoading || isLoading || loadingBack}
        dataSource={data?.data}
        size="small"
        renderItem={item => (
          <>
            
            <Card
              className={activeCard === item.d_id ? "expanding-border-card" : ""}
              loading={isLoading}
              size="small"
              title={<><h3>{item.tipo_documentos.td_desc}</h3></>}
              style={{
                margin: 10,
                padding: 10,
                boxShadow: 'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px',
                minHeight: 250, // Altura mínima
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",

 
              }}

              bordered
              cover
              // hoverable
              extra={
                <span
                  id={item.d_condicionante_id}
                  onClick={() => {
                    openModal();
                    hendleOpenModalConditions(item.d_condicionante_id);
                    verifyStatusDoc(item?.d_condicionante_id);
                    handlerDataOneData(item?.d_condicionante_id);
                    setActiveCard(item.d_id);
                  }}
                >
                  {item.d_condicionante_id && (
                    <IssuesCloseOutlined style={{ color: '#ebc334', fontSize: 19, cursor: 'pointer' }} />
                  )}
                </span>
              }
              actions={[
               
                <>
                <Space wrap>
                  
                  {item?.d_condicionante_id != null && (
                    <Button
                      icon={<PaidIcon fontSize="small" htmlColor="green" />}
                      shape="circle"
                      style={{ border: 0 }}
                      onClick={async () => {
                        await setIsModalCash(true);
                        await handlerDataOneData(item?.d_condicionante_id);
                        await listDebits(item?.d_condicionante_id);
                        setActiveCard(item.d_id);
                      }}
                    />
                  )}

                  <GeneratePDF id={item?.d_id} />
                  
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
                        setActiveCard(item.d_id);
                      }}
                    />
                  </Badge>
                  {
                    item?.d_condicionante_id == null ? null : (
                      <>
                        <Popover open={openProgressId === item.d_condicionante_id} trigger='click' content={[
                          <>

                            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", width: "100%" }}>
                              <CloseCircleOutlined style={{ fontSize: 20, cursor: "pointer" }} onClick={() => setOpenProgressId(null)} />
                            </div>
                            <ProgressoGrafico dados={dadosProgress} />
                          </>
                        ]} placement="right">
                          <Button onClick={async () => {
                            setOpenProgressId(item.d_condicionante_id);
                            await dadaProgress(item?.d_condicionante_id);
                            await handlerGraphc();
                          }} icon={<EqualizerIcon fontSize="inherit" />} shape="circle" size="small" loading={loadProgress} />
                        </Popover>


                      </>
                    )
                  }
                  <Button size="small" shape="circle" icon={<ReconciliationOutlined />} disabled={!item?.d_anexo?.arquivo} onClick={async () => {await openModalViewDoc(item?.d_anexo); setActiveCard(item.d_id);}} itemID={item.d_condicionante_id} />

                  {/* ação de exclusão de documento */}
                  <Popconfirm
                    title="Tem certeza que deseja excluir este processo?"
                    onConfirm={async () => await deletarDocumento(item?.d_id)}
                  // disabled={!conditionDelete(item)}

                  >
                    <Popover title="Exclusão bloqueada: prazo de 72h excedido." trigger={conditionDelete(item) ? null : 'hover'}>
                      <Button
                        size="small"
                        shape="circle"
                        icon={<DeleteForever fontSize="inherit" htmlColor={conditionDelete(item) ? "red" : "gray"} />}
                      // disabled={!conditionDelete(item)} 
                      />
                    </Popover>
                  </Popconfirm>


                  {/* ação de exclusão de documento */}

                  <Popover title="Edição bloqueada: prazo de 72h excedido." trigger={conditionDelete(item) ? null : 'hover'}>
                    <Button
                      size="small"
                      shape="circle"
                      icon={<Edit fontSize="inherit" htmlColor={conditionDelete(item) ? "default" : "gray"} />}
                      // disabled={!conditionDelete(item)} 

                      onClick={async () => { await setOpenModalEdit(true); await setDataModalEdit(item); setActiveCard(item.d_id); }}
                    // hidden={item?.d_situacao === 'Não iniciado' || item?.d_situacao === 'Em processo' ? false : true}

                    />
                  </Popover>
                  
                </Space>

                {item?.tagStatusConds && (<Badge.Ribbon text={item?.tagStatusConds} placement="end" style={{ marginTop: "-100px", marginRight: "-10px" }} color={item?.tagStatusConds == 'Pendente' ? 'red' : ""} />)}
                
                </>
              ]}
            >
              <p style={{ fontSize: 12, margin: 0 }}>{item?.filiais?.f_codigo} - {item?.filiais?.f_nome}</p>
              <p style={{ fontSize: 12, margin: 0 }}>{item?.tipo_documentos?.td_desc}</p>
              <p style={{ fontSize: 10 }}>
                <DateField value={item?.criado_em} format="DD/MM/YYYY · H:mm:ss" locales="pt-br" style={{ fontSize: 9 }} />
                <br />

                {item.d_data_pedido === "1970-01-01" ? null : (
                  <span>
                    {item.d_data_emissao !== "1970-01-01" ? 'Este processo durou' : 'há dias:'} {
                      (() => {
                        const datePedido = new Date(item.d_data_pedido);
                        const dateEmissao =
                          item.d_data_emissao === "1970-01-01"
                            ? new Date() // Usa a data atual se d_data_emissao for inválida
                            : new Date(item.d_data_emissao);

                        // Cálculo da diferença em milissegundos e conversão para dias completos
                        const differenceInTime = dateEmissao - datePedido;
                        const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

                        return differenceInDays;
                      })()
                    } <span style={{ marginLeft: 3 }}>Dias</span>
                  </span>)}

                <p style={{ padding: 0, margin: 0 }}><span style={{ fontWeight: 'bold' }}>Data protocolo:</span> {item?.d_data_pedido == '1970-01-01' ? null : (<DateField style={{ fontSize: '10px' }} value={item?.d_data_pedido} />)}</p>
                <p style={{ padding: 0, margin: 0 }}><span style={{ fontWeight: 'bold' }}>Protocolo:</span> {item?.d_num_protocolo == '' ? null : (<Typography.Text copyable style={{ fontSize: 11 }}>{item?.d_num_protocolo}</Typography.Text>)}</p>
                <p style={{ padding: 0, margin: 0 }}><span style={{ fontWeight: 'bold' }}>Data Emissão:</span> {item?.d_data_emissao == '1970-01-01' ? null : (<DateField style={{ fontSize: '10px' }} value={item?.d_data_emissao} />)}</p>
                <p style={{ padding: 0, margin: 0 }}><span style={{ fontWeight: 'bold' }}>Data Vencimento:</span> {item?.d_flag_vitalicio ? (<span style={{ fontSize: 10 }}>indeterminado🔄</span>) : item?.d_data_vencimento == '1970-01-01' ? null : (<DateField style={{ fontSize: '10px' }} value={item?.d_data_vencimento} />)}</p>
                <span><span style={{ fontWeight: 'bolder' }}>Valor Agregado: </span> R$ {item?.debitos}</span>
              </p>


              
              <Space direction="vertical">
                {/* Tag de situação */}
                <Space wrap align="end">
                  <Tag color={getColor(item?.d_situacao)} style={{ fontSize: 10, borderRadius: 20 }}>
                    {item?.d_situacao}
                  </Tag>
                </Space>
                
                {/* Container com nome e ribbon */}
                <Space style={{ display: "flex", alignItems: "center" }}>
                  
                  <Tag style={{ borderRadius: 20, padding: 3 }}>
                    <Avatar
                      shape="circle"
                      icon={String(item?.usuario?.u_nome).toUpperCase()[0]}
                      size="small"
                    />{' '}
                    {item?.usuario?.u_nome === JSON.parse(localStorage.getItem('refine-user')).nome ? (
                      <a style={{ fontSize: 11, margin: 3 }}>você</a>
                    ) : (
                      item?.usuario?.u_nome
                    )}
                  </Tag>
                    
                  {/* Ribbon reposicionado */}
                </Space>
              </Space>
            </Card>
            

            {/* </Col> */}
            {/* </Row> */}
          </>
        )}
      />


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
        setD_flag_vitalicio={setD_flag_vitalicio}
        d_flag_vitalicio={d_flag_vitalicio}
        handleCloseProcss={handleCloseProcss}
        handleCloseAllProcss={handleCloseAllProcss}
        conditions={conditions}
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
        numberProtocol={numberProtocol}
        dataOneDoc={dataOneDoc}
        handlerDataOneData={handlerDataOneData}
        getColor={getColor}
        switchChecked={switchChecked}
        handleSwitchChange={handleSwitchChange}
        loadProcss={loadProcss}
        setActiveCard={setActiveCard}
      />

      <Modal
        title={[<MessageOutlined />, ` Interações`]}
        open={isModalComment}
        onCancel={() => {setIsModalComment(false); setActiveCard(null);}}
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
                        <a style={{ fontWeight: 'bold', color: '#009cde' }}>
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <ReplyOutlined
                            onClick={() => {
                              setReplyValue(`@${item.usuario?.u_nome} `);
                              setIsReplyingToComment(item.cd_id);
                            }}
                            style={{ cursor: 'pointer', color: 'GrayText' }}
                            fontSize="inherit"
                          />


                          {item?.cd_autor_id === userTK && (
                            <Popconfirm
                              title='Deseja excluir este comentario? 💬'
                              description={<p style={{ fontSize: 10, textAlign: 'inherit', width: 180, color: 'gray' }}>Uma vez que excluído, todo o fluxo de resposta também será excluído!</p>}
                              arrow
                              onConfirm={() => handlerDeleteComment(item?.cd_id)}
                            >
                              <DeleteOutline
                                fontSize="inherit"
                                htmlColor="red"
                              />
                            </Popconfirm>
                          )}

                        </div>
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
                          <div style={{ marginTop: '8px', position: 'relative' }}>
                            {/* Linha vertical que conecta o comentário principal às respostas */}
                            <div
                              style={{
                                position: 'absolute',
                                top: '0',
                                left: '16px',
                                width: '15px',
                                height: item.cd_resposta.length > 1 ? '98%' : '40%',
                                borderLeft: '1px solid #009cde',
                                borderBottom: '1px solid #009cde',
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
                                          <a style={{ fontWeight: 'bold', color: '#009cde', fontSize: 9 }}>
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
            {/* <GeneratePDF data={isDocComment?.usuario?.u_nome}/> */}
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
              options={usersCommentsAttr}
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

      <ModalCash
        open={isModalCash}
        close={() => {setIsModalCash(false); setActiveCard(null)}}
        dataOneDoc={dataOneDoc}
        listDebits={listDebits}
        listDebit={listDebit}
        loadingDataDebit={loadingDataDebit}
        refetch={refetch}
      />


      {/* MODAL DE VIZUALIZAÇÃO DO DOCUMENTO */}
      <Modal
        open={openViewModalDoc}
        cancelButtonProps={{ onClick: () => {setOpenViewModalDoc(false); setActiveCard(null);} }}
        closable={false}
        okButtonProps={{ hidden: true }}
        width="45vw"
        style={{ maxWidth: '1100px', top: 20 }}
      >
        <h3>Visualizar Documento</h3>

        {!dataFilesView?.url ?
          <Spin />
          :
          dataFilesView?.url ? (
            <iframe
              loading="lazy"
              src={dataFilesView?.url}
              title={dataFilesView?.arquivo}
              style={{ width: '100%', height: '80vh', border: 'none' }}

            />
          ) : (
            <p>Documento não disponível.</p>
          )
        }
      </Modal>


      <DrawerEdit
        title={`Edição de Documento - ${dataModalEdit?.tipo_documentos?.td_desc} - LJ ${dataModalEdit?.filiais?.f_codigo}`}
        open={openModalEdit}
        onCancel={() => {setOpenModalEdit(false); setActiveCard(null)}}
        data={dataModalEdit}
      />
      {contextHolder}

    </Show>
  );
};


