import { MoneyCollectFilled } from "@ant-design/icons"
import { AttachMoneyOutlined, Money } from "@mui/icons-material"
import { Col, DatePicker, Form, Input, Modal, Row, Select, Table } from "antd"


export const ModalCash = ({
    open, 
    close
    }) =>{
        
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
                tipo: 'Serviço  ',
                desc: 'Pagamento taxa 2',
                custo: 1200,
                dataEntrada: '11-07-2024',
                dataVencimento: '11-08-2024',

            },
            {
                id: 8,
                tipo: 'Serviço  ',
                desc: 'Pagamento taxa 2',
                custo: 1200,
                dataEntrada: '11-07-2024',
                dataVencimento: '11-08-2024',

            },
            {
                id: 9,
                tipo: 'Serviço  ',
                desc: 'Pagamento taxa 2',
                custo: 1200,
                dataEntrada: '11-07-2024',
                dataVencimento: '11-08-2024',

            },
            {
                id: 10,
                tipo: 'Serviço  ',
                desc: 'Pagamento taxa 2',
                custo: 1200,
                dataEntrada: '11-07-2024',
                dataVencimento: '11-08-2024',

            },
            {
                id: 11,
                tipo: 'Serviço  ',
                desc: 'Pagamento taxa 2',
                custo: 1200,
                dataEntrada: '11-07-2024',
                dataVencimento: '11-08-2024',

            }
        ]


        return (
        <Modal open={open} onCancel={close} title='Valores do documento'>
            <Form layout="vertical">
                    <Form.Item label="Tipo">
                        <Select options={[{label: 'Taxa', value: 'Taxa'}, {label: 'Serviço', value: 'Serviço'}]}/>
                    </Form.Item>
                <Row gutter={16}>
                    <Col xs={24} sm={12}>


                    <Form.Item label="Descrição Custo" name="d_tipo_doc_id">
                        <Input placeholder="Desc. Custo" />
                    </Form.Item>
                    </Col>
                    
                    <Col xs={24} sm={12}>
                    <Form.Item label="Valor" name="d_orgao_exp">
                        <Input type="number" placeholder="Valor R$" />
                    </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                    <Form.Item label="Data Entrada">
                         <DatePicker placeholder="Entrada" format="DD/MM/YYYY"/>
                    </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                    <Form.Item label="Data Vencimento">
                         <DatePicker placeholder="Vencimento" format="DD/MM/YYYY"/>
                    </Form.Item>
                    </Col>
                </Row>

            </Form>
            <Table size="small" footer={()=> (<div style={{ textAlign: 'end', paddingRight: 20 }}>
  <span style={{ fontSize: '10px', display: 'block' }}>Total</span>
  <p style={{ fontSize: '11px', margin: 0 }}>
    R$ {data.reduce((acc, d) => acc + d.custo, 0).toFixed(2)}
  </p>
</div>
)} tableLayout="auto" scroll={{x: 10, y: 200}} bordered sticky={true} dataSource={data.map(d=>d)}>
                    <Table.Column title={<span style={{fontSize: '10px'}}>Tipo</span>} align="center"  dataIndex="tipo" render={(_, data)=>(<p style={{fontSize: '10px'}}>{data?.tipo}</p>)}/>
                    <Table.Column title={<span style={{fontSize: '10px'}}>Desc</span>} dataIndex="desc" render={(_, data)=>(<p style={{fontSize: '10px'}}>{data?.desc}</p>)}/>
                    <Table.Column title={<span style={{fontSize: '10px'}}>Entrada</span>} align="center" dataIndex="entrada" render={(_, data)=>(<p style={{fontSize: '10px'}}>{data?.dataEntrada}</p>) }/>
                    <Table.Column title={<span style={{fontSize: '10px'}}>Vencimento</span>} align="center" dataIndex="vencimento" render={(_, data)=>(<p style={{fontSize: '10px'}}>{data?.dataVencimento}</p>) }/>
                    <Table.Column title={<span style={{fontSize: '10px'}}>Custo</span>} align="center" dataIndex="custo" render={(_, data)=>(<p style={{fontSize: '10px'}}>R$ {data?.custo}</p>) }/>
                </Table>
        </Modal>    
    )

}