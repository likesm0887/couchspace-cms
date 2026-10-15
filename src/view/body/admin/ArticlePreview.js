import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Empty, Modal } from "antd";
import { LeftOutlined, RightOutlined, CloseOutlined } from "@ant-design/icons";
import DOMPurify from "dompurify";

// 與編輯器 schema 對齊，只允許這些標籤進入預覽
const ALLOWED_TAGS = [
  "p", "br", "hr", "h2", "h3", "strong", "em", "u", "s",
  "ul", "ol", "li", "blockquote", "a", "span",
];
const ALLOWED_ATTR = ["href", "target", "rel", "style"];

const sanitize = (html) =>
  DOMPurify.sanitize(html || "", { ALLOWED_TAGS, ALLOWED_ATTR });

/**
 * 文章預覽：以手機比例模擬 App 的沉浸式閱讀畫面，可左右切換分頁。
 */
function ArticlePreview({ open, onClose, title, pages = [] }) {
  const [index, setIndex] = useState(0);

  const validPages = useMemo(
    () => pages.filter((p) => (p.Content || "").trim() !== ""),
    [pages]
  );

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

  const navButtonStyle = (enabled) => ({
    width: 60,
    height: 60,
    borderRadius: "50%",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    color: "#fff",
    background: "rgba(255,255,255,0.22)",
    cursor: enabled ? "pointer" : "default",
    opacity: enabled ? 1 : 0.3,
    transition: "background 0.15s, opacity 0.15s",
    backdropFilter: "blur(2px)",
  });

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={390}
      centered
      destroyOnClose
      styles={{
        body: { padding: 0 },
        content: { padding: 0, borderRadius: 20, overflow: "hidden", background: "transparent" },
      }}
    >
      <div
        style={{
          position: "relative",
          height: 720,
          background: "linear-gradient(160deg, #4a6d9c 0%, #5b85b8 45%, #7ba3cc 100%)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* 關閉 */}
        <button
          aria-label="關閉預覽"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 3,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            color: "#fff",
            fontSize: 20,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CloseOutlined />
        </button>

        {/* 底部波浪裝飾 */}
        <svg
          viewBox="0 0 390 120"
          preserveAspectRatio="none"
          style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 120, zIndex: 1 }}
        >
          <path d="M0,60 C100,20 180,90 390,40 L390,120 L0,120 Z" fill="rgba(255,255,255,0.07)" />
          <path d="M0,85 C120,50 200,105 390,70 L390,120 L0,120 Z" fill="rgba(255,255,255,0.05)" />
        </svg>

        {total === 0 ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
            <Empty
              description={<span style={{ color: "rgba(255,255,255,0.8)" }}>尚無內容可預覽</span>}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <>
            {/* 標題 + 頁數指示 */}
            <div style={{ paddingTop: 92, paddingLeft: 28, paddingRight: 28, zIndex: 2 }}>
              <div
                style={{
                  color: "#fff",
                  fontSize: 23,
                  fontWeight: 700,
                  textAlign: "center",
                  lineHeight: 1.4,
                  letterSpacing: "0.01em",
                }}
              >
                {title || "未命名文章"}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 22 }}>
                {validPages.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`第 ${i + 1} 頁`}
                    onClick={() => setIndex(i)}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      background: i === index ? "#fff" : "rgba(255,255,255,0.4)",
                      transition: "background 0.15s",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 內容 */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "34px 30px 20px",
                zIndex: 2,
              }}
            >
              <div
                className="article-preview-body article-preview-immersive"
                dangerouslySetInnerHTML={{ __html: currentHtml }}
              />
            </div>

            {/* 翻頁 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 34px 46px",
                zIndex: 2,
              }}
            >
              <button
                aria-label="上一頁"
                onClick={canPrev ? goPrev : undefined}
                disabled={!canPrev}
                style={navButtonStyle(canPrev)}
              >
                <LeftOutlined />
              </button>
              {canNext ? (
                <button aria-label="下一頁" onClick={goNext} style={navButtonStyle(true)}>
                  <RightOutlined />
                </button>
              ) : (
                // 最後一頁不再往下翻，改為結束閱讀
                <button
                  aria-label="結束冥想"
                  onClick={onClose}
                  style={{
                    height: 60,
                    padding: "0 28px",
                    borderRadius: 30,
                    border: "none",
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    color: "#fff",
                    background: "rgba(255,255,255,0.28)",
                    cursor: "pointer",
                    backdropFilter: "blur(2px)",
                    transition: "background 0.15s",
                  }}
                >
                  結束冥想
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

export default ArticlePreview;
