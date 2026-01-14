
import { Button, message, Card, Row, Col, Statistic, Divider } from "antd";
import { DownloadOutlined, FileTextOutlined, ShoppingCartOutlined, TagsOutlined, UserOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import moment from "moment";
import { meditationService, memberService, appointmentService } from "../../../service/ServicePool";

const Reports = () => {
  const handleDownloadMusicReport = async () => {
    try {
      const response = await meditationService.getMusicRecordExcel();
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "music_report.xlsx";
      link.click();
      message.success("音樂報表下載成功");
    } catch (error) {
      console.error("Download failed", error);
      message.error("音樂報表下載失敗");
    }
  };

  const handleDownloadAppointmentReport = async () => {
    try {
      const result = await appointmentService.getAllAppointmentForAdmin();
      const data = result.map((u) => ({
        AppointmentID: u.AppointmentID,
        UserID: u.UserID,
        UserName: u.UserName,
        CounselorID: u.CounselorID,
        CounselorName: u.CounselorName,
        PromoCodeID: u.PromoCodeID,
        DiscountFee: u.Service.Fee - u.DiscountFee,
        DateTime: u.Time.Date + " " + u.Time.StartTime,
        Fee: u.Service.Fee,
        Type: u.Service.Type.Label,
        AdminFlag: u.AdminFlag,
        CreateDate: moment(u.CreateDate, "YYYY-MM-DD HH-mm-ss").format("YYYY-MM-DD HH:mm:ss"),
        Status: u.Status,
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        "appointment_report.xlsx"
      );
      message.success("訂單報表下載成功");
    } catch (error) {
      console.error("Download failed", error);
      message.error("訂單報表下載失敗");
    }
  };

  const handleDownloadPromoCodeReport = async () => {
    try {
      let promoCodes = await memberService.getGetAllPromoCode();
      const data = promoCodes.map((p) => ({
        ID: p.ID,
        Token: p.Token,
        PresentToken: p.PresentToken,
        Type: p.Type === "COUNSELING" ? "諮商" : "冥想",
        ActionPresent: p.Action.ActionPresent,
        Effective: p.Effective ? "啟用中" : "停用中",
        ForCounselorList: p.ForCounselorList ? p.ForCounselorList.join(", ") : "",
        ForOneMember: p.ForOneMember ? "啟用" : "不啟用",
        DuplicateUse: p.DuplicateUse ? "啟用" : "不啟用",
        Action: p.Action.ActionCode === "MUL" ? p.Action.Value * 10 + "折" : p.Action.ActionCode === "SUB" ? "減" + p.Action.Value + "元" : "開通" + p.Action.Value + "個月",
        CanUseTimes: p.CanUseTimes === "-1" ? "無上限" : p.CanUseTimes,
        UsedTimes: p?.MemberPromoCodeRecord?.length > 0 ? p?.MemberPromoCodeRecord?.length : "0",
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        "promo_code_report.xlsx"
      );
      message.success("優惠代碼報表下載成功");
    } catch (error) {
      console.error("Download failed", error);
      message.error("優惠代碼報表下載失敗");
    }
  };

  const handleDownloadUserReport = async () => {
    try {
      const result = await memberService.getGetAllUser();
      const data = result.map((u) => ({
        name: u.information.user_name.nick_name,
        photo: u.photo,
        account: u.mail,
        birthdate: u.birthdate,
        membership: u.membership.level === "premium" ? "premium" : "free",
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        "user_report.xlsx"
      );
      message.success("用戶報表下載成功");
    } catch (error) {
      console.error("Download failed", error);
      message.error("用戶報表下載失敗");
    }
  };



  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: 0, color: "#1890ff" }}>報表管理</h1>
        <p style={{ color: "#666", marginTop: "8px" }}>下載各種數據報表以進行分析和管理</p>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{ height: "100%" }}
            cover={
              <div style={{ textAlign: "center", padding: "20px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
                <FileTextOutlined style={{ fontSize: "48px" }} />
              </div>
            }
            actions={[
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownloadMusicReport}
                style={{ width: "100%" }}
              >
                下載音樂報表
              </Button>
            ]}
          >
            <Card.Meta
              title="音樂報表"
              description="包含所有音樂播放記錄和統計數據"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{ height: "100%" }}
            cover={
              <div style={{ textAlign: "center", padding: "20px", background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", color: "white" }}>
                <ShoppingCartOutlined style={{ fontSize: "48px" }} />
              </div>
            }
            actions={[
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownloadAppointmentReport}
                style={{ width: "100%" }}
              >
                下載訂單報表
              </Button>
            ]}
          >
            <Card.Meta
              title="訂單報表"
              description="諮商預約訂單的詳細記錄和統計"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{ height: "100%" }}
            cover={
              <div style={{ textAlign: "center", padding: "20px", background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", color: "white" }}>
                <TagsOutlined style={{ fontSize: "48px" }} />
              </div>
            }
            actions={[
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownloadPromoCodeReport}
                style={{ width: "100%" }}
              >
                下載優惠代碼報表
              </Button>
            ]}
          >
            <Card.Meta
              title="優惠代碼報表"
              description="所有優惠代碼的使用情況和統計"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{ height: "100%" }}
            cover={
              <div style={{ textAlign: "center", padding: "20px", background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", color: "white" }}>
                <UserOutlined style={{ fontSize: "48px" }} />
              </div>
            }
            actions={[
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownloadUserReport}
                style={{ width: "100%" }}
              >
                下載用戶報表
              </Button>
            ]}
          >
            <Card.Meta
              title="用戶報表"
              description="用戶信息、會員等級統計"
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <div style={{ textAlign: "center", marginTop: "32px" }}>
        <Statistic
          title="報表類型"
          value={4}
          suffix="種"
          valueStyle={{ color: "#1890ff" }}
        />
      </div>
    </div>
  );
};

export default Reports;
