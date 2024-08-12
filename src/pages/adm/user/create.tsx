import { Create, useForm } from "@refinedev/antd";
import { useMany, useTable } from "@refinedev/core";
import { Form, Input, Select } from "antd";
import { useEffect, useState } from "react";

export const AdmUserCreate = () => {
    const { tableQueryResult: companiesResult } = useTable({ resource: 'companies', syncWithLocation: true });
    const [valueID, setValueID] = useState(null);
    const [branchOptions, setBranchOptions] = useState([]);
    const [selectedBranches, setSelectedBranches] = useState([]);
    const { data: branchesResult } = useMany({ resource: 'branches', ids: valueID ? [valueID] : [] });

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
            setSelectedBranches([]); // Limpa o campo de filial
        }
    }, [valueID, branchesResult]);

    const handleCompanyChange = (selectedCompanyIDs) => {
        const lastSelectedID = selectedCompanyIDs[selectedCompanyIDs.length - 1];
        setValueID(lastSelectedID);
        console.log("Último ID selecionado:", lastSelectedID);
    };

    const handleBranchChange = (selectedBranchIDs) => {
        setSelectedBranches(selectedBranchIDs);
    };

    const handleSearch = (value) => {
        // Implementar lógica de busca se necessário
        console.log("Valor de busca:", value);
    }


    return (
        <Create title="Criar Usuário" breadcrumb saveButtonProps={{ children: "Salvar" }}>
            <Form style={{ maxWidth: '100vh' }} labelAlign="left">
                <Form.Item rules={[{ required: true, type: "string", message: "Obrigatorio "}]}>
                    <Input placeholder="Nome Completo" />
                </Form.Item>

                <Form.Item rules={[{ required: true, type: "email", message: "E-mail inválido" }]}>
                    <Input placeholder="E-mail" />
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
                        onSearch={handleSearch}
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    />
                </Form.Item>
            </Form>
        </Create>
    );
};