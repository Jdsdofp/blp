import React, { useState } from 'react';
import { Avatar, Badge, Button, Divider, Dropdown, Flex, List, MenuProps, Popover, Space, Tooltip } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';


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
  const [open, setOpen] = useState(false);

        const content = (
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                  title={<a href="https://ant.design">{item.title}</a>}
                  description="Esta é apenas uma notificação teste exemplo de um novo documento cadastrado/vencido/preste a vencer e etc e tal"
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
            onOpenChange={(newOpen) => setOpen(newOpen)}
            overlayStyle={{ width: 400 }}
          >
            <Badge count={0} size='small' showZero>
              <Button 
                shape='circle' icon={<NotificationOutlined />}
                style={{ border: 0 }}
                type='primary'
              />
            </Badge>
          </Popover>
        );
      };
export default NotificationsHeader;

{/* <Flex gap="small" vertical>
<Flex wrap gap="small">
    
    <Dropdown menu={{ items }} trigger={['click']} placement="topRight">

    <a onClick={(e) => e.preventDefault()}>
    <Space>
    <Tooltip title="Notificações" placement='left'>
        <Button type="primary" shape="circle"  icon={<NotificationOutlined />} />
    </Tooltip>
    </Space>
    </a>
</Dropdown>


</Flex>
</Flex> */}