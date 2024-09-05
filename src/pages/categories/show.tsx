import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";
import { useParams } from "react-router-dom";

const { Title } = Typography;

export const DocumentShow = () => {

  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const filialId = queryParams.get("filialId");

  

  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show>
      <Title level={5}>{"ID"}</Title>
      <TextField value={filialId} />
      <Title level={5}>{"Title"}</Title>
      <TextField value={status} />
    </Show>
  );
};
