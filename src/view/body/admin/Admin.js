import React, { Children, useEffect, useState } from "react";
import Music from "./Music.js";
import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Space, Table, Input, Select, Image, Tag, List, Avatar } from "antd";
import { meditationService } from "../../../service/ServicePool";
import {
  AudioOutlined,
  CalendarOutlined,
  CrownOutlined,
  FileOutlined,
  FolderOpenOutlined,
  PictureOutlined,
  PieChartOutlined,
  SmileOutlined,
  SoundOutlined,
  TagOutlined,
  TeamOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import AdminHeader from "./AdminHeader.js";
const { Header, Content, Footer, Sider } = Layout;

const items = [
  getItem("首頁", "home", <FileOutlined />),
  getItem("分類", "0", <FolderOpenOutlined />),
  getItem("系列", "1", <PieChartOutlined />),
  getItem("音樂", "2", <AudioOutlined />, [
    getItem("冥想", "2-meditation", <SmileOutlined />),
    getItem("白噪音", "2-whitenoise", <SoundOutlined />),
  ]),
  getItem("導師", "3", <UserOutlined />),
  // getItem("設定", "4", <DesktopOutlined />),
  getItem("用戶", "5", <UsergroupAddOutlined />),
  getItem("開通", "6", <CrownOutlined />),
  getItem("諮商專區", "sub2", <TeamOutlined />, [
    getItem("諮商師", "8", <UserOutlined />),
    getItem("預約訂單", "11", <CalendarOutlined />),
    getItem("Banner", "10", <PictureOutlined />),
  ]),
  getItem("Banner", "7", <PictureOutlined />),
  getItem("優惠代碼", "12", <TagOutlined />),
  getItem("報表", "13", <FileOutlined />),
  // getItem('放鬆專區', 'sub1', <UserOutlined />, [
  //   getItem('系列', '4'),
  //   getItem('音樂', '5'),
  //   getItem('分類', '6'),
  // ]),
  /*/getItem("行銷專區", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),*/
  //getItem("系統設定", "9", <FileOutlined />),
];

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
function Admin() {
  let navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [current, setCurrent] = useState("mail");
  useEffect(() => {
    if (location.pathname === '/admin') {
      setCurrent('home');
    } else if (location.pathname === '/admin/course') {
      setCurrent('1');
    } else if (location.pathname === '/admin/music') {
      setCurrent('2');
    } else if (location.pathname === '/admin/music/meditation') {
      setCurrent('2-meditation');
    } else if (location.pathname === '/admin/music/whitenoise') {
      setCurrent('2-whitenoise');
    } else if (location.pathname === '/admin/Category') {
      setCurrent('0');
    } else if (location.pathname === '/admin/teacher') {
      setCurrent('3');
    } else if (location.pathname === '/admin/user') {
      setCurrent('5');
    } else if (location.pathname === '/admin/membership') {
      setCurrent('6');
    } else if (location.pathname === '/admin/banner') {
      setCurrent('7');
    } else if (location.pathname === '/admin/counselor') {
      setCurrent('8');
    } else if (location.pathname === '/admin/counselorBanner') {
      setCurrent('10');
    } else if (location.pathname === '/admin/appointments') {
      setCurrent('11');
    } else if (location.pathname === '/admin/promocode') {
      setCurrent('12');
    } else if (location.pathname === '/admin/reports') {
      setCurrent('13');
    }
  }, [location.pathname]);

  const onClick = (e) => {
    console.log("click ", e);
    if (e.key == "home") {
      navigate("", { replace: true });
    }
    if (e.key == 1) {
      navigate("course", { replace: true });
    }
    if (e.key == 2) {
      navigate("music", { replace: true });
    }
    if (e.key == "2-meditation") {
      navigate("music/meditation", { replace: true });
    }
    if (e.key == "2-whitenoise") {
      navigate("music/whitenoise", { replace: true });
    }
    if (e.key == 0) {
      navigate("Category", { replace: true });
    }
    if (e.key == 3) {
      navigate("teacher", { replace: true });
    }
    if (e.key == 4) {
      navigate("setting", { replace: true });
    }
    if (e.key == 5) {
      navigate("user", { replace: true });
    }
    if (e.key == 6) {
      navigate("membership", { replace: true });
    }
    if (e.key == 7) {
      navigate("banner", { replace: true });
    }
    if (e.key == 8) {
      navigate("counselor", { replace: true });
    }
    if (e.key == 10) {
      navigate("counselorBanner", { replace: true });
    }
    if (e.key == 11) {
      navigate("appointments", { replace: true });
    }
    if (e.key == 12) {
      navigate("promocode", { replace: true });
    }
    if (e.key == 13) {
      navigate("reports", { replace: true });
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
          }}
        />
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout className="site-layout">
        <AdminHeader style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default Admin;
