import React from 'react';
import { Button, Dropdown, Flex, MenuProps, Space, Tooltip } from 'antd';
import { DownOutlined, NotificationOutlined } from '@ant-design/icons';


const items: MenuProps['items'] = [
    {
      label: "Notificação 01",
      key: '0',
    },
    {
      label: "Notificação 02",
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: "Nova Notificação",
      key: '3',
    },
  ];




const NotificationsHeader: React.FC = () => (
    <>
    <Flex gap="small" vertical>
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
    </Flex>
    

    </>
);

export default NotificationsHeader;