import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Divider, Dropdown, Flex, List, MenuProps, notification, Popover, Space, Tooltip } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';
import socket from '../../config/socket';
import axios from 'axios';
import { API_URL } from '../../authProvider';
import dayjs from 'dayjs';


const data = [
  {
    title: 'Notificação do App 1',
  },
  {
    title: 'Notificação do App 2',
  },
  {
    title: 'Notificação do App 3',
  },
  {
    title: 'Notificação do App 4',
  },
];




const NotificationsHeader: React.FC = () => {
  const [userTK, setUserTK] = useState<any>(JSON.parse(localStorage.getItem('refine-user')).id);
  const [open, setOpen] = useState(false);
  const [loadingListNotificantion, setLoadingListNotificantion] = useState(false)
  const [notifications, setNotifications] = useState([])


        //funcção de listagem de notificações
        const handlerListNotifications = async ()=>{
          try {
            setLoadingListNotificantion(true)
            const response = await axios.post(`${API_URL}/notifications/listar-notificacoes`)
            setLoadingListNotificantion(false)
            setNotifications(response.data)
          } catch (error) {
            console.log('log de erro: ', error)
          }
        }

        //função de marcar como lido
        const handlerMarkRead = async (data: any) =>{
          try {

            const response = await axios.put(`${API_URL}/notifications/marcarLido/${data?.n_id}`)
            await handlerListNotifications()
          } catch (error) {
            console.error('Log error: ', error)
          }
        }



        const content = (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            loading={loadingListNotificantion}
            loadMore={loadingListNotificantion}
            renderItem={(item, index) => (
              <List.Item onClick={()=>{item?.n_lida ? null : handlerMarkRead(item)}}>
                <List.Item.Meta
                  
                  style={{cursor: item?.n_lida ? 'default' : 'pointer'}}
                  avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                  title={<a href="https://ant.design">{item.title}</a>}
                  description={<span title='Clique para marcar como lido' style={{fontWeight: item?.n_lida ? 'inherit' : 'bolder', color: item?.n_lida ? 'gray' : '#976DF2'}}>{item?.n_mensagem} <span style={{ fontSize: '9px', color: '#888' }}>{dayjs(item?.n_criado_em).fromNow()}</span></span>}
                />
              </List.Item>
            )}
          />
        );

        useEffect(() => {
          const userId = userTK; // Substitua pelo ID do usuário logado
          socket.emit("join", userId);
        
          // Escuta eventos de notificações
          socket.on("nova_notificacao", (data) => {
            notification.open({
              message: "Nova Notificação",
              description: `${data?.mensagem}.`,
            });
          });
        
          return () => {
            socket.off("nova_notificacao"); // Limpa os listeners ao desmontar
          };
        }, [userTK]);

        return (
          <Popover 
            content={content}
            placement="bottomRight"
            trigger="click"
            onOpenChange={(newOpen) => setOpen(newOpen)}
            overlayStyle={{ width: 400 }}
          >
            <Badge count={Object.entries(notifications || {}).filter(([key, value])=>value?.n_lida == false).length } size='small' showZero>
              <Button
              size='small' 
                shape='circle' icon={<NotificationOutlined />}
                style={{ border: 0 }}
                type='primary'
                onClick={handlerListNotifications}
              />
            </Badge>
          </Popover>
        );
      };
export default NotificationsHeader;
