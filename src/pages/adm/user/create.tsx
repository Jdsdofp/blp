import { Create, useForm } from "@refinedev/antd"
import { useMany, useTable } from "@refinedev/core";
import { Form, Input, Select } from "antd"
import { useState } from "react";




export const AdmUserCreate = () =>{
    const { tableQueryResult: companiesResult } = useTable({ resource: 'companies', syncWithLocation: true });
    const [valueID, setValueID] = useState()
    const { data: branchesResult } = useMany({resource: 'branches', ids: valueID ? [valueID] : []});
    
    
    const options = companiesResult.data?.data?.map((company) => ({
        label: company.e_nome,
        value: company.e_id,
    }));
    
    const branchs = branchesResult?.data?.map((branch) => ({
        label: branch.f_nome,
        value: branch.f_id,
    })) || [];
  

    const handleChange = (e_id: number[])=>{
        e_id.map((id: number)=>{
            setValueID(id)
        })
    }

    
    
    return (
        <Create title="Criar Usuário" breadcrumb saveButtonProps={{children: "Salvar" }}>
            <Form style={{maxWidth: '100vh'}}  labelAlign="left" >
                <Form.Item >
                    <Input placeholder="Nome Completo"/>
                </Form.Item>

                <Form.Item rules={[{ required: true,  type: "email", message: "E-amil invalido"}]}>
                    <Input  placeholder="E-mail"/>
                </Form.Item>

                <Form.Item>
                <Select
                mode="multiple"
                loading={companiesResult.isLoading}
                style={{ width: '100%' }}
                placeholder="Empresa"
                onChange={handleChange}
                options={options}
                />
                </Form.Item>

                <Form.Item>
                <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Filial"
                />
                </Form.Item>
            
            <h2>{[valueID]}</h2>
            </Form>
        </Create>
    )
}