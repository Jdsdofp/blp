import React, {useEffect, useState} from "react";
import { CheckCircleOutlined, CloseCircleOutlined, ConsoleSqlOutlined, ExclamationCircleOutlined, IssuesCloseOutlined, PlusCircleOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { Check, Close, DocumentScanner, DocumentScannerOutlined, PointOfSale, Save, UploadFile } from "@mui/icons-material";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Button, Card, Checkbox, DatePicker, Input, List, Modal, Popover, Upload, Space, Spin, Tag, message, Popconfirm, Form, Switch } from "antd";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import moment from "moment";
import axios from "axios";
import { API_URL } from "../../../authProvider";
import dayjs from "dayjs";


const { Search } = Input;
export const ModalConditions = ({
    isModal,
    hendleCloseModalConditions,
    checkCondicionante,
    setCheckCondicionante,
    numProtocolo,
    setNumProtocolo,
    dataProtocolo,
    setDataProtocolo,
    dataEmissao,
    setDataEmissao,
    dataVencimento,
    setD_flag_vitalicio,
    setDataVencimento,
    handleCloseProcss,
    handleCloseAllProcss,
    conditions,
    car,
    result,
    data,
    toggleCondition,
    hendleCheck,
    users,
    handleUserToggle,
    handleSubmit,
    refreshCondition,
    selectedUserIds,
    isRefetching,
    visiblePopover,
    setVisiblePopover,
    userTK,
    setIsMdAddCond,
    isModalIdCondition,
    contextHolder,
    handleUserListAttr,
    docStatusId,
    numberProtocol,
    dataOneDoc,
    handlerDataOneData,
    getColor,
    loadingCloseAll,
    switchChecked,
    handleSwitchChange,
    loadProcss,
    d_flag_vitalicio
}) =>{
  
  const [messageApi] = message.useMessage()
  const [dataApi, setDataApi] = useState<any>()
  const [stateProtocolo, setStateProtocolo] = useState<boolean>()
  const hasProtocol = numberProtocol?.d_num_protocolo;
  const [file, setFile] = useState(null);
  const [loadFile, setLoadFile] = useState(false);
  const [blockBtn, setBlockBtn] = useState<boolean>()
  
  

  useEffect(() => {
    if(hasProtocol){
      setStateProtocolo(false);
    } else {
      setStateProtocolo(true);
    }
     // Atualiza apenas com base no número de protocolo
  }, [hasProtocol]); // O useEffect dispara apenas quando d_num_protocolo muda
  

  useEffect(()=>{
    const datasValores = dataEmissao?.format('D').length <=1 && dataVencimento?.format('D').length <=1
    
    setBlockBtn(dataEmissao?.format('D').length + dataVencimento?.format('D').length >= 2 ? false : true)
    
    
    //console.log('Valor datasValores: ', datasValores)
  },[dataEmissao, dataVencimento])
  const ignorarBlockBtn = true; // ou false dependendo da lógica

  //console.log('Teste Logico: ', dataEmissao?.format('D').length + dataVencimento?.format('D').length >= 2 ? false : true)
  // Capturar o arquivo selecionado
  const handleFileChange = ({ file }) => {
    setFile(file); // Salva o arquivo real no estado
  };

  
  const handleUpload = async (id, file) => {
    if (!file) {
      console.log("Por favor, selecione um arquivo antes de salvar.");
      return;
    }

    //console.log('Arquivo da handler', file)

    const formData = new FormData();
    formData.append("file", file);
    formData.append("d_id", id);

    try {
      setLoadFile(true)
      const response = await axios.post(`${API_URL}/storage/upload/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setLoadFile(false)
      setFile(null)
      formData.append("")
    } catch (error) {
      console.error("Erro no envio:", error);
    }
  };

  useEffect(() => {
    if (d_flag_vitalicio) {
      setDataVencimento(dayjs()); // Define a data de vencimento como a data atual
    }
  }, [d_flag_vitalicio]);
  
  console.log('Log de teste da flag: ', d_flag_vitalicio)
  
  return (

        <Modal
          styles={{body: {padding: 0, margin: -19}, footer: {marginTop: 30}}}  
          open={isModal}
          onCancel={() => { hendleCloseModalConditions(); setCheckCondicionante(true); setNumProtocolo(''); setFile(null)}}
          okButtonProps={{ disabled: checkCondicionante, onClick: () => { setCheckCondicionante(true); setNumProtocolo('')}}}
          cancelButtonProps={{ hidden: true }}
          footer={[Object.entries(conditions || {}).filter(([key, value]) => value?.status === false).length >= 1 ? null : (
            
            <Space style={{margin: 4}}>
            <Tag color="purple-inverse" style={{ fontSize: 10, borderRadius: 20 }}>
              {result?.data?.status}
            </Tag>
          
            {dataOneDoc?.d_situacao === "Não iniciado" ? (
              
              <>
                {/* Botão para fechar diretamente */}
                {result?.data?.status !== 'Em processo' ? (
                  <>
                    <DatePicker
                    placeholder="Data Protocolo"
                    name="d_data"
                    locale="pt-BR"
                    format="DD/MM/YYYY"
                    allowClear
                    style={{ borderRadius: 20 }}
                    onChange={(date) => setDataProtocolo(date)}
                    value={dataProtocolo}
                    hidden={true}
                  />
                  <Button
                    loading={loadProcss}
                    type="primary"
                    onClick={() => {
                      handleCloseProcss(result?.data?.dc_id);
                      handlerDataOneData(result?.data?.dc_id);
                    }}
                    shape="round"
                    icon={<Check fontSize="inherit" />}
                  >
                    Fechar
                  </Button>
                  
                  </>
                ) : null}
              </>
            ) : (
              <>
                {dataOneDoc?.d_situacao === "Vencido" || dataOneDoc?.d_situacao === "Emitido" ? null : (
                  <>

                    {/* Input para número de protocolo */}
                    
                    <Input
                      placeholder="Nº Protocolo"
                      allowClear
                      style={{ borderRadius: 20 }}
                      onChange={(e) => setNumProtocolo(e.target.value)}
                      value={numProtocolo}
                      hidden={dataOneDoc?.d_num_protocolo?.trim().length > 0}
                    />
          
                    {/* DatePickers para Emissão e Vencimento */}
                    <DatePicker
                      placeholder="Emissão"
                      locale="pt-BR"
                      format="DD/MM/YYYY"
                      allowClear
                      style={{ borderRadius: 20 }}
                      onChange={(date) => setDataEmissao(date)}
                      value={dataEmissao}
                      disabled={dataOneDoc?.d_num_protocolo <= 0}
                    />
                    
                      <DatePicker
                        placeholder="Vencimento"
                        locale="pt-BR"
                        format="DD/MM/YYYY"
                        allowClear
                        style={{ borderRadius: 20 }}
                        onChange={(date) => setDataVencimento(date)}
                        value={dataVencimento}
                        disabled={dataOneDoc?.d_num_protocolo <= 0 || d_flag_vitalicio}
                      />
                      <div style={{position: 'absolute', left: 20, bottom: 1, paddingBottom: 3  }}>
                        <Checkbox disabled={!dataEmissao} onChange={(e)=>setD_flag_vitalicio(e?.target?.checked)}>
                        <span style={{fontSize: 10}}>Vecimento indeterminado ?</span>
                        </Checkbox>
                      </div>
                    
          
                    {/* Botão para finalizar ou enviar */}
                    {file == null ? (
                      <>
                        {dataEmissao || dataVencimento ? (
                          /* Caso datas estejam preenchidas, usa Popconfirm */
                          <Popconfirm
                            title="Tem certeza que deseja finalizar o processo sem o arquivo de anexo?"
                            onConfirm={async () => {
                              await handleCloseAllProcss(result?.data?.dc_id);
                              await handlerDataOneData(result?.data?.dc_id);
                            }}
                            okText="Sim"
                            cancelText="Não"
                          >
                            <Button type="primary" shape="round" icon={<Check fontSize="inherit" />} disabled={blockBtn} loading={loadProcss}>
                              {stateProtocolo ? "Fechar" : "Finalizar"}
                            </Button>
                          </Popconfirm>
                        ) : (
                          /* Caso somente o número do protocolo esteja preenchido */
                          
                          <Button
                            type="primary"
                            shape="round"
                            icon={<Check fontSize="inherit" />}
                            onClick={async () => {
                              await handleCloseAllProcss(result?.data?.dc_id);
                              await handlerDataOneData(result?.data?.dc_id);
                            }}
                            disabled={!ignorarBlockBtn && blockBtn ? true : numProtocolo?.length < 1}
                            loading={loadProcss}
                          >
                            {stateProtocolo ? "Fechar" : "Finalizar"}
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        {/* Finalizar com arquivo */}
                        <Button
                          loading={loadProcss}
                          type="primary"
                          shape="round"
                          icon={<Check fontSize="inherit" />}
                          disabled={blockBtn}
                          onClick={async () => {
                            await handleCloseAllProcss(result?.data?.dc_id);
                            await handlerDataOneData(result?.data?.dc_id);
                            await handleUpload(dataOneDoc?.d_id, file);
                          }}
                        >
                          {stateProtocolo ? "Fechar" : "Finalizar"}
                        </Button>
                        
                        
                      </> 
                    )}
                  </>
                )}
              </>
            )}
            {contextHolder}
          </Space>

          
          )]}
      >
          <Card
              title={['Condicionante ', <IssuesCloseOutlined style={{ color: 'gray' }} />]}
              size="small"
          >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <h4 style={{ margin: 0 }}>Condição</h4>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%' }}>
                <h4 style={{ margin: 0 }}>Tempo Execução</h4>
                <h4 style={{ margin: 0 }}>Status | Atribuir</h4>
              </div>
            </div>


              <div style={{ maxHeight: '300px', overflowY: 'auto', padding: 5, borderTop: '1px solid #575757', scrollbarColor: '#888 #f1f1f1', scrollbarWidth: 'thin' }}>
                  <table style={{ width: '100%' }}>
                    {Object.entries(conditions).length === 0 ? (
                      <Spin style={{padding: 20, position: 'relative', left: 200, height: 100}}  />
                    ) : (
                      <tbody>
                        
                        {Object.entries(conditions || {}).map(([key, value]) => (
                          <tr key={key}>
                            <td style={{ borderBottom: '1px solid #009cde' }}>
                              <p style={{ textTransform: 'capitalize', color: value.status == false && dataOneDoc?.d_situacao == 'Irregular' ? 'red' : null, fontSize: 11 }}>{key} - <Tag color={getColor(value?.statusProcesso)} style={{fontSize: 8, margin: 0, borderRadius: 20}}>{value?.statusProcesso}</Tag></p>
                            </td>
                            <td style={{ borderBottom: '1px solid #009cde', textAlign: 'center', paddingRight: 60 }}>
                              {value?.dateCreate ? (
                                (() => {
                                  // Criar objetos Moment a partir das datas já no formato YYYY-MM-DD
                                  const dateCreate = moment(value.dateCreate, 'YYYY-MM-DD');
                                  const dateFinal = value?.date ? moment(value?.date, 'YYYY-MM-DD') : moment(); // Se não houver dateFinal, usa a data de hoje

                                  // Verifica se as duas datas são do mesmo dia
                                  if (dateCreate.isSame(dateFinal, 'day')) {
                                    return (
                                      <span style={{ fontSize: 12 }}>
                                        0 Dia
                                      </span>
                                    );
                                  }

                                  // Calculando a diferença de dias
                                  const differenceInDays = dateFinal.diff(dateCreate, 'days'); // Calcula a diferença apenas em dias

                                  // Retorna o resultado formatado
                                  return (
                                    <span style={{ fontSize: 12 }}>
                                      {differenceInDays === 0
                                        ? '0 Dia' // Se a diferença for 0, retorna 0 Dia
                                        : `${differenceInDays} ${differenceInDays === 1 ? 'Dia' : 'Dias'}`}
                                    </span>
                                  );
                                })()
                              ) : (
                                <span>N/A</span>
                              )}
                            </td>



                            <td style={{ borderBottom: '1px solid #009cde', paddingRight: 35 }} align="center">
                              {value?.status === true ? (
                                
                                <Popover content={`OK - ${new Date(value?.date).toLocaleString()}`}>
                                  <Button disabled={value?.users?.includes(userTK) && value?.statusProcesso ==  docStatusId ? false : true}  shape="circle" style={{border: 'none', height: '30px'}}>
                                   
                                    <CheckCircleOutlined
                                      
                                      onClick={() => {
                                        
                                        toggleCondition(key);
                                        hendleCheck();
                                      }}
                                      style={{ color: value?.users?.includes(userTK) && value?.statusProcesso ==  docStatusId ? 'green' : 'gray', cursor: 'pointer' }}

                                    />
                                  </Button>
                                </Popover>
                              ) : value?.status === false ? (
                                <Popover content={`Pendente - ${new Date(value?.date).toLocaleString()}`}>
                                  <Button disabled={value?.users?.includes(userTK) && value?.statusProcesso ==  docStatusId ? false : true} shape="circle" style={{border: 'none', height: '30px'}}>
                                    <CloseCircleOutlined
                                      
                                      onClick={() => {
                                        toggleCondition(key);
                                        hendleCheck();
                                      }}
                                      style={{ color: value?.users?.includes(userTK) && value?.statusProcesso ==  docStatusId ? 'red' : 'gray', cursor: 'pointer' }}
                                    />
                                  </Button>
                                </Popover>
                              ) : (
                                <Popover content={`N/A - ${new Date(value?.date).toLocaleString()}`}>
                                  <Button disabled={value?.users?.includes(userTK) && value?.statusProcesso ==  docStatusId ? false : true} shape="circle" style={{border: 'none', height: '30px'}}>
                                      <ExclamationCircleOutlined
                                          
                                            onClick={() => {
                                              toggleCondition(key);
                                              hendleCheck();
                                            }}
                                            style={{ color: value?.users?.includes(userTK) && value?.statusProcesso ==  docStatusId ? 'orange' : 'gray', cursor: 'pointer' }}
                                          />
                                  </Button>
                                </Popover>
                              )}
                            </td>

                            <td style={{ borderBottom: '1px solid #009cde' }} align="center">
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

                                    <List>
                                      {users.map(item => (
                                        <List.Item key={item?.u_id}>
                                          <h5>{item?.u_nome}</h5>
                                          <Checkbox
                                            checked={item?.u_atribuido}
                                            onChange={() => handleUserToggle(item?.u_id)}
                                          />
                                        </List.Item>
                                      ))}
                                    </List>


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
                                 {value?.users?.includes(userTK) && value?.statusProcesso ==  docStatusId ? (<GroupAddIcon fontSize="inherit" onClick={()=>handleUserListAttr(isModalIdCondition, key)} style={{ cursor: 'pointer' }} />) : null }
                              
                              </Popover>
                            </td>
                          </tr>
                          
                        ))}
                      </tbody>
                    )}
                  </table>
                </div>
                  {/* Calcular e exibir o total de dias */}
                  {result?.data?.dc_status_doc_ref == 'Não iniciado' ? (
                      <div style={{ marginTop: '10px', textAlign: 'right' }}>
                      <span>
                        Total de dias: {
                          Object.entries(conditions || {}).reduce((maxDays, [key, value]) => {
                            // Converter a data de criação para o formato 'YYYY-MM-DD'
                            const data_criado_em = new Date(result?.data.dc_criado_em);
                            const formattedDateCreate = data_criado_em.toISOString().split('T')[0];  // 'YYYY-MM-DD'
                              
                            // Obter a data mais recente entre 'date' e a data atual
                            const dateFinal = value?.date ? new Date(value.date) : new Date();
                            const formattedDateFinal = dateFinal.toISOString().split('T')[0];  // 'YYYY-MM-DD'
  
                            // Mostrar as datas formatadas para debug
                            //console.log(`Data de Criação: ${formattedDateCreate}`);
                            //console.log(`Data Final: ${formattedDateFinal}`);
  
                            // Calcular a diferença de dias entre a data criada e a data final
                            const dateCreate = new Date(formattedDateCreate);
                            const dateFinish = new Date(formattedDateFinal);
  
                            const differenceInTime = dateFinish - dateCreate;
                            const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
  
                            // Retorna o maior valor entre o atual e o acumulado
                            return Math.max(maxDays, differenceInDays);
                          }, 0)
                        } <span style={{ marginLeft: 3 }}>Dias</span>
                      </span>
                    </div>
                  ) : null}


                { 
                  data?.data.map((d)=>d?.d_situacao)[0] == 'Vencido' ? null : data?.data.map((d)=>d?.d_situacao)[0] == 'Emitido' ? null : (
                    <>
                    <Space align="end">
                      {dataOneDoc?.d_situacao == 'Irregular' || result?.data?.dc_status_doc_ref == 'Irregular' ? null : (
                      <Button
                        type="dashed"
                        style={{ marginTop: 10, fontSize: 12 }}
                        onClick={() => setIsMdAddCond(true)}
                      >
                        <PlusCircleOutlined /> Adicionar Itens
                      </Button>


                      )}
              
                      {dataOneDoc?.d_num_protocolo?.trim().length > 0  ? (
                        <>
                        {dataOneDoc?.d_situacao == 'Irregular' ? null : (
                          <Upload
                            
                          onChange={handleFileChange} 
                          beforeUpload={() => false}
                          onRemove={() => setFile(null)}
                          fileList={file ? [file] : []}
                          
                        >
                          <Button
                            type="dashed"
                            shape="circle"
                            icon={<UploadOutlined />}
                            disabled={!dataOneDoc?.d_num_protocolo?.trim().length > 0}
                            hidden={dataOneDoc?.d_anexo?.arquivo}
                          />
                        </Upload>
                        )}
                          
                        </>
                      ) : null}
                        {Object.entries(conditions || {}).filter(([key, value]) => value?.status === false).length >= 1 ? (
                          <Popover trigger='click' placement="bottom" content={(<Form.Item><span style={{fontSize: 11}}>Irregular? </span> <Switch size="small" checked={switchChecked} onChange={handleSwitchChange}/></Form.Item>)}>
                              <Button shape="circle" size="small" icon={<MoreVertIcon fontSize="inherit"/>}/>
                         </Popover>
                        ) : null}
                      
                    </Space>
                  </>
                  )
                }
          </Card>
      </Modal>
    )
}