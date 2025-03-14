import {
  List,
  RefreshButton,
  useForm,
  useTable
} from "@refinedev/antd";
import { Table, TableProps, Popover, Tag, Badge, Modal, Button, Tabs, Row, Col, Form, Select, Input, DatePicker, Card, Space, Checkbox, Skeleton, Spin } from "antd";
import StoreIcon from '@mui/icons-material/Store';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {  CreateNewFolder, Filter, Filter1Rounded, Filter6Outlined } from "@mui/icons-material";
import TabPane from "antd/lib/tabs/TabPane";
import { AlertOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, DownCircleOutlined, ExceptionOutlined, ExclamationCircleOutlined, FilterOutlined, FolderAddOutlined, IssuesCloseOutlined, SearchOutlined, StopOutlined, UpCircleOutlined } from "@ant-design/icons";
import { useInvalidate, useList } from "@refinedev/core";
import { ColumnType } from "antd/es/table";
import axios from "axios";
import { API_URL } from "../../authProvider";
import { io } from 'socket.io-client';
import { useNotifications } from "../../contexts/NotificationsContext";
import './style.css'



interface IDocuments {
  f_id: number;
  f_nome: string;
  f_cnpj: number;
  f_cidade: string;
  f_uf: string;
  f_ativo: boolean;
  documentos: [];
  f_codigo: number;

}


interface IDocument {
  d_filial_id: number;
  d_data_pedido: Date;
  d_data_emissao: Date;
  d_data_vencimento: Date;
  d_tipo_doc_id: number;
  d_orgao_exp: string;
  d_anexo: string;
  d_num_protocolo: string;
  d_sitaucao: string;
  d_flag_stts: boolean;
  d_condicoes: string[];
  criado_em: Date;
}

const formatCNPJ = (cnpj: any) => {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
};


type PaginationState = {
  current: number;
  pageSize: number;
};

const debounce = <F extends (...args: any[]) => void>(func: F, wait: number) => {
  let timeoutId: number | null = null;
  
  const debounced = (...args: Parameters<F>) => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => func(...args), wait);
  };

  debounced.cancel = () => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
  };

  return debounced;
};


