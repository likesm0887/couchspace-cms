import React, { Children, useEffect, useState, useCallback, useMemo } from "react";
import {
  message,
  Space,
  Table,
  Input,
  Select,
  Image,
  Dropdown,
  Tag,
  Form,
  Tooltip,
  Rate,
  List,
  Button,
  Avatar,
  FloatButton,
  Modal,
  Menu,
  Spin,
  Alert,
  Drawer,
} from "antd";
import { CopyOutlined, SearchOutlined } from "@ant-design/icons";
import AdminHeader from "./AdminHeader";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { DndContext } from "@dnd-kit/core";
import { MenuOutlined } from "@ant-design/icons";
import { CSS } from "@dnd-kit/utilities";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  PlusCircleOutlined,
  EditOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import { meditationService } from "../../../service/ServicePool";
import ReactAudioPlayer from "react-audio-player";
import moment from "moment";
const { TextArea } = Input;
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
function Course() {
  const [data, setData] = useState([]);
  const [modal1Open, setModal1Open] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [course, setCourse] = useState(false);
  const [allOption, setAllOption] = useState([]);
  const [allMusics, setAllMusics] = useState([]);
  const [allTeacherOption, setAllTeacherOption] = useState([]);
  const options = [];
  const [currentModel, setCurrentModel] = useState("New");
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
  }, []);

  const handleReset = useCallback((clearFilters) => {
    clearFilters();
  }, []);

  const getColumnSearchProps = useCallback(
    (dataIndex) => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
            >
              Search
            </Button>
            <Button onClick={() => handleReset(clearFilters)} size="small">
              Reset
            </Button>
          </Space>
        </div>
      ),
    }),
    [handleSearch, handleReset]
  );
  const columns = useMemo(
    () => [
      {
        title: "編輯",
        dataIndex: "editBtn",
        key: "editBtn",
        render: (_, element) => (
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => openEdit(element)}
          ></Button>
        ),
      },

      {
        title: "圖片",
        dataIndex: "image",
        key: "image",
        render: (image) => (
          <Image crossOrigin="anonymous" src={image} width="70px" />
        ),
      },
      {
        title: "Index",
        dataIndex: "Index",
        key: "Index",
      },
      {
        title: "系列ID",
        dataIndex: "CourseID",
        key: "CourseID",
        render: (text, record) => (
          <div>
            <Tooltip title={text}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <a style={{ color: "#1677FF", marginRight: 8 }}>
                  {text?.slice(-5)}
                </a>
                <Button
                  type="link"
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(record.CourseID)}
                />
              </div>
            </Tooltip>
          </div>
        ),
      },
      {
        title: "名稱",
        dataIndex: "courseName",
        key: "courseName",
        ...getColumnSearchProps("courseName"),
        onFilter: (value, record) => record.courseName.toLowerCase().includes(value.toLowerCase()),
      },
      {
        title: "導師",
        dataIndex: "teacherName",
        key: "teacherName",
        ...getColumnSearchProps("teacherName"),
        onFilter: (value, record) => record.teacherName.toLowerCase().includes(value.toLowerCase()),
      },
      {
        title: "分類",
        dataIndex: "series",
        key: "series",
        render: (_, { tags }) => (
          <>
            {["主題", "技巧"]?.map((tag) => {
              let color = tag.length > 5 ? "geekblue" : "green";
              if (tag === "主題") {
                color = "volcano";
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </>
        ),
      },
      {
        title: "Tags",
        dataIndex: "tags",
        key: "tags",
        render: (_, { tags }) => (
          <>
            {tags?.map((tag) => {
              let color = tag.length > 5 ? "geekblue" : "green";
              if (tag === "主題") {
                color = "volcano";
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </>
        ),
      },
      {
        title: "系列介紹",
        dataIndex: "description",
        key: "description",
        ...getColumnSearchProps("description"),
        onFilter: (value, record) => record.description.toLowerCase().includes(value.toLowerCase()),
      },
      {
        title: "新增日期",
        dataIndex: "createDate",
        key: "createDate",
        sorter: (a, b) => new Date(a.createDate) - new Date(b.createDate),
      },
    ],
    [getColumnSearchProps]
  );
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success("Copied to clipboard!");
      })
      .catch((err) => {
        message.error("Failed to copy!");
      });
  };
  const onChangeMusic = (values) => {
    console.log(values);
    form.setFieldsValue({ musics: values });
  };
  const openEdit = (e) => {
    console.log(e);
    setCurrentModel("Edit");

    setCourse({
      key: e.key,
      courseId: e.courseId,
      courseName: e.courseName,
      image: e.image,
      series: ["nice", "developer"],
      tags: e.tags,
      description: e.description,
      musicIDs: e.musicIDs,
      child: e.musics,
      display: e.display,
      teacherID: e.teacherId,
      Index: e.Index,
    });
    getDefaultMusic();
    form.setFieldValue("name", e.courseName);
    form.setFieldValue("image", e.image);
    form.setFieldValue("description", e.description);
    form.setFieldValue("Index", e.Index);
    form.setFieldValue("teacherId", e.teacherId);
    console.log(course);
    setModal1Open(true);
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    const res = await meditationService.getAllCourse();
    const allMusics = await meditationService.getAllMusic();
    const allTeachers = await meditationService.getAllTeacher();
    const teacherMap = new Map(allTeachers.map(t => [t.TeacherId, t]));
    createOptions(allMusics);
    setAllMusics(allMusics);
    setAllTeacherOption(allTeachers.map(t => ({ value: t.TeacherId, label: t.Name })));
    const result = [];
    for (let i = 0; i < res.length; i++) {
      //const musics = allMusics.filter(e=>res[i]?.MusicIDs?.includes(e));
      const musics = allMusics.filter((elementB) =>
        res[i]?.MusicIDs?.some((elementA) => elementA.id === elementB.id)
      );
      //const musics = await fetchMusic(res[i].MusicIDs);
      res[i].Musics = [];

      if (musics != null) {
        res[i].Musics.push(...musics);
      }
      console.log(res[i].TeacherID);
      var teacher = null;
      if (res[i].TeacherID != "") {
        console.log(res[i].TeacherID);
        teacher = teacherMap.get(res[i].TeacherID);
        console.log(teacher.Name);
        console.log(res[i]);
      }

      result.push({
        CourseID: res[i].CourseID,
        key: res[i].CourseID,
        Seq: res[i].Seq,
        Index: res[i].Index,
        courseName: res[i].CourseName,
        image: res[i].Image,
        series: ["nice", "developer"],
        tags: res[i]?.Tags,
        description: res[i].Description,
        musicIDs: res[i].MusicIDs,
        teacherName: teacher === null ? "" : teacher.Name,
        teacherId: teacher === null ? "" : teacher.TeacherId,
        child: res[i].Musics,
        display: res[i].Display,
        createDate: res[i].CreateDate,
      });
    }

    setData(result);
    setLoading(false);
  };

  const openModal = (e) => {
    setCurrentModel("New");
    setCourse({});
    form.setFieldValue("image", "");
    form.setFieldValue("index", "");
    form.setFieldValue("name", "");
    form.setFieldValue("description", "");
    form.setFieldValue("Index", 0);
    setModal1Open(true);
  };
  const onFinish = () => {
    if (currentModel === "New") {
      const input = form.getFieldsValue();
      meditationService
        .createCourse({
          CourseName: form.getFieldValue("name"),
          Image: form.getFieldValue("image"),
          Index: Number(form.getFieldValue("Index")),
          Description: form.getFieldValue("description"),
          Display: form.getFieldValue("display"),
          TeacherID: form.getFieldValue("teacherId"),
          Tags: ["幫助睡眠", "正念", "紓解壓力"],
        })
        .then((e) => {
          console.log(e);
          meditationService
            .addMusicInCourse({
              CourseId: e,
              MusicIds: form.getFieldValue("musics"),
            })
            .then((e) => {
              messageApi.open({
                type: "success",
                content: "新增成功",
              });
              getData().then((e) => e);
              setModal1Open(false);
            })
            .catch((e) => {
              messageApi.open({
                type: "fail",
                content: "Oops 出現一點小錯誤",
              });
            });

          setModal1Open(false);
        })
        .catch((e) => {
          messageApi.open({
            type: "fail",
            content: "Oops 出現一點小錯誤",
          });
        });
    }

    if (currentModel === "Edit") {
      var a = form.getFieldValue("display");
      meditationService
        .updateCourse({
          CourseID: course.key,
          CourseName: form.getFieldValue("name"),
          Image: form.getFieldValue("image"),
          Display: form.getFieldValue("display"),
          TeacherID: form.getFieldValue("teacherId"),
          Index: Number(form.getFieldValue("Index")),
          Description: form.getFieldValue("description"),
          Tags: ["幫助睡眠", "正念", "紓解壓力"],
        })
        .then((e) => {
          meditationService
            .addMusicInCourse({
              CourseId: course.key,
              MusicIds: form.getFieldValue("musics"),
            })
            .then((e) => {
              messageApi.open({
                type: "success",
                content: "新增成功",
              });
              getData().then((e) => e);
              setModal1Open(false);
            });
        })
        .catch((e) => {
          messageApi.open({
            type: "fail",
            content: "Oops 出現一點小錯誤",
          });
        });
    }
  };

  const createOptions = (musics) => {
    musics.forEach((m) => {
      options.push({ value: m.MusicID, label: m.Title });
    });
    setAllOption(options);
  };

  const getDefault = (e) => {
    if (currentModel == "New") {
      return [];
    }
    const result = [];
    console.log(course);
    if (course.musicIDs == null) {
      return [];
    }
    for (let index = 0; index < allOption.length; index++) {
      for (let index2 = 0; index2 < course.musicIDs.length; index2++) {
        if (result.includes(allOption[index].value)) {
          continue;
        }
        if (allOption[index].value === course.musicIDs[index2].MusicID) {
          result.push(course.musicIDs[index2].MusicID);
        }
      }
    }
    return result;

    //    return allOption.map(e => { data.child.some(a => a._id = e.value) })
  };

  const getDefaultMusic = (e) => {
    if (currentModel == "New") {
      return [];
    }
    const result = [];

    if (course.musicIDs == null) {
      return [];
    }
    for (let index = 0; index < course.musicIDs.length; index++) {
      for (let index2 = 0; index2 < allMusics.length; index2++) {
        if (result.includes(allMusics[index2].MusicID)) {
          continue;
        }
        if (allMusics[index2].MusicID === course.musicIDs[index].MusicID) {
          result.push(allMusics[index2]);
        }
      }
    }

    console.log(result);
    return result;
    //    return allOption.map(e => { data.child.some(a => a._id = e.value) })
  };
  const getDefaultDisplay = (e) => {
    if (course.display == 0) {
      return {
        value: 0,
        label: "Standard",
      };
    }
    if (course.display == 1) {
      return {
        value: 1,
        label: "One",
      };
    }
    if (course.display == 2) {
      return {
        value: 2,
        label: "Three",
      };
    }
  };
  const getDefaultTeacher = () => {
    const a = allTeacherOption.find((t) => t.value === course.teacherID);
    console.log(allTeacherOption);
    console.log(course.teacherID);
    console.log(a);
    return a;
  };
  const tableProps = {
    loading,
  };
  const onDisplayChange = (value) => {
    form.setFieldsValue({ display: value });
  };
  const onTeacherChange = (value) => {
    form.setFieldsValue({ teacherId: value });
  };


  const saveSortedMusics = () => {
    console.log("Sorted Musics:", course);
    setSortModalOpen(false);
    message.success("順序已更新");
  };

  return (
    <div>
      <FloatButton
        shape="circle"
        type="primary"
        style={{ right: 94 }}
        onClick={openModal}
        tooltip={<div>Add Music</div>}
        icon={<PlusCircleOutlined />}
      />
      <>{contextHolder}</>
      <Drawer
        title={currentModel == "Edit" ? "編輯" : "新增"}
        style={{
          top: 20,
        }}
        destroyOnClose={true}
        open={modal1Open}
        onOk={() => onFinish()}
        onClose={() => setModal1Open(false)}
        width={720}
        cancelText="取消"
        okText="確定"
        bodyStyle={{ paddingBottom: 50 }}
      >
        <Form form={form} onFinish={onFinish}>
          <Space>
            <Form.Item name="name">
              <Input
                required
                value={form.name}
                allowClear={true}
                placeholder="名稱"
                size="big"
              />
            </Form.Item>
          </Space>
          <p></p>
          <Space>
            <Select
              disabled
              placeholder="選擇系列"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                {
                  value: "正念生活",
                  label: "正念生活",
                },
                {
                  value: "親子冥想",
                  label: "親子冥想",
                },
              ]}
            />
          </Space>

          <p></p>
          <Form.Item name="teacherName" label="選擇導師">
            <Space>
              <Select
                placeholder="選擇導師"
                defaultValue={getDefaultTeacher}
                options={allTeacherOption}
                //onSearch={onSearch}
                onChange={onTeacherChange}
              />
            </Space>
          </Form.Item>
          <Image
            crossOrigin="anonymous"
            width="100px"
            src={form.getFieldValue("image")}
          ></Image>
          <Form.Item name="image">
            <Input
              allowClear={true}
              defaultValue={course.image}
              placeholder="系列圖片"
              size="big"
            />
          </Form.Item>

          <p></p>
          <Form.Item name="display" label="版型">
            <Space>
              <Select
                placeholder="選擇版型"
                filterOption={(input, option) =>
                  (option?.label ?? "Standard")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={onDisplayChange}
                defaultValue={getDefaultDisplay}
                options={[
                  {
                    value: 0,
                    label: "Standard",
                  },
                  {
                    value: 1,
                    label: "One",
                  },
                  {
                    value: 2,
                    label: "Three",
                  },
                ]}
              />
            </Space>
          </Form.Item>
          <Space>
            <Form.Item name="Index" label="Index">
              <Input required allowClear={true} placeholder="Index" />
            </Form.Item>
          </Space>
          <p></p>
          <Form.Item name="musics" label="音樂">
            <Space>
              <Select
                mode="multiple"
                size="large"
                placeholder="Please select"
                onChange={onChangeMusic}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                defaultValue={getDefault}
                tokenSeparators={[","]}
                style={{
                  width: "300px",
                }}
                options={allOption}
              />
            </Space>

            <p></p>
          </Form.Item>

          <>
            <Form.Item name="description">
              <TextArea rows={3} placeholder="介紹" maxLength={50} />
            </Form.Item>
          </>

          <p></p>
        </Form>
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
      <Table
        {...tableProps}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 7 }}
        // expandable={{
        //     expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.musicIDs[0].MusicID}</p>,
        // }}

        expandable={{
          expandedRowRender: (record) => (
            <List
              itemLayout="horizontal"
              dataSource={record.child}
              renderItem={(item) => (
                <List.Item>
                  {
                    <List.Item.Meta
                      avatar={<Avatar src={item.Image} />}
                      title={<a>{item.Title}</a>}
                    />
                  }
                </List.Item>
              )}
            />
          ),
        }}
      ></Table>
    </div>
  );
}

export default Course;
