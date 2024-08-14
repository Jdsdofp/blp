import React, { useState } from "react";

import { useGetIdentity, useLogout } from "@refinedev/core";

import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd/lib";
import { Avatar } from "antd";
import { AccountSettings } from "./header/account-settings";



export const CurentUser: React.FC = () =>{
    const { data: user } = useGetIdentity<IUser>();
    const {mutate: logout} = useLogout();
    const [ openModalUser, setOpenModalUser] = useState(false);

    const getInitialsAvatar = (e: string) =>{
      const nomeArrays = e.split(" ");
      const initials = nomeArrays.map((n)=>n[0]).join("");
      return initials.toUpperCase();
  }

    const content = (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "12px 20px",
            }}
          >
            {user?.nome}
          </div>
          <div
            style={{
              borderTop: "1px solid #d9d9d9",
              padding: "4px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <Button
              style={{ textAlign: "left" }}
              onClick={()=>setOpenModalUser(true)}
              icon={<SettingOutlined />}
              type="text"
              block
              
            >
              Configurações de Conta
            </Button>
            <Button
              style={{ textAlign: "left" }}
              icon={<LogoutOutlined />}
              type="text"
              danger
              block
              onClick={() => logout()}
            >
              Sair
            </Button>
          </div>
        </div>
      );
      
      return (
        <>
          
          <Popover
            placement="bottomRight"
            content={content}
            trigger="click"
            overlayInnerStyle={{ padding: 0 }}
            overlayStyle={{ zIndex: 999 }}
          >
            <Avatar
              nome={user?.nome}
              src={user?.avatarUrl}
              size="large"
              style={{ cursor: "pointer" }}
            ></Avatar>
          </Popover>


          {
            user && (
              <AccountSettings
                openModalUser={openModalUser}
                setOpenModalUser={setOpenModalUser}
                userName={user?.nome}
              />
            )
          }
        </>
      );
}