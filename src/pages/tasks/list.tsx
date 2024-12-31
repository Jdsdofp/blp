import { Button, List } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../authProvider";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

export const ListTasks = () => {
  const [loadTask, setLoadTask] = useState(false);
  const [dataTasks, setDataTasks] = useState([]);
  const [initialData, setInitialData] = useState({});
  const [iconList, setIconList] = useState(false);

  const statuses = ["Pendente", "Não Aplicável", "Conforme"];


  useEffect(() => {
    const tasksData = async () => {
      setLoadTask(true);
      try {
        const response = await axios.get(`${API_URL}/document-condition/listar-tarefas-usuario`);
        setLoadTask(false);
        const tasks = response?.data || [];
        setDataTasks(tasks);
  
        // Agrupar por filial
        const groupedByBranch = tasks.reduce((acc, task) => {
          const branch = task.documento?.filiais?.f_nome || "Sem Filial";
          const conditions = task?.dc_condicoes || {};
          if (!acc[branch]) acc[branch] = { Pendente: [], "Não Aplicável": [], Conforme: [] };
  
          Object.entries(conditions).forEach(([key, value]) => {
            let status;
            if (value?.status === null) {
              status = "Não Aplicável";
            } else {
              status = value?.status ? "Conforme" : "Pendente";
            }
            acc[branch][status].push({
              name: key,
              process: task.documento?.tipo_documento?.td_desc,
              ...value,
              taskId: task.dc_id,
            });
          });
  
          return acc;
        }, {});
  
        setInitialData(groupedByBranch);
      } catch (error) {
        console.error("Log de erro: ", error);
      }
    };
    tasksData();
  }, []);
  
  

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData("task", JSON.stringify(task));
  };

  const handleDrop = (e, status, branch) => {
    const task = JSON.parse(e.dataTransfer.getData("task"));
    const updatedData = { ...initialData };
  
    // Remove do status atual dentro da filial
    Object.keys(updatedData[branch]).forEach((key) => {
      updatedData[branch][key] = updatedData[branch][key].filter((item) => item.name !== task.name);
    });
  
    // Atualiza o status booleano
    const newStatusBoolean = status === "Conforme" ? true : status === "Pendente" ? false : null;
  
    // Adiciona ao novo status dentro da filial
    updatedData[branch][status].push({ ...task, status: newStatusBoolean });
  
    setInitialData(updatedData);
    
    const dc_condicoes = {
      [task?.name]: {
        date: newStatusBoolean
          ? new Date().toISOString().slice(0, 10)
          : newStatusBoolean === null
          ? new Date().toISOString().slice(0, 10)
          : null,
        users: task?.users,
        dateCreate: task?.dateCreate,
        status: newStatusBoolean,
        statusProcesso: task?.statusProcesso,
      },
    };
  
    axios.put(`${API_URL}/document-condition/fechar-condicionante/${task?.taskId}`, { dc_condicoes })
      .then((response) => {
        return;
      })
      .catch((error) => {
        console.log("Log de erro: ", error);
      });
  };
  
  
 
  


  return (
    <>
      <Button
        size="small"
        shape="round"
        style={{ position: "absolute", right: 35 }}
        onClick={() => {setIconList(!iconList);}}
        icon={iconList ? <ListAltOutlinedIcon /> : <ViewKanbanOutlinedIcon />}
      >
        {iconList ? 'List' : 'Kanban'}
      </Button>

      {iconList ? (
  Object.keys(initialData).map((branch) => (
    <div key={branch} style={{ marginBottom: "20px" }}>
      <h2>{branch}</h2>
      <div style={{ display: "flex", gap: "20px", marginTop: 20 }}>
        {statuses.map((status) => (
          <div
            key={status}
            onDrop={(e) => handleDrop(e, status, branch)}
            onDragOver={(e) => e.preventDefault()}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              maxHeight: '800px',
              overflowY: 'auto'
            }}
          >
            <h3>
              {status}{" "}
              {status === "Conforme" ? (
                <CheckCircleOutlined style={{ color: "green" }} />
              ) : status === "Não Aplicável" ? (
                <ExclamationCircleOutlined style={{ color: "#c9c128" }} />
              ) : (
                <CloseCircleOutlined style={{ color: "red" }} />
              )}
            </h3>
            {(initialData[branch][status] || []).map((task) => (
              <div
                key={task.name}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                style={{
                  padding: "8px",
                  margin: "8px 0",
                  backgroundColor: task.status === null
                    ? "#f5ff66"
                    : task.status
                    ? "#d4edda"
                    : "#f8d7da",
                  borderRadius: "4px",
                  cursor: "grab",
                }}
              >
                <strong style={{ color: "#555" }}>{task.name}</strong>
                <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>
                  Processo: {task.process}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  ))
) : (
  <List
    style={{ marginTop: 30, maxHeight: "800px", overflowY: "auto" }}
    loading={loadTask}
    dataSource={dataTasks}
    renderItem={(item) => (
      <List.Item key={item.dc_id}>
        <List.Item.Meta
          title={
            <a>
              {item.documento?.tipo_documento?.td_desc} - {item.documento?.filiais?.f_nome}
            </a>
          }
          description={
            <ul>
              {Object.entries(item.dc_condicoes).map(([key, values]) => (
                <li key={key}>
                  <span
                    style={{
                      fontWeight: "bold",
                      color: values.status
                        ? "rgb(64, 129, 64)"
                        : values.status === null
                        ? "#fda400"
                        : "#c7473c",
                    }}
                  >
                    {key}
                  </span>{" "}
                  - {values.statusProcesso}
                </li>
              ))}
            </ul>
          }
        />
      </List.Item>
    )}
  />
)}

    </>
  );
};
    