

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList, Legend } from 'recharts'
import 'leaflet/dist/leaflet.css';
import { useContext, useEffect, useState } from 'react';
import { ColorModeContext } from '../../contexts/color-mode';
import axios from 'axios';
import { API_URL } from '../../authProvider';
import msgpack from 'msgpack-lite';


const data = [
  {
      "f_id": 148,
      "f_codigo": 15,
      "f_nome": "Globo Homero (Matriz)",
      "f_cidade": "Teresina",
      "f_uf": "PI",
      "f_ativo": true,
      "f_cnpj": "63503007000146",
      "f_location": {
          "crs": {
              "type": "name",
              "properties": {
                  "name": "EPSG:4326"
              }
          },
          "type": "Point",
          "coordinates": [
              -42.78262704138441,
              -5.071175743778366
          ]
      },
      "documentos": [
          {
              "d_id": 676,
              "d_situacao": "Em processo",
              "tipo_documentos": {
                  "td_desc": "Alvará de Publicidade",
                  "td_dia_alert": 90
              }
          },
          {
              "d_id": 671,
              "d_situacao": "Irregular",
              "tipo_documentos": {
                  "td_desc": "Habite-se",
                  "td_dia_alert": null
              }
          },
          {
              "d_id": 673,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Licença Ambiental de Operação",
                  "td_dia_alert": 150
              }
          },
          {
              "d_id": 672,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Alvará do Bombeiro",
                  "td_dia_alert": 45
              }
          },
          {
              "d_id": 674,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Alvará de Funcionamento",
                  "td_dia_alert": 40
              }
          },
          {
              "d_id": 670,
              "d_situacao": "Irregular",
              "tipo_documentos": {
                  "td_desc": "Alvará de Construção",
                  "td_dia_alert": null
              }
          },
          {
              "d_id": 675,
              "d_situacao": "Vencido",
              "tipo_documentos": {
                  "td_desc": "Alvará de Funcionamento",
                  "td_dia_alert": 40
              }
          }
      ]
  },
  {
      "f_id": 149,
      "f_codigo": 16,
      "f_nome": "Globo Kennedy",
      "f_cidade": "Teresina",
      "f_uf": "PI",
      "f_ativo": true,
      "f_cnpj": "63503007000308",
      "f_location": {
          "crs": {
              "type": "name",
              "properties": {
                  "name": "EPSG:4326"
              }
          },
          "type": "Point",
          "coordinates": [
              -42.77186868693458,
              -5.070245803610069
          ]
      },
      "documentos": [
          {
              "d_id": 682,
              "d_situacao": "Em processo",
              "tipo_documentos": {
                  "td_desc": "Alvará de Publicidade",
                  "td_dia_alert": 90
              }
          },
          {
              "d_id": 677,
              "d_situacao": "Vencido",
              "tipo_documentos": {
                  "td_desc": "Alvará de Construção",
                  "td_dia_alert": null
              }
          },
          {
              "d_id": 678,
              "d_situacao": "Em processo",
              "tipo_documentos": {
                  "td_desc": "Habite-se",
                  "td_dia_alert": null
              }
          },
          {
              "d_id": 679,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Licença Ambiental de Operação",
                  "td_dia_alert": 150
              }
          },
          {
              "d_id": 680,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Alvará do Bombeiro",
                  "td_dia_alert": 45
              }
          },
          {
              "d_id": 681,
              "d_situacao": "Não iniciado",
              "tipo_documentos": {
                  "td_desc": "Alvará de Funcionamento",
                  "td_dia_alert": 40
              }
          },
          {
              "d_id": 696,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Alvará de Construção",
                  "td_dia_alert": null
              }
          },
          {
              "d_id": 704,
              "d_situacao": "Vencido",
              "tipo_documentos": {
                  "td_desc": "Alvará de Publicidade",
                  "td_dia_alert": 90
              }
          }
      ]
  },
  {
      "f_id": 150,
      "f_codigo": 17,
      "f_nome": "Globo São Cristovão",
      "f_cidade": "Teresina",
      "f_uf": "PI",
      "f_ativo": true,
      "f_cnpj": "63503007000901",
      "f_location": {
          "crs": {
              "type": "name",
              "properties": {
                  "name": "EPSG:4326"
              }
          },
          "type": "Point",
          "coordinates": [
              -42.774437785746606,
              -5.079902552293915
          ]
      },
      "documentos": [
          {
              "d_id": 689,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Alvará de Funcionamento",
                  "td_dia_alert": 40
              }
          },
          {
              "d_id": 686,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Alvará do Bombeiro",
                  "td_dia_alert": 45
              }
          },
          {
              "d_id": 687,
              "d_situacao": "Em processo",
              "tipo_documentos": {
                  "td_desc": "Alvará do Bombeiro",
                  "td_dia_alert": 45
              }
          },
          {
              "d_id": 683,
              "d_situacao": "Irregular",
              "tipo_documentos": {
                  "td_desc": "Alvará de Construção",
                  "td_dia_alert": null
              }
          },
          {
              "d_id": 688,
              "d_situacao": "Em processo",
              "tipo_documentos": {
                  "td_desc": "Alvará de Publicidade",
                  "td_dia_alert": 90
              }
          },
          {
              "d_id": 684,
              "d_situacao": "Irregular",
              "tipo_documentos": {
                  "td_desc": "Habite-se",
                  "td_dia_alert": null
              }
          },
          {
              "d_id": 705,
              "d_situacao": "Vencido",
              "tipo_documentos": {
                  "td_desc": "Alvará de Publicidade",
                  "td_dia_alert": 90
              }
          },
          {
              "d_id": 685,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Licença Ambiental de Operação",
                  "td_dia_alert": 150
              }
          }
      ]
  },
  {
      "f_id": 151,
      "f_codigo": 18,
      "f_nome": "Globo Dirceu",
      "f_cidade": "Teresina",
      "f_uf": "PI",
      "f_ativo": true,
      "f_cnpj": "63503007000499",
      "f_location": {
          "crs": {
              "type": "name",
              "properties": {
                  "name": "EPSG:4326"
              }
          },
          "type": "Point",
          "coordinates": [
              -42.75656716413954,
              -5.105172964822796
          ]
      },
      "documentos": [
          {
              "d_id": 691,
              "d_situacao": "Irregular",
              "tipo_documentos": {
                  "td_desc": "Habite-se",
                  "td_dia_alert": null
              }
          },
          {
              "d_id": 692,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Licença Ambiental de Operação",
                  "td_dia_alert": 150
              }
          },
          {
              "d_id": 693,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Alvará do Bombeiro",
                  "td_dia_alert": 45
              }
          },
          {
              "d_id": 694,
              "d_situacao": "Em processo",
              "tipo_documentos": {
                  "td_desc": "Alvará de Publicidade",
                  "td_dia_alert": 90
              }
          },
          {
              "d_id": 695,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Alvará de Funcionamento",
                  "td_dia_alert": 40
              }
          },
          {
              "d_id": 690,
              "d_situacao": "Irregular",
              "tipo_documentos": {
                  "td_desc": "Alvará de Construção",
                  "td_dia_alert": null
              }
          }
      ]
  },
  {
      "f_id": 152,
      "f_codigo": 19,
      "f_nome": "Globo Girassol",
      "f_cidade": "Teresina",
      "f_uf": "PI",
      "f_ativo": true,
      "f_cnpj": "63503007000570",
      "f_location": {
          "crs": {
              "type": "name",
              "properties": {
                  "name": "EPSG:4326"
              }
          },
          "type": "Point",
          "coordinates": [
              -42.761486306195586,
              -5.071004387478418
          ]
      },
      "documentos": [
          {
              "d_id": 703,
              "d_situacao": "Vencido",
              "tipo_documentos": {
                  "td_desc": "Alvará de Publicidade",
                  "td_dia_alert": 90
              }
          },
          {
              "d_id": 697,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Alvará de Construção",
                  "td_dia_alert": null
              }
          },
          {
              "d_id": 698,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Habite-se",
                  "td_dia_alert": null
              }
          },
          {
              "d_id": 701,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Alvará do Bombeiro",
                  "td_dia_alert": 45
              }
          },
          {
              "d_id": 702,
              "d_situacao": "Em processo",
              "tipo_documentos": {
                  "td_desc": "Alvará de Publicidade",
                  "td_dia_alert": 90
              }
          },
          {
              "d_id": 700,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Alvará de Funcionamento",
                  "td_dia_alert": 40
              }
          },
          {
              "d_id": 699,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Licença Ambiental de Operação",
                  "td_dia_alert": 150
              }
          }
      ]
  }];

  
    const custos = [
        {
            "dd_id": 140,
            "dd_id_documento": 673,
            "dd_descricao": "Taxa Licença Ambiental de Operação",
            "dd_valor": "553.74",
            "dd_data_entrada": "2024-12-05",
            "dd_data_vencimento": "2024-12-17",
            "dd_tipo": "Taxa",
            "dd_usuario": "Alexandra Moura",
            "dd_criado_em": "2025-02-10T20:52:18.089Z",
            "d_num_ref": ""
        },
        {
            "dd_id": 141,
            "dd_id_documento": 674,
            "dd_descricao": "Taxa Alvará de Funcionamento",
            "dd_valor": "481.41",
            "dd_data_entrada": "2024-12-04",
            "dd_data_vencimento": "2024-12-12",
            "dd_tipo": "Taxa",
            "dd_usuario": "Alexandra Moura",
            "dd_criado_em": "2025-02-10T20:53:43.146Z",
            "d_num_ref": ""
        },
        {
            "dd_id": 144,
            "dd_id_documento": 794,
            "dd_descricao": "Taxa Renovação Alv Func",
            "dd_valor": "460.30",
            "dd_data_entrada": "2025-01-07",
            "dd_data_vencimento": "2025-01-10",
            "dd_tipo": "Taxa",
            "dd_usuario": "Lorenna Matos",
            "dd_criado_em": "2025-02-19T21:47:43.365Z",
            "d_num_ref": "2956258002771252317"
        },
        {
            "dd_id": 145,
            "dd_id_documento": 791,
            "dd_descricao": "Renovação Alv Func",
            "dd_valor": "460.30",
            "dd_data_entrada": "2025-01-07",
            "dd_data_vencimento": "2025-01-10",
            "dd_tipo": "Taxa",
            "dd_usuario": "Lorenna Matos",
            "dd_criado_em": "2025-02-19T21:55:16.765Z",
            "d_num_ref": ""
        }
    ]


