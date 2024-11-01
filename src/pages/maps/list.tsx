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
    const centerCoordinates = [-5.091278491303021, -42.83431574194223];
    const { data, isInitialLoading } = useList({ resource: 'document', meta: { endpoint: 'listar-documentos-filais' } });
    const [modeColor, setModeColor] = useState(localStorage.getItem('colorMode'));
    const { mode, setMode } = useContext(ColorModeContext);

    return (
        <List breadcrumb canCreate={false} title="Relatório Mapa por Status">
            <Card style={{ padding: 0, margin: 0 }}>
                <div style={{ height: "80vh", width: "100%" }}>
                    <MapContainer 
                        center={centerCoordinates} 
                        zoom={6} 
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            url={mode === 'light' ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"}
                        />
                        {data?.data.map((filial) => {
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
                                                <h3>{filial.f_nome}</h3>
                                                <p><strong>Cidade:</strong> {filial.f_cidade}, {filial.f_uf}</p>
                                                <p><strong>CNPJ:</strong> {filial.f_cnpj}</p>

                                                <h4>Documentos</h4>
                                                {sortedDocumentos.map(doc => (
                                                    <p key={doc.d_id}>
                                                        <strong>ID:</strong> {doc.d_id} - <strong>Situação:</strong> {doc.d_situacao}
                                                    </p>
                                                ))}
                                            </div>
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

