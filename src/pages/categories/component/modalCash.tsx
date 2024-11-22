import { Col, DatePicker, Form, Input, Modal, Row, Select, Spin, Table } from "antd";
import axios from "axios";
import { API_URL } from "../../../authProvider";

export const ModalCash = ({ open, close, dataOneDoc, listDebit, listDebits }) => {

  const [form] = Form.useForm()

  const handlerCreateBebit = async (d_id: number) =>{
    try {
      const values = await form.validateFields()
      
      const payload = {
        dd_descricao: values?.dd_descricao,
        dd_valor: values?.dd_valor,
        dd_data_entrada: values?.dd_data_entrada,
        dd_data_vencimento: values?.dd_data_vencimento,
        dd_tipo: values?.d_tipo_doc_id,
        d_num_ref: values?.d_num_ref
    }

      const response = await axios.post(`${API_URL}/debit/registrar-custo/${d_id}`, payload)
      console.log(response)
    } catch (error) {
      console.log('Erro de cadastro de custo', error)
    }
  }


  
  const data = [
    {
      id: 1,
      tipo: 'Taxa',
      desc: 'Pagamento taxa 1',
      custo: 12.56,
      dataEntrada: '11-07-2024',
      dataVencimento: '11-08-2024',
    },
    {
      id: 2,
      tipo: 'Taxa',
      desc: 'Pagamento taxa 2',
      custo: 55.98,
      dataEntrada: '11-07-2024',
      dataVencimento: '11-08-2024',
    },
    {
      id: 3,
      tipo: 'Taxa',
      desc: 'Pagamento taxa 2',
      custo: 150.66,
      dataEntrada: '11-07-2024',
      dataVencimento: '11-08-2024',
    },
    {
      id: 4,
      tipo: 'Taxa',
      desc: 'Pagamento taxa 2',
      custo: 1200,
      dataEntrada: '11-07-2024',
      dataVencimento: '11-08-2024',
    },
    {
      id: 5,
      tipo: 'Taxa',
      desc: 'Pagamento taxa 2',
      custo: 1200,
      dataEntrada: '11-07-2024',
      dataVencimento: '11-08-2024',
    },
    {
      id: 6,
      tipo: 'Serviço',
      desc: 'Pagamento taxa 2',
      custo: 1200,
      dataEntrada: '11-07-2024',
      dataVencimento: '11-08-2024',
    },
    {
      id: 7,
      tipo: 'Serviço',
      desc: 'Pagamento taxa 2',
      custo: 1200,
      dataEntrada: '11-07-2024',
      dataVencimento: '11-08-2024',
    },
    {
      id: 8,
      tipo: 'Serviço',
      desc: 'Pagamento taxa 2',
      custo: 1200,
      dataEntrada: '11-07-2024',
      dataVencimento: '11-08-2024',
    },
    {
      id: 9,
      tipo: 'Serviço',
      desc: 'Pagamento taxa 2',
      custo: 1200,
      dataEntrada: '11-07-2024',
      dataVencimento: '11-08-2024',
    },
    {
      id: 10,
      tipo: 'Serviço',
      desc: 'Pagamento taxa 2',
      custo: 1200,
      dataEntrada: '11-07-2024',
      dataVencimento: '11-08-2024',
    },
    {
      id: 11,
      tipo: 'Serviço',
      desc: 'Pagamento taxa 2',
      custo: 1200,
      dataEntrada: '11-07-2024',
      dataVencimento: '11-08-2024',
    }
  ];


  // Calculando os totais por tipo
  const totalsByType = listDebit.reduce((acc, d) => {
    if (!acc[d.tipo]) {
      acc[d.tipo] = 0;
    }
    acc[d.tipo] += d.custo;
    return acc;
  }, {});

  return (
    <Modal open={open} onCancel={close} okButtonProps={{onClick: async ()=>{await handlerCreateBebit(dataOneDoc?.d_id); await listDebits(dataOneDoc?.d_id)}}} title={['Valores Documento ', dataOneDoc?.filiais ? `[ ${dataOneDoc?.filiais?.f_codigo} - ${dataOneDoc?.filiais?.f_nome} ]` : (<><Spin/></>) ]}>
      
      <Form layout="vertical" form={form}>

        <Form.Item label="Tipo" name="d_tipo_doc_id">
          <Select options={[{ label: 'Taxa', value: 'Taxa' }, { label: 'Serviço', value: 'Serviço' }]} />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="Descrição Custo" name="dd_descricao">
              <Input placeholder="Desc. Custo" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label="Titulo/NF" name="d_num_ref">
              <Input type="number" placeholder="0000000" />
            </Form.Item>
          </Col>    

          <Col xs={24} sm={12}>
            <Form.Item label="Valor" name="dd_valor">
              <Input type="number" placeholder="Valor R$" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label="Data Entrada" name="dd_data_entrada">
              <DatePicker placeholder="Entrada" format="DD/MM/YYYY" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label="Data Vencimento" name="dd_data_vencimento">
              <DatePicker placeholder="Vencimento" format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        size="small"
        footer={() => (
            <div style={{ paddingRight: 20, marginTop: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '10px' }}>
              <div>
                <span>Total Serviço: </span><br/>
                <span>R$ {totalsByType['Serviço']?.toFixed(2) || '0.00'}</span>
              </div>
              <div>
                <span>Total Taxa: </span><br/>
                <span>R$ {totalsByType['Taxa']?.toFixed(2) || '0.00'}</span>
              </div>
              <div>
                <span>Total Geral: </span><br/>
                <span>R$ {listDebit.reduce((acc, d) => acc + d.custo, 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
        )}
        tableLayout="auto"
        scroll={{ x: 10, y: 200 }}
        bordered
        sticky={true}
        dataSource={listDebit}
      >
        <Table.Column title={<span style={{ fontSize: '10px' }}>Tipo</span>} align="center" dataIndex="tipo" render={(_, listDebit) => (<p style={{ fontSize: '10px' }}>{listDebit?.dd_tipo}</p>)} />
        <Table.Column title={<span style={{ fontSize: '10px' }}>Desc</span>} dataIndex="desc" render={(_, listDebit) => (<p style={{ fontSize: '10px' }}>{listDebit?.dd_descricao}</p>)} />
        <Table.Column title={<span style={{ fontSize: '10px' }}>Entrada</span>} align="center" dataIndex="entrada" render={(_, listDebit) => (<p style={{ fontSize: '10px' }}>{listDebit?.dd_data_entrada}</p>)} />
        <Table.Column title={<span style={{ fontSize: '10px' }}>Vencimento</span>} align="center" dataIndex="vencimento" render={(_, listDebit) => (<p style={{ fontSize: '10px' }}>{listDebit?.dd_data_vencimento}</p>)} />
        <Table.Column title={<span style={{ fontSize: '10px' }}>Custo</span>} align="center" dataIndex="custo" render={(_, listDebit) => (<p style={{ fontSize: '10px' }}>R$ {listDebit?.dd_valor}</p>)} />
      </Table>
    </Modal>
  );
};
