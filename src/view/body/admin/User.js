import React, { useEffect, useState } from "react";
import { Drawer, Button, Table } from 'antd';
import { memberService } from "../../../service/ServicePool";


const DrawerForm = ({ visible, onClose, record }) => {
  // Define state for the form fields
  const [name, setName] = useState(record?.name || '');
  const [nickname, setNickname] = useState(record?.nickname || '');
  const [photo, setPhoto] = useState(record?.photo || '');
  const [account, setAccount] = useState(record?.account || '');
  const [birthdate, setBirthdate] = useState(record?.birthdate || '');
  const [membership, setMembership] = useState(record?.membership || '');
  
  // Clear form fields
  const clearFields = () => {
    setName('');
    setNickname('');
    setPhoto('');
    setAccount('');
    setBirthdate('');
    setMembership('');
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
      title={record ? 'Edit User' : 'Add User'}
      width={400}
      onClose={onClose}
      visible={visible}
    >
     
      <label>Membership:</label>
      <input type="text" value={membership} onChange={(e) => setMembership(e.target.value)} />
      <br />
      <Button onClick={handleSubmit}>{record ? 'Save' : 'Submit'}</Button>
    </Drawer>
  );
};

const UserPage = () => {
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState(null);
  const [userData, setUserData] = useState();
  const columns = [
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button type="primary"  onClick={handleEdit}>
          編輯
        </Button>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Nickname',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: 'Photo',
      dataIndex: 'photo',
      key: 'photo',
      render: (url) => <img src={url} alt="avatar" style={{ width: '100px' }} />,
    },
    {
      title: 'Account',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: 'Birthdate',
      dataIndex: 'birthdate',
      key: 'birthdate',
    },
    {
      title: 'Membership',
      dataIndex: 'membership',
      key: 'membership',
    },
    
  ];
  
  useEffect(() => {
    
    const fetchData = async () => {
      const result = await memberService.getGetAllUser();
      {
        
      }
      setUserData(result.data);
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
      
      <Table columns={columns} dataSource={userData} />
      <DrawerForm visible={visible} onClose={handleClose} record={record} />
    </>
  );
};

export default UserPage;
