import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, message, Modal, Select, Space, Switch, Table, Image, Spin, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, MenuOutlined } from "@ant-design/icons";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { challengeService, meditationService } from "../../../service/ServicePool";

const { TextArea } = Input;

/* ── Design tokens ── */
const bg = "var(--cms-bg)";
const panel = "var(--cms-panel)";
const line = "var(--cms-line)";
const line2 = "var(--cms-line2)";
const ink = "var(--cms-ink)";
const ink2 = "var(--cms-ink2)";
const muted = "var(--cms-muted)";
const accent = "#4556f0";
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

/* ── 可拖拉排序的系列項目 ── */
function SortableSeriesItem({ id, index, title, onRemove }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    marginBottom: 6,
    borderRadius: 6,
    background: isDragging ? "var(--cms-drag)" : panel,
    border: `1px solid ${line}`,
    position: isDragging ? "relative" : undefined,
    zIndex: isDragging ? 9999 : undefined,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <MenuOutlined
        ref={setActivatorNodeRef}
        style={{ touchAction: "none", cursor: "move", color: muted }}
        {...listeners}
      />
      <Tag color="blue" style={{ margin: 0, minWidth: 34, textAlign: "center" }}>
        {index + 1}
      </Tag>
      <span style={{ flex: 1, fontSize: 13, color: ink }}>{title}</span>
      <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => onRemove(id)} />
    </div>
  );
}

/* ── 成就顯示：秀出達成後的圖片與名稱 ── */
function BadgeCell({ badge }) {
  if (!badge) {
    return <span style={{ fontSize: 12, color: muted }}>未綁定</span>;
  }
  return (
    <Space size={8}>
      {badge.AchievedImage ? (
        <Image
          src={badge.AchievedImage}
          alt={badge.Name}
          crossOrigin="anonymous"
          width={64}
          height={64}
          style={{ objectFit: "contain", borderRadius: 8 }}
        />
      ) : (
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 8,
            background: line2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            color: muted,
          }}
        >
          無圖
        </div>
      )}
      <span style={{ fontSize: 13, color: ink }}>{badge.Name}</span>
    </Space>
  );
}

