import React, { useContext, useState } from "react";
import { useLogin } from "@refinedev/core";
import { Form, Input, Button, Typography, Row, Col, Card, Image } from "antd";
import { CircularProgress } from "@mui/material";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export const Login = () => {
  const { mutate: login, isLoading } = useLogin();
  const [modeColor, setModeColor] = useState(localStorage.getItem('colorMode'));
   
  return (
    <div className="auth-page" style={{ background: modeColor === 'dark' ? '#333' : 'white', height: '100vh' }}>
      <Row justify="space-between" style={{ height: '100%', margin: 0 }}>
        {/* Coluna Esquerda - Logo e Texto */}
        <Col xs={0} lg={12} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '2rem',
          background: modeColor === 'dark' ? '#222' : '#ededed'
        }}>
          <div style={{ maxWidth: 500 }}>
            <Image 
              src="/lg_Drogaria_Globo 1.png" 
              preview={false}
              style={{ marginBottom: '2rem' }}
            />
            <Title level={2} style={{ color: '#009cde', marginBottom: '1rem' }}>
              Bem-vindo ao LegaliSys
            </Title>
            <Paragraph style={{ fontSize: '1.1rem', color: '#666' }}>
              Sistema integrado de gestão jurídica. Faça login para acessar todas as funcionalidades 
              e ferramentas disponíveis para o gerenciamento de processos e documentos legais.
            </Paragraph>
          </div>
        </Col>

        {/* Coluna Direita - Formulário */}
        <Col xs={24} lg={12} style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '2rem'
        }}>
          <div style={{ maxWidth: 400, width: '100%' }}>
            <Card style={{ 
              boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
              border: 'none'
            }}>
              <Title level={3} style={{ 
                textAlign: "center", 
                marginBottom: '2rem', 
                color: "#009cde"
              }}>
                Faça login em sua conta
              </Title>
              
              <Form
                layout="vertical"
                onFinish={(values) => login(values)}
                requiredMark={false}
              >
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, type: "email", message: "E-mail inválido" }]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="E-mail" 
                    disabled={isLoading}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Senha"
                  rules={[{ required: true, message: "Senha inválida" }]}
                >
                  <Input.Password 
                    prefix={<LockOutlined />}  
                    placeholder="********" 
                    disabled={isLoading}
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    disabled={isLoading} 
                    block
                    style={{ height: 40 }}
                  >
                    {isLoading ? <CircularProgress size={20} color={"primary"} /> : "Entrar"}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};