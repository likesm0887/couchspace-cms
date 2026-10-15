import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Empty, Modal } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import DOMPurify from "dompurify";

const line = "var(--cms-line)";
const ink = "var(--cms-ink)";
const muted = "var(--cms-muted)";
const accent = "#4556f0";

// 與編輯器 schema 對齊，只允許這些標籤進入預覽
const ALLOWED_TAGS = [
  "p", "br", "hr", "h2", "h3", "strong", "em", "u", "s",
  "ul", "ol", "li", "blockquote", "a", "span",
];
const ALLOWED_ATTR = ["href", "target", "rel", "style"];

const sanitize = (html) =>
  DOMPurify.sanitize(html || "", { ALLOWED_TAGS, ALLOWED_ATTR });

/**
 * 文章預覽：模擬 App 的閱讀視窗，可左右切換分頁。
 */
function ArticlePreview({ open, onClose, title, pages = [] }) {
  const [index, setIndex] = useState(0);

  const validPages = useMemo(
    () => pages.filter((p) => (p.Content || "").trim() !== ""),
    [pages]
  );

  // 開啟時回到第一頁；分頁數變少時夾住 index
  useEffect(() => {
    if (open) setIndex(0);
  }, [open]);

  useEffect(() => {
    if (index > validPages.length - 1) setIndex(Math.max(0, validPages.length - 1));
  }, [validPages.length, index]);

  const total = validPages.length;
  const canPrev = index > 0;
  const canNext = index < total - 1;

  const goPrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const goNext = useCallback(() => setIndex((i) => Math.min(total - 1, i + 1)), [total]);

  // 鍵盤左右鍵翻頁
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, goPrev, goNext]);

  const currentHtml = total > 0 ? sanitize(validPages[index].Content) : "";

  return (
    <Modal
      title={`預覽：${title || "未命名文章"}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={520}
      destroyOnClose
    >
      {total === 0 ? (
        <Empty description="尚無內容可預覽" style={{ padding: "40px 0" }} />
      ) : (
        <div>
          {/* 手機尺寸的閱讀視窗 */}
          <div
            style={{
              border: `1px solid ${line}`,
              borderRadius: 12,
              height: 460,
              overflowY: "auto",
              padding: "20px 22px",
              background: "var(--cms-panel)",
              position: "relative",
            }}
          >
            <div
              className="article-preview-body"
              style={{ color: ink, fontSize: 15, lineHeight: 1.75 }}
              dangerouslySetInnerHTML={{ __html: currentHtml }}
            />
          </div>

          {/* 翻頁控制 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 14,
            }}
          >
            <Button icon={<LeftOutlined />} disabled={!canPrev} onClick={goPrev}>
              上一頁
            </Button>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, color: muted }}>
                {index + 1} / {total}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                {validPages.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`第 ${i + 1} 頁`}
                    onClick={() => setIndex(i)}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      background: i === index ? accent : "var(--cms-line2)",
                      transition: "background 0.15s",
                    }}
                  />
                ))}
              </div>
            </div>

            <Button icon={<RightOutlined />} disabled={!canNext} onClick={goNext}>
              下一頁
            </Button>
          </div>

          <div style={{ marginTop: 8, textAlign: "center", fontSize: 12, color: muted }}>
            可用鍵盤 ← → 翻頁
          </div>
        </div>
      )}
    </Modal>
  );
}

export default ArticlePreview;
