import React, { useEffect, useState } from "react";
import { Avatar, Button, Layout, Space } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import { service, memberService } from "../../../service/ServicePool";

const { Header } = Layout;

function AdminHeader() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("Admin");
  const [adminPhoto, setAdminPhoto] = useState("");
  const headerStyle = {
    textAlign: "center",
    color: "#fff",
    height: 64,
    paddingInline: 48,
    lineHeight: "64px",
    backgroundColor: "#4096ff",
  };
  const contentStyle = {
    textAlign: "center",
    minHeight: 120,
    lineHeight: "120px",
    color: "#fff",
    backgroundColor: "#0958d9",
  };
  const siderStyle = {
    textAlign: "center",
    lineHeight: "120px",
    color: "#fff",
    backgroundColor: "#1677ff",
  };
  const footerStyle = {
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#4096ff",
  };
  const layoutStyle = {
    borderRadius: 8,
    overflow: "hidden",
    width: "calc(50% - 8px)",
    maxWidth: "calc(50% - 8px)",
  };
  useEffect(() => {
    const adminUserId = cookie.load("admin_userId");
    console.log(adminUserId);

    memberService
      .getGetUserById(adminUserId)
      .then((info) => {
        console.log(info);
        setAdminName(info.UserName.NickName);
        setAdminPhoto(info.Photo);
      })
      .catch(() => {
        setAdminName("Admin");
        setAdminPhoto("");
      });
  }, []);

  const handleLogout = () => {
    cookie.remove("token");
    navigate("/login", { replace: true });
  };

  return (
    <Header
      style={{
        background: "#121212",
        color: "#fff",
        padding: "0 16px",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: 8, fontSize: 16 }}>
          {adminName} 管理員{" "}
        </span>
        <Avatar
          size={40}
          src={adminPhoto}
          icon={<UserOutlined />}
          style={{ marginRight: 8 }}
        />
        <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout}>
          登出
        </Button>
      </div>
    </Header>
  );
}

export default AdminHeader;
