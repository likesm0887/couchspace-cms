import React, { useEffect, useMemo, useState } from "react";
import { Button, DatePicker, Form, message, Select, Spin, Switch, Table } from "antd";
import { DeleteOutlined, MenuOutlined, PlusOutlined, ReloadOutlined, SaveOutlined } from "@ant-design/icons";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import dayjs from "dayjs";
import { meditationService } from "../../../service/ServicePool";

const { RangePicker } = DatePicker;

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
const danger = "#E84040";

/* ── Drag-sortable row ── */
const Row = ({ children, ...props }) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: props["data-row-key"] });
  const style = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999, background: "var(--cms-drag)" } : {}),
  };
  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if (child.key === "sort") {
          return React.cloneElement(child, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{ touchAction: "none", cursor: "move", color: muted }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

/* ── Helpers ── */
const DEFAULT_RANGE = [dayjs().startOf("day"), dayjs().add(7, "day").endOf("day")];
const normalizeDateValue = (v) => { if (!v) return null; const p = dayjs(v); return p.isValid() ? p : null; };
const normalizeRecommendations = (list = []) =>
  list.map((item, i) => ({
    key: item.SeriesID || item.CourseID || `recommend-${i}`,
    SeriesID: item.SeriesID || item.CourseID || "",
    Sequence: typeof item.Sequence === "number" ? item.Sequence : i,
    Enable: Boolean(item.Enable),
    EnableStartTime: item.EnableStartTime || "",
    EnableEndTime: item.EnableEndTime || "",
  })).sort((a, b) => a.Sequence - b.Sequence);

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

/* ── Main component ── */
function RecommendationManagement() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [musics, setMusics] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recommendationList, musicList] = await Promise.all([
        meditationService.getRecommendations(true),
        meditationService.getAllMusic(),
      ]);
      setRecommendations(normalizeRecommendations(recommendationList || []));
      setMusics(musicList || []);
    } catch (error) {
      console.error(error);
      messageApi.error("取得每日推薦失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { form.setFieldsValue({ recommendations }); }, [form, recommendations]);

  const musicOptions = useMemo(
    () => musics.map((m) => ({ value: m.MusicID || m.id, label: m.Title || m.name || m.MusicName || "未命名單堂" })),
    [musics]
  );

  const activeCount = recommendations.filter((r) => r.Enable).length;
  const nextExpiry = useMemo(() => {
    const dates = recommendations
      .filter((r) => r.Enable && r.EnableEndTime)
      .map((r) => dayjs(r.EnableEndTime)).filter((d) => d.isValid())
      .sort((a, b) => a.unix() - b.unix());
    return dates.length ? dates[0].format("YYYY/MM/DD") : "--";
  }, [recommendations]);

  const displayItems = useMemo(() => {
    if (filter === "active") return recommendations.filter((r) => r.Enable);
    if (filter === "inactive") return recommendations.filter((r) => !r.Enable);
    return recommendations;
  }, [recommendations, filter]);

  const updateRec = (key, patch) =>
    setRecommendations((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setRecommendations((prev) => {
      const oi = prev.findIndex((r) => r.key === active.id);
      const ni = prev.findIndex((r) => r.key === over.id);
      return arrayMove(prev, oi, ni).map((r, i) => ({ ...r, Sequence: i }));
    });
  };

  const handleAdd = () =>
    setRecommendations((prev) => [
      ...prev,
      { key: `new-${Date.now()}`, SeriesID: "", Sequence: prev.length, Enable: true,
        EnableStartTime: DEFAULT_RANGE[0].format("YYYY/MM/DD"), EnableEndTime: DEFAULT_RANGE[1].format("YYYY/MM/DD") },
    ]);

  const handleRemove = (key) =>
    setRecommendations((prev) => prev.filter((r) => r.key !== key).map((r, i) => ({ ...r, Sequence: i })));

  const handleSave = async () => {
    if (recommendations.some((r) => !r.SeriesID)) { messageApi.warning("請先為每筆推薦選擇單堂"); return; }
    setSaving(true);
    try {
      await meditationService.updateRecommendations(
        recommendations.map((r) => ({ SeriesID: r.SeriesID, Sequence: r.Sequence, Enable: r.Enable,
          EnableStartTime: r.EnableStartTime || "", EnableEndTime: r.EnableEndTime || "" }))
      );
      messageApi.success("每日推薦已更新");
      await fetchData();
    } catch (error) {
      console.error(error);
      messageApi.error("更新失敗，請稍後再試");
    } finally { setSaving(false); }
  };

  const columns = [
    { key: "sort", dataIndex: "sort", width: 44, render: () => null },
    {
      title: "#", dataIndex: "Sequence", key: "seq", width: 48,
      render: (_, __, i) => <span style={{ fontFamily: "monospace", color: muted, fontSize: 12 }}>{i + 1}</span>,
    },
    {
      title: "單堂", dataIndex: "SeriesID", key: "SeriesID",
      render: (_, record) => (
        <Select placeholder="選擇單堂" value={record.SeriesID || undefined} style={{ width: "100%", minWidth: 200 }}
          onChange={(v) => updateRec(record.key, { SeriesID: v })} options={musicOptions} showSearch
          filterOption={(input, opt) => (opt?.label ?? "").toLowerCase().includes(input.toLowerCase())} />
      ),
    },
    {
      title: "生效", dataIndex: "Enable", key: "Enable", width: 80,
      render: (_, record) => (
        <Switch checked={record.Enable} size="small" onChange={(v) => updateRec(record.key, { Enable: v })} />
      ),
    },
    {
      title: "生效期間", key: "EnableRange",
      render: (_, record) => (
        <RangePicker value={[normalizeDateValue(record.EnableStartTime), normalizeDateValue(record.EnableEndTime)]}
          format="YYYY/MM/DD" size="small"
          onChange={(vals) => {
            const [s, e] = vals || [];
            updateRec(record.key, { EnableStartTime: s ? s.format("YYYY/MM/DD") : "", EnableEndTime: e ? e.format("YYYY/MM/DD") : "" });
          }} />
      ),
    },
    {
      key: "actions", width: 52,
      render: (_, record) => (
        <button onClick={() => handleRemove(record.key)}
          style={{ border: "none", background: "transparent", color: danger, cursor: "pointer", padding: "4px 8px", borderRadius: 5, display: "flex", alignItems: "center" }}>
          <DeleteOutlined />
        </button>
      ),
    },
  ];

  const tabStyle = (key) => ({
    padding: "6px 12px", border: "none", background: filter === key ? line2 : "transparent",
    color: filter === key ? ink : ink2, fontWeight: filter === key ? 500 : 400,
    fontSize: 13, cursor: "pointer", borderRight: `1px solid ${line}`,
    display: "inline-flex", alignItems: "center", gap: 6,
  });

  return (
    <>
      {contextHolder}
      <div style={{ background: bg, minHeight: "100vh", padding: "28px 32px 64px" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 6px", color: ink, letterSpacing: "-0.01em" }}>每日推薦</h1>
            <p style={{ margin: 0, fontSize: 13.5, color: muted }}>管理 App 首頁推薦內容，可拖移調整順序並設定上架期間。</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>重新載入</Button>
            <Button icon={<SaveOutlined />} loading={saving} onClick={handleSave}>儲存設定</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增推薦</Button>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: "flex", background: panel, border: `1px solid ${line}`, borderRadius: 10, marginBottom: 20, overflow: "hidden" }}>
          <StatCard label="目前上架" value={activeCount} unit={`/ ${recommendations.length}`} note="已啟用項目" />
          <StatCard label="總推薦數" value={recommendations.length} note="所有排程項目" />
          <StatCard label="上架率" value={recommendations.length ? Math.round((activeCount / recommendations.length) * 100) : 0} unit="%" note="已啟用佔比" />
          <div style={{ flex: 1, padding: "16px 20px" }}>
            <div style={{ fontSize: 11, color: muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>下次自動下架</div>
            <div style={{ marginTop: 6, fontSize: 17, fontWeight: 600, color: ink, fontFamily: "monospace" }}>{nextExpiry}</div>
            <div style={{ marginTop: 4, fontSize: 12, color: muted }}>最近一筆到期日</div>
          </div>
        </div>

        {/* Main card */}
        <div style={{ background: panel, border: `1px solid ${line}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${line2}` }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: ink }}>推薦清單</div>
              <div style={{ fontSize: 12.5, color: muted, marginTop: 2 }}>拖拉 ≡ 圖示可調整排序，修改後請儲存設定</div>
            </div>
          </div>

          {/* Filter toolbar */}
          <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", borderBottom: `1px solid ${line2}`, background: line2, gap: 10 }}>
            <div style={{ display: "inline-flex", border: `1px solid ${line}`, borderRadius: 7, overflow: "hidden", background: panel }}>
              <button style={tabStyle("all")} onClick={() => setFilter("all")}>
                全部 <span style={{ color: muted, fontFamily: "monospace", fontSize: 12 }}>{recommendations.length}</span>
              </button>
              <button style={tabStyle("active")} onClick={() => setFilter("active")}>
                上架中 <span style={{ color: muted, fontFamily: "monospace", fontSize: 12 }}>{recommendations.filter((r) => r.Enable).length}</span>
              </button>
              <button style={{ ...tabStyle("inactive"), borderRight: "none" }} onClick={() => setFilter("inactive")}>
                已停用 <span style={{ color: muted, fontFamily: "monospace", fontSize: 12 }}>{recommendations.filter((r) => !r.Enable).length}</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <Spin spinning={loading}>
            <Form form={form} layout="vertical">
              <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
                <SortableContext items={displayItems.map((r) => r.key)} strategy={verticalListSortingStrategy}>
                  <Table
                    components={{ body: { row: Row } }}
                    rowKey="key" columns={columns} dataSource={displayItems} pagination={false}
                    locale={{
                      emptyText: (
                        <div style={{ padding: "48px 20px", textAlign: "center", color: muted }}>
                          <div style={{ width: 44, height: 44, borderRadius: 10, background: accentSoft, color: accent, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 20 }}>✦</div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: ink, marginBottom: 6 }}>尚未建立任何推薦</div>
                          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginTop: 8 }}>新增推薦</Button>
                        </div>
                      ),
                    }}
                  />
                </SortableContext>
              </DndContext>
            </Form>
          </Spin>
        </div>
      </div>
    </>
  );
}

export default RecommendationManagement;
