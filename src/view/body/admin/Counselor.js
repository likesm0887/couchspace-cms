import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Drawer,
  Button,
  Table,
  Statistic,
  Switch,
  Tag,
  Modal,
  Menu,
  Tabs,
  Image,
  List,
  Card,
  Calendar,
  Space,
  Row,
  Col,
  Input,
  Form,
  Divider,
  Typography,
  message,
} from "antd";
import { SearchOutlined, DeleteOutlined, ExclamationCircleOutlined, SaveOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined, NotificationOutlined, LaptopOutlined } from "@ant-design/icons";
import { Layout, theme, Descriptions, Badge, Outlet } from "antd";

import moment from "moment";

import {
  appointmentService,
  counselorService,
} from "../../../service/ServicePool";
import CountUp from "react-countup";
import img_account from "../../img/login/ic_identity.svg";
import { fontFamily } from "@mui/system";
import { isNil } from "@ant-design/pro-components";

// CounselorDetailModal 組件 - 諮商師詳情模態框
const CounselorDetailModal = ({ counselorData, counselorPhoto }) => {
  if (!counselorData || counselorData.length === 0) {
    return <div>載入中...</div>;
  }

  // 將Descriptions items轉換為對象格式供顯示
  const counselorInfo = counselorData.reduce((acc, item) => {
    acc[item.key] = item;
    return acc;
  }, {});

  return (
    <div style={{ padding: "16px", backgroundColor: "#f5f5f5" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", padding: "16px", backgroundColor: "#fff", borderRadius: "8px" }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            諮商師詳情
            {counselorInfo["21"]?.children && (
              <div style={{ marginTop: "8px" }}>
                <Tag color="blue" style={{ fontSize: "14px", padding: "4px 12px" }}>
                  {counselorInfo["21"]?.children === "HeartCoach" ? "心教練" : "心理師"}
                </Tag>
              </div>
            )}
          </Typography.Title>
        </div>

        <Row gutter={24}>
          {/* 大頭貼 */}
          <Col xs={24} lg={6}>
            <Card title="大頭貼" bordered={false}>
              <div style={{ textAlign: 'center' }}>
                {counselorPhoto ? (
                  <div>
                    {counselorPhoto}
                  </div>
                ) : (
                  <div style={{
                    width: '120px',
                    height: '120px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    color: '#999'
                  }}>
                    無照片
                  </div>
                )}
              </div>
            </Card>
          </Col>

          {/* 基本資訊 */}
          <Col xs={24} lg={18}>
            <Card title={<Space><UserOutlined />基本資訊</Space>} bordered={false}>
              <Descriptions column={2} size="small">
                <Descriptions.Item label="姓名">
                  {counselorInfo["1"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="暱稱">
                  {counselorInfo["2"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {counselorInfo["3"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="手機">
                  {counselorInfo["5"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="性別">
                  {counselorInfo["19"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="認證狀態">
                  {counselorInfo["6"]?.children}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

        </Row>

        <Row gutter={24}>
          {/* 專業資訊 */}
          <Col xs={24} lg={12}>
            <Card title={<Space><UserOutlined />專業資訊</Space>} bordered={false}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="學歷">
                  {counselorInfo["8"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="職稱">
                  {counselorInfo["10"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="經歷">
                  {counselorInfo["7"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="從業時間">
                  {counselorInfo["14"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="地點">
                  {counselorInfo["13"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="語言">
                  {counselorInfo["20"]?.children || "未設定"}
                </Descriptions.Item>
                <Descriptions.Item label="身分">
                  {counselorInfo["21"]?.children === "HeartCoach" ? "心教練" : "心理師"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* 服務與資格 */}
          <Col xs={24} lg={12}>
            <Card title="服務與資格" bordered={false}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="認證狀態">
                  {counselorInfo["6"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="機構資訊">
                  {counselorInfo["9"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="地址">
                  {counselorInfo["10"]?.children}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        {/* 服務類別 */}
        {counselorInfo["16"] && (
          <Card title="服務類別" bordered={false}>
            <Space wrap>
              {counselorInfo["16"]?.children}
            </Space>
          </Card>
        )}

        {/* 專長 */}
        {counselorInfo["17"] && (
          <Card title="專長" bordered={false}>
            <Space wrap>
              {counselorInfo["17"]?.children}
            </Space>
          </Card>
        )}

        {/* 證照 */}
        {counselorInfo["18"] && (
          <Card title="證照資訊" bordered={false}>
            <Space wrap>
              {counselorInfo["18"]?.children}
            </Space>
          </Card>
        )}

        {/* 機構資訊 */}
        {counselorInfo["9"] && (
          <Card title="機構資訊" bordered={false}>
            <Typography.Text>
              {counselorInfo["9"]?.children}
            </Typography.Text>
          </Card>
        )}

        {/* 地址 */}
        {counselorInfo["10"] && (
          <Card title="地址" bordered={false}>
            <Typography.Text>
              {counselorInfo["10"]?.children}
            </Typography.Text>
          </Card>
        )}

        {/* 專長描述 */}
        {counselorInfo["15"] && (
          <Card title="專長描述" bordered={false}>
            <Typography.Text>
              {counselorInfo["15"]?.children}
            </Typography.Text>
          </Card>
        )}

        {/* 自我介紹 */}
        {(counselorInfo["11"] || counselorInfo["12"]) && (
          <Card title="自我介紹" bordered={false}>
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              {counselorInfo["11"] && (
                <div>
                  <Typography.Text strong>簡短介紹：</Typography.Text>
                  <br />
                  <Typography.Text>{counselorInfo["11"]?.children}</Typography.Text>
                </div>
              )}
              {counselorInfo["12"] && (
                <div>
                  <Typography.Text strong>詳細介紹：</Typography.Text>
                  <br />
                  <Typography.Text>{counselorInfo["12"]?.children}</Typography.Text>
                </div>
              )}
            </Space>
          </Card>
        )}


      </Space>
    </div>
  );
};

const DrawerForm = ({ id, visible, onClose, record, callback }) => {
  const [verify, setVerify] = useState(false);
  const [counselorInfo, setCounselorInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const changeVerify = (e) => {
    setVerify(e);
  };

  useEffect(() => {
    if (id && visible) {
      const getCounselorInfo = async () => {
        try {
          const info = await counselorService.getCounselorInfoById(id);
          const isVerify = await counselorService.getCounselorVerify(id);
          setCounselorInfo(info);
          setVerify(isVerify);
        } catch (error) {
          console.error('獲取諮商師資訊失敗:', error);
        }
      };
      getCounselorInfo();
    }
  }, [id, visible]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await counselorService.setCounselorVerify(id, verify);
      message.success('諮商師認證狀態已成功更新');
      onClose();
      callback();
    } catch (error) {
      console.error('儲存失敗:', error);
      message.error('儲存失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    const counselorName = counselorInfo ?
      counselorInfo.UserName.Name.LastName + counselorInfo.UserName.Name.FirstName : '';

    Modal.confirm({
      title: '確認刪除諮商師',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          <p>您確定要刪除諮商師 <strong>{counselorName}</strong> 嗎？</p>
          <p style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '8px' }}>
            此操作無法撤銷，將永久刪除該諮商師的所有資料。
          </p>
        </div>
      ),
      okText: '確定刪除',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await counselorService.deleteCounselor(id);
          message.success('諮商師已成功刪除');
          onClose();
          callback();
        } catch (error) {
          console.error('刪除失敗:', error);
          message.error('刪除失敗，請稍後再試');
        }
      },
    });
  };

  return (
    <Drawer
      title={
        <Space>
          <UserOutlined />
          編輯諮商師資訊
        </Space>
      }
      width={500}
      onClose={onClose}
      visible={visible}
      footer={
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button onClick={handleDelete} danger icon={<DeleteOutlined />}>
            刪除諮商師
          </Button>
          <Space>
            <Button onClick={onClose}>
              取消
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              icon={<SaveOutlined />}
            >
              儲存變更
            </Button>
          </Space>
        </Space>
      }
    >
      <div style={{ padding: '20px 0' }}>
        {/* 諮商師基本資訊卡片 */}
        {counselorInfo && (
          <Card
            size="small"
            style={{ marginBottom: 24 }}
            title={
              <Space>
                <UserOutlined />
                諮商師資訊
              </Space>
            }
          >
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: 12 }}>
                  <Typography.Text strong>姓名：</Typography.Text>
                  <Typography.Text>
                    {counselorInfo.UserName.Name.LastName}{counselorInfo.UserName.Name.FirstName}
                  </Typography.Text>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <Typography.Text strong>暱稱：</Typography.Text>
                  <Typography.Text>{counselorInfo.UserName.NickName}</Typography.Text>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <Typography.Text strong>Email：</Typography.Text>
                  <Typography.Text>{counselorInfo.Email}</Typography.Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 12 }}>
                  <Typography.Text strong>手機：</Typography.Text>
                  <Typography.Text>{counselorInfo.Phone}</Typography.Text>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <Typography.Text strong>職稱：</Typography.Text>
                  <Typography.Text>{counselorInfo.Position}</Typography.Text>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <Typography.Text strong>專長：</Typography.Text>
                  <div>
                    {counselorInfo.Expertises?.map((expertise, index) => (
                      <Tag key={index} color="blue" size="small">
                        {expertise.Skill}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        )}

        {/* 認證狀態設定 */}
        <Card
          size="small"
          title={
            <Space>
              <CheckCircleOutlined />
              認證狀態設定
            </Space>
          }
        >
          <Form layout="vertical">
            <Form.Item label="諮商師認證狀態">
              <Space>
                <Switch
                  checkedChildren="已認證"
                  unCheckedChildren="未認證"
                  checked={verify}
                  onChange={changeVerify}
                  size="default"
                />
                <Typography.Text type={verify ? "success" : "danger"}>
                  {verify ? "已通過認證" : "未通過認證"}
                </Typography.Text>
              </Space>
              <Typography.Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
                切換此開關來變更諮商師的認證狀態。已認證的諮商師將能夠提供諮商服務。
              </Typography.Paragraph>
            </Form.Item>
          </Form>
        </Card>

        <Divider />

        {/* 警告區域 */}
        <Card size="small" style={{ borderColor: '#ffccc7', backgroundColor: '#fff2f0' }}>
          <Space>
            <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
            <div>
              <Typography.Text strong style={{ color: '#ff4d4f' }}>
                危險操作
              </Typography.Text>
              <Typography.Paragraph style={{ margin: '4px 0 0 0', color: '#ff4d4f' }}>
                刪除諮商師將永久移除其所有資料，包括個人資訊、預約記錄等。此操作無法復原。
              </Typography.Paragraph>
            </div>
          </Space>
        </Card>
      </div>
    </Drawer>
  );
};

const Counselor = () => {
  const { Header, Content, Footer, Sider } = Layout;
  const formatter = (value) => <CountUp end={value} separator=" ," suffix="  位" />;
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState(null);
  const [userData, setUserData] = useState();
  const [userCount, setUserCount] = useState(0);
  const [permiun, setPermiun] = useState(0);
  const [active, setActive] = useState(0);
  const [currentSelectCounselorId, setCurrentSelectCounselorId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detail, setDetail] = useState("");

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

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const columns = [
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <Button type="primary" onClick={() => handleEdit(record.id)}>
          編輯
        </Button>
      ),
    },
    {
      title: "頭像",
      dataIndex: "photo",
      key: "photo",
      render: (url) => (
        <Image crossOrigin="anonymous" src={url} width="70px" />
      ),
    },
    {
      title: "諮商師ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("姓名"),
      onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
      render: (text, record) => (
        <a style={{ color: "#1677FF" }} onClick={() => openModal(record.id)}>
          {text}
        </a>
      ),
    },
    {
      title: "角色",
      dataIndex: "subRole",
      key: "subRole",
      width: 120,
      sorter: (a, b) => {
        const roleA = a.subRole === "HeartCoach" ? "心教練" : "心理師";
        const roleB = b.subRole === "HeartCoach" ? "心教練" : "心理師";
        return roleA.localeCompare(roleB);
      },
      render: (text) => {
        if (text === "HeartCoach") {
          return "心教練";
        } else {
          return "心理師";
        }
      },
    },
    {
      title: "暱稱",
      dataIndex: "nickname",
      key: "nickname",
      ...getColumnSearchProps("暱稱"),
      onFilter: (value, record) => record.nickname.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("Email"),
      onFilter: (value, record) => record.email.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "專長",
      key: "expertises",
      dataIndex: "expertises",
      render: (tags) => (
        <span>
          {tags.map((tag) => {
            const colors = ['pink', 'red', 'yellow', 'orange', 'cyan', 'green', 'blue', 'purple', 'geekblue', 'magenta', 'volcano', 'gold', 'lime'];
            const hash = tag.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
            const color = colors[hash % colors.length];
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
    {
      title: "帳號",
      dataIndex: "account",
      key: "account",
    },
    {
      title: "最後登入日期",
      dataIndex: "LatestLoginTime",
      key: "LatestLoginTime",
      defaultSortOrder: "descend",
      sorter: (a, b) =>
        moment(b.LatestLoginTime).unix() - moment(a.LatestLoginTime).unix(),
    },
    {
      title: "是否通過認證",
      dataIndex: "isverify",
      key: "isverify",
      render: (text) => {
        if (text === "已認證") {
          return <span><CheckCircleOutlined style={{ color: 'green' }} /> {text}</span>;
        } else {
          return <span><CloseCircleOutlined style={{ color: 'red' }} /> {text}</span>;
        }
      },
    },

  ];

  const fetchData = async () => {
    const result = await counselorService.getAllCounselorInfo(false);

    console.log(result);

    const form = result?.map((u) => {
      return {
        id: u.ID,
        name: u.UserName.Name.LastName + u.UserName.Name.FirstName,
        email: u.Email,
        expertises: u.Expertises.map((r) => r.Skill),
        photo: u.Photo == "" ? img_account : u.Photo,
        account: u.Email,
        isverify: u.IsVerify ? "已認證" : "未認證",
        LatestLoginTime:u.LatestLoginTime,
        subRole: u.SubRole
      };
    });
    setUserData(form);
    setUserCount(result.length);
  };
  const [currentSelectCounselor, setCurrentSelectCounselor] = useState({});
  const [
    currentSelectCounselorAppointmentTime,
    setcurrentSelectCounselorAppointmentTime,
  ] = useState({});
  const [
    currentSelectCounselorAppointments,
    setCurrentSelectCounselorAppointments,
  ] = useState({});
  const openModal = async (id) => {
    const res = await counselorService.getCounselorInfoById(id);
    console.log(id);
    const appointmentTime = await counselorService.getAppointmentTimeById(id);
    console.log(appointmentTime);
    const counselorAppointments =
      await appointmentService.getAppointmentsByCounselorId(id);
    setcurrentSelectCounselorAppointmentTime(appointmentTime);
    setCurrentSelectCounselorAppointments(counselorAppointments);
    console.log(counselorAppointments);
    setCurrentSelectCounselor(res);
    createDescription(res);
    console.log(id);

    setIsModalOpen(true);
    console.log(res);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id) => {
    console.log(id);
    setCurrentSelectCounselorId(id);
    setVisible(true);
  };

  const handleClose = () => {
    setRecord(null);
    setVisible(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleMenuClick = (e) => {
    createDescription();
  };
  function dateCellRender(value) {

    const matchingData = currentSelectCounselorAppointments?.filter(
      (item) => item.Time.Date === value.format("YYYY-MM-DD")
    );
    console.log(matchingData);
    if (matchingData) {
      const periodList = matchingData.map((m, index) => (
        <li key={index}>
          <Badge.Ribbon text={m.Service.Type.Label.slice(0, 4) } placement="end" color= {m.Status=="COMPLETED"?"":"green"}>
            <Card  size="small" >
              <br></br>

              { (m.Status=="COMPLETED"?"已完成":"") +
                  m.UserName.slice(0, 4) +" "+m.Time.StartTime +
                "-" +
                m.Time.EndTime}
            </Card>
          </Badge.Ribbon>
        </li>
      ));

      return (
        <div>
          <ul className="events">{periodList}</ul>
        </div>
      );
    }

    return <p>{value.format("DD")}</p>;
  }
  const items2 = [
    {
      key: `information`,
      icon: React.createElement(UserOutlined),
      label: `個人資訊`,
      children: (
        <Descriptions
          extra={<Button type="primary">Edit</Button>}
          bordered
          title="個人資訊"
          items={detail}
        />
      ),
    },
    {
      key: `appointmentTime`,
      icon: React.createElement(NotificationOutlined),
      label: `預約時間`,
      children: (
        <div>
          <h1>可預約時間</h1>
          <List
            grid={{ gutter: 16, column: 7 }}
            dataSource={currentSelectCounselorAppointmentTime?.BusinessTimes}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable={true}
                  bordered={true}
                  title={item.WeekOfDay} // 設定標題樣式
                >
                  <div style={{ flex: 2 }}>
                    <List
                      dataSource={item.Periods}
                      renderItem={(period) => (
                        <List.Item>
                          {period.StartTime} ~ {period.EndTime}
                        </List.Item>
                      )}
                    />
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      key: `appointments`,
      icon: React.createElement(LaptopOutlined),
      label: `預約`,
      children: <Calendar dateCellRender={dateCellRender} fullscreen={false} />,
    },
  ];

  const createDescription = (currentSelectCounselor) => {
    setDetail([
      {
        key: "3",
        label: "照片",
        span: 2,
        children: (
          <Image crossOrigin="anonymous"  src={currentSelectCounselor.Photo} height={150}></Image>
        ),
      },
      {
        key: "1",
        label: "姓名",
        children:
          currentSelectCounselor.UserName.Name.LastName +
          currentSelectCounselor.UserName.Name.FirstName,
      },
      {
        key: "2",
        label: "暱稱",
        children: currentSelectCounselor.UserName.NickName,
      },

      {
        key: "3",
        label: "Email",
        children: currentSelectCounselor.Email,
      },
      {
        key: "5",
        label: "手機",

        children: currentSelectCounselor.Phone,
      },
      {
        key: "20",
        label: "語言",
        children: currentSelectCounselor?.Languages?.map((r) => (
          <Tag color="magenta" key={r}>{r}</Tag>
        )),
      },
      {
        key: "13",
        label: "地點",
        children: currentSelectCounselor.Location,
      },
      {
        key: "8",
        label: "學歷",

        children: currentSelectCounselor.Educational,
      },
      {
        key: "10",
        label: "職稱",
        children: currentSelectCounselor.Position,
      },
      {
        key: "7",
        label: "經歷",

        children: currentSelectCounselor.Seniority,
      },
      {
        key: "14",
        label: "從業時間",
        children: currentSelectCounselor.Accumulative + "+",
      },

      {
        key: "6",
        label: "認證狀態",

        children: (
          <Badge
            status="processing"
            text={currentSelectCounselor.IsVerify ? "已認證" : "未認證"}
          />
        ),
      },
      {
        key: "9",
        label: "機構資訊",

        children: currentSelectCounselor.InstitutionTemp,
      },
      {
        key: "21",
        label: "身分",
        children: currentSelectCounselor.SubRole === "HeartCoach" ? "心教練" : "心理師",
      },

      {
        key: "16",
        label: "服務類別",
        children: currentSelectCounselor.ConsultingFees.map((r) => {
          return (
            <Tag color="blue">
              {r.Type.Label}
              {r.Time}分鐘{r.Fee}元<br />
            </Tag>
          );
        }),
        span: 3,
      },
      {
        key: "17",
        label: "專長",
        children: currentSelectCounselor.Expertises.map((r) => {
          return (
            <Tag color="green">
              {r.Skill}
              <br />
            </Tag>
          );
        }),
      },
      {
        key: "18",
        label: "證照",
        children: (
          <>
            <Tag color="purple">
              發照單位:{currentSelectCounselor.License.LicenseIssuing}
            </Tag>
            <Tag color="purple">
              證照號碼:{currentSelectCounselor.License.LicenseNumber}
            </Tag>
            <Tag color="purple">
              證照名稱:{currentSelectCounselor.License.LicenseTitle}
            </Tag>
          </>
        ),
      },
      {
        key: "19",
        label: "性別",
        children: currentSelectCounselor.Gender,
      },

      {
        key: "10",
        label: "地址",
        children: currentSelectCounselor.Address,
        span: 3,
      },
      {
        key: "15",
        label: "專長描述",
        children: currentSelectCounselor.ExpertisesInfo,
        span: 3,
      },
      {
        key: "11",
        label: "自我介紹(簡短)",
        span: 3,
        children: currentSelectCounselor.ShortIntroduction,
      },
      {
        key: "12",
        label: "自我介紹(長)",
        span: 3,
        children: currentSelectCounselor.LongIntroduction,
      },
    ]);
  };

  return (
    <>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Card>
            <div>
              <span>已加入的諮商師數量：</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                <CountUp end={userCount} separator="," />
              </span>
              {' '}位
            </div>
          </Card>
        </Col>
      </Row>
      <Table columns={columns} dataSource={userData} />
      <DrawerForm
        id={currentSelectCounselorId}
        callback={fetchData}
        visible={visible}
        onClose={handleClose}
        record={record}
      />
      <Modal
        title="諮商師詳情"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={1200}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "80vh", overflow: "auto" }}
      >
        <CounselorDetailModal counselorData={detail} counselorPhoto={Array.isArray(detail) ? detail.find(item => item.key === "3")?.children : null} />
      </Modal>
    </>
  );
};

export default Counselor;
