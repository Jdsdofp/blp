import { CheckOutlined, CloseOutlined, UserAddOutlined } from "@ant-design/icons";
import { Create, Show, useForm } from "@refinedev/antd";
import { useMany, useTable } from "@refinedev/core";
import { Avatar, Checkbox, Form, Input, message, Select, Space, Switch, Typography } from "antd";
import { useEffect, useState } from "react";


export const AdmUserCreate = () => {
    const { tableQueryResult: companiesResult } = useTable({ resource: 'companies', syncWithLocation: true });
    const [valueID, setValueID] = useState(null);
    const [branchOptions, setBranchOptions] = useState([]);
    const [selectedBranches, setSelectedBranches] = useState([]);
    const { data: branchesResult } = useMany({ resource: 'branches', ids: valueID ? [valueID] : [] });
    const [pswTemp, setPswTemp] = useState<boolean>(true);
    const [nome, setNome] = useState<string>("");
    
    
    
    
    const { Item: FormItem } = Form;
    
    interface IUser {
        u_nome: string;
        u_email: string;
        u_senha: string;
        u_empresas_ids: number[];
        u_filiais_ids: number[];
        u_senhatemporaria: boolean;
    }
    

    const companyOptions = companiesResult.data?.data?.map((company) => ({
        label: company.e_nome,
        value: company.e_id,
    }));

    const {formProps, saveButtonProps, formLoading } = useForm<IUser>({
        action: "create", 
        resource: "userCreate", 
        successNotification(data, values, resource) {
        return{
            message: `${data?.data?.message}`,
            type: "success"
        }},
        errorNotification(error, values, resource) {
            return{
                message: `${error?.response.data.message}`,
                type: 'error'
            }
        },
    })
    
    useEffect(() => {
        if (valueID) {
            const branchs = branchesResult?.data?.map((branch) => ({
                label: branch.f_nome,
                value: branch.f_id,
            })) || [];
            setBranchOptions(branchs);
        } else {
            setBranchOptions([]);
            setSelectedBranches([]);
        }
    }, [valueID, branchesResult]);
  
    const handleSwitchPsw = (e: boolean) =>{
        setPswTemp(e)
        formProps.form.setFieldsValue({ u_senhatemporaria: e });
    }



    const handleCompanyChange = (selectedCompanyIDs) => {
        const lastSelectedID = selectedCompanyIDs[selectedCompanyIDs.length - 1];
        setValueID(lastSelectedID);
    };

    const handleBranchChange = (selectedBranchIDs) => {
        setSelectedBranches(selectedBranchIDs);
    };

    const getInitialsAvatar = (e: string) =>{
        const nomeArrays = e.split(" ");
        const initials = nomeArrays.map((n)=>n[0]).join("");
        return initials.toUpperCase();
    }



    return (
        <Create title="Criar Usuário" breadcrumb saveButtonProps={{...saveButtonProps, children: "Salvar", loading: formLoading}}>
            <div style={{margin: 10}}>
                <Avatar size={60}>{getInitialsAvatar(nome) ? getInitialsAvatar(nome) : <UserAddOutlined/> }</Avatar>
            </div>
           
            <Form {...formProps} style={{ maxWidth: '100vh' }} labelAlign="left">
            
                <Form.Item name="u_nome" rules={[{ required: true, type: "string", message: "Obrigatorio "}]} >
                    <Input placeholder="Nome Completo" onChange={(e)=>setNome(e.target.value)}/>
                </Form.Item>

                <Form.Item name="u_email" rules={[{ required: true, type: "email", message: "E-mail inválido" }]}>
                    <Input placeholder="E-mail"/>
                </Form.Item>

                <Form.Item name="u_senha">
                    <Input.Password  placeholder="Senha" disabled={!pswTemp} />                    
                </Form.Item>
                

                <Form.Item name="u_empresas_ids">
                    <Select
                        mode="multiple"
                        loading={companiesResult.isLoading}
                        style={{ width: '100%' }}
                        placeholder="Empresa"
                        onChange={handleCompanyChange}
                        options={companyOptions}
                    />
                </Form.Item>

                <Form.Item name="u_filiais_ids">
                    <Select
                        mode="multiple"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Filial"
                        options={branchOptions}
                        value={selectedBranches}
                        onChange={handleBranchChange}
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    />
                </Form.Item>
                <Form.Item name="u_senhatemporaria" style={{marginBottom: 0}}>
                    <Switch onChange={(e)=>handleSwitchPsw(e)} checked={pswTemp} size="small" checkedChildren={<CheckOutlined/>} unCheckedChildren={<CloseOutlined/> }/>
                    <span style={{color: pswTemp ? "#976DF2" : "#8C8C8C", fontSize: "10px"}}> Senha temporaria?</span>
                </Form.Item>
            </Form>
        </Create>
    );
};