export const DocumentList = () => {
  const [isModal, setIsModal] = useState(false)
  const [islistModal, setIsListModal] = useState([])
  const [islistModalConditions, setIsListModalConditions] = useState([])
  const [tabCond, setTabCond] = useState(true)
  const [subList, setSubList] = useState(false)
  const [idCondition, setIdCondition] = useState<any>()
  const [conditionsStatus, setConditionsStatus] = useState<{[key: string]: boolean}>({})
  const [userTK, setUserTK] = useState<any>(JSON.parse(localStorage.getItem('refine-user'))?.id)
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('')
  const [seachedColumn, setSearchedColumn] = useState('');
  const [selectedUFs, setSelectedUFs] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState<boolean>()
  const [isCheckedNA, setIsCheckedNA] = useState<boolean>()
  const { notifications, loading, fetchNotifications } = useNotifications();


  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);


  const { data: listTypeDocument } = useList({ resource: 'type-document', meta: { endpoint: 'listar-tipo-documentos' }, liveMode: 'auto',  });
  const { data: condtionsResult } = useList({ resource: 'condition', meta: { endpoint: 'listar-condicionantes' } });
  
  const invalid = useInvalidate()
  const {formProps, form, saveButtonProps, formLoading} = useForm<IDocument>({
    resource: 'documentCreate', 
    action: 'create',
    redirect: 'create',
    successNotification(data) {
      form.resetFields(['d_data_pedido', 'd_data_emissao', 'd_data_vencimento', 'd_tipo_doc_id', 'd_orgao_exp', 'd_anexo', 'd_num_protocolo', 'd_sitaucao', 'criado_em']);
      setIsListModalConditions([]);
      setSubList(false);
      return{
          message:  `${data?.data?.message}`,
          type: 'success'
      }
  },
    errorNotification(error, values, resource) {
      return{
        type: 'error',
        message: error?.response.data.error
      }
    },
    onMutationSuccess: ()=>{
      invalid({
          resource: 'document',
          meta: {endpoint: 'listar-documentos-filais'},
          invalidates: ['all']
      })
  }
  })

  const listaTipoDocumentos = listTypeDocument?.data.map((tpd) => ({
    label: (
      <span>
        {!tpd?.td_requer_condicao && <IssuesCloseOutlined style={{color: 'red', fontSize: 13}} /> }{' '}
        {tpd.td_desc}
      </span>
    ),
    value: tpd.td_id,
    ...tpd
  }))

  const listarCondicionantes = condtionsResult?.data.map((cond) => ({
    label: cond.c_tipo,
    value: cond.c_id,
    ...cond
  }))


  const getInitialPagination = (): PaginationState => {
    try {
      const saved = localStorage.getItem("documentPagination");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          current: Number(parsed.current) || 1,
          pageSize: Number(parsed.pageSize) || 10
        };
      }
    } catch (error) {
      console.error("Error loading pagination state:", error);
    }
    return { current: 1, pageSize: 10 };
  };


  const { tableProps, tableQueryResult } = useTable({
    resource: 'document', meta: { endpoint: 'listar-documentos-filais' },
    syncWithLocation: false,
    liveMode: "auto",
    pagination: getInitialPagination()
  });
  
  useEffect(() => {
    const savePagination = debounce((state: PaginationState) => {
      localStorage.setItem("documentPagination", JSON.stringify(state));
    }, 300);

    if (tableProps.pagination) {
      savePagination({
        current: tableProps.pagination.current || 1,
        pageSize: tableProps.pagination.pageSize || 10
      });
    }

    return () => {
      savePagination.cancel();
    };
  }, [tableProps.pagination?.current, tableProps.pagination?.pageSize]);






  const data = tableQueryResult.data?.data || [];

  const situacaoCount = tableQueryResult.data?.data
    .flatMap(doc => doc?.documentos) // Achata e mapeia os documentos
    .reduce((acc, doc) => {
        // Incrementa o contador para cada d_situacao
        acc[doc?.d_situacao] = (acc[doc?.d_situacao] || 0) + 1;
        return acc;
    }, {});

  const getColumnSearchProps = (title, dataIndex: keyof IDocuments): ColumnType<IDocuments> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterConfirmProps) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Buscar ${title}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Buscar
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Limpar
        </Button>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => setSearchText(""), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <span style={{ backgroundColor: "#ffc069", padding: 0 }}>{text}</span>
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys: React.Key[], confirm: () => void, dataIndex: keyof IDocuments) => {
    confirm();
    setSearchText(selectedKeys[0] as string);
    setSearchedColumn(dataIndex);
  };
  
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };



  const uniqueUFs = Array.from(new Set(data.map((uf) => uf?.f_uf)))
  .map((uf) => ({ text: uf, value: uf }));

  const uniqueCity = Array.from(new Set(data.map((city) => city?.f_cidade)))
  .map((city) => ({ text: city, value: city }));

    // Obter situações únicas para filtro
    const uniqueSituations = Array.from(
      new Set(
        data
          .flatMap((item) => item.documentos)
          .filter((doc) => doc.d_situacao)
          .map((doc) => doc.d_situacao)
      )
    ).map((situacao) => ({ text: situacao, value: situacao }));

  
  const columns: TableProps<IDocuments>['columns'] = [
    {
      key: 'filiais',
      title: '#',
      align: 'center',
      render: (_, record) => (
        <>
          <Popover title={record.f_ativo ? (<Tag color="success" style={{ width: '100%' }}>Ativada</Tag>) : (<Tag color="error" style={{ width: '100%' }}>Desativada</Tag>)}
            arrowContent>
            <StoreIcon color={record.f_ativo ? 'success' : 'error'} fontSize="small" style={{ cursor: 'pointer' }} />
          </Popover>

        </>
      )
    },

    {
      key: 'd_id',
      title: 'Nº Loja',
      align: 'center',
      width: 105,
      ...getColumnSearchProps("Cod", "f_codigo"),
      sorter: (a, b) => a.f_codigo - b.f_codigo,
      render: (_, { f_codigo, f_id }) => (
        <a style={{ fontSize: '12px' }} onClick={()=> navigate(`alldocuments/${f_id}`)}>#{f_codigo}</a>
      ),
      
    },

    {
      key: 'filiais',
      title: 'Filial',
      ...getColumnSearchProps("Filial", "f_nome"),
      render: (_, record) => (
        record.f_nome
      )
    },

    {
      key: 'filiais',
      title: 'CNPJ',
      ...getColumnSearchProps("CNPJ", "f_cnpj"),
      render: (_, record) => (
        formatCNPJ(record.f_cnpj)
      )
    },

    {
      key: 'filiais',
      title: 'Cidade',
      filters: uniqueCity,
      onFilter: (value, record) => record.f_cidade === value,
      render: (_, record) => (
        record.f_cidade
      )
    },

    {
      key: 'filiais',
      title: 'UF',
      align: 'center',
      filters: uniqueUFs,
      onFilter: (value, record) => record.f_uf === value,
      width: 50,
      render: (_, record) => (
        record.f_uf
      )
    },

    {
      key: 'documentos',
      title: 'Status',
      align: 'center',
      filters: uniqueSituations,
      onFilter: (value, record) => {
        return record.documentos.some(doc => doc.d_situacao === value);
      },
      render: (_, { documentos, f_id }) => {
        // Contagem de status por filial com lista de tipos de documentos
        const statusCount = (documentos || []).reduce((acc, doc) => {
          const situacao = doc?.d_situacao || 'Não especificado';
          if (acc[situacao]) {
            acc[situacao].count += 1;
            acc[situacao].documents.push(doc.tipo_documentos?.td_desc || 'Tipo não especificado');
          } else {
            acc[situacao] = { count: 1, documents: [doc.tipo_documentos?.td_desc || 'Tipo não especificado'] };
          }
          return acc;
        }, {});
        
    
        const statusOrder = ['Vencido', 'Não iniciado', 'Irregular', 'Em processo', 'Emitido', 'Não Aplicavél'];
    
        const getColor = (status) => {
          switch (status) {
            case 'Vencido': return 'red-inverse';
            case 'Em processo': return 'cyan';
            case 'Irregular': return 'orange';
            case 'Emitido': return 'green';
            case 'Não Aplicavél': return 'yellow';
            default: return 'default';
          }
        };
    
        const handleTagClick = (status, f_id) => {
          navigate(`/document/show/?status=${status}&filialId=${f_id}`);
        };
        
         // Se houver um filtro aplicado, filtra os status que coincidem
        const filteredStatuses = statusOrder.filter(status => 
          statusCount[status] && statusCount[status].documents.length > 0
        );


        return (
          <>
            {statusOrder
              .filter(status => statusCount[status])
              .map((status) => (
                <Tag
                  style={{ cursor: 'pointer', borderRadius: 30 }}
                  color={getColor(status)}
                  key={status}
                  onClick={() => handleTagClick(status, f_id)}
                >
                  <Popover
                    content={
                      statusCount[status].documents.length > 0 ? (
                        <ul>
                          {statusCount[status].documents.map((docType, index) => (
                            <li key={index}>{docType}</li>
                          ))}
                        </ul>
                      ) : (
                        <div>Nenhum tipo de documento encontrado</div>
                      )
                    }
                  >
                    <Badge count={statusCount[status].count} size="small" color={getColor(status)}>
                      {status === 'Vencido' && <AlertOutlined />}
                      {status === 'Em processo' && <ClockCircleOutlined />}
                      {status === 'Não iniciado' && <ExclamationCircleOutlined />}
                      {status === 'Irregular' && <StopOutlined />}
                      {status === 'Emitido' && <CheckCircleOutlined />}
                      {status === 'Não Aplicavél' && <ExclamationCircleOutlined />}
                      <span style={{ fontSize: 10, marginLeft: 4 }}>{status}</span>
                    </Badge>
                  </Popover>
                </Tag>
              ))}
          </>
        );
      },
    },
    
    
    
    

    {
      key: 'actions',
      title: 'Novo Documento',
      render: (_, record) => (
        <Button hidden={record.f_ativo ? false : true} icon={<CreateNewFolder color={islistModal?.f_id === record.f_id ? "inherit" : "warning"} fontSize="inherit" />} shape="circle" onClick={() => hendleModal(record)} title="Criar novo documento"/>
      )
    }

  ]



