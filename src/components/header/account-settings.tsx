import { Button, Drawer } from 'antd';


type Props = {
    openModalUser: boolean; 
    setOpenModalUser: (openModalUser: boolean) => void;
    userName: String;
}

export const AccountSettings = ({openModalUser, setOpenModalUser, userName}: Props) => {

  const onClose = () => {
    setOpenModalUser(false);
  };

  return (
    <>
      <Drawer title="Configurações da Conta" onClose={onClose} open={openModalUser}>
        <h2>{String(userName).toUpperCase()}</h2>
        <p>Configurações da conta:</p>
        <p>Perfil de Usuario:</p>
      </Drawer>
    </>
  );
};
