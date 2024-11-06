import { MoneyCollectFilled } from "@ant-design/icons"
import { AttachMoneyOutlined, Money } from "@mui/icons-material"
import { Col, DatePicker, Form, Input, Modal, Row, Select, Table } from "antd"


export const ModalCash = ({
    open, 
    close
    }) =>{
    
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
            <Table size="small" bordered sticky={true}>
                <Table.Column title={<span style={{fontSize: '10px'}}>Desc</span>} align="center" />
                <Table.Column title={<span style={{fontSize: '10px'}}>Custo</span>} align="center"/>
            </Table>
        </Modal>    
    )

}