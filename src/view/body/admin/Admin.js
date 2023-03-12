
import React, { Children, useEffect, useState } from "react";
import Music from "./Music.js";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Space, Table, Input, Select, Image, Tag, List, Avatar } from 'antd';
import { meditationService } from "../../../service/ServicePool";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

const items = [
  getItem('分類', '0', <FileOutlined />),
  getItem('系列', '1', <PieChartOutlined />),
  getItem('音樂', '2', <DesktopOutlined />),
  getItem('導師', '3', <DesktopOutlined />),
  getItem('放鬆專區', 'sub1', <UserOutlined />, [
    getItem('系列', '4'),
    getItem('音樂', '5'),
    getItem('分類', '6'),
  ]),
  getItem('諮商專區', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('行銷專區', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('系統設定', '9', <FileOutlined />),
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
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [current, setCurrent] = useState('mail');
  const onClick = (e) => {
    console.log('click ', e);
    if (e.key == 1 || e.key == 4) {
      navigate("course", { replace: true });
    }
    if (e.key == 2 || e.key == 5) {
      navigate("music", { replace: true });
    }
    if (e.key == 0 || e.key == 6) {
      navigate("Category", { replace: true });
    }
    if (e.key == 3 || e.key == 7) {
      navigate("teacher", { replace: true });
    }
  };


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu onClick={onClick} selectedKeys={[current]} theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Outlet />
        </Content>

      </Layout>
    </Layout>
  );
}


export default Admin;