import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, message, Select, Spin } from "antd";
import { DeleteOutlined, PlusOutlined, ReloadOutlined, SaveOutlined } from "@ant-design/icons";
import { meditationService } from "../../../service/ServicePool";

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

const SLOTS = [
  { key: "Morning", label: "早上", emoji: "🌅" },
  { key: "Noon",    label: "中午", emoji: "☀️" },
  { key: "Evening", label: "晚上", emoji: "🌙" },
];

/* ── Stat card ── */
function StatCard({ label, value, note, last }) {
  return (
    <div style={{ flex: 1, padding: "16px 20px", borderRight: last ? "none" : `1px solid ${line}` }}>
      <div style={{ fontSize: 11, color: muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 22, fontWeight: 600, color: ink }}>{value}</div>
      {note && <div style={{ marginTop: 4, fontSize: 12, color: muted }}>{note}</div>}
    </div>
  );
}

/* ── Single slot panel ── */
function SlotPanel({ slotKey, label, emoji, musicIDs, musicOptions, onChange }) {
  const selectedSet = useMemo(() => new Set(musicIDs), [musicIDs]);

  const handleAdd = () => onChange([...musicIDs, ""]);
  const handleRemove = (idx) => onChange(musicIDs.filter((_, i) => i !== idx));
  const handleChange = (idx, val) => onChange(musicIDs.map((v, i) => (i === idx ? val : v)));

  return (
    <div style={{ background: panel, border: `1px solid ${line}`, borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${line2}`, background: "#FAFAFA" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>{emoji}</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: ink }}>{label}</div>
            <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>{musicIDs.length} 首候選音樂</div>
          </div>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="small" onClick={handleAdd}>新增</Button>
      </div>

      {/* List */}
      <div style={{ padding: "12px 18px" }}>
        {musicIDs.length === 0 && (
          <div style={{ textAlign: "center", padding: "24px 0", color: muted }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: accentSoft, color: accent, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: 18 }}>♪</div>
            <div style={{ fontSize: 13, color: muted }}>尚未加入任何音樂</div>
            <Button type="dashed" icon={<PlusOutlined />} size="small" onClick={handleAdd} style={{ marginTop: 8 }}>新增音樂</Button>
          </div>
        )}
        {musicIDs.map((id, idx) => {
          const availableOptions = musicOptions.filter(
            (opt) => !selectedSet.has(opt.value) || opt.value === id
          );
          return (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: "monospace", color: muted, fontSize: 12, width: 20, textAlign: "right", flexShrink: 0 }}>{idx + 1}</span>
              <Select
                placeholder="搜尋並選擇音樂"
                value={id || undefined}
                style={{ flex: 1 }}
                onChange={(val) => handleChange(idx, val)}
                showSearch
                filterOption={(input, opt) => (opt?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                options={availableOptions}
              />
              <button
                onClick={() => handleRemove(idx)}
                style={{ border: "none", background: "transparent", color: danger, cursor: "pointer", padding: "4px 8px", borderRadius: 5, display: "flex", alignItems: "center", flexShrink: 0 }}
              >
                <DeleteOutlined />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main component ── */
function DailySessionRecommendation() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [musicOptions, setMusicOptions] = useState([]);
  const [pool, setPool] = useState({ Morning: [], Noon: [], Evening: [] });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const musics = await meditationService.getAllMusic();
      setMusicOptions(
        (musics || []).map((m) => ({ value: m.MusicID, label: m.Title || "未命名音樂" }))
      );
    } catch {
      messageApi.error("取得音樂資料失敗");
    }
    try {
      const data = await meditationService.getDailySessionPool();
      setPool({
        Morning: data?.Morning || [],
        Noon: data?.Noon || [],
        Evening: data?.Evening || [],
      });
    } catch {
      // 新 API 尚未部署時靜默忽略
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleChange = useCallback((slotKey, ids) => {
    setPool((prev) => ({ ...prev, [slotKey]: ids }));
  }, []);

  const handleSave = async () => {
    const hasEmpty = Object.values(pool).some((ids) => ids.includes(""));
    if (hasEmpty) {
      messageApi.warning("請先為每個欄位選擇音樂");
      return;
    }
    setSaving(true);
    try {
      await meditationService.updateDailySessionPool(pool);
      messageApi.success("每日課程推薦已更新");
      await fetchData();
    } catch {
      messageApi.error("更新失敗，請稍後再試");
    } finally {
      setSaving(false);
    }
  };

  const totalCount = pool.Morning.length + pool.Noon.length + pool.Evening.length;

  return (
    <>
      {contextHolder}
      <div style={{ background: bg, minHeight: "100vh", padding: "28px 32px 64px" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 6px", color: ink, letterSpacing: "-0.01em" }}>每日課程推薦管理</h1>
            <p style={{ margin: 0, fontSize: 13.5, color: muted }}>設定早中晚三時段的候選音樂，每天從各池隨機推薦一堂。</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>重新載入</Button>
            <Button icon={<SaveOutlined />} loading={saving} onClick={handleSave}>儲存設定</Button>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: "flex", background: panel, border: `1px solid ${line}`, borderRadius: 10, marginBottom: 20, overflow: "hidden" }}>
          <StatCard label="早上候選" value={pool.Morning.length} note="首音樂" />
          <StatCard label="中午候選" value={pool.Noon.length} note="首音樂" />
          <StatCard label="晚上候選" value={pool.Evening.length} note="首音樂" />
          <StatCard label="候選總數" value={totalCount} note="三時段合計" last />
        </div>

        {/* Slot panels */}
        <Spin spinning={loading}>
          {SLOTS.map((slot) => (
            <SlotPanel
              key={slot.key}
              slotKey={slot.key}
              label={slot.label}
              emoji={slot.emoji}
              musicIDs={pool[slot.key]}
              musicOptions={musicOptions}
              onChange={(ids) => handleChange(slot.key, ids)}
            />
          ))}
        </Spin>
      </div>
    </>
  );
}

export default DailySessionRecommendation;
