import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Drawer, Button, Table, Statistic, Input, Space, Tooltip, message, Row, Col, Card, Modal, Typography, Image, Descriptions, Badge, Tag } from "antd";
import { memberService } from "../../../service/ServicePool";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CountUp from "react-countup";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  DownloadOutlined,
  SearchOutlined,
  CopyOutlined,
  TeamOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import AdminHeader from "./AdminHeader";
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
    message.success(record ? "用戶更新成功" : "用戶新增成功");
    onClose();
    clearFields();
  };

  useEffect(() => {
    if (record) {
      setName(record.name || "");
      setNickname(record.nickname || "");
      setPhoto(record.photo || "");
      setAccount(record.account || "");
      setBirthdate(record.birthdate || "");
      setMembership(record.membership || "");
    } else {
      clearFields();
    }
  }, [record]);

  return (
    <Drawer
      title={
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
          {record ? "編輯用戶" : "新增用戶"}
        </div>
      }
      width={480}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ padding: '24px' }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            {record ? "儲存" : "新增"}
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>姓名：</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="請輸入姓名"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>暱稱：</label>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="請輸入暱稱"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>頭像URL：</label>
          <Input
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            placeholder="請輸入頭像URL"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>帳號：</label>
          <Input
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="請輸入帳號"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>生日：</label>
          <Input
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            placeholder="請輸入生日 (YYYY-MM-DD)"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>會員等級：</label>
          <Input
            value={membership}
            onChange={(e) => setMembership(e.target.value)}
            placeholder="請輸入會員等級"
          />
        </div>
      </div>
    </Drawer>
  );
};

