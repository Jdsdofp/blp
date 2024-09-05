import {
  List,
  useTable
} from "@refinedev/antd";
import { Table, TableProps, Popover, Tag, Badge } from "antd";
import StoreIcon from '@mui/icons-material/Store';
import { useNavigate } from "react-router-dom";

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
const navigate = useNavigate()
  const { tableProps } = useTable({resource: 'document', meta: {endpoint: 'listar-documentos-filais'},
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

     const handleTagClick = (status: any, f_id: any) => {{
      navigate(`/document/show/?status=${status}&filialId=${f_id}`);
      }};

        return (
          <>
            {Object.keys(statusCount).map((status) => (
              <Tag
                style={{cursor: 'pointer'}} 
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
    }
    
    

  ]

  return (
    <List>
      <Table {...tableProps} rowKey="id" columns={columns} size="small" />
    </List>
  );
};
