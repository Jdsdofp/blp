import { AuthPage, ThemedHeaderV2, ThemedTitleV2 } from "@refinedev/antd";
import style from './styles.css'
import { image } from "@uiw/react-md-editor";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      registerLink={false}
      forgotPasswordLink={false}
      formProps={{
        initialValues: { email: "", password: "" },
      }}
      

      
    />
  );
};
