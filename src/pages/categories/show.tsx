  import { CheckCircleOutlined, CloseCircleOutlined, IssuesCloseOutlined } from "@ant-design/icons"
import { EditButton, Show, ShowButton, TextField, useForm } from "@refinedev/antd";
  import { useList, useShow } from "@refinedev/core";
  import { List, Typography, Card, Row, Col, Modal, Table, TableProps, Popover } from "antd";
import { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";

  const { Title } = Typography;


  interface ICondition {
    dc_id: number;
    dc_condicoes: { [key: string]: boolean }; // Mapeamento de condições
  }

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


    const { data: result} = useList<ICondition>({
      resource: 'document-condition',
      meta:{endpoint: `/listar-documento-condicionante/${isModalIdCondition}`}
    })

    

    const record = data?.data;

    
    const openModal = () =>{
      setIsModal(true)
    }

    const hendleOpenModalConditions = (id: any) =>{
      setIsModalIdCondition(id) 
    }


    const hendleCloseModalConditions = () =>{
      setIsModal(false)
    }

    return (
      <Show title={[<><span>{status}</span></>]} canEdit={false} canDelete={false}>
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
                  title={[(<><h3>{item.tipo_documentos.td_desc}</h3></>)]}
                  style={{ width: 300, margin: '16px', color: item.d_situacao == 'Vencido' ? 'red' : 'Highlight'}}
                  bordered
                  cover
                  hoverable
                  extra={<span id={item.d_condicionante_id} onClick={()=>{openModal(); hendleOpenModalConditions(item.d_condicionante_id)}}>{item.d_condicionante_id && <IssuesCloseOutlined style={{ color: '#ebc334', fontSize: 19, cursor: 'pointer' }} />}</span>}
                  actions={[
                    <span><EditButton hideText shape="circle" size="small"/></span>              
                  ]}
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
        onCancel={hendleCloseModalConditions} 
        okButtonProps={{ hidden: true }} 
        cancelButtonProps={{ hidden: true }}
      >
        <Card
          title={['Condicionante ', <IssuesCloseOutlined style={{color: 'gray'}}/>]}
        >
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Condição</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(result?.data?.dc_condicoes || {}).map(([key, value]) => (
                  <tr key={key} >
                    <td style={{ padding: '2px', borderBottom: '1px solid #8B41F2' }}>
                      <p>{key}</p>
                    </td>
                    <td style={{ borderBottom: '1px solid #8B41F2' }} align="center">
                      {value ? 
                        <CheckCircleOutlined style={{color: 'green'}}/> : 
                        <CloseCircleOutlined style={{color: 'red'}}/>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Modal>


      </Show>



    );
  };