const hendleModal = (record: any) => {
  if (record) {
    setIsModal(true);
    setIsListModal(record);

    const filialId = record.f_id;

    form.setFieldsValue({
      d_filial_id: filialId,
    });

  } else {
    setIsListModal([]);
  }
};

  

  const hendleCondicionante = (value: any, option: any) => {
    setTabCond(option.td_requer_condicao)
  }



  const hedleSubList = () => {
    if (!subList) {
      setSubList(true)
    } else {
      setSubList(false)
    }
  }


  
// Função para atualizar o status das condições
const handleConditionCheck = (condition: string) => {
  setConditionsStatus((prevState) => {
    // Cria uma nova data
    const currentDate = new Date().toISOString().slice(0, 10);

    // Atualiza o status da condição com o objeto desejado
    const updatedStatus = {
      ...prevState,
      [condition]: {
        status: !prevState[condition]?.status, // Alterna entre true e false
        date: !prevState[condition]?.status ? currentDate : null, // Define a data se estiver sendo marcada como true
        users: [userTK]
      },
    };

    // Atualiza o campo d_condicoes no formulário com o formato adequado
    form.setFieldsValue({ d_condicoes: updatedStatus });

    return updatedStatus;
  });
};



//procurar e setar as condicoes via axios corretas...
const verifyConditionsSys = async (id) => {
  try {
    // Altere para axios.get se a rota suportar o método GET em vez de POST
    const response = await axios.get(`${API_URL}/condition/listar-condicionante/${id}`);

    // Processar as condições retornadas (caso a resposta seja adequada)
    if (response.data && response.data.conditions) {
      const conditions = response.data.conditions; // Exemplo de como acessar as condições

      return conditions;
    } else {
      console.error("Nenhuma condição encontrada");
      return [];
    }
  } catch (error) {
    console.error("Erro ao obter as condições:", error);
    return [];
  }
};




