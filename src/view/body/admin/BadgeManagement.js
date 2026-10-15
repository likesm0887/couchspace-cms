import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form, Input, message, Modal, Space, Switch, Table, Image, Spin, Tag, Empty, Tooltip, Upload } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  TrophyOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { meditationService } from "../../../service/ServicePool";

const { TextArea } = Input;

/* ── Design tokens ── */
const bg = "var(--cms-bg)";
const panel = "var(--cms-panel)";
const line = "var(--cms-line)";
const line2 = "var(--cms-line2)";
const ink = "var(--cms-ink)";
const ink2 = "var(--cms-ink2)";
const muted = "var(--cms-muted)";
const accentSoft = "var(--cms-accent-soft)";

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

/* ── 勳章圖片欄位：有圖顯示縮圖，無圖顯示佔位 ── */
function BadgeThumb({ url, alt, dim }) {
  if (!url) {
    return (
      <div
        style={{
          width: 88,
          height: 88,
          background: line2,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          color: muted,
        }}
      >
        無圖
      </div>
    );
  }
  return (
    <div style={{ width: 88, height: 88, borderRadius: 10, overflow: "hidden" }}>
      <Image
        src={url}
        alt={alt}
        crossOrigin="anonymous"
        style={{ width: 88, height: 88, objectFit: "contain", opacity: dim ? 0.45 : 1 }}
      />
    </div>
  );
}

/* ── Modal 內的圖片上傳 + 即時預覽 ──
   實際值存在 Form 的隱藏欄位，上傳成功後寫入圖片網址 */
function ImageField({ name, label, hint, value, uploading, onUpload, onClear }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 220,
        background: accentSoft,
        padding: 12,
        borderRadius: 8,
        border: `1px solid ${line}`,
      }}
    >
      <div style={{ fontWeight: 600, color: ink, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 12, color: muted, marginBottom: 8 }}>{hint}</div>
      <div style={{ marginBottom: 10 }}>
        {value ? (
          <Image
            crossOrigin="anonymous"
            width={120}
            height={120}
            src={value}
            style={{ objectFit: "contain", borderRadius: 10, background: "#fff" }}
          />
        ) : (
          <div
            style={{
              width: 120,
              height: 120,
              background: line2,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: muted,
            }}
          >
            未設定
          </div>
        )}
      </div>
      <Space>
        <Upload
          showUploadList={false}
          accept="image/*"
          beforeUpload={(file) => {
            onUpload(file);
            return false;
          }}
        >
          <Button size="small" icon={<UploadOutlined />} loading={uploading}>
            {value ? "更換圖片" : "上傳圖片"}
          </Button>
        </Upload>
        {value && (
          <Button size="small" type="text" danger onClick={onClear}>
            移除
          </Button>
        )}
      </Space>
      {/* 圖片網址由上傳結果寫入，不直接讓使用者編輯 */}
      <Form.Item name={name} hidden noStyle>
        <Input type="hidden" />
      </Form.Item>
    </div>
  );
}

