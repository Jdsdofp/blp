import { Popover } from "antd"
import axios from "axios"
import { API_URL } from "../../../authProvider"


export const ModalProress = ({children, dc_id})=>{
    console.log('Dados Recebido: ', dc_id)

    const hendlerConditionsProgress = async () =>{
        try {
            const response = await axios.get(`${API_URL}/document-condition/listar-documento-condicionante/${dc_id}`)
            console.log('Dados recebidos...:', dc_id)
        } catch (error) {
            
        }
    }

    return (
        <>
        </>
    )
}