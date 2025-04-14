
import React, { StrictMode, useMemo, useState } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ValueFormatterParams, ICellRendererParams } from "ag-grid-community";
import '../style.css'
ModuleRegistry.registerModules([AllCommunityModule]);

const data = [
  {
      "f_id": 148,
      "f_codigo": 15,
      "f_nome": "Globo Homero (Matriz)",
      "f_cidade": "Teresina",
      "f_uf": "MA",
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
              "d_id": 671,
              "d_situacao": "Irregular",
              "tipo_documentos": {
                  "td_desc": "Habite-se",
                  "td_dia_alert": null
              }
          },
          {
              "d_id": 1852,
              "d_situacao": "Não iniciado",
              "tipo_documentos": {
                  "td_desc": "Alvará do Bombeiro",
                  "td_dia_alert": 45
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
              "d_id": 676,
              "d_situacao": "Em processo",
              "tipo_documentos": {
                  "td_desc": "Alvará de Publicidade",
                  "td_dia_alert": 90
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
              "d_id": 672,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Alvará do Bombeiro",
                  "td_dia_alert": 45
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
              "d_id": 1052,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Alvará de Construção",
                  "td_dia_alert": null
              }
          },
          {
              "d_id": 1853,
              "d_situacao": "Não iniciado",
              "tipo_documentos": {
                  "td_desc": "Alvará do Bombeiro",
                  "td_dia_alert": 45
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
              "d_id": 704,
              "d_situacao": "Vencido",
              "tipo_documentos": {
                  "td_desc": "Alvará de Publicidade",
                  "td_dia_alert": 90
              }
          },
          {
              "d_id": 1343,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Alvará de Funcionamento",
                  "td_dia_alert": 40
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
              "d_id": 679,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Licença Ambiental de Operação",
                  "td_dia_alert": 150
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
              "d_id": 683,
              "d_situacao": "Irregular",
              "tipo_documentos": {
                  "td_desc": "Alvará de Construção",
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
              "d_id": 687,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Alvará do Bombeiro",
                  "td_dia_alert": 45
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
              "d_id": 689,
              "d_situacao": "Emitido",
              "tipo_documentos": {
                  "td_desc": "Alvará de Funcionamento",
                  "td_dia_alert": 40
              }
          }
      ]
  }]

// Interface para tipagem dos dados
interface IFilial {
  f_id: number;
  f_codigo: number;
  f_nome: string;
  f_cidade: string;
  f_uf: string;
  f_ativo: boolean;
  f_cnpj: string;
  f_location: {
    coordinates: [number, number];
  };
  documentos: Array<{
    d_situacao: string;
    tipo_documentos: {
      td_desc: string;
    };
  }>;
}

// Renderizador personalizado para status ativo
const StatusRenderer = (params: ICellRendererParams) => (
  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <img
      alt={params.value ? 'Ativo' : 'Inativo'}
      src={`https://www.ag-grid.com/example-assets/icons/${params.value ? 'tick-in-circle' : 'cross-in-circle'}.png`}
      style={{ width: '20px', height: '20px' }}
    />
  </span>
);

// Renderizador para documentos
const DocumentosRenderer = (params: ICellRendererParams) => (
  <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
    {params.value?.map((doc: any, index: number) => (
      <div key={index} style={{ margin: '2px 0', padding: '2px', borderBottom: '1px solid #eee' }}>
        <strong>{doc.tipo_documentos.td_desc}:</strong> {doc.d_situacao}
      </div>
    ))}
  </div>
);

// Formatador de CNPJ
const cnpjFormatter = (params: ValueFormatterParams) => {
  const cnpj = params.value;
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

// Formatador de coordenadas
const coordFormatter = (params: ValueFormatterParams) => {
  const [lng, lat] = params.value;
  return `Lat: ${lat.toFixed(5)}, Long: ${lng.toFixed(5)}`;
};

const GridExample = () => {
  // Substitua a URL pelos seus dados locais ou API
  

  const [colDefs] = useState<ColDef[]>([
    { 
      field: "f_codigo",
      headerName: "Código",
      width: 100
    },
    {
      field: "f_nome",
      headerName: "Nome da Filial",
      width: 200
    },
    {
      field: "f_cidade",
      headerName: "Cidade",
      width: 150,
      enableRowGroup: true
    },
    {
      field: "f_uf",
      headerName: "UF",
      width: 80,
      enableRowGroup: true, // Permite agrupamento
      rowGroup: false // Não agrupa inicialmente
    },
    {
      field: "f_ativo",
      headerName: "Status",
      cellRenderer: StatusRenderer,
      width: 100
    },
    {
      field: "f_cnpj",
      headerName: "CNPJ",
      valueFormatter: cnpjFormatter,
      width: 180
    },
    {
      field: "f_location.coordinates",
      headerName: "Localização",
      valueFormatter: coordFormatter,
      width: 200
    },
    {
      field: "documentos",
      headerName: "Documentos",
      cellRenderer: DocumentosRenderer,
      autoHeight: true,
      width: 300
    }
  ]);

  const defaultColDef = useMemo<ColDef>(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
    enableRowGroup: true, // Permite agrupar em todas as colunas
  }), []);

  return (
    <div className="ag-theme-alpine" style={{ width: '100%', height: '600px' }}>
      <AgGridReact
        rowData={data}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
        domLayout='autoHeight'
        rowGroupPanelShow="always"
        groupDisplayType="multipleColumns" // Modificado
        enableRangeSelection={true} // Adicionado
        groupMaintainOrder={true} // Adicionado
        animateRows={true}
        sideBar={true} // Adiciona painel lateral com opções
      />
    </div>
  );
};



export default GridExample;