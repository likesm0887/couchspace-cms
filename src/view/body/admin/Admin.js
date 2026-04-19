import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import {
  Avatar,
  Button,
  Layout,
  Menu,
  message,
  theme,
} from "antd";
import {
  AudioOutlined,
  CalendarOutlined,
  CameraOutlined,
  CrownOutlined,
  FileOutlined,
  FolderOpenOutlined,
  LogoutOutlined,
  PictureOutlined,
  PieChartOutlined,
  SmileOutlined,
  SoundOutlined,
  TagOutlined,
  TeamOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import cookie from "react-cookies";
import { memberService } from "../../../service/ServicePool";
import { adminAuthentication } from "../../../utility/ProtectedRoute";
import logoImg from "../../img/header/logo.png";

const { Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const items = [
  getItem("首頁", "home", <FileOutlined />),
  getItem("分類", "0", <FolderOpenOutlined />),
  getItem("系列", "1", <PieChartOutlined />),
  getItem("音樂", "2", <AudioOutlined />, [
    getItem("冥想", "2-meditation", <SmileOutlined />),
    getItem("白噪音", "2-whitenoise", <SoundOutlined />),
  ]),
  getItem("導師", "3", <UserOutlined />),
  getItem("用戶", "5", <UsergroupAddOutlined />),
  getItem("開通", "6", <CrownOutlined />),
  getItem("諮商專區", "sub2", <TeamOutlined />, [
    getItem("諮商師", "8", <UserOutlined />),
    getItem("預約訂單", "11", <CalendarOutlined />),
    getItem("Banner", "10", <PictureOutlined />),
  ]),
  getItem("優惠代碼", "12", <TagOutlined />),
  getItem("報表", "sub-reports", <FileOutlined />, [
    getItem("報表總覽", "13", <FileOutlined />),
    getItem("觸發報表", "trigger-report", <FileOutlined />),
  ]),
  getItem("營運管理", "sub-operations", <FolderOpenOutlined />, [
    getItem("每日推薦", "operations-recommendations", <SmileOutlined />),
    getItem("主頁Banner", "7", <PictureOutlined />),
    getItem("放鬆Banner", "operations-relax-banner", <PictureOutlined />),
    getItem("挑戰管理", "operations-challenges", <TagOutlined />),
  ]),
];

function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [current, setCurrent] = useState("home");

  // Admin info state
  const [adminName, setAdminName] = useState("Admin");
  const [adminPhoto, setAdminPhoto] = useState("");
  const [isHover, setIsHover] = useState(false);
  const fileInputRef = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const path = location.pathname;
    if (path === "/admin") setCurrent("home");
    else if (path === "/admin/course") setCurrent("1");
    else if (path === "/admin/music") setCurrent("2");
    else if (path === "/admin/music/meditation") setCurrent("2-meditation");
    else if (path === "/admin/music/whitenoise") setCurrent("2-whitenoise");
    else if (path === "/admin/Category") setCurrent("0");
    else if (path === "/admin/teacher") setCurrent("3");
    else if (path === "/admin/user") setCurrent("5");
    else if (path === "/admin/membership") setCurrent("6");
    else if (path === "/admin/banner") setCurrent("7");
    else if (path === "/admin/counselor") setCurrent("8");
    else if (path === "/admin/counselorBanner") setCurrent("10");
    else if (path === "/admin/appointments") setCurrent("11");
    else if (path === "/admin/promocode") setCurrent("12");
    else if (path === "/admin/reports") setCurrent("13");
    else if (path === "/admin/operations/recommendations") setCurrent("operations-recommendations");
    else if (path === "/admin/relaxBanner") setCurrent("operations-relax-banner");
    else if (path === "/admin/trigger-report") setCurrent("trigger-report");
    else if (path === "/admin/operations/challenges") setCurrent("operations-challenges");
  }, [location.pathname]);

  useEffect(() => {
    const getData = async () => {
      try {
        const adminUserId = cookie.load("admin_userId");
        if (!adminUserId) return;
        const info = await memberService.getGetUserById(adminUserId);
        if (info?.UserName?.NickName) setAdminName(info.UserName.NickName);
        if (info?.photo) setAdminPhoto(info.photo);
      } catch (e) {
        console.error(e);
      }
    };
    getData();
  }, []);

  const handleLogout = () => {
    const allCookies = cookie.loadAll();
    Object.keys(allCookies).forEach((key) => cookie.remove(key));
    adminAuthentication.updateAuthentication(false);
    navigate("/login", { replace: true });
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const result = await memberService.uploadPhoto(file);
      if (result?.Photo) {
        let photoUrl = result.Photo;
        if (!photoUrl.startsWith("http")) photoUrl = memberService.base_url + photoUrl;
        photoUrl = photoUrl + (photoUrl.includes("?") ? "&" : "?") + "t=" + Date.now();
        setAdminPhoto(photoUrl);
        messageApi.success("頭像更新成功");
      } else {
        messageApi.error("頭像更新失敗");
      }
    } catch (error) {
      console.error(error);
      messageApi.error("頭像更新失敗");
    }
  };

  const onClick = (e) => {
    if (e.key === "home") navigate("", { replace: true });
    else if (e.key === "1") navigate("course", { replace: true });
    else if (e.key === "2") navigate("music", { replace: true });
    else if (e.key === "2-meditation") navigate("music/meditation", { replace: true });
    else if (e.key === "2-whitenoise") navigate("music/whitenoise", { replace: true });
    else if (e.key === "0") navigate("Category", { replace: true });
    else if (e.key === "3") navigate("teacher", { replace: true });
    else if (e.key === "4") navigate("setting", { replace: true });
    else if (e.key === "5") navigate("user", { replace: true });
    else if (e.key === "6") navigate("membership", { replace: true });
    else if (e.key === "7") navigate("banner", { replace: true });
    else if (e.key === "8") navigate("counselor", { replace: true });
    else if (e.key === "10") navigate("counselorBanner", { replace: true });
    else if (e.key === "11") navigate("appointments", { replace: true });
    else if (e.key === "12") navigate("promocode", { replace: true });
    else if (e.key === "13") navigate("reports", { replace: true });
    else if (e.key === "operations-recommendations") navigate("operations/recommendations", { replace: true });
    else if (e.key === "operations-relax-banner") navigate("relaxBanner", { replace: true });
    else if (e.key === "trigger-report") navigate("trigger-report", { replace: true });
    else if (e.key === "operations-challenges") navigate("operations/challenges", { replace: true });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {contextHolder}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ position: "relative" }}
      >
        {/* Inner flex container */}
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Logo */}
          <div
            style={{
              padding: collapsed ? "12px 8px" : "16px",
              textAlign: "center",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              flexShrink: 0,
            }}
          >
            <img
              src={logoImg}
              alt="Couchspace"
              style={{
                width: collapsed ? 32 : 100,
                height: "auto",
                transition: "width 0.2s",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Menu - fills remaining space */}
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
            <Menu
              onClick={onClick}
              selectedKeys={[current]}
              theme="dark"
              defaultSelectedKeys={["home"]}
              mode="inline"
              items={items}
            />
          </div>

          {/* Admin info at bottom */}
          <div
            style={{
              padding: collapsed ? "12px 8px" : "12px 16px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              flexShrink: 0,
              marginBottom: 36,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexDirection: collapsed ? "column" : "row",
              }}
            >
              {/* Avatar with upload hover */}
              <div
                style={{ position: "relative", cursor: "pointer", flexShrink: 0 }}
                onClick={handleAvatarClick}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
              >
                <Avatar size={36} src={adminPhoto} icon={<UserOutlined />} />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: isHover ? 1 : 0,
                    transition: "opacity 0.3s",
                  }}
                >
                  <CameraOutlined style={{ color: "#fff", fontSize: 14 }} />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleFileChange}
              />

              {/* Name + logout (hidden when collapsed) */}
              {!collapsed && (
                <>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      fontSize: 13,
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {adminName}
                  </span>
                  <Button
                    type="text"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    style={{ color: "rgba(255,255,255,0.65)", padding: "0 4px" }}
                    title="登出"
                  />
                </>
              )}

              {/* Logout icon only when collapsed */}
              {collapsed && (
                <Button
                  type="text"
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  style={{ color: "rgba(255,255,255,0.65)", padding: "0 4px" }}
                  title="登出"
                />
              )}
            </div>
          </div>
        </div>
      </Sider>

      <Layout>
        <Content style={{ margin: "16px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default Admin;
