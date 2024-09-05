  import { Show, TextField } from "@refinedev/antd";
  import { useList, useShow } from "@refinedev/core";
  import { List, Typography, Card, Row, Col } from "antd";
  import { useParams } from "react-router-dom";

  const { Title } = Typography;

  export const DocumentShow = () => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");
    const filialId = queryParams.get("filialId");

    const { data } = useList({
      resource: 'document',
      meta: { endpoint: `listar-documentos-status-filial/${status}/${filialId}` }
    });

    const record = data?.data;

    return (
      <Show>
        <List
          
          dataSource={record}
          
          renderItem={item => (
            <>
              

            <Row gutter={16} align={"top"}>
            <Col span={8}>
            <Card
                size="small"
                title={[`${item.d_num_protocolo}`]}
                style={{ width: 300, margin: '16px', color: item.d_situacao == 'Vencido' ? 'red' : 'Highlight'}}
                bordered
                cover
              >
                <p>Status: {item.d_situacao}</p>
                <p>Filial: {item.filiais.f_nome}</p>
                <p>Descrição: {item.tipo_documentos.td_desc}</p>
              </Card>
             </Col>
            </Row>
            
            </>
          )}
        />

      </Show>



    );
  };