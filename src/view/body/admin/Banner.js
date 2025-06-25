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
import React, { useState, useEffect } from "react";
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

const Banner = () => {
  const columns = [
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
      render: (image) => (
        <Image
          crossOrigin="anonymous"
          src={image}
          width="70px"
          preview={false}
        />
      ),
    },
    {
      title: "連結類型",
      dataIndex: "type",
      render: (text) => {
        const typeMap = {
          EXTERNAL_LINK: "外部連結",
          SINGLE_AUDIO: "單首音檔",
          SERIES: "系列專輯",
          CONSULTANT_PAGE: "諮詢師介紹頁",
        };
        return typeMap[text] || text;
      },
    },
    {
      title: "連結內容",
      dataIndex: "linkSourceID",
      render: (text, record) => {
        console.log(record);
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
      },
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
  const [allCounselor, setAllCounselor] = useState([]);
  const [allMusics, setAllMusics] = useState([]);
  const [selectCourse, setSelectCourse] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [oriCommonData, setOriCommonData] = useState([]);

  const [selectedType, setSelectedType] = useState(null);
  useEffect(() => {
    getData();
  }, []);

  const onBannerDelete = async (e) => {
    let select = oriCommonData.NewBanners.findIndex(
      (o) => o.Seq === e.seq && o.ImageUrl === e.imageUrl
    );
    console.log(select);
    oriCommonData.NewBanners.splice(select, 1);
    for (let index = 0; index < oriCommonData.NewBanners.length; index++) {
      oriCommonData.NewBanners[index].Seq = index + 1;
    }
    setLoading2(true);
    await meditationService.updateCommonData(oriCommonData);
    getData();
    setLoading2(false);
  };

  const getSourceName = async (bannerItem) => {
    if (bannerItem.Type === "SERIES") {
      // 查詢單筆課程資料（假設 batchQueryCourses 回傳陣列）
      const courses = await meditationService.batchQueryCourses({
        ids: [bannerItem.LinkSourceID],
      });
      return courses?.[0]?.CourseName || "";
    }

    if (bannerItem.Type === "SINGLE_AUDIO") {
      // 查詢單筆音檔資料
      const musicList = await meditationService.batchQueryMusic({
        ids: [bannerItem.LinkSourceID],
      });
      return musicList?.[0]?.Title || "";
    }

    if (bannerItem.Type === "CONSULTANT_PAGE") {
      // 取得諮詢師資料
      const counselor = await counselorService.getCounselorInfoById(
        bannerItem.LinkSourceID
      );
      console.log(counselor);
      return (
        counselor?.UserName?.Name.LastName +
          counselor?.UserName?.Name.FirstName || ""
      );
    }

    if (bannerItem.Type === "EXTERNAL_LINK") {
      return bannerItem.LinkSourceID;
    }

    return "";
  };

  const getData = async () => {
    const commonData = await meditationService.getCommonData();
    setOriCommonData(commonData);
    console.log(commonData.NewBanners.map((b) => b.LinkSourceID));

    // 使用 Promise.all 等待所有非同步取得結果
    const banner = await Promise.all(
      commonData.NewBanners.map(async (e) => {
        return {
          key: e.Seq,
          imageUrl: e.ImageUrl,
          // 注意：await 取得每個 banner 的 linkSourceID
          linkSourceID: await getSourceName(e),
          type: e.Type,
          seq: e.Seq,
        };
      })
    );

    const allCourses = await meditationService.getAllCourse();
    const allMusics = await meditationService.getAllMusic();
    const allCounselor = await counselorService.getAllCounselorInfo();
    console.log(allCourses);
    setAllMusics(
      allMusics.map((c) => ({
        label: c.Title,
        value: c.MusicID,
      }))
    );
    setAllCourses(
      allCourses.map((c) => ({
        label: c.CourseName,
        value: c.CourseID,
      }))
    );
    setAllCounselor(
      allCounselor.map((c) => ({
        label: c?.UserName?.Name.LastName + c?.UserName?.Name.FirstName,
        value: c.ID,
      }))
    );
    console.log(
      allCourses.map((c) => ({
        label: c.CourseName,
        value: c.CourseID,
      }))
    );

    console.log(commonData);
    setDataSource(banner);
  };

  const onDragEnd = async ({ active, over }) => {
    console.log(oriCommonData);
    let toChangeCommonData = [];
    if (active.id !== over?.id) {
      setDataSource((previous) => {
        const activeIndex = previous.findIndex((i) => i.key === active.id);
        const overIndex = previous.findIndex((i) => i.key === over?.id);
        let result = arrayMove(previous, activeIndex, overIndex);

        for (let index = 0; index < result.length; index++) {
          console.log(oriCommonData);
          let select = oriCommonData.NewBanners.find(
            (o) =>
              o.Seq === result[index].seq &&
              o.ImageUrl === result[index].imageUrl
          );
          console.log(select);
          toChangeCommonData.push({
            Seq: index + 1,
            Type: select.Type,
            ImageUrl: select.ImageUrl,
            LinkSourceID: select.LinkSourceID,
          });
          console.log(toChangeCommonData);
        }
        oriCommonData.NewBanners = toChangeCommonData;
        return result;
      });
      setLoading2(true);
      await meditationService.updateCommonData(oriCommonData);

      console.log(oriCommonData);
      getData();
      setLoading2(false);
    }
  };

  const onFinish = async () => {
    const image = form.getFieldValue("image");
    const linkSourceID = form.getFieldValue("LinkSourceID");

    console.log("image:", image);
    console.log("linkSourceID:", linkSourceID);

    if (!image || !linkSourceID) {
      return;
    }

    oriCommonData.NewBanners.push({
      Seq: oriCommonData.NewBanners.length + 1,
      Type: selectedType,
      ImageUrl: image,
      LinkSourceID: linkSourceID, // 確保 ID 存入
    });

    console.log(oriCommonData);
    setLoading(true);
    await meditationService.updateCommonData(oriCommonData);
    setModal1Open(false);
    getData();
    setLoading(false);
  };
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
export default Banner;
