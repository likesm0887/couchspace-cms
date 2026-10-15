import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Form, Input, message, Modal, Space, Switch, Table, Spin, Tag, Empty, Tooltip } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  MenuOutlined,
  FileTextOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { meditationService } from "../../../service/ServicePool";
import RichTextEditor from "./RichTextEditor";
import ArticlePreview from "./ArticlePreview";

const { TextArea } = Input;

/* ── Design tokens ── */
const bg = "var(--cms-bg)";
const panel = "var(--cms-panel)";
const line = "var(--cms-line)";
const line2 = "var(--cms-line2)";
const ink = "var(--cms-ink)";
const muted = "var(--cms-muted)";

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

/* ── 可拖拉排序的分頁卡片 ── */
function SortablePage({ id, index, content, onChange, onRemove, canRemove }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    background: isDragging ? "var(--cms-drag)" : panel,
    border: `1px solid ${line}`,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    position: isDragging ? "relative" : undefined,
    zIndex: isDragging ? 9999 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <Space>
          <MenuOutlined
            ref={setActivatorNodeRef}
            style={{ touchAction: "none", cursor: "move", color: muted }}
            {...listeners}
          />
          <span style={{ fontWeight: 600, color: ink, fontSize: 13 }}>第 {index + 1} 頁</span>
        </Space>
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          disabled={!canRemove}
          onClick={() => onRemove(id)}
        >
          刪除此頁
        </Button>
      </div>
      <RichTextEditor value={content} onChange={(html) => onChange(id, html)} />
    </div>
  );
}

// 判斷 HTML 內容是否實質為空（只有空標籤也算空）
const isHtmlEmpty = (html) => {
  if (!html) return true;
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim() === "";
};

