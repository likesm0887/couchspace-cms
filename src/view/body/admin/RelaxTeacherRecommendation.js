import { useCallback, useEffect, useMemo, useState } from "react";
import { Avatar, Button, message, Select, Spin, Tag } from "antd";
import { DeleteOutlined, MenuOutlined, PlusOutlined, ReloadOutlined, SaveOutlined } from "@ant-design/icons";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { meditationService, counselorService } from "../../../service/ServicePool";
import {
  getCounselorDetail,
  getCounselorName,
  normalizeRecommendations,
  resolveCounselor,
  toRecommendationPayload,
} from "./recommendationData";

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
function RelaxTeacherRecommendation() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [counselors, setCounselors] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loadFailed, setLoadFailed] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const counselorList = await counselorService.getAllCounselorInfo(false);
      setCounselors(counselorList || []);
    } catch (error) {
      messageApi.error("取得諮商師資料失敗");
    }
    try {
      const recList = await meditationService.getRelaxTeacherRecommendations();
      setRecommendations(normalizeRecommendations(recList || []));
      setLoadFailed(false);
    } catch (error) {
      // 讀取失敗時不跳錯誤訊息（新 API 可能尚未部署），但要記下來擋住儲存，
      // 否則使用者會把「載入失敗的空清單」存回後端，直接清掉線上設定。
      setRecommendations([]);
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* CounselorID -> 老師完整資料，讓每列可以用 ID 直接查表 */
  const counselorMap = useMemo(
    () => new Map(counselors.map((c) => [c.ID, c])),
    [counselors]
  );

  const counselorOptions = useMemo(
    () =>
      counselors.map((c) => ({
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

  /* 本地清單與後端 embed 的資料都串不出老師（例如老師已被刪除） */
  const missingCount = useMemo(
    () =>
      recommendations.filter((r) => r.CounselorID && !resolveCounselor(r, counselorMap)).length,
    [recommendations, counselorMap]
  );

  const verifiedCount = useMemo(
    () => recommendations.filter((r) => resolveCounselor(r, counselorMap)?.IsVerify).length,
    [recommendations, counselorMap]
  );

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
    if (loadFailed) {
      messageApi.warning("目前讀不到現有設定，請先重新載入成功再儲存");
      return;
    }
    if (recommendations.some((r) => !r.CounselorID)) {
      messageApi.warning("請先為每筆推薦選擇諮商師");
      return;
    }
    setSaving(true);
    try {
      await meditationService.updateRelaxTeacherRecommendations(
        toRecommendationPayload(recommendations)
      );
      messageApi.success("放鬆老師推薦已更新");
      await fetchData();
    } catch (error) {
      messageApi.error("更新失敗，請稍後再試");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{ background: bg, minHeight: "100vh", padding: "28px 32px 64px" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 6px", color: ink, letterSpacing: "-0.01em" }}>放鬆老師推薦管理</h1>
            <p style={{ margin: 0, fontSize: 13.5, color: muted }}>管理放鬆專區推薦老師，可拖移調整順序。</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>重新載入</Button>
            <Button icon={<SaveOutlined />} loading={saving} disabled={loadFailed} onClick={handleSave}>儲存設定</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增推薦</Button>
          </div>
        </div>

        {loadFailed && (
          <div style={{ background: "#FFF4F4", border: `1px solid ${danger}`, color: danger, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13 }}>
            讀取放鬆老師推薦設定失敗，畫面顯示的是空清單而非實際設定。已暫時停用「儲存設定」以免覆蓋線上資料，請按「重新載入」重試。
          </div>
        )}

        {/* Stats strip */}
        <div style={{ display: "flex", flexWrap: "wrap", background: panel, border: `1px solid ${line}`, borderRadius: 10, marginBottom: 20, overflow: "hidden" }}>
          <StatCard label="推薦總數" value={recommendations.length} note="所有推薦老師" />
          <StatCard label="已認證" value={verifiedCount} note="推薦中已認證的老師" />
          <StatCard label="查無資料" value={missingCount} note={missingCount > 0 ? "ID 對不到諮商師" : "資料一致"} last />
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
                <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${line2}`, background: "#FAFAFA" }}>
                      <th style={{ width: 44, padding: "10px 8px" }}></th>
                      <th style={{ width: 48, padding: "10px 8px", textAlign: "left", fontSize: 12, color: muted, fontWeight: 500 }}>#</th>
                      <th style={{ width: 280, padding: "10px 12px", textAlign: "left", fontSize: 12, color: muted, fontWeight: 500 }}>諮商師</th>
                      <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 12, color: muted, fontWeight: 500 }}>老師資料</th>
                      <th style={{ width: 52 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recommendations.length === 0 && (
                      <tr>
                        <td colSpan={5}>
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
                        counselor={resolveCounselor(record, counselorMap)}
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
                </div>
              </SortableContext>
            </DndContext>
          </Spin>
        </div>
      </div>
    </>
  );
}

/* ── Sortable table row ── */
function SortableRow({ record, index, counselor, counselorOptions, onRemove, onChange }) {
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

  const detail = counselor ? getCounselorDetail(counselor) : null;
  const missing = !!record.CounselorID && !counselor;

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
      <td style={{ width: 280, padding: "10px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {detail && (
            <Avatar
              src={detail.photo || undefined}
              size={36}
              style={{ background: accentSoft, color: accent, fontSize: 14, flexShrink: 0 }}
            >
              {detail.name.charAt(0)}
            </Avatar>
          )}
          <Select
            placeholder="選擇諮商師"
            value={record.CounselorID || undefined}
            style={{ flex: 1, minWidth: 180 }}
            onChange={onChange}
            showSearch
            filterOption={(input, opt) =>
              (opt?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={counselorOptions}
          />
        </div>
      </td>

      {/* 用 CounselorID 串出的老師完整資料 */}
      <td style={{ padding: "10px 12px" }}>
        {missing && (
          <div style={{ fontSize: 12.5, color: danger }}>
            查無此諮商師（ID: <span style={{ fontFamily: "monospace" }}>{record.CounselorID}</span>）
          </div>
        )}
        {!record.CounselorID && (
          <span style={{ fontSize: 12.5, color: muted }}>尚未選擇諮商師</span>
        )}
        {detail && (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: ink }}>{detail.name}</span>
              {detail.fullName && detail.fullName !== detail.name && (
                <span style={{ fontSize: 12.5, color: muted }}>{detail.fullName}</span>
              )}
              <Tag color={detail.isVerify ? "green" : "orange"} style={{ marginInlineEnd: 0 }}>
                {detail.isVerify ? "已認證" : "未認證"}
              </Tag>
              {detail.subRole && <Tag color="blue" style={{ marginInlineEnd: 0 }}>{detail.subRole}</Tag>}
            </div>

            <div style={{ fontSize: 12.5, color: ink2 }}>
              {[detail.position, detail.location].filter(Boolean).join(" · ") || "—"}
            </div>

            {detail.expertises.length > 0 && (
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {detail.expertises.map((skill) => (
                  <Tag key={skill} color="purple" style={{ marginInlineEnd: 0, fontSize: 11 }}>{skill}</Tag>
                ))}
              </div>
            )}

            <div style={{ fontSize: 12, color: muted }}>
              {[detail.email, detail.phone].filter(Boolean).join(" · ")}
              {detail.languages.length > 0 && ` · ${detail.languages.join("/")}`}
            </div>
          </div>
        )}
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

export default RelaxTeacherRecommendation;
