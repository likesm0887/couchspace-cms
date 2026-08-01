import { MenuOutlined, PlusOutlined, ReloadOutlined, DeleteFilled } from "@ant-design/icons";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Table, Image, Space, Input, Select, Spin, Form, Button, Drawer, Carousel } from "antd";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { counselorService, meditationService } from "../../../service/ServicePool";

/* ── Design tokens ── */
const bg = "var(--cms-bg)";
const panel = "var(--cms-panel)";
const line = "var(--cms-line)";
const line2 = "var(--cms-line2)";
const ink = "var(--cms-ink)";
const ink2 = "var(--cms-ink2)";
const muted = "var(--cms-muted)";

const bannerKey = "MeditationBanner";

/* ── Stat card ── */
function StatCard({ label, value, unit, note, last }) {
  return (
    <div style={{ flex: 1, padding: "16px 20px", borderRight: last ? "none" : `1px solid ${line}` }}>
      <div style={{ fontSize: 11, color: muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 22, fontWeight: 600, color: ink }}>
        {value}{unit && <span style={{ fontSize: 13, color: muted, fontWeight: 400, marginLeft: 3 }}>{unit}</span>}
      </div>
      {note && <div style={{ marginTop: 4, fontSize: 12, color: muted }}>{note}</div>}
    </div>
  );
}

/* ── Drag-sortable row ── */
const Row = React.memo(({ children, ...props }) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: props["data-row-key"] });
  const style = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };
  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if (child.key === "sort") {
          return React.cloneElement(child, {
            children: <MenuOutlined ref={setActivatorNodeRef} style={{ touchAction: "none", cursor: "move", color: muted }} {...listeners} />,
          });
        }
        return child;
      })}
    </tr>
  );
});

const typeMap = { EXTERNAL_LINK: "外部連結", SINGLE_AUDIO: "單首音檔", SERIES: "系列專輯", CONSULTANT_PAGE: "諮詢師介紹頁" };
const typeOptions = [
  { label: "外部連結", value: "EXTERNAL_LINK" },
  { label: "單首音檔", value: "SINGLE_AUDIO" },
  { label: "系列專輯", value: "SERIES" },
  { label: "諮詢師介紹頁", value: "CONSULTANT_PAGE" },
];

