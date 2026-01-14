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
  Card,
  Typography,
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
  BookOutlined,
} from "@ant-design/icons";
import { meditationService } from "../../../service/ServicePool";
import ReactAudioPlayer from "react-audio-player";
import moment from "moment";
const { TextArea } = Input;

const tableRowStyles = `
  .table-row-even {
    background-color: #fafafa !important;
  }
  .table-row-odd {
    background-color: #ffffff !important;
  }
  .table-row-even:hover,
  .table-row-odd:hover {
    background-color: #e6f7ff !important;
  }
`;

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

    const courseData = {
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
    };

    setCourse(courseData);
    getDefaultMusic();

    form.setFieldValue("name", e.courseName);
    form.setFieldValue("image", e.image);
    form.setFieldValue("description", e.description);
    form.setFieldValue("Index", e.Index);
    form.setFieldValue("teacherName", e.teacherId);
    form.setFieldValue("display", e.display);
    form.setFieldValue("musics", e.musicIDs ? e.musicIDs.map(music => music.id || music.MusicID) : []);

    console.log(courseData);
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
      const musics = allMusics.filter(e=>res[i]?.MusicIDs?.includes(e));
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
          TeacherID: form.getFieldValue("teacherName"),
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
          TeacherID: form.getFieldValue("teacherName"),
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
      options.push({ value: m.MusicID || m.id, label: m.Title });
    });
    setAllOption(options);
  };

  const getDefault = () => {
    if (currentModel === "New") {
      return [];
    }
    if (!course.musicIDs || course.musicIDs.length === 0) {
      return [];
    }
    return course.musicIDs.map(music => music.MusicID || music.id);
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
    form.setFieldsValue({ teacherName: value });
  };


  const saveSortedMusics = () => {
    console.log("Sorted Musics:", course);
    setSortModalOpen(false);
    message.success("順序已更新");
  };

  return (
    <>
      <style>{tableRowStyles}</style>
      <div style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh',
        padding: '20px'
      }}>
        <>{contextHolder}</>
        <Card
          title={
            <Typography.Title level={2} style={{ margin: 0, color: '#1890ff' }}>
              <CustomerServiceOutlined style={{ marginRight: '10px' }} />
              課程管理
            </Typography.Title>
          }
          bordered={false}
          style={{
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            background: 'white'
          }}
        >
          <FloatButton
            shape="circle"
            type="primary"
            style={{
              right: 94,
              boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
            }}
            onClick={openModal}
            tooltip={<div>新增課程</div>}
            icon={<PlusCircleOutlined />}
          />
          <Drawer
            title={
              <div style={{
                color: '#1890ff',
                fontSize: '20px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center'
              }}>
                {currentModel == "Edit" ? <EditOutlined style={{ marginRight: '8px' }} /> : <PlusCircleOutlined style={{ marginRight: '8px' }} />}
                {currentModel == "Edit" ? "編輯課程" : "新增課程"}
              </div>
            }
            style={{
              top: 20,
            }}
            destroyOnClose={true}
            open={modal1Open}
            onOk={() => onFinish()}
            onClose={() => setModal1Open(false)}
            width={720}
            bodyStyle={{ paddingBottom: 80 }}
          >
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Form.Item
                name="name"
                label={<span style={{ fontWeight: 'bold', color: '#1890ff' }}>課程名稱</span>}
                rules={[{ required: true, message: '請輸入課程名稱' }]}
              >
                <Input
                  allowClear={true}
                  placeholder="請輸入課程名稱"
                  size="large"
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>

              <Form.Item
                name="teacherName"
                label={<span style={{ fontWeight: 'bold', color: '#1890ff' }}>選擇導師</span>}
              >
                <Select
                  placeholder="請選擇導師"
                  options={allTeacherOption}
                  onChange={onTeacherChange}
                  size="large"
                  style={{ borderRadius: '6px' }}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>

              <div style={{
                background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d6e4ff',
                marginBottom: '16px'
              }}>
                <Image
                  crossOrigin="anonymous"
                  width="100px"
                  src={form.getFieldValue("image")}
                  style={{ marginBottom: '8px' }}
                />
                <Form.Item
                  name="image"
                  label={<span style={{ fontWeight: 'bold', color: '#1890ff' }}>系列圖片</span>}
                >
                  <Input
                    allowClear={true}
                    placeholder="請輸入圖片URL"
                    size="large"
                    style={{ borderRadius: '6px' }}
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="display"
                label={<span style={{ fontWeight: 'bold', color: '#1890ff' }}>版型</span>}
              >
                <Select
                  placeholder="請選擇版型"
                  onChange={onDisplayChange}
                  size="large"
                  style={{ borderRadius: '6px' }}
                  defaultValue={getDefaultDisplay()}
                  options={[
                    { value: 0, label: "Standard" },
                    { value: 1, label: "One" },
                    { value: 2, label: "Three" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="Index"
                label={<span style={{ fontWeight: 'bold', color: '#1890ff' }}>顯示順序</span>}
              >
                <Input
                  type="number"
                  allowClear={true}
                  placeholder="請輸入順序"
                  size="large"
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>

              <Form.Item
                name="musics"
                label={
                  <span style={{ fontWeight: 'bold', color: '#1890ff', display: 'flex', alignItems: 'center' }}>
                    <BookOutlined style={{ marginRight: '6px' }} />
                    音樂清單
                  </span>
                }
                extra={
                  <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                    選擇此課程包含的音樂，可多選
                  </div>
                }
              >
                <div style={{
                  background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%)',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d6e4ff'
                }}>
                  <Select
                    mode="multiple"
                    placeholder="請選擇音樂..."
                    onChange={onChangeMusic}
                    size="large"
                    tokenSeparators={[","]}
                    style={{
                      width: "100%",
                      borderRadius: '6px'
                    }}
                    defaultValue={currentModel === "Edit" ? getDefault() : []}
                    options={allOption}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    tagRender={(props) => {
                      const { label, closable, onClose } = props;
                      return (
                        <Tag
                          color="blue"
                          closable={closable}
                          onClose={onClose}
                          style={{
                            margin: '2px',
                            borderRadius: '12px',
                            fontSize: '12px'
                          }}
                        >
                          {label}
                        </Tag>
                      );
                    }}
                  />
                </div>
              </Form.Item>

              <Form.Item
                name="description"
                label={<span style={{ fontWeight: 'bold', color: '#1890ff' }}>課程介紹</span>}
              >
                <TextArea
                  rows={4}
                  placeholder="請輸入課程介紹"
                  maxLength={200}
                  showCount
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Form>

            <div
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                left: "0",
                padding: "16px 24px",
                background: 'white',
                borderTop: '1px solid #f0f0f0',
                borderRadius: '0 0 12px 12px'
              }}
            >
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button
                  onClick={() => setModal1Open(false)}
                  size="large"
                  style={{ borderRadius: '6px' }}
                >
                  取消
                </Button>
                <Button
                  onClick={onFinish}
                  type="primary"
                  size="large"
                  style={{
                    borderRadius: '6px',
                    background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                    border: 'none'
                  }}
                >
                  確認
                </Button>
              </Space>
            </div>
          </Drawer>
          <Table
            {...tableProps}
            columns={columns}
            dataSource={data}
            pagination={{
              pageSize: 7,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `顯示 ${range[0]}-${range[1]} 共 ${total} 項`
            }}
            style={{
              borderRadius: '8px',
              overflow: 'hidden'
            }}
            rowClassName={(record, index) => index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}
          />
        </Card>
      </div>
    </>
  );
}

export default Course;
