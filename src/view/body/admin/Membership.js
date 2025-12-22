// 會員資格管理頁面 - 重新設計版本

import React, { useState } from "react";
import {
  Input,
  DatePicker,
  Button,
  Space,
  message,
  Upload,
  Table,
  Row,
  Col,
  Spin,
  Modal,
  Divider,
  Card,
  Typography,
  Form,
} from "antd";
import { UploadOutlined, CrownOutlined, UserOutlined, FileExcelOutlined } from "@ant-design/icons";
import { memberService } from "../../../service/ServicePool";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const Membership = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [memberAccount, setMemberAccount] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successResultData, setSuccessResultData] = useState([]);
  const [failResultData, setFailResultData] = useState([]);
  const [form] = Form.useForm();

  const handleMemberAccountChange = (e) => {
    setMemberAccount(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (level) => {
    if (!memberAccount || !selectedDate) {
      messageApi.open({
        type: "error",
        content: "請輸入會員帳號和選擇到期日期",
      });
      return;
    }

    var result = await memberService.setMembership([
      {
        Email: memberAccount,
        ExpiredDate: formatTo(selectedDate),
        Command: level,
      },
    ]);
    console.log(result[0]);

    if (result[0].success) {
      console.log(result);
      messageApi.open({
        type: "success",
        content: level === 'LEVELUP' ? "已升級為Premium" : "已降級為平民",
      });
      // 清空表單
      setMemberAccount("");
      setSelectedDate(null);
      form.resetFields();
    } else {
      console.log(result);
      messageApi.open({
        type: "error",
        content: "操作失敗 失敗原因: " + result[0].status_text,
      });
    }
  };

  const batchSubmit = async () => {
    if (data.length === 0) {
      messageApi.open({
        type: "error",
        content: "請先上傳會員列表",
      });
      return;
    }

    setLoading(true);
    var result = await memberService.setMembership(data);
    setLoading(false);
    console.log(result[0]);
    setSuccessResultData(result.filter((r) => r.success));
    setFailResultData(result.filter((r) => !r.success));
    setIsModalOpen(true);
  };

  const formatTo = (dateString) => {
    const dateObj = new Date(dateString);
    const year = dateObj.getUTCFullYear();
    const month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getUTCDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const props = {
    name: "file",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} 文件上傳成功`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} 文件上傳失敗`);
      }
    },
    onRemove() {
      setData([]);
    },
    beforeUpload(file) {
      const valid =
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";
      if (!valid) {
        message.error(`${file.name} 不是有效的Excel文件`);
        return false;
      }
      if (valid) {
        console.log(valid);
        const formData = new FormData();
        formData.append("file", file);
        setLoading(true);
        memberService.uploadMembership(formData).then((res) => {
          setData(res);
          setLoading(false);
          return true;
        });
      }
      return false;
    },
  };

  const columns = [
    {
      title: "會員帳號",
      dataIndex: "Email",
      key: "Email",
    },
    {
      title: "到期日期",
      dataIndex: "ExpiredDate",
      key: "ExpiredDate",
    },
  ];

  const resultColumns = [
    {
      title: "帳號",
      dataIndex: "error_code",
      key: "error_code",
      width: "30%",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "狀態",
      dataIndex: "status_text",
      key: "status_text",
      width: "70%",
    },
  ];

  return (
    <Spin spinning={loading}>
      <div style={{ padding: "24px" }}>
        <Title level={2} style={{ marginBottom: "24px", textAlign: "center" }}>
          <CrownOutlined style={{ marginRight: "8px" }} />
          會員資格管理
        </Title>

        <Modal
          title="批量處理結果"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width="50%"
          centered
        >
          <Divider orientation="left">處理成功</Divider>
          <Table
            columns={resultColumns}
            dataSource={successResultData}
            pagination={false}
            scroll={{ y: 200 }}
            size="small"
          />
          <Divider orientation="left">處理失敗</Divider>
          <Table
            columns={resultColumns}
            dataSource={failResultData}
            pagination={false}
            scroll={{ y: 200 }}
            size="small"
          />
        </Modal>

        <Row gutter={[24, 24]}>
          {/* 單個會員操作卡片 */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <>
                  <UserOutlined style={{ marginRight: "8px" }} />
                  單個會員操作
                </>
              }
              bordered={false}
              style={{ height: "100%" }}
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  label="會員帳號"
                  rules={[{ required: true, message: "請輸入會員帳號" }]}
                >
                  <Input
                    placeholder="請輸入會員帳號"
                    value={memberAccount}
                    onChange={handleMemberAccountChange}
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="到期日期"
                  rules={[{ required: true, message: "請選擇到期日期" }]}
                >
                  <DatePicker
                    presets={[
                      {
                        label: "一個月",
                        value: dayjs().add(1, "month"),
                      },
                      {
                        label: "三個月",
                        value: dayjs().add(3, "month"),
                      },
                      {
                        label: "六個月",
                        value: dayjs().add(6, "month"),
                      },
                      {
                        label: "九個月",
                        value: dayjs().add(9, "month"),
                      },
                      {
                        label: "一年",
                        value: dayjs().add(12, "month"),
                      },
                      {
                        label: "永久",
                        value: dayjs().add(999, "year"),
                      },
                    ]}
                    placeholder="選擇到期日期"
                    value={selectedDate}
                    onChange={handleDateChange}
                    size="large"
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item>
                  <Space size="middle">
                    <Button
                      type="primary"
                      size="large"
                      icon={<CrownOutlined />}
                      onClick={() => handleSubmit("LEVELUP")}
                    >
                      升級為Premium
                    </Button>
                    <Button
                      danger
                      size="large"
                      onClick={() => handleSubmit("LEVELDOWN")}
                    >
                      降級為平民
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* 批量操作卡片 */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <>
                  <FileExcelOutlined style={{ marginRight: "8px" }} />
                  批量操作
                </>
              }
              bordered={false}
              style={{ height: "100%" }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <Text strong>步驟1: 上傳會員列表</Text>
                  <br />
                  <Text type="secondary">請上傳包含會員帳號和到期日期的Excel文件</Text>
                </div>

                <Upload {...props} maxCount={1} style={{ width: "100%" }}>
                  <Button
                    icon={<UploadOutlined />}
                    size="large"
                    block
                    style={{ height: "48px" }}
                  >
                    點擊上傳Premium會員列表
                  </Button>
                </Upload>

                {data.length > 0 && (
                  <>
                    <div>
                      <Text strong>步驟2: 確認並批量處理</Text>
                    </div>

                    <Space>
                      <Button
                        type="primary"
                        size="large"
                        icon={<CrownOutlined />}
                        onClick={batchSubmit}
                      >
                        通通升級為Premium
                      </Button>
                      <Button size="large" onClick={showModal}>
                        查看上次結果
                      </Button>
                    </Space>

                    <div>
                      <Text strong>預覽列表 ({data.length} 筆資料)</Text>
                    </div>

                    <Table
                      dataSource={data}
                      columns={columns}
                      pagination={{ pageSize: 5 }}
                      size="small"
                      scroll={{ y: 200 }}
                    />
                  </>
                )}
              </Space>
            </Card>
          </Col>
        </Row>

        {contextHolder}
      </div>
    </Spin>
  );
};

export default Membership;
