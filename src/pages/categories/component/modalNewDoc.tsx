import { CheckCircleOutlined, CloseCircleOutlined, DownCircleOutlined, ExceptionOutlined, ExclamationCircleOutlined, FolderAddOutlined, UpCircleOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select, Table, Tabs, Tag } from "antd";
import TabPane from "antd/es/tabs/TabPane";




export const ModalNewDocs = ({
    isModal,
    form,
    setIsModal,
    setSubList,
    setIsListModalConditions,
    setTabCond,
    setIsChecked,
    saveButtonProps,
    conditionsStatus,
    isChecked,
    isCheckedNA,
    setIsCheckedNA,
    formProps,
    formLoading,
    islistModal,
    listaTipoDocumentos,
    tabCond,
    hendleCondicionante,
    listarCondicionantes,
    handleCondicoes,
    verifyConditionsSys,
    hedleSubList,
    islistModalConditions,
    subList,
    handleConditionCheck

}) => {
    return (
        <Modal
            open={isModal}
            onCancel={() => {
                form.resetFields();
                setIsModal(false);
                setSubList(false);
                setIsListModalConditions([]);
                setTabCond(true);
                setIsChecked(false)
            }}
            okButtonProps={saveButtonProps}
            footer={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                    {Object.entries(conditionsStatus || {}).filter(([key, value]) => value?.status === false).length > 0 ?

                        (
                            <>
                                <Checkbox
                                    checked={isChecked}
                                    onChange={(e) => {
                                        setIsChecked(e.target.checked)
                                        form.setFieldsValue({ d_flag_stts: e.target.checked ? 'Irregular' : null })

                                    }

                                    } disabled={isCheckedNA}>
                                    Irregular
                                </Checkbox>

                                <Checkbox
                                    checked={isCheckedNA}
                                    onChange={(e) => {
                                        setIsCheckedNA(e.target.checked)
                                        form.setFieldsValue({ d_flag_stts: e.target.checked ? 'Não Aplicavél' : null })

                                    }
                                    } disabled={isChecked}>
                                    Não Aplicavel
                                </Checkbox>

                            </>
                        ) : null
                    }
                    <div>
                        <Button style={{ marginRight: "10px" }} onClick={() => {
                            form.resetFields();
                            setIsModal(false);
                            setSubList(false);
                            setIsListModalConditions([]);
                            setTabCond(true);
                            setIsChecked(false)
                        }}>Cancelar</Button>
                        <Button
                            type="primary"
                            loading={formLoading}
                            onClick={() => form.submit()}

                        >
                            Salvar
                        </Button>
                    </div>
                </div>
            }
        >
            <Form
                layout="vertical"
                style={{ width: '100%' }}
                form={form}
                {...formProps}
                disabled={formLoading}

            >

                <Tabs defaultActiveKey="1">
                    <TabPane tab={[' Cadastro de Documento ']} icon={<FolderAddOutlined />} key="1">
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>

                                <Form.Item name="d_filial_id">
                                    <Input value={islistModal?.f_id} hidden />
                                    <span>{islistModal?.f_nome ? 'Filial:' : ''} <a>{islistModal?.f_nome}</a></span>
                                </Form.Item>
                            </Col>
                            <Form.Item name="d_num_protocolo" hidden={tabCond}>
                                <Input placeholder="Nº Protocolo" />
                            </Form.Item>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Tipo de Documento" name="d_tipo_doc_id">
                                    <Select
                                        options={listaTipoDocumentos}
                                        onChange={(value, option) => hendleCondicionante(value, option)}
                                        menuItemSelectedIcon={<CheckCircleOutlined />}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12}>
                                <Form.Item label="Orgão Exp." name="d_orgao_exp" initialValue={"orgão"} hidden>
                                    <Input placeholder="Orgão Exp" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} sm={12} hidden={tabCond}>
                                <Form.Item label="Data Protocolo" name="d_data_pedido">
                                    <DatePicker placeholder="00/00/0000" disabled={tabCond} format={'DD/MM/YYYY'} draggable />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} hidden={tabCond}>
                                <Form.Item label="Data Emissão" name="d_data_emissao">
                                    <DatePicker placeholder="00/00/0000" disabled={tabCond} format={'DD/MM/YYYY'} draggable />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12} hidden={tabCond}>
                                <Form.Item label="Data Vencimento" name="d_data_vencimento">
                                    <DatePicker placeholder="00/00/0000" disabled={tabCond} format={'DD/MM/YYYY'} draggable />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={12} hidden={tabCond}>
                                <Form.Item label="Situação" name="d_situacao" initialValue={'Emitido'}>
                                    <Tag >Emitido</Tag>
                                </Form.Item>
                            </Col>
                        </Row>
                    </TabPane>
                    {tabCond ? (
                        <TabPane tab={[" Condicionante"]} icon={<ExceptionOutlined />} key="2">
                            <Row gutter={16}>

                                <Col xs={24} sm={12}>

                                    <Form.Item label="Condicionante" name="dc_id">
                                        <Select options={listarCondicionantes} onChange={(value, option) => { handleCondicoes(value, option); verifyConditionsSys(value) }} />

                                    </Form.Item>

                                    <Tag
                                        onClick={hedleSubList}
                                        style={{ cursor: 'pointer', borderRadius: 50 }}
                                        hidden={islistModalConditions.length < 1 ? true : false} color='purple-inverse' > {subList ? (<UpCircleOutlined />) : (<DownCircleOutlined />)} {islistModalConditions.length}
                                    </Tag>

                                </Col>
                            </Row>
                            {
                                subList ? (
                                    <>

                                        <Table
                                            size="small"
                                            dataSource={islistModalConditions}
                                            loading={!islistModalConditions}
                                        >
                                            <Table.Column
                                                title="Condição"
                                                render={(_, record) => (
                                                    <>
                                                        {record}
                                                    </>
                                                )}
                                            />

                                            <Table.Column
                                                title="Status Condição"
                                                align="center"
                                                render={(_, record: any) => {
                                                    const condition = conditionsStatus[record];

                                                    // Define o ícone e a cor com base no status
                                                    const Icon = condition?.status === true
                                                        ? CheckCircleOutlined
                                                        : condition?.status === false
                                                            ? CloseCircleOutlined
                                                            : ExclamationCircleOutlined;

                                                    const iconColor = condition?.status === true
                                                        ? 'green'
                                                        : condition?.status === false
                                                            ? 'red'
                                                            : 'orange';

                                                    return (
                                                        <Icon
                                                            style={{ color: iconColor, cursor: 'pointer' }}
                                                            onClick={() => handleConditionCheck(record)} // Atualiza o status ao clicar
                                                        />
                                                    );
                                                }}
                                            />

                                        </Table>


                                    </>

                                ) : null
                            }
                            <Form.Item hidden name="d_condicoes">
                                <Input />

                            </Form.Item>
                            <Form.Item hidden name="d_flag_stts">
                                <Input />

                            </Form.Item>
                        </TabPane>
                    ) : ''}

                </Tabs>
            </Form>
        </Modal>
    )
}