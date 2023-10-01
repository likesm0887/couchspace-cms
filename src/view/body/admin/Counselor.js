import React, { useEffect, useState } from "react";
import { Drawer, Button, Table, Statistic, Switch } from "antd";
import { counselorService } from "../../../service/ServicePool";
import CountUp from "react-countup";
import { async } from "@firebase/util";
const DrawerForm = ({ id, visible, onClose, record,callback }) => {
  // Define state for the form fields
  const [name, setName] = useState(record?.name || "");
  const [nickname, setNickname] = useState(record?.nickname || "");
  const [photo, setPhoto] = useState(record?.photo || "");
  const [account, setAccount] = useState(record?.account || "");
  const [birthdate, setBirthdate] = useState(record?.birthdate || "");
  const [membership, setMembership] = useState(record?.membership || "");
  const [verify, setVerify] = useState(false);
  // Clear form fields
  const clearFields = () => {
    setName("");
    setNickname("");
    setPhoto("");
    setAccount("");
    setBirthdate("");
    setMembership("");
  };
  const changeVerify = (e) => {
   
    setVerify(e);
    console.log(e)
  };

  useEffect(() => {
    console.log("JIJI")
    const getCounselorVerify = async () => {
      const isVerify = await counselorService.getCounselorVerify(id);
      console.log(isVerify)
      setVerify(isVerify);
    };
    getCounselorVerify();
    console.log("HIHIH");
  }, [id]);


  // Handle form submission
  const handleSubmit = async () => {
    console.log(verify)
    await counselorService.setCounselorVerify(id, verify);
    onClose();
    callback();
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
      <br />
      <Switch checked={verify} onChange={changeVerify} />
      <Button onClick={handleSubmit}>{record ? "Save" : "Submit"}</Button>
    </Drawer>
  );
};


const Counselor = () => {
  
  const formatter = (value) => <CountUp end={value} separator="," />;
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState(null);
  const [userData, setUserData] = useState();
  const [userCount, setUserCount] = useState(0);
  const [permiun, setPermiun] = useState(0);
  const [active, setActive] = useState(0);
  const [currentSelectCounselorId, setCurrentSelectCounselorId] = useState("");
  


  
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
        <img src={(url = url == null ? "" : url)} style={{ width: "100px" }} />
      ),
    },
    {
      title: "Account",
      dataIndex: "account",
      key: "account",
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
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
        photo: u.Photo,
        account: u.Email,
        isverify: u.IsVerify ? "Y" : "N",
      };
    });
    setUserData(form);
    setUserCount(result.length);
  }
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
    </>
  );
};

export default Counselor;