// Função para capturar as condições ao selecionar uma condicionante
const handleCondicoes = (value: any, option: any) => {
  const conditions = option.c_condicao;
  setIdCondition(value)
  
  // Inicializa o status das condições como 'false' (unchecked) e data como null
  const initialStatus = conditions.reduce((acc: any, cond: string) => {
    acc[cond] = { status: false, dateCreate: new Date().toISOString().slice(0, 10), date: null, users: [userTK], statusProcesso: 'Não iniciado' };
    return acc;
  }, {});


  // Limpa o estado anterior e atualiza o campo d_condicoes no formulário
  setConditionsStatus({});
  form.setFieldsValue({ d_condicoes: '' });

  // Se houver novas condições, define o novo estado
  if (conditions.length > 0) {
    setConditionsStatus(initialStatus);
    form.setFieldsValue({ d_condicoes: initialStatus });
  } else {
    setIsListModalConditions([]);
  }

  // Atualiza a lista modal com as novas condições ou esvazia se não houver
  setIsListModalConditions(conditions.length ? conditions : []);
};




const colorsCards = (status: any) => {
  switch (status) {
    case 'Vencido':
      return 'rgba(255, 0, 0, 0.3)';  // Vermelho com 30% de opacidade
    case 'Em processo':
      return 'rgba(0, 255, 255, 0.3)';  // Ciano com 30% de opacidade
    case 'Irregular':
      return 'rgba(255, 165, 0, 0.3)';  // Laranja com 30% de opacidade
    case 'Emitido':
      return 'rgba(0, 255, 0, 0.3)';  // Verde com 30% de opacidade
    case 'Não Aplicavél':
      return 'rgba(255, 238, 0, 0.6)'
    default:
      return 'rgba(169, 169, 169, 0.3)';  // Cor padrão (cinza claro) com 30% de opacidade
  }
};

