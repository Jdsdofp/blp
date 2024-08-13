import { Create, useForm } from "@refinedev/antd";
import { useMany, useTable } from "@refinedev/core";
import { Checkbox, Form, Input, Select, Typography } from "antd";
import { useEffect, useState } from "react";


export const AdmUserCreate = () => {
    const { Title, displayName } = Typography;
    const { tableQueryResult: companiesResult } = useTable({ resource: 'companies', syncWithLocation: true });
    const [valueID, setValueID] = useState(null);
    const [branchOptions, setBranchOptions] = useState([]);
    const [selectedBranches, setSelectedBranches] = useState([]);
    const { data: branchesResult } = useMany({ resource: 'branches', ids: valueID ? [valueID] : [] });
    const [pswTemp, setPswTemp] = useState(Boolean)


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
  
    
    const handleCheckPsw = (e) =>{
        setPswTemp(e.target.checked)
    }

    const handleCompanyChange = (selectedCompanyIDs) => {
        const lastSelectedID = selectedCompanyIDs[selectedCompanyIDs.length - 1];
        setValueID(lastSelectedID);
    };

    const handleBranchChange = (selectedBranchIDs) => {
        setSelectedBranches(selectedBranchIDs);
    };

    console.log(pswTemp)
    return (
        <Create title="Criar Usuário" breadcrumb saveButtonProps={{ children: "Salvar" }}>
            <Form style={{ maxWidth: '100vh' }} labelAlign="left">
                <Form.Item rules={[{ required: true, type: "string", message: "Obrigatorio "}]}>
                    <Input placeholder="Nome Completo" />
                </Form.Item>

                <Form.Item rules={[{ required: true, type: "email", message: "E-mail inválido" }]}>
                    <Input placeholder="E-mail" />
                </Form.Item>
                

                <Form.Item rules={[{ required: true, type: "string", message: "Obrigatorio "}]}>
                    <Input.Password placeholder="Senha temporaria" disabled={pswTemp}/>
                <Form.Item>
                    
                    <Checkbox onChange={(e)=>handleCheckPsw(e)}><span style={{color: "#976DF2"}}>Senha temporaria ?</span></Checkbox>
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