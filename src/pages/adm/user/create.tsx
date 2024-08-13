import { CheckOutlined, CloseOutlined, UserAddOutlined } from "@ant-design/icons";
import { Create, Show, useForm } from "@refinedev/antd";
import { useMany, useTable } from "@refinedev/core";
import { Avatar, Checkbox, Form, Input, Select, Space, Switch, Typography } from "antd";
import { useEffect, useState } from "react";


export const AdmUserCreate = () => {
    const { tableQueryResult: companiesResult } = useTable({ resource: 'companies', syncWithLocation: true });
    const [valueID, setValueID] = useState(null);
    const [branchOptions, setBranchOptions] = useState([]);
    const [selectedBranches, setSelectedBranches] = useState([]);
    const { data: branchesResult } = useMany({ resource: 'branches', ids: valueID ? [valueID] : [] });
    const [pswTemp, setPswTemp] = useState<boolean>(true);
    const [nome, setNome] = useState<string>("")


    const companyOptions = companiesResult.data?.data?.map((company) => ({
        label: company.e_nome,
        value: company.e_id,
    }));

    
    
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
        <Create title="Criar Usuário" breadcrumb saveButtonProps={{ children: "Salvar" }}>
            <Show breadcrumb goBack title>
                <Avatar size={60}>{getInitialsAvatar(nome) ? getInitialsAvatar(nome) : <UserAddOutlined/> }</Avatar>
            </Show>
            <Form style={{ maxWidth: '100vh' }} labelAlign="left">
            
                <Form.Item rules={[{ required: true, type: "string", message: "Obrigatorio "}]}>
                    <Input placeholder="Nome Completo" onChange={(e)=>setNome(e.target.value)} />
                </Form.Item>

                <Form.Item rules={[{ required: true, type: "email", message: "E-mail inválido" }]}>
                    <Input placeholder="E-mail" />
                </Form.Item>
                

                <Form.Item rules={[{ required: true, type: "string", message: "Obrigatorio "}]}>
                    <Input.Password placeholder="Senha temporaria" disabled={!pswTemp}/>
                    
                    <Form.Item style={{marginBottom: 0}}>
                    <Switch onChange={(e)=>handleSwitchPsw(e)} checked={pswTemp} size="small" checkedChildren={<CheckOutlined/>} unCheckedChildren={<CloseOutlined/> }/>
                    <span style={{color: "#976DF2", fontSize: "10px"}}> {pswTemp ? "" : "Senha temporaria?"}</span>
                    </Form.Item>
                </Form.Item>

                <Form.Item>
                    <Select
                        mode="multiple"
                        loading={companiesResult.isLoading}
                        style={{ width: '100%' }}
                        placeholder="Empresa"
                        onChange={handleCompanyChange}
                        options={companyOptions}
                    />
                </Form.Item>

                <Form.Item>
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
            </Form>
        </Create>
    );
};