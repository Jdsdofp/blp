import {
  List,
  useForm,
  useTable
} from "@refinedev/antd";
import { Table, TableProps, Popover, Tag, Badge, Modal, Button, Tabs, Row, Col, Form, Select, Input, DatePicker } from "antd";
import StoreIcon from '@mui/icons-material/Store';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {  CreateNewFolder } from "@mui/icons-material";
import TabPane from "antd/lib/tabs/TabPane";
import { CheckCircleOutlined, DownCircleOutlined, ExceptionOutlined, FolderAddOutlined, UpCircleOutlined } from "@ant-design/icons";
import { useList } from "@refinedev/core";

interface IDocuments {
  f_id: number;
  f_nome: string;
  f_cnpj: number;
  f_cidade: string;
  f_uf: string;
  f_ativo: boolean;
  documentos: [];
  f_codigo: number;

}



const formatCNPJ = (cnpj: any) => {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
};



export const DocumentList = () => {
  const [isModal, setIsModal] = useState(false)
  const [islistModal, setIsListModal] = useState([])
  const [islistModalConditions, setIsListModalConditions] = useState([])
  const [tabCond, setTabCond] = useState(false)
  const [subList, setSubList] = useState(false)
  const navigate = useNavigate()

  interface IDocument {
    d_filial_id: number;
    d_data_pedido: Date;
    d_data_emissao: Date;
    d_data_vencimento: Date;
    d_tipo_doc_id: number;
    d_orgao_exp: string;
    d_anexo: string;
    d_num_protocolo: string;
    d_sitaucao: string;
    d_condicoes: ...islistModalConditions;
  }

  const { data: listTypeDocument } = useList({ resource: 'type-document', meta: { endpoint: 'listar-tipo-documentos' }, liveMode: 'auto' });
  const { data: condtionsResult } = useList({ resource: 'condition', meta: { endpoint: 'listar-condicionantes' } });

  const {formProps, form, saveButtonProps} = useForm<IDocument>({
    resource: 'documentCreate', 
    action: 'create',
    successNotification(data, values, resource) {
      return{
        type: 'success',
        message: data?.data
      }
    },

    errorNotification(error, values, resource) {
      return{
        type: 'error',
        message: error?.response.data.error
      }
    },
  })

  const listaTipoDocumentos = listTypeDocument?.data.map((tpd) => ({
    label: tpd.td_desc,
    value: tpd.td_id,
    ...tpd
  }))

  const listarCondicionantes = condtionsResult?.data.map((cond) => ({
    label: cond.c_tipo,
    value: cond.c_id,
    ...cond
  }))




  const { tableProps } = useTable({
    resource: 'document', meta: { endpoint: 'listar-documentos-filais' },
    syncWithLocation: true,
  });


  const columns: TableProps<IDocuments>['columns'] = [
    {
      key: 'filiais',
      title: 'Sitação Imovel',
      width: '7%',
      align: 'center',
      render: (_, record) => (
        <>
          <Popover title={record.f_ativo ? (<Tag color="success" style={{ width: '100%' }}>Ativa</Tag>) : (<Tag color="error" style={{ width: '100%' }}>Desativada</Tag>)}
            arrowContent>
            <StoreIcon color={record.f_ativo ? 'success' : 'error'} fontSize="small" style={{ cursor: 'pointer' }} />
          </Popover>

        </>
      )
    },

    {
      key: 'd_id',
      title: 'Nº Loja',
      align: 'center',
      width: '6%',
      sorter: (a, b) => a.f_codigo - b.f_codigo,
      render: (_, { f_codigo }) => (
        <a style={{ fontSize: '12px' }}>#{f_codigo}</a>
      )
    },

    {
      key: 'filiais',
      title: 'Filial',
      render: (_, record) => (
        record.f_nome
      )
    },

    {
      key: 'filiais',
      title: 'CNPJ',
      render: (_, record) => (
        formatCNPJ(record.f_cnpj)
      )
    },

    {
      key: 'filiais',
      title: 'Cidade',
      render: (_, record) => (
        record.f_cidade
      )
    },

    {
      key: 'filiais',
      title: 'UF',
      render: (_, record) => (
        record.f_uf
      )
    },

    {
      key: 'documentos',
      title: 'Status',
      render: (_, { documentos, f_id }: any) => {

        const statusCount = documentos.reduce((acc: any, d: any) => {
          if (acc[d.d_situacao]) {
            acc[d.d_situacao].count += 1;
          } else {
            acc[d.d_situacao] = { count: 1 };
          }
          return acc;
        }, {});


        const getColor = (status: any) => {
          switch (status) {
            case 'Vencido':
              return 'red-inverse';
            case 'Em processo':
              return 'cyan';
            case 'Não iniciado':
              return 'orange';
            case 'Emitido':
              return 'green';
            default:
              return 'default';
          }
        };

        const handleTagClick = (status: any, f_id: any) => {
          {
            navigate(`/document/show/?status=${status}&filialId=${f_id}`);
          }
        };

        return (
          <>
            {Object.keys(statusCount).map((status) => (
              <Tag
                style={{ cursor: 'pointer' }}
                color={getColor(status)}
                key={status}
                onClick={() => handleTagClick(status, f_id)}
              >
                <Badge count={statusCount[status].count} size="small" color={getColor(status)}>
                  {status}
                </Badge>
              </Tag>
            ))}
          </>
        );
      }
    },

    {
      key: 'actions',
      title: 'Novo Documento',
      render: (_, record) => (
        <Button icon={<CreateNewFolder color={islistModal?.f_id === record.f_id ? "inherit" : "warning"} fontSize="inherit" />} shape="circle" onClick={() => hendleModal(record)} />
      )
    }

  ]

  const hendleModal = (record: any) => {

    if (record) {
      setIsModal(true)

      //console.log(record)
      setIsListModal(record)
    } else {
      setIsListModal([])

    }
  }

  const hendleCondicionante = (value, option) => {
    setTabCond(option.td_requer_condicao)
  }

  const hendleCondicoes = (value, option) => {
    setIsListModalConditions(option.c_condicao)
  }

  const hedleSubList = () => {
    if (!subList) {
      setSubList(true)
    } else {
      setSubList(false)
    }
  }


  return (
    <>
      <List>
        <Table {...tableProps} rowKey="id" columns={columns} size="small" />
      </List>

      <Modal open={isModal} onCancel={() => setIsModal(false)} okButtonProps={saveButtonProps}>
        <Form
          layout="vertical"
          style={{ width: '100%' }}
          form={form}
          {...formProps}
          
        >

          <Tabs defaultActiveKey="1">
            <TabPane tab={[' Cadastro de Documento ']} icon={<FolderAddOutlined />} key="1">
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name="d_filial_id" initialValue={islistModal.f_id} >
                    <span>Filial: <a>{islistModal.f_nome}</a></span>
                  </Form.Item>
                </Col>
                <Form.Item name="d_num_protocolo" hidden={tabCond}>
                  <Input placeholder="Nº Documento" />
                </Form.Item>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Tipo de Documento" name="d_tipo_doc_id">
                    <Select
                      options={listaTipoDocumentos}
                      onChange={(value, option) => hendleCondicionante(value, option)}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item label="Orgão Exp." name="d_orgao_exp">
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
                      <Select options={listarCondicionantes} onChange={(value, option) => hendleCondicoes(value, option)} />
                    </Form.Item>

                    <Tag
                      onClick={hedleSubList}
                      style={{ cursor: 'pointer', borderRadius: 50 }}
                      hidden={islistModalConditions.length < 1 ? true : false} color='cyan' > {subList ? (<UpCircleOutlined />) : (<DownCircleOutlined />)} {islistModalConditions.length}
                    </Tag>

                  </Col>
                </Row>
                {
                  subList ? (
                    <Table size="small" dataSource={islistModalConditions} loading={islistModalConditions ? false : true}>
                      <Table.Column key="d_condicoes" dataIndex="d_condicoes" title='Condição' render={(_, record) => (
                        <>
                          {record}
                        </>
                      )
                      } />

                      <Table.Column title={'Status Condição'} align="center" render={(_, record) => (<><CheckCircleOutlined style={{ color: 'greenyellow' }} /></>)} />
                    </Table>


                  ) : null
                }
             </TabPane>
            ) : ''}

          </Tabs>
        </Form>
      </Modal>
    </>
  );
};