const RelaxBanner = () => {
  const [modal1Open, setModal1Open] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [previewBannerImage, setPreviewBannerImage] = useState("");
  const [allCourses, setAllCourses] = useState([]);
  const [allCounselor, setAllCounselor] = useState([]);
  const [allMusics, setAllMusics] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [oriCommonData, setOriCommonData] = useState({});
  const [selectedType, setSelectedType] = useState("EXTERNAL_LINK");

  const normalizeCommonData = useCallback((commonData) => ({
    ...commonData,
    [bannerKey]: Array.isArray(commonData?.[bannerKey]) ? commonData[bannerKey] : [],
  }), []);

  const processData = useCallback(async (commonData) => {
    const normalized = normalizeCommonData(commonData);
    const [courses, musics, counselors] = await Promise.all([
      meditationService.getAllCourse(),
      meditationService.getAllMusic(),
      counselorService.getAllCounselorInfo(),
    ]);
    const coursesMap = new Map(courses.map(c => [c.CourseID, c.CourseName]));
    const musicsMap = new Map(musics.map(m => [m.MusicID, m.Title]));
    const counselorsMap = new Map(counselors.map(c => [c.ID, `${c?.UserName?.Name?.LastName || ""}${c?.UserName?.Name?.FirstName || ""}`]));
    const banner = normalized[bannerKey]?.map((e) => {
      let linkSourceName = "";
      if (e.Type === "SERIES") linkSourceName = coursesMap.get(e.LinkSourceID) || "";
      else if (e.Type === "SINGLE_AUDIO") linkSourceName = musicsMap.get(e.LinkSourceID) || "";
      else if (e.Type === "CONSULTANT_PAGE") linkSourceName = counselorsMap.get(e.LinkSourceID) || "";
      else if (e.Type === "EXTERNAL_LINK") linkSourceName = e.LinkSourceID;
      return { key: e.Seq, imageUrl: e.ImageUrl, linkSourceID: linkSourceName, type: e.Type, seq: e.Seq };
    }) || [];
    setAllCourses(courses.map(c => ({ label: c.CourseName, value: c.CourseID })));
    setAllMusics(musics.map(m => ({ label: m.Title, value: m.MusicID })));
    setAllCounselor(counselors.map(c => ({ label: `${c?.UserName?.Name?.LastName || ""}${c?.UserName?.Name?.FirstName || ""}`, value: c.ID })));
    setOriCommonData(normalized);
    setDataSource(banner);
  }, [normalizeCommonData]);

  const getData = useCallback(async () => {
    setLoading2(true);
    try {
      const commonData = await meditationService.getCommonData();
      await processData(commonData);
    } catch (e) { console.error(e); } finally { setLoading2(false); }
  }, [processData]);

  useEffect(() => { getData(); }, []);

  const onBannerDelete = useCallback(async (e) => {
    const currentBanners = Array.isArray(oriCommonData?.[bannerKey]) ? oriCommonData[bannerKey] : [];
    if (!currentBanners.length) return;
    const idx = currentBanners.findIndex(o => o.Seq === e.seq && o.ImageUrl === e.imageUrl);
    if (idx === -1) return;
    const updated = JSON.parse(JSON.stringify(oriCommonData));
    updated[bannerKey].splice(idx, 1);
    updated[bannerKey].forEach((item, i) => { item.Seq = i + 1; });
    setLoading2(true);
    try {
      await meditationService.updateCommonData(updated);
      await getData();
    } catch (e) { console.error(e); } finally { setLoading2(false); }
  }, [oriCommonData, getData]);

  const onDragEnd = useCallback(async ({ active, over }) => {
    const currentBanners = Array.isArray(oriCommonData?.[bannerKey]) ? oriCommonData[bannerKey] : [];
    if (!currentBanners.length || active.id === over?.id) return;
    const ai = dataSource.findIndex(i => i.key === active.id);
    const oi = dataSource.findIndex(i => i.key === over?.id);
    if (ai === -1 || oi === -1) return;
    const result = arrayMove(dataSource, ai, oi).map((item, i) => ({ ...item, seq: i + 1, key: i + 1 }));
    const updatedBanners = result.map(item => {
      const orig = currentBanners.find(o => o.ImageUrl === item.imageUrl);
      return { Seq: item.seq, ImageUrl: orig?.ImageUrl, Type: orig?.Type, LinkSourceID: orig?.LinkSourceID };
    });
    const updatedCommonData = { ...oriCommonData, [bannerKey]: updatedBanners };
    setDataSource(result);
    setOriCommonData(updatedCommonData);
    setLoading2(true);
    try { await meditationService.updateCommonData(updatedCommonData); }
    catch (e) { console.error(e); await getData(); }
    finally { setLoading2(false); }
  }, [oriCommonData, dataSource, getData]);

  const onFinish = useCallback(async () => {
    const image = form.getFieldValue("image");
    const linkSourceID = form.getFieldValue("LinkSourceID");
    const currentBanners = Array.isArray(oriCommonData?.[bannerKey]) ? oriCommonData[bannerKey] : [];
    if (!image || !linkSourceID || !selectedType) return;
    const updated = JSON.parse(JSON.stringify(oriCommonData || {}));
    updated[bannerKey] = [...currentBanners, { Seq: currentBanners.length + 1, Type: selectedType, ImageUrl: image, LinkSourceID: linkSourceID }];
    setLoading(true);
    try {
      await meditationService.updateCommonData(updated);
      setModal1Open(false);
      await getData();
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [oriCommonData, selectedType, getData, form]);

  const columns = useMemo(() => [
    { key: "sort" },
    { title: "順序", dataIndex: "seq", width: 80 },
    { title: "Banner圖片", dataIndex: "imageUrl", render: (img) => <Image crossOrigin="anonymous" src={img} width="150px" preview loading="lazy" /> },
    { title: "連結類型", dataIndex: "type", render: (t) => typeMap[t] || t },
    {
      title: "連結內容", dataIndex: "linkSourceID",
      render: (text, record) => record.type === "EXTERNAL_LINK"
        ? <a href={record.linkSourceID} target="_blank" rel="noopener noreferrer">{record.linkSourceID}</a>
        : text,
    },
    { title: "刪除", key: "del", render: (_, el) => <Button icon={<DeleteFilled />} danger onClick={() => onBannerDelete(el)} /> },
  ], [onBannerDelete]);

  return (
    <>
      <div style={{ background: bg, minHeight: "100vh", padding: "28px 32px 64px" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 6px", color: ink, letterSpacing: "-0.01em" }}>放鬆 Banner</h1>
            <p style={{ margin: 0, fontSize: 13.5, color: muted }}>管理放鬆專區 Banner 圖片與連結，可拖拉調整顯示順序。</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button icon={<ReloadOutlined />} onClick={getData}>重新載入</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
              setModal1Open(true); form.resetFields();
              setPreviewBannerImage(""); setSelectedType("EXTERNAL_LINK");
              form.setFieldsValue({ type: "EXTERNAL_LINK" });
            }}>
              新增 Banner
            </Button>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: "flex", background: panel, border: `1px solid ${line}`, borderRadius: 10, marginBottom: 20, overflow: "hidden" }}>
          <StatCard label="Banner 總數" value={dataSource.length} note="目前所有 Banner" />
          <StatCard label="連結類型數" value={new Set(dataSource.map(d => d.type)).size} note="不同類型數量" />
          <StatCard label="外部連結" value={dataSource.filter(d => d.type === "EXTERNAL_LINK").length} note="EXTERNAL_LINK" />
          <StatCard label="系列 / 音檔" value={dataSource.filter(d => d.type === "SERIES" || d.type === "SINGLE_AUDIO").length} note="SERIES + SINGLE_AUDIO" last />
        </div>

        {/* Carousel preview */}
        {dataSource.length > 0 && (
          <div style={{ background: panel, border: `1px solid ${line}`, borderRadius: 10, padding: "16px 20px", marginBottom: 20, maxWidth: 600 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: ink2, marginBottom: 12 }}>預覽</div>
            <Carousel autoplay dots style={{ borderRadius: 6, overflow: "hidden" }}>
              {dataSource.map((banner) => (
                <div key={banner.key} style={{ position: "relative" }}>
                  <Image crossOrigin="anonymous" src={banner.imageUrl} width="100%" style={{ maxHeight: "120px", objectFit: "contain", borderRadius: 6 }} preview={false} />
                  <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.6)", color: "white", padding: "4px 8px", borderRadius: 4, fontSize: "12px" }}>
                    Banner {banner.seq}
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {/* Main card */}
        <div style={{ background: panel, border: `1px solid ${line}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${line2}` }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: ink }}>Banner 清單</div>
            <div style={{ fontSize: 12.5, color: muted, marginTop: 2 }}>拖拉 ≡ 圖示可調整順序，排序即時儲存</div>
          </div>
          <Spin spinning={loading2}>
            <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
              <SortableContext items={dataSource.map(i => i.key)} strategy={verticalListSortingStrategy}>
                <Table components={{ body: { row: Row } }} rowKey="key" columns={columns} dataSource={dataSource} />
              </SortableContext>
            </DndContext>
          </Spin>
        </div>
      </div>

      <Drawer title="新增放鬆 Banner" style={{ top: 20 }} destroyOnClose forceRender open={modal1Open}
        onClose={() => setModal1Open(false)} width={360} bodyStyle={{ paddingBottom: 50, minHeight: 300 }} zIndex={4000}>
        <Spin size="large" spinning={loading}>
          <Form form={form} initialValues={{ type: "EXTERNAL_LINK" }}>
            <Image crossOrigin="anonymous" width="100px" src={previewBannerImage} style={{ marginBottom: 12 }} />
            <Form.Item name="image" label="圖片">
              <Input allowClear placeholder="圖片 URL" onChange={(e) => setPreviewBannerImage(e.target.value)} />
            </Form.Item>
            <Form.Item name="type" label="類型">
              <Select showSearch placeholder="選擇類型" options={typeOptions}
                filterOption={(input, opt) => opt?.label?.toLowerCase().includes(input.toLowerCase())}
                onChange={(v) => { setSelectedType(v); form.setFieldsValue({ LinkSourceID: undefined }); }} />
            </Form.Item>
            {selectedType === "EXTERNAL_LINK" && <Form.Item name="LinkSourceID" label="外部連結"><Input placeholder="請輸入連結" onChange={(e) => form.setFieldsValue({ LinkSourceID: e.target.value })} /></Form.Item>}
            {selectedType === "SINGLE_AUDIO" && <Form.Item name="LinkSourceID" label="單首音檔"><Select showSearch placeholder="選擇單首音檔" options={allMusics} filterOption={(input, opt) => opt?.label?.toLowerCase().includes(input.toLowerCase())} onChange={(v) => form.setFieldsValue({ LinkSourceID: v })} /></Form.Item>}
            {selectedType === "CONSULTANT_PAGE" && <Form.Item name="LinkSourceID" label="諮商師"><Select showSearch placeholder="選擇諮商師" options={allCounselor} filterOption={(input, opt) => opt?.label?.toLowerCase().includes(input.toLowerCase())} onChange={(v) => form.setFieldsValue({ LinkSourceID: v })} /></Form.Item>}
            {selectedType === "SERIES" && <Form.Item name="LinkSourceID" label="轉跳系列"><Select showSearch placeholder="選擇轉跳系列" options={allCourses} filterOption={(input, opt) => opt?.label?.toLowerCase().includes(input.toLowerCase())} onChange={(v) => form.setFieldsValue({ LinkSourceID: v })} /></Form.Item>}
          </Form>
        </Spin>
        <div style={{ position: "absolute", bottom: "5%" }}>
          <Space>
            <Button onClick={onFinish} type="primary">確認</Button>
            <Button onClick={() => setModal1Open(false)}>取消</Button>
          </Space>
        </div>
      </Drawer>
    </>
  );
};

export default React.memo(RelaxBanner);