function ChallengeManagement() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [series, setSeries] = useState([]);
  const [badges, setBadges] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState([]);
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
    // 成就為選配，載入失敗不影響挑戰主畫面
    try {
      const badgeList = await meditationService.getAllBadges(false);
      setBadges(Array.isArray(badgeList) ? badgeList : []);
    } catch (error) {
      console.warn("載入成就清單失敗", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = () => {
    setEditingChallenge(null);
    form.resetFields();
    setSelectedSeries([]);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingChallenge(record);
    form.setFieldsValue({
      identifierID: record.identifierID || "",
      title: record.title,
      description: record.description,
      imageUrl: record.imageUrl || "",
      badgeID: record.badgeID || undefined,
      isEnabled: record.isEnabled,
    });
    // 依儲存的順序還原系列清單
    setSelectedSeries(
      (record.courseIds || []).map((id) => {
        const s = series.find((x) => x.CourseID === id);
        return { id, title: s?.CourseName || s?.Name || id };
      })
    );
    setIsModalVisible(true);
  };

  const handleAddSeries = (courseId, option) => {
    if (selectedSeries.some((s) => s.id === courseId)) return;
    setSelectedSeries((prev) => [...prev, { id: courseId, title: option.name }]);
  };

  const handleRemoveSeries = (courseId) => {
    setSelectedSeries((prev) => prev.filter((s) => s.id !== courseId));
  };

  const handleSeriesDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setSelectedSeries((prev) => {
      const from = prev.findIndex((s) => s.id === active.id);
      const to = prev.findIndex((s) => s.id === over.id);
      if (from === -1 || to === -1) return prev;
      return arrayMove(prev, from, to);
    });
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
    let values;
    try {
      values = await form.validateFields();
    } catch (error) {
      return;
    }
    if (selectedSeries.length === 0) {
      messageApi.warning("請至少加入一個系列");
      return;
    }
    // 送出時以清單目前的排列順序為準
    const payload = { ...values, courseIds: selectedSeries.map((s) => s.id) };
    try {
      if (editingChallenge) {
        await challengeService.updateChallenge({ ...payload, challengeId: editingChallenge._id });
        messageApi.success("挑戰已更新");
      } else {
        await challengeService.createChallenge(payload);
        messageApi.success("挑戰已新增");
      }
      setIsModalVisible(false);
      form.resetFields();
      setSelectedSeries([]);
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
  const badgeById = useMemo(() => new Map(badges.map((b) => [b._id, b])), [badges]);

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
        <div style={{ width: 160, height: 120, background: line2, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, fontSize: 12, color: muted }}>無圖片</div>
      ),
    },
    { title: "描述", dataIndex: "description", key: "description", ellipsis: true },
    { title: "系列數量", dataIndex: "courseIds", key: "courseIds", width: 100, render: (ids) => ids ? ids.length : 0 },
    {
      title: "成就",
      dataIndex: "badgeID",
      key: "badgeID",
      width: 180,
      render: (badgeID) => <BadgeCell badge={badgeById.get(badgeID)} />,
    },
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
          <div style={{ background: accentSoft, padding: "12px", borderRadius: "8px", border: `1px solid ${line}`, marginBottom: "16px" }}>
            <Image crossOrigin="anonymous" width="100px" src={form.getFieldValue("imageUrl")} style={{ marginBottom: "8px" }} />
            <Form.Item name="imageUrl" label={<span style={{ fontWeight: "bold", color: "#1890ff" }}>挑戰圖片</span>}>
              <Input allowClear placeholder="請輸入圖片URL" size="large" style={{ borderRadius: "6px" }} />
            </Form.Item>
          </div>
          <Form.Item
            label={
              <Space>
                <span>挑戰系列</span>
                <Tag color="blue">{selectedSeries.length} 個</Tag>
              </Space>
            }
            required
            extra={<span style={{ fontSize: 12, color: muted }}>拖曳左側圖示可調整系列順序，順序即為挑戰的進行順序</span>}
          >
            <div
              style={{
                background: accentSoft,
                padding: 12,
                borderRadius: 8,
                border: `1px solid ${line}`,
              }}
            >
              <Select
                placeholder="搜尋並加入系列..."
                value={null}
                onChange={handleAddSeries}
                showSearch
                optionFilterProp="searchText"
                style={{ width: "100%", marginBottom: selectedSeries.length > 0 ? 10 : 0 }}
                options={series
                  .filter((item) => !selectedSeries.some((s) => s.id === item.CourseID))
                  .map((item) => {
                    const name = item.CourseName || item.Name || "未命名系列";
                    const remark = item.Remark || "";
                    return {
                      value: item.CourseID,
                      name,
                      // 名稱與備註都能搜尋
                      searchText: remark ? `${name} ${remark}` : name,
                      label: (
                        <span>
                          {name}
                          {remark && (
                            <span style={{ color: "#999", marginLeft: 8 }}>（{remark}）</span>
                          )}
                        </span>
                      ),
                    };
                  })}
              />
              {selectedSeries.length > 0 && (
                <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleSeriesDragEnd}>
                  <SortableContext
                    items={selectedSeries.map((s) => s.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {selectedSeries.map((s, i) => (
                      <SortableSeriesItem
                        key={s.id}
                        id={s.id}
                        index={i}
                        title={s.title}
                        onRemove={handleRemoveSeries}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </Form.Item>
          <Form.Item
            name="badgeID"
            label="綁定成就"
            tooltip="完成此挑戰後可獲得的成就勳章，顯示的是達成後的圖片"
          >
            <Select
              allowClear
              placeholder="不綁定成就"
              showSearch
              optionFilterProp="label"
              options={badges.map((b) => ({ value: b._id, label: b.Name, badge: b }))}
              listItemHeight={52}
              listHeight={280}
              optionRender={(option) => (
                <Space>
                  {option.data.badge.AchievedImage ? (
                    <Image
                      src={option.data.badge.AchievedImage}
                      alt={option.data.badge.Name}
                      crossOrigin="anonymous"
                      width={44}
                      height={44}
                      preview={false}
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <div style={{ width: 44, height: 44, background: line2, borderRadius: 6 }} />
                  )}
                  <span>{option.data.badge.Name}</span>
                </Space>
              )}
            />
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
