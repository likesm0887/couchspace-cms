import { MenuOutlined } from "@ant-design/icons";
import { esESIntl } from "@ant-design/pro-components";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteFilled,
  CustomerServiceOutlined,
} from "@ant-design/icons";

import {
  Table,
  Image,
  FloatButton,
  Space,
  Input,
  Select,
  Spin,
  Form,
  Button,
  Drawer,
  Carousel,
  Card,
} from "antd";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  counselorService,
  meditationService,
} from "../../../service/ServicePool";

const Row = React.memo(({ children, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });
  const style = {
    ...props.style,
    transform: CSS.Transform.toString(
      transform && {
        ...transform,
        scaleY: 1,
      }
    ),
    transition,
    ...(isDragging
      ? {
          position: "relative",
          zIndex: 9999,
        }
      : {}),
  };
  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if (child.key === "sort") {
          return React.cloneElement(child, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{
                  touchAction: "none",
                  cursor: "move",
                }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
});

const Banner = () => {
  const [modal1Open, setModal1Open] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [previewBannerImage, setPreviewBannerImage] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [allCounselor, setAllCounselor] = useState([]);
  const [allMusics, setAllMusics] = useState([]);
  const [selectCourse, setSelectCourse] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [oriCommonData, setOriCommonData] = useState([]);

  const [selectedType, setSelectedType] = useState(null);

  // 刪除函數需要在 render 函數之前定義
  const onBannerDelete = useCallback(async (e) => {
    if (!oriCommonData?.NewBanners) return;

    let select = oriCommonData.NewBanners.findIndex(
      (o) => o.Seq === e.seq && o.ImageUrl === e.imageUrl
    );
    if (select === -1) return;

    console.log(select);

    // 創建深拷貝避免直接修改狀態
    const updatedCommonData = JSON.parse(JSON.stringify(oriCommonData));
    updatedCommonData.NewBanners.splice(select, 1);

    // 重新排序
    updatedCommonData.NewBanners.forEach((item, index) => {
      item.Seq = index + 1;
    });

    setLoading2(true);
    try {
      await meditationService.updateCommonData(updatedCommonData);
      // 更新本地狀態
      setOriCommonData(updatedCommonData);
      // 重新加載數據
      const commonData = await meditationService.getCommonData();
      setOriCommonData(commonData);

      // 並發獲取所有相關數據
      const [allCourses, allMusics, allCounselor] = await Promise.all([
        meditationService.getAllCourse(),
        meditationService.getAllMusic(),
        counselorService.getAllCounselorInfo(),
      ]);

      // 建立映射以提高查詢效率
      const coursesMap = new Map(allCourses.map(c => [c.CourseID, c.CourseName]));
      const musicsMap = new Map(allMusics.map(m => [m.MusicID, m.Title]));
      const counselorsMap = new Map(allCounselor.map(c => [
        c.ID,
        `${c?.UserName?.Name?.LastName || ''}${c?.UserName?.Name?.FirstName || ''}`
      ]));

      // 高效處理banner數據
      const banner = commonData.NewBanners?.map((e) => {
        let linkSourceName = '';
        if (e.Type === "SERIES") {
          linkSourceName = coursesMap.get(e.LinkSourceID) || '';
        } else if (e.Type === "SINGLE_AUDIO") {
          linkSourceName = musicsMap.get(e.LinkSourceID) || '';
        } else if (e.Type === "CONSULTANT_PAGE") {
          linkSourceName = counselorsMap.get(e.LinkSourceID) || '';
        } else if (e.Type === "EXTERNAL_LINK") {
          linkSourceName = e.LinkSourceID;
        }

        return {
          key: e.Seq,
          imageUrl: e.ImageUrl,
          linkSourceID: linkSourceName,
          type: e.Type,
          seq: e.Seq,
        };
      }) || [];

      // 設置下拉選項
      setAllCourses(allCourses.map(c => ({
        label: c.CourseName,
        value: c.CourseID,
      })));
      setAllMusics(allMusics.map(m => ({
        label: m.Title,
        value: m.MusicID,
      })));
      setAllCounselor(allCounselor.map(c => ({
        label: `${c?.UserName?.Name?.LastName || ''}${c?.UserName?.Name?.FirstName || ''}`,
        value: c.ID,
      })));

      setDataSource(banner);
    } catch (error) {
      console.error('Error deleting banner:', error);
      // 失敗時重新加載數據
      try {
        const commonData = await meditationService.getCommonData();
        setOriCommonData(commonData);
        // 簡單重新加載，省略詳細的數據處理
        setDataSource(commonData.NewBanners?.map((e, index) => ({
          key: e.Seq,
          imageUrl: e.ImageUrl,
          linkSourceID: e.LinkSourceID,
          type: e.Type,
          seq: e.Seq,
        })) || []);
      } catch (fallbackError) {
        console.error('Error in fallback reload:', fallbackError);
      }
    } finally {
      setLoading2(false);
    }
  }, [oriCommonData]);

  // 優化 render 函數
  const renderImage = useCallback((image) => (
    <Image
      crossOrigin="anonymous"
      src={image}
      width="150px"
      preview={true}
      loading="lazy"
    />
  ), []);

  const renderType = useCallback((text) => {
    const typeMap = {
      EXTERNAL_LINK: "外部連結",
      SINGLE_AUDIO: "單首音檔",
      SERIES: "系列專輯",
      CONSULTANT_PAGE: "諮詢師介紹頁",
    };
    return typeMap[text] || text;
  }, []);

  const renderLinkContent = useCallback((text, record) => {
    if (record.type === "EXTERNAL_LINK") {
      return (
        <a
          href={record.linkSourceID}
          target="_blank"
          rel="noopener noreferrer"
        >
          {record.linkSourceID}
        </a>
      );
    }
    return text;
  }, []);

  const renderDeleteButton = useCallback((_, element) => (
    <Button
      icon={<DeleteFilled />}
      type="primary"
      onClick={() => onBannerDelete(element)}
    />
  ), [onBannerDelete]);

  // 優化 columns
  const columns = useMemo(() => [
    {
      key: "sort",
    },
    {
      title: "順序",
      dataIndex: "seq",
    },
    {
      title: "Banner圖片",
      dataIndex: "imageUrl",
      render: renderImage,
    },
    {
      title: "連結類型",
      dataIndex: "type",
      render: renderType,
    },
    {
      title: "連結內容",
      dataIndex: "linkSourceID",
      render: renderLinkContent,
    },
    {
      title: "刪除",
      dataIndex: "editBtn",
      key: "editBtn",
      render: renderDeleteButton,
    },
  ], [renderImage, renderType, renderLinkContent, renderDeleteButton]);

  useEffect(() => {
    getData();
  }, []);



  const getData = useCallback(async () => {
    const commonData = await meditationService.getCommonData();
    setOriCommonData(commonData);
    console.log(commonData.NewBanners.map((b) => b.LinkSourceID));

    // 並發獲取所有相關數據
    const [allCourses, allMusics, allCounselor] = await Promise.all([
      meditationService.getAllCourse(),
      meditationService.getAllMusic(),
      counselorService.getAllCounselorInfo(),
    ]);

    // 建立映射以提高查詢效率
    const coursesMap = new Map(allCourses.map(c => [c.CourseID, c.CourseName]));
    const musicsMap = new Map(allMusics.map(m => [m.MusicID, m.Title]));
    const counselorsMap = new Map(allCounselor.map(c => [
      c.ID,
      `${c?.UserName?.Name?.LastName || ''}${c?.UserName?.Name?.FirstName || ''}`
    ]));

    // 高效處理banner數據
    const banner = commonData.NewBanners?.map((e) => {
      let linkSourceName = '';
      if (e.Type === "SERIES") {
        linkSourceName = coursesMap.get(e.LinkSourceID) || '';
      } else if (e.Type === "SINGLE_AUDIO") {
        linkSourceName = musicsMap.get(e.LinkSourceID) || '';
      } else if (e.Type === "CONSULTANT_PAGE") {
        linkSourceName = counselorsMap.get(e.LinkSourceID) || '';
      } else if (e.Type === "EXTERNAL_LINK") {
        linkSourceName = e.LinkSourceID;
      }

      return {
        key: e.Seq,
        imageUrl: e.ImageUrl,
        linkSourceID: linkSourceName,
        type: e.Type,
        seq: e.Seq,
      };
    }) || [];

    // 設置下拉選項
    setAllCourses(allCourses.map(c => ({
      label: c.CourseName,
      value: c.CourseID,
    })));
    setAllMusics(allMusics.map(m => ({
      label: m.Title,
      value: m.MusicID,
    })));
    setAllCounselor(allCounselor.map(c => ({
      label: `${c?.UserName?.Name?.LastName || ''}${c?.UserName?.Name?.FirstName || ''}`,
      value: c.ID,
    })));

    console.log(commonData);
    setDataSource(banner);
  }, []);

  const onDragEnd = useCallback(async ({ active, over }) => {
    if (!oriCommonData?.NewBanners || active.id === over?.id) return;

    const activeIndex = dataSource.findIndex((i) => i.key === active.id);
    const overIndex = dataSource.findIndex((i) => i.key === over?.id);

    if (activeIndex === -1 || overIndex === -1) return;

    // 更新本地狀態
    const result = arrayMove(dataSource, activeIndex, overIndex);
    const updatedDataSource = result.map((item, index) => ({
      ...item,
      seq: index + 1,
      key: index + 1,
    }));

    // 更新後端數據
    const updatedBanners = updatedDataSource.map((item) => {
      const originalItem = oriCommonData.NewBanners.find(
        (o) => o.ImageUrl === item.imageUrl
      );
      return {
        Seq: item.seq,
        ImageUrl: originalItem?.ImageUrl,
        Type: originalItem?.Type,
        LinkSourceID: originalItem?.LinkSourceID,
      };
    });

    const updatedCommonData = {
      ...oriCommonData,
      NewBanners: updatedBanners,
    };

    // 先更新本地狀態
    setDataSource(updatedDataSource);
    setOriCommonData(updatedCommonData);

    try {
      setLoading2(true);
      await meditationService.updateCommonData(updatedCommonData);
    } catch (error) {
      console.error('Error updating banner order:', error);
      // 失敗時重新加載數據
      try {
        const commonData = await meditationService.getCommonData();
        setOriCommonData(commonData);
        setDataSource(commonData.NewBanners?.map((e, index) => ({
          key: e.Seq,
          imageUrl: e.ImageUrl,
          linkSourceID: e.LinkSourceID,
          type: e.Type,
          seq: e.Seq,
        })) || []);
      } catch (fallbackError) {
        console.error('Error in fallback reload:', fallbackError);
      }
    } finally {
      setLoading2(false);
    }
  }, [oriCommonData, dataSource]);

  const onFinish = useCallback(async () => {
    const image = form.getFieldValue("image");
    const linkSourceID = form.getFieldValue("LinkSourceID");

    console.log("image:", image);
    console.log("linkSourceID:", linkSourceID);

    if (!image || !linkSourceID || !oriCommonData?.NewBanners) {
      return;
    }

    // 創建深拷貝避免直接修改狀態
    const updatedCommonData = JSON.parse(JSON.stringify(oriCommonData));
    updatedCommonData.NewBanners.push({
      Seq: updatedCommonData.NewBanners.length + 1,
      Type: selectedType,
      ImageUrl: image,
      LinkSourceID: linkSourceID, // 確保 ID 存入
    });

    console.log(updatedCommonData);
    setLoading(true);
    try {
      await meditationService.updateCommonData(updatedCommonData);
      // 更新本地狀態
      setOriCommonData(updatedCommonData);
      setModal1Open(false);
      // 重新加載完整數據
      const commonData = await meditationService.getCommonData();
      setOriCommonData(commonData);

      // 並發獲取所有相關數據
      const [allCourses, allMusics, allCounselor] = await Promise.all([
        meditationService.getAllCourse(),
        meditationService.getAllMusic(),
        counselorService.getAllCounselorInfo(),
      ]);

      // 建立映射以提高查詢效率
      const coursesMap = new Map(allCourses.map(c => [c.CourseID, c.CourseName]));
      const musicsMap = new Map(allMusics.map(m => [m.MusicID, m.Title]));
      const counselorsMap = new Map(allCounselor.map(c => [
        c.ID,
        `${c?.UserName?.Name?.LastName || ''}${c?.UserName?.Name?.FirstName || ''}`
      ]));

      // 高效處理banner數據
      const banner = commonData.NewBanners?.map((e) => {
        let linkSourceName = '';
        if (e.Type === "SERIES") {
          linkSourceName = coursesMap.get(e.LinkSourceID) || '';
        } else if (e.Type === "SINGLE_AUDIO") {
          linkSourceName = musicsMap.get(e.LinkSourceID) || '';
        } else if (e.Type === "CONSULTANT_PAGE") {
          linkSourceName = counselorsMap.get(e.LinkSourceID) || '';
        } else if (e.Type === "EXTERNAL_LINK") {
          linkSourceName = e.LinkSourceID;
        }

        return {
          key: e.Seq,
          imageUrl: e.ImageUrl,
          linkSourceID: linkSourceName,
          type: e.Type,
          seq: e.Seq,
        };
      }) || [];

      // 設置下拉選項
      setAllCourses(allCourses.map(c => ({
        label: c.CourseName,
        value: c.CourseID,
      })));
      setAllMusics(allMusics.map(m => ({
        label: m.Title,
        value: m.MusicID,
      })));
      setAllCounselor(allCounselor.map(c => ({
        label: `${c?.UserName?.Name?.LastName || ''}${c?.UserName?.Name?.FirstName || ''}`,
        value: c.ID,
      })));

      setDataSource(banner);
    } catch (error) {
      console.error('Error adding banner:', error);
      // 失敗時重新加載數據
      try {
        const commonData = await meditationService.getCommonData();
        setOriCommonData(commonData);
        setDataSource(commonData.NewBanners?.map((e, index) => ({
          key: e.Seq,
          imageUrl: e.ImageUrl,
          linkSourceID: e.LinkSourceID,
          type: e.Type,
          seq: e.Seq,
        })) || []);
      } catch (fallbackError) {
        console.error('Error in fallback reload:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  }, [oriCommonData, selectedType]);
  const typeOptions = [
    { label: "外部連結", value: "EXTERNAL_LINK" },
    { label: "單首音檔", value: "SINGLE_AUDIO" },
    { label: "系列專輯", value: "SERIES" },
    { label: "諮詢師介紹頁", value: "CONSULTANT_PAGE" },
  ];

  return (
    <div>
      <FloatButton
        shape="circle"
        type="primary"
        style={{ right: 94 }}
        onClick={() => {
          setModal1Open(true);
          setSelectCourse(null);
          form.setFieldsValue({ LinkSourceID: undefined });
          form.setFieldValue("image", "");
          setPreviewBannerImage("");
        }}
        tooltip={<div>Add Banner</div>}
        icon={<PlusCircleOutlined />}
      />
      {dataSource.length > 0 && (
        <Card
          title="Banner Preview"
          style={{
            marginTop: 20,
            maxWidth: 600,
            margin: '20px auto',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            borderRadius: 8
          }}
          bodyStyle={{ padding: '16px' }}
        >
          <Carousel
            autoplay
            dots={true}
            style={{
              borderRadius: 6,
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {dataSource.map((banner) => (
              <div key={banner.key} style={{ position: 'relative' }}>
                <Image
                  crossOrigin="anonymous"
                  src={banner.imageUrl}
                  width="100%"
                  style={{
                    maxHeight: '120px',
                    objectFit: 'contain',
                    borderRadius: 6
                  }}
                  preview={false}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 8,
                  left: 8,
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: '12px'
                }}>
                  Banner {banner.seq}
                </div>
              </div>
            ))}
          </Carousel>
        </Card>
      )}
      <Spin size="large" spinning={loading2}>
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            // rowKey array
            items={dataSource.map((i) => i.key)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              components={{
                body: {
                  row: Row,
                },
              }}
              rowKey="key"
              columns={columns}
              dataSource={dataSource}
            />
          </SortableContext>
        </DndContext>
      </Spin>
      <Drawer
        title="新增"
        style={{ top: 20 }}
        destroyOnClose
        open={modal1Open}
        onClose={() => setModal1Open(false)}
        width={360}
        cancelText="取消"
        okText="確定"
        bodyStyle={{ paddingBottom: 50 }}
      >
        <Spin size="large" spinning={loading}>
          <Form form={form}>
            <p></p>
            <Image
              crossOrigin="anonymous"
              width="100px"
              src={previewBannerImage}
            />
            <Form.Item name="image" label="圖片">
              <Input
                allowClear
                placeholder="圖片"
                size="big"
                onChange={(e) => setPreviewBannerImage(e.target.value)}
              />
            </Form.Item>
            <p></p>

            {/* 類型選擇 */}
            <Form.Item name="type" label="類型">
              <Select
                showSearch
                placeholder="選擇類型"
                options={typeOptions}
                filterOption={(input, option) =>
                  option?.label?.toLowerCase().includes(input.toLowerCase())
                }
                onChange={(value) => {
                  setSelectedType(value);
                  form.setFieldsValue({ LinkSourceID: undefined }); // 清空之前的選擇
                }}
              />
            </Form.Item>
            <p></p>

            {/* 根據選擇的類型顯示對應的輸入欄位 */}
            {selectedType === "EXTERNAL_LINK" && (
              <Form.Item name="LinkSourceID" label="外部連結">
                <Input
                  placeholder="請輸入連結"
                  onChange={(e) =>
                    form.setFieldsValue({ LinkSourceID: e.target.value })
                  }
                />
              </Form.Item>
            )}
            {selectedType === "SINGLE_AUDIO" && (
              <Form.Item name="LinkSourceID" label="單首音檔">
                <Select
                  showSearch
                  placeholder="選擇單首音檔"
                  options={allMusics}
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={(value) =>
                    form.setFieldsValue({ LinkSourceID: value })
                  } // 存入 ID
                />
              </Form.Item>
            )}
            {selectedType === "CONSULTANT_PAGE" && (
              <Form.Item name="LinkSourceID" label="諮商師">
                <Select
                  showSearch
                  placeholder="選擇諮商師"
                  options={allCounselor}
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={(value) =>
                    form.setFieldsValue({ LinkSourceID: value })
                  } // 存入 ID
                />
              </Form.Item>
            )}
            {selectedType === "SERIES" && (
              <Form.Item name="LinkSourceID" label="轉跳系列">
                <Select
                  showSearch
                  placeholder="選擇轉跳系列"
                  options={allCourses}
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={(value) =>
                    form.setFieldsValue({ LinkSourceID: value })
                  } // 存入 ID
                />
              </Form.Item>
            )}
          </Form>
        </Spin>
        <div style={{ position: "absolute", bottom: "5%" }}>
          <Space>
            <Button onClick={onFinish} type="primary">
              確認
            </Button>
            <Button onClick={() => setModal1Open(false)} type="primary">
              取消
            </Button>
          </Space>
        </div>
      </Drawer>
    </div>
  );
};
export default React.memo(Banner);
