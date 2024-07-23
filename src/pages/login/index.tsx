import React from "react";
import { useLogin } from "@refinedev/core";
import { Form, Input, Button, Typography, Row, Col, Card } from "antd";
import { ColorModeContext, ColorModeContextProvider } from "../../contexts/color-mode";


const { Title } = Typography;

export const Login = () => {
  const { mutate: login } = useLogin();

  return (
    <div className="auth-page">
      <Row justify="center" align="middle" style={{ height: "100vh" }}>
        
        <Col xs={22} sm={16} md={12} lg={5}>
          <Title style={{textAlign: 'center', color: '#aad2ff', fontFamily: 'sans-serif'}}>Blp Doc</Title>
          <Card style={{boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
            <div className="auth-container">
              <Title level={4} style={{ textAlign: "center", height: "60px", color: '#4096ff' }}>Faça login em sua conta</Title>
              <Form
                layout="vertical"
                onFinish={(values) => {
                  login(values);
                }}
                requiredMark={false}
                
              >
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, type: "email", message: "E-mail invalido" }]}
                >
                  <Input placeholder="E-mail" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Senha"
                  rules={[{ required: true, message: "Senha invalida" }]}
                >
                  <Input.Password placeholder="Senha" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </Col>
      </Row>
    </div>

  );
};