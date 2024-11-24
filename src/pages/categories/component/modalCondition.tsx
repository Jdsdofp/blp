import React, {useEffect, useState} from "react";
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, IssuesCloseOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Check, Close } from "@mui/icons-material";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Button, Card, Checkbox, DatePicker, Input, List, Modal, Popover, Space, Spin, Tag } from "antd";


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
    handlerDataOneData
}) =>{
    
  const [dataApi, setDataApi] = useState<any>()
  const [stateProtocolo, setStateProtocolo] = useState<boolean>()
  const hasProtocol = numberProtocol?.d_num_protocolo;
  
  

  useEffect(() => {
    if(hasProtocol){
      setStateProtocolo(false);
    } else {
      setStateProtocolo(true);
    }
     // Atualiza apenas com base no número de protocolo
  }, [hasProtocol]); // O useEffect dispara apenas quando d_num_protocolo muda
  

  console.log('Data multi', dataApi)
  

  return (


        <Modal  
          open={isModal}
          onCancel={() => { hendleCloseModalConditions(); setCheckCondicionante(true); setNumProtocolo('')}}
          okButtonProps={{ disabled: checkCondicionante, onClick: () => { setCheckCondicionante(true); setNumProtocolo('')}}}
          cancelButtonProps={{ hidden: true }}
          footer={[Object.entries(conditions || {}).filter(([key, value]) => value?.status === false).length >= 1 ? null : (
            
              <Space>
                 <Tag color='purple-inverse' style={{ fontSize: 10, borderRadius: 20 }}>{result?.data?.status}</Tag>
                 
                  {dataOneDoc?.d_situacao == 'Não iniciado' ? (
                      <>
                        <DatePicker placeholder="Data Protocolo" name="d_data" locale='pt-BR' format={'DD/MM/YYYY'} allowClear  style={{borderRadius: 20}} onChange={(date) => setDataProtocolo(date)} value={dataProtocolo}/>
                        <Button type="primary" onClick={()=>{handleCloseProcss(result?.data?.dc_id)}} shape="round" icon={<Check fontSize="inherit"/>} >Fechar</Button>
                      </>
                  ) : (
                      <>
                      {dataOneDoc?.d_situacao == 'Vencido' ? null : dataOneDoc?.d_situacao == 'Emitido' ? null : (<>
                        <Input placeholder="Nº Protocolo" allowClear  style={{borderRadius: 20}} onChange={(e)=>setNumProtocolo(e.target.value)} value={numProtocolo} disabled={dataOneDoc?.d_num_protocolo > 0 ? true : false}/>
                       
                        
                        <DatePicker placeholder="Emissão" locale='pt-BR' format={'DD/MM/YYYY'} allowClear  style={{borderRadius: 20}} onChange={(date)=>setDataEmissao(date)} value={dataEmissao} disabled={dataOneDoc?.d_num_protocolo > 0 ? false : true}/>
                        <DatePicker placeholder="Vencimento" locale='pt-BR' format={'DD/MM/YYYY'} allowClear  style={{borderRadius: 20}} onChange={(date)=>setDataVencimento(date)} value={dataVencimento} disabled={dataOneDoc?.d_num_protocolo > 0 ? false : true} />
                        <Button type="primary" onClick={()=>{handleCloseAllProcss(result?.data?.dc_id); setNumProtocolo('')}} shape="round" icon={<Check fontSize="inherit"/>} >{stateProtocolo ? 'Fechar' : 'Finalizar' }</Button>
                      </>)}
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
                                      style={{ color: value?.users?.includes(userTK) && value?.statusProcesso ==  docStatusId ? 'red' : 'gray  ', cursor: 'pointer' }}
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
                {data?.data.map((d)=>d?.d_situacao)[0] == 'Vencido' ? null : data?.data.map((d)=>d?.d_situacao)[0] == 'Emitido' ? null : (<>
                        <Button type="dashed" style={{marginTop: 10, fontSize: 12}} onClick={()=>setIsMdAddCond(true)}><PlusCircleOutlined /> Adicionar Itens</Button>
                </>)}
          </Card>
      </Modal>
    )
}