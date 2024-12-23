
const dados = {
    dc_id: 475,
    dc_documento_id: 594,
    status: "Pendente",
    dc_condicoes: {
      AVCB: {
        date: "2024-12-20T14:00:17.199Z",
        users: [2],
        status: true,
        dateCreate: "2024-12-20",
        statusProcesso: "Não iniciado",
      },
      "Licença Sanitária": {
        date: null,
        users: [2],
        status: false,
        dateCreate: "2024-12-20",
        statusProcesso: "Não iniciado",
      },
      "Certidão de Acessibilidade": {
        date: null,
        users: [2],
        status: false,
        dateCreate: "2024-12-20",
        statusProcesso: "Não iniciado",
      },
      "Licença Ambiental de Operação": {
        date: "2024-12-20T14:00:17.782Z",
        users: [260],
        status: null,
        dateCreate: "2024-12-20",
        statusProcesso: "Não iniciado",
      },
    },
    dc_status_doc_ref: "Não iniciado",
    dc_criado_em: "2024-12-20T14:00:29.214Z",
  };
  
  function calcularProgresso(dados) {
    const condicoes = dados?.dc_condicoes;
    const totalCondicoes = Object.keys(condicoes).length;
    let condicoesConcluidas = 0;
    const tarefasPorUsuario = {};
  
    // Iterar sobre as condições
    Object.values(condicoes).forEach((detalhes) => {
      if (detalhes.status || detalhes.status === null) {
        condicoesConcluidas += 1;
  
        // Incrementar tarefas por usuário
        detalhes.users.forEach((user) => {
          if (!tarefasPorUsuario[user]) {
            tarefasPorUsuario[user] = 0;
          }
          tarefasPorUsuario[user] += 1;
        });
      }
    });
  
    // Calcular progresso em percentual
    const progressoPercentual = (condicoesConcluidas / totalCondicoes) * 100;
  
    return {
      totalCondicoes,
      condicoesConcluidas,
      progressoPercentual,
      tarefasPorUsuario,
    };
  }
  
  // Executar a função
  const resultado = calcularProgresso(dados);
  
  // Exibir os resultados
  console.log(`Progresso total: ${resultado.progressoPercentual.toFixed(2)}% (${resultado.condicoesConcluidas}/${resultado.totalCondicoes})`);
  console.log("Tarefas concluídas por usuário:");
  Object.entries(resultado.tarefasPorUsuario).forEach(([user, tasks]) => {
    console.log(`Usuário ${user}: ${tasks} tarefa(s) concluída(s)`);
  });
  
  
  // Exibir os resultados
  console.log(`Progresso total: ${resultado.progressoPercentual.toFixed(2)}% (${resultado.condicoesConcluidas}/${resultado.totalCondicoes})`);
  console.log("Tarefas concluídas por usuário:");
  Object.entries(resultado.tarefasPorUsuario).forEach(([user, tasks]) => {
    console.log(`Usuário ${user}: ${tasks} tarefa(s) concluída(s)`);
  });
  
  
  // Exibir os resultados
  console.log(`Progresso total: ${resultado.progressoPercentual.toFixed(2)}% (${resultado.condicoesConcluidas}/${resultado.totalCondicoes})`);
  console.log("Tarefas concluídas por usuário:");
  Object.entries(resultado.tarefasPorUsuario).forEach(([user, tasks]) => {
    console.log(`Usuário ${user}: ${tasks} tarefa(s) concluída(s)`);
  });