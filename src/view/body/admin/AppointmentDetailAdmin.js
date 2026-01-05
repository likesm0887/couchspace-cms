import React, { useEffect, useState } from "react";
import {
  Card,
  Descriptions,
  Timeline,
  Tag,
  Button,
  Spin,
  message,
  Space,
  Divider,
  Row,
  Col,
  Avatar,
  Typography,
  Collapse,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  DollarOutlined,
  CalendarOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { appointmentService, memberService, counselorService } from "../../../service/ServicePool";

const { Title, Text } = Typography;

// 管理標記狀態映射
const getAdminFlagText = (flag) => {
  const flagMap = {
    Completed: "已完成",
    CounselorUnCompleted: "諮商師未完成",
    UserUnCompleted: "案主未完成",
    CustomerServiceProcess: "平台處理",
    WaitForProcess: "待處理",
    Cancelled: "已取消",
  };
  return flagMap[flag] || flag || "無";
};

const AppointmentDetailAdmin = ({ appointmentId, onClose }) => {
  const [appointment, setAppointment] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [counselorInfo, setCounselorInfo] = useState(null);
  const [promoCodeInfo, setPromoCodeInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AppointmentDetailAdmin useEffect triggered, appointmentId:', appointmentId);
    if (appointmentId) {
      fetchAppointmentDetail();
    }
  }, [appointmentId]);

  const fetchAppointmentDetail = async () => {
    try {
      setLoading(true);

      // Get appointment details
      const appointmentData = await appointmentService.getAllAppointmentForAdmin();
      const currentAppointment = appointmentData.find(app => app.AppointmentID === appointmentId);

      if (!currentAppointment) {
        message.error("找不到該預約記錄");
        onClose && onClose();
        return;
      }

      console.log("Appointment data:", currentAppointment);
      console.log("Service.Fee:", currentAppointment.Service?.Fee);
      console.log("Fee:", currentAppointment.Fee);
      console.log("PromoCodeID:", currentAppointment.PromoCodeID);
      setAppointment(currentAppointment);

      // Get promo code info if exists
      if (currentAppointment.PromoCodeID) {
        try {
          const promoData = await memberService.getPromoCode(currentAppointment.PromoCodeID);
          setPromoCodeInfo(promoData);
        } catch (error) {
          console.error("獲取優惠代碼資訊失敗:", error);
        }
      }

      // Get user info
      try {
        const userData = await memberService.getGetUserById(currentAppointment.UserID);
        setUserInfo(userData);
      } catch (error) {
        console.error("獲取用戶信息失敗:", error);
      }

      // Get counselor info
      try {
        const counselorData = await counselorService.getCounselorInfoById(currentAppointment.CounselorID);
        setCounselorInfo(counselorData);
      } catch (error) {
        console.error("獲取諮商師信息失敗:", error);
      }

    } catch (error) {
      console.error("獲取預約詳情失敗:", error);
      message.error("獲取預約詳情失敗");
      onClose && onClose();
    } finally {
      setLoading(false);
    }
  };

  const getStatusDesc = (code) => {
    const statusMap = {
      NEW: { text: "訂單成立(未付款)", color: "orange", icon: <ExclamationCircleOutlined /> },
      UNPAID: { text: "訂單成立(未付款)", color: "orange", icon: <ExclamationCircleOutlined /> },
      CONFIRMED: { text: "已確認", color: "blue", icon: <CheckCircleOutlined /> },
      ROOMCREATED: { text: "諮商房間已建立", color: "green", icon: <CheckCircleOutlined /> },
      CANCELLED: { text: "已取消", color: "red", icon: <CloseCircleOutlined /> },
      COMPLETED: { text: "已完成", color: "purple", icon: <CheckCircleOutlined /> },
    };
    return statusMap[code?.toUpperCase()] || { text: code, color: "default", icon: <ClockCircleOutlined /> };
  };

  const generateTimeline = () => {
    if (!appointment) return [];

    const timeline = [];
    const createDate = moment(appointment.CreateDate, "YYYY-MM-DD HH:mm:SS");

    // 訂單成立
    timeline.push({
      label: createDate.format("YYYY-MM-DD HH:mm"),
      children: "訂單成立",
      color: "blue",
      dot: <ClockCircleOutlined />,
    });

    // 模擬狀態轉換（基於現有數據）
    if (appointment.Status?.toUpperCase() === "CONFIRMED" || appointment.Status?.toUpperCase() === "ROOMCREATED" || appointment.Status?.toUpperCase() === "COMPLETED") {
      const confirmedDate = createDate.clone().add(1, 'hours'); // 假設確認時間
      timeline.push({
        label: confirmedDate.format("YYYY-MM-DD HH:mm"),
        children: "預約已確認",
        color: "green",
        dot: <CheckCircleOutlined />,
      });
    }

  if (appointment.Status?.toUpperCase() === "ROOMCREATED" || appointment.Status?.toUpperCase() === "COMPLETED") {
    const appointmentDateTime = moment(`${appointment.Time?.Date} ${appointment.Time?.StartTime}`, "YYYY-MM-DD HH:mm");
    const roomCreatedDate = appointmentDateTime.clone().subtract(1, 'hours'); // 諮商時間前一個小時
    timeline.push({
      label: roomCreatedDate.format("YYYY-MM-DD HH:mm"),
      children: "諮商房間已建立",
      color: "green",
      dot: <CheckCircleOutlined />,
    });
  }

  if (appointment.Status?.toUpperCase() === "ROOMCREATED" || appointment.Status?.toUpperCase() === "COMPLETED") {
    const appointmentStartDateTime = moment(`${appointment.Time?.Date} ${appointment.Time?.StartTime}`, "YYYY-MM-DD HH:mm");
    timeline.push({
      label: appointmentStartDateTime.format("YYYY-MM-DD HH:mm"),
      children: "諮商開始",
      color: "blue",
      dot: <ClockCircleOutlined />,
    });
  }

  if (appointment.Status?.toUpperCase() === "COMPLETED") {
    const appointmentEndDateTime = moment(`${appointment.Time?.Date} ${appointment.Time?.EndTime}`, "YYYY-MM-DD HH:mm");
    timeline.push({
      label: appointmentEndDateTime.format("YYYY-MM-DD HH:mm"),
      children: "諮商已完成",
      color: "purple",
      dot: <CheckCircleOutlined />,
    });
  }

    if (appointment.Status?.toUpperCase() === "CANCELLED") {
      const cancelledDate = createDate.clone().add(1, 'days'); // 假設取消時間
      timeline.push({
        label: cancelledDate.format("YYYY-MM-DD HH:mm"),
        children: "預約已取消",
        color: "red",
        dot: <CloseCircleOutlined />,
      });
    }

    // 如果有時間更新記錄
    if (appointment.TimeUpdateRecord && appointment.TimeUpdateRecord.length > 0) {
      appointment.TimeUpdateRecord.forEach((record, index) => {
        timeline.push({
          label: moment(record.TimeStamp).format("YYYY-MM-DD HH:mm"),
          children: `時間更新 ${index + 1}: ${record.Time.Date} ${record.Time.StartTime}-${record.Time.EndTime}`,
          color: "orange",
          dot: <CalendarOutlined />,
        });
      });
    }

    return timeline.sort((a, b) => moment(a.label, "YYYY-MM-DD HH:mm").valueOf() - moment(b.label, "YYYY-MM-DD HH:mm").valueOf());
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Text type="danger">預約記錄不存在</Text>
      </div>
    );
  }

  const statusInfo = getStatusDesc(appointment.Status);

  return (
    <div style={{ padding: "16px", backgroundColor: "#f5f5f5" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", padding: "16px", backgroundColor: "#fff", borderRadius: "8px" }}>
          <Title level={4} style={{ margin: 0 }}>
            預約詳情 - {appointment.AppointmentID?.slice(-8).toUpperCase()}
          </Title>
          <Tag color={statusInfo.color} icon={statusInfo.icon} style={{ marginTop: "8px" }}>
            {statusInfo.text}
          </Tag>
        </div>

        <Row gutter={24}>
          {/* 基本資訊 */}
          <Col xs={24} lg={12}>
            <Card title={<Space><UserOutlined />預約資訊</Space>} bordered={false}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="交易單號">
                  <Text copyable>{appointment.AppointmentID}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="訂單成立時間">
                  {moment(appointment.CreateDate, "YYYY-MM-DD HH:mm:SS").format("YYYY-MM-DD HH:mm:SS")}
                </Descriptions.Item>
                <Descriptions.Item label="預約日期時間">
                  {appointment.Time?.Date} {appointment.Time?.StartTime} - {appointment.Time?.EndTime}
                </Descriptions.Item>
                <Descriptions.Item label="服務項目">
                  {appointment.Service?.Type?.Label} ({appointment.Service?.Time}分鐘)
                </Descriptions.Item>
                <Descriptions.Item label="費用">
                  <Space direction="vertical" size={4}>
                    {appointment.PromoCodeID ? (
                      <>
                        <div>
                          <Text delete style={{ fontSize: "14px", color: "#8c8c8c" }}>
                            原價: NT$ {appointment.Fee?.toLocaleString()}
                          </Text>
                        </div>
                        <div>
                          <Text type="success" style={{ fontSize: "14px" }}>
                            折扣: -NT$ {(appointment.Fee - appointment.DiscountFee)?.toLocaleString()}
                          </Text>
                        </div>
                        <div>
                          <DollarOutlined />
                          <Text strong style={{ fontSize: "16px", marginLeft: "4px" }}>
                            折扣後: NT$ {appointment.DiscountFee?.toLocaleString()}
                          </Text>
                        </div>
                      </>
                    ) : (
                      <div>
                        <DollarOutlined />
                        <Text strong style={{ fontSize: "16px" }}>
                          NT$ {appointment.Fee?.toLocaleString()}
                        </Text>
                      </div>
                    )}
                  </Space>
                </Descriptions.Item>
                {appointment.PromoCodeID && (
                  <Descriptions.Item label="優惠代碼">
                    {appointment.PromoCodeID}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </Col>

          {/* 狀態時間軸 */}
          <Col xs={24} lg={12}>
            <Card title={<Space><ClockCircleOutlined />狀態時間軸</Space>} bordered={false}>
              <Timeline
                mode="left"
                items={generateTimeline()}
              />
            </Card>
          </Col>
        </Row>

        {/* 優惠代碼詳細資訊 - 摺疊 */}
        {promoCodeInfo && (
          <Collapse
            size="small"
            items={[
              {
                key: 'promo-code',
                label: '優惠代碼詳細資訊',
                children: (
                  <Descriptions column={2} size="small" style={{ marginTop: '8px' }}>
                    <Descriptions.Item label="優惠代碼ID">
                      <Text copyable>{promoCodeInfo.ID}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="優惠代碼">
                      {promoCodeInfo.Token}
                    </Descriptions.Item>
                    <Descriptions.Item label="Code">
                      {promoCodeInfo.PresentToken}
                    </Descriptions.Item>
                    <Descriptions.Item label="類型">
                      {promoCodeInfo.Type === "COUNSELING" ? "諮商" : "冥想"}
                    </Descriptions.Item>
                    <Descriptions.Item label="優惠內容">
                      {promoCodeInfo.Action?.ActionCode === "MUL" && `${promoCodeInfo.Action?.Value * 10}折`}
                      {promoCodeInfo.Action?.ActionCode === "SUB" && `減${promoCodeInfo.Action?.Value}元`}
                      {promoCodeInfo.Action?.ActionCode === "PREMIUM" && `開通${promoCodeInfo.Action?.Value}個月`}
                    </Descriptions.Item>
                    <Descriptions.Item label="成功後顯示">
                      {promoCodeInfo.Action?.ActionPresent}
                    </Descriptions.Item>
                    <Descriptions.Item label="狀態">
                      <Tag color={promoCodeInfo.Effective ? "green" : "red"}>
                        {promoCodeInfo.Effective ? "啟用中" : "停用中"}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="使用上限">
                      {promoCodeInfo.CanUseTimes === -1 ? "無上限" : promoCodeInfo.CanUseTimes}
                    </Descriptions.Item>
                    <Descriptions.Item label="已使用次數">
                      {promoCodeInfo.MemberPromoCodeRecord?.length || 0}
                    </Descriptions.Item>
                    <Descriptions.Item label="重複使用">
                      {promoCodeInfo.DuplicateUse ? "啟用" : "不啟用"}
                    </Descriptions.Item>
                    <Descriptions.Item label="單一使用者">
                      {promoCodeInfo.ForOneMember ? "啟用" : "不啟用"}
                    </Descriptions.Item>
                    <Descriptions.Item label="有效期間" span={2}>
                      {moment(promoCodeInfo.EffectiveStartTime).format("YYYY-MM-DD")} ~ {moment(promoCodeInfo.EffectiveEndTime).format("YYYY-MM-DD")}
                    </Descriptions.Item>
                    {promoCodeInfo.ForCounselorList && promoCodeInfo.ForCounselorList.length > 0 && (
                      <Descriptions.Item label="諮商師專屬" span={2}>
                        限指定諮商師使用
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                ),
              },
            ]}
          />
        )}

        <Row gutter={24}>
          {/* 案主資訊 */}
          <Col xs={24} lg={12}>
            <Card title={<Space><UserOutlined />案主資訊</Space>} bordered={false}>
              {userInfo ? (
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="姓名">
                    {userInfo.UserName?.Name?.LastName}{userInfo.UserName?.Name?.FirstName}
                  </Descriptions.Item>
                  <Descriptions.Item label="暱稱">
                    {userInfo.UserName?.NickName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {userInfo.Email}
                  </Descriptions.Item>
                  <Descriptions.Item label="手機">
                    {userInfo.Phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="案主ID">
                    <Text copyable>{appointment.UserID}</Text>
                  </Descriptions.Item>
                </Descriptions>
              ) : (
                <Text type="secondary">無法獲取案主資訊</Text>
              )}
            </Card>
          </Col>

          {/* 諮商師資訊 */}
          <Col xs={24} lg={12}>
            <Card title={<Space><UserOutlined />諮商師資訊</Space>} bordered={false}>
              {counselorInfo ? (
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="姓名">
                    {counselorInfo.UserName?.Name?.LastName}{counselorInfo.UserName?.Name?.FirstName}
                  </Descriptions.Item>
                  <Descriptions.Item label="暱稱">
                    {counselorInfo.UserName?.NickName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {counselorInfo.Email}
                  </Descriptions.Item>
                  <Descriptions.Item label="手機">
                    {counselorInfo.Phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="諮商師ID">
                    <Text copyable>{appointment.CounselorID}</Text>
                  </Descriptions.Item>
                  {counselorInfo.isVerify && (
                    <Descriptions.Item label="認證狀態">
                      <Tag color="green">已認證</Tag>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              ) : (
                <Text type="secondary">無法獲取諮商師資訊</Text>
              )}
            </Card>
          </Col>
        </Row>

        {/* 問題簡述 */}
        {appointment.ProblemStatement && (
          <Card title={<Space><MessageOutlined />問題簡述</Space>} bordered={false}>
            <Text>{appointment.ProblemStatement}</Text>
          </Card>
        )}

        {/* 緊急聯絡人 */}
        {appointment.Emergency && appointment.Emergency.Name && (
          <Card title="緊急聯絡人" bordered={false}>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="姓名">{appointment.Emergency.Name}</Descriptions.Item>
              <Descriptions.Item label="關係">{appointment.Emergency.Relationship}</Descriptions.Item>
              <Descriptions.Item label="聯絡電話">{appointment.Emergency.Phone}</Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        {/* 健康量表 */}
        {appointment.SymptomRating && (
          <Card title="健康量表" bordered={false}>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="睡眠困難">
                {appointment.SymptomRating.SleepDifficulty || 0}
              </Descriptions.Item>
              <Descriptions.Item label="神經質">
                {appointment.SymptomRating.Nervous || 0}
              </Descriptions.Item>
              <Descriptions.Item label="易怒">
                {appointment.SymptomRating.Irritated || 0}
              </Descriptions.Item>
              <Descriptions.Item label="憂鬱/沮喪">
                {appointment.SymptomRating.MelancholyDepressed || 0}
              </Descriptions.Item>
              <Descriptions.Item label="劣等感">
                {appointment.SymptomRating.InferiorFeeling || 0}
              </Descriptions.Item>
              <Descriptions.Item label="自殺念頭">
                {appointment.SymptomRating.Suicidalthoughts || 0}
              </Descriptions.Item>
              <Descriptions.Item label="總分" span={2}>
                <Text strong style={{ fontSize: "16px", color: (appointment.SymptomRating.TotalScore || 0) > 10 ? "#ff4d4f" : "#1890ff" }}>
                  {appointment.SymptomRating.TotalScore || 0}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        {/* 管理標記 */}
        <Card title="管理標記" bordered={false}>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="管理標記">
              <Tag color={
                appointment.AdminFlag === "Completed" ? "green" :
                appointment.AdminFlag === "Cancelled" ? "red" :
                appointment.AdminFlag === "WaitForProcess" ? "orange" :
                appointment.AdminFlag === "CustomerServiceProcess" ? "blue" :
                "default"
              }>
                {getAdminFlagText(appointment.AdminFlag)}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </div>
  );
};

export default AppointmentDetailAdmin;
