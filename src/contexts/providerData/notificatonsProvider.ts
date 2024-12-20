import { API_URL } from "../../authProvider"

//funcção de listagem de notificações
export const handlerListNotifications = async ({
    setLoadingListNotificantion,
    setNotifications
})=>{
    try {
      setLoadingListNotificantion(true)
      const response = await axios.post(`${API_URL}/notifications/listar-notificacoes`)
      setLoadingListNotificantion(false)
      setNotifications(response.data)
    } catch (error) {
      console.log('log de erro: ', error)
    }
  }