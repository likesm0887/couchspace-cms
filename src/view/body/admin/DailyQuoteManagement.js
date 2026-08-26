import React, { useCallback, useEffect, useState } from "react";
import { Button, DatePicker, Empty, Image, Input, Modal, Spin, Table, Tag, Upload, message } from "antd";
import {
  DeleteOutlined,
  ImportOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
  ThunderboltOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { meditationService } from "../../../service/ServicePool";

/* ── Design tokens ── */
const bg = "#F6F7F9";
const panel = "#FFFFFF";
const line = "#E6E8EC";
const line2 = "#EEF0F3";
const ink = "#10141B";
const muted = "#6B7280";
const accent = "#4556f0";
const danger = "#E84040";

const DATE_FORMAT = "YYYY-MM-DD";

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

/* ── 今日每日一句 ── */
function TodayCard({ today }) {
  return (
    <div style={{ background: panel, border: `1px solid ${line}`, borderRadius: 10, marginBottom: 20, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${line2}`, background: "#FAFAFA", display: "flex", alignItems: "center", gap: 8 }}>
        <ThunderboltOutlined style={{ color: accent }} />
        <span style={{ fontWeight: 600, color: ink }}>今日每日一句</span>
        {today?.Date && <Tag color="blue" style={{ marginLeft: 4 }}>{today.Date}</Tag>}
        <span style={{ fontSize: 12, color: muted, marginLeft: 4 }}>每日 12:00 自動更換；有指定日期的句子當天優先顯示</span>
      </div>
      {today?.Content ? (
        <div style={{ display: "flex", gap: 20, padding: "18px 20px", alignItems: "center" }}>
          {today.ImageUrl && (
            <Image src={today.ImageUrl} width={120} height={120} style={{ objectFit: "cover", borderRadius: 8 }} />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: ink, lineHeight: 1.6 }}>{today.Content}</div>
            {today.Author && <div style={{ marginTop: 8, fontSize: 13, color: muted }}>— {today.Author}</div>}
          </div>
        </div>
      ) : (
        <div style={{ padding: "28px 0" }}>
          <Empty description="尚未挑選今日的每日一句" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      )}
    </div>
  );
}

/* ── Main component ── */
function DailyQuoteManagement() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [today, setToday] = useState(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const list = await meditationService.getDailyQuotes();
      setQuotes(
        (list || []).map((q, idx) => ({
          key: q.QuoteID || `new-${idx}`,
          QuoteID: q.QuoteID || "",
          Content: q.Content || "",
          Author: q.Author || "",
          ImageUrl: q.ImageUrl || "",
          Date: q.Date || "",
        }))
      );
    } catch {
      messageApi.error("取得每日一句失敗");
    }
    try {
      const rec = await meditationService.getTodayDailyQuote();
      setToday(rec);
    } catch {
      // 新 API 尚未部署時靜默忽略
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateRow = (key, field, value) => {
    setQuotes((prev) => prev.map((q) => (q.key === key ? { ...q, [field]: value } : q)));
  };

  const handleAdd = () => {
    setQuotes((prev) => [
      ...prev,
      { key: `new-${Date.now()}`, QuoteID: "", Content: "", Author: "", ImageUrl: "", Date: "" },
    ]);
  };

  const handleRemove = (key) => {
    setQuotes((prev) => prev.filter((q) => q.key !== key));
  };

  // 以逗號（半形／全形）或換行分隔，批量新增純文字句子（不含圖片與指定日期）
  const parseBulk = (text) =>
    text
      .split(/[,，\r\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

  const handleBulkAdd = () => {
    const parsed = parseBulk(bulkText);
    if (parsed.length === 0) {
      messageApi.warning("請先貼上句子內容");
      return;
    }
    const existing = new Set(quotes.map((q) => q.Content.trim()));
    const fresh = [];
    let duplicated = 0;
    parsed.forEach((content) => {
      if (existing.has(content)) {
        duplicated += 1;
        return;
      }
      existing.add(content);
      fresh.push(content);
    });
    if (fresh.length === 0) {
      messageApi.warning("貼上的句子皆已存在");
      return;
    }
    setQuotes((prev) => [
      ...prev,
      ...fresh.map((content, i) => ({
        key: `bulk-${Date.now()}-${i}`,
        QuoteID: "",
        Content: content,
        Author: "",
        ImageUrl: "",
        Date: "",
      })),
    ]);
    setBulkText("");
    setBulkOpen(false);
    messageApi.success(
      duplicated > 0
        ? `已新增 ${fresh.length} 句，略過 ${duplicated} 句重複`
        : `已新增 ${fresh.length} 句，請記得按「儲存設定」`
    );
  };

  const handleUpload = async (key, file) => {
    setUploadingKey(key);
    try {
      const res = await meditationService.uploadDailyQuoteImage(file);
      if (res?.url) {
        updateRow(key, "ImageUrl", res.url);
        messageApi.success("圖片上傳成功");
      } else {
        messageApi.error("圖片上傳失敗");
      }
    } catch {
      messageApi.error("圖片上傳失敗");
    } finally {
      setUploadingKey(null);
    }
    return false;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const rec = await meditationService.refreshDailyQuote();
      setToday(rec);
      messageApi.success("已重新挑選今日的每日一句");
    } catch {
      messageApi.error("刷新失敗，請稍後再試");
    } finally {
      setRefreshing(false);
    }
  };

  const handleSave = async () => {
    if (quotes.some((q) => !q.Content.trim())) {
      messageApi.warning("請先填寫所有句子內容");
      return;
    }
    const dates = quotes.map((q) => q.Date).filter(Boolean);
    if (new Set(dates).size !== dates.length) {
      messageApi.warning("同一個指定日期只能設定一句");
      return;
    }
    setSaving(true);
    try {
      await meditationService.updateDailyQuotes(
        quotes.map((q) => ({
          QuoteID: q.QuoteID,
          Content: q.Content.trim(),
          Author: q.Author.trim(),
          ImageUrl: q.ImageUrl,
          Date: q.Date,
        }))
      );
      messageApi.success("每日一句已更新");
      await fetchData();
    } catch {
      messageApi.error("更新失敗，請稍後再試");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: "圖片",
      dataIndex: "ImageUrl",
      key: "ImageUrl",
      width: 150,
      render: (url, record) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
          {url ? (
            <Image src={url} width={90} height={64} style={{ objectFit: "cover", borderRadius: 6 }} />
          ) : (
            <div style={{ width: 90, height: 64, borderRadius: 6, background: line2, display: "flex", alignItems: "center", justifyContent: "center", color: muted, fontSize: 12 }}>
              無圖片
            </div>
          )}
          <Upload showUploadList={false} accept="image/*" beforeUpload={(file) => handleUpload(record.key, file)}>
            <Button size="small" icon={<UploadOutlined />} loading={uploadingKey === record.key}>
              {url ? "更換" : "上傳"}
            </Button>
          </Upload>
        </div>
      ),
    },
    {
      title: "句子內容",
      dataIndex: "Content",
      key: "Content",
      render: (text, record) => (
        <Input.TextArea
          value={text}
          placeholder="請輸入每日一句的內容"
          autoSize={{ minRows: 2, maxRows: 4 }}
          onChange={(e) => updateRow(record.key, "Content", e.target.value)}
        />
      ),
    },
    {
      title: "出處／作者",
      dataIndex: "Author",
      key: "Author",
      width: 180,
      render: (text, record) => (
        <Input
          value={text}
          placeholder="選填"
          onChange={(e) => updateRow(record.key, "Author", e.target.value)}
        />
      ),
    },
    {
      title: "指定日期",
      dataIndex: "Date",
      key: "Date",
      width: 200,
      render: (date, record) => (
        <div>
          <DatePicker
            value={date ? dayjs(date, DATE_FORMAT) : null}
            format={DATE_FORMAT}
            placeholder="不指定（隨機池）"
            style={{ width: "100%" }}
            onChange={(d) => updateRow(record.key, "Date", d ? d.format(DATE_FORMAT) : "")}
          />
          <div style={{ fontSize: 11, color: muted, marginTop: 4 }}>
            {date ? "當天固定顯示這一句" : "納入 12:00 隨機挑選"}
          </div>
        </div>
      ),
    },
    {
      title: "",
      key: "action",
      width: 60,
      render: (_, record) => (
        <button
          onClick={() => handleRemove(record.key)}
          style={{ border: "none", background: "transparent", color: danger, cursor: "pointer", padding: "4px 8px", borderRadius: 5 }}
        >
          <DeleteOutlined />
        </button>
      ),
    },
  ];

  const scheduledCount = quotes.filter((q) => q.Date).length;
  const randomCount = quotes.length - scheduledCount;

  return (
    <>
      {contextHolder}
      <div style={{ background: bg, minHeight: "100vh", padding: "28px 32px 64px" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 6px", color: ink, letterSpacing: "-0.01em" }}>每日一句管理</h1>
            <p style={{ margin: 0, fontSize: 13.5, color: muted }}>
              設定每日一句的內容與圖片。指定日期者當天必定顯示，其餘每日 12:00 隨機挑選一句。
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>重新載入</Button>
            <Button icon={<ThunderboltOutlined />} loading={refreshing} onClick={handleRefresh}>立即刷新</Button>
            <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}>儲存設定</Button>
          </div>
        </div>

        {/* 今日每日一句 */}
        <TodayCard today={today} />

        {/* Stats strip */}
        <div style={{ display: "flex", background: panel, border: `1px solid ${line}`, borderRadius: 10, marginBottom: 20, overflow: "hidden" }}>
          <StatCard label="總句數" value={quotes.length} note="已設定" />
          <StatCard label="指定日期" value={scheduledCount} note="當天固定顯示" />
          <StatCard label="隨機池" value={randomCount} note="每日 12:00 挑選" last />
        </div>

        {/* 清單 */}
        <div style={{ background: panel, border: `1px solid ${line}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${line2}`, background: "#FAFAFA" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: ink }}>句子清單</div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button icon={<ImportOutlined />} size="small" onClick={() => setBulkOpen(true)}>批量新增</Button>
              <Button type="primary" icon={<PlusOutlined />} size="small" onClick={handleAdd}>新增一句</Button>
            </div>
          </div>
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={quotes}
              pagination={false}
              locale={{ emptyText: <Empty description="尚未新增任何句子" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
            />
          </Spin>
        </div>

        {/* 批量新增 */}
        <Modal
          title="批量新增每日一句"
          open={bulkOpen}
          onCancel={() => setBulkOpen(false)}
          onOk={handleBulkAdd}
          okText={`新增${parseBulk(bulkText).length > 0 ? ` ${parseBulk(bulkText).length} 句` : ""}`}
          cancelText="取消"
          width={640}
        >
          <p style={{ fontSize: 13, color: muted, marginTop: 0 }}>
            以<b>逗號</b>（半形 <code>,</code> 或全形 <code>，</code>）或<b>換行</b>分隔多個句子。
            批量新增的句子不含圖片與指定日期，會直接納入每日 12:00 的隨機池；重複的句子會自動略過。
          </p>
          <Input.TextArea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="例如：今天也要好好照顧自己，休息不是偷懶，慢慢來比較快"
            autoSize={{ minRows: 6, maxRows: 14 }}
          />
          {parseBulk(bulkText).length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, color: muted, marginBottom: 6 }}>
                預覽（共 {parseBulk(bulkText).length} 句）
              </div>
              <div style={{ maxHeight: 180, overflowY: "auto", border: `1px solid ${line}`, borderRadius: 6, padding: "8px 10px" }}>
                {parseBulk(bulkText).map((s, i) => (
                  <div key={i} style={{ fontSize: 13, color: ink, padding: "3px 0" }}>
                    <span style={{ color: muted, fontFamily: "monospace", marginRight: 8 }}>{i + 1}</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}

export default DailyQuoteManagement;
