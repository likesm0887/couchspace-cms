import React, { useEffect, useState } from "react";
import { Drawer, Button, Table, Statistic } from "antd";
import { memberService } from "../../../service/ServicePool";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CountUp from "react-countup";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
const DrawerForm = ({ visible, onClose, record }) => {
  // Define state for the form fields
  const [name, setName] = useState(record?.name || "");
  const [nickname, setNickname] = useState(record?.nickname || "");
  const [photo, setPhoto] = useState(record?.photo || "");
  const [account, setAccount] = useState(record?.account || "");
  const [birthdate, setBirthdate] = useState(record?.birthdate || "");
  const [membership, setMembership] = useState(record?.membership || "");
  // Clear form fields
  const clearFields = () => {
    setName("");
    setNickname("");
    setPhoto("");
    setAccount("");
    setBirthdate("");
    setMembership("");
  };

  // Handle form submission
  const handleSubmit = () => {
    const formData = {
      name,
      nickname,
      photo,
      account,
      birthdate,
      membership,
    };

    // Send form data to backend and close drawer
    console.log(formData);
    onClose();
    clearFields();
  };

  return (
    <Drawer
      title={record ? "Edit User" : "Add User"}
      width={400}
      onClose={onClose}
      visible={visible}
    >
      <label>Membership:</label>
      <input
        type="text"
        value={membership}
        onChange={(e) => setMembership(e.target.value)}
      />
      <br />
      <Button onClick={handleSubmit}>{record ? "Save" : "Submit"}</Button>
    </Drawer>
  );
};

const UserPage = () => {
  const formatter = (value) => <CountUp end={value} separator="," />;
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState(null);
  const [userData, setUserData] = useState();
  const [userCount, setUserCount] = useState(0);
  const [permiun, setPermiun] = useState(0);
  const [active, setActive] = useState(0);
  const columns = [
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button type="primary" onClick={handleEdit}>
          編輯
        </Button>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Nickname",
      dataIndex: "nickname",
      key: "nickname",
    },
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      render: (url) => (
        <img crossOrigin="anonymous" src={(url = url == null ? "" : url)} style={{ width: "100px" }} />
      ),
    },
    {
      title: "Account",
      dataIndex: "account",
      key: "account",
    },
    {
      title: "Birthdate",
      dataIndex: "birthdate",
      key: "birthdate",
    },
    {
      title: "Membership",
      dataIndex: "membership",
      key: "membership",
      // 產生字母首字ASCLL 相比
      sorter: (a, b) => (a == "premium" ? 1 : 0) - (b == "free" ? 0 : 1),
    },
  ];

  useEffect(() => {
    const activeUserCount = async () => {
      const result = await memberService.getActiveUserCount();
      setActive(result);
    };
    const fetchData = async () => {
      const result = await memberService.getGetAllUser();
      console.log(result);

      const form = result.map((u) => {
        return {
          name: u.information.user_name.nick_name,
          photo: u.photo,
          account: u.mail,
          birthdate: u.birthdate,
          membership: u.membership.level == "premium" ? "premium" : "free",
        };
      });
      console.log(form);
      // 找出result.membership.level===permiun的數量，用lambda
      setUserData(form);
      setUserCount(result.length);
      setPermiun(
        result.filter((result) => result.membership.level === "premium").length
      );
    };
    fetchData();
    activeUserCount();
  }, []);

  const handleEdit = (data) => {
    setRecord(data);
    setVisible(true);
  };

  const handleClose = () => {
    setRecord(null);
    setVisible(false);
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

    return (
      <Button
        style={{
          backgroundColor: "#f5a623", // 橘黃色背景
          borderColor: "#f5a623", // 邊框顏色
          color: "#fff", // 白色字體
          margin: 16,
          borderRadius: "5px", // 圓角邊框
          padding: "0px 5px 0px 5px ", // 按鈕內邊距
        }}
        icon={<DownloadOutlined />} // 如果你有使用 icon
        onClick={handleExport}
      >
        下載報表
      </Button>
    );
  };
  return (
    <>
      <ExportButton
        style={{
          width: "100px",
          backgroundColor: "#f5a623", // 橘黃色背景
          borderColor: "#f5a623", // 邊框顏色
          color: "#fff", // 白色字體
          borderRadius: "5px", // 圓角邊框
          padding: "6px 16px", // 按鈕內邊距
          fontWeight: "bold", // 粗體字
        }}
        data={userData}
      >
        下載報表
      </ExportButton>
      <Statistic
        title="Register Users"
        value={userCount}
        formatter={formatter}
      />
      <Statistic title="Permium Users" value={permiun} formatter={formatter} />
      <Statistic title="Active Users" value={active} formatter={formatter} />
      <Table columns={columns} dataSource={userData} />
      <DrawerForm visible={visible} onClose={handleClose} record={record} />
    </>
  );
};

export default UserPage;
