import {
  List,
  useTable,
} from "@refinedev/antd";
import { Table, TableProps, Popover, Tag } from "antd";
import StoreIcon from '@mui/icons-material/Store';

interface IDocuments {
        f_id: number;
        f_nome: string;
        f_cnpj: number;
        f_cidade: string;
        f_uf: string;
        f_ativo: boolean;
        f_endereco: [];
        f_codigo: number;
}


const formatCNPJ = (cnpj: any) => {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
};

export const DocumentList = () => {

  const { tableProps } = useTable({resource: 'branch', meta: {endpoint: 'listar-filiais'},
    syncWithLocation: true,
  });


  const columns: TableProps<IDocuments>['columns'] = [
    {
      key: 'filiais',
      title: 'Sitação Imovel',
      width: '7%',
      align: 'center',
      render: (_, record)=>(
        <>
          <Popover title={ record.f_ativo ? (<Tag color="success" style={{width: '100%'}}>Ativa</Tag>) : (<Tag color="error" style={{width: '100%'}}>Desativada</Tag>) } 
            arrowContent>
              <StoreIcon color={record.f_ativo ? 'success' : 'error'} fontSize="small" style={{cursor: 'pointer'}}/>
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
      render: (_, {f_codigo})=>(
          <a style={{fontSize: '12px'}}>#{f_codigo}</a>
      )
    },

    {
      key: 'filiais',
      title: 'Filial',
      render: (_, record)=>(
        record.f_nome
      )
    },

    {
      key: 'filiais',
      title: 'CNPJ',
      render: (_, record)=>(
        formatCNPJ(record.f_cnpj)
      )
    },

    {
      key: 'filiais',
      title: 'Cidade',
      render: (_, record)=>(
        record.f_cidade
      )
    },

    {
      key: 'filiais',
      title: 'UF',
      render: (_, record)=>(
        record.f_uf
      )
    },

    {
      key: 'status',
      title: 'Status',
      render: (_,record)=>(
        <>
          <Tag color="red-inverse">Vencido 1</Tag>
          <Tag color="cyan">Em processo 1</Tag>
          <Tag color="green">Emitido 1</Tag>
          <Tag color="orange">Não iniciado 1</Tag>
        </>
      )
    }

  ]



  
  return (
    <List>
      <Table {...tableProps} rowKey="id" columns={columns} size="small" />
    </List>
  );
};
