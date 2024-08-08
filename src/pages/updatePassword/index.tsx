import React, { useEffect } from "react";
import { useUpdatePassword } from "@refinedev/core";
import { Form, Input, Button, Typography, Row, Col, Card } from "antd";
import { CircularProgress } from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { authProvider } from "../../authProvider";

const { Title } = Typography;


export const UpdatePassword = () => {
  const { mutate: updatePassword, isLoading } = useUpdatePassword();
  const { refreshToken, id } = useParams()
  const { checkRefreshToken }:any = authProvider; 
  checkRefreshToken({refreshToken})

  return (
    <div className="auth-page">
      <Row justify="center" align="middle" style={{ height: "100vh" }}>
        <Col xs={22} sm={16} md={12} lg={5}>
          <Title style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>Blp Doc</Title>
          <Card style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1)" }}>
            <div className="auth-container">
              <Title level={4} style={{ textAlign: "center", height: "60px", color: '#976DF2' }}>Redefina sua senha</Title>
              <Form
                layout="vertical"
                onFinish={(values) => {
                  updatePassword({...values, refreshToken, id});
                  
                }}
                requiredMark={false}
              >
                <Form.Item
                  name="password"
                  label="Senha"
                  rules={[{ required: true, message: "Senha invalida" }]}
                >
                  <Input.Password placeholder="********" />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="Confirmar Senha"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    { required: true, message: "Senha invalida" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('As senhas não coincidem!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="********" autoComplete="new-password" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" disabled={isLoading} block>
                      {isLoading ? <CircularProgress size={20} color={"secondary"} /> : "Redefinir"}
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