function BadgeManagement() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [badges, setBadges] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);
  const [achievedUrl, setAchievedUrl] = useState("");
  const [unachievedUrl, setUnachievedUrl] = useState("");
  const [uploadingField, setUploadingField] = useState(null);
  const [form] = Form.useForm();

  // 上傳圖片並把回傳網址寫回對應的表單欄位
  const handleUploadImage = async (fieldName, file) => {
    setUploadingField(fieldName);
    try {
      const res = await meditationService.uploadBadgeImage(file);
      if (res?.url) {
        form.setFieldValue(fieldName, res.url);
        if (fieldName === "AchievedImage") setAchievedUrl(res.url);
        else setUnachievedUrl(res.url);
        messageApi.success("圖片上傳成功");
      } else {
        messageApi.error("圖片上傳失敗");
      }
    } catch (error) {
      console.error(error);
      messageApi.error("圖片上傳失敗");
    } finally {
      setUploadingField(null);
    }
  };

  const handleClearImage = (fieldName) => {
    form.setFieldValue(fieldName, "");
    if (fieldName === "AchievedImage") setAchievedUrl("");
    else setUnachievedUrl("");
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const list = await meditationService.getAllBadges(false);
      setBadges(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error(error);
      messageApi.error("載入勳章失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setEditingBadge(null);
    form.resetFields();
    form.setFieldsValue({ IsEnabled: true });
    setAchievedUrl("");
    setUnachievedUrl("");
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingBadge(record);
    form.setFieldsValue({
      IdentifierID: record.IdentifierID || "",
      Name: record.Name || "",
      Condition: record.Condition || "",
      AchievedImage: record.AchievedImage || "",
      UnachievedImage: record.UnachievedImage || "",
      IsEnabled: Boolean(record.IsEnabled),
    });
    setAchievedUrl(record.AchievedImage || "");
    setUnachievedUrl(record.UnachievedImage || "");
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "確認刪除",
      content: `確定要刪除勳章「${record.Name}」嗎？`,
      okText: "確定",
      cancelText: "取消",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await meditationService.deleteBadge(record._id);
          messageApi.success("勳章已刪除");
          fetchData();
        } catch (error) {
          console.error(error);
          messageApi.error("刪除失敗，請稍後再試");
        }
      },
    });
  };

  const handleSave = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch (error) {
      return;
    }

    setSaving(true);
    try {
      if (editingBadge) {
        // 辨認ID 不可變更，故不送出
        await meditationService.updateBadge({
          BadgeID: editingBadge._id,
          Name: values.Name,
          Condition: values.Condition || "",
          AchievedImage: values.AchievedImage || "",
          UnachievedImage: values.UnachievedImage || "",
          IsEnabled: Boolean(values.IsEnabled),
        });
        messageApi.success("勳章已更新");
      } else {
        await meditationService.createBadge({
          IdentifierID: values.IdentifierID,
          Name: values.Name,
          Condition: values.Condition || "",
          AchievedImage: values.AchievedImage || "",
          UnachievedImage: values.UnachievedImage || "",
          IsEnabled: Boolean(values.IsEnabled),
        });
        messageApi.success("勳章已新增");
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      console.error(error);
      // 後端會回傳辨認ID重複等訊息，盡量讓使用者看到原因
      const detail = String(error?.message || "");
      messageApi.error(detail.includes("辨認ID") ? "辨認ID 已存在，請換一個" : "儲存失敗，請稍後再試");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEnabled = async (record) => {
    try {
      await meditationService.updateBadge({
        BadgeID: record._id,
        Name: record.Name,
        Condition: record.Condition || "",
        AchievedImage: record.AchievedImage || "",
        UnachievedImage: record.UnachievedImage || "",
        IsEnabled: !record.IsEnabled,
      });
      messageApi.success("狀態已更新");
      fetchData();
    } catch (error) {
      console.error(error);
      messageApi.error("更新失敗");
    }
  };

  const enabledCount = useMemo(() => badges.filter((b) => b.IsEnabled).length, [badges]);

  const columns = [
    {
      title: "未達成",
      dataIndex: "UnachievedImage",
      key: "UnachievedImage",
      width: 140,
      align: "center",
      render: (url) => <BadgeThumb url={url} alt="未達成圖片" dim />,
    },
    {
      title: "已達成",
      dataIndex: "AchievedImage",
      key: "AchievedImage",
      width: 140,
      align: "center",
      render: (url) => <BadgeThumb url={url} alt="已達成圖片" />,
    },
    { title: "勳章名稱", dataIndex: "Name", key: "Name", width: 160, ellipsis: true },
    {
      title: "辨認ID",
      dataIndex: "IdentifierID",
      key: "IdentifierID",
      width: 260,
      render: (id) => (
        <code style={{ fontSize: 12, color: ink2, wordBreak: "break-all" }}>{id}</code>
      ),
    },
    { title: "達成條件說明", dataIndex: "Condition", key: "Condition", ellipsis: true },
    {
      title: "啟用",
      dataIndex: "IsEnabled",
      key: "IsEnabled",
      width: 80,
      render: (enabled, record) => <Switch checked={enabled} onChange={() => handleToggleEnabled(record)} />,
    },
    { title: "創建日期", dataIndex: "CreationDate", key: "CreationDate", width: 170 },
    {
      title: "操作",
      key: "actions",
      width: 110,
      render: (_, record) => (
        <Space>
          <Tooltip title="編輯">
            <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="刪除">
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div style={{ background: bg, minHeight: "100vh", padding: "28px 32px 64px" }}>
        {/* Page header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 6px", color: ink, letterSpacing: "-0.01em" }}>
              成就勳章
            </h1>
            <p style={{ margin: 0, fontSize: 13.5, color: muted }}>
              管理成就勳章，可設定達成與未達成圖片、名稱與達成條件說明。
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>
              重新載入
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增勳章
            </Button>
          </div>
        </div>

        {/* Stats strip */}
        <div
          style={{
            display: "flex",
            background: panel,
            border: `1px solid ${line}`,
            borderRadius: 10,
            marginBottom: 20,
            overflow: "hidden",
            flexWrap: "wrap",
          }}
        >
          <StatCard label="總勳章數" value={badges.length} note="所有勳章" />
          <StatCard label="啟用中" value={enabledCount} unit={`/ ${badges.length}`} note="目前上架" />
          <div style={{ flex: 1, padding: "16px 20px" }}>
            <div style={{ fontSize: 11, color: muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>辨認ID</div>
            <div style={{ marginTop: 6, fontSize: 13, color: ink2 }}>程式判定成就時引用</div>
            <div style={{ marginTop: 4, fontSize: 12, color: muted }}>新增後不可修改，請確認再儲存</div>
          </div>
        </div>

        {/* Main card */}
        <div style={{ background: panel, border: `1px solid ${line}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${line2}` }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: ink }}>勳章清單</div>
            <div style={{ fontSize: 12.5, color: muted, marginTop: 2 }}>未達成圖片以半透明顯示，模擬尚未解鎖的狀態</div>
          </div>
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={badges}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1300 }}
              locale={{ emptyText: <Empty description="尚無勳章，點擊右上角新增" /> }}
            />
          </Spin>
        </div>
      </div>

      {/* 新增/編輯 Modal */}
      <Modal
        title={editingBadge ? "編輯勳章" : "新增勳章"}
        open={isModalVisible}
        onOk={handleSave}
        confirmLoading={saving}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={720}
        okText="儲存"
        cancelText="取消"
        styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="IdentifierID"
            label="辨認ID"
            tooltip="程式判定成就時使用的固定識別碼，建立後不可修改"
            rules={[{ required: true, message: "請輸入辨認ID" }]}
          >
            <Input
              placeholder="例如：first-meditation、seven-day-streak"
              disabled={!!editingBadge}
            />
          </Form.Item>

          <Form.Item name="Name" label="勳章名稱" rules={[{ required: true, message: "請輸入勳章名稱" }]}>
            <Input placeholder="請輸入勳章名稱" />
          </Form.Item>

          <Form.Item name="Condition" label="達成條件說明">
            <TextArea rows={3} placeholder="說明使用者要如何取得這個勳章，例如：連續冥想 7 天" />
          </Form.Item>

          <div style={{ marginBottom: 8, fontWeight: 600, color: ink }}>
            <TrophyOutlined style={{ marginRight: 6, color: muted }} />
            勳章圖片
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <ImageField
              name="UnachievedImage"
              label="未達成"
              hint="尚未解鎖時顯示"
              value={unachievedUrl}
              uploading={uploadingField === "UnachievedImage"}
              onUpload={(file) => handleUploadImage("UnachievedImage", file)}
              onClear={() => handleClearImage("UnachievedImage")}
            />
            <ImageField
              name="AchievedImage"
              label="已達成"
              hint="解鎖後顯示"
              value={achievedUrl}
              uploading={uploadingField === "AchievedImage"}
              onUpload={(file) => handleUploadImage("AchievedImage", file)}
              onClear={() => handleClearImage("AchievedImage")}
            />
          </div>

          <Form.Item name="IsEnabled" label="啟用" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>

          {editingBadge && (
            <div style={{ fontSize: 12, color: muted }}>
              <Tag>創建日期</Tag>
              {editingBadge.CreationDate}
              {editingBadge.UpdateDate && (
                <>
                  <Tag style={{ marginLeft: 12 }}>最後更新</Tag>
                  {editingBadge.UpdateDate}
                </>
              )}
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
}

export default BadgeManagement;
