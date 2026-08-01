import React, { useState } from "react";
import { Button, Card, Select, message, Statistic, Row, Col, Divider, Space } from "antd";
import { DownloadOutlined, CalendarOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import moment from "moment";
import { appointmentService } from "../../../service/ServicePool";

const TriggerReport = () => {
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [reportData, setReportData] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // 獲取當前年月的預設值
  const defaultYear = moment().year();
  const defaultMonth = moment().month() + 1;

  const handleDownloadReport = async () => {
    if (!selectedYear || !selectedMonth) {
      message.error("請選擇年月");
      return;
    }

    setLoading(true);
    try {
      const response = await appointmentService.getTriggerPrintAll(selectedYear, selectedMonth);
      
      // 檢查Response狀態碼，如果是錯誤狀態，直接處理錯誤
      if (!response.ok) {
        try {
          const errorData = await response.json();
          if (errorData && errorData.error_code === "9999") {
            message.error(errorData.message || "無法為此年月生成 Excel 檔案");
            return;
          } else {
            message.error("API請求失敗，請稍後再試");
            return;
          }
        } catch (error) {
          message.error("API請求失敗，請稍後再試");
          return;
        }
      }
      
      // 檢查是否是二進位數據（Excel檔案）
      if (response && response.blob) {
        // 檢查是否是錯誤響應（再次確認Content-Type）
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            // 如果是JSON錯誤響應，讀取錯誤訊息
            const errorData = await response.json();
            if (errorData && errorData.error_code === "9999") {
              message.error(errorData.message || "無法為此年月生成 Excel 檔案");
              return;
            }
          } catch (error) {
            // 如果無法解析JSON，繼續嘗試作為Excel處理
          }
        }
        
        // 如果是 Excel 檔案，直接取得 blob
        const blob = await response.blob();
        const fileName = `trigger_report_${selectedYear}_${String(selectedMonth).padStart(2, '0')}_${moment().format("YYYY-MM-DD_HH-mm-ss")}.xlsx`;
        
        saveAs(blob, fileName);
        message.success("觸發報表下載成功");
      } else {
        // 如果是 JSON 數據，則按原來的方式處理
        console.log("API 回傳資料:", response);
        
        // 檢查是否有錯誤訊息
        if (response && response.error_code === "9999") {
          message.error(response.message || "無法為此年月生成 Excel 檔案");
          return;
        }
        
        // 處理 API 回傳的資料
        let dataToExport = [];
        let count = 0;

        if (response && Array.isArray(response)) {
          // 如果 API 回傳的是陣列
          dataToExport = response;
          count = response.length;
        } else if (response) {
          // 如果 API 回傳的是物件，轉換為陣列
          dataToExport = [response];
          count = 1;
        } else {
          // 如果沒有資料
          dataToExport = [];
          count = 0;
        }

        setReportData(dataToExport);
        setTotalCount(count);

        // 將資料轉換為 Excel 格式
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        
        // 生成檔案名稱
        const fileName = `trigger_report_${selectedYear}_${String(selectedMonth).padStart(2, '0')}_${moment().format("YYYY-MM-DD_HH-mm-ss")}.xlsx`;
        
        // 下載檔案
        saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          fileName
        );
        
        message.success(`觸發報表下載成功 (${count} 筆資料)`);
      }
    } catch (error) {
      console.error("下載失敗:", error);
      
      // 檢查是否是後端錯誤訊息
      if (error.response && error.response.data) {
        try {
          const errorText = await error.response.data.text();
          message.error(`後端錯誤: ${errorText}`);
        } catch (textError) {
          message.error("後端錯誤，請稍後再試");
        }
      } else {
        message.error("觸發報表下載失敗，請稍後再試");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  const handleReset = () => {
    setSelectedYear(defaultYear);
    setSelectedMonth(defaultMonth);
    setReportData(null);
    setTotalCount(0);
  };

  return (
    <div style={{ padding: "24px", background: "var(--cms-bg)", minHeight: "100vh" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: 0, color: "#1890ff" }}>收聽次數報表</h1>
        <p style={{ color: "#666", marginTop: "8px" }}>選擇年月並下載對應的收聽次數報表</p>
      </div>

      <Card style={{ marginBottom: "24px" }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={6}>
            <span style={{ fontWeight: "bold", marginRight: "8px" }}>選擇年份:</span>
            <Select
              value={selectedYear}
              onChange={handleYearChange}
              style={{ width: "100%" }}
              placeholder="選擇年份"
            >
              {Array.from({ length: 5 }, (_, i) => 2025 + i).map(year => (
                <Select.Option key={year} value={year}>
                  {year}年
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <span style={{ fontWeight: "bold", marginRight: "8px" }}>選擇月份:</span>
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              style={{ width: "100%" }}
              placeholder="選擇月份"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <Select.Option key={month} value={month}>
                  {month}月
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12}>
            <Space>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownloadReport}
                loading={loading}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                下載報表
              </Button>
              <Button
                onClick={handleReset}
                disabled={loading}
              >
                重置為當前年月
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {(reportData || totalCount > 0) && (
        <Card style={{ marginBottom: "24px" }}>
          <Row gutter={24}>
            <Col span={8}>
              <Statistic
                title="選擇的年月"
                value={`${selectedYear}年${selectedMonth}月`}
                prefix={<CalendarOutlined />}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="資料筆數"
                value={totalCount}
                valueStyle={{ color: '#3f8600' }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="預設年月"
                value={`${defaultYear}年${defaultMonth}月`}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
          </Row>
        </Card>
      )}

      <Card>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <CalendarOutlined style={{ fontSize: "64px", color: "#1890ff", marginBottom: "16px" }} />
          <h2 style={{ color: "#666", marginBottom: "8px" }}>收聽次數報表</h2>
          <p style={{ color: "#999", marginBottom: "24px" }}>
            選擇要查詢的年月，然後點擊「下載報表」按鈕
            <br />
            系統將自動調用 API 並生成 Excel 檔案
          </p>
          <Divider />
          <div style={{ color: "#999", fontSize: "12px" }}>
            <br />
            預設年月: {defaultYear}年{defaultMonth}月
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TriggerReport;