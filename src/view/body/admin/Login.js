import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from "@ant-design/icons";
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
  ProConfigProvider,
} from "@ant-design/pro-components";
import cookie from "react-cookies";
import { message, Space, Tabs } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../../src/logo.png";
import { service } from "../../../service/ServicePool";
const iconStyles = {
  marginInlineStart: "16px",
  color: "rgba(0, 0, 0, 0.2)",
  fontSize: "24px",
  verticalAlign: "middle",
  cursor: "pointer",
};

export default () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState("account");
  const onFinish = async (values) => {
    const { username, password } = values;
    console.log("username:" + username);
    console.log("password:" + password);
    service
      .login2(username, password)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.token?.AccessToken) {
          message.success("登入成功!");
          console.log(result);
          cookie.save("token", result.token.AccessToken);
          navigate("/admin", { replace: true });
        } else {
          message.error("登入失敗!");
        }
      });
  };
  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: "white" }}>
        <LoginForm
          submitter={{ searchConfig: { submitText: "Login" } }}
          logo={logo}
          title="Couchspace"
          subTitle="Couchspace管理平台"
          actions={<Space></Space>}
          onFinish={(v) => onFinish(v)}
        >
          <Tabs centered activeKey={loginType}>
            <Tabs.TabPane key={"account"} tab={"帳號密碼"} />
          </Tabs>
          {loginType === "account" && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: "large",
                  prefix: <UserOutlined className={"prefixIcon"} />,
                }}
                placeholder={"帳號:"}
                rules={[
                  {
                    required: true,
                    message: "請輸入帳號!",
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: "large",
                  prefix: <LockOutlined className={"prefixIcon"} />,
                }}
                placeholder={"密碼:"}
                rules={[
                  {
                    required: true,
                    message: "請輸入密碼",
                  },
                ]}
              />
            </>
          )}
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};
