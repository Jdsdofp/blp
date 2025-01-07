import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import logoSys from '../../public/logo_Sys.png';
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../authProvider';
import { Button, Spin } from 'antd';
import { HelpOutlined, Report, ReportOffOutlined, ReportRounded, ReportSharp } from '@mui/icons-material';
import { FilePdfOutlined } from '@ant-design/icons';


const getColor = (status: any) => {
  switch (status) {
    case 'Vencido':
      return 'red';
    case 'Em processo':
      return 'cyan';
    case 'Irregular':
      return 'orange';
    case 'Emitido':
      return 'green';
    default:
      return '#d9d8d7';
  }
};

const formatDate = (isoDate) => {
  if (!isoDate) return "N/A";
  try {
    // Cria o objeto Date ajustado ao fuso horário local
    const date = new Date(isoDate + "T00:00:00");
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    
    const day = String(localDate.getDate()).padStart(2, "0");
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const year = localDate.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Erro ao formatar a data:", error);
    return isoDate; // Retorna o valor original caso falhe
  }
};




const MyDocument = ({data}) => {

  console.log(
    Object.entries(data?.dc_condicoes || {})
    .map(([key, value])=>(key))
  )

  return(
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Titulo relatorio */}
          <Text style={styles.tituloRel}>
              Relatório Status Global
          </Text>
          
          <View style={styles.headerPage}>  
            <Image src={logoSys} style={styles.logo}/>

            <View style={styles.boxHeader}>
                
                {/* View infos filial */}
                <View style={styles.infsFilial}>
                    <Text style={{fontSize: 10}}>Loja: {data?.filiais?.f_codigo} - {data?.filiais?.f_nome}</Text>
                    <Text style={{fontSize: 10}}>Cidade: {data?.filiais?.f_cidade} - {data?.filiais?.f_uf}</Text>
                </View>
                
                
                
                {/* View de infos tipo */}
                <View style={styles.infsTipo}>
                  <Text style={{fontSize: 10}}>Tipo: {data?.tipo_documento?.td_desc} - </Text>
                  <Text style={{fontSize: 9, color: data?.d_situacao == 'Emitido' ? '#fff' : '#111', backgroundColor: getColor(data?.d_situacao), paddingLeft: 4, paddingRight: 4, borderRadius: 15}}>{data?.d_situacao}</Text>
                </View>
                
                {/* View infos docs */}
                <View style={styles.infsDocs}>
                  <Text style={{fontSize: 9}}>Protocolo: {data?.d_num_protocolo}</Text>
                 <View style={{padding: 3, border: '1px dashad #1479BD', borderStyle: 'dashed', borderRadius: 5}}>
                  <Text style={{fontSize: 9}}>Data Pedido: {data?.d_data_pedido === '1970-01-01' ?  null : formatDate(data?.d_data_pedido)}</Text>
                  <Text style={{fontSize: 9}}>Data Emissão: {data?.d_data_emissao === '1970-01-01' ? null : formatDate(data?.d_data_emissao)}</Text>
                  <Text style={{fontSize: 9}}>Data Vencimento: {data?.d_data_vencimento === '1970-01-01' ? null : formatDate(data?.d_data_vencimento)}</Text>
                 </View>
                  
                </View>
                
            </View>

            <View style={styles.boxHeaderR}>
                {data?.d_data_pedido === "1970-01-01" ? null : (
                  <Text style={{fontSize: 9, paddingTop: 3, marginRight: 5}}>Lead Time: 
                    {data?.d_data_emissao !== "1970-01-01" ? ' Este processo durou'  : ' há dias'} {
                      (() => {
                        const datePedido = new Date(data?.d_data_pedido);
                        const dateEmissao =
                          data?.d_data_emissao === "1970-01-01"
                            ? new Date() // Usa a data atual se d_data_emissao for inválida
                            : new Date(data?.d_data_emissao);

                        // Cálculo da diferença em milissegundos e conversão para dias completos
                        const differenceInTime = dateEmissao - datePedido;
                        const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

                        return differenceInDays;
                      })()
                    } <Text style={{ marginLeft: 5, fontSize: 9}}> Dias</Text>
                  </Text>)}
                  
                  <Text style={{fontSize: 9}}>
                    Total Condições: {Object.keys(data?.dc_condicoes).length}
                  </Text>

                  <Text style={{fontSize: 9}}>
                    Autor: {data?.usuario?.u_nome}
                  </Text>
                  
            </View>
          
          </View>

          <View style={styles.bodyPage}>
          <View style={{ margin: 4, display: 'flex', flexDirection: 'column' }}>
          {/* Cabeçalho das colunas */}
          <View style={{ display: 'flex', flexDirection: 'row', padding: 4, borderBottom: '1px solid #ccc' }}>
            <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 10 }}>Item</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 10, marginLeft: 30 }}>Data Início</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 10 }}>Data Final</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 10 }}>Status</Text>
          </View>

          {/* Dados dinâmicos */}
          {Object.entries(data?.dc_condicoes || {}).map(([key, value]) => (
            <View
              key={key}
              style={{
                padding: 4,
                margin: 4,
                display: 'flex',
                flexDirection: 'row',
                borderBottom: '1px solid #eee',
              }}
            >
              <Text style={{ flex: 1, fontSize: 7 }}>{key}</Text>
              <Text style={{ flex: 1, fontSize: 7, marginLeft: 30 }}> {formatDate(value?.dateCreate)}</Text>
              <Text style={{ flex: 1, fontSize: 7 }}>{value?.date === null ? '' : formatDate(value?.date)}</Text>
              <Text style={{ flex: 1, fontSize: 7 }}>
                {value?.status
                  ? 'Conforme'
                  : value?.status == null
                  ? 'N/A'
                  : 'Pendente'}
              </Text>
            </View>
          ))}
        </View>

          </View>

        
        
        </Page>
      </Document>
   )
};

const styles = StyleSheet.create({
  page: { paddingLeft: 10, paddingRight: 10, paddingTop: 5  },
  tituloRel: {
    textAlign: 'center',
    padding: 2,
    color: '#1479bd',
    fontSize: '15px'
  },
  headerPage: {
    margin: 0, 
    padding: 0, 
    border: '1px solid #c2c2c2',
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row'
  },
  logo: {
    width: 80, 
    height: 30, 
    padding: 5
  },

  boxHeader: {
    padding: 2,
    alignContent: 'center'
  },
  infsFilial: {
    paddingLeft: 5
  },
  infsTipo: {
    paddingLeft: 5,
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'stretch'
  },
  infsDocs: {
    paddingLeft: 5,
    width: '135px',
    display: 'flex',
    flexDirection: 'column'
  },
  boxHeaderR: {
    paddingLeft: 5,
    display: 'flex',
    flexDirection: 'column'
  },
  bodyPage: {
    height: '84%', 
    borderRadius: 10, 
    marginTop: 5, 
    border: '1px solid #c2c2c2'
  }

});


const GeneratePDF = ({ id }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);


  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/document-condition/report-listar-doc-cond/${id}`); // Substitua pela sua rota da API
      setData(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button type='dashed' size='small' shape='round' onClick={fetchData} disabled={loading}>
        {loading ? (<Spin size='small' tip/>) : (<FilePdfOutlined />)}
      </Button>
      {data && (
        <PDFDownloadLink document={<MyDocument data={data} />} fileName={`Report (${data?.tipo_documento?.td_desc})_${data?.d_id}.pdf`}>
          {({ loading: pdfLoading }) => (pdfLoading ? "Preparando documento..." : (<Button type='link'>Baixar</Button>))}
        </PDFDownloadLink>
      )}
    </div>
  );
};

export default GeneratePDF;
