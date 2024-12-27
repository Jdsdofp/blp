import React, { useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { Badge, Card, Popover } from "antd";
import { useList } from "@refinedev/core";
import './style.css'
import { AddAPhoto, NextPlan } from "@mui/icons-material";
import { Show } from "@refinedev/antd";
import { useNotifications } from "../../contexts/NotificationsContext";

export const CalendarList = () => {
  const { notifications, loading, fetchNotifications, markAsRead } = useNotifications();
      
        useEffect(() => {
          fetchNotifications();
        }, [fetchNotifications]);

    // Obter dados da API
    const { data, isLoading } = useList({
        resource: "document",
        meta: { endpoint: "listar-documentos" },
    });

    const d_v = data?.data?.map((v) => new Date(v.d_data_vencimento));

    

const currentDate = new Date();

// Função para calcular a diferença em dias
const calculateDaysDifference = (date1: any, date2: any) => {
  const timeDiff = date1.getTime() - date2.getTime();
  const daysDiff = timeDiff / (1000 * 3600 * 24); // Converter de milissegundos para dias
  
  return Math.ceil(daysDiff); // Arredonda para o próximo dia
};

// Função para determinar a cor com base na diferença de dias e no alerta do documento
const getEventColor = (daysDiff: number, alertDays: number | null) => {
  console.log('Dif', alertDays)
  if (daysDiff < 0) return 'red'; // Datas no passado
  if (alertDays !== null && daysDiff <= alertDays) return 'yellow'; // Dentro do prazo definido no alerta
  if (daysDiff <= 30) return 'orange'; // Faltam entre 30 e 60 dias (regra padrão)
  return 'primary'; // Mais de 60 dias
};

// Função para determinar a cor do texto (preto para fundo claro, branco para fundo escuro)
const getTextColor = (backgroundColor: any) => {
    // Se o fundo for vermelho ou azul, o texto será branco; caso contrário, preto
    if (backgroundColor === 'red' || backgroundColor === 'primary') {
      return 'white';
    }
    return 'black';
  }

  

// Atualização dos eventos para usar a nova lógica
const events = data?.data?.map((documento) => {
  const daysDifference = calculateDaysDifference(new Date(documento.d_data_vencimento), currentDate);
  const alertDays = documento.tipo_documentos?.td_dia_alert ?? null; // Dias para alerta, se existir

  return {
    title: `${documento.tipo_documentos.td_desc} - ${documento.filiais.f_nome}`,
    start: documento.d_data_vencimento,
    end: documento.d_data_vencimento,
    extendedProps: {
      situacao: documento.d_situacao,
      orgao_exp: documento.d_orgao_exp,
    },
    backgroundColor: getEventColor(daysDifference, alertDays), // Define a cor do evento
    textColor: getTextColor(getEventColor(daysDifference, alertDays)), // Ajusta a cor do texto
    borderColor: getEventColor(daysDifference, alertDays), // Ajusta a cor da borda
  };
});
    



    return (
      <Show isLoading={isLoading} headerButtons title="Calendario">
          <Card size="small" bordered>
              <FullCalendar
                  height={500}
                  locale={['pt-br']}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                  initialView="dayGridMonth"
                  events={events} 
                  headerToolbar={{
                      left: "prev,next today title",
                      right: "dayGridMonth timeGridWeek,timeGridDay,list",
                  }}
                  buttonText={{
                      day: 'Dia',
                      month: 'Mês',
                      week: 'Semana',
                      list: 'Lista',
                      today: 'Hoje',
                      nextYear: 'Ano'
                  }}
                  
              />
          </Card>
      </Show>
    );
};
