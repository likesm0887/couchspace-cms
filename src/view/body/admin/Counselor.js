import React, { useEffect, useState } from "react";
import {
  Drawer,
  Button,
  Table,
  Statistic,
  Switch,
  Tag,
  Modal,
  Menu,
  Image,
  Calendar,
  Space,
} from "antd";
import { Layout, theme, Descriptions, Badge, Outlet } from "antd";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { counselorService } from "../../../service/ServicePool";
import CountUp from "react-countup";
import img_account from "../../img/login/account.svg";
const DrawerForm = ({ id, visible, onClose, record, callback }) => {
  // Define state for the form fields

  const [verify, setVerify] = useState(false);
  // Clear form fields

  const changeVerify = (e) => {
    setVerify(e);
    console.log(e);
  };

  useEffect(() => {
    console.log("JIJI");
    const getCounselorVerify = async () => {
      const isVerify = await counselorService.getCounselorVerify(id);
      console.log(isVerify);
      setVerify(isVerify);
    };
    getCounselorVerify();
    console.log("HIHIH");
  }, [id]);

  // Handle form submission
  const handleSubmit = async () => {
    console.log(verify);
    await counselorService.setCounselorVerify(id, verify);
    onClose();
    callback();
  };

  return (
    <Drawer
      title={record ? "Edit User" : "Add User"}
      width={400}
      onClose={onClose}
      visible={visible}
    >
      <label>Membership:</label>
      <br />
      <Switch checked={verify} onChange={changeVerify} />
      <Space>
        <Button onClick={handleSubmit}>{record ? "Save" : "儲存"}</Button>
      </Space>
    </Drawer>
  );
};

const Counselor = () => {
  const { Header, Content, Footer, Sider } = Layout;
  const formatter = (value) => <CountUp end={value} separator="," />;
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState(null);
  const [userData, setUserData] = useState();
  const [userCount, setUserCount] = useState(0);
  const [permiun, setPermiun] = useState(0);
  const [active, setActive] = useState(0);
  const [currentSelectCounselorId, setCurrentSelectCounselorId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const columns = [
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button type="primary" onClick={() => handleEdit(record.id)}>
          編輯
        </Button>
      ),
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <a style={{ color: "#1677FF" }} onClick={() => openModal(record.id)}>
          {text}
        </a>
      ),
    },
    {
      title: "Nickname",
      dataIndex: "nickname",
      key: "nickname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      render: (url) => (
        <img src={url} style={{ width: "80px", height: "100px" }} />
      ),
    },
    {
      title: "Expertises",
      key: "expertises",
      dataIndex: "expertises",
      render: (tags) => (
        <span>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
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
      title: "Account",
      dataIndex: "account",
      key: "account",
    },

    {
      title: "是否通過認證",
      dataIndex: "isverify",
      key: "isverify",
    },
  ];

  const fetchData = async () => {
    const result = await counselorService.getAllCounselorInfo(false);
    console.log(result);

    const form = result.map((u) => {
      return {
        id: u.ID,
        name: u.UserName.Name.LastName + u.UserName.Name.FirstName,
        email: u.Email,
        expertises: u.Expertises.map((r) => r.Skill),
        photo: u.Photo == "" ? img_account : u.Photo,
        account: u.Email,
        isverify: u.IsVerify ? "Y" : "N",
      };
    });
    setUserData(form);
    setUserCount(result.length);
  };
  const [currentSelectCounselor, setCurrentSelectCounselor] = useState({});
  const openModal = async (id) => {
    console.log(id);
    const res = await counselorService.getCounselorInfoById(id);
    setIsModalOpen(true);
    console.log(res);
    setCurrentSelectCounselor(res);
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
    console.log(e.key);
    setSelectedCategory(e.key);
  };
  const items2 = [
    {
      key: `information`,
      icon: React.createElement(UserOutlined),
      label: `個人資訊`,
    },
    {
      key: `appointmentTime`,
      icon: React.createElement(NotificationOutlined),
      label: `預約時間`,
    },
    {
      key: `appointments`,
      icon: React.createElement(LaptopOutlined),
      label: `預約`,
    },
  ];

  const onPanelChange = (value, mode) => {
    console.log(value.format("YYYY-MM-DD"), mode);
  };
  const renderContent = () => {
    console.log(selectedCategory);
    if (selectedCategory === "information") {
      const items = [
        {
          key: "3",
          label: "照片",
          span: 2,
          children: (
            <Image src={currentSelectCounselor.Photo} height={100}></Image>
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
          children: currentSelectCounselor.Languages.map((r) => {
            if (r == "EN") {
              return <Tag color="magenta">英文</Tag>;
            }
            if (r == "ZH") {
              return <Tag color="magenta">中文</Tag>;
            }
            if (r == "NAN") {
              return <Tag color="magenta">台語</Tag>;
            }
            if (r == "YUE") {
              return <Tag color="magenta">粵語</Tag>;
            }
          }),
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
              text={currentSelectCounselor.isVerify ? "已認證" : "未認證"}
            />
          ),
        },
        {
          key: "9",
          label: "機構資訊",

          children: currentSelectCounselor.InstitutionTemp,
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
              <Tag color='purple'>
                發照單位:{currentSelectCounselor.License.LicenseIssuing}
              </Tag>
              <Tag color='purple'>
                證照號碼:{currentSelectCounselor.License.LicenseNumber}
              </Tag>
              <Tag color='purple'>
                證照名稱:{currentSelectCounselor.License.LicenseTitle}
              </Tag>
            </>
          ),
        },
        {
          key: "19",
          label: "性別",
          children: currentSelectCounselor.Gender == "MALE" ? "男" : "女",
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
      ];
      console.log(selectedCategory);
      return (
        <div>
          <Descriptions
            extra={<Button type="primary">Edit</Button>}
            bordered
            title="個人資訊"
            items={items}
          />
        </div>
      );
    } else if (selectedCategory === "appointments") {
      return <Calendar onPanelChange={onPanelChange}></Calendar>;
    }
    // Add more conditions for other menu items if needed
  };
  return (
    <>
      <Statistic
        title="Register Users"
        value={userCount}
        formatter={formatter}
      />
      <Statistic title="Permium Users" value={permiun} formatter={formatter} />
      <Statistic title="Active Users" value={active} formatter={formatter} />
      <Table columns={columns} dataSource={userData} />
      <DrawerForm
        id={currentSelectCounselorId}
        callback={fetchData}
        visible={visible}
        onClose={handleClose}
        record={record}
      />
      <Modal
        title="Information"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{ top: 20 }} // 设置高度为80%视窗高度
        width={"80%"}
        bodyStyle={{ height: "500px" }}
      >
        <Layout>
          <Layout>
            <Sider width={200} style={{ background: colorBgContainer }}>
              <Menu
                onClick={handleMenuClick}
                mode="inline"
                defaultSelectedKeys={["0"]}
                defaultOpenKeys={["information"]}
                style={{ height: "100%", borderRight: 0 }}
                items={items2}
              />
            </Sider>
            <Layout style={{ background: colorBgContainer, overflowY: "auto" }}>
              <Content
                style={{
                  background: colorBgContainer,
                  padding: 0,
                  margin: 10,
                  minHeight: 400,
                  maxHeight: 400,
                }}
              >
                {renderContent()}
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </Modal>
    </>
  );
};

export default Counselor;
