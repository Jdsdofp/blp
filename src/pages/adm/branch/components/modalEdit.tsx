import { BranchesOutlined, ClearOutlined } from "@ant-design/icons"
import { AddLocation } from "@mui/icons-material"
import { Badge, Col, Form, Input, message, Modal, Row, Select, Tabs } from "antd"
import TabPane from "antd/es/tabs/TabPane"
import axios from "axios";
import { useEffect, useState } from "react";
import InputMask from 'react-input-mask';
import { API_URL } from "../../../../authProvider";
import { useNotifications } from "../../../../contexts/NotificationsContext";





export const ModalEditBranch = ({
    isModalEditBranch,
    isDataEdit,
    hadleCancelModalEdit,
    companiesOptions,
    handleUfChange,
    unidades,
    municipios,
    consultarCEP,
    endereco,
    refreshTable
  }) => {

    const { notifications, loading, fetchNotifications, markAsRead } = useNotifications();
    
      useEffect(() => {
        fetchNotifications();
      }, [fetchNotifications]);

    const [form] = Form.useForm();
    const [ messageApi, contextHolder ]= message.useMessage()
    useEffect(() => {
      if (isDataEdit) {
       form.setFieldsValue({
          f_empresa_id: isDataEdit.f_empresa_id,
          f_nome: isDataEdit.f_nome,
          f_codigo: isDataEdit.f_codigo,
          f_cnpj: isDataEdit.f_cnpj,
          f_insc_municipal: isDataEdit.f_insc_municipal,
          f_insc_estadual: isDataEdit.f_insc_estadual,
          f_uf: isDataEdit.f_uf,
          f_cidade: isDataEdit.f_cidade,
          f_endereco_bairro: isDataEdit.f_endereco[0]?.f_endereco_bairro || "",
          f_latitude: isDataEdit.f_location?.coordinates[1] || "",
          f_longitude: isDataEdit.f_location?.coordinates[0] || "",
          f_endereco_complemento: endereco?.f_endereco_complemento || "",
        });
      }
    }, [isDataEdit, form, endereco]);
    
    const handleEditBranch = async (f_id: number) =>{
      console.log('callback id: ', f_id)
      console.log('Data payload: ', form.getFieldsValue())
      const payload = form.getFieldsValue() 
      try {
        const response = await axios.put(`${API_URL}/branch/editar-filial/${f_id}`, payload)
        await refreshTable.refetch()
        await fetchNotifications()
        messageApi.success(response?.data?.message)
      } catch (error) {
        messageApi.error(error?.response.data.message)
        console.error('Log de erro: ', error)
      }
    }


    return (
      <Modal
        title={`Editar Filial - (${isDataEdit?.f_nome})`}
        open={isModalEditBranch}
        onCancel={hadleCancelModalEdit}
        okButtonProps={{onClick: async ()=>{ await handleEditBranch(isDataEdit?.f_id) }}}
        centered
      >
        <Form layout="vertical" style={{ width: "100%" }} form={form}>
          <Tabs defaultActiveKey="1">
            <TabPane tab={"Editar Filial"} key="1">
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Empresa"
                    name="f_empresa_id"
                    rules={[{ required: true, message: "Empresa Obrigatória" }]}
                  >
                    <Select options={companiesOptions} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Nome"
                    name="f_nome"
                    rules={[
                      { required: true, type: "string", message: "Nome é obrigatório" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Código" name="f_codigo">
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="CNPJ"
                    name="f_cnpj"
                    rules={[{ required: true, message: "CNPJ é obrigatório" }]}
                  >
                    <InputMask mask="99.999.999/9999-99">
                      {(inputProps) => (
                        <Input {...inputProps} placeholder="00.000.000/0000-00" />
                      )}
                    </InputMask>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Insc. Municipal" name="f_insc_municipal">
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Insc. Estadual" name="f_insc_estadual">
                    <Input type="number" />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Endereço" key="2">
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="UF"
                    name="f_uf"
                    rules={[{ required: true, message: "UF é obrigatória" }]}
                  >
                    <Select showSearch allowClear onChange={handleUfChange} options={unidades} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Cidade"
                    name="f_cidade"
                    rules={[{ required: true, message: "Cidade é obrigatória" }]}
                  >
                    <Select showSearch allowClear>
                      {municipios.map((municipio) => (
                        <Select.Option key={municipio.codigo} value={municipio.nome}>
                          {municipio.nome}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="CEP" name="f_cep">
                    <Input onBlur={(e) => consultarCEP(e.target.value)} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Bairro" name="f_endereco_bairro">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Complemento" name="f_endereco_complemento">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Latitude" name="f_latitude">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Longitude" name="f_longitude">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Form>
        {contextHolder}
      </Modal>
    );
  };