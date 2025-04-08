import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Spin, Table, message } from "antd";
import axios from "axios";
import { API_URL } from "../../../authProvider";
import { useEffect, useState } from "react";
import { DateField, Edit } from "@refinedev/antd";
import { Delete } from "@mui/icons-material";
import { EditFilled } from "@ant-design/icons";

export const ModalCash = ({ open, close, dataOneDoc, listDebits, listDebit, loadingDataDebit, refetch, atualiza }) => {
  const [dataResult, setDataResult] = useState([])
  const [ messageApi, contextHolder ] = message.useMessage();

  const [form] = Form.useForm()

  useEffect(()=>{
    form.resetFields()
  },[close])

  const handlerCreateBebit = async (d_id: number) =>{
    try {
      const values = await form.validateFields();

      // Tratamento do valor antes de enviar
      const valorFormatado = values?.dd_valor
        ?.replace(/[R$\s.]/g, '') // Remove "R$", espaços e pontos de milhar
        ?.replace(',', '.'); // Substitui vírgula decimal por ponto
      
      console.log('Valor M: ', values)

      const payload = {
        dd_descricao: values?.dd_descricao,
        dd_valor: valorFormatado,
        dd_data_entrada: values?.dd_data_entrada,
        dd_data_vencimento: values?.dd_data_vencimento,
        dd_tipo: values?.d_tipo_doc_id,
        d_num_ref: values?.d_num_ref
    }

      const response = await axios.post(`${API_URL}/debit/registrar-custo/${d_id}`, payload)
      
      messageApi.success(response?.data?.message)
      await refetch()
      form.resetFields()

    } catch (error) {
      messageApi.error(error?.response?.data?.message)
    }
  }

  //console.info('State load', loadingDataDebit)
  useEffect(()=>{
    if(listDebit.length >0){
      setDataResult(listDebit)
    }else {
      setDataResult([])
    }
  },[listDebit])


 // Calculando os totais por tipo
const totalsByType = listDebit?.reduce((acc, d) => {
  if (!acc[d.dd_tipo]) {
    acc[d.dd_tipo] = 0;
  }
  acc[d.dd_tipo] += parseFloat(d.dd_valor || 0); // Converte para número antes de somar
  return acc;
}, {});

// Total geral
const totalGeral = listDebit?.reduce((acc, d) => acc + parseFloat(d.dd_valor || 0), 0);


  const [value, setValue] = useState('');

  const formatCurrency = (inputValue) => {
    let valor = inputValue.replace(/\D/g, '');
    
    valor = (Number(valor) / 100).toFixed(2);
    
    // Formatação BRL
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  };

  const handleChange = (e) => {
    const formattedValue = formatCurrency(e.target.value);
    setValue(formattedValue);
  };



  const handlerDeleteDebit = async (id: number) =>{
    try {
      console.log('ID recebido: ', id)

      const response = await axios.delete(`${API_URL}/debit/deletar-debito/${id}`)
      messageApi.success(response?.data?.message)
      await atualiza()

    } catch (error) {
      console.error('Log de Error: ', error)
    }
  }


  return (
    <Modal 
        open={open} 
        onCancel={close} 
        okButtonProps={{ onClick: async () => { 
          await handlerCreateBebit(dataOneDoc?.d_id); 
          await listDebits(dataOneDoc?.d_condicionante_id) 
          } }} title={[`${dataOneDoc?.tipo_documentos?.td_desc} - `, dataOneDoc?.filiais ? `[ ${dataOneDoc?.filiais?.f_codigo} - ${dataOneDoc?.filiais?.f_nome} ]` : (<><Spin /></>)]}
          width="40vw"
        style={{ maxWidth: '1100px', top: 20 }}
    >

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
              <Input
                type="text"
                value={value}
                onChange={(e) => {
                  const formattedValue = formatCurrency(e.target.value);
                  setValue(formattedValue);
                  form.setFieldsValue({ dd_valor: formattedValue }); // Atualiza o valor no form
                }}
                placeholder="R$ 0,00"
                onKeyDown={(e) => {
                  if (!/[0-9]|Backspace|Tab|Delete|ArrowLeft|ArrowRight/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
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
        loading={loadingDataDebit}
        footer={() => (
          <div style={{ paddingRight: 20, marginTop: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '10px' }}>
              <div>
                <span>Total Serviço: </span><br />
                <span>R$ {totalsByType['Serviço']?.toFixed(2) || '0.00'}</span>
              </div>
              <div>
                <span>Total Taxa: </span><br />
                <span>R$ {totalsByType['Taxa']?.toFixed(2) || '0.00'}</span>
              </div>
              <div>
                <span>Total Geral: </span><br />
                <span>R$ {totalGeral.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>


        )}
        tableLayout="auto"
        scroll={{ x: 'max-content', y: 200 }}
        bordered
        sticky={true}
        dataSource={dataResult}
      >
        <Table.Column title={<span style={{ fontSize: '10px' }}>Tipo</span>} align="center" dataIndex="tipo" render={(_, dataResult) => (<p style={{ fontSize: '10px' }}>{dataResult?.dd_tipo || null}</p>)} />
        <Table.Column title={<span style={{ fontSize: '10px' }}>Desc</span>} dataIndex="desc" render={(_, dataResult) => (<p style={{ fontSize: '10px', verticalAlign: 'center' }}>{dataResult?.dd_descricao || null}</p>)} />
        <Table.Column width={60} title={<span style={{ fontSize: '9px' }}>Titulo/NF</span>} dataIndex="desc" render={(_, dataResult) => (<p style={{ fontSize: '10px', verticalAlign: 'center' }}>{dataResult?.d_num_ref || null}</p>)} />
        <Table.Column title={<span style={{ fontSize: '10px' }}>Entrada</span>} align="center" dataIndex="entrada" render={(_, dataResult) => (<DateField style={{ fontSize: '10px' }} value={dataResult?.dd_data_entrada || null} locales="pt-BR" />)} />
        <Table.Column title={<span style={{ fontSize: '10px' }}>Vencimento</span>} align="center" dataIndex="vencimento" render={(_, dataResult) => (<DateField style={{ fontSize: '10px' }} value={dataResult?.dd_data_vencimento || null} locales="pt-BR" />)} />
        <Table.Column title={<span style={{ fontSize: '10px' }}>Custo</span>} align="center" dataIndex="custo" render={(_, dataResult) => (<p style={{ fontSize: '10px' }}>R$ {dataResult?.dd_valor || null}</p>)} />
        <Table.Column title={<span style={{ fontSize: '10px' }}>Usuário</span>} align="center" dataIndex="custo" render={(_, dataResult) => (<p style={{ fontSize: '10px' }}>{dataResult?.dd_usuario || null}</p>)} />
        

   
          
        <Table.Column fixed="right" title={
          <span style={{ fontSize: '10px' }}>Ações</span>} align="center" dataIndex="acao" render={(_, dataResult) => (
          <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>

              {/* DELETE vá com Deus */}
              <Button shape="circle" size="small" icon={<Delete fontSize="inherit" />} onClick={async ()=>{await handlerDeleteDebit(dataResult?.dd_id); await listDebits(dataOneDoc?.d_condicionante_id)  }} />
              
              {/* EDIÇÃO */}
              <Button shape="circle" size="small" icon={<EditFilled size={3} />} onClick={()=>console.log('Editar ', dataResult?.dd_id)} />

          </div>
          )} 
          />
      
      </Table>
      {contextHolder}
    </Modal>
  );
};