const makePageId = () => `page-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const normalizePages = (pages = []) => {
  if (!Array.isArray(pages) || pages.length === 0) {
    return [{ id: makePageId(), Content: "" }];
  }
  return [...pages]
    .sort((a, b) => (a.Seq ?? 0) - (b.Seq ?? 0))
    .map((p) => ({ id: makePageId(), Content: p.Content || "" }));
};

function ArticleManagement() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [articles, setArticles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [pages, setPages] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState({ title: "", pages: [] });
  const [form] = Form.useForm();

  // 從列表直接預覽（已儲存的文章）
  const handlePreviewRecord = (record) => {
    setPreviewData({ title: record.Title, pages: record.Pages || [] });
    setPreviewOpen(true);
  };

  // 從編輯 Modal 預覽（含尚未儲存的編輯內容）
  const handlePreviewDraft = () => {
    setPreviewData({
      title: form.getFieldValue("Title") || "未命名文章",
      pages: pages.map((p, i) => ({ Seq: i + 1, Content: p.Content })),
    });
    setPreviewOpen(true);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const list = await meditationService.getAllArticles(false);
      setArticles(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error(error);
      messageApi.error("載入文章失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setEditingArticle(null);
    form.resetFields();
    form.setFieldsValue({ IsEnabled: true });
    setPages([{ id: makePageId(), Content: "" }]);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingArticle(record);
    form.setFieldsValue({
      Title: record.Title || "",
      Description: record.Description || "",
      IsEnabled: Boolean(record.IsEnabled),
    });
    setPages(normalizePages(record.Pages));
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "確認刪除",
      content: `確定要刪除文章「${record.Title}」嗎？`,
      okText: "確定",
      cancelText: "取消",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await meditationService.deleteArticle(record._id);
          messageApi.success("文章已刪除");
          fetchData();
        } catch (error) {
          console.error(error);
          messageApi.error("刪除失敗，請稍後再試");
        }
      },
    });
  };

  const handlePageChange = (id, value) => {
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, Content: value } : p)));
  };

  const handlePageRemove = (id) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddPage = () => {
    setPages((prev) => [...prev, { id: makePageId(), Content: "" }]);
  };

  const handlePageDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setPages((prev) => {
      const from = prev.findIndex((p) => p.id === active.id);
      const to = prev.findIndex((p) => p.id === over.id);
      if (from === -1 || to === -1) return prev;
      return arrayMove(prev, from, to);
    });
  };

  const handleSave = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch (error) {
      return;
    }

    const cleanedPages = pages.filter((p) => !isHtmlEmpty(p.Content));
    if (cleanedPages.length === 0) {
      messageApi.warning("請至少填寫一頁內容");
      return;
    }

    const payload = {
      Title: values.Title,
      Description: values.Description || "",
      IsEnabled: Boolean(values.IsEnabled),
      Pages: cleanedPages.map((p, i) => ({ Seq: i + 1, Content: p.Content })),
    };

    setSaving(true);
    try {
      if (editingArticle) {
        await meditationService.updateArticle({ ...payload, ArticleID: editingArticle._id });
        messageApi.success("文章已更新");
      } else {
        await meditationService.createArticle(payload);
        messageApi.success("文章已新增");
      }
      setIsModalVisible(false);
      form.resetFields();
      setPages([]);
      fetchData();
    } catch (error) {
      console.error(error);
      messageApi.error("儲存失敗，請稍後再試");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEnabled = async (record) => {
    try {
      await meditationService.updateArticle({
        ArticleID: record._id,
        Title: record.Title,
        Description: record.Description || "",
        Pages: (record.Pages || []).map((p, i) => ({ Seq: i + 1, Content: p.Content })),
        IsEnabled: !record.IsEnabled,
      });
      messageApi.success("狀態已更新");
      fetchData();
    } catch (error) {
      console.error(error);
      messageApi.error("更新失敗");
    }
  };

  const enabledCount = useMemo(() => articles.filter((a) => a.IsEnabled).length, [articles]);
  const totalPages = useMemo(
    () => articles.reduce((sum, a) => sum + (a.Pages ? a.Pages.length : 0), 0),
    [articles]
  );

  const columns = [
    { title: "文章標題", dataIndex: "Title", key: "Title", width: 220, ellipsis: true },
    { title: "描述", dataIndex: "Description", key: "Description", ellipsis: true },
    {
      title: "分頁數",
      dataIndex: "Pages",
      key: "Pages",
      width: 100,
      render: (p) => <Tag color="blue">{p ? p.length : 0} 頁</Tag>,
    },
    {
      title: "啟用",
      dataIndex: "IsEnabled",
      key: "IsEnabled",
      width: 90,
      render: (enabled, record) => <Switch checked={enabled} onChange={() => handleToggleEnabled(record)} />,
    },
    { title: "更新時間", dataIndex: "UpdateDate", key: "UpdateDate", width: 170 },
    {
      title: "操作",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="預覽">
            <Button icon={<EyeOutlined />} onClick={() => handlePreviewRecord(record)} />
          </Tooltip>
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
              文章管理
            </h1>
            <p style={{ margin: 0, fontSize: 13.5, color: muted }}>
              管理文章內容，一篇文章可包含多個分頁，支援拖拉調整分頁順序。
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>
              重新載入
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增文章
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
          <StatCard label="總文章數" value={articles.length} note="所有文章" />
          <StatCard label="啟用中" value={enabledCount} unit={`/ ${articles.length}`} note="目前上架" />
          <StatCard label="總分頁數" value={totalPages} unit="頁" note="所有文章累計" last />
        </div>

        {/* Main card */}
        <div style={{ background: panel, border: `1px solid ${line}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${line2}` }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: ink }}>文章清單</div>
            <div style={{ fontSize: 12.5, color: muted, marginTop: 2 }}>點擊編輯可管理文章內容與分頁</div>
          </div>
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={articles}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 900 }}
              locale={{ emptyText: <Empty description="尚無文章，點擊右上角新增" /> }}
            />
          </Spin>
        </div>
      </div>

      {/* 新增/編輯 Modal */}
      <Modal
        title={editingArticle ? "編輯文章" : "新增文章"}
        open={isModalVisible}
        onOk={handleSave}
        confirmLoading={saving}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setPages([]);
        }}
        width={820}
        okText="儲存"
        cancelText="取消"
        styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="Title" label="文章標題" rules={[{ required: true, message: "請輸入文章標題" }]}>
            <Input placeholder="請輸入文章標題" />
          </Form.Item>
          <Form.Item name="Description" label="文章描述">
            <TextArea rows={2} placeholder="請輸入文章描述（選填）" />
          </Form.Item>
          <Form.Item name="IsEnabled" label="啟用" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>

        {/* 分頁編輯區 */}
        <div style={{ borderTop: `1px solid ${line2}`, paddingTop: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Space>
              <FileTextOutlined style={{ color: muted }} />
              <span style={{ fontWeight: 600, color: ink }}>文章分頁</span>
              <Tag color="blue">{pages.length} 頁</Tag>
            </Space>
            <Space>
              <Button icon={<EyeOutlined />} onClick={handlePreviewDraft}>
                預覽
              </Button>
              <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddPage}>
                新增分頁
              </Button>
            </Space>
          </div>
          <div style={{ fontSize: 12.5, color: muted, marginBottom: 12 }}>
            拖曳左側圖示可調整分頁順序，內容為空的分頁儲存時會自動略過。
          </div>

          <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handlePageDragEnd}>
            <SortableContext items={pages.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              {pages.map((p, i) => (
                <SortablePage
                  key={p.id}
                  id={p.id}
                  index={i}
                  content={p.Content}
                  onChange={handlePageChange}
                  onRemove={handlePageRemove}
                  canRemove={pages.length > 1}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </Modal>

      <ArticlePreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={previewData.title}
        pages={previewData.pages}
      />
    </>
  );
}

export default ArticleManagement;
