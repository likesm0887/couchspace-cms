import React, { useEffect, useState } from "react";
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
  FloatButton,
  Empty,
  Layout,
  Menu,
  Spin,
  Alert,
  Drawer,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  CustomerServiceOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { meditationService } from "../../../service/ServicePool";
import ReactAudioPlayer from "react-audio-player";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
function Music() {
  const [data, setData] = useState([]);
  const [modal1Open, setModal1Open] = useState(false);
  const [shortImage, setShortImage] = useState(false);
  const [shortMusic, setShortMusic] = useState(false);
  const [editMusic, setEditMusic] = useState({});
  const [music, setMusic] = useState(false);
  const [form] = Form.useForm();
  const [currentModel, setCurrentModel] = useState("New");
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [currentTime2, setCurrentTime2] = useState(false);
  const [openTrendModal, setOpenTrendModal] = useState(false);
  const [trendData, setTrendData] = useState();
  const toggle = (checked) => {
    setLoading(checked);
  };
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

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
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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
        ></Button>
      ),
    },
    {
      title: "趨勢",
      dataIndex: "trendBtn",
      key: "trendBtn",
      render: (_, element) => (
        <Button
          icon={<LineChartOutlined />}
          type="primary"
          onClick={() => openTrend(element)}
        ></Button>
      ),
    },
    {
      title: "圖片",
      dataIndex: "image",
      key: "image",
      render: (image) => <Image src={image} width="70px" preview={false} />,
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
      title: "收費",
      dataIndex: "toll",
      key: "toll",
      sorter: (a, b) =>
        (a.toll == "Premium" ? 1 : 0) - (b.toll == "Free" ? 0 : 1),
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
      defaultSortOrder: "ascend",
      sorter: (a, b) =>
        new Date(a.createDate).getTime() - new Date(b.createDate).getTime(),
    },
  ];
  const openTrend = async (e) => {
    console.log(e);
    setOpenTrendModal(true);
    const res = await meditationService.getMusicTrend(e.key);
    setTrendData(res);
  };
  const openEdit = (e) => {
    console.log(e);
    setCurrentModel("Edit");
    setCurrentTime2("");
    setMusic({
      key: e.key,
      name: e.name,
      image: e.image,
      series: ["nice", "developer"],
      toll: e.toll,
      path: e.path,
    });

    form.setFieldValue("name", e.name);
    form.setFieldValue("image", e.image);
    form.setFieldValue("path", e.path);

    setModal1Open(true);
  };

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    setLoading(true);
    const res = await meditationService.getAllMusic();
    const result = res.map((element) => ({
      key: element.MusicID,
      name: element.Title,
      image: element.Image,
      series: ["nice", "developer"],
      toll: element.Free ? "Free" : "Premium",
      path: element.Path,
      views: element.TotalView,
      createDate: element.CreateDate,
    }));
    setLoading(false);
    setData(result);
  };

  const onshortMusicChange = (e) => {
    if (e.target.value.length > 10) {
      setShortMusic(e.target.value);
    }
  };
  const onCanPlay = (e) => {
    setLoading2(false);
  };

  const onAbort = (e) => {
    setLoading2(true);
  };
  const openModal = (e) => {
    setCurrentModel("New");
    setMusic({});
    setModal1Open(true);

    form.setFieldValue("name", "");
    form.setFieldValue("image", "");
    form.setFieldValue("path", "");
    form.setFieldValue("size", "");
    setShortMusic("");
    //message.success('Success!');
  };

  const onFinish = () => {
    toggle(true);
    if (currentModel === "New") {
      const input = form.getFieldsValue();
      meditationService
        .createMusic({
          UploadUserName: "小幫手003",
          Title: form.getFieldValue("name"),
          Description: "",
          Path: form.getFieldValue("path"),
          Type: "Course",
          Free: form.getFieldValue("free") == "Free",
          Image: form.getFieldValue("image"),
          Time: form.getFieldValue("size"),
        })
        .then((e) => {
          messageApi.open({
            type: "success",
            content: "新增成功",
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
      const input = form.getFieldsValue();

      meditationService
        .updateMusic({
          MusicId: music.key,
          UploadUserName: "小幫手003",
          Title: form.getFieldValue("name"),
          Description: "",
          Path: form.getFieldValue("path"),
          Type: "Course",
          Free: form.getFieldValue("free") == "Free",
          Image: form.getFieldValue("image"),
          Time: form.getFieldValue("size"),
        })
        .then((e) => {
          messageApi.open({
            type: "success",
            content: "修改成功",
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
    getData();
  };

  const onChangeFree = (value) => {
    form.setFieldsValue({ free: value });
  };
  const handleLoadMetadata = (meta) => {
    const { duration } = meta.target;
    setCurrentTime2(Math.ceil(duration));
    form.setFieldValue("size", Math.ceil(duration));
  };

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  const tableProps = {
    loading,
  };
  const handleDownload = async () => {
    try {
      // 使用 fetch 下載檔案
      const response = (await meditationService.getMusicRecordExcel());
      if (!response.ok) throw new Error('Network response was not ok');

      // 取得 blob 格式的檔案
      const blob = await response.blob();
      
      // 建立一個 URL 來讓檔案可供下載
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // 設置下載的檔案名稱
      a.download = 'report.xlsx';
      document.body.appendChild(a);
      a.click();

      // 清除 DOM 的暫時連結
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('File download failed:', error);
    }
  };

  return (
    <div>
      <Button
        style={{
          width: "100px",
          backgroundColor: "#f5a623", // 橘黃色背景
          borderColor: "#f5a623", // 邊框顏色
          color: "#fff", // 白色字體
          borderRadius: "5px", // 圓角邊框
          padding: "6px 16px", // 按鈕內邊距
          fontWeight: "bold", // 粗體字
        }}
        onClick={handleDownload}
       
      >
        下載報表
      </Button>
      <Modal
        title="收聽趨勢圖"
        centered
        open={openTrendModal}
        onOk={() => setOpenTrendModal(false)}
        width={700}
        closable={false}
        onCancel={() => setOpenTrendModal(false)}
      >
        <div>
          {!trendData ? (
            <Empty />
          ) : (
            <LineChart
              width={500}
              height={300}
              data={trendData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="Date" />
              <YAxis />
              <CartesianGrid strokeDasharray="4 4" />
              <Tooltip />

              <Line type="monotone" dataKey="TotalViews" stroke="#82ca9d" />
            </LineChart>
          )}
        </div>
      </Modal>

      <>{contextHolder}</>
      <FloatButton
        shape="circle"
        type="primary"
        style={{ right: 94 }}
        onClick={openModal}
        tooltip={<div>Add Music</div>}
        icon={<PlusCircleOutlined />}
      />

      {/* <Spin spinning={loading}></Spin> */}
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
                value={editMusic.Name}
                allowClear={true}
                placeholder="標題"
                size="big"
              />
            </Form.Item>
          </Space>

          <p></p>
          <Space>
            <Select
              disabled
              placeholder="選擇系列"
              //onChange={onChange}
              //onSearch={onSearch}
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
          <Space>
            <Input disabled placeholder="屬性" size="big" />
          </Space>
          <p></p>
          <Image width="100px" src={form.getFieldValue("image")}></Image>
          <Form.Item name="image">
            <Input
              allowClear={true}
              value={music.Image}
              placeholder="圖片"
              size="big"
            />
          </Form.Item>
          <p></p>

          <Space>
            <Spin spinning={loading2} delay={500}>
              <Form.Item name="path">
                <Input
                  value={music.Music}
                  allowClear={true}
                  placeholder="檔案"
                  size="big"
                  onFocus={onshortMusicChange}
                />
              </Form.Item>
              <Form.Item name="size" label="音樂長度">
                <Input
                  value={currentTime2}
                  disabled={false}
                  placeholder="檔案"
                  size="big"
                />
              </Form.Item>
              <ReactAudioPlayer
                src={shortMusic}
                controls
                width="100px"
                onAbort={onAbort}
                onCanPlay={onCanPlay}
                onLoadedMetadata={handleLoadMetadata}
              />
            </Spin>
          </Space>
          <p></p>
          <Space>
            <Form.Item name="rate1" label="推薦程度">
              <Rate disabled />
            </Form.Item>
          </Space>
          <p></p>
          <Space>
            <Form.Item name="rate2" label="熱門程度">
              <Rate disabled />
            </Form.Item>
          </Space>

          <p></p>
          <Form.Item name="free" label="選擇收費">
            <Select
              defaultValue={music.toll}
              placeholder="選擇收費"
              onChange={onChangeFree}
              //onSearch={onSearch}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                {
                  value: "Free",
                  label: "Free",
                },
                {
                  value: "Premium",
                  label: "Premium",
                },
              ]}
            />

            <p></p>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={onFinish} type="primary">
                確認
              </Button>
              <Button onClick={() => setModal1Open(false)} type="primary">
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
        <div
          style={{
            position: "absolute",
            bottom: "10%",
          }}
        ></div>
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

export default Music;