const totalDocumentos = tableQueryResult?.data?.data?.reduce((total, filial) => {
  return total + (filial.documentos?.length || 0);
}, 0);


  useEffect(() => {
    // Verificar se todas as condições são verdadeiras
    const allTrue =
      conditionsStatus &&
      Object.values(conditionsStatus).every((cond) => cond.status === true);

    // Desmarcar o checkbox se todas as condições forem verdadeiras
    if (allTrue && isChecked) {
      setIsChecked(false);
      form.setFieldsValue({ d_flag_stts: null }); // Atualizar o valor no formulário
    }
  }, [conditionsStatus, isChecked, form]);


  const ordemSituacao = ["Emitido", "Em processo", "Irregular", "Não iniciado", "Vencido", "Não Aplicavél"];

  return (
    <>
      <List canCreate={false} headerButtons={<RefreshButton  hideText shape="circle" onClick={()=>tableQueryResult.refetch()} loading={tableQueryResult.isFetching}/>} >
      <Space align="baseline" wrap size={'small'}>
            <Card
                
                size="small" 
                hoverable 
                title={<p style={{fontSize: 13}}>Documento cadastrados</p>} 
                bordered={false} 
                style={{ width: 200, textAlign: 'center' }}  
                styles={{ body: { background: '#009cde', marginBottom: 10, padding: 2  } }}
                extra={[
                  <div>
                    <Button size="small" shape="circle" style={{border: 0}} icon={<FilterOutlined />} />
                  </div>
                  ]}
            >
                {loading ? (<Skeleton active paragraph={false} />) : <h4 style={{ fontSize: 20 }}>{totalDocumentos}</h4>}
            </Card>

            {tableQueryResult.isLoading ? (
                // Renderiza 3 Skeletons de placeholder
                Array(6).fill(null).map((_, index) => (
                    <Card
                     
                        size="small" 
                        hoverable 
                        title={<Skeleton.Input style={{ width: 100 }} active />} 
                        bordered={false} 
                        key={index} 
                        style={{ width: 200, textAlign: 'center' }} 
                        styles={{ body: { marginBottom: 10 } }}
                    >
                        <Skeleton loading={tableQueryResult?.isLoading} active paragraph={false} />
                    </Card>
                ))
            ) : (
              situacaoCount && Object.entries(situacaoCount).length > 0 ? (
                  Object.entries(situacaoCount)
                      .sort(([a], [b]) => ordemSituacao.indexOf(a) - ordemSituacao.indexOf(b)) // Ordenação correta
                      .map(([situacao, count]) => (
                          <Card
                              className="hover-card" 
                              size="small" 
                              hoverable 
                              title={situacao} 
                              bordered={false} 
                              style={{ width: 170, textAlign: 'center' }} 
                              key={situacao} 
                              styles={{ body: { background: colorsCards(situacao), marginBottom: 10, padding: 2 } }}
                              extra={[
                                  <span style={{ fontSize: 13 }}>
                                      {(count / Object.values(situacaoCount).reduce((a, b) => a + b, 0) * 100).toFixed()}%
                                  </span>
                              ]}
                          >   
                              <span>
                                  <h4 style={{ fontSize: 20 }}>{count}</h4> 
                              </span>
                          </Card>
                      ))
              ) : (
                    <p>Nenhuma situação encontrada.</p>
                )
            )}
      </Space>
          <Table  
              {...tableProps}
              tableLayout="auto" 
              rowKey="id" 
              columns={columns} 
              size="small" 
              sticky 
              scroll={{y: 600 }} 
              bordered={true}
              loading={tableQueryResult.isFetching}
          />
      </List>

      <Modal 
        open={isModal} 
        onCancel={() => {
          form.resetFields(); 
          setIsModal(false); 
          setSubList(false); 
          setIsListModalConditions([]); 
          setTabCond(true); 
          setIsChecked(false)
        }}
        okButtonProps={saveButtonProps}
        footer={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            
            {Object.entries(conditionsStatus || {}).filter(([key, value]) => value?.status === false).length > 0 ? 
              
            (
              <>
                <Checkbox 
                checked={isChecked}
                onChange={(e) => {
                  setIsChecked(e.target.checked)
                  form.setFieldsValue({d_flag_stts: e.target.checked ? 'Irregular' : null})
                  
                }
                
              } disabled={isCheckedNA}>
                Irregular
              </Checkbox>

              <Checkbox 
              checked={isCheckedNA}
              onChange={(e) => {
                setIsCheckedNA(e.target.checked)
                form.setFieldsValue({d_flag_stts: e.target.checked ? 'Não Aplicavél' : null})
                
              }
            } disabled={isChecked}>
              Não Aplicavel
            </Checkbox>  
              
              </>
            ) : null
            }
            <div>
              <Button style={{ marginRight: "10px" }} onClick={() => {
                form.resetFields(); 
                setIsModal(false); 
                setSubList(false); 
                setIsListModalConditions([]); 
                setTabCond(true); 
                setIsChecked(false)
                }}>Cancelar</Button>
              <Button
                type="primary" 
                loading={formLoading}
                onClick={() => form.submit()}

              >
                Salvar
              </Button>
            </div>
          </div>
        }
        >
        <Form
          layout="vertical"
          style={{ width: '100%' }}
          form={form}
          {...formProps}
          disabled={formLoading}
        
        >

          <Tabs defaultActiveKey="1">
            <TabPane tab={[' Cadastro de Documento ']} icon={<FolderAddOutlined />} key="1">
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                
                  <Form.Item name="d_filial_id">
                    <Input value={islistModal?.f_id} hidden/>
                    <span>Filial: <a>{islistModal?.f_nome}</a></span>
                  </Form.Item>
                </Col>
                <Form.Item name="d_num_protocolo" hidden={tabCond}>
                  <Input placeholder="Nº Protocolo" />
                </Form.Item>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Tipo de Documento" name="d_tipo_doc_id">
                    <Select
                      options={listaTipoDocumentos}
                      onChange={(value, option) => hendleCondicionante(value, option)}
                      menuItemSelectedIcon={<CheckCircleOutlined/>}
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item label="Orgão Exp." name="d_orgao_exp" initialValue={"orgão"} hidden>
                    <Input placeholder="Orgão Exp" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                  <Col xs={24} sm={12} hidden={tabCond}>
                    <Form.Item label="Data Protocolo" name="d_data_pedido">
                      <DatePicker placeholder="00/00/0000" disabled={tabCond} format={'DD/MM/YYYY'} draggable />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} hidden={tabCond}>
                    <Form.Item label="Data Emissão" name="d_data_emissao">
                      <DatePicker placeholder="00/00/0000"  disabled={tabCond} format={'DD/MM/YYYY'} draggable />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} hidden={tabCond}>
                    <Form.Item label="Data Vencimento" name="d_data_vencimento">
                      <DatePicker placeholder="00/00/0000" disabled={tabCond} format={'DD/MM/YYYY'} draggable />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} hidden={tabCond}>
                    <Form.Item label="Situação" name="d_situacao" initialValue={'Emitido'}>
                      <Tag >Emitido</Tag>
                    </Form.Item>
                  </Col>
              </Row>
            </TabPane>
            {tabCond ? (
             <TabPane tab={[" Condicionante"]} icon={<ExceptionOutlined />} key="2">
                <Row gutter={16}>

                  <Col xs={24} sm={12}>

                    <Form.Item label="Condicionante" name="dc_id">
                      <Select options={listarCondicionantes} onChange={(value, option) => {handleCondicoes(value, option); verifyConditionsSys(value)}} />

                    </Form.Item>

                    <Tag
                      onClick={hedleSubList}
                      style={{ cursor: 'pointer', borderRadius: 50 }}
                      hidden={islistModalConditions.length < 1 ? true : false} color='purple-inverse' > {subList ? (<UpCircleOutlined />) : (<DownCircleOutlined />)} {islistModalConditions.length}
                    </Tag>

                  </Col>
                </Row>
                  {
                    subList ? (
                    <>
                    
                    <Table 
                    size="small" 
                    dataSource={islistModalConditions} 
                    loading={!islistModalConditions}
                  >
                    <Table.Column 
                      title="Condição" 
                      render={(_, record) => (
                        <>
                          {record}
                        </>
                      )}
                    />

                  <Table.Column 
                    title="Status Condição" 
                    align="center"  
                    render={(_, record: any) => {
                      const condition = conditionsStatus[record];
                      
                      // Define o ícone e a cor com base no status
                      const Icon = condition?.status === true 
                        ? CheckCircleOutlined 
                        : condition?.status === false 
                          ? CloseCircleOutlined 
                          : ExclamationCircleOutlined;

                      const iconColor = condition?.status === true 
                        ? 'green' 
                        : condition?.status === false 
                          ? 'red' 
                          : 'orange';

                      return (
                        <Icon
                          style={{ color: iconColor, cursor: 'pointer' }}
                          onClick={() => handleConditionCheck(record)} // Atualiza o status ao clicar
                        />
                      );
                    }} 
                  />

                  </Table>


                    </>

                    ) : null
                  }
                    <Form.Item hidden name="d_condicoes">
                     <Input/>

                   </Form.Item>
                   <Form.Item hidden name="d_flag_stts">
                     <Input/>

                   </Form.Item>
             </TabPane>
            ) : ''}

          </Tabs>
        </Form>
      </Modal>
    </>
  );
};