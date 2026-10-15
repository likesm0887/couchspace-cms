import React, { useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Button, Divider, Space, Tooltip, Modal, Input } from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  LinkOutlined,
  DisconnectOutlined,
  UndoOutlined,
  RedoOutlined,
  ClearOutlined,
} from "@ant-design/icons";

const line = "var(--cms-line)";
const panel = "var(--cms-panel)";
const ink = "var(--cms-ink)";

/**
 * 文章內容使用的富文本編輯器。
 * 輸出為 HTML 字串，標籤集由 TipTap schema 限定：
 * p / h2 / h3 / strong / em / u / s / ul / ol / li / blockquote / a / br / hr
 */
export const ARTICLE_EXTENSIONS = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    codeBlock: false,
    code: false,
  }),
  Underline,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Link.configure({ openOnClick: false, autolink: false }),
];

function ToolbarButton({ icon, title, active, disabled, onClick }) {
  return (
    <Tooltip title={title}>
      <Button
        size="small"
        type={active ? "primary" : "text"}
        icon={icon}
        disabled={disabled}
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
      />
    </Tooltip>
  );
}

function RichTextEditor({ value, onChange, placeholder = "請輸入此分頁的內容" }) {
  const editor = useEditor({
    extensions: [...ARTICLE_EXTENSIONS, Placeholder.configure({ placeholder })],
    content: value || "",
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      // TipTap 在完全清空時會回傳 <p></p>，統一視為空字串
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  // 外部 value 變動時（例如切換編輯中的文章）同步回編輯器
  useEffect(() => {
    if (!editor) return;
    const incoming = value || "";
    const current = editor.getHTML();
    const normalizedCurrent = current === "<p></p>" ? "" : current;
    if (incoming !== normalizedCurrent) {
      editor.commands.setContent(incoming, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  const handleSetLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href || "";
    let url = previous;
    Modal.confirm({
      title: "插入連結",
      content: (
        <Input
          defaultValue={previous}
          placeholder="https://example.com"
          onChange={(e) => {
            url = e.target.value;
          }}
        />
      ),
      okText: "確定",
      cancelText: "取消",
      onOk: () => {
        const trimmed = (url || "").trim();
        if (trimmed === "") {
          editor.chain().focus().extendMarkRange("link").unsetLink().run();
          return;
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
      },
    });
  }, [editor]);

  if (!editor) return null;

  return (
    <div style={{ border: `1px solid ${line}`, borderRadius: 6, overflow: "hidden", background: panel }}>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
          padding: "6px 8px",
          borderBottom: `1px solid ${line}`,
        }}
      >
        <ToolbarButton
          icon={<BoldOutlined />}
          title="粗體"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          icon={<ItalicOutlined />}
          title="斜體"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          icon={<UnderlineOutlined />}
          title="底線"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <ToolbarButton
          icon={<StrikethroughOutlined />}
          title="刪除線"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />

        <Divider type="vertical" style={{ margin: "0 4px" }} />

        <Tooltip title="大標題">
          <Button
            size="small"
            type={editor.isActive("heading", { level: 2 }) ? "primary" : "text"}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </Button>
        </Tooltip>
        <Tooltip title="小標題">
          <Button
            size="small"
            type={editor.isActive("heading", { level: 3 }) ? "primary" : "text"}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            H3
          </Button>
        </Tooltip>
        <Tooltip title="引言">
          <Button
            size="small"
            type={editor.isActive("blockquote") ? "primary" : "text"}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            引言
          </Button>
        </Tooltip>

        <Divider type="vertical" style={{ margin: "0 4px" }} />

        <ToolbarButton
          icon={<UnorderedListOutlined />}
          title="項目符號"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          icon={<OrderedListOutlined />}
          title="編號清單"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />

        <Divider type="vertical" style={{ margin: "0 4px" }} />

        <ToolbarButton
          icon={<AlignLeftOutlined />}
          title="靠左"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        />
        <ToolbarButton
          icon={<AlignCenterOutlined />}
          title="置中"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        />
        <ToolbarButton
          icon={<AlignRightOutlined />}
          title="靠右"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        />

        <Divider type="vertical" style={{ margin: "0 4px" }} />

        <ToolbarButton icon={<LinkOutlined />} title="插入連結" active={editor.isActive("link")} onClick={handleSetLink} />
        <ToolbarButton
          icon={<DisconnectOutlined />}
          title="移除連結"
          disabled={!editor.isActive("link")}
          onClick={() => editor.chain().focus().unsetLink().run()}
        />

        <Divider type="vertical" style={{ margin: "0 4px" }} />

        <ToolbarButton
          icon={<ClearOutlined />}
          title="清除格式"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        />

        <div style={{ flex: 1 }} />

        <Space size={2}>
          <ToolbarButton
            icon={<UndoOutlined />}
            title="復原"
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          />
          <ToolbarButton
            icon={<RedoOutlined />}
            title="重做"
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          />
        </Space>
      </div>

      {/* Editing surface */}
      <EditorContent
        editor={editor}
        className="article-editor-content"
        style={{ padding: "12px 14px", minHeight: 180, color: ink }}
      />
    </div>
  );
}

export default RichTextEditor;
