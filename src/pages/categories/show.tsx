  import { CheckCircleOutlined, IssuesCloseOutlined } from "@ant-design/icons";
import { color } from "@mui/system";
import { EditButton, Show, TextField, useForm } from "@refinedev/antd";
  import { useList, useShow } from "@refinedev/core";
  import { List, Typography, Card, Row, Col, Modal, Table } from "antd";
import { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";

  const { Title } = Typography;

  export const DocumentShow = () => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");
    const filialId = queryParams.get("filialId");
    const [isModal, setIsModal] = useState<boolean>(false)
    const [isModalIdCondition, setIsModalIdCondition] = useState<any>()

    

    const { data, isInitialLoading, isLoading } = useList({
      resource: 'document',
      meta: { endpoint: `listar-documentos-status-filial/${status}/${filialId}` },
      liveMode: 'auto'
    });


    const { data: re} = useList({
      resource: 'document-condition',
      meta:{endpoint: `/listar-documento-condicionante/${isModalIdCondition}`}
    })

    console.log(re?.data.dc_condicoes)

    const record = data?.data;

    const hendleOpenModalConditions = (id: any) =>{
      setIsModalIdCondition(id) 
       setIsModal(true)
        
    }

    const hendleCloseModalConditions = () =>{
      setIsModal(false)
    }



    return (
      <Show>
        <List
          loading={isInitialLoading}
          dataSource={record}
          
          renderItem={item => (
            <>
              

            <Row gutter={16} align={"top"}>
            <Col span={8}>
            <Card
                loading={isLoading}
                size="small"
                title={[(<h3>{item.tipo_documentos.td_desc}</h3>)]}
                style={{ width: 300, margin: '16px', color: item.d_situacao == 'Vencido' ? 'red' : 'Highlight'}}
                bordered
                cover
                hoverable
                extra={<span id={item.d_condicionante_id} onClick={()=>hendleOpenModalConditions(item.d_condicionante_id)}>{item.d_condicionante_id && <IssuesCloseOutlined style={{color: 'cadetblue', fontSize: 20, cursor: 'pointer'}} />}</span>}
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

        <Modal open={isModal} onCancel={hendleCloseModalConditions} okButtonProps={{hidden: true}} cancelButtonProps={{hidden: true}}>
        <Table size="small" dataSource={re?.data}>
                      <Table.Column title='Condição' render={(_, record) => (
                        <>
                          {record}
                        </>
                      )
                      } />
                    </Table>
        </Modal>
      </Show>



    );
  };