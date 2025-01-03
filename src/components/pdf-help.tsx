import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image, Tspan } from '@react-pdf/renderer';
import logoSys from '../../public/logo_Sys.png';


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
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

  

const MyDocument = ({data}) => (


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
              <Text style={{fontSize: 10}}>Tipo: {data?.tipo_documentos?.td_desc} - </Text>
              <Text style={{fontSize: 9, color: data?.d_situacao == 'Emitido' ? '#fff' : '#111', backgroundColor: getColor(data?.d_situacao), paddingLeft: 4, paddingRight: 4, borderRadius: 15}}>{data?.d_situacao}</Text>
            </View>
            
            {/* View infos docs */}
            <View style={styles.infsDocs}>
              <Text style={{fontSize: 9}}>Protocolo: {data?.d_num_protocolo}</Text>
              <Text style={{fontSize: 9}}>Data Pedido: {data?.d_data_pedido === '1970-01-01' ?  null : formatDate(data?.d_data_pedido)}</Text>
              <Text style={{fontSize: 9}}>Data Emissão: {data?.d_data_emissao === '1970-01-01' ? null : formatDate(data?.d_data_emissao)}</Text>
              <Text style={{fontSize: 9}}>Data Vencimento: {data?.d_data_vencimento === '1970-01-01' ? null : formatDate(data?.d_data_vencimento)}</Text>
              
            </View>
            
        </View>

        <View style={styles.boxHeaderR}>
            {data?.d_data_pedido === "1970-01-01" ? null : (
              <Text style={{fontSize: 9, paddingTop: 3, marginRight: 5}}>Time: 
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
                Autor: {data?.usuario?.u_nome}
              </Text>
              
        </View>
      
      </View>

      <View style={styles.bodyPage}>
      

      </View>
    
    
    </Page>
  </Document>
);

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
    display: 'flex',
    flexDirection: 'column'
  },
  boxHeaderR: {
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
const GeneratePDF = ({data}) => (
  <div>
    <PDFDownloadLink document={<MyDocument data={data} />} fileName="example.pdf">
      {({ loading }) => (loading ? "Loading document..." : "Download PDF")}
    </PDFDownloadLink>
  </div>
);

export default GeneratePDF;
