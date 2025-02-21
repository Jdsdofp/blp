

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import 'leaflet/dist/leaflet.css';

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

export const BlogPostList = () => {
  // Cores para status
  const colors = {
    'Emitido': '#4CAF50',
    'Vencido': '#F44336',
    'Em processo': '#FFC107',
    'Irregular': '#9E9E9E'
  };

  // Calcular totais
  const totalFiliais = data.length;
  const totalDocumentos = data.reduce((acc, filial) => acc + filial.documentos.length, 0);

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard de Filiais</h1>
      
      {/* Cards de Resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 20 }}>
        <div style={{ background: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Filiais Ativas</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold' }}>{totalFiliais}</p>
        </div>
        <div style={{ background: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Total Documentos</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold' }}>{totalDocumentos}</p>
        </div>
      </div>

      {/* Mapa */}
      <div style={{ height: 400, marginBottom: 20, background: '#fff', borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <MapContainer 
          center={[-5.071175743778366, -42.78262704138441]} 
          zoom={13} 
          style={{ height: '100%', borderRadius: 8 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {data.map(filial => (
            <Marker 
              key={filial.f_id} 
              position={[filial.f_location.coordinates[1], filial.f_location.coordinates[0]]}
            >
              <Popup>
                <strong>{filial.f_nome}</strong><br/>
                {filial.f_cidade}/{filial.f_uf}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Gráfico de Status */}
      <div style={{ background: '#fff', padding: 20, borderRadius: 8, marginBottom: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3>Situação dos Documentos</h3>
        <PieChart width={400} height={300}>
          <Pie
            data={data.flatMap(f => f.documentos).reduce((acc, doc) => {
              const entry = acc.find(d => d.name === doc.d_situacao);
              entry ? entry.value++ : acc.push({ name: doc.d_situacao, value: 1 });
              return acc;
            }, [])}
            dataKey="value"
          >
            {Object.entries(colors).map(([name, color]) => (
              <Cell key={name} fill={color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Lista de Alertas */}
      <div style={{ background: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
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
    </div>
  );
};



// export const BlogPostList = () => {

//   return (
//     <div style={{all: 'inherit', marginLeft: 600}}>
//       <h1 >Dashboard em desenvolvimento ...</h1>
//       <img src='../public/rocket-svgrepo-com.png'/>
//     </div>
//   );
// };
