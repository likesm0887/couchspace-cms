import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, DatePicker, message, Select, Spin, Switch } from "antd";
import { DeleteOutlined, MenuOutlined, PlusOutlined, ReloadOutlined, SaveOutlined } from "@ant-design/icons";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import dayjs from "dayjs";
import { meditationService } from "../../../service/ServicePool";

const { RangePicker } = DatePicker;

/* ── Design tokens ── */
const bg = "#F6F7F9";
const panel = "#FFFFFF";
const line = "#E6E8EC";
const line2 = "#EEF0F3";
const ink = "#10141B";
const muted = "#6B7280";
const accent = "#4556f0";
const accentSoft = "#EEF0FE";
const danger = "#E84040";

/* ── Helpers ── */
const DEFAULT_RANGE = [dayjs().startOf("day"), dayjs().add(7, "day").endOf("day")];
const normalizeDateValue = (v) => { if (!v) return null; const p = dayjs(v); return p.isValid() ? p : null; };
const normalizeRecommendations = (list = []) =>
  list.map((item, i) => ({
    key: item.SeriesID || `rec-new-${i}`,
    SeriesID: item.SeriesID || "",
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

/* ── Sortable row ── */
function SortableRow({ record, index, musicOptions, onRemove, onChangeSeriesID, onChangeEnable, onChangeDateRange }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: record.key });

  const style = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    background: isDragging ? "#F0F5FF" : index % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
    position: isDragging ? "relative" : undefined,
    zIndex: isDragging ? 9999 : undefined,
    borderBottom: `1px solid ${line2}`,
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes}>
      <td style={{ width: 44, padding: "10px 8px", textAlign: "center" }}>
        <MenuOutlined ref={setActivatorNodeRef} style={{ touchAction: "none", cursor: "move", color: muted }} {...listeners} />
      </td>
      <td style={{ width: 48, padding: "10px 8px" }}>
        <span style={{ fontFamily: "monospace", color: muted, fontSize: 12 }}>{index + 1}</span>
      </td>
      <td style={{ padding: "10px 12px", minWidth: 220 }}>
        <Select
          placeholder="選擇名人指南內容"
          value={record.SeriesID || undefined}
          style={{ width: "100%" }}
          onChange={onChangeSeriesID}
          showSearch
          filterOption={(input, opt) => (opt?.label ?? "").toLowerCase().includes(input.toLowerCase())}
          options={musicOptions}
        />
      </td>
      <td style={{ width: 80, padding: "10px 8px", textAlign: "center" }}>
        <Switch checked={record.Enable} size="small" onChange={onChangeEnable} />
      </td>
      <td style={{ padding: "10px 12px" }}>
        <RangePicker
          value={[normalizeDateValue(record.EnableStartTime), normalizeDateValue(record.EnableEndTime)]}
          format="YYYY/MM/DD"
          size="small"
          onChange={(vals) => {
            const [s, e] = vals || [];
            onChangeDateRange(
              s ? s.format("YYYY/MM/DD") : "",
              e ? e.format("YYYY/MM/DD") : ""
            );
          }}
        />
      </td>
      <td style={{ width: 52, padding: "10px 8px" }}>
        <button
          onClick={onRemove}
          style={{ border: "none", background: "transparent", color: danger, cursor: "pointer", padding: "4px 8px", borderRadius: 5, display: "flex", alignItems: "center" }}
        >
          <DeleteOutlined />
        </button>
      </td>
    </tr>
  );
}

/* ── Main component ── */
function CelebrityGuideRecommendation() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [contentItems, setContentItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const courseList = await meditationService.getAllCourse();
      const courses = courseList || [];
      setContentItems(courses.map((c) => ({
        value: c.CourseID,
        label: c.CourseName || "未命名系列",
      })));
    } catch {
      messageApi.error("取得系列資料失敗");
    }
    try {
      const common = await meditationService.getCommonData();
      setRecommendations(normalizeRecommendations(common?.CelebrityMeditation || []));
    } catch {
      // 靜默忽略，保留空清單
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const musicOptions = useMemo(
    () => contentItems,
    [contentItems]
  );

  const activeCount = recommendations.filter((r) => r.Enable).length;

  const displayItems = useMemo(() => {
    if (filter === "active") return recommendations.filter((r) => r.Enable);
    if (filter === "inactive") return recommendations.filter((r) => !r.Enable);
    return recommendations;
  }, [recommendations, filter]);

  const updateRec = useCallback((key, patch) => {
    setRecommendations((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }, []);

  const handleDragEnd = useCallback(({ active, over }) => {
    if (!over || active.id === over.id) return;
    setRecommendations((prev) => {
      const oi = prev.findIndex((r) => r.key === active.id);
      const ni = prev.findIndex((r) => r.key === over.id);
      return arrayMove(prev, oi, ni).map((r, i) => ({ ...r, Sequence: i }));
    });
  }, []);

  const handleAdd = useCallback(() => {
    setRecommendations((prev) => [
      ...prev,
      {
        key: `new-${Date.now()}`,
        SeriesID: "",
        Sequence: prev.length,
        Enable: true,
        EnableStartTime: DEFAULT_RANGE[0].format("YYYY/MM/DD"),
        EnableEndTime: DEFAULT_RANGE[1].format("YYYY/MM/DD"),
      },
    ]);
  }, []);

  const handleRemove = useCallback((key) => {
    setRecommendations((prev) => prev.filter((r) => r.key !== key).map((r, i) => ({ ...r, Sequence: i })));
  }, []);

  const handleSave = async () => {
    if (recommendations.some((r) => !r.SeriesID)) {
      messageApi.warning("請先為每筆推薦選擇名人指南內容");
      return;
    }
    setSaving(true);
    try {
      const common = await meditationService.getCommonData();
      common.CelebrityMeditation = recommendations.map((r, i) => ({
        SeriesID: r.SeriesID,
        Sequence: i,
        Enable: r.Enable,
        EnableStartTime: r.EnableStartTime || "",
        EnableEndTime: r.EnableEndTime || "",
      }));
      await meditationService.updateCommonData(common);
      messageApi.success("名人指南推薦已更新");
      await fetchData();
    } catch {
      messageApi.error("更新失敗，請稍後再試");
    } finally {
      setSaving(false);
    }
  };

  const tabStyle = (key) => ({
    padding: "6px 12px", border: "none",
    background: filter === key ? "#F2F4F7" : "transparent",
    color: filter === key ? ink : muted,
    fontWeight: filter === key ? 500 : 400,
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
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 6px", color: ink, letterSpacing: "-0.01em" }}>名人指南推薦管理</h1>
            <p style={{ margin: 0, fontSize: 13.5, color: muted }}>管理 App 名人指南推薦內容，可拖移調整順序並設定上架期間。</p>
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
          <StatCard label="上架率" value={recommendations.length ? Math.round((activeCount / recommendations.length) * 100) : 0} unit="%" note="已啟用佔比" last />
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
          <div style={{ padding: "10px 14px", borderBottom: `1px solid ${line2}`, background: "#FBFCFD" }}>
            <div style={{ display: "inline-flex", border: `1px solid ${line}`, borderRadius: 7, overflow: "hidden", background: "#fff" }}>
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
            <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
              <SortableContext items={displayItems.map((r) => r.key)} strategy={verticalListSortingStrategy}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${line2}`, background: "#FAFAFA" }}>
                      <th style={{ width: 44, padding: "10px 8px" }}></th>
                      <th style={{ width: 48, padding: "10px 8px", textAlign: "left", fontSize: 12, color: muted, fontWeight: 500 }}>#</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 12, color: muted, fontWeight: 500 }}>名人指南內容</th>
                      <th style={{ width: 80, padding: "10px 8px", textAlign: "center", fontSize: 12, color: muted, fontWeight: 500 }}>上架</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 12, color: muted, fontWeight: 500 }}>生效期間</th>
                      <th style={{ width: 52 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayItems.length === 0 && (
                      <tr>
                        <td colSpan={6}>
                          <div style={{ padding: "48px 20px", textAlign: "center", color: muted }}>
                            <div style={{ width: 44, height: 44, borderRadius: 10, background: accentSoft, color: accent, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 20 }}>✦</div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: ink, marginBottom: 6 }}>尚未建立任何推薦</div>
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginTop: 8 }}>新增推薦</Button>
                          </div>
                        </td>
                      </tr>
                    )}
                    {displayItems.map((record, index) => (
                      <SortableRow
                        key={record.key}
                        record={record}
                        index={index}
                        musicOptions={musicOptions}
                        onRemove={() => handleRemove(record.key)}
                        onChangeSeriesID={(v) => updateRec(record.key, { SeriesID: v })}
                        onChangeEnable={(v) => updateRec(record.key, { Enable: v })}
                        onChangeDateRange={(s, e) => updateRec(record.key, { EnableStartTime: s, EnableEndTime: e })}
                      />
                    ))}
                  </tbody>
                </table>
              </SortableContext>
            </DndContext>
          </Spin>
        </div>
      </div>
    </>
  );
}

export default CelebrityGuideRecommendation;
