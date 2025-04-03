import { Timeline } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const data = {
    "dc_condicoes": {
        "Alvará de Construção": {
            "date": "2025-02-10",
            "status": null,
            "statusProcesso": "Não iniciado"
        },
        "Atestado do Corpo de Bombeiros": {
            "date": "2025-02-10",
            "status": true,
            "statusProcesso": "Não iniciado"
        },
        "Deferimento SEMF": {
            "date": "2025-02-18",
            "status": true,
            "statusProcesso": "Em processo"
        },
        "Licença Ambiental de Operação": {
            "date": "2025-02-10",
            "status": true,
            "statusProcesso": "Não iniciado"
        }
    }
};

const statusColor = (status, statusProcesso) => {
    if (status === true) return 'green';
    if (statusProcesso === "Em processo") return 'blue';
    return 'red';
};

const timelineItems = Object.entries(data.dc_condicoes).map(([key, value]) => ({
    color: statusColor(value.status, value.statusProcesso),
    dot: value.statusProcesso === "Em processo" ? <ClockCircleOutlined style={{ fontSize: '16px' }} /> : null,
    children: `${key} - ${value.date} (${value.statusProcesso})`
}));

const MyTimeline = () => {
    return <Timeline mode="alternate" items={timelineItems} />;
};

export default MyTimeline;
