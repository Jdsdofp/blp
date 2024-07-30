import { DateField } from '@refinedev/antd';
import { useGetIdentity, useIsAuthenticated } from '@refinedev/core';
import { Drawer, Typography } from 'antd';



const {Title, Text} = Typography;

type Props = {
    openModalUser: boolean; 
    setOpenModalUser: (openModalUser: boolean) => void;
}


export const AccountSettings = ({openModalUser, setOpenModalUser}: Props) => {
const { data: identify } = useGetIdentity()


  const onClose = () => {
    setOpenModalUser(false);
  };
  
  return (
    <>
      <Drawer title="Configurações da Conta" onClose={onClose} open={openModalUser}>
        <Title level={5}>{String(identify?.nome).toUpperCase()}</Title>
        <p>Configurações da conta:</p>
        <p>Tempo de Sessão: <span style={{'fontSize': 10, fontFamily: 'inherit'}}>{identify?.session}</span></p>
      </Drawer>
    </>
  );
};
