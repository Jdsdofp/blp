import { Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { ClockCircleFilled, CloseCircleOutlined } from "@ant-design/icons";

// Registrar elementos do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const ProgressoGrafico = ({ dados }) => {

  const { dc_condicoes } = dados;
  const totalCondicoes = Object.keys(dc_condicoes)?.length;
  const condicoesConcluidas = Object.values(dc_condicoes)?.filter(
    (detalhes) => detalhes?.status
  ).length;

  const progressoPercentual = (condicoesConcluidas / totalCondicoes) * 100;

  // Preparar dados para Gráfico de Rosca
  const doughnutData = {
    labels: ["Progresso", "Restante"],
    datasets: [
      {
        data: [progressoPercentual, 100 - progressoPercentual],
        backgroundColor: ["#4caf50", "#fc3737"],
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      datalabels: {
        color: "#fff", // Cor do texto
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex];
          return `${label}: ${value.toFixed(0)}%`; // Exibe o rótulo e o valor
        },
        font: {
          size: 14,
          weight: "bold",
        },
        anchor: "end", // Posiciona próximo ao centro
        align: "start", // Ajusta a direção
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };


  // Preparar dados para Gráfico de Barras
  const tarefasPorUsuario = {};
  Object.values(dc_condicoes).forEach((detalhes) => {
    if (detalhes?.status) {
      detalhes?.users.forEach((user) => {
        const { id, nome } = user;
        if (!tarefasPorUsuario[nome]) {
          tarefasPorUsuario[nome] = 0;
        }
        tarefasPorUsuario[nome] += 1;
      });
    }
  });

  

  

  return (
    <>
  <div style={{ width: "300px", height: "400px", margin: "0 auto", textAlign: "center", padding: 0 }}>
    <h3>Progresso Total {progressoPercentual.toFixed(0)}%</h3>
    <Doughnut style={{height: 280, width: 280}} data={doughnutData} options={doughnutOptions} plugins={[ChartDataLabels]} />
  </div>
</>

  );
};

export default ProgressoGrafico;