// UserDetailModal 組件 - 用戶詳情模態框
const UserDetailModal = ({ userData, userPhoto }) => {
  if (!userData || userData.length === 0) {
    return <div>載入中...</div>;
  }

  // 將Descriptions items轉換為對象格式供顯示
  const userInfo = userData.reduce((acc, item) => {
    acc[item.key] = item;
    return acc;
  }, {});

  return (
    <div style={{ padding: "16px", backgroundColor: "#f5f5f5" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", padding: "16px", backgroundColor: "#fff", borderRadius: "8px" }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            用戶詳情
            {userInfo["membership"] && (
              <div style={{ marginTop: "8px" }}>
                <Tag color={userInfo["membership"]?.children === "Premium" ? "gold" : "blue"} style={{ fontSize: "14px", padding: "4px 12px" }}>
                  {userInfo["membership"]?.children}
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
                {userPhoto ? (
                  <div>
                    {userPhoto}
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
                  {userInfo["1"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="暱稱">
                  {userInfo["2"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label={<Space><MailOutlined />Email</Space>}>
                  {userInfo["3"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label={<Space><CalendarOutlined />生日</Space>}>
                  {userInfo["4"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="年齡">
                  {userInfo["5"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="性別">
                  {userInfo["6"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label={<Space><PhoneOutlined />手機</Space>}>
                  {userInfo["7"]?.children}
                </Descriptions.Item>
                <Descriptions.Item label="會員等級">
                  {userInfo["membership"]?.children}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        {/* 地址資訊 */}
        {(userInfo["8"] || userInfo["9"]) && (
          <Card title="地址資訊" bordered={false}>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="地址" span={2}>
                {userInfo["8"]?.children}
              </Descriptions.Item>
              <Descriptions.Item label="郵遞區號">
                {userInfo["9"]?.children}
              </Descriptions.Item>
              <Descriptions.Item label="用戶ID">
                {userInfo["userId"]?.children}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </Space>
    </div>
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserDetail, setCurrentUserDetail] = useState([]);
  const [currentUserPhoto, setCurrentUserPhoto] = useState(null);

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
  const columns = [
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <Button type="primary" onClick={() => handleEdit(record)}>
          編輯
        </Button>
      ),
    },
    {
      title: "用戶ID",
      dataIndex: "userId",
      key: "userId",
      render: (text, record) => (
        <div>
          <Tooltip title={text}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <a
                style={{ color: "#1677FF", marginRight: 8, cursor: "pointer" }}
                onClick={() => openUserModal(record.userId)}
              >
                {text?.slice(-5)}
              </a>
              <Button
                type="link"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(record.userId)}
              />
            </div>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("姓名"),
      onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "暱稱",
      dataIndex: "nickname",
      key: "nickname",
      ...getColumnSearchProps("暱稱"),
      onFilter: (value, record) => record.nickname.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "頭像",
      dataIndex: "photo",
      key: "photo",
      width: 120,
      render: (url) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Image
            crossOrigin="anonymous"
            src={url || "https://couchspace.blob.core.windows.net/prod-user-photo/default_profile.png"}
            width={60}
            height={60}
            style={{
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #f0f0f0'
            }}
            fallback="https://couchspace.blob.core.windows.net/prod-user-photo/default_profile.png"
          />
        </div>
      ),
    },
    {
      title: "帳號",
      dataIndex: "account",
      key: "account",
      ...getColumnSearchProps("帳號"),
      onFilter: (value, record) => record.account.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "生日",
      dataIndex: "birthdate",
      key: "birthdate",
      sorter: (a, b) => new Date(b.birthdate) - new Date(a.birthdate),
      defaultSortOrder: 'descend',
    },
    {
      title: "會員等級",
      dataIndex: "membership",
      key: "membership",
      sorter: (a, b) => {
        const membershipA = a.membership || "Free";
        const membershipB = b.membership || "Free";
        console.log('Sorting membership:', membershipA, membershipB);

        // Premium 排在前面
        if (membershipA === "Premium" && membershipB === "Free") return -1;
        if (membershipA === "Free" && membershipB === "Premium") return 1;
        return 0; // 相同等級保持原順序
      },
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'descend',
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
          userId: u.user_id || u.id || u.userId || "", // Assuming there's an ID field
          name: u.information.user_name.name ? `${u.information.user_name.name.last_name || ''}${u.information.user_name.name.first_name || ''}`.trim() : '',
          nickname: u.information.user_name.nick_name,
          photo: u.information.photo,
          account: u.mail,
          birthdate: u.information.birthday || u.birthdate,
          membership: u.membership.level == "premium" ? "Premium" : "Free",
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

  const openUserModal = async (userId) => {
    // 清空之前的數據，確保不會顯示舊的照片
    setCurrentUserDetail([]);
    setCurrentUserPhoto(null);

    try {
      const userInfo = await memberService.getGetUserById(userId);
      console.log("User info:", userInfo);
      console.log("Photo URL:", userInfo?.information?.photo || userInfo?.Photo || userInfo?.photo);
      createUserDescription(userInfo, userId);
      setIsModalOpen(true);
    } catch (error) {
      console.error('獲取用戶資訊失敗:', error);
      message.error('獲取用戶資訊失敗');
    }
  };

  const createUserDescription = (userInfo, userId) => {
    const fullName = userInfo.UserName?.Name ?
      `${userInfo.UserName.Name.LastName || ''}${userInfo.UserName.Name.FirstName || ''}`.trim() :
      "未設定";

    const userDetail = [
      {
        key: "photo",
        label: "頭像",
        span: 2,
        children: (
            <Image
              crossOrigin="anonymous"
              src={userInfo.Photo || userInfo.photo || "https://couchspace.blob.core.windows.net/prod-user-photo/default_profile.png"}
              height={120}
              width={120}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
              fallback="https://couchspace.blob.core.windows.net/prod-user-photo/default_profile.png"
            />
        ),
      },
      {
        key: "1",
        label: "姓名",
        children: fullName || "未設定",
      },
      {
        key: "2",
        label: "暱稱",
        children: userInfo.UserName?.NickName || "未設定",
      },
      {
        key: "3",
        label: "Email",
        children: userInfo.Email || "未設定",
      },
      {
        key: "4",
        label: "生日",
        children: userInfo.Birthday || "未設定",
      },
      {
        key: "5",
        label: "年齡",
        children: userInfo.Age && userInfo.Age > 0 ? `${userInfo.Age} 歲` : "未設定",
      },
      {
        key: "6",
        label: "性別",
        children: userInfo.Gender === "MALE" ? "男生" :
                  userInfo.Gender === "FEMALE" ? "女生" :
                  userInfo.Gender || "未設定",
      },
      {
        key: "7",
        label: "手機",
        children: userInfo.Phone || "未設定",
      },
      {
        key: "8",
        label: "地址",
        children: userInfo.AddressObject?.Address || "未設定",
      },
      {
        key: "9",
        label: "郵遞區號",
        children: userInfo.AddressObject?.PostalCode || "未設定",
      },
      {
        key: "membership",
        label: "會員等級",
        children: userInfo.membership?.level === "premium" ? "Premium" :
                  userInfo.membership?.level === "free" ? "Free" :
                  userInfo.membership || "未設定",
      },
      {
        key: "userId",
        label: "用戶ID",
        children: userId,
      },
    ];

    setCurrentUserDetail(userDetail);
    setCurrentUserPhoto(userDetail.find(item => item.key === "photo")?.children || null);
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
      message.success("報表下載成功");
    };

    return (
      <Button
        type="primary"
        style={{
          margin: 16,
          borderRadius: "6px",
          fontWeight: "bold",
          boxShadow: "0 2px 4px rgba(24, 144, 255, 0.3)",
        }}
        icon={<DownloadOutlined />}
        onClick={handleExport}
      >
        下載報表
      </Button>
    );
  };
  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Statistics Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span style={{ color: 'white' }}>註冊用戶</span>}
              value={userCount}
              formatter={formatter}
              valueStyle={{ color: 'white', fontSize: '28px' }}
              prefix={<UserOutlined style={{ color: 'white' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span style={{ color: 'white' }}>Premium 用戶</span>}
              value={permiun}
              formatter={formatter}
              valueStyle={{ color: 'white', fontSize: '28px' }}
              prefix={<CrownOutlined style={{ color: 'white' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span style={{ color: 'white' }}>活躍用戶</span>}
              value={active}
              formatter={formatter}
              valueStyle={{ color: 'white', fontSize: '28px' }}
              prefix={<CheckCircleOutlined style={{ color: 'white' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Table Section */}
      <Card
        style={{
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          background: 'white',
        }}
        bodyStyle={{ padding: '0' }}
        title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>用戶管理</span>}
      >
        <Table
          columns={columns}
          dataSource={userData}
          rowKey="userId"
          style={{ margin: '0' }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 筆，共 ${total} 筆`,
          }}
          size="middle"
        />
      </Card>

      <DrawerForm visible={visible} onClose={handleClose} record={record} />

      {/* User Detail Modal */}
      <Modal
        title="用戶詳情"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "70vh", overflow: "auto" }}
      >
        <UserDetailModal userData={currentUserDetail} userPhoto={currentUserPhoto} />
      </Modal>
    </div>
  );
};

export default UserPage;
