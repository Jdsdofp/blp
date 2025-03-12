
import { Drawer, List, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

type Props = {
  openDrwOn: boolean;
  setOpenDrwOn: (openDrwOn: boolean) => void;
};

export default function OnlineUsersDrawer({ openDrwOn, setOpenDrwOn }: Props) {

  return (
    <>
      <Drawer
        title="Usuários Online"
        placement="right"
        open={openDrwOn}
        onClose={() => setOpenDrwOn(false)}
        width={300}
      >
        <List
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
