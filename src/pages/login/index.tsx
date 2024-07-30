import React from "react";
import { useLogin } from "@refinedev/core";
import { Form, Input, Button, Typography, Row, Col, Card } from "antd";
import { CircularProgress } from "@mui/material";


const { Title } = Typography;


export const Login = () => {
  const { mutate: login, isLoading } = useLogin();

  return (
    <div className="auth-page">
      <Row justify="center" align="middle" style={{ height: "100vh" }}>
        
        <Col xs={22} sm={16} md={12} lg={5}>
          <Title style={{textAlign: 'center', fontFamily: 'sans-serif'}}>Blp Doc</Title>
          <Card style={{boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1)"}}>
            <div className="auth-container">
              <Title level={4} style={{ textAlign: "center", height: "60px" }}>Faça login em sua conta</Title>
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

                <Input placeholder="E-mail" disabled={isLoading}/>
                
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Senha"
                  rules={[{ required: true, message: "Senha invalida" }]}
                >
                  <Input.Password  placeholder="********" disabled={isLoading}/>
                
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" disabled={isLoading} block>
                    {isLoading ? <CircularProgress size={20} color={"secondary"} /> : "Login"}
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