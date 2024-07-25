import { AuthPage, ThemedHeaderV2, ThemedTitleV2 } from "@refinedev/antd";
import FormItemLabel from "antd/lib/form/FormItemLabel";
import { lazy } from "react";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      title={
        <ThemedTitleV2
          collapsed={false}
          text="Blp Doc"
        />
      }
      registerLink={false}
      forgotPasswordLink={false}
      
      formProps={{
        
        initialValues: {  email: "", password: "" }
      }}

    />
  );
};
