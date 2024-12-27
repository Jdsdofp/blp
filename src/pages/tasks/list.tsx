import { List } from "antd"
import axios from "axios"
import { useEffect, useState } from "react"
import { API_URL } from "../../authProvider"



export const ListTasks = ()=>{
    const [loadTask, setLoadTask] = useState(false)
    const [dataTasks, setDataTasks] = useState([])


    useEffect(()=>{
        const tasksData = async ()=>{
            setLoadTask(true)
            try {
                const response = await axios.get(`${API_URL}/document-condition/listar-tarefas-usuario`)
                setLoadTask(false)
                await setDataTasks(response?.data)

            } catch (error) {
                console.error('Log de erro: ', error)
            }
        }
        return ()=> {
            tasksData()
        };
    },[!!dataTasks])
    
    console.log(Object.keys(dataTasks?.map(d=>d?.status)))
    return(
        <List loading={loadTask} dataSource={dataTasks?.map(d=>d)} renderItem={(item)=>(
            <List.Item key={item?.dc_id}>
                {console.log('item ', Object.entries(item?.dc_condicoes).map(([key, values])=>values?.status))}
              <List.Item.Meta
                title={<a>{item?.documento?.tipo_documento?.td_desc} - {item?.documento?.filiais?.f_nome} </a>}
                description={(<>{Object?.entries(item?.dc_condicoes).map(([key, values]) => (<li key={key}><span style={{fontWeight: 'bold', color: values?.status ?'rgb(64, 129, 64)' : values?.status === null ? "#fda400" : '#c7473c' }}>{key}</span> - {values?.statusProcesso}</li>))}</>)}/>
                
                <ul>
                </ul>
            </List.Item>
            
            
        )}/>
    )
}