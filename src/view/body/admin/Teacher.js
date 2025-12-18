import React, { useEffect, useState, useCallback, useMemo } from "react";
import { meditationService } from "../../../service/ServicePool";
import { Button } from "antd";
import moment from "moment";
import {
  message,
  Space,
  Table,
  Input,
  Image,
  Form,
  FloatButton,
  Drawer,
} from "antd";

import { PlusCircleOutlined, EditOutlined } from "@ant-design/icons";
import AdminHeader from "./AdminHeader";

function Teacher() {
  const { TextArea } = Input;
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState(false);
  const [data, setData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedTeacherKey, setSelectedTeacherKey] = useState([]);
  const [form] = Form.useForm();
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
        title: "姓名",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "稱號",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "介紹",
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
      {
        title: "最後更新日期",
        dataIndex: "updateDate",
        key: "updateDate",
        defaultSortOrder: "descend",
        sorter: (a, b) =>
          moment(a.createDate).unix() - moment(b.createDate).unix(),
      },
    ],
    []
  );

  const tableProps = {
    loading,
  };
  const getData = useCallback(async () => {
    setLoading(true);
    const res = await meditationService.getAllTeacher();
    const result = res.map((element) => ({
      key: element.TeacherId,
      name: element.Name,
      image: element.Image,
      title: element.Title,
      description: element.Description,
      createDate: element.CreationDate,
      updateDate: element.UpdateDate,
    }));
    setLoading(false);
    setData(result);
  }, []);

  const openEdit = useCallback(
    async (e) => {
      const res = await meditationService.getTeacherById(e.key);
      setCurrentModel("Edit");
      setSelectedTeacherKey(res.TeacherId);
      form.setFieldsValue({
        image: res.Image,
        name: res.Name,
        title: res.Title,
        description: res.Description,
      });
      setIsDrawerOpen(true);
    },
    [form]
  );

  const onNew = useCallback(() => {
    setCurrentModel("New");
    form.resetFields();
    setIsDrawerOpen(true);
  }, [form]);

  useEffect(() => {
    getData();
  }, [getData]);

  const onChange = useCallback(() => {}, []);

  const onFinish = useCallback(
    (e) => {
      console.log(e);
      if (currentModel === "Edit") {
        setLoading(true);
        meditationService
          .updateTeacher({
            TeacherId: selectedTeacherKey,
            Name: form.getFieldValue("name"),
            Title: form.getFieldValue("title"),
            Image: form.getFieldValue("image"),
            Description: form.getFieldValue("description"),
          })
          .then(() => {
            messageApi.open({
              type: "success",
              content: "編輯成功",
            });
            getData().then(() => {
              setIsDrawerOpen(false);
              setLoading(false);
            });
          })
          .catch(() => {
            messageApi.open({
              type: "fail",
              content: "Oops 出現一點小錯誤",
            });
            setLoading(false);
          });
      }
      if (currentModel === "New") {
        setLoading(true);
        meditationService
          .createTeacher({
            Name: form.getFieldValue("name"),
            Title: form.getFieldValue("title"),
            Image: form.getFieldValue("image"),
            Description: form.getFieldValue("description"),
          })
          .then(() => {
            messageApi.open({
              type: "success",
              content: "新增成功",
            });
            getData().then(() => {
              setIsDrawerOpen(false);
              setLoading(false);
            });
          })
          .catch(() => {
            messageApi.open({
              type: "fail",
              content: "Oops 出現一點小錯誤",
            });
            setLoading(false);
          });
      }
    },
    [currentModel, selectedTeacherKey, form, messageApi, getData]
  );

  const onFinishFailed = useCallback((errorInfo) => {
    console.log("Failed:", errorInfo);
  }, []);

  return (
    <div>
      <FloatButton
        shape="circle"
        type="primary"
        style={{ right: 94 }}
        onClick={onNew}
        tooltip={<div>Add Music</div>}
        icon={<PlusCircleOutlined />}
      />
      <Drawer
        title={currentModel == "Edit" ? "編輯" : "新增"}
        style={{
          top: 20,
        }}
        destroyOnClose={true}
        open={isDrawerOpen}
        onFinish={onFinish}
        onClose={() => setIsDrawerOpen(false)}
        width={720}
        cancelText="取消"
        okText="確定"
        autoComplete="off"
        bodyStyle={{ paddingBottom: 50 }}
        onFinishFailed={onFinishFailed}
        initialValues={{ remember: true }}
      >
        <Form form={form} onSubmit={onFinish}>
          <Space>
            <Form.Item
              name="name"
              label="名稱"
              rules={[{ required: true, message: "請輸入名稱!" }]}
            >
              <Input required allowClear={true} placeholder="標題" size="big" />
            </Form.Item>
          </Space>

          <p></p>
          <Form.Item name="title" label="稱號">
            <Space>
              <Input
                placeholder="稱號"
                size="big"
                defaultValue={form.getFieldValue("title")}
              />
            </Space>
          </Form.Item>
          <p></p>
          <Image
            crossOrigin="anonymous"
            width="100px"
            src={form.getFieldValue("image")}
          ></Image>
          <Form.Item name="image" label="圖片">
            <Input allowClear={true} placeholder="圖片" size="big" />
          </Form.Item>
          <p></p>
          <Form.Item name="description" label="介紹">
            <TextArea
              rows={5}
              placeholder="介紹"
              maxLength={150}
              defaultValue={form.getFieldValue("description")}
            />
          </Form.Item>
          <p></p>

          <Form.Item>
            <Space>
              <Button htmlType="submit" onClick={onFinish} type="primary">
                確認
              </Button>
              <Button onClick={() => setIsDrawerOpen(false)} type="primary">
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
      <Table
        {...tableProps}
        onChange={onChange}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 7 }}
      ></Table>
    </div>
  );
}

export default Teacher;
