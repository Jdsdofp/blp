import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Show, useForm } from "@refinedev/antd";
import { useList, useMutation, useUpdate } from "@refinedev/core"; // Importar useMutation
import { List, Card, Row, Col, Modal, Popover, Spin, Form } from "antd";
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
  const [conditions, setConditions] = useState<{ [key: string]: { status: boolean | null; date: Date | null } }>({});

  // Carregar a lista de documentos
  const { data, isInitialLoading, isLoading, refetch } = useList({
    resource: 'document',
    meta: { endpoint: `listar-documentos-status-filial/${status}/${filialId}` },
    liveMode: 'auto',
  });

  // Carregar as condições específicas de um documento
  const { data: result, isLoading: car } = useList<ICondition>( {
    resource: 'document-condition',
    meta: { endpoint: `/listar-documento-condicionante/${isModalIdCondition}` },
    liveMode: 'auto',
    enabled: !!isModalIdCondition,  // Somente buscar os dados se o ID for definido
  });

  // Configurar o formulário para editar as condições
  const { formProps, form } = useForm<ICondition>({
    action: 'edit',
  });

  const { mutate } = useUpdate({
    id: isModalIdCondition,  // O ID da condicionante que você está atualizando
    meta: { 
        variables: { // Enviar a rota correta para o backend
            endpoint: `fechar-condicionante`,
            pat: 'document-condition',
        },
    },
    successNotification: () => ({
        message: "Condição atualizada com sucesso",
        description: `A condição do documento foi atualizada.`,
        type: "success",
    }),
    errorNotification: () => ({
        message: "Erro na atualização",
        description: "Ocorreu um erro ao tentar atualizar o documento.",
        type: "error",
    }),
});


  // Sincronizar as condições no estado e no formulário quando `result` mudar
  useEffect(() => {
    if (result?.data?.dc_condicoes) {
      setConditions(result.data.dc_condicoes);
      form.setFieldsValue({ dc_condicoes: result.data.dc_condicoes });
    }
  }, [result, form]);

  // Alternar o status de uma condição
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
          date: new Date(), // Atualiza a data para o momento da alteração
        },
      };
    });
    setCheckCondicionante(false); // Ativa o botão OK após alteração
  };

  // Submeter o formulário com as condições atualizadas
  // Submeter o formulário com as condições atualizadas
  const handleSubmit = async () => {
    try {
        // Atualizar o campo no formulário com o estado de conditions
        form.setFieldsValue({
            dc_condicoes: conditions // Atualiza o formulário com as condições modificadas
        });

        // Executar a mutação para atualizar a condição
        await mutate({ 
            id: isModalIdCondition,  // O ID da condição que você está alterando
            values: {
                dc_condicoes: conditions // Enviar o novo estado das condições
            },
        });
        
        refetch(); // Recarrega os dados após a atualização bem-sucedida
        setIsModal(false); // Fecha o modal
        setCheckCondicionante(true); // Reseta o estado do botão OK
    } catch (error) {
        console.error("Erro ao submeter o formulário:", error);
    }
};



  // Abrir o modal e carregar as condições
  const handleOpenModalConditions = (id: any) => {
    setIsModalIdCondition(id); // Define o ID para carregar as condições
    setIsModal(true); // Abre o modal
  };

  // Fechar o modal
  const handleCloseModalConditions = () => {
    setIsModal(false);
    setCheckCondicionante(true);
  };

  return (
    <Show title={<span>{status}</span>} canEdit={false} canDelete={false}>
      <List
        loading={isInitialLoading || isLoading}
        dataSource={data?.data}
        renderItem={item => (
          <Row gutter={16} align={"top"}>
            <Col span={8}>
              <Card
                loading={isLoading}
                size="small"
                title={<h3>{item.tipo_documentos.td_desc}</h3>}
                style={{ width: 300, margin: '16px', color: item.d_situacao === 'Vencido' ? 'red' : 'Highlight' }}
                bordered
                hoverable
                extra={
                  <ExclamationCircleOutlined
                    style={{ color: '#ebc334', fontSize: 19, cursor: 'pointer' }}
                    onClick={() => handleOpenModalConditions(item.d_condicionante_id)}
                  />
                }
              >
                <p>Filial: {item.filiais.f_nome}</p>
                <p>Status: {item.d_situacao}</p>
                <p>Descrição: {item.tipo_documentos.td_desc}</p>
              </Card>
            </Col>
          </Row>
        )}
      />

<Modal
    open={isModal}
    onCancel={handleCloseModalConditions}
    onOk={handleSubmit} // Ação ao clicar no botão "OK"
    okButtonProps={{ disabled: checkCondicionante }} // Desabilitar o botão OK se não houver mudanças
    cancelButtonProps={{ hidden: true }}
>   <Form {...formProps}>
      <Card title="Condicionante" size="small">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <h4>Condição</h4>
              <h4>Status</h4>
          </div>

          <div style={{ maxHeight: '300px', overflowY: 'auto', padding: 5, borderTop: '1px solid #575757' }}>
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
                                                  onClick={() => toggleCondition(key)}
                                                  style={{ color: 'green', cursor: 'pointer' }}
                                              />
                                          </Popover>
                                      ) : value.status === false ? (
                                          <Popover content={`Pendente - ${new Date(value.date).toLocaleString()}`}>
                                              <ExclamationCircleOutlined
                                                  onClick={() => toggleCondition(key)}
                                                  style={{ color: 'orange', cursor: 'pointer' }}
                                              />
                                          </Popover>
                                      ) : (
                                          <Popover content={`N/A - ${new Date(value.date).toLocaleString()}`}>
                                              <CloseCircleOutlined
                                                  onClick={() => toggleCondition(key)}
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

  </Form>
</Modal>

    </Show>
  );
};


