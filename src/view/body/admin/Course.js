import React, { Children, useEffect, useState } from "react";
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
  Rate,
  List,
  Button,
  Avatar,
  FloatButton,
  Layout,
  Menu,
  Spin,
  Alert,
  Drawer,
} from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import { meditationService } from "../../../service/ServicePool";
import ReactAudioPlayer from "react-audio-player";
import moment from "moment";
const { TextArea } = Input;
function Course() {
  const [data, setData] = useState([]);
  const [modal1Open, setModal1Open] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [course, setCourse] = useState(false);
  const [allOption, setAllOption] = useState([]);
  const [allTeacherOption, setAllTeacherOption] = useState([]);
  const options = [];
  const [currentModel, setCurrentModel] = useState("New");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const columns = [
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
      render: (image) => <Image crossOrigin="anonymous"   src={image} width="70px" />,
    },
    {
      title: "名稱",
      dataIndex: "courseName",
      key: "courseName",
    },
    {
      title: "導師",
      dataIndex: "teacherName",
      key: "teacherName",
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
      defaultSortOrder: "descend",
    },
    {
      title: "新增日期",
      dataIndex: "createDate",
      key: "createDate",
      defaultSortOrder: "descend",
      sorter: (a, b) =>
        moment(a.createDate).unix() - moment(b.createDate).unix(),
    },
  ];
  const onChangeMusic = (values) => {
    console.log(values);
    form.setFieldsValue({ musics: values });
  };
  const openEdit = (e) => {
    console.log(e);
    setCurrentModel("Edit");
    setCourse({
      key: e.key,
      courseName: e.courseName,
      image: e.image,
      series: ["nice", "developer"],
      tags: e.tags,
      description: e.description,
      musicIDs: e.musicIDs,
      child: e.musics,
      display: e.display,
      teacherID: e.teacherId,
    });

    form.setFieldValue("name", e.courseName);
    form.setFieldValue("image", e.image);
    form.setFieldValue("description", e.description);
    console.log(e);
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
    createOptions(allMusics);

    const result = [];
    for (let i = 0; i < res.length; i++) {
      //const musics = allMusics.filter(e=>res[i]?.MusicIDs?.includes(e));
      const musics = allMusics.filter((elementB) => res[i]?.MusicIDs?.some((elementA) => elementA.id === elementB.id));
      //const musics = await fetchMusic(res[i].MusicIDs);
      res[i].Musics = [];

      if (musics != null) {
        res[i].Musics.push(...musics);
      }
      console.log(res[i].TeacherID);
      var teacher =null
      if (res[i].TeacherID != "") {
        console.log(res[i].TeacherID);
         teacher = await meditationService.getTeacherById(res[i].TeacherID);
        console.log(teacher.Name);
        console.log(res[i]);
      }

      result.push({
        key: res[i].CourseID,
        courseName: res[i].CourseName,
        image: res[i].Image,
        series: ["nice", "developer"],
        tags: res[i]?.Tags,
        description: res[i].Description,
        musicIDs: res[i].MusicIDs,
        teacherName: teacher===null?"":teacher.Name,
        teacherId: teacher===null?"":teacher.TeacherId,
        child: res[i].Musics,
        display: res[i].Display,
        createDate: res[i].CreateDate,
      });
    }

    setData(result);
    createAllTeacherOptions();
    console.log(allTeacherOption);
    setLoading(false);
  };

  const openModal = (e) => {
    setCurrentModel("New");
    setCourse({});
    form.setFieldValue("image", "");
    form.setFieldValue("name", "");
    form.setFieldValue("description", "");
    setModal1Open(true);
  };
  const onFinish = () => {
    if (currentModel === "New") {
      const input = form.getFieldsValue();
      meditationService
        .createCourse({
          CourseName: form.getFieldValue("name"),
          Image: form.getFieldValue("image"),
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

  const fetchMusic = async (ids) => {
    const idstring = ids?.map((id) => id.MusicID);

    const musics = await meditationService.batchQueryMusic({ ids: idstring });

    return musics;
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
  const getDefaultTeacher=()=>{
    const a=  allTeacherOption.find(t=>t.value===course.teacherID)
    console.log(allTeacherOption)
    console.log(course.teacherID)
    console.log(a)
    return a;
 }
  const tableProps = {
    loading,
  };
  const onDisplayChange = (value) => {
    form.setFieldsValue({ display: value });
  };
  const onTeacherChange = (value) => {
    form.setFieldsValue({ teacherId: value });
  };

  const createAllTeacherOptions = async () => {
    var allTeacher = await meditationService.getAllTeacher();
    console.log(allTeacher);
    var options = [];
    allTeacher.forEach((t) => {
      options.push({ value: t.TeacherId, label: t.Name });
    });
    setAllTeacherOption(options);
    return options;
  };
 
  return (
    <div>
      <>{contextHolder}</>
      <FloatButton
        shape="circle"
        type="primary"
        style={{ right: 94 }}
        onClick={openModal}
        tooltip={<div>Add Music</div>}
        icon={<PlusCircleOutlined />}
      />

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
          <Image crossOrigin="anonymous"   width="100px" src={form.getFieldValue("image")}></Image>
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
