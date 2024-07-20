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
  Tabs,
  Image,
  List,
  Form,
  Card,
  message,
  Tooltip,
  Calendar,
  Select,
  Space,
  Input,
} from "antd";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Layout, theme, Descriptions, Badge, Outlet } from "antd";
import "./counselor.css";
import moment from "moment";
import { CopyOutlined } from "@ant-design/icons";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {
  memberService,
  appointmentService,
  counselorService,
} from "../../../service/ServicePool";
import CountUp from "react-countup";
import img_account from "../../img/login/account.svg";
import { fontFamily } from "@mui/system";
const DrawerForm = ({ id, visible, onClose, record, callback }) => {
  // Define state for the form fields
  const [form] = Form.useForm();
  const [verify, setVerify] = useState(false);

  // Clear form fields

  const changeVerify = (e) => {
    setVerify(e);
    console.log(e);
  };

  useEffect(() => {
    console.log(id);
    const getCounselorVerify = async () => {
      const isVerify = await counselorService.getCounselorVerify(id);
      console.log(isVerify);
      setVerify(isVerify);
    };
    getCounselorVerify();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (value) => {
    console.log(value);
    console.log(id);
    let time = {
      AppointmentId: id,
      Date: value.date,
      StartTime: value.startTime,
      EndTime: value.endTime,
    };
    appointmentService.changeAppointmentTime(time).then((e) => {
      message.success("修改成功");
    });

    onClose();
    callback();
  };

  return (
    <Drawer title={"Edit"} width={400} onClose={onClose} visible={visible}>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item name="date" label="日期" rules={[{ required: true }]}>
          <Input placeholder="2022-05-06" />
        </Form.Item>
        <Form.Item
          name="startTime"
          label="起始時間"
          rules={[{ required: true }]}
        >
          <Input placeholder="09:00" />
        </Form.Item>
        <Form.Item name="endTime" label="結束時間" rules={[{ required: true }]}>
          <Input placeholder="10:00" />
        </Form.Item>
        <br />
        {/* <label>Membership:</label> */}
        {/* <Switch
        checkedChildren="已認證"
        unCheckedChildren="未認證"
        checked={verify}
        onChange={changeVerify}
      /> */}
        <Space>
          <Button onClick={() => form.submit()}>
            {record ? "Save" : "儲存"}
          </Button>
        </Space>
      </Form>
    </Drawer>
  );
};

const Appointments = () => {
  const { Option } = Select;
  const { Header, Content, Footer, Sider } = Layout;
  const formatter = (value) => <CountUp end={value} separator="," />;
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState();
  const [userData, setUserData] = useState();
  const [userCount, setUserCount] = useState(0);
  const [currentSelectCounselorId, setCurrentSelectCounselorId] = useState("");
  const [currentSelectMember, setCurrentSelectMember] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [detail, setDetail] = useState("");
  const [memberDetail, setMemberDetail] = useState("");
  const [statusMap, setStatusMap] = useState({});
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };
  const clearFilters = () => {
    setFilteredInfo({});
  };
  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };
  const setAgeSort = () => {
    setSortedInfo({
      order: "descend",
      columnKey: "age",
    });
  };
  const columns = (showAdminFlag) => {
    let result = [
      {
        title: "編輯",
        key: "action",
        render: (text, record) => (
          <Button
            type="primary"
            onClick={() => handleEdit(record.AppointmentID)}
          >
            編輯
          </Button>
        ),
      },
      {
        title: "預約成立時間",
        dataIndex: "CreateDate",
        key: "CreateDate",
        sorter: (a, b) => Date.parse(a.CreateDate) - Date.parse(b.CreateDate),
      },
      {
        title: "交易單號",

        dataIndex: "AppointmentID",
        key: "AppointmentID",
        sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
        render: (text) => (
          <Tooltip title={text}>
            <span>{text.slice(-5)}</span>
          </Tooltip>
        ),
      },
      {
        title: "案主ID",
        dataIndex: "UserID",
        key: "UserID",
        render: (text, record) => (
          <div>
            <Tooltip title={text}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <a
                  style={{ color: "#1677FF", marginRight: 8 }}
                  onClick={() => openModal(record.UserID)}
                >
                  {text.slice(-5)}
                </a>
                <Button
                  type="link"
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(record.UserID)}
                />
              </div>
            </Tooltip>
          </div>
        ),
      },
      {
        title: "案主姓名",
        dataIndex: "UserName",
        key: "UserName",
      },
      {
        title: "諮商師ID",
        dataIndex: "CounselorID",
        key: "CounselorID",
        hide: true,
      },
      {
        title: "諮商師姓名",
        dataIndex: "CounselorName",
        key: "CounselorName",
        width: 120,
        render: (text, record) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <a
              style={{ color: "#1677FF", marginRight: 6 }}
              onClick={() => openModal(record.CounselorID)}
            >
              {text}
            </a>
            <Button
              type="link"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(text)}
            />
          </div>
        ),
      },
      {
        title: "預約日期",
        dataIndex: "DateTime",
        key: "DateTime",
        sorter: (a, b) => new Date(a.DateTime) - new Date(b.DateTime),
      },

      {
        title: "費用",
        dataIndex: "Fee",
        key: "Fee",
      },
      {
        title: "服務項目",
        key: "Type",
        dataIndex: "Type",
      },
      {
        title: "優惠代碼",
        key: "PromoCodeID",
        dataIndex: "PromoCodeID",
      },
      {
        title: "折扣費用",
        key: "DiscountFee",
        dataIndex: "DiscountFee",
      },
      {
        title: "預約成立時間",
        dataIndex: "CreateDate",
        key: "CreateDate",
        sorter: (a, b) => Date.parse(a.CreateDate) - Date.parse(b.CreateDate),
      },
      {
        title: "狀態",
        dataIndex: "Status",
        key: "Status",
        sorter: (a, b) => a.Status.localeCompare(b.Status, "en"),
      },
      {
        title: "標記狀態",
        dataIndex: "AdminFlag",
        key: "AdminFlag",
        hidden: showAdminFlag,
        width: 200,
        optionSelectedColor: "red",
        render: (key, record) => (
          <Select
            style={{ width: 150, color: "red" }}
            value={record.AdminFlag} // 优先显示已选择的值，否则显示原始值
            onChange={(value) =>
              handleChangeStatus(value, record.AppointmentID)
            }
          >
            <Option value="Completed">已完成</Option>
            <Option value="CounselorUnCompleted" style={{ color: "red" }}>
              諮商師未完成
            </Option>
            <Option value="UserUnCompleted" style={{ color: "red" }}>
              案主未完成
            </Option>
            <Option value="CustomerServiceProcess">平台處理</Option>
            <Option value="WaitForProcess">待處理</Option>
            <Option value="Cancelled">已取消</Option>
          </Select>
        ),
      },
    ];

    return result.filter((col) => col.dataIndex !== "CounselorID");
  };

  
  const handleChangeStatus = async (value, key) => {
    setLoading(true);
    appointmentService
      .changeAdminFlag({
        AppointmentId: key,
        AdminFlag: value,
      })
      .then((e) => {
        message.success("修改成功");
        fetchData();
      });

    setLoading(false);
  };
  function getStatusDesc(code) {
    if (code.toUpperCase() === "NEW") {
      return "訂單成立(未付款)";
    }
    if (code.toUpperCase() === "UNPAID") {
      return "訂單成立(未付款)";
    }
    if (code.toUpperCase() === "CONFIRMED") {
      return "已確認";
    }
    if (code.toUpperCase() === "ROOMCREATED") {
      return "諮商房間已建立";
    }

    if (code.toUpperCase() === "CANCELLED") {
      return "已取消";
    }

    if (code.toUpperCase() === "COMPLETED") {
      return "已完成";
    }
  }
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

  const fetchData = async () => {
    const result = await appointmentService.getAllAppointmentForAdmin();

    console.log(result);

    const form = result
      ?.filter((s) => s.Status !== "CONFIRMED" && s.Status !== "ROOMCREATED")
      .map((u) => {
        return {
          AppointmentID: u.AppointmentID,
          UserEmail: "member.Email",
          UserID: u.UserID,
          UserName: u.UserName,
          CounselorID: u.CounselorID,
          CounselorName: u.CounselorName,
          DateTime: u.Time.Date + " " + u.Time.StartTime,
          Fee: u.Service.Fee,
          Type: u.Service.Type.Label,
          AdminFlag: u.AdminFlag,
          CreateDate: moment(u.CreateDate, "YYYY-MM-DD HH-mm-SS")
            .format("YYYY-MM-DD HH:mm:SS")
            .toString(),
          Status: getStatusDesc(u.Status),
        };
      });

    const form2 = result
      ?.filter((s) => s.Status == "CONFIRMED" || s.Status == "ROOMCREATED")
      .map((u) => {
        return {
          AppointmentID: u.AppointmentID,
          UserEmail: "member.Email",
          UserID: u.UserID,
          UserName: u.UserName,
          CounselorID: u.CounselorID,
          CounselorName: u.CounselorName,
          DateTime: u.Time.Date + " " + u.Time.StartTime,
          Fee: u.Service.Fee,
          PromoCodeID: u.PromoCodeID,
          DiscountFee: u.DiscountFee,
          Type: u.Service.Type.Label,
          CreateDate: moment(u.CreateDate, "YYYY-MM-DD HH-mm-SS")
            .format("YYYY-MM-DD HH:mm:SS")
            .toString(),
          Status: getStatusDesc(u.Status),
        };
      });
    setUserData(form);
    setConfirmedAppointment(form2);
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

  const openModal2 = async (id) => {
    console.log(id);
    const res = await memberService.getGetUserById(id);

    setCurrentSelectMember(res);
    setIsModal2Open(true);
    createMemberDescription(res);
    console.log(res);
  };
  const openModal = async (id) => {
    const res = await counselorService.getCounselorInfoById(id);
    console.log(id);
    const appointmentTime = await counselorService.getAppointmentTimeById(id);
    console.log(appointmentTime);
    const counselorAppointments =
      await appointmentService.getAppointmentsByCounselorIdByAdmin(id);
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
    setIsModal2Open(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModal2Open(false);
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
          <Badge.Ribbon
            text={m.Service.Type.Label.slice(0, 4)}
            placement="end"
            color={m.Status == "COMPLETED" ? "" : "green"}
          >
            <Card size="small">
              <br></br>

              {(m.Status == "COMPLETED" ? "已完成" : "") +
                m.UserName.slice(0, 4) +
                " " +
                m.Time.StartTime +
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
  const items3 = [
    {
      key: `information`,
      icon: React.createElement(UserOutlined),
      label: `個人資訊`,
      children: (
        <Descriptions
          extra={<Button type="primary">Edit</Button>}
          bordered
          title="個人資訊"
          items={memberDetail}
        />
      ),
    },
    {
      key: `appointmentTime`,
      icon: React.createElement(NotificationOutlined),
      label: `預約紀錄`,
    },
  ];
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
  const createMemberDescription = (member) => {
    setMemberDetail([
      {
        key: "3",
        label: "照片",
        span: 2,
        children: <Image src={member.Photo} height={150}></Image>,
      },
      {
        key: "1",
        label: "姓名",
        children:
          member.UserName.Name.LastName + member.UserName.Name.FirstName,
      },
      {
        key: "2",
        label: "暱稱",
        children: member.UserName.NickName,
      },

      {
        key: "3",
        label: "Email",
        children: member.Email,
      },
      {
        key: "5",
        label: "手機",

        children: member.Phone,
      },
    ]);
  };
  const createDescription = (currentSelectCounselor) => {
    setDetail([
      {
        key: "3",
        label: "照片",
        span: 2,
        children: (
          <Image src={currentSelectCounselor.Photo} height={150}></Image>
        ),
      },
      {
        key: "1",
        label: "姓名",
        children:
          currentSelectCounselor?.UserName?.Name?.LastName +
          currentSelectCounselor?.UserName?.Name?.FirstName,
      },
      {
        key: "2",
        label: "暱稱",
        children: currentSelectCounselor?.UserName?.NickName,
      },

      {
        key: "3",
        label: "Email",
        children: currentSelectCounselor?.Email,
      },
      {
        key: "5",
        label: "手機",

        children: currentSelectCounselor?.Phone,
      },
      {
        key: "20",
        label: "語言",
        children: currentSelectCounselor?.Languages?.map((r) => {
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

        children: currentSelectCounselor?.InstitutionTemp,
      },

      {
        key: "16",
        label: "服務類別",
        children: currentSelectCounselor?.ConsultingFees?.map((r) => {
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
        children: currentSelectCounselor?.Expertises?.map((r) => {
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
              發照單位:{currentSelectCounselor?.License?.LicenseIssuing}
            </Tag>
            <Tag color="purple">
              證照號碼:{currentSelectCounselor?.License?.LicenseNumber}
            </Tag>
            <Tag color="purple">
              證照名稱:{currentSelectCounselor?.License?.LicenseTitle}
            </Tag>
          </>
        ),
      },
      {
        key: "19",
        label: "性別",
        children: currentSelectCounselor?.Gender == "MALE" ? "男" : "女",
      },

      {
        key: "10",
        label: "地址",
        children: currentSelectCounselor?.Address,
        span: 3,
      },
      {
        key: "15",
        label: "專長描述",
        children: currentSelectCounselor?.ExpertisesInfo,
        span: 3,
      },
      {
        key: "11",
        label: "自我介紹(簡短)",
        span: 3,
        children: currentSelectCounselor?.ShortIntroduction,
      },
      {
        key: "12",
        label: "自我介紹(長)",
        span: 3,
        children: currentSelectCounselor?.LongIntroduction,
      },
    ]);
  };
  const ExportButton = ({ data }) => {
    const handleExport = () => {

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        "table-data.xlsx"
      );
    };

    return <Button onClick={handleExport}>下載</Button>;
  };
  return (
    <>
      <ExportButton data={userData} />
      <Statistic title="預約數量" value={userCount} formatter={formatter} />
      <Statistic
        title="即將要開始的諮商"
        value={confirmedAppointment?.length}
        formatter={formatter}
      />
      <Table
        columns={columns(true)}
        dataSource={confirmedAppointment}
        spinning={loading}
      />
      <Statistic
        title="歷史清單"
        value={userData?.length}
        formatter={formatter}
      />
      <Table
        columns={columns(false)}
        dataSource={userData}
        spinning={loading}
      />
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
            <Tabs
              defaultActiveKey={"information"}
              onChange={handleMenuClick}
              tabPosition="left"
              style={{
                height: "480px",
                borderRight: 0,
                overflowY: "auto",
                background: colorBgContainer,
              }}
              items={items2}
            />
          </Layout>
        </Layout>
      </Modal>
      <Modal
        title="Information"
        open={isModal2Open}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{ top: 20 }} // 设置高度为80%视窗高度
        width={"80%"}
        bodyStyle={{ height: "500px" }}
      >
        <Layout>
          <Layout>
            <Tabs
              defaultActiveKey={"information"}
              onChange={handleMenuClick}
              tabPosition="left"
              style={{
                height: "480px",
                borderRight: 0,
                overflowY: "auto",
                background: colorBgContainer,
              }}
              items={items3}
            />
          </Layout>
        </Layout>
      </Modal>
    </>
  );
};

export default Appointments;
