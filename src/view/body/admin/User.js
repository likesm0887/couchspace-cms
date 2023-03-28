import React, { useEffect, useState } from "react";
import { Drawer, Button, Table,Statistic } from "antd";
import { memberService } from "../../../service/ServicePool";
import CountUp from 'react-countup';
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
         <img src={url=url==null?"":url} style={{ width: "100px" }} />
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
    },
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      const result = await memberService.getGetAllUser();
      console.log(result);

      const form = result.map(u => {
        return {
          name: u.information.user_name.nick_name,
          photo: u.photo,
          account: u.mail,
          birthdate: u.birthdate,
          membership: u.membership.level =="premium"?"premium":"free",
        }
      });
      console.log(form)
// 找出result.membership.level===permiun的數量，用lambda
      setUserData(form);
      setUserCount(result.length)
      setPermiun(result.filter(result => result.membership.level === 'premium').length);
      setActive(result.filter(result => result.record.days_used >30).length);
    };
    fetchData();
  }, []);

  const handleEdit = (data) => {
    setRecord(data);
    setVisible(true);
  };

  const handleClose = () => {
    setRecord(null);
    setVisible(false);
  };

  return (
    <>
     <Statistic title="Register Users" value={userCount} formatter={formatter} />
     <Statistic title="Permium Users" value={permiun} formatter={formatter} />
     <Statistic title="Active Users" value={active} formatter={formatter} />
      <Table columns={columns} dataSource={userData} />
      <DrawerForm visible={visible} onClose={handleClose} record={record} />
    </>
  );
};

export default UserPage;
