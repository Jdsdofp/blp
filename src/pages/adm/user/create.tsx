import { Create, useForm } from "@refinedev/antd";
import { useMany, useTable } from "@refinedev/core";
import { Form, Input, Select } from "antd";
import { useState } from "react";

export const AdmUserCreate = () => {
    const { tableQueryResult: companiesResult } = useTable({ resource: 'companies', syncWithLocation: true });
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
    const { data: branchesData, isLoading: isBranchesLoading  } = useMany({ resource: 'branches', ids: selectedCompanyId ? [selectedCompanyId] : [] });

    const companyOptions = companiesResult.data?.data?.map((company) => ({
        label: company.e_nome,
        value: company.e_id,
    }));

    const branchOptions = branchesData?.data?.map((branch) => ({
        label: branch.f_nome,
        value: branch.f_id,
    })) || [];

    const handleCompanyChange = (value: number) => {
        setSelectedCompanyId(value);
        console.log("empresa", selectedCompanyId)
    };
    

    return (
        <Create title="Criar Usuário" breadcrumb saveButtonProps={{ children: "Salvar" }}>
            <Form style={{ maxWidth: '100vh' }} labelAlign="left">
                <Form.Item>
                    <Input placeholder="Nome Completo" />
                </Form.Item>

                <Form.Item rules={[{ required: true, type: "email", message: "E-mail inválido" }]}>
                    <Input placeholder="E-mail" />
                </Form.Item>

                <Form.Item label="Empresas" name="companyIds" rules={[{ required: true }]}>
                <Select
                    mode="multiple"
                    loading={isCompaniesLoading}
                >
                    {companiesResult?.data.map((company) => (
                        <Select.Option key={company.e_id} value={company.id}>
                            {company.e_nome}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

                <Form.Item label="Filiais" name="branchIds" rules={[{ required: true }]}>
                <Select
                    mode="multiple"
                    loading={isBranchesLoading}
                >
                    {branchesData?.data.map((branch) => (
                        <Select.Option key={branch.f_id} value={branch.id}>
                            {branch.f_nome}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            </Form>
        </Create>
    );
};