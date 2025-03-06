import React, { useState, useEffect } from "react";
import { Drawer, Button, List, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import socket from "../../config/socket";

type Props = {
  openDrwOn: boolean;
  setOpenDrwOn: (openDrwOn: boolean) => void;
};

export default function OnlineUsersDrawer({ openDrwOn, setOpenDrwOn }: Props) {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("refine-user"));
    if (user?.nome) {
      socket.emit("user_connected", user.nome);
    }

    // Função para atualizar a lista de usuários online
    const handleUpdateUsers = (users: string[]) => {
      console.log("Usuários online recebidos:", users);
      setOnlineUsers(users);
    };

    // Registrar evento de atualização de usuários
    socket.on("update_online_users", handleUpdateUsers);

    return () => {
      // Remover o listener ao desmontar
      socket.off("update_online_users", handleUpdateUsers);
    };
  }, []); // Executa apenas uma vez ao montar

  // console.log('chamada de users online: ', onlineUsers)
  
  return (
    <>
      {/* Drawer lateral */}
      <Drawer
        title="Usuários Online"
        placement="right"
        open={openDrwOn}
        onClose={() => setOpenDrwOn(false)}
        width={300}
      >
        <List
          dataSource={onlineUsers}
          renderItem={(user) => (
            <List.Item>
              <List.Item.Meta avatar={<Avatar icon={<UserOutlined />} />} title={user} />
            </List.Item>
          )}
        />
      </Drawer>
    </>
  );
};
