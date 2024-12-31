import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Importar o CSS do Leaflet
import { useList } from '@refinedev/core';
import L from 'leaflet';
import { List } from '@refinedev/antd';
import { useContext, useEffect, useState } from 'react';
import { ColorModeContext } from '../../contexts/color-mode';
import { Card, Input, InputNumber, Select, Space, Table, Tag } from 'antd';
import Link from 'antd/es/typography/Link';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationsContext';



const { Option } = Select;
// Função para retornar a cor do ícone com base na situação



const ZoomToFilial = ({ position, zoom }) => {
    const map = useMap();
    if (position) {
        map.setView(position, zoom, { animate: true });
    }
    return null;
};

const getMarkerColor = (situation) => {
    switch (situation) {
        case 'Em processo':
            return 'blue';
        case 'Irregular':
            return 'orange';
        case 'Vencido':
            return 'red';
        case 'Emitido':
            return 'green';
        default:
            return 'gray'; // Cor padrão se não houver correspondência
    }
};

// Função para definir o HTML do marcador com a condição de situação "Vencido"
function getMarkerHTML(d_situacao) {
    if (d_situacao === 'Vencido') {
        return `
            <div class="ponto-vencido">
                <span class="ponto"><span style="margin: 2px; color: white;">❤</span></span>
            </div>
        `;
    } else {
        return `
            <div style="background-color: ${getMarkerColor(d_situacao)}; border-radius: 50%; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center;">
                <span style="color: white;">❤</span>
            </div>
        `;
    }
}

