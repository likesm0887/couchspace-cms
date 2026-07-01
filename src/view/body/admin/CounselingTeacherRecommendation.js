import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Avatar, Button, message, Select, Spin } from "antd";
import { DeleteOutlined, MenuOutlined, PlusOutlined, ReloadOutlined, SaveOutlined } from "@ant-design/icons";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { meditationService, counselorService } from "../../../service/ServicePool";

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
const danger = "#E84040";

/* ── Drag-sortable row ── */
const Row = ({ children, ...props }) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: props["data-row-key"] });
  const style = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999, background: "#F0F5FF" } : {}),
  };
  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if (child && child.key === "sort") {
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

/* ── Helpers ── */
const normalizeRecommendations = (list = []) =>
  list
    .map((item, i) => ({
      key: item.CounselorID ? `rec-${item.CounselorID}` : `rec-new-${i}`,
      CounselorID: item.CounselorID || "",
      Sequence: typeof item.Sequence === "number" ? item.Sequence : i,
    }))
    .sort((a, b) => a.Sequence - b.Sequence);

const getCounselorName = (counselor) => {
  const nick = counselor?.UserName?.NickName || "";
  const last = counselor?.UserName?.Name?.LastName || "";
  const first = counselor?.UserName?.Name?.FirstName || "";
  const full = (last + first).trim();
  return nick || full || "未命名";
};

/* ── Main component ── */
function CounselingTeacherRecommendation() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [counselors, setCounselors] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const counselorList = await counselorService.getAllCounselorInfo(false);
      setCounselors(counselorList || []);
    } catch (error) {
      messageApi.error("取得諮商師資料失敗");
    }
    try {
      const recList = await meditationService.getCounselingTeacherRecommendations();
      setRecommendations(normalizeRecommendations(recList || []));
    } catch (error) {
      // 新 API 尚未部署時靜默忽略，保留空清單
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const counselorOptions = useMemo(
    () =>
      counselors
        .filter((c) => c.IsBookable === true)
        .map((c) => ({
          value: c.ID,
          label: getCounselorName(c),
          photo: c?.Photo || "",
        })),
    [counselors]
  );

  const selectedIDs = useMemo(
    () => new Set(recommendations.map((r) => r.CounselorID).filter(Boolean)),
    [recommendations]
  );

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
      { key: `new-${Date.now()}`, CounselorID: "", Sequence: prev.length },
    ]);
  }, []);

  const handleRemove = useCallback((key) => {
    setRecommendations((prev) =>
      prev.filter((r) => r.key !== key).map((r, i) => ({ ...r, Sequence: i }))
    );
  }, []);

  const handleSave = async () => {
    if (recommendations.some((r) => !r.CounselorID)) {
      messageApi.warning("請先為每筆推薦選擇諮商師");
      return;
    }
    setSaving(true);
    try {
      await meditationService.updateCounselingTeacherRecommendations(
        recommendations.map((r) => ({ CounselorID: r.CounselorID, Sequence: r.Sequence }))
      );
      messageApi.success("精選心理師推薦已更新");
      await fetchData();
    } catch (error) {
      messageApi.error("更新失敗，請稍後再試");
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo(() => [
    { key: "sort", dataIndex: "sort", width: 44, render: () => null },
    {
      title: "#", dataIndex: "Sequence", key: "seq", width: 48,
      render: (_, __, i) => (
        <span style={{ fontFamily: "monospace", color: muted, fontSize: 12 }}>{i + 1}</span>
      ),
    },
    {
      title: "諮商師", dataIndex: "CounselorID", key: "CounselorID",
      render: (_, record) => {
        const selected = counselors.find((c) => c.ID === record.CounselorID);
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {selected && (
              <Avatar
                src={selected?.Photo || undefined}
                size={28}
                style={{ background: accentSoft, color: accent, fontSize: 12, flexShrink: 0 }}
              >
                {getCounselorName(selected).charAt(0)}
              </Avatar>
            )}
            <Select
              placeholder="選擇諮商師"
              value={record.CounselorID || undefined}
              style={{ flex: 1, minWidth: 200 }}
              onChange={(v) => {
                const newKey = `rec-${v}`;
                setRecommendations((prev) =>
                  prev.map((r) =>
                    r.key === record.key ? { ...r, CounselorID: v, key: newKey } : r
                  )
                );
              }}
              showSearch
              filterOption={(input, opt) =>
                (opt?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              options={counselorOptions}
            />
          </div>
        );
      },
    },
    {
      key: "actions", width: 52,
      render: (_, record) => (
        <button
          onClick={() => handleRemove(record.key)}
          style={{
            border: "none", background: "transparent", color: danger,
            cursor: "pointer", padding: "4px 8px", borderRadius: 5,
            display: "flex", alignItems: "center",
          }}
        >
          <DeleteOutlined />
        </button>
      ),
    },
  ], [counselors, counselorOptions, handleRemove]);

  return (
    <>
      {contextHolder}
      <div style={{ background: bg, minHeight: "100vh", padding: "28px 32px 64px" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 6px", color: ink, letterSpacing: "-0.01em" }}>精選心理師推薦管理</h1>
            <p style={{ margin: 0, fontSize: 13.5, color: muted }}>管理精選推薦老師，可拖移調整順序。</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>重新載入</Button>
            <Button icon={<SaveOutlined />} loading={saving} onClick={handleSave}>儲存設定</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增推薦</Button>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: "flex", background: panel, border: `1px solid ${line}`, borderRadius: 10, marginBottom: 20, overflow: "hidden" }}>
          <StatCard label="推薦總數" value={recommendations.length} note="所有推薦老師" last />
        </div>

        {/* Main card */}
        <div style={{ background: panel, border: `1px solid ${line}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${line2}` }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: ink }}>推薦清單</div>
              <div style={{ fontSize: 12.5, color: muted, marginTop: 2 }}>拖拉 ≡ 圖示可調整排序，修改後請儲存設定</div>
            </div>
          </div>

          {/* Table */}
          <Spin spinning={loading}>
            <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
              <SortableContext items={recommendations.map((r) => r.key)} strategy={verticalListSortingStrategy}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${line2}`, background: "#FAFAFA" }}>
                      <th style={{ width: 44, padding: "10px 8px" }}></th>
                      <th style={{ width: 48, padding: "10px 8px", textAlign: "left", fontSize: 12, color: muted, fontWeight: 500 }}>#</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 12, color: muted, fontWeight: 500 }}>諮商師</th>
                      <th style={{ width: 52 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recommendations.length === 0 && (
                      <tr>
                        <td colSpan={4}>
                          <div style={{ padding: "48px 20px", textAlign: "center", color: muted }}>
                            <div style={{ width: 44, height: 44, borderRadius: 10, background: accentSoft, color: accent, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 20 }}>✦</div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: ink, marginBottom: 6 }}>尚未建立任何推薦</div>
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginTop: 8 }}>新增推薦</Button>
                          </div>
                        </td>
                      </tr>
                    )}
                    {recommendations.map((record, index) => (
                      <SortableRow
                        key={record.key}
                        record={record}
                        index={index}
                        counselors={counselors}
                        counselorOptions={counselorOptions.filter(
                          (opt) => !selectedIDs.has(opt.value) || opt.value === record.CounselorID
                        )}
                        onRemove={handleRemove}
                        onChange={(v) => {
                          const newKey = `rec-${v}`;
                          setRecommendations((prev) =>
                            prev.map((r) =>
                              r.key === record.key ? { ...r, CounselorID: v, key: newKey } : r
                            )
                          );
                        }}
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

/* ── Sortable table row ── */
function SortableRow({ record, index, counselors, counselorOptions, onRemove, onChange }) {
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

  const selected = counselors.find((c) => c.ID === record.CounselorID);

  return (
    <tr ref={setNodeRef} style={style} {...attributes}>
      <td style={{ width: 44, padding: "10px 8px", textAlign: "center" }}>
        <MenuOutlined
          ref={setActivatorNodeRef}
          style={{ touchAction: "none", cursor: "move", color: "#6B7280" }}
          {...listeners}
        />
      </td>
      <td style={{ width: 48, padding: "10px 8px" }}>
        <span style={{ fontFamily: "monospace", color: "#6B7280", fontSize: 12 }}>{index + 1}</span>
      </td>
      <td style={{ padding: "10px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {selected && (
            <Avatar
              src={selected?.Photo || undefined}
              size={28}
              style={{ background: accentSoft, color: accent, fontSize: 12, flexShrink: 0 }}
            >
              {getCounselorName(selected).charAt(0)}
            </Avatar>
          )}
          <Select
            placeholder="選擇諮商師"
            value={record.CounselorID || undefined}
            style={{ flex: 1, minWidth: 200 }}
            onChange={onChange}
            showSearch
            filterOption={(input, opt) =>
              (opt?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={counselorOptions}
          />
        </div>
      </td>
      <td style={{ width: 52, padding: "10px 8px" }}>
        <button
          onClick={() => onRemove(record.key)}
          style={{
            border: "none", background: "transparent", color: "#E84040",
            cursor: "pointer", padding: "4px 8px", borderRadius: 5,
            display: "flex", alignItems: "center",
          }}
        >
          <DeleteOutlined />
        </button>
      </td>
    </tr>
  );
}

export default CounselingTeacherRecommendation;
