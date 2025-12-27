import React, { useEffect, useState, useRef } from "react";
import { Avatar, Button, Layout, Space, message } from "antd";
import { LogoutOutlined, UserOutlined, CameraOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import { service, memberService } from "../../../service/ServicePool";
import { adminAuthentication } from "../../../utility/ProtectedRoute";
const { Header } = Layout;

function AdminHeader() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("Admin");
  const [adminPhoto, setAdminPhoto] = useState("");
  const [isHover, setIsHover] = useState(false);
  const fileInputRef = useRef(null);
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
    getData();
  }, []);

  const getData = async () => {
    const adminUserId = cookie.load("admin_userId");
    console.log(adminUserId);
    const info = await memberService.getGetUserById(adminUserId);
    console.log(info);
    setAdminName(info.UserName.NickName);
    setAdminPhoto(info.photo);
  };
  const handleLogout = () => {
    // Clear all cookies
    const allCookies = cookie.loadAll();
    console.log(allCookies);
    Object.keys(allCookies).forEach((key) => {
      cookie.remove(key);
    });
    adminAuthentication.updateAuthentication(false);
    navigate("/login", { replace: true });
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const result = await memberService.uploadPhoto(file);
        console.log("Upload result:", result);
        if (result && result.Photo) {
          // 檢查照片URL是否為完整URL，如果不是則拼接baseUrl
          let photoUrl = result.Photo;
          if (!photoUrl.startsWith('http')) {
            // 如果是相對路徑，拼接baseUrl
            photoUrl = memberService.base_url + photoUrl;
          }
          // 添加時間戳來避免快取問題
          photoUrl = photoUrl + (photoUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
          console.log("Final photo URL:", photoUrl);
          setAdminPhoto(photoUrl);
          message.success("頭像更新成功");
        } else {
          message.error("頭像更新失敗");
        }
      } catch (error) {
        console.error("Upload error:", error);
        message.error("頭像更新失敗");
      }
    }
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
      {/* Admin info on the right */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: 8, fontSize: 16 }}>
          {adminName} 管理員{" "}
        </span>
        <div
          style={{
            position: "relative",
            marginRight: 8,
            cursor: "pointer",
            display: "inline-block",
          }}
          onClick={handleAvatarClick}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <Avatar
            size={40}
            src={adminPhoto}
            icon={<UserOutlined />}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: isHover ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            <CameraOutlined style={{ color: "#fff", fontSize: 16 }} />
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />
        <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout}>
          登出
        </Button>
      </div>
    </Header>
  );
}

export default AdminHeader;
