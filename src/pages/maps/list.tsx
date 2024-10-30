import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Importar o CSS do Leaflet
import { useList } from '@refinedev/core';
import L from 'leaflet';
import { List } from '@refinedev/antd';
import { useContext, useState } from 'react';
import { ColorModeContext } from '../../contexts/color-mode';
import { Card, Input } from 'antd';

// Função para retornar a cor do ícone com base na situação
const getMarkerColor = (situation) => {
    switch (situation) {
        case 'Em processo':
            return 'blue';
        case 'Não iniciado':
            return 'orange';
        case 'Vencido':
            return 'red';
        case 'Emitido':
            return 'green';
        default:
            return 'gray'; // Cor padrão se não houver correspondência
    }
};

// Componente do mapa
export const Mapsall = () => {
    const centerCoordinates = [-5.091278491303021, -42.83431574194223];
    const { data } = useList({ resource: 'document', meta: { endpoint: 'listar-documentos-filais' } });
    const [modeColor, setModeColor] = useState(localStorage.getItem('colorMode'))
    const { mode, setMode } = useContext(ColorModeContext);
    

    return (
        <List breadcrumb canCreate={false} title='Relório Mapa por status' >
            <Card style={{padding: 0, margin: 0}}>

                <div style={{ height: "80vh", width: "100%" }}>
                    <MapContainer 
                        center={centerCoordinates} 
                        zoom={6} 
                        style={{ height: "100%", width: "100%" }}
                        
                    >
                        <TileLayer

                            url={mode == 'light' ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"}
                        />

                        
                        
                        {data?.data.map((filial) => (
                            filial.f_location && filial.f_location.coordinates && (
                                <Marker
                                    key={filial.f_id}
                                    position={[filial.f_location.coordinates[1], filial.f_location.coordinates[0]]}
                                    icon={new L.DivIcon({
                                        className: 'custom-marker',
                                        html: `<div style="background-color: ${getMarkerColor(filial.documentos[0]?.d_situacao)}; border-radius: 50%; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center;">
                                                    <span style="color: white;">❤</span> <!-- Símbolo de marcador -->
                                                </div>`,
                                        iconSize: [24, 24],
                                        iconAnchor: [12, 12],
                                    })}
                                >
                                    <Popup>
                                        <div>
                                            <h3>{filial.f_nome}</h3>
                                            <p><strong>Cidade:</strong> {filial.f_cidade}, {filial.f_uf}</p>
                                            <p><strong>CNPJ:</strong> {filial.f_cnpj}</p>
                                            
                                            <h4>Documentos</h4>
                                            {filial.documentos.length > 0 ? (
                                                filial.documentos.map(doc => (
                                                    <p key={doc.d_id}>
                                                        <strong>ID:</strong> {doc.d_id} - <strong>Situação:</strong> {doc.d_situacao}
                                                    </p>
                                                ))
                                            ) : (
                                                <p>Nenhum documento disponível</p>
                                            )}
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        ))}
                    </MapContainer>
                </div>

            </Card>

        </List>
    );
};
