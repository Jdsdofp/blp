import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image, Svg, Circle, Line, Path } from '@react-pdf/renderer';
import logoSys from '../../public/logo_Sys.png';
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../authProvider';
import { Button, Spin } from 'antd';
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


const colorsCards = (status: any) => {
  switch (status) {
    case 'Vencido':
      return 'rgba(255, 0, 0, 0.3)';  // Vermelho com 30% de opacidade
    case 'Em processo':
      return 'rgba(0, 255, 255, 0.3)';  // Ciano com 30% de opacidade
    case 'Irregular':
      return 'rgba(255, 165, 0, 0.3)';  // Laranja com 30% de opacidade
    case 'Emitido':
      return 'rgba(0, 255, 0, 0.3)';  // Verde com 30% de opacidade
    default:
      return 'rgba(169, 169, 169, 0.3)';  // Cor padrão (cinza claro) com 30% de opacidade
  }
};


const formatDate = (isoDate) => {
  if (!isoDate) return "N/A";
  try {
    // Cria o objeto Date ajustado ao fuso horário local
    const date = new Date(isoDate);
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



// Função para calcular ângulos baseados no score
const getAngleFromScore = (score, maxValue) => {
  return (score / maxValue) * 180; // Mapeando o score para 0-180 graus
};

// Função para converter coordenadas polares em cartesianas
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 123) * (Math.PI / 180.0);
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

// Função para desenhar um arco de semicírculo
const SemiCirclePath = (startAngle, endAngle, cx, cy, radius) => {
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return `
    M ${start.x} ${start.y}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
  `;
};

const VelocimetroPDF = ({ score }) => {
  const maxValue = 1000;
  const angle = getAngleFromScore(score, maxValue);

  const radius = 30; // Raio do velocímetro
  const cx = 80; // Centro X
  const cy = 55; // Centro Y

  // Cálculo do ponteiro
  const pointer = polarToCartesian(cx, cy, radius - 10, angle);

  return (
    <View style={{ width: '170px', height: 60}}>
      <Svg style={{padding: 0, margin: 0 }} >
        {/* Fase RUIM (Vermelho) */}
        <Path
          d={SemiCirclePath(-100, 150, cx, cy, radius)} // Ajustado para 0-60 graus
          fill="none"
          stroke="red"
          strokeWidth="15"
        />

        {/* Fase BAIXO (Amarelo) */}
        <Path
          d={SemiCirclePath(-35, 160, cx, cy, radius)} // Ajustado para 60-120 graus
          fill="none"
          stroke="orange"
          strokeWidth="15"
        />

        {/* Fase BOM (Verde) */}
        <Path
          d={SemiCirclePath(49, 180, cx, cy, radius)} // Ajustado para 120-180 graus
          fill="none"
          stroke="green"
          strokeWidth="15"
        />

        {/* Ponteiro */}
        <Line
          x1={cx}
          y1={cy}
          x2={pointer.x}
          y2={pointer.y}
          stroke="#111"
          strokeWidth="2"
        />

        {/* Texto RUIM */}
        <Text x="25" y="56" fontSize="10" fill="red" textAnchor="middle" >
          RUIM
        </Text>

        {/* Texto BAIXO */}
        <Text x="80" y="10" fontSize="10" fill="orange" textAnchor="middle">
          BAIXO
        </Text>

        {/* Texto BOM */}
        <Text x="135" y="56" fontSize="10" fill="green" textAnchor="middle" >
          BOM
        </Text>

        {/* Score */}
         
          
      </Svg>
        
    </View>
  );
};





const MyDocument = ({data}) => {
  const calculateScore = (data) => {
    let score = 0;
  
    // Pesos para os critérios
    const weights = {
      datas: 50,
      leadTime: 80,
      situacao: 30,
      situacaoEmProcesso: 40,
      situacaoEmitido: 50,
      situacoesIrregular: 60,
      comentarios: 10,
      vitalicio: 10,
      condicoes: 50,
    };
  
    // 1. Avaliação das datas
    const isDefaultDate = (date) => date === "1970-01-01";
    const { d_data_pedido, d_data_emissao, d_data_vencimento, criado_em } = data;
    if (isDefaultDate(d_data_pedido) || isDefaultDate(d_data_emissao) || isDefaultDate(d_data_vencimento)) {
      score -= weights.datas * 2; // Penalização por datas padrão
    }
  
    // 2. Avaliação do lead time
    const today = new Date(); // Data atual

    const datesPedido =
      data?.d_data_pedido === "1970-01-01" || !data?.d_data_pedido
        ? today // Usa a data atual se d_data_pedido for inválida
        : new Date(data?.d_data_pedido);
    
    const datesEmissao =
      data?.d_data_emissao === "1970-01-01" || !data?.d_data_emissao
        ? today // Usa a data atual se d_data_emissao for inválida
        : new Date(data?.d_data_emissao);
    
    // Garantir que a subtração seja da data mais recente menos a mais antiga
    const [earlierDate, laterDate] =
      datesPedido > datesEmissao
        ? [datesEmissao, datesPedido]
        : [datesPedido, datesEmissao];
    
    const differenceInTime = laterDate - earlierDate; // Subtração em milissegundos
    const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24)); // Conversão para dias completos
    
    
  
    if (differenceInDays <= 30) {
      score += weights.leadTime * 3; // Bônus para emissão rápida
    } else if (differenceInDays <= 90) {
      score += weights.leadTime * 0.4; // Bônus moderado
    } else {
      score -= weights.leadTime * 10; // Penalização por emissão demorada
    }

  
    // 3. Avaliação da situação
    const situacoeIrregular = ["Irregular"];
    if (situacoeIrregular.includes(data?.d_situacao)) {
      score -= weights.situacoesIrregular; // Penalização para situação negativa
    }

    const situacoesNegativas = ["Não iniciado"];
    if (situacoesNegativas.includes(data?.d_situacao)) {
      score -= weights.situacao; // Penalização para situação negativa
    }

    const situacoesProcesso = ["Em processo"];
    if (situacoesProcesso.includes(data?.d_situacao)) {
      score += weights.situacaoEmProcesso; // Penalização para situação negativa
    }

    const situacoesEmitido = ["Emitido"];
    if (situacoesEmitido.includes(data?.d_situacao)) {
      score += weights.situacaoEmitido; // Penalização para situação negativa
    }
  
    if (situacoesNegativas.includes(data?.dc_status_doc_ref)) {
      score -= weights.situacaoEmProcesso; // Penalização para status de referência negativa
    }
  
    // 4. Comentários
    if (data.d_comentarios.length === 0) {
      score -= weights.comentarios * 0.5; // Penalização por ausência de comentários
    }
  
    // 5. Vitalício
    if (data.d_flag_vitalicio) {
      score += weights.vitalicio * 3; // Pontuação positiva se vitalício for true
    }
  
    // 6. Condições
    for (const [condicao, details] of Object.entries(data?.dc_condicoes)) {
      if (details.status === true) {
        score += weights.condicoes * 1; // Pontuação positiva para status true
      } else if (details.status === false) {
        score -= weights.condicoes; // Penalização para status false
      } else if (details.status === null) {
        score += weights.condicoes * 0.5; // Penalização leve para status null
      }
    }
  
    return score;
  };

  const score = calculateScore(data);
  
  const calculateDaysDifference = (startDate, endDate) => {
    // Converte para somente a parte da data (ano, mês, dia) sem horário
    const start = new Date(startDate).toISOString().slice(0, 10);
    const end = new Date(endDate || new Date()).toISOString().slice(0, 10);
  
    // Calcula a diferença entre as datas como dias inteiros
    const startParts = start.split('-').map(Number);
    const endParts = end.split('-').map(Number);
  
    const startDateOnly = new Date(startParts[0], startParts[1] - 1, startParts[2]);
    const endDateOnly = new Date(endParts[0], endParts[1] - 1, endParts[2]);
  
    return Math.floor((endDateOnly - startDateOnly) / (1000 * 60 * 60 * 24));
  };
  
  
  
  
  


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
                    

                    <View style={{border: '1px dashed #1479BD', marginBottom: 2, borderRadius: 8}}>

                        <Text style={{fontSize: 9, padding: 3, fontWeight: 'bold'}}>Score Processo </Text>
                        <View style={{display: 'flex', flexDirection: 'row'}}>
                          <VelocimetroPDF score={score} />
                        </View>
                        
                        <View style={{marginLeft: 76}}>
                            {score < 0 ? (<Text x="100" y="56" style={{fontSize: 8}} fill="black" textAnchor="middle">0</Text>) : (<Text x="100" y="56" style={{fontSize: 8}} fill="black" textAnchor="middle">{score}</Text>)}
                        </View>

                    </View>
            </View>
                  
          
          </View>

          <View style={styles.bodyPage}>
            
          <View style={{ margin: 4, display: 'flex', flexDirection: 'column' }}>
          {/* Cabeçalho das colunas */}
          <View style={{ display: 'flex', flexDirection: 'row', padding: 4, borderBottom: '1px solid #ccc' }}>
            <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 10 }}>Item</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 10, marginLeft: 30 }}>Data Início</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 10 }}>Data Final</Text>
            <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 10 }}>Duração</Text>
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
              <View style={{flex: 1}}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Text style={{fontSize: 7, flex: 1 }}>{key}</Text>
                </View>
                  <Text style={{ textAlign: 'center', fontSize: 7, borderRadius: 10, margin: 0, width: 60, backgroundColor: colorsCards(value?.statusProcesso) }}> {value?.statusProcesso}</Text>
              </View> 
              <Text style={{ flex: 1, fontSize: 7, marginLeft: 30 }}> {formatDate(value?.dateCreate)}</Text>
              <Text style={{ flex: 1, fontSize: 7 }}>{value?.date === null ? '' : formatDate(value?.date)}</Text>
              
              <Text style={{ flex: 1, fontSize: 7, marginLeft: 30 }}>
                {calculateDaysDifference(value?.dateCreate, value?.date)} {calculateDaysDifference(value?.dateCreate, value?.date) > 1 ? "Dias" : "Dia"}
              </Text>


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
    flexDirection: 'column',
  },
  bodyPage: {
    height: '80%', 
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
