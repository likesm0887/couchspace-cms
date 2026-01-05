import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Statistic, Calendar, Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  TeamOutlined,
  FileOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { appointmentService } from '../../../service/ServicePool';
import dayjs from 'dayjs';


const { Title, Paragraph } = Typography;

function AdminDashboard() {
  const navigate = useNavigate();
  const [appointmentChartData, setAppointmentChartData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(false);
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);

  
  const handleCardClick = (path) => {
    navigate(path, { replace: true });
  };

  const getListData = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    return confirmedAppointments.filter(appointment => appointment.date === dateStr);
  };

  const cellRender = (current, info) => {
    if (info.type === 'date') {
      const listData = getListData(current);
      return (
        <ul className="events" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {listData.map(item => (
            <li key={item.content}>
              <Badge status={item.type} text={item.content} />
            </li>
          ))}
        </ul>
      );
    }
    return info.originNode;
  };

  const fetchAppointmentChartData = async () => {
    setLoadingChart(true);
    try {
      const result = await appointmentService.getAllAppointmentForAdmin();
      console.log('API result:', result); // 调试日志

      const completedAppointments = result.filter(appointment =>
        appointment.Status === 'COMPLETED' &&
        appointment.CounselorID !== '46b644b6-09ae-4fd5-9bb0-a56bb4901a3e'
      );
      console.log('Completed appointments (excluding specific counselor):', completedAppointments); // 调试日志

      // 按月份聚合数据 - 使用CreateDate
      const monthlyData = {};
      completedAppointments.forEach(appointment => {
        // 处理 CreateDate 格式 "2024-02-28 10-05-01"
        const createDateStr = appointment.CreateDate;
        const dateParts = createDateStr.split(' ')[0]; // 取日期部分 "2024-02-28"
        const date = new Date(dateParts);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
      });

      console.log('Monthly data:', monthlyData); // 调试日志

      // 转换为图表数据格式
      const chartData = Object.keys(monthlyData)
        .sort()
        .map(month => ({
          month: month,
          count: monthlyData[month]
        }));

      console.log('Chart data:', chartData); // 调试日志
      setAppointmentChartData(chartData);

      // 获取已确认的预约 (包括CONFIRMED和ROOMCREATED状态)
      const confirmedAppointments = result.filter(appointment =>
        appointment.Status === 'CONFIRMED' || appointment.Status === 'ROOMCREATED'
      ).map(appointment => ({
        date: appointment.Time.Date.split(' ')[0],
        counselorName: appointment.CounselorName,
        time: `${appointment.Time.StartTime}-${appointment.Time.EndTime}`,
        type: 'success',
        content: `${appointment.CounselorName} ${appointment.Time.StartTime}-${appointment.Time.EndTime}`
      }));
      console.log('All appointments:', result.map(a => ({ Status: a.Status, Date: a.Time?.Date })));
      console.log('Confirmed appointments:', confirmedAppointments);
      setConfirmedAppointments(confirmedAppointments);
      console.log('Processed confirmed appointments:', confirmedAppointments);
    } catch (error) {
      console.error("Failed to fetch appointment chart data", error);
    } finally {
      setLoadingChart(false);
    }
  };

const stylesObject = {
  root: {
    borderRadius: 8,
    width: 600,
  },
};
const stylesFunction = info => {
  if (info.props.fullscreen) {
    return {
      root: {
        border: '2px solid #BDE3C3',
        borderRadius: 10,
        backgroundColor: 'rgba(189,227,195, 0.3)',
      },
    };
  }
};
  useEffect(() => {
    fetchAppointmentChartData();
  }, []);
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

      <Row gutter={[16, 16]} style={{ marginTop: '32px' }}>
        <Col xs={24} lg={12}>
          <Card
            title="每月已完成預約訂單統計"
            size="small"
            loading={loadingChart}
          >
            <div style={{ width: "100%", height: "300px" }}>
              {appointmentChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appointmentChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(value, name) => [value, '已完成數量']}
                      labelFormatter={(label) => `月份: ${label}`}
                    />
                    <Bar dataKey="count" fill="#1890ff" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                !loadingChart && (
                  <div style={{ textAlign: "center", padding: "30px", color: "#999", fontSize: "12px" }}>
                    暫無數據
                  </div>
                )
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="已確認預約日曆"
            size="small"
          >  
            <div style={{ width: "100%", height: "300px", overflow: "hidden" }}>
              <Calendar
                cellRender={cellRender}
                fullscreen={false}
                style={{ width: "100%", height: "100%" }}
                headerRender={({ value, type, onChange, onTypeChange }) => {
                  const month = value.month();
                  const year = value.year();
                  return (
                    <div style={{ padding: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => onChange(value.clone().subtract(1, 'month'))}
                        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={() => onTypeChange('month')}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}
                      >
                        {month + 1}月
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange(value.clone().add(1, 'month'))}
                        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                      >
                        ›
                      </button>
                    </div>
                  );
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      
    </div>
  );
}

export default AdminDashboard;
