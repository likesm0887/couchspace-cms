import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Upload,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { meditationService } from "../../../service/ServicePool";

/* ── Design tokens ── */
const bg = "#F6F7F9";
const panel = "#FFFFFF";
const line = "#E6E8EC";
const line2 = "#EEF0F3";
const ink = "#10141B";
const ink2 = "#3B414C";
const muted = "#6B7280";

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

function SosManagement() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [sosList, setSosList] = useState([]);
  const [musicList, setMusicList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSos, setEditingSos] = useState(null);
  const [iconUrl, setIconUrl] = useState("");
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sosRes, musicRes] = await Promise.all([
        meditationService.getAllSos(),
        meditationService.getAllMusic(),
      ]);
      setSosList(Array.isArray(sosRes) ? sosRes : []);
      setMusicList(Array.isArray(musicRes) ? musicRes : []);
    } catch (e) {
      messageApi.error("載入失敗");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = () => {
    setEditingSos(null);
    setIconUrl("");
    form.resetFields();
    form.setFieldsValue({ IsActive: true, Order: 0 });
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingSos(record);
    setIconUrl(record.Icon || "");
    form.setFieldsValue({
      Name: record.Name,
      Icon: record.Icon,
      MusicID: record.MusicID,
      Order: record.Order,
      IsActive: record.IsActive,
    });
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    setLoading(true);
    try {
      if (editingSos) {
        await meditationService.updateSos({ ...values, SosID: editingSos.SosId });
        messageApi.success("更新成功");
      } else {
        await meditationService.createSos(values);
        messageApi.success("新增成功");
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (e) {
      messageApi.error(e?.message || "操作失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sosId) => {
    await meditationService.deleteSos(sosId);
    messageApi.success("刪除成功");
    fetchData();
  };

  const handleToggle = async (record) => {
    await meditationService.updateSos({ ...record, SosID: record.SosId, IsActive: !record.IsActive });
    fetchData();
  };

  const handleIconUpload = async ({ file, onSuccess, onError }) => {
    try {
      const res = await meditationService.uploadSosIcon(file);
      if (res && res.url) {
        setIconUrl(res.url);
        form.setFieldsValue({ Icon: res.url });
        onSuccess(res);
      } else {
        onError(new Error("上傳失敗"));
      }
    } catch (e) {
      onError(e);
    }
  };

  const activeCount = sosList.filter((s) => s.IsActive).length;

  const columns = [
    {
      title: "Icon",
      dataIndex: "Icon",
      key: "Icon",
      width: 90,
      render: (url) =>
        url ? (
          <Image src={url} width={60} />
        ) : (
          <div style={{ width: 60, height: 60, background: "#eee", borderRadius: 4 }} />
        ),
    },
    { title: "名稱", dataIndex: "Name", key: "Name", ellipsis: true },
    {
      title: "綁定音樂",
      dataIndex: "MusicID",
      key: "MusicID",
      ellipsis: true,
      render: (musicId) => {
        const music = musicList.find((m) => m.MusicID === musicId);
        return music ? music.Title : musicId || "—";
      },
    },
    { title: "排序", dataIndex: "Order", key: "Order", width: 80 },
    {
      title: "啟用",
      dataIndex: "IsActive",
      key: "IsActive",
      width: 80,
      render: (value, record) => (
        <Switch checked={value} onChange={() => handleToggle(record)} />
      ),
    },
    {
      title: "操作",
      key: "actions",
      width: 110,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="確認刪除此 SOS 項目？"
            okText="確定"
            cancelText="取消"
            onConfirm={() => handleDelete(record.SosId)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
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
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 6px", color: ink, letterSpacing: "-0.01em" }}>SOS 管理</h1>
            <p style={{ margin: 0, fontSize: 13.5, color: muted }}>管理 SOS 緊急聯絡項目，可設定名稱、Icon 圖片及綁定音樂。</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>重新載入</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增 SOS</Button>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: "flex", background: panel, border: `1px solid ${line}`, borderRadius: 10, marginBottom: 20, overflow: "hidden" }}>
          <StatCard label="總數" value={sosList.length} note="所有 SOS 項目" />
          <StatCard label="啟用中" value={activeCount} unit={`/ ${sosList.length}`} note="目前上架" />
          <StatCard
            label="啟用率"
            value={sosList.length ? Math.round((activeCount / sosList.length) * 100) : 0}
            unit="%"
            note="已啟用佔比"
            last
          />
        </div>

        {/* Main card */}
        <div style={{ background: panel, border: `1px solid ${line}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${line2}` }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: ink }}>SOS 清單</div>
            <div style={{ fontSize: 12.5, color: muted, marginTop: 2 }}>點擊編輯或刪除按鈕可管理各 SOS 項目</div>
          </div>
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={sosList}
              rowKey="SosId"
              pagination={{ pageSize: 10 }}
            />
          </Spin>
        </div>
      </div>

      {/* 新增/編輯 Modal */}
      <Modal
        title={editingSos ? "編輯 SOS" : "新增 SOS"}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => { setIsModalVisible(false); form.resetFields(); setIconUrl(""); }}
        width={600}
        okText="儲存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="Name" label="名稱" rules={[{ required: true, message: "請輸入名稱" }]}>
            <Input placeholder="請輸入 SOS 名稱" />
          </Form.Item>

          <Form.Item name="Icon" label="Icon 圖片">
            <Upload accept="image/*" customRequest={handleIconUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>上傳圖片</Button>
            </Upload>
            {iconUrl && <Image src={iconUrl} width={80} style={{ marginTop: 8 }} />}
          </Form.Item>

          <Form.Item name="MusicID" label="綁定音樂">
            <Select
              showSearch
              placeholder="選擇音樂"
              allowClear
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              options={musicList.map((m) => ({ value: m.MusicID, label: m.Title }))}
            />
          </Form.Item>

          <Form.Item name="Order" label="排序">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="IsActive" label="啟用" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default SosManagement;