export const BlogPostList = () => {
  const { mode, setMode } = useContext(ColorModeContext);
  const [val, setVal] = useState(0)
  
    // Cores para status
  const colors = {
    'Emitido': '#259c3b',
    'Vencido': '#fc0f03',
    'Em processo': '#00ffff',
    'Irregular': '#e0aa07'
  };

  // Calcular totais
  const totalFiliais = data.length;
  const totalDocumentos = data.reduce((acc, filial) => acc + filial.documentos.length, 0);

  // Novos cálculos para custos
  const totalCustos = custos.reduce((acc, custo) => acc + parseFloat(custo.dd_valor), 0);
  const custosPorTipo = custos.reduce((acc, custo) => {
    acc[custo.dd_tipo] = (acc[custo.dd_tipo] || 0) + parseFloat(custo.dd_valor);
    return acc;
  }, {});


  useEffect(() => {
    axios
      .get(`${API_URL}/debit/listar-custos`)
      .then(response => {
        const valores = response?.data?.custos?.map((v: any) => Number(v?.dd_valor)) || [];
        const total = valores.reduce((acc, val) => acc + val, 0);
        setVal(total);
      })
      .catch(error => console.log("Erro:", error));
  }, []);
  

  return (
      <div style={{ padding: 20 }}>
          <h1>Dashboard de Filiais</h1>

          {/* Cards de Resumo */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 20, }}>
              <div style={{ background: mode === 'dark' ? '#222' : '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <h3>Filiais Ativas</h3>
                  <p style={{ fontSize: 24, fontWeight: 'bold' }}>{totalFiliais}</p>
              </div>
              <div style={{ background: mode === 'dark' ? '#222' : '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <h3>Total Documentos</h3>
                  <p style={{ fontSize: 24, fontWeight: 'bold' }}>{totalDocumentos}</p>
              </div>
              <div style={{ background: mode === 'dark' ? '#222' : '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <h3>Total de Custos</h3>
                  <p style={{ fontSize: 24, fontWeight: 'bold' }}>
                      {val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
              </div>
          </div>

          {/* Gráfico de Status */}
          <div style={{ background: mode === 'dark' ? '#222' : '#fff', padding: 20, borderRadius: 8, marginBottom: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: mode === 'dark' ? '#fff' : '#000' }}>Situação dos Documentos</h3>
              <PieChart width={400} height={300} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <Pie
                      data={data.flatMap(f => f.documentos).reduce((acc, doc) => {
                          const entry = acc.find(d => d?.name === doc?.d_situacao);
                          entry ? entry.value++ : acc.push({ name: doc?.d_situacao, value: 1 });
                          return acc;
                      }, [])}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                      {Object.entries(colors).map(([name, color]) => (
                          <Cell key={name} fill={color} />
                      ))}

                  </Pie>
                  <Tooltip
                      contentStyle={{
                          background: mode === 'dark' ? '#333' : '#fff',
                          border: 'none',
                          borderRadius: 8
                      }}
                      formatter={(value, name) => [
                          `${value} documentos`,
                          name,
                      ]}
                  />
                  {/* <Legend
                      layout="radial"
                      align="right"
                      verticalAlign="middle"
                      formatter={(value) => (
                          <span style={{ color: mode === 'dark' ? '#fff' : '#000' }}>
                              {value}
                          </span>
                      )}
                  /> */}
              </PieChart>
          </div>

          {/* Lista de Alertas */}
          <div style={{ background: mode === 'dark' ? '#222' : '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3>Documentos com Alerta</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                      <tr>
                          <th>Filial</th>
                          <th>Documento</th>
                          <th>Situação</th>
                          <th>Dias Alerta</th>
                      </tr>
                  </thead>
                  <tbody>
                      {data.map(filial =>
                          filial.documentos.map(doc => (
                              <tr key={doc.d_id} style={{ borderTop: '1px solid #eee' }}>
                                  <td style={{ padding: 10 }}>{filial.f_nome}</td>
                                  <td style={{ padding: 10 }}>{doc.tipo_documentos.td_desc}</td>
                                  <td style={{ padding: 10, color: colors[doc.d_situacao] }}>
                                      {doc.d_situacao}
                                  </td>
                                  <td style={{ padding: 10 }}>{doc.tipo_documentos.td_dia_alert || '-'}</td>
                              </tr>
                          ))
                      )}
                  </tbody>
              </table>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              {/* Gráfico de Distribuição de Custos */}
              <div style={{ background: mode === 'dark' ? '#222' : '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <h3>Distribuição de Custos por Tipo</h3>
                  <BarChart width={500} height={300} data={Object.entries(custosPorTipo).map(([tipo, valor]) => ({ tipo, valor }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tipo" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="valor" fill="#8884d8" />
                  </BarChart>
              </div>

              <div style={{ background: mode === 'dark' ? '#222' : '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <h3>Próximos Vencimentos</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                          <tr>
                              <th>Descrição</th>
                              <th>Valor</th>
                              <th>Vencimento</th>
                              <th>Tipo</th>
                          </tr>
                      </thead>
                      <tbody>
                          {custos
                              .sort((a, b) => new Date(a?.dd_data_vencimento) - new Date(b?.dd_data_vencimento))
                              .slice(0, 5)
                              .map(custo => (
                                  <tr key={custo?.dd_id} style={{ borderTop: '1px solid #eee' }}>
                                      <td style={{ padding: 10 }}>{custo?.dd_descricao}</td>
                                      <td style={{ padding: 10 }}>
                                          {parseFloat(custo?.dd_valor).toLocaleString('pt-BR', {
                                              style: 'currency',
                                              currency: 'BRL'
                                          })}
                                      </td>
                                      <td style={{ padding: 10 }}>
                                          {new Date(custo?.dd_data_vencimento).toLocaleDateString('pt-BR')}
                                      </td>
                                      <td style={{ padding: 10 }}>{custo?.dd_tipo}</td>
                                  </tr>
                              ))}
                      </tbody>
                  </table>
              </div>
          </div>


          <div style={{ background: mode === 'dark' ? '#222' : '#fff', padding: 20, marginBottom: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3>Detalhamento de Custos</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                      <tr>
                          <th>Descrição</th>
                          <th>Valor</th>
                          <th>Entrada</th>
                          <th>Vencimento</th>
                          <th>Responsável</th>
                      </tr>
                  </thead>
                  <tbody>
                      {custos.map(custo => (
                          <tr key={custo.dd_id} style={{ borderTop: '1px solid #eee' }}>
                              <td style={{ padding: 10 }}>{custo?.dd_descricao}</td>
                              <td style={{ padding: 10 }}>
                                  {parseFloat(custo.dd_valor).toLocaleString('pt-BR', {
                                      style: 'currency',
                                      currency: 'BRL'
                                  })}
                              </td>
                              <td style={{ padding: 10 }}>
                                  {new Date(custo.dd_data_entrada).toLocaleDateString('pt-BR')}
                              </td>
                              <td style={{ padding: 10 }}>
                                  {new Date(custo.dd_data_vencimento).toLocaleDateString('pt-BR')}
                              </td>
                              <td style={{ padding: 10 }}>{custo.dd_usuario}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>



      </div>
  );
};
