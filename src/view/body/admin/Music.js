import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  FloatButton,
  Button,
  Switch,
  Tabs,
  Card,
  Divider,
  Row,
  Col,
  Steps,
  Upload,
  Progress,
  Typography,
  Alert,
  Modal,
} from "antd";
import {
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  SmileOutlined,
  SoundOutlined,
  PictureOutlined,
  AudioOutlined,
  SettingOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  LoadingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import ReactAudioPlayer from "react-audio-player";
import { meditationService } from "../../../service/ServicePool";
import logo from "../../img/content/userIcon.svg";
import AdminHeader from "./AdminHeader";
import { useLocation, useNavigate } from "react-router-dom";

function Music() {
  const location = useLocation();
  const navigate = useNavigate();
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
  const [teachers, setTeachers] = useState([]);
  const [activeTab, setActiveTab] = useState("meditation");
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [teacherModalVisible, setTeacherModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    // Add filtering logic here
  }, []);

  const handleReset = useCallback((clearFilters) => {
    clearFilters();
    // Reset filtering logic here
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

  const getColumnSelectProps = useCallback(
    (dataIndex, options) => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Select
            placeholder={`Select ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(value) =>
              setSelectedKeys(value ? [value] : [])
            }
            style={{ width: 188, marginBottom: 8, display: "block" }}
            allowClear
          >
            {options.map(option => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
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
        render: (_, { isDelete }) => (isDelete === "Y" ? "未啟用" : "啟用中"),
        ...getColumnSelectProps("isDelete", [
          { label: "啟用", value: "enabled" },
          { label: "非啟用", value: "disabled" },
        ]),
        onFilter: (value, record) => {
          if (value === "enabled") return record.isDelete !== "Y";
          if (value === "disabled") return record.isDelete === "Y";
          return false;
        },
      },
      {
        title: "名稱",
        dataIndex: "name",
        key: "name",
        ...getColumnSearchProps("name"),
        onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
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
        ...getColumnSelectProps("free", [
          { label: "Free", value: "Free" },
          { label: "Premium", value: "Premium" },
        ]),
        onFilter: (value, record) => record.free === value,
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
        title: "老師",
        dataIndex: "teacherID",
        key: "teacherID",
        render: (teacherID) => {
          const teacher = teachers.find((t) => t.value === teacherID);
          return teacher ? teacher.label : "未指定";
        },
      },
      {
        title: "新增日期",
        dataIndex: "createDate",
        key: "createDate",
        sorter: (a, b) => new Date(a.createDate) - new Date(b.createDate),
      },
    ],
    [getColumnSearchProps, getColumnSelectProps, teachers]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await meditationService.getAllMusic();
    const result = res.map((item) => ({
      key: item.MusicID,
      name: item.Title,
      image: item.Image,
      series: item.Series,
      free: item.Free ? "Free" : "Premium",
      time: item.Time,
      path: item.Path,
      views: item.TotalView,
      createDate: item.CreateDate,
      isDelete: item.IsDelete,
      teacherID: item.TeacherID,
    }));
    setData(result);
    setLoading(false);
  }, []);

  const fetchTeachers = useCallback(async () => {
    try {
      const res = await meditationService.getAllTeacher();
      const teacherOptions = res.map((teacher) => ({
        label: teacher.Name,
        value: teacher.TeacherId,
        image: teacher.Image,
        title: teacher.Title,
      }));
      setTeachers(teacherOptions);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    }
  }, []);

  const handleDownload = useCallback(async () => {
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
  }, []);

  const openEdit = useCallback(
    (record) => {
      setCurrentModel("Edit");
      setCurrentStep(0); // 編輯時回到第一步
      setShortImage(record.image);
      setShortMusic(record.path);
      setSelectMusic(record.key);
      console.log(record.key);
      handleAudioDuration(record.path);

      // 設置選中的老師
      setSelectedTeacher(record.teacherID);

      form.setFieldsValue({
        key: record.key,
        musicId: record.MusicID,
        name: record.name,
        image: record.image,
        time: record.time,
        path: record.path,
        free: record.free,
        isDelete: record.isDelete === "N" || record.isDelete === "",
        teacherID: record.teacherID,
      });
      setModalOpen(true);
    },
    [form]
  );

  const handleFinish = useCallback(async () => {
    const values = form.getFieldsValue();
    const teacherID = form.getFieldValue("teacherID");
    console.log("Form values:", values);
    console.log("TeacherID:", teacherID);
    console.log("Selected teacher:", selectedTeacher);

    setLoading(true);
    try {
      if (currentModel === "New") {
        const createData = {
          UploadUserName: "小幫手003",
          Title: form.getFieldValue("name"),
          Description: "",
          Path: form.getFieldValue("path"),
          Type: "Course",
          Free: form.getFieldValue("free") === "Free",
          Image: form.getFieldValue("image"),
          Time: Math.floor(duration),
          IsDelete: form.getFieldValue("isDelete") ? "N" : "Y",
          TeacherID: teacherID,
        };
        console.log("Creating music with data:", createData);
        await meditationService.createMusic(createData);
      } else {
        const updateData = {
          MusicId: selectMusic,
          UploadUserName: "小幫手003",
          Title: form.getFieldValue("name"),
          Description: "",
          Path: form.getFieldValue("path"),
          Type: "Course",
          Free: form.getFieldValue("free") === "Free",
          Image: form.getFieldValue("image"),
          Time: Math.floor(duration),
          IsDelete: form.getFieldValue("isDelete") ? "N" : "Y",
          TeacherID: teacherID,
        };
        console.log("Updating music with data:", updateData);
        await meditationService.updateMusic(updateData);
      }
      setModalOpen(false);
      await fetchData();
    } finally {
      setLoading(false);
    }
  }, [currentModel, selectMusic, form, duration, fetchData, selectedTeacher]);

  const handleNew = useCallback(() => {
    setShortImage("");
    setShortMusic("");
    setCurrentModel("New");
    setDuration("");
    setCurrentStep(0);
    setUploadProgress(0);
    setSelectedTeacher(null); // 重置選中的老師
    form.resetFields();
    setModalOpen(true);
  }, [form]);

  const handleAudioDuration = useCallback((url) => {
    const audio = new Audio(url);
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration); // 格式化時長
    });
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setShortMusic(value);
      handleAudioDuration(value);
    },
    [handleAudioDuration]
  );

  const getDuration = useCallback(() => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }, [duration]);

  const isWhiteNoise = useCallback((path) => {
    const match = path.match(/\/music\/(\w)/);
    return match && match[1] === '0';
  }, []);

  const handleTeacherSelect = useCallback((teacherId) => {
    setSelectedTeacher(teacherId);
    form.setFieldsValue({ teacherID: teacherId });
    setTeacherModalVisible(false);
  }, [form]);

  const filteredData = useMemo(() => {
    const meditation = data.filter(item => !isWhiteNoise(item.path));
    const whiteNoise = data.filter(item => isWhiteNoise(item.path));
    return { meditation, whiteNoise };
  }, [data, isWhiteNoise]);

  useEffect(() => {
    fetchData();
    fetchTeachers();
  }, [fetchData, fetchTeachers]);

  useEffect(() => {
    if (location.pathname.endsWith('/meditation')) {
      setActiveTab('meditation');
    } else if (location.pathname.endsWith('/whitenoise')) {
      setActiveTab('whiteNoise');
    } else {
      setActiveTab('meditation');
    }
  }, [location.pathname]);
  return (
    <div>
      <FloatButton icon={<PlusCircleOutlined />} onClick={handleNew} />

      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {currentModel === "Edit" ? <EditOutlined /> : <PlusCircleOutlined />}
            {currentModel === "Edit" ? "編輯音樂" : "新增音樂"}
          </div>
        }
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        width={900}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {currentStep > 0 && (
                <Button onClick={() => setCurrentStep(currentStep - 1)}>
                  上一步
                </Button>
              )}
            </div>
            <div>
              <Button onClick={() => setModalOpen(false)} style={{ marginRight: 8 }}>
                取消
              </Button>
              {currentStep < 2 ? (
                <Button
                  type="primary"
                  onClick={() => {
                    if (currentStep === 0) {
                      // 在第一步檢查音樂名稱必填
                      form.validateFields(['name']).then(() => {
                        setCurrentStep(currentStep + 1);
                      }).catch(() => {
                        // 驗證失敗，錯誤信息會自動顯示
                      });
                    } else {
                      setCurrentStep(currentStep + 1);
                    }
                  }}
                >
                  下一步
                </Button>
              ) : (
                <Button type="primary" onClick={handleFinish} loading={loading}>
                  完成
                </Button>
              )}
            </div>
          </div>
        }
      >
        <div style={{ padding: '20px 0' }}>
          <Steps current={currentStep} size="small" style={{ marginBottom: '24px' }}>
            <Steps.Step title="基本信息" icon={<SettingOutlined />} />
            <Steps.Step title="媒體上傳" icon={<UploadOutlined />} />
            <Steps.Step title="確認設置" icon={<CheckCircleOutlined />} />
          </Steps>

          {currentStep === 0 && (
            <Card title={<span><SettingOutlined /> 基本信息設置</span>} bordered={false}>
              <Form form={form} layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="name"
                      label="音樂名稱"
                      rules={[{ required: true, message: '請輸入音樂名稱' }]}
                    >
                      <Input
                        placeholder="輸入音樂名稱"
                        prefix={<AudioOutlined />}
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="teacherID"
                      label="選擇老師"
                    >
                      <div onClick={() => {
                        console.log('Opening teacher modal from div');
                        setTeacherModalVisible(true);
                      }}>
                        <Button
                          type="default"
                          size="large"
                          block
                          icon={<UserOutlined />}
                        >
                          {selectedTeacher ? teachers.find(t => t.value === selectedTeacher)?.label || '選擇老師' : '選擇老師'}
                        </Button>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="free"
                      label="收費模式"
                    >
                      <Select
                        placeholder="選擇收費模式"
                        size="large"
                        options={[
                          { label: "免費", value: "Free" },
                          { label: "付費", value: "Premium" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="isDelete"
                      label="啟用狀態"
                    >
                      <Switch
                        checkedChildren="啟用"
                        unCheckedChildren="停用"
                        size="default"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          )}

          {currentStep === 1 && (
            <div>
              <Card title={<span><PictureOutlined /> 圖片上傳</span>} bordered={false} style={{ marginBottom: '16px' }}>
                <Form form={form} layout="vertical">
                <Form.Item
                  name="image"
                  label="圖片 URL"
                >
                  <Input
                    placeholder="輸入圖片 URL"
                    onChange={(e) => setShortImage(e.target.value)}
                    size="large"
                  />
                </Form.Item>
                  {shortImage && (
                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                      <Image
                        crossOrigin="anonymous"
                        src={shortImage}
                        width={200}
                        height={200}
                        style={{
                          objectFit: "cover",
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}
                        preview={false}
                      />
                    </div>
                  )}
                </Form>
              </Card>

              <Card title={<span><AudioOutlined /> 音頻上傳</span>} bordered={false}>
                <Form form={form} layout="vertical">
                  <Form.Item
                    name="path"
                    label="音樂 URL"
                  >
                    <Input
                      placeholder="輸入音樂 URL 或上傳音頻文件"
                      onChange={handleInputChange}
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item
                    name="time"
                    label="音樂時長（秒）"
                  >
                    <Input
                      placeholder="音樂時長"
                      type="number"
                      onChange={(r) => {
                        setDuration(r.target.value);
                      }}
                      size="large"
                    />
                  </Form.Item>
                  {duration && (
                    <Alert
                      message={`自動檢測時長：${getDuration()}`}
                      type="success"
                      showIcon
                      style={{ marginTop: '8px' }}
                    />
                  )}
                  {shortMusic && (
                    <div style={{ marginTop: '16px', padding: '16px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', color: 'white' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <PlayCircleOutlined style={{ fontSize: '24px' }} />
                        <Typography.Text strong style={{ color: 'white', fontSize: '16px' }}>
                          音頻預覽
                        </Typography.Text>
                      </div>
                      <ReactAudioPlayer
                        src={shortMusic}
                        controls
                        style={{
                          width: '100%',
                          filter: 'brightness(1.1)',
                        }}
                      />
                    </div>
                  )}
                </Form>
              </Card>
            </div>
          )}

          {currentStep === 2 && (
            <Card title={<span><CheckCircleOutlined /> 確認設置</span>} bordered={false}>
              <div style={{ padding: '20px 0' }}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Card size="small" title="基本信息" style={{ marginBottom: '16px' }}>
                      <p><strong>音樂名稱：</strong>{form.getFieldValue('name') || '未設置'}</p>
                      <p><strong>老師：</strong>{teachers.find(t => t.value === form.getFieldValue('teacherID'))?.label || '未設置'}</p>
                      <p><strong>收費模式：</strong>{form.getFieldValue('free') === 'Free' ? '免費' : '付費'}</p>
                      <p><strong>狀態：</strong>{form.getFieldValue('isDelete') ? '啟用' : '停用'}</p>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" title="媒體信息" style={{ marginBottom: '16px' }}>
                      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        {shortImage && (
                          <Image
                            crossOrigin="anonymous"
                            src={shortImage}
                            width={120}
                            height={120}
                            style={{
                              objectFit: "cover",
                              borderRadius: '8px',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            }}
                            preview={false}
                          />
                        )}
                      </div>
                      <p><strong>時長：</strong>{duration ? getDuration() : '未檢測'}</p>
                      <p><strong>音頻：</strong>{shortMusic ? '已設置' : '未設置'}</p>
                    </Card>
                  </Col>
                </Row>
                <Alert
                  message="請確認所有信息正確，點擊完成按鈕保存音樂。"
                  type="info"
                  showIcon
                  style={{ marginTop: '16px' }}
                />
              </div>
            </Card>
          )}
        </div>
      </Drawer>



      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab={<span><SmileOutlined /> 冥想</span>} key="meditation">
          <Table columns={columns} dataSource={filteredData.meditation} loading={loading} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span><SoundOutlined /> 白噪音</span>} key="whiteNoise">
          <Table columns={columns} dataSource={filteredData.whiteNoise} loading={loading} />
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title="選擇老師"
        open={teacherModalVisible}
        onCancel={() => {
          console.log('Closing teacher modal');
          setTeacherModalVisible(false);
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            console.log('Cancel button clicked');
            setTeacherModalVisible(false);
          }}>
            取消
          </Button>,
          <Button key="ok" type="primary" onClick={() => {
            console.log('OK button clicked');
            setTeacherModalVisible(false);
          }}>
            確定
          </Button>,
        ]}
        width={800}
      >
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <Row gutter={[16, 16]}>
            {teachers.map((teacher) => (
              <Col span={12} key={teacher.value}>
                <Card
                  hoverable
                  onClick={() => handleTeacherSelect(teacher.value)}
                  style={{
                    cursor: 'pointer',
                    border: selectedTeacher === teacher.value ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    backgroundColor: selectedTeacher === teacher.value ? '#f6ffed' : '#fff',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Image
                      src={teacher.image}
                      width={60}
                      height={60}
                      style={{
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #f0f0f0',
                      }}
                      fallback={logo}
                      preview={false}
                    />
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                        {teacher.label}
                      </div>
                      {teacher.title && (
                        <div style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                          {teacher.title}
                        </div>
                      )}
                    </div>
                    {selectedTeacher === teacher.value && (
                      <div style={{ marginLeft: 'auto', color: '#52c41a', fontSize: '18px' }}>
                        ✓
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Modal>

      {contextHolder}
    </div>
  );
}

export default Music;
