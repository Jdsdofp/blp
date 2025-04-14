import { useContext, useState } from "react";
import { Modal, Button } from "antd";
import { ExpandOutlined, CompressOutlined, CloseOutlined } from "@ant-design/icons";
import { ConsultDocs } from "../listConsult";
import { ColorModeContext } from "../../../contexts/color-mode";
import '../style.css';
import GridTable, { AGGridExample, GridFiliais } from "./GridTable";
import GridExample from "./GridTable";

type Props = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ModalConsult = ({ isVisible, setIsVisible }: Props) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { mode } = useContext(ColorModeContext); // Pegando o modo corretamente

  const toggleFullScreen = () => {
    setIsFullScreen(true);
    setIsVisible(false); // Fecha o modal para abrir em tela cheia
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
    setIsVisible(true); // Reabre o modal ao sair da tela cheia
  };

  console.log("Cor do Modo:", mode); // Verifica se mode está correto

  // Definição das cores de fundo de acordo com o modo
  const backgroundColor = mode === "dark" ? "#1E1E1E" : "#FFFFFF"; // Melhor tom para modo escuro
  const textColor = mode === "dark" ? "#F5F5F5" : "#000000";

  return (
    <>
      {/* Modal Padrão */}
      <Modal
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Consulta</span>
            <Button type="text" onClick={toggleFullScreen} icon={<ExpandOutlined />} />
          </div>
        }
        open={isVisible}
        onCancel={() => setIsVisible(false)}
        footer={null}
        width={600}
      >
       <GridExample />
      </Modal>

      {/* Tela Cheia */}
      {isFullScreen && (
        <div style={{ ...fullScreenStyle, backgroundColor }}>
          <div style={{ ...headerStyle, backgroundColor }}>
            <h2 style={{ margin: 0, color: textColor }}>Consulta</h2>
            <div>
              <Button type="text" onClick={closeFullScreen} icon={<CompressOutlined />} />
              <Button type="text" onClick={() => setIsFullScreen(false)} icon={<CloseOutlined />} />
            </div>
          </div>
          <div style={{ ...contentStyle, backgroundColor }}>
          <GridExample />
          </div>
        </div>
      )}
    </>
  );
};

// Estilos para a tela cheia
const fullScreenStyle = {
  position: "fixed",
  margin: 0,
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: 1000,
  display: "flex",
  flexDirection: "column" as "column",
};

const headerStyle = {
  padding: "16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #ddd",
};

const contentStyle = {
  flex: 1,
  padding: "16px",
  overflow: "auto",
};
