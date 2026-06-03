import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Modal, Select, Space, Switch, Table, Image, Spin } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import { challengeService, meditationService } from "../../../service/ServicePool";

const { TextArea } = Input;

/* ── Design tokens ── */
const bg = "#F6F7F9";
const panel = "#FFFFFF";
const line = "#E6E8EC";
const line2 = "#EEF0F3";
const ink = "#10141B";
const ink2 = "#3B414C";
const muted = "#6B7280";
const accent = "#4556f0";
const accentSoft = "#EEF0FE";

/* ── Stat card ── */
function StatCard({ label, value, unit, note, last }) {
  return (
    <div style={{ flex: 1, padding: "16px 20px", borderRight: last ? "none" : `1px solid ${line}` }}>
      <div style={{ fontSize: 11, color: muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 22, fontWeight: 600, color: ink }}>
        {value}
        {unit && <span style={{ fontSize: 13, color: muted, fontWeight: 400, marginLeft: 3 }}>{unit}</span>}
      </div>
      {note && <div style={{ marginTop: 4, fontSize: 12, color: muted }}>{note}</div>}
    </div>
  );
}

function ChallengeManagement() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [series, setSeries] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [challengeList, seriesList] = await Promise.all([
        challengeService.getAllChallenges(),
        meditationService.getAllCourse(),
      ]);
      setChallenges(challengeList || []);
      setSeries(seriesList || []);
    } catch (error) {
      console.error(error);
      messageApi.error("載入資料失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = () => { setEditingChallenge(null); form.resetFields(); setIsModalVisible(true); };

  const handleEdit = (record) => {
    setEditingChallenge(record);
    form.setFieldsValue({
      identifierID: record.identifierID || "",
      title: record.title,
      description: record.description,
      imageUrl: record.imageUrl || "",
      courseIds: record.courseIds || [],
      isEnabled: record.isEnabled,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (challengeId) => {
    Modal.confirm({
      title: "確認刪除", content: "確定要刪除此挑戰嗎？", okText: "確定", cancelText: "取消",
      onOk: async () => {
        try {
          await challengeService.deleteChallenge(challengeId);
          messageApi.success("挑戰已刪除");
          fetchData();
        } catch (error) {
          console.error(error);
          messageApi.error("刪除失敗，請稍後再試");
        }
      },
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingChallenge) {
        await challengeService.updateChallenge({ ...values, challengeId: editingChallenge._id });
        messageApi.success("挑戰已更新");
      } else {
        await challengeService.createChallenge(values);
        messageApi.success("挑戰已新增");
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      console.error(error);
      messageApi.error("儲存失敗，請稍後再試");
    }
  };

  const handleToggleEnabled = async (record) => {
    try {
      await challengeService.updateChallenge({ ...record, challengeId: record._id, isEnabled: !record.isEnabled });
      messageApi.success("狀態已更新");
      fetchData();
    } catch (error) {
      console.error(error);
      messageApi.error("更新失敗");
    }
  };

  const enabledCount = challenges.filter((c) => c.isEnabled).length;

  const columns = [
    { title: "辨認ID", dataIndex: "identifierID", key: "identifierID", width: 180, ellipsis: true },
    { title: "挑戰名稱", dataIndex: "title", key: "title", width: 160, ellipsis: true },
    {
      title: "圖片", dataIndex: "imageUrl", key: "imageUrl", width: 200,
      render: (url) => url ? (
        <div style={{ width: 160, height: 120, overflow: "hidden", borderRadius: 4 }}>
          <Image src={url} alt="挑戰圖片" crossOrigin="anonymous" style={{ width: 160, height: 120, objectFit: "cover" }} />
        </div>
      ) : (
        <div style={{ width: 160, height: 120, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, fontSize: 12, color: "#999" }}>無圖片</div>
      ),
    },
    { title: "描述", dataIndex: "description", key: "description", ellipsis: true },
    { title: "系列數量", dataIndex: "courseIds", key: "courseIds", width: 100, render: (ids) => ids ? ids.length : 0 },
    {
      title: "啟用", dataIndex: "isEnabled", key: "isEnabled", width: 100,
      render: (enabled, record) => <Switch checked={enabled} onChange={() => handleToggleEnabled(record)} />,
    },
    {
      title: "操作", key: "actions", width: 100,
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} />
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div style={{ background: bg, minHeight: "100vh", padding: "28px 32px 64px" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 6px", color: ink, letterSpacing: "-0.01em" }}>挑戰管理</h1>
            <p style={{ margin: 0, fontSize: 13.5, color: muted }}>管理挑戰活動，可設定名稱、描述、圖片，並選擇多個系列。</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>重新載入</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增挑戰</Button>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: "flex", background: panel, border: `1px solid ${line}`, borderRadius: 10, marginBottom: 20, overflow: "hidden" }}>
          <StatCard label="總挑戰數" value={challenges.length} note="所有挑戰項目" />
          <StatCard label="啟用中" value={enabledCount} unit={`/ ${challenges.length}`} note="目前上架" />
          <StatCard label="啟用率" value={challenges.length ? Math.round((enabledCount / challenges.length) * 100) : 0} unit="%" note="已啟用佔比" />
          <div style={{ flex: 1, padding: "16px 20px" }}>
            <div style={{ fontSize: 11, color: muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>辨認ID</div>
            <div style={{ marginTop: 6, fontSize: 13, color: ink2 }}>唯一識別碼，新增後不可修改</div>
            <div style={{ marginTop: 4, fontSize: 12, color: muted }}>確保填寫正確再儲存</div>
          </div>
        </div>

        {/* Main card */}
        <div style={{ background: panel, border: `1px solid ${line}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${line2}` }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: ink }}>挑戰清單</div>
            <div style={{ fontSize: 12.5, color: muted, marginTop: 2 }}>點擊編輯或刪除按鈕可管理各挑戰內容</div>
          </div>
          <Spin spinning={loading}>
            <Table columns={columns} dataSource={challenges} rowKey="_id" pagination={{ pageSize: 10 }} />
          </Spin>
        </div>
      </div>

      {/* 新增/編輯 Modal */}
      <Modal
        title={editingChallenge ? "編輯挑戰" : "新增挑戰"}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => { setIsModalVisible(false); form.resetFields(); }}
        width={700} okText="儲存" cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="identifierID" label="辨認ID" rules={[{ required: true, message: "請輸入辨認ID" }]}>
            <Input placeholder="請輸入辨認ID（唯一識別碼，例如：morning-challenge）" disabled={!!editingChallenge} />
          </Form.Item>
          <Form.Item name="title" label="挑戰名稱" rules={[{ required: true, message: "請輸入挑戰名稱" }]}>
            <Input placeholder="請輸入挑戰名稱" />
          </Form.Item>
          <Form.Item name="description" label="挑戰描述" rules={[{ required: true, message: "請輸入挑戰描述" }]}>
            <TextArea rows={4} placeholder="請輸入挑戰描述" />
          </Form.Item>
          <div style={{ background: "#f8f9ff", padding: "12px", borderRadius: "8px", border: "1px solid #d6e4ff", marginBottom: "16px" }}>
            <Image crossOrigin="anonymous" width="100px" src={form.getFieldValue("imageUrl")} style={{ marginBottom: "8px" }} />
            <Form.Item name="imageUrl" label={<span style={{ fontWeight: "bold", color: "#1890ff" }}>挑戰圖片</span>}>
              <Input allowClear placeholder="請輸入圖片URL" size="large" style={{ borderRadius: "6px" }} />
            </Form.Item>
          </div>
          <Form.Item name="courseIds" label="選擇系列（可多選）" rules={[{ required: true, message: "請至少選擇一個系列" }]}>
            <Select mode="multiple" placeholder="請選擇系列"
              options={series.map((item) => ({ value: item.CourseID, label: item.CourseName || item.Name || "未命名系列" }))}
              showSearch filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())} />
          </Form.Item>
          <Form.Item name="isEnabled" label="啟用" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ChallengeManagement;
