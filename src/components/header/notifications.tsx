import React, { useEffect } from "react";
import { Avatar, Badge, Button, List, Popover } from "antd";
import { NotificationOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNotifications } from "../../contexts/NotificationsContext";

const NotificationsHeader: React.FC = () => {
  const { notifications, loading, fetchNotifications, markAsRead } = useNotifications();
  
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const content = (
    <List
    split
      itemLayout="horizontal"
      dataSource={notifications}
      loading={loading}
      size="small"
      style={{maxHeight: '400px', overflowY: 'auto'}}
      renderItem={(item, index) => (
        <List.Item onClick={() => (!item.n_lida ? markAsRead(item) : null)}>
          <List.Item.Meta
            avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
            title={<a href="https://ant.design">{item?.title}</a>}
            style={{cursor: item?.n_lida ? null : 'pointer',}}
            description={
              <span
                title="Clique para marcar como lido"
                style={{
                  fontWeight: item.n_lida ? "inherit" : "bolder",
                  color: item.n_lida ? "gray" : "#976DF2",
                }}
              >
                {item.n_mensagem}{" "}
                <span style={{ fontSize: "9px", color: "#888" }}>{dayjs(item.n_criado_em).fromNow()}</span>
              </span>
            }
          />
        </List.Item>
      )}
    />
  );

  return (
    <Popover
      content={content}
      placement="bottomRight"
      trigger="click"
      overlayStyle={{ width: 400 }}
    >
      <Badge
        count={notifications.filter((item) => !item.n_lida).length}
        size="small"
        showZero
      >
        <Button
          size="small"
          shape="circle"
          icon={<NotificationOutlined />}
          style={{ border: 0 }}
          type="primary"
          onClick={fetchNotifications}
        />
      </Badge>
    </Popover>
  );
};

export default NotificationsHeader;
