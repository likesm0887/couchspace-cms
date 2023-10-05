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
  Calendar,
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
      <Button onClick={handleSubmit}>{record ? "Save" : "Submit"}</Button>
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
        <a style={{ color: "#1677FF" }} onClick={() => setIsModalOpen(true)}>
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
    const result = await counselorService.getAllCounselorInfo();
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
  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id) => {
    console.log(id);
    setCurrentSelectCounselorId(id);
    //setRecord(data);
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
    console.log(e.key)
    setSelectedCategory(e.key);
  };
  const items2 = [
    {
      key: `information`,
      icon: React.createElement(UserOutlined),
      label: `Information`,
    },
    {
      key: `AppointmentTime`,
      icon: React.createElement(NotificationOutlined),
      label: `Appointment Time`,
    },
    {
      key: `appointments`,
      icon: React.createElement(LaptopOutlined),
      label: `Appointments`,
    },
  ];

  const items = [
    {
      key: "1",
      label: "Product",
      children: "Cloud Database",
    },
    {
      key: "2",
      label: "Billing Mode",
      children: "Prepaid",
    },
    {
      key: "3",
      label: "Automatic Renewal",
      children: "YES",
    },
    {
      key: "4",
      label: "Order time",
      children: "2018-04-24 18:00:00",
    },
    {
      key: "5",
      label: "Usage Time",
      span: 2,
      children: "2019-04-24 18:00:00",
    },
    {
      key: "6",
      label: "Status",
      span: 3,
      children: <Badge status="processing" text="Running" />,
    },
    {
      key: "7",
      label: "Negotiated Amount",
      children: "$80.00",
    },
    {
      key: "8",
      label: "Discount",
      children: "$20.00",
    },
    {
      key: "9",
      label: "Official Receipts",
      children: "$60.00",
    },
    {
      key: "10",
      label: "Config Info",
      children: (
        <>
          Data disk type: MongoDB
          <br />
          Database version: 3.4
          <br />
          Package: dds.mongo.mid
          <br />
          Storage space: 10 GB
          <br />
          Replication factor: 3
          <br />
          Region: East China 1
          <br />
        </>
      ),
    },
  ];
  const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };
  const renderContent = () => {
    console.log(selectedCategory);
    if (selectedCategory === "information") {
      console.log(selectedCategory);
      return <div>
        <Descriptions
          extra={<Button type="primary">Edit</Button>}
          bordered
          title="User Info"
          items={items}
        />
      </div>;
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
        bodyStyle={{ height: "55vh" }}
      >
        <Layout>
          <Layout>
            <Sider width={200} style={{ background: colorBgContainer }}>
              <Menu
                onClick={handleMenuClick}
                mode="inline"
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
               
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
                  minHeight: 300,
                  maxHeight: 450,
                }}
              >
                { renderContent()}
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </Modal>
    </>
  );
};

export default Counselor;
