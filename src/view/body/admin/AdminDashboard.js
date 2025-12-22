import React from 'react';
import { Card, Row, Col, Typography, Statistic, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  TeamOutlined,
  FileOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

function AdminDashboard() {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path, { replace: true });
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
        歡迎使用 Couchspace CMS 管理系統
      </Title>

      <Paragraph style={{ textAlign: 'center', fontSize: '16px', marginBottom: '32px' }}>
        這是一個強大的內容管理系統，讓您輕鬆管理冥想音樂、諮商服務和用戶數據。
      </Paragraph>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            onClick={() => handleCardClick('user')}
            style={{ cursor: 'pointer' }}
          >
            <Statistic
              title="用戶管理"
              value="用戶"
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
            <Paragraph style={{ marginTop: '8px', fontSize: '14px' }}>
              管理平台用戶信息
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            onClick={() => handleCardClick('counselor')}
            style={{ cursor: 'pointer' }}
          >
            <Statistic
              title="諮商管理"
              value="諮商"
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Paragraph style={{ marginTop: '8px', fontSize: '14px' }}>
              管理諮商師和預約
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            onClick={() => handleCardClick('music')}
            style={{ cursor: 'pointer' }}
          >
            <Statistic
              title="內容管理"
              value="內容"
              prefix={<FileOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
            <Paragraph style={{ marginTop: '8px', fontSize: '14px' }}>
              管理音樂、課程和Banner
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            onClick={() => handleCardClick('reports')}
            style={{ cursor: 'pointer' }}
          >
            <Statistic
              title="報表分析"
              value="報表"
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <Paragraph style={{ marginTop: '8px', fontSize: '14px' }}>
              查看系統報表和統計
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <div style={{ textAlign: 'center', marginTop: '48px' }}>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          請使用左側導航欄訪問各個管理功能
        </Paragraph>
      </div>
    </div>
  );
}

export default AdminDashboard;
