import React from "react";
import { useUpdatePassword } from "@refinedev/core";
import { Form, Input, Button, Typography, Row, Col, Card } from "antd";

const {Title} = Typography;

export const ForgotPassword = () => {
  const {mutate: updatePassword } = useUpdatePassword()
  return (


      <div className="auth-page">
        <Row justify="center" align="middle" style={{ height: "100vh" }}>
          
          <Col xs={22} sm={16} md={12} lg={5}>
            <Title style={{textAlign: 'center', fontFamily: 'sans-serif'}}>Blp Doc </Title>
            <Card style={{boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
              <div className="auth-container">
                <Title level={4} style={{ textAlign: "center", height: "60px", color: '#976DF2' }}>Redefina sua senha</Title>
                <Form
                  layout="vertical"
                  onFinish={(values) => {
                    updatePassword(values);
                  }}
                  requiredMark={false}
                  
                >
                  <Form.Item
                    name="password"
                    label="Senha"
                    rules={[{ required: true,  message: "Senha invalida" }]}
                  >
                    <Input.Password placeholder="********" />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    label="Confirmar Senha"
                    rules={[{ required: true, message: "Senha invalida" }]}
                  >
                    <Input.Password placeholder="********" />
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
)
};
