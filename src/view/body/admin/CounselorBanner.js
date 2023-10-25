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
import { counselorService, meditationService } from "../../../service/ServicePool";

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

const CounselorBanners= () => {
  const columns = [
    {
      key: "sort",
    },
    {
      title: "Banner圖片",
      dataIndex: "imageUrl",
      render: (image) => <Image src={image} width="70px" preview={false} />,
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
  useEffect(() => {
    getData();
  }, []);
  const onBannerDelete = async (e) => {
    let select = oriCommonData.CounselorBanners?.findIndex(
      (o) => o.Seq === e.seq && o.ImageUrl === e.imageUrl
    );
    console.log(select);
    oriCommonData.CounselorBanners?.splice(select, 1);
    for (let index = 0; index < oriCommonData.CounselorBanners?.length; index++) {
        oriCommonData.CounselorBanners[index].Seq=index+1
    }
    setLoading2(true)
    await meditationService.updateCommonData(oriCommonData);
    getData();
    setLoading2(false)
  };
  const getData = async () => {
    let commonData = await meditationService.getCommonData();
    setOriCommonData(commonData);
    console.log(commonData?.CounselorBanners?.map((b) => b.LinkSourceID));
    let counselors = await counselorService.getAllCounselorInfo();
    console.log(counselors)
    let banner = commonData.CounselorBanners?.map((e) => {
      let counselor = counselors?.find((c) => c.ID === e.LinkSourceID);
      return {
        key: e.Seq,
        imageUrl: e.ImageUrl,
        linkSourceID: counselor?.UserName?.Name?.LastName + counselor?.UserName?.Name?.FirstName,
        seq: e.Seq,
      };
    });
    const allCounselors = await counselorService.getAllCounselorInfo(true);

    setAllCourses(
        allCounselors.map((c) => {
        return {
            label: c.UserName?.Name?.FirstName + c.UserName?.Name.LastName,
            value: c.ID,
        };
      })
    );
    console.log(
        allCounselors.map((c) => {
        return {
          label: c.UserName?.Name?.FirstName + c.UserName?.Name.LastName,
          value: c.ID,
        };
      })
    );

    console.log(oriCommonData);
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
          let select = oriCommonData.CounselorBanners?.find(
            (o) =>
              o.Seq === result[index].seq &&
              o.ImageUrl === result[index].imageUrl
          );
          console.log(select);
          toChangeCommonData.push({
            Seq: index + 1,
            ImageUrl: select.ImageUrl,
            LinkSourceID: select.LinkSourceID,
          });
          console.log(toChangeCommonData);
        }
        oriCommonData.CounselorBanners = toChangeCommonData
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
    console.log(form.getFieldValue("image"));
    console.log(selectCourse);
    if (form.getFieldValue("image") === "" || selectCourse === undefined) {
      return;
    }
    oriCommonData.CounselorBanners?.push({
      Seq: oriCommonData.CounselorBanners?.length + 1,
      ImageUrl: form.getFieldValue("image"),
      LinkSourceID: selectCourse,
    });

    console.log(oriCommonData);
    setLoading(true);
    await meditationService.updateCommonData(oriCommonData);
    setModal1Open(false);
    getData();
    setLoading(false);
  };
  return (
    <div>
      <FloatButton
        shape="circle"
        type="primary"
        style={{ right: 94 }}
        onClick={() => {
          setModal1Open(true);
          setSelectCourse(null);
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
        //onOk={() => onFinish()}
        onClose={() => setModal1Open(false)}
        width={360}
        cancelText="取消"
        okText="確定"
        bodyStyle={{ paddingBottom: 50 }}
      >
        <Spin size="large" spinning={loading}>
          <Form form={form}>
            <p></p>
            <Image width="100px" src={previewBannerImage}></Image>
            <Form.Item name="image" label="圖片">
              <Input
                allowClear={true}
                placeholder="圖片"
                size="big"
                onChange={(e) => {
                  console.log(e.target.value);
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
