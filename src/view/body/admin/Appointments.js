import React, { useEffect, useState, useMemo } from "react";
import {
  Drawer,
  Button,
  Table,
  Statistic,
  Tag,
  Modal,
  Tabs,
  Image,
  List,
  Form,
  Card,
  Col,
  message,
  Tooltip,
  Calendar,
  Row,
  DatePicker,
  TimePicker,
  Select,
  Flex,
  Space,
  Input,
  Typography,
} from "antd";


import { Layout, theme, Descriptions, Badge } from "antd";
import { Pagination } from "antd";
import "./counselor.css";
import "./appointments.css";
import moment from "moment";
import { CopyOutlined, EditOutlined, ClockCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {
  memberService,
  appointmentService,
  counselorService,
} from "../../../service/ServicePool";
import AdminHeader from "./AdminHeader";
import AppointmentDetailAdmin from "./AppointmentDetailAdmin";
import CountUp from "react-countup";
import { Label, Margin } from "@mui/icons-material";

// CounselorDetailModal 組件 - 諮商師詳情模態框
const CounselorDetailModal = ({ counselorData, counselorPhoto }) => {
  if (!counselorData || counselorData.length === 0) {
    return <div>載入中...</div>;
  }

  // 將Descriptions items轉換為對象格式供顯示
  const counselorInfo = counselorData.reduce((acc, item) => {
    acc[item.key] = item;
    return acc;
  }, {});

  return (
    <div style={{ padding: "16px", backgroundColor: "#f5f5f5" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", padding: "16px", backgroundColor: "#fff", borderRadius: "8px" }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            諮商師詳情
            {counselorInfo["21"]?.children && (
              <div style={{ marginTop: "8px" }}>
                <Tag color="blue" style={{ fontSize: "14px", padding: "4px 12px" }}>
                  {counselorInfo["21"]?.children === "HeartCoach" ? "心教練" : "心理師"}
                </Tag>
              </div>
            )}
          </Typography.Title>
        </div>

        <Row gutter={24}>
          {/* 大頭貼 */}
          <Col xs={24} lg={6}>
            <Card title="大頭貼" bordered={false}>
              <div style={{ textAlign: 'center' }}>
                {counselorPhoto ? (
                  <div>
                    {counselorPhoto}
                  </div>
                ) : (
                  <div style={{
                    width: '120px',
                    height: '120px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    color: '#999'
                  }}>
                    無照片
                  </div>
                )}
              </div>
            </Card>
          </Col>

          {/* 基本資訊 */}
          <Col xs={24} lg={18}>
            <Card title={<Space><UserOutlined />基本資訊</Space>} bordered={false}>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="姓名">
                  {counselorInfo["1"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="暱稱">
                  {counselorInfo["2"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {counselorInfo["3"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="手機">
                  {counselorInfo["5"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="性別">
                  {counselorInfo["19"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="認證狀態">
                  {counselorInfo["6"]?.children}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

        </Row>

        <Row gutter={24}>
          {/* 專業資訊 */}
          <Col xs={24} lg={12}>
            <Card title={<Space><UserOutlined />專業資訊</Space>} bordered={false}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="學歷">
                  {counselorInfo["8"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="職稱">
                  {counselorInfo["10"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="經歷">
                  {counselorInfo["7"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="從業時間">
                  {counselorInfo["14"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="地點">
                  {counselorInfo["13"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="語言">
                  {counselorInfo["20"]?.children || "未設定"}
                </Descriptions.Item>
                <Descriptions.Item label="身分">
                  {counselorInfo["21"]?.children === "HeartCoach" ? "心教練" : "心理師"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* 服務與資格 */}
          <Col xs={24} lg={12}>
            <Card title="服務與資格" bordered={false}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="認證狀態">
                  {counselorInfo["6"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="機構資訊">
                  {counselorInfo["9"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="地址">
                  {counselorInfo["10"]?.children}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        {/* 服務類別 */}
        {counselorInfo["16"] && (
          <Card title="服務類別" bordered={false}>
            <Space wrap>
              {counselorInfo["16"]?.children}
            </Space>
          </Card>
        )}

        {/* 專長 */}
        {counselorInfo["17"] && (
          <Card title="專長" bordered={false}>
            <Space wrap>
              {counselorInfo["17"]?.children}
            </Space>
          </Card>
        )}

        {/* 證照 */}
        {counselorInfo["18"] && (
          <Card title="證照資訊" bordered={false}>
            <Space wrap>
              {counselorInfo["18"]?.children}
            </Space>
          </Card>
        )}

        {/* 機構資訊 */}
        {counselorInfo["9"] && (
          <Card title="機構資訊" bordered={false}>
            <Typography.Text>
              {counselorInfo["9"]?.children}
            </Typography.Text>
          </Card>
        )}

        {/* 地址 */}
        {counselorInfo["10"] && (
          <Card title="地址" bordered={false}>
            <Typography.Text>
              {counselorInfo["10"]?.children}
            </Typography.Text>
          </Card>
        )}

        {/* 專長描述 */}
        {counselorInfo["15"] && (
          <Card title="專長描述" bordered={false}>
            <Typography.Text>
              {counselorInfo["15"]?.children}
            </Typography.Text>
          </Card>
        )}

        {/* 自我介紹 */}
        {(counselorInfo["11"] || counselorInfo["12"]) && (
          <Card title="自我介紹" bordered={false}>
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              {counselorInfo["11"] && (
                <div>
                  <Typography.Text strong>簡短介紹：</Typography.Text>
                  <br />
                  <Typography.Text>{counselorInfo["11"]?.children}</Typography.Text>
                </div>
              )}
              {counselorInfo["12"] && (
                <div>
                  <Typography.Text strong>詳細介紹：</Typography.Text>
                  <br />
                  <Typography.Text>{counselorInfo["12"]?.children}</Typography.Text>
                </div>
              )}
            </Space>
          </Card>
        )}


      </Space>
    </div>
  );
};

// 常量定義
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const DEFAULT_PAGE_SIZE = 20;

// 工具函數
const transformAppointment = (u) => ({
  AppointmentID: u.AppointmentID,
  UserEmail: "member.Email",
  UserID: u.UserID,
  UserName: u.UserName,
  CounselorID: u.CounselorID,
  CounselorName: u.CounselorName,
  PromoCodeID: u.PromoCodeID,
  ServiceFee: u.Service.Fee,
  DiscountFee: u.PromoCodeID ? u.Service.Fee - u.DiscountFee : 0,
  DateTime: u.Time.Date + " " + u.Time.StartTime,
  Fee: u.PromoCodeID ? u.DiscountFee : u.Service.Fee,
  Type: u.Service.Type.Label,
  AdminFlag: u.AdminFlag,
  CreateDate: moment(u.CreateDate, "YYYY-MM-DD HH-mm-SS")
    .format("YYYY-MM-DD HH:mm:SS")
    .toString(),
  Status: getStatusDesc(u.Status),
});

const getStatusDesc = (code) => {
  if (code.toUpperCase() === "NEW") {
    return "訂單成立(未付款)";
  }
  if (code.toUpperCase() === "UNPAID") {
    return "訂單成立(未付款)";
  }
  if (code.toUpperCase() === "CONFIRMED") {
    return "已確認";
  }
  if (code.toUpperCase() === "ROOMCREATED") {
    return "諮商房間已建立";
  }
  if (code.toUpperCase() === "CANCELLED") {
    return "已取消";
  }
  if (code.toUpperCase() === "COMPLETED") {
    return "已完成";
  }
};

const isInDateRange = (dateTimeStr, startDate, endDate) => {
  let start = null;
  let end = null;

  if (startDate !== null) {
    start = moment(startDate.format("YYYY-MM-DD HH:mm"), "YYYY-MM-DD HH:mm");
  }
  if (endDate !== null) {
    end = moment(endDate.format("YYYY-MM-DD HH:mm"), "YYYY-MM-DD HH:mm");
  }
  if (startDate === null && endDate === null) return true;

  const dateTime = moment(dateTimeStr, "YYYY-MM-DD HH:mm");
  return dateTime.isSameOrAfter(start) && dateTime.isSameOrBefore(end);
};

const matchesSearch = (app, searchTerm, promoCodeFilter, adminFlagFilter) => {
  if (!searchTerm && !promoCodeFilter && adminFlagFilter === "全部") return true;
  const term = searchTerm.toLowerCase();
  const matchesTerm = !searchTerm || (
    (app.AppointmentID && app.AppointmentID.toLowerCase().includes(term)) ||
    (app.UserID && app.UserID.toString().toLowerCase().includes(term)) ||
    (app.UserName && app.UserName.toLowerCase().includes(term)) ||
    (app.CounselorName && app.CounselorName.toLowerCase().includes(term))
  );
  const matchesPromo = !promoCodeFilter || (app.PromoCodeID && app.PromoCodeID.toLowerCase().includes(promoCodeFilter.toLowerCase()));
  const matchesFlag = adminFlagFilter === "全部" || app.AdminFlag === adminFlagFilter;
  return matchesTerm && matchesPromo && matchesFlag;
};
const DrawerForm = ({ id, visible, onClose, record, callback, allAppointments }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && id && allAppointments) {
      // Find the appointment data
      const appointment = allAppointments.find(app => app.AppointmentID === id);
      if (appointment && appointment.DateTime) {
        try {
          // Parse the date and time from DateTime string
          const dateTimeStr = appointment.DateTime; // e.g., "2023-12-25 14:30-15:30"
          const [dateStr, timeStr] = dateTimeStr.split(' ');
          if (dateStr && timeStr) {
            const [startTimeStr, endTimeStr] = timeStr.split('-');

            // Set form values
            form.setFieldsValue({
              date: moment(dateStr, 'YYYY-MM-DD'),
              startTime: moment(startTimeStr, 'HH:mm'),
              endTime: moment(endTimeStr, 'HH:mm'),
            });
          } else {
            // Reset form if data format is invalid
            form.resetFields();
          }
        } catch (error) {
          console.error('解析預約時間失敗:', error);
          form.resetFields();
        }
      } else {
        // Reset form if no data found
        form.resetFields();
      }
    }
  }, [visible, id, allAppointments, form]);

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const timeData = {
        AppointmentId: id,
        Date: values.date.format('YYYY-MM-DD'),
        StartTime: values.startTime.format('HH:mm'),
        EndTime: values.endTime.format('HH:mm'),
      };

      await appointmentService.changeAppointmentTime(timeData);
      message.success("預約時間修改成功");
      onClose();
      callback();
    } catch (error) {
      message.error("修改失敗，請稍後再試");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const validateTimeRange = (_, value) => {
    if (!value) return Promise.resolve();

    const startTime = form.getFieldValue('startTime');
    const endTime = value;

    if (startTime && endTime) {
      const start = moment(startTime, 'HH:mm');
      const end = moment(endTime, 'HH:mm');

      if (end.isSameOrBefore(start)) {
        return Promise.reject(new Error('結束時間必須晚於開始時間'));
      }
    }

    return Promise.resolve();
  };

  return (
    <Drawer
      title={
        <Space>
          <EditOutlined />
          編輯預約時間
        </Space>
      }
      width={500}
      onClose={onClose}
      open={visible}
      footer={
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button onClick={onClose}>
            取消
          </Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={loading}
            icon={<ClockCircleOutlined />}
          >
            儲存修改
          </Button>
        </Space>
      }
    >
      <div style={{ padding: '20px 0' }}>
        {/* 預約資訊卡片 */}
        <Card
          size="small"
          style={{ marginBottom: 24 }}
          title={
            <Space>
              <CalendarOutlined />
              預約日期與時間設定
            </Space>
          }
        >
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="date"
                  label="預約日期"
                  rules={[
                    { required: true, message: '請選擇預約日期' },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        const selectedDate = moment(value);
                        const today = moment().startOf('day');
                        if (selectedDate.isBefore(today)) {
                          return Promise.reject(new Error('無法選擇過去的日期'));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <DatePicker
                    placeholder="選擇日期"
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    disabledDate={(current) => {
                      return current && current < moment().startOf('day');
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="startTime"
                  label="開始時間"
                  rules={[
                    { required: true, message: '請選擇開始時間' }
                  ]}
                >
                <TimePicker
                  placeholder="開始時間"
                  format="HH:mm"
                  style={{ width: '100%' }}
                  minuteStep={5}
                />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="endTime"
                  label="結束時間"
                  rules={[
                    { required: true, message: '請選擇結束時間' },
                    { validator: validateTimeRange }
                  ]}
                >
                  <TimePicker
                    placeholder="結束時間"
                    format="HH:mm"
                    style={{ width: '100%' }}
                    minuteStep={5}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <Typography.Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '16px' }}>
            修改預約時間後，系統將自動通知相關用戶。請確保新的時間不會與其他預約衝突。
          </Typography.Paragraph>
        </Card>
      </div>
    </Drawer>
  );
};

const Appointments = () => {
  const { Option } = Select;
  const formatter = (value) => <CountUp end={value} separator="," />;
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState(null);
  const [allAppointments, setAllAppointments] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [filters, setFilters] = useState({
    all: { searchTerm: "", startDate: null, endDate: null, promoCodeFilter: "", adminFlagFilter: "全部" },
    pending: { searchTerm: "", startDate: null, endDate: null, promoCodeFilter: "", adminFlagFilter: "全部" },
    confirmed: { searchTerm: "", startDate: null, endDate: null, promoCodeFilter: "", adminFlagFilter: "全部" },
    completed: { searchTerm: "", startDate: null, endDate: null, promoCodeFilter: "", adminFlagFilter: "全部" },
    cancelled: { searchTerm: "", startDate: null, endDate: null, promoCodeFilter: "", adminFlagFilter: "全部" },
  });
  const [currentSelectCounselorId, setCurrentSelectCounselorId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [detail, setDetail] = useState("");
  const [memberDetail, setMemberDetail] = useState("");
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedAppointmentForCancel, setSelectedAppointmentForCancel] =
    useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  // 分頁狀態
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const columns = (showAdminFlag) => {
    let result = [
      {
        title: "編輯",
        key: "action",
        render: (text, record) => (
          <Button
            type="primary"
            onClick={() => handleEdit(record.AppointmentID)}
          >
            編輯
          </Button>
        ),
      },
      {
        title: "交易單號",

        dataIndex: "AppointmentID",
        key: "AppointmentID",
        sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
        render: (text) => (
          <Tooltip title={text}>
            <a
              style={{ color: "#1677FF", cursor: "pointer" }}
              onClick={() => handleOpenDetailModal(text)}
            >
              {text.slice(-8).toUpperCase()}
            </a>
          </Tooltip>
        ),
      },
      {
        title: "案主ID",
        dataIndex: "UserID",
        key: "UserID",
        render: (text, record) => (
          <div>
            <Tooltip title={text}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <a
                  style={{ color: "#1677FF", marginRight: 8 }}
                  onClick={() => openModal2(record.UserID)}
                >
                  {text.slice(-5)}
                </a>
                <Button
                  type="link"
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(record.UserID)}
                />
              </div>
            </Tooltip>
          </div>
        ),
      },
      {
        title: "案主姓名",
        dataIndex: "UserName",
        key: "UserName",
      },
      {
        title: "諮商師ID",
        dataIndex: "CounselorID",
        key: "CounselorID",
        hide: true,
      },
      {
        title: "諮商師姓名",
        dataIndex: "CounselorName",
        key: "CounselorName",
        width: 120,
        render: (text, record) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <a
              style={{ color: "#1677FF", marginRight: 6 }}
              onClick={() => openModal(record.CounselorID)}
            >
              {text}
            </a>
            <Button
              type="link"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(text)}
            />
          </div>
        ),
      },
      {
        title: "預約成立時間",
        dataIndex: "CreateDate",
        key: "CreateDate",
        sorter: (a, b) => Date.parse(b.CreateDate) - Date.parse(a.CreateDate),
        defaultSortOrder: 'descend',
      },
      {
        title: "預約日期",
        dataIndex: "DateTime",
        key: "DateTime",
        sorter: (a, b) => new Date(b.DateTime) - new Date(a.DateTime),
        defaultSortOrder: 'descend',
      },

      {
        title: "原價",
        key: "OriginalFee",
        render: (text, record) => record.PromoCodeID ? record.ServiceFee : record.Fee,
      },
      {
        title: "折扣費用",
        key: "DiscountFee",
        render: (text, record) => record.PromoCodeID ? `-${record.DiscountFee}` : "-",
      },
      {
        title: "折扣後價格",
        key: "DiscountedFee",
        render: (text, record) => record.PromoCodeID ? record.Fee : "-",
      },
      {
        title: "服務項目",
        key: "Type",
        dataIndex: "Type",
      },
      {
        title: "優惠代碼",
        key: "PromoCodeID",
        dataIndex: "PromoCodeID",
      },

      {
        title: "狀態",
        dataIndex: "Status",
        key: "Status",
        sorter: (a, b) => a.Status.localeCompare(b.Status, "en"),
      },
      {
        title: "更改狀態",
        key: "StatusAction",
        hidden: !showAdminFlag,
        render: (text, record) => {
          // Only show cancel button if status is CONFIRMED or ROOMCREATED

          return (
            <Button
              type="primary"
              danger
              onClick={() => handleCancelAppointment(record)}
            >
              取消預約
            </Button>
          );
        },
      },
      {
        title: "標記狀態",
        dataIndex: "AdminFlag",
        key: "AdminFlag",
        hidden: showAdminFlag,
        width: 200,
        optionSelectedColor: "red",
        render: (key, record) => (
          <Select
            style={{ width: 150, color: "red" }}
            value={record.AdminFlag} // 优先显示已选择的值，否则显示原始值
            onChange={(value) =>
              handleChangeStatus(value, record.AppointmentID)
            }
          >
            <Option value="Completed">已完成</Option>
            <Option value="CounselorUnCompleted" style={{ color: "red" }}>
              諮商師未完成
            </Option>
            <Option value="UserUnCompleted" style={{ color: "red" }}>
              案主未完成
            </Option>
            <Option value="CustomerServiceProcess">平台處理</Option>
            <Option value="WaitForProcess">待處理</Option>
            <Option value="Cancelled">已取消</Option>
          </Select>
        ),
      },
    ];

    return result.filter((col) => col.dataIndex !== "CounselorID");
  };

  const handleChangeStatus = async (value, key) => {
    setLoading(true);
    appointmentService
      .changeAdminFlag({
        AppointmentId: key,
        AdminFlag: value,
      })
      .then((e) => {
        message.success("修改成功");
        fetchData();
      });

    setLoading(false);
  };

  const handleCancelAppointment = (record) => {
    console.log(record);
    if (record.Status !== "已確認") {
      messageApi.open({
        type: "error",
        content: "狀態為:已確認才能取消",
      });
      return;
    }
    setSelectedAppointmentForCancel(record);
    setIsCancelModalOpen(true);
  };

  const confirmCancelAppointment = async () => {
    if (!selectedAppointmentForCancel) return;

    setLoading(true);
    try {
      await appointmentService.updateAppointmentStatus({
        AppointmentId: selectedAppointmentForCancel.AppointmentID,
        Status: "CANCELLED",
        AdminFlag: "WaitForProcess",
      });
      message.success("已成功取消預約");
      setIsCancelModalOpen(false);
      setSelectedAppointmentForCancel(null);
      fetchData();
    } catch (error) {
      message.error("取消預約失敗");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelModalClose = () => {
    setIsCancelModalOpen(false);
    setSelectedAppointmentForCancel(null);
  };

  const handleOpenDetailModal = (appointmentId) => {
    console.log('=== Opening Detail Modal ===');
    console.log('Appointment ID:', appointmentId);
    console.log('Modal State Before:', isDetailModalOpen);
    setSelectedAppointmentId(appointmentId);
    setIsDetailModalOpen(true);
    console.log('Modal State After:', true);
    console.log('Selected Appointment ID:', appointmentId);
    console.log('===========================');
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedAppointmentId(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success("Copied to clipboard!");
      })
      .catch((err) => {
        message.error("Failed to copy!");
      });
  };

  const fetchData = async () => {
    const result = await appointmentService.getAllAppointmentForAdmin();
    console.log(result);
    setAllAppointments(result || []);
    setUserCount(result.length);
  };

  // Memoized tab counts
  const tabCounts = useMemo(() => {
    const transformed = allAppointments.map(transformAppointment);
    return {
      all: transformed.length,
      pending: transformed.filter((u) => u.Status === "訂單成立(未付款)").length,
      confirmed: transformed.filter((u) => u.Status === "已確認" || u.Status === "諮商房間已建立").length,
      completed: transformed.filter((u) => u.Status === "已完成").length,
      cancelled: transformed.filter((u) => u.Status === "已取消").length,
    };
  }, [allAppointments]);

  // Memoized filtered and transformed data with pagination
  const { filteredData, paginatedData } = useMemo(() => {
    const transformed = allAppointments.map(transformAppointment);

    const currentFilters = filters[activeTab] || { searchTerm: "", startDate: null, endDate: null, promoCodeFilter: "", adminFlagFilter: "全部" };
    let filtered = transformed
      .filter((u) => matchesSearch(u, currentFilters.searchTerm, currentFilters.promoCodeFilter, currentFilters.adminFlagFilter) && isInDateRange(u.DateTime, currentFilters.startDate, currentFilters.endDate));

    // Filter by tab
    if (activeTab === "pending") {
      filtered = filtered.filter((u) => u.Status === "訂單成立(未付款)");
    } else if (activeTab === "confirmed") {
      filtered = filtered.filter((u) => u.Status === "已確認" || u.Status === "諮商房間已建立");
    } else if (activeTab === "completed") {
      filtered = filtered.filter((u) => u.Status === "已完成");
    } else if (activeTab === "cancelled") {
      filtered = filtered.filter((u) => u.Status === "已取消");
    }
    // all tab includes all

    // Sort by CreateDate desc (newest first)
    filtered.sort((a, b) => Date.parse(b.CreateDate) - Date.parse(a.CreateDate));

    const paginated = filtered.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

    return {
      filteredData: filtered,
      paginatedData: paginated,
    };
  }, [allAppointments, filters, currentPage, pageSize, activeTab]);

  const [
    currentSelectCounselorAppointmentTime,
    setcurrentSelectCounselorAppointmentTime,
  ] = useState({});

  const [
    currentSelectCounselorAppointments,
    setCurrentSelectCounselorAppointments,
  ] = useState({});

  const openModal2 = async (id) => {
    console.log(id);
    const res = await memberService.getGetUserById(id);
    setIsModal2Open(true);
    createMemberDescription(res);
    console.log(res);
  };

  const openModal = async (id) => {
    const res = await counselorService.getCounselorInfoById(id);
    console.log(id);
    const appointmentTime = await counselorService.getAppointmentTimeById(id);
    console.log(appointmentTime);
    const counselorAppointments =
      await appointmentService.getAppointmentsByCounselorIdByAdmin(id);
    setcurrentSelectCounselorAppointmentTime(appointmentTime);
    setCurrentSelectCounselorAppointments(counselorAppointments);
    console.log(counselorAppointments);

    createDescription(res);
    console.log(id);

    setIsModalOpen(true);
    console.log(res);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id) => {
    console.log(id);
    setCurrentSelectCounselorId(id);
    setVisible(true);
  };

  const handleClose = () => {
    setRecord(null);
    setVisible(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setIsModal2Open(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModal2Open(false);
  };
  const handleMenuClick = (e) => {
    createDescription();
  };
  function dateCellRender(value) {
    const matchingData = currentSelectCounselorAppointments?.filter(
      (item) => item.Time.Date === value.format("YYYY-MM-DD")
    );
    console.log(matchingData);
    if (matchingData) {
      const periodList = matchingData.map((m, index) => (
        <li key={index}>
          <Badge.Ribbon
            text={m.Service.Type.Label.slice(0, 4)}
            placement="end"
            color={m.Status == "COMPLETED" ? "" : "green"}
          >
            <Card size="small">
              <br></br>

              {(m.Status == "COMPLETED" ? "已完成" : "") +
                m.UserName.slice(0, 4) +
                " " +
                m.Time.StartTime +
                "-" +
                m.Time.EndTime}
            </Card>
          </Badge.Ribbon>
        </li>
      ));

      return (
        <div>
          <ul className="events">{periodList}</ul>
        </div>
      );
    }

    return <p>{value.format("DD")}</p>;
  }
  const items3 = [
    {
      key: `information`,
      icon: React.createElement(UserOutlined),
      label: `個人資訊`,
      children: (
        <Descriptions
          extra={<Button type="primary">Edit</Button>}
          bordered
          title="個人資訊"
          items={memberDetail}
        />
      ),
    },
    {
      key: `appointmentTime`,
      icon: React.createElement(NotificationOutlined),
      label: `預約紀錄`,
    },
  ];
  const items2 = [
    {
      key: `information`,
      icon: React.createElement(UserOutlined),
      label: `個人資訊`,
      children: (
        <Descriptions
          extra={<Button type="primary">Edit</Button>}
          bordered
          title="個人資訊"
          items={detail}
        />
      ),
    },
    {
      key: `appointmentTime`,
      icon: React.createElement(NotificationOutlined),
      label: `預約時間`,
      children: (
        <div>
          <h1>可預約時間</h1>
          <List
            grid={{ gutter: 16, column: 7 }}
            dataSource={currentSelectCounselorAppointmentTime?.BusinessTimes}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable={true}
                  bordered={true}
                  title={item.WeekOfDay} // 設定標題樣式
                >
                  <div style={{ flex: 2 }}>
                    <List
                      dataSource={item.Periods}
                      renderItem={(period) => (
                        <List.Item>
                          {period.StartTime} ~ {period.EndTime}
                        </List.Item>
                      )}
                    />
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      key: `appointments`,
      icon: React.createElement(LaptopOutlined),
      label: `預約`,
      children: <Calendar dateCellRender={dateCellRender} fullscreen={false} />,
    },
  ];
  const createMemberDescription = (member) => {
    setMemberDetail([
      {
        key: "3",
        label: "照片",
        span: 2,
        children: (
          <Image
            crossOrigin="anonymous"
            src={member.Photo}
            height={150}
          ></Image>
        ),
      },
      {
        key: "1",
        label: "姓名",
        children:
          member.UserName.Name.LastName + member.UserName.Name.FirstName,
      },
      {
        key: "2",
        label: "暱稱",
        children: member.UserName.NickName,
      },

      {
        key: "3",
        label: "Email",
        children: member.Email,
      },
      {
        key: "5",
        label: "手機",

        children: member.Phone,
      },
    ]);
  };
  const createDescription = (currentSelectCounselor) => {
    setDetail([
      {
        key: "3",
        label: "照片",
        span: 2,
        children: (
          <Image
            crossOrigin="anonymous"
            src={currentSelectCounselor.Photo}
            height={150}
          ></Image>
        ),
      },
      {
        key: "1",
        label: "姓名",
        children:
          currentSelectCounselor?.UserName?.Name?.LastName +
          currentSelectCounselor?.UserName?.Name?.FirstName,
      },
      {
        key: "2",
        label: "暱稱",
        children: currentSelectCounselor?.UserName?.NickName,
      },

      {
        key: "3",
        label: "Email",
        children: currentSelectCounselor?.Email,
      },
      {
        key: "5",
        label: "手機",

        children: currentSelectCounselor?.Phone,
      },
      {
        key: "20",
        label: "語言",
        children: currentSelectCounselor?.Languages?.map((r) => (
          <Tag color="magenta" key={r}>{r}</Tag>
        )),
      },
      {
        key: "13",
        label: "地點",
        children: currentSelectCounselor.Location,
      },
      {
        key: "8",
        label: "學歷",

        children: currentSelectCounselor.Educational,
      },
      {
        key: "10",
        label: "職稱",
        children: currentSelectCounselor.Position,
      },
      {
        key: "7",
        label: "經歷",

        children: currentSelectCounselor.Seniority,
      },
      {
        key: "14",
        label: "從業時間",
        children: currentSelectCounselor.Accumulative + "+",
      },

      {
        key: "6",
        label: "認證狀態",

        children: (
          <Badge
            status="processing"
            text={currentSelectCounselor.IsVerify ? "已認證" : "未認證"}
          />
        ),
      },
      {
        key: "9",
        label: "機構資訊",

        children: currentSelectCounselor?.InstitutionTemp,
      },

      {
        key: "16",
        label: "服務類別",
        children: currentSelectCounselor?.ConsultingFees?.map((r) => {
          return (
            <Tag color="blue">
              {r.Type.Label}
              {r.Time}分鐘{r.Fee}元<br />
            </Tag>
          );
        }),
        span: 3,
      },
      {
        key: "17",
        label: "專長",
        children: currentSelectCounselor?.Expertises?.map((r) => {
          return (
            <Tag color="green">
              {r.Skill}
              <br />
            </Tag>
          );
        }),
      },
      {
        key: "18",
        label: "證照",
        children: (
          <>
            <Tag color="purple">
              發照單位:{currentSelectCounselor?.License?.LicenseIssuing}
            </Tag>
            <Tag color="purple">
              證照號碼:{currentSelectCounselor?.License?.LicenseNumber}
            </Tag>
            <Tag color="purple">
              證照名稱:{currentSelectCounselor?.License?.LicenseTitle}
            </Tag>
          </>
        ),
      },
      {
        key: "19",
        label: "性別",
        children: currentSelectCounselor?.Gender,
      },
      {
        key: "21",
        label: "身分",
        children: currentSelectCounselor?.SubRole,
      },

      {
        key: "10",
        label: "地址",
        children: currentSelectCounselor?.Address,
        span: 3,
      },
      {
        key: "15",
        label: "專長描述",
        children: currentSelectCounselor?.ExpertisesInfo,
        span: 3,
      },
      {
        key: "11",
        label: "自我介紹(簡短)",
        span: 3,
        children: currentSelectCounselor?.ShortIntroduction,
      },
      {
        key: "12",
        label: "自我介紹(長)",
        span: 3,
        children: currentSelectCounselor?.LongIntroduction,
      },
    ]);
  };



  const applySearch = (tabKey, values) => {
    setFilters(prev => ({
      ...prev,
      [tabKey]: values
    }));
    setCurrentPage(1);
  };

  const handleClear = (tabKey) => {
    const empty = { searchTerm: "", startDate: null, endDate: null, promoCodeFilter: "", adminFlagFilter: "全部" };
    setFilters(prev => ({
      ...prev,
      [tabKey]: empty
    }));
    setCurrentPage(1);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  const SearchCard = ({ tabKey }) => {
    const [localFilters, setLocalFilters] = useState(filters[tabKey] || { searchTerm: "", startDate: null, endDate: null, promoCodeFilter: "", adminFlagFilter: "全部" });
    useEffect(() => setLocalFilters(filters[tabKey]), [tabKey, filters]);
    return (
      <Card style={{ marginBottom: 16, backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Input
            value={localFilters.searchTerm}
            placeholder="輸入訂單編號/案主ID/案主姓名/諮商師姓名"
            style={{
              width: 300,
              fontSize: '14px'
            }}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            allowClear
            autoComplete="off"
          />
          <style dangerouslySetInnerHTML={{
            __html: `
              .ant-input::placeholder {
                font-size: 12px !important;
              }
            `
          }} />
          <Input
            value={localFilters.promoCodeFilter}
            placeholder="優惠代碼"
            style={{
              width: 120,
              fontSize: '14px'
            }}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, promoCodeFilter: e.target.value }))}
            allowClear
            autoComplete="off"
          />
          <Select
            placeholder="標記狀態"
            value={localFilters.adminFlagFilter}
            onChange={(value) => setLocalFilters(prev => ({ ...prev, adminFlagFilter: value }))}
            style={{ width: 120 }}
            allowClear
          >
            <Option value="全部">全部</Option>
            <Option value="Completed">已完成</Option>
            <Option value="CounselorUnCompleted">諮商師未完成</Option>
            <Option value="UserUnCompleted">案主未完成</Option>
            <Option value="CustomerServiceProcess">平台處理</Option>
            <Option value="WaitForProcess">待處理</Option>
            <Option value="Cancelled">已取消</Option>
          </Select>
          <DatePicker
            placeholder="開始日期"
            value={localFilters.startDate}
            onChange={(date) => setLocalFilters(prev => ({ ...prev, startDate: date }))}
          />
          <DatePicker
            placeholder="結束日期"
            value={localFilters.endDate}
            onChange={(date) => setLocalFilters(prev => ({ ...prev, endDate: date }))}
          />
          <style dangerouslySetInnerHTML={{
            __html: `
              .ant-picker-input input::placeholder {
                font-size: 12px !important;
              }
            `
          }} />
          <Button
            type="primary"
            onClick={() => applySearch(tabKey, localFilters)}
          >
            搜尋
          </Button>
          <Button
            onClick={() => handleClear(tabKey)}
          >
            清除篩選
          </Button>
        </div>
      </Card>
    );
  };

  const tabItems = [
    {
      key: "all",
      label: "所有預約",
      children: (
        <>
          <SearchCard tabKey="all" />
          <Statistic
            title="預約數量"
            value={filteredData.length}
            formatter={formatter}
          />
          <Table
            columns={columns(activeTab === "confirmed")}
            dataSource={paginatedData}
            spinning={loading}
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showSizeChanger
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            showQuickJumper
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          />
        </>
      ),
    },
    {
      key: "pending",
      label: "待處理",
      children: (
        <>
          <SearchCard tabKey="pending" />
          <Statistic
            title="待處理預約數量"
            value={filteredData.length}
            formatter={formatter}
          />
          <Table
            columns={columns(false)}
            dataSource={paginatedData}
            spinning={loading}
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showSizeChanger
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            showQuickJumper
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          />
        </>
      ),
    },
    {
      key: "confirmed",
      label: (
        <span>
          已確認
          <Badge
            count={tabCounts.confirmed}
            showZero
            style={{
              marginLeft: 8,
              backgroundColor: tabCounts.confirmed > 0 ? '#f5222d' : '#d9d9d9'
            }}
          />
        </span>
      ),
      children: (
        <>
          <SearchCard tabKey="confirmed" />
          <Statistic
            title="已確認預約數量"
            value={filteredData.length}
            formatter={formatter}
          />
          <Table
            columns={columns(true)}
            dataSource={paginatedData}
            spinning={loading}
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showSizeChanger
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            showQuickJumper
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          />
        </>
      ),
    },
    {
      key: "completed",
      label: "已完成",
      children: (
        <>
          <SearchCard tabKey="completed" />
          <Statistic
            title="已完成預約數量"
            value={filteredData.length}
            formatter={formatter}
          />
          <Table
            columns={columns(false)}
            dataSource={paginatedData}
            spinning={loading}
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showSizeChanger
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            showQuickJumper
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          />
        </>
      ),
    },
    {
      key: "cancelled",
      label: "已取消",
      children: (
        <>
          <SearchCard tabKey="cancelled" />
          <Statistic
            title="已取消預約數量"
            value={filteredData.length}
            formatter={formatter}
          />
          <Table
            columns={columns(false)}
            dataSource={paginatedData}
            spinning={loading}
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showSizeChanger
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            showQuickJumper
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          />
        </>
      ),
    },
  ];



  return (
    <>
      {contextHolder}
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        tabBarStyle={{ backgroundColor: '#fafafa', borderRadius: '8px', padding: '8px', marginBottom: '16px' }}
        items={tabItems}
      />
      <DrawerForm
        id={currentSelectCounselorId}
        callback={fetchData}
        visible={visible}
        onClose={handleClose}
        record={record}
        allAppointments={allAppointments}
      />

      <Modal
        title="諮商師詳情"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={1200}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "80vh", overflow: "auto" }}
      >
        <CounselorDetailModal counselorData={detail} counselorPhoto={Array.isArray(detail) ? detail.find(item => item.key === "3")?.children : null} />
      </Modal>
      <Modal
        title="Information"
        open={isModal2Open}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{ top: 20 }} // 设置高度为80%视窗高度
        width={"80%"}
        bodyStyle={{ height: "500px" }}
      >
        <Layout>
          <Layout>
            <Tabs
              defaultActiveKey={"information"}
              onChange={handleMenuClick}
              tabPosition="left"
              style={{
                height: "480px",
                borderRight: 0,
                overflowY: "auto",
                background: colorBgContainer,
              }}
              items={items3}
            />
          </Layout>
        </Layout>
      </Modal>
      <Modal
        title="確認取消預約"
        open={isCancelModalOpen}
        onOk={confirmCancelAppointment}
        onCancel={handleCancelModalClose}
        okText="確認取消"
        cancelText="返回"
        okButtonProps={{ danger: true }}
      >
        <p>確定要取消此預約嗎？</p>
        {selectedAppointmentForCancel && (
          <div>
            <p>
              預約編號：{selectedAppointmentForCancel.AppointmentID?.slice(-5)}
            </p>
            <p>案主姓名：{selectedAppointmentForCancel.UserName}</p>
            <p>諮商師：{selectedAppointmentForCancel.CounselorName}</p>
            <p>預約時間：{selectedAppointmentForCancel.DateTime}</p>
          </div>
        )}
        <p style={{ color: "red", marginTop: "10px" }}>
          取消後，標記狀態將自動設定為「待處理」
        </p>
      </Modal>
      <Modal
        title="預約詳情"
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        footer={null}
        width={1200}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "80vh", overflow: "auto" }}
      >
        {selectedAppointmentId && (
          <AppointmentDetailAdmin
            appointmentId={selectedAppointmentId}
            onClose={handleCloseDetailModal}
          />
        )}
      </Modal>
    </>
  );
};

export default Appointments;
