import React, { useEffect, useState, useRef } from "react";
import {
  message,
  Space,
  Table,
  Input,
  Select,
  Image,
  Drawer,
  Tag,
  Form,
  Rate,
  FloatButton,
  Empty,
  Button,
  Modal,
  Switch,
  Spin,
} from "antd";
import {
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import ReactAudioPlayer from "react-audio-player";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { meditationService } from "../../../service/ServicePool";
import logo from "../../img/content/userIcon.svg";

function Music() {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectMusic, setSelectMusic] = useState("false");
  const [currentModel, setCurrentModel] = useState("New");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [shortImage, setShortImage] = useState("");
  const [shortMusic, setShortMusic] = useState("");
  const [duration, setDuration] = useState(0);

  const getColumnSearchProps = (dataIndex) => ({
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
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // Add filtering logic here
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    // Reset filtering logic here
  };

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
        />
      ),
    },
    {
      title: "圖片",
      dataIndex: "image",
      key: "image",
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
      title: "啟用",
      dataIndex: "isDelete",
      key: "isDelete",
      render: (_, { isDelete }) => <>{isDelete == "Y" ? "未啟用" : "啟用中"}</>,
    },
    {
      title: "名稱",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "系列",
      dataIndex: "series",
      key: "series",
      render: (_, { tags }) => (
        <>
          {tags?.map((tag) => (
            <Tag key={tag}>{tag.toUpperCase()}</Tag>
          ))}
        </>
      ),
    },
    {
      title: "收費",
      dataIndex: "free",
      key: "free",
    },
    {
      title: "收聽",
      dataIndex: "views",
      key: "views",
      sorter: (a, b) => a.views - b.views,
    },
    {
      title: "音檔",
      dataIndex: "path",
      key: "path",
      render: (path) => <ReactAudioPlayer src={path} controls />,
    },
    {
      title: "新增日期",
      dataIndex: "createDate",
      key: "createDate",
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    const res = await meditationService.getAllMusic();
    const result = res.map((item) => ({
      key: item.MusicID,
      name: item.Title,
      image: item.Image,
      series: item.Series,
      free: item.Free ? "Free" : "Premium",
      path: item.Path,
      views: item.TotalView,
      createDate: item.CreateDate,
      isDelete: item.IsDelete,
    }));
    setData(result);
    setLoading(false);
  };

  const handleDownload = async () => {
    try {
      const response = await meditationService.getMusicRecordExcel();
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "report.xlsx";
      link.click();
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const openEdit = (record) => {
    setCurrentModel("Edit");
    setShortImage(record.image);
    setShortMusic(record.path);
    setSelectMusic(record.key);
    console.log(record.key)
    handleAudioDuration(record.path);
    
    form.setFieldsValue({
      key: record.key,
      musicId: record.MusicID,
      name: record.name,
      image: record.image,
      path: record.path,
      free: record.free,
      isDelete: record.isDelete === "N" || record.isDelete === "",
    });
    setModalOpen(true);
  };

  const handleFinish = async () => {
    const values = form.getFieldsValue();
    console.log(values);
    if (currentModel === "New") {
      await meditationService.createMusic({
        UploadUserName: "小幫手003",
        Title: form.getFieldValue("name"),
        Description: "",
        Path: form.getFieldValue("path"),
        Type: "Course",
        Free: form.getFieldValue("free") == "Free",
        Image: form.getFieldValue("image"),
        Time: form.getFieldValue("size"),
        IsDelete: form.getFieldValue("isDelete") ? "N" : "Y",
      });
    } else {
      await meditationService.updateMusic({
        MusicId: selectMusic,
        UploadUserName: "小幫手003",
        Title: form.getFieldValue("name"),
        Description: "",
        Path: form.getFieldValue("path"),
        Type: "Course",
        Free: form.getFieldValue("free") == "Free",
        Image: form.getFieldValue("image"),
        Time: form.getFieldValue("size"),
        IsDelete: form.getFieldValue("isDelete") ? "N" : "Y",
      });
    }
    setModalOpen(false);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleAudioDuration = (url) => {
    const audio = new Audio(url);
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration); // 格式化時長
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setShortMusic(value);
    handleAudioDuration(value);
  };

  const getDuration = () => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };
  return (
    <div>
      <Button onClick={handleDownload}>下載報表</Button>

      <FloatButton
        icon={<PlusCircleOutlined />}
        onClick={() => {
          setShortImage("");
          setShortMusic("");
          setCurrentModel("New");
          form.resetFields();
          setModalOpen(true);
          setDuration("")
        }}
      />

      <Drawer
        title={currentModel === "Edit" ? "編輯音樂" : "新增音樂"}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        width={720}
      >
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Form.Item name="name" label="名稱" rules={[{ required: true }]}>
            <Input placeholder="輸入音樂名稱" />
          </Form.Item>
          <Form.Item name="image" label="圖片 URL" rules={[{ required: true }]}>
            <Input
              placeholder="輸入圖片 URL"
              onChange={(e) => setShortImage(e.target.value)}
            />
          </Form.Item>
          {shortImage && (
            <Image
              crossOrigin="anonymous"
              src={shortImage}
              width="15%"
              fallback={logo}
              preview={{
                mask: null, // 可選，移除遮罩
                className: "custom-preview", // 添加自定義 className
              }}
              style={{
                objectFit: "contain", // 圖片縮放模式
                maxWidth: "200%", // 預覽圖片最大寬度
                maxHeight: "200%", // 預覽圖片最大高度
              }}
            />
          )}
          <Form.Item name="path" label="音樂 URL" rules={[{ required: true }]}>
            <Input placeholder="輸入音樂 URL" onChange={handleInputChange} />
          </Form.Item>
          {duration && (
            <div style={{ marginTop: "10px", color: "#666" }}>
              <label>音樂時長：{getDuration()}</label>
            </div>
          )}
          <ReactAudioPlayer
            src={shortMusic}
            controls
            width="100px"
            onAbort={true}
            onCanPlay={true}
          />
          <Form.Item name="free" label="收費模式" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "Free", value: "Free" },
                { label: "Premium", value: "Premium" },
              ]}
            />
          </Form.Item>
          <Form.Item name="isDelete" label="啟用" rules={[{ required: true }]}>
            <Switch />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form>
      </Drawer>

      <Table columns={columns} dataSource={data} loading={loading} />
      {contextHolder}
    </div>
  );
}

export default Music;
