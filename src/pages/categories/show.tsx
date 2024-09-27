import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, IssuesCloseOutlined } from "@ant-design/icons"
import { DateField, EditButton, RefreshButton, Show } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import { List, Card, Row, Col, Modal, Popover, Spin, DatePicker, Input, Space } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../authProvider";

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

  const { data: result, isLoading: car, refetch: asas } = useList<ICondition>({
    resource: 'document-condition',
    meta: { endpoint: `listar-documento-condicionante/${isModalIdCondition}` },
    liveMode: 'auto',
  });

  useEffect(() => {
    // Quando os dados de condições forem recebidos, inicialize o estado conditions
    if (result?.data?.dc_condicoes) {
      setConditions(result.data.dc_condicoes);
    }
  }, [result]);

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

  const openModal = async() => {
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

  return (
    <Show title={[<><span>{status}</span></>]} canEdit={false} canDelete={false} headerButtons={<RefreshButton onClick={() => atualiza()} />}>
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
        okButtonProps={{ disabled: checkCondicionante, onClick: () => { setCheckCondicionante(true); } }}
        cancelButtonProps={{ hidden: true }}
        footer={Object.entries(conditions || {}).filter(([key, value]) => value?.status === false).length >= 1 ? null :(<Space><Input placeholder="Nº Protocolo" /><DatePicker placeholder="Data Protocolo" locale='pt-BR' format={'DD/MM/YYYY'}/></Space> )}
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
    </Show>
  );
};
