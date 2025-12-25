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
} from "antd";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  counselorService,
  meditationService,
} from "../../../service/ServicePool";

const Row = ({ children, ...props }) => {
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
};

const CounselorBanners = () => {
  const columns = [
    {
      key: "sort",
    },
    {
      title: "Banner圖片",
      dataIndex: "imageUrl",
      render: (image) => (
        <Image
          crossOrigin="anonymous"
          src={image}
          width="130px"
          preview={true}
        />
      ),
    },
    {
      title: "連結諮商師",
      dataIndex: "linkSourceID",
    },
    {
      title: "Seq",
      dataIndex: "seq",
    },
    {
      title: "刪除",
      dataIndex: "editBtn",
      key: "editBtn",
      render: (_, element) => (
        <Button
          icon={<DeleteFilled />}
          type="primary"
          onClick={(e) => {
            onBannerDelete(element);
          }}
        ></Button>
      ),
    },
  ];

  const [modal1Open, setModal1Open] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [previewBannerImage, setPreviewBannerImage] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [selectCourse, setSelectCourse] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [oriCommonData, setOriCommonData] = useState([]);
  const [counselors, setCounselors] = useState([]);

  // 優化：使用 useCallback 包裝數據獲取函數
  const fetchCounselors = useCallback(async () => {
    const counselorsData = await counselorService.getAllCounselorInfo(true);
    setCounselors(counselorsData);
    const courses = counselorsData.map((c) => ({
      label: c.UserName?.Name?.FirstName + c.UserName?.Name?.LastName,
      value: c.ID,
    }));
    setAllCourses(courses);
  }, []);

  const fetchCommonData = useCallback(async () => {
    const commonData = await meditationService.getCommonData();
    setOriCommonData(commonData);
    return commonData;
  }, []);

  // 優化：使用 useMemo 計算 dataSource
  const processedDataSource = useMemo(() => {
    if (!oriCommonData.CounselorBanners || !counselors.length) return [];

    return oriCommonData.CounselorBanners.map((e) => {
      const counselor = counselors.find((c) => c.ID === e.LinkSourceID);
      return {
        key: e.Seq,
        imageUrl: e.ImageUrl,
        linkSourceID: counselor?.UserName?.Name?.LastName + counselor?.UserName?.Name?.FirstName || '未知',
        seq: e.Seq,
      };
    });
  }, [oriCommonData.CounselorBanners, counselors]);

  // 更新 dataSource 當 processedDataSource 改變時
  useEffect(() => {
    setDataSource(processedDataSource);
  }, [processedDataSource]);

  const getData = useCallback(async () => {
    try {
      setLoading2(true);
      await Promise.all([fetchCounselors(), fetchCommonData()]);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading2(false);
    }
  }, [fetchCounselors, fetchCommonData]);

  useEffect(() => {
    getData();
  }, [getData]);

  // 優化：使用 useCallback 包裝刪除函數
  const onBannerDelete = useCallback(async (element) => {
    const selectIndex = oriCommonData.CounselorBanners?.findIndex(
      (o) => o.Seq === element.seq && o.ImageUrl === element.imageUrl
    );

    if (selectIndex === -1) return;

    const updatedBanners = [...oriCommonData.CounselorBanners];
    updatedBanners.splice(selectIndex, 1);

    // 重新排序
    const reorderedBanners = updatedBanners.map((banner, index) => ({
      ...banner,
      Seq: index + 1,
    }));

    const updatedCommonData = {
      ...oriCommonData,
      CounselorBanners: reorderedBanners,
    };

    setLoading2(true);
    try {
      await meditationService.updateCommonData(updatedCommonData);
      setOriCommonData(updatedCommonData);
    } catch (error) {
      console.error('Failed to delete banner:', error);
    } finally {
      setLoading2(false);
    }
  }, [oriCommonData]);

  // 優化：使用 useCallback 包裝拖拽結束函數
  const onDragEnd = useCallback(async ({ active, over }) => {
    if (active.id === over?.id) return;

    const activeIndex = dataSource.findIndex((i) => i.key === active.id);
    const overIndex = dataSource.findIndex((i) => i.key === over?.id);

    if (activeIndex === -1 || overIndex === -1) return;

    const reorderedData = arrayMove(dataSource, activeIndex, overIndex);

    // 更新本地狀態
    setDataSource(reorderedData);

    // 更新後端數據
    const updatedBanners = reorderedData.map((item, index) => {
      const originalBanner = oriCommonData.CounselorBanners?.find(
        (o) => o.Seq === item.seq && o.ImageUrl === item.imageUrl
      );
      return {
        Seq: index + 1,
        ImageUrl: originalBanner?.ImageUrl || item.imageUrl,
        LinkSourceID: originalBanner?.LinkSourceID,
      };
    });

    const updatedCommonData = {
      ...oriCommonData,
      CounselorBanners: updatedBanners,
    };

    setLoading2(true);
    try {
      await meditationService.updateCommonData(updatedCommonData);
      setOriCommonData(updatedCommonData);
    } catch (error) {
      console.error('Failed to update banner order:', error);
      // 如果更新失敗，恢復原始順序
      setDataSource(processedDataSource);
    } finally {
      setLoading2(false);
    }
  }, [dataSource, oriCommonData, processedDataSource]);

  // 優化：使用 useCallback 包裝提交函數
  const onFinish = useCallback(async () => {
    const imageUrl = form.getFieldValue("image");
    if (!imageUrl || !selectCourse) {
      return;
    }

    const newBanner = {
      Seq: (oriCommonData.CounselorBanners?.length || 0) + 1,
      ImageUrl: imageUrl,
      LinkSourceID: selectCourse,
    };

    const updatedCommonData = {
      ...oriCommonData,
      CounselorBanners: [...(oriCommonData.CounselorBanners || []), newBanner],
    };

    setLoading(true);
    try {
      await meditationService.updateCommonData(updatedCommonData);
      setOriCommonData(updatedCommonData);
      setModal1Open(false);
      form.resetFields();
      setSelectCourse(null);
      setPreviewBannerImage("");
    } catch (error) {
      console.error('Failed to add banner:', error);
    } finally {
      setLoading(false);
    }
  }, [form, selectCourse, oriCommonData]);

  // 優化：使用 useCallback 包裝重置函數
  const handleAddBanner = useCallback(() => {
    setModal1Open(true);
    setSelectCourse(null);
    form.resetFields();
    setPreviewBannerImage("");
  }, [form]);

  return (
    <div>
      <FloatButton
        shape="circle"
        type="primary"
        style={{ right: 94 }}
        onClick={handleAddBanner}
        tooltip={<div>Add Banner</div>}
        icon={<PlusCircleOutlined />}
      />
      <Spin size="large" spinning={loading2}>
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            items={dataSource?.map((i) => i.key)}
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
        title={"新增"}
        style={{
          top: 20,
        }}
        destroyOnClose={true}
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
            ></Image>
            <Form.Item name="image" label="圖片">
              <Input
                allowClear={true}
                placeholder="圖片"
                size="big"
                onChange={(e) => {
                  setPreviewBannerImage(e.target.value);
                }}
              />
            </Form.Item>
            <p></p>

            <Form.Item name="LinkSourceID" label="轉跳諮商師">
              <Space>
                <Select
                  onChange={(e) => {
                    setSelectCourse(e);
                  }}
                  placeholder="選擇轉跳諮商師"
                  options={allCourses}
                />
              </Space>
            </Form.Item>
            <p></p>
          </Form>
        </Spin>
        <div
          style={{
            position: "absolute",
            bottom: "5%",
          }}
        >
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
export default CounselorBanners;
