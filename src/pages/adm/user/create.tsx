import { Create } from "@refinedev/antd"
import { Form, Input } from "antd"
import { useEffect, useState } from "react"




export const AdmUserCreate = () =>{

    return (
        <Create title="Criar Usuário" breadcrumb saveButtonProps={{children: "Salvar", }}>
            <Form  style={{maxWidth: '100vh'}}  labelAlign="left" >
                <Form.Item >
                    <Input placeholder="Nome Completo"/>
                </Form.Item>

                <Form.Item >
                    <Input placeholder="E-mail"/>
                </Form.Item>
            </Form>
        </Create>
    )
}