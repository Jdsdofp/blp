import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, IssuesCloseOutlined } from "@ant-design/icons"
import { EditButton, RefreshButton, Show, useForm } from "@refinedev/antd";
import { useList,  } from "@refinedev/core";
import { List, Card, Row, Col, Modal, Popover, Spin } from "antd";
import { useEffect, useState } from "react";


interface ICondition {
  dc_id: number;
  dc_condicoes: { [key: string]: { status: boolean | null; date: Date | null } };
}

export const DocumentShow = () => {
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const filialId = queryParams.get("filialId");
  const [isModal, setIsModal] = useState<boolean>(false);
  const [isModalIdCondition, setIsModalIdCondition] = useState<any>();
  const [checkCondicionante, setCheckCondicionante] = useState<boolean>(true);

  const [conditions, setConditions] = useState<{ [key: string]: boolean | null }>({});

  const { data, isInitialLoading, isLoading, refetch } = useList({
    resource: 'document',
    meta: { endpoint: `listar-documentos-status-filial/${status}/${filialId}` },
    liveMode: 'auto',
  });

  const { data: result, isLoading: car } = useList<ICondition>({
    resource: 'document-condition',
    meta: { endpoint: `/listar-documento-condicionante/${isModalIdCondition}` },
    liveMode: 'auto',
  });

  
  const {formProps, form} = useForm<ICondition>({action: 'edit', resource: `document-condition/fechar-condicionante/${result?.data.dc_id}`})

  console.log(form.getFieldsValue())

  useEffect(() => {
    // Quando os dados de condições forem recebidos, inicialize o estado conditions
    if (result?.data?.dc_condicoes) {
      setConditions(result.data.dc_condicoes);
    }
  }, [result]);

  
  
  const toggleCondition = (key: string) => {
    setConditions((prevConditions) => {
      const currentValue = prevConditions[key].status;
      let newValue;
  
      if (currentValue === true) {
        newValue = false;
      } else if (currentValue === false) {
        newValue = null;
      } else {
        newValue = true;
      }
  
      return {
        ...prevConditions,
        [key]: { 
          status: newValue,
          date: new Date()  // Atualiza a data para o momento da alteração
        },
      };
    });
  };
  

  const openModal = () => {
    setIsModal(true);
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

  const atualiza = async () =>{
      await refetch()
  }
  
  const handleSubmit = async () => {
    form.setFieldsValue({
      conditions: conditions // Aqui você passa o estado `conditions` atualizado
    });
  
    await form.submit(); // Submete o formulário
  };
  

  return (
    <Show title={[<><span>{status}</span></>]} canEdit={false} canDelete={false} headerButtons={<RefreshButton onClick={()=>atualiza()}/>}>
      <List
        loading={isInitialLoading || isLoading}
        dataSource={data?.data}
        renderItem={item => (
          <>
            <Row gutter={16} align={"top"}>
              <Col span={8}>
                <Card
                  loading={isLoading}
                  size="small"
                  title={<><h3>{item.tipo_documentos.td_desc}</h3></>}
                  style={{ width: 300, margin: '16px', color: item.d_situacao === 'Vencido' ? 'red' : 'Highlight' }}
                  bordered
                  cover
                  hoverable
                  extra={<span id={item.d_condicionante_id} onClick={() => { openModal(); hendleOpenModalConditions(item.d_condicionante_id); }}>{item.d_condicionante_id && <IssuesCloseOutlined style={{ color: '#ebc334', fontSize: 19, cursor: 'pointer' }} />}</span>}
                  actions={[<span><EditButton hideText shape="circle" size="small" /></span>]}
                >
                  <p>Filial: {item.filiais.f_nome}</p>
                  <p>Status: {item.d_situacao}</p>
                  <p>Descrição: {item.tipo_documentos.td_desc}</p>
                </Card>
              </Col>
            </Row>
          </>
        )}
      />

      <Modal
        open={isModal}
        onCancel={() => { hendleCloseModalConditions(); setCheckCondicionante(true); }}
        okButtonProps={{ disabled: checkCondicionante, onClick: () => {setCheckCondicionante(true); handleSubmit} }}
        cancelButtonProps={{ hidden: true }}
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
                          {value.status === true ? (
                            <Popover content={`OK - ${new Date(value.date).toLocaleString()}`}>
                              <CheckCircleOutlined 
                                onClick={() => { toggleCondition(key); hendleCheck(); }} 
                                style={{ color: 'green', cursor: 'pointer' }} 
                              />
                            </Popover>
                          ) : value.status === false ? (
                            <Popover content={`Pendente - ${new Date(value.date).toLocaleString()}`}>
                              <ExclamationCircleOutlined 
                                onClick={() => { toggleCondition(key); hendleCheck(); }} 
                                style={{ color: 'orange', cursor: 'pointer' }} 
                              />
                            </Popover>
                          ) : (
                            <Popover content={`N/A - ${new Date(value.date).toLocaleString()}`}>
                              <CloseCircleOutlined 
                                onClick={() => { toggleCondition(key); hendleCheck(); }} 
                                style={{ color: 'red', cursor: 'pointer' }} 
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
    </Show>
  );
};