export const Mapsall = () => {
    const { notifications, loading, fetchNotifications, markAsRead } = useNotifications();
        
          useEffect(() => {
            fetchNotifications();
          }, [fetchNotifications]);

    const centerCoordinates = [-5.091278491303021, -42.83431574194223];
    const [coodZoom, setCoodZoom] = useState<any>()
    const { data, isInitialLoading } = useList({ resource: 'document', meta: { endpoint: 'listar-documentos-filais' } });
    const [modeColor, setModeColor] = useState(localStorage.getItem('colorMode'));
    const { mode, setMode } = useContext(ColorModeContext);
    const navigate = useNavigate()


    //variaveis
    const [filteredFilialId, setFilteredFilialId] = useState(null);
    const [filteredUf, setFilteredUf] = useState(null);
    const [mapZoom, setMapZoom] = useState(6);
    const [filteredSituation, setFilteredSituation] = useState(null);
    const [filteredDocType, setFilteredDocType] = useState(null); // Novo estado para o tipo de documento


    const getColor = (status: any) => {
        switch (status) {
          case 'Vencido':
            return 'red-inverse';
          case 'Em processo':
            return 'cyan';
          case 'Irregular':
            return 'orange';
          case 'Emitido':
            return 'green';
          default:
            return 'default';
        }
      };
    
    // Obter os estados únicos (f_uf)
    const uniqueStates = Array.from(new Set(data?.data.map((filial) => filial.f_uf))).filter(Boolean);
    
     // Obter os tipos de documentos únicos
    const uniqueDocTypes = Array.from(
        new Set(data?.data.flatMap((filial) => filial.documentos.map((doc) => doc.tipo_documentos?.td_desc)))
    ).filter(Boolean);

    // Filtrar as filiais com base no estado e no ID selecionado
    const filteredData = data?.data.filter((filial) => {
        const matchesFilial = filteredFilialId ? filial.f_id === filteredFilialId : true;
        const matchesUf = filteredUf ? filial.f_uf === filteredUf : true;

        const matchesSituation = filteredSituation
            ? filial.documentos.some((doc) => doc.d_situacao === filteredSituation)
            : true;
        
        const matchesDocType = filteredDocType
            ? filial.documentos.some((doc) => doc.tipo_documentos?.td_desc === filteredDocType)
            : true;

        return matchesFilial && matchesUf && matchesSituation && matchesDocType;
    });
    

    const handleFilialChange = (value) => {
        const selectedFilial = data?.data.find((filial) => filial.f_id === value);
        
        if (selectedFilial?.f_location?.coordinates) {
            setCoodZoom([selectedFilial.f_location.coordinates[1], selectedFilial.f_location.coordinates[0]]);
            setMapZoom(15); // Zoom específico para a filial
        } else {
            setCoodZoom(centerCoordinates); // Retorna ao centro padrão
            setMapZoom(6); // Zoom padrão
        }
        
        setFilteredFilialId(value); // Atualiza o ID filtrado
    };

    const handleUfChange = (value) => {
        setFilteredUf(value);
    };

    const handleDocTypeChange = (value) => {
        setFilteredDocType(value); // Atualiza o tipo de documento filtrado
    };
    
    

    return (
        <List breadcrumb canCreate={false} title="Relatório Mapa por Status">
            
           
            
            <Card  styles={{body: {paddingRight: 0, paddingLeft: 0, paddingTop: 10}}}>
            <Space>
                <Select
                        style={{ width: 200, marginBottom: 16, paddingLeft: 10 }}
                        placeholder="Selecione uma filial"
                        onChange={handleFilialChange}
                        allowClear
                    >
                        {data?.data.map((filial) => (
                            <Option key={filial.f_id} value={filial.f_id}>
                                {filial.f_nome}
                            </Option>
                        ))}
                    </Select>

                    {/* Filtro por estado */}
                    <Select
                        style={{ width: 200, marginBottom: 16 }}
                        placeholder="Selecione um estado"
                        onChange={handleUfChange}
                        allowClear
                    >
                        {uniqueStates.map((uf) => (
                            <Option key={uf} value={uf}>
                                {uf}
                            </Option>
                        ))}
                    </Select>

                    <Select
                        style={{ width: 200, marginBottom: 16 }}
                        placeholder="Selecione uma situação"
                        onChange={(value) => setFilteredSituation(value)}
                        allowClear
                    >
                        <Option value="Vencido">Vencido</Option>
                        <Option value="Em processo">Em processo</Option>
                        <Option value="Irregular">Irregular</Option>
                        <Option value="Emitido">Emitido</Option>
                    </Select>

                    <Select
                        style={{ width: 200, marginBottom: 16 }}
                        placeholder="Selecione um tipo de documento"
                        onChange={handleDocTypeChange}
                        allowClear
                    >
                        {uniqueDocTypes.map((docType) => (
                            <Option key={docType} value={docType}>
                                {docType}
                            </Option>
                        ))}
                    </Select>
            </Space>


                <div style={{ height: "80vh", width: "100%" }}>
                    <MapContainer 

                        center={centerCoordinates} 
                        zoom={mapZoom} 
                        style={{ height: "100%", width: "100%" }}
                    >
                        <ZoomToFilial position={coodZoom} zoom={mapZoom}/>
                        <TileLayer
                            url={mode === 'light' ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"}
                        />
                        {filteredData?.map((filial) => {
                            if (filial.f_location && filial.f_location.coordinates) {
                                // Ordena os documentos e seleciona o primeiro com maior prioridade
                                const sortedDocumentos = filial.documentos.sort((a, b) => {
                                    const order = ['Vencido', 'Não iniciado', 'Em processo', 'Emitido'];
                                    return order.indexOf(a.d_situacao) - order.indexOf(b.d_situacao);
                                });
                                
                                // Seleciona a situação do primeiro documento ordenado
                                const markerSituation = sortedDocumentos[0]?.d_situacao;

                                return (
                                    <Marker
                                        key={filial.f_id}
                                        position={[filial.f_location.coordinates[1], filial.f_location.coordinates[0]]}
                                        icon={new L.DivIcon({
                                            className: 'custom-marker',
                                            html: getMarkerHTML(markerSituation),
                                            iconSize: [24, 24],
                                            iconAnchor: [12, 12],
                                        })}
                                    >
                                        <Popup>
                                            <div>
                                                <h3>{filial.f_codigo} - <span style={{fontWeight: 'bold', fontSize: 15}}>{filial.f_nome}</span></h3>
                                                <p><strong>Cidade:</strong> {filial.f_cidade}, {filial.f_uf}</p>
                                                <p><strong>CNPJ:</strong> {filial.f_cnpj}</p>

                                            </div>
                                            {/* navigate(`/document/show/?status=Não%20iniciado&filialId=`) */}
                                            <Table size='middle' dataSource={sortedDocumentos.map(doc=>doc)}>
                                                <Table.Column title='Doc' render={(_, doc)=>(<Link style={{fontSize: 10}} onClick={()=>navigate(`/document/show/?status=${doc?.d_situacao}&filialId=${filial?.f_id}`)}>{doc.tipo_documentos?.td_desc}</Link>)}/>
                                                <Table.Column title='Status' render={(_, doc)=>(<Tag style={{fontSize: 10}} color={getColor(doc?.d_situacao)}>{doc.d_situacao}</Tag>)}/>
                                            </Table>
                                        </Popup>
                                    </Marker>
                                );
                            }
                            return null;
                        })}
                            
                    </MapContainer> 
                </div>

                {/* CSS para o efeito piscante */}
                <style>{`
                    .ponto-vencido {
                        width: 24px;
                        height: 24px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .ponto {
                        width: 24px;
                        height: 24px;
                        padding: 4px;
                        background-color: #ff0000;
                        border-radius: 50%;
                        position: relative;
                        box-shadow: 0 0 10px 5px rgba(255, 0, 0, 0.5);
                        animation: pulsar 1.5s infinite;
                    }

                    .ponto::after {
                        content: "";
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        margin: -10px;
                        border-radius: 50%;
                        box-shadow: 0 0 20px 10px rgba(255, 0, 0, 0.4);
                        animation: expandir 1.5s infinite;
                    }

                    @keyframes pulsar {
                        0%, 100% {
                            opacity: 1;
                        }
                        50% {
                            opacity: 0.2;
                        }
                    }

                    @keyframes expandir {
                        0% {
                            transform: scale(1);
                            opacity: 1;
                        }
                        100% {
                            transform: scale(2.5);
                            opacity: 0;
                        }
                    }
                `}</style>
            </Card>
        </List>
    );
};

