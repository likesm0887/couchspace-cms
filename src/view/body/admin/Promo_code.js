import { PlusCircleOutlined, EditOutlined, SearchOutlined, ClearOutlined } from "@ant-design/icons";

import {
  Table,
  DatePicker,
  FloatButton,
  Space,
  Input,
  Select,
  Modal,
  QRCode,
  Spin,
  Form,
  message,
  Flex,
  Statistic,
  Row,
  Col,
  Switch,
  Button,
  InputNumber,
  Drawer,
} from "antd";
import CountUp from "react-countup";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import React, { useState, useEffect } from "react";
import { counselorService, memberService } from "../../../service/ServicePool";
import { MemberService } from "../../../service/MemberService";
import dayjs from "dayjs";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

const customInputStyle = `
  .custom-search-input .ant-input::placeholder {
    font-size: 14px !important;
    color: #999 !important;
  }
`;
const PromoCode = () => {
  const { RangePicker } = DatePicker;

  const columns = [
    {
      key: "sort",
    },
    {
      title: "編輯",
      dataIndex: "editBtn",
      key: "editBtn",
      render: (_, element) => (
        <Button
          icon={<EditOutlined />}
          type="primary"
          onClick={(e) => {
            onEdit(element);
          }}
        ></Button>
      ),
    },
    {
      title: "ID",
      dataIndex: "ID",
    },
    {
      title: "優惠代碼",
      dataIndex: "Token",
    },
    {
      title: "Code",
      dataIndex: "PresentToken",
      render: (i, element) => (
        <Button
          type="text"
          onClick={(e) => {
            openQRModal(element);
          }}
        >
          {i}
        </Button>
      ),
    },
    {
      title: "優惠類型",
      dataIndex: "Type",
    },
    {
      title: "優惠內容",
      dataIndex: "Action",
    },
    {
      title: "使用成功後顯示",
      dataIndex: "ActionPresent",
    },
    {
      title: "狀態",
      dataIndex: "Effective",
    },
    {
      title: "諮商師專屬",
      dataIndex: "ForCounselorList",
    },
    {
      title: "是否啟用重複使用",
      dataIndex: "DuplicateUse",
    },
    {
      title: "單一使用者使用",
      dataIndex: "ForOneMember",
    },
    {
      title: "使用上限次數",
      dataIndex: "CanUseTimes",
    },
    {
      title: "目前使用次數",
      dataIndex: "UsedTimes",
    },
    {
      title: "使用紀錄",
      dataIndex: "UsedTimes2",
    },
  ];
  const [modal1Open, setModal1Open] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const [form] = Form.useForm();
  const [promoCode, setPromoCode] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("new");
  const [selectedID, setSelectedID] = useState("");
  const openQRModal = (element) => {
    console.log(element);
    setQRCodeValue(element.PresentToken);
    setVisible(true);
  };
  useEffect(() => {
    getData();
  }, []);
  const onEdit = async (e) => {
    setStatus("edit");
    setModal1Open(true);
    console.log(e);
    var jsonData = await memberService.getPromoCode(e.ID);
    console.log(jsonData);
    setSelectedID(e.ID);
    setInputValue(jsonData.PresentToken);
    form.setFieldValue("ID", jsonData.ID);
    form.setFieldValue("Type", jsonData.Type);
    form.setFieldValue("Token", jsonData.Token);
    form.setFieldValue("PresentToken", jsonData.PresentToken);
    form.setFieldValue("Value", jsonData.Action.Value);
    form.setFieldValue("ActionCode", jsonData.Action.ActionCode);
    form.setFieldValue("CounselorList", jsonData.ForCounselorList);
    form.setFieldValue("DuplicateUse", jsonData.DuplicateUse);
    form.setFieldValue("Effective", jsonData.Effective);
    form.setFieldValue("ForOneMember", jsonData.ForOneMember);
    form.setFieldValue("EnableUseTimesText", jsonData.CanUseTimes === -1);
    form.setFieldValue("ActionPresent", jsonData.Action.ActionPresent);
    form.setFieldValue("EffectiveDate", [
      dayjs(jsonData.EffectiveStartTime),
      dayjs(jsonData.EffectiveEndTime),
    ]);
  };
  const toAction = (e) => {
    if (e.Action.ActionCode == "MUL") {
      return e.Action.Value * 10 + "折";
    }
    if (e.Action.ActionCode == "SUB") {
      return "減" + e.Action.Value + "元";
    }

    if (e.Action.ActionCode == "PREMIUM") {
      return "開通" + e.Action.Value + "個月";
    }
  };

  const getData = async (inputSearchTerm = null) => {
    setLoading(true);
    let promoCodes = await memberService.getGetAllPromoCode();
    let counselores = await counselorService.getAllCounselorInfo();
    setLoading(false);
    promoCodes = promoCodes.map((p) => {
      return {
        ID: p.ID,
        Token: p.Token,
        PresentToken: p.PresentToken,
        Type: p.Type === "COUNSELING" ? "諮商" : "冥想",
        ActionPresent: p.Action.ActionPresent,
        Effective: p.Effective ? "啟用中" : "停用中",
        ForCounselorList: getCounselor(counselores, p.ForCounselorList),
        ForOneMember: p.ForOneMember ? "啟用" : "不啟用",
        DuplicateUse: p.DuplicateUse ? "啟用" : "不啟用",
        Action: toAction(p),
        CanUseTimes: p.CanUseTimes == "-1" ? "無上限" : p.CanUseTimes,

        UsedTimes:
          p?.MemberPromoCodeRecord?.length > 0
            ? p?.MemberPromoCodeRecord?.length
            : "0",
      };
    });
    const allCounselors = await counselorService.getAllCounselorInfo(true);
    setAllCourses(
      allCounselors.map((c) => {
        return {
          label: c.UserName?.Name.LastName + c.UserName?.Name?.FirstName,
          value: c.ID,
        };
      })
    );
    if (inputSearchTerm !== null) {
      console.log(inputSearchTerm)
      promoCodes = promoCodes.filter((u) => {
        const tokenMatch = u.Token.includes(inputSearchTerm);
        const presentTokenMatch = u.PresentToken.includes(inputSearchTerm);

        return tokenMatch || presentTokenMatch;
      });
    }
    setPromoCode(promoCodes);
  };
  const getCounselor = (allCounselores, counselorIDs) => {
    if (counselorIDs === null) {
      return [];
    }

    // 使用 filter 方法筛选出符合条件的 counselor
    const resultString = allCounselores
      .filter((counselor) => {
        return counselorIDs.some(
          (forCounselor) => forCounselor === counselor.ID
        );
      })
      .map((p) => p.UserName.NickName)
      .join(", ");
    return resultString;
  };
  const generateRandomString = (value) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < value; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };
  const handleButtonClick = () => {
    const randomString = generateRandomString(randomSize);
    console.log(randomString);
    setInputValue(randomString);
    form.setFieldsValue({ PresentToken: randomString });
  };
  const getValue = (UseTimes, CanUseTimes) => {
    if (UseTimes || UseTimes == undefined) {
      return -1;
    } else {
      return CanUseTimes;
    }
  };
  const onFinish = async (values) => {
    console.log(values);
    const jsonData = {
      ID: selectedID,
      Group: {
        groupDesc: "",
        groupCode: "",
      },
      Token: values.Token,
      PresentToken: values.PresentToken,
      EffectiveStartTime: dayjs(values.EffectiveDate[0]).format("YYYY-MM-DD"), // 格式化日期
      EffectiveEndTime: dayjs(values.EffectiveDate[1]).format("YYYY-MM-DD"), // 格式化日期
      ForCounselorList: values.CounselorList,
      ForOneMember: values.ForOneMember,
      DuplicateUse: values.DuplicateUse,
      CanUseTimes: getValue(values.EnableUseTimesText, values.CanUseTimes),
      Type: values.Type,
      Action: {
        Value: values.Value,
        ActionCode: values["ActionCode"],
        ActionPresent: values.ActionPresent,
      },
      Effective: values.Effective,
    };

    console.log(jsonData); // 输出 JSON 数据到控制台
    if (status === "new") {
      console.log("new");
      memberService
        .addPromoCode(jsonData)
        .then((e) => {
          console.log(e);
          if (e.error_code === "9999") {
            message.error(e.message);
            getData();
            setModal1Open(true);
          } else {
            message.success("新增成功");
            setModal1Open(false);
            getData();
          }
        })
        .catch((e) => {
          message.error(e);
        });
    } else {
      console.log("edit");
      memberService
        .updatePromoCode(jsonData)
        .then((e) => {
          console.log(e);
          if (e.error_code === "9999") {
            message.error(e.message);
            getData();
            setModal1Open(true);
          } else {
            message.success("編輯成功");
            setModal1Open(false);
            getData();
          }
        })
        .catch((e) => {
          message.error(e);
        });
    }
  };
  const [inputValue, setInputValue] = useState("");
  const [enableUseTimesText, setEnableUseTimesText] = useState(true);
  const [randomSize, setRandomSize] = useState(5);
  const [qrCodeValue, setQRCodeValue] = useState("");
  const validateMessages = {
    required: "${label}不能為空!",
    types: {
      email: "${label}不是有效的邮箱地址!",
      number: "${label}不是有效的数字!",
    },
    number: {
      range: "${label}必须在${min}和${max}之间!",
    },
  };
  const newPromoCode = () => {
    form.resetFields();
    setModal1Open(true);
    form.setFieldValue("image", "");
    setStatus("new");
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

  const handleSearch = () => {
    const queryParams = {
      searchTerm,
    };
    getData(searchTerm);

    // 在這裡執行查詢操作
    console.log("查詢參數:", queryParams);
    // 例如調用查詢函數
    // queryAppointments(queryParams);
  };

  const handleClear = () => {
    setSearchTerm("");
    setStartDate(null);
    setEndDate(null);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const formatter = (value) => <CountUp end={value} separator="," />;
  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: customInputStyle }} />
      <Flex gap="middle" justify="space-between" baseStyle>
        <Statistic
          title="優惠券數量"
          value={promoCode.length}
          formatter={formatter}
        />

        {/* 美化搜尋列 */}
        <Flex gap="small" vertical>
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e9ecef'
          }}>
            <Flex gap="small" align="center">
              <Input.Search
                value={searchTerm}
                placeholder="搜尋優惠代碼或Code..."
                className="custom-search-input"
                style={{
                  width: "250px",
                  borderRadius: "8px",
                  
                }}
                onChange={(e) => setSearchTerm(e.target.value)}
                onSearch={handleSearch}
                enterButton={
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#1890ff",
                      borderColor: "#1890ff",
                      borderRadius: "6px",
                      height: "32px"
                    }}
                    icon={<SearchOutlined />}
                  >
                    搜尋
                  </Button>
                }
              />
              <Button
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: "#d9d9d9",
                  color: "#666",
                  borderRadius: "6px",
                  height: "32px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}
                onClick={handleClear}
                icon={<ClearOutlined />}
              >
                清除
              </Button>
            </Flex>
          </div>
        </Flex>
      </Flex>
      <FloatButton
        shape="circle"
        type="primary"
        style={{ right: 94 }}
        onClick={() => {
          newPromoCode();
        }}
        tooltip={<div>Add Banner</div>}
        icon={<PlusCircleOutlined />}
      />
      <Spin size="large" spinning={loading}>
        <Table
          columns={columns}
          style={{ marginTop: 10 }}
          dataSource={promoCode}
        />
      </Spin>
      <Modal
        title="QR Code"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <QRCode
          value={qrCodeValue}
          // icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        />
      </Modal>

      <Drawer
        title={"新增"}
        style={{
          top: 20,
        }}
        destroyOnClose={true}
        open={modal1Open}
        //onOk={() => onFinish()}
        onClose={() => {
          setModal1Open(false);
          setInputValue("");
          setRandomSize(5);
        }}
        width={360}
        cancelText="取消"
        okText="確定"
        bodyStyle={{ paddingBottom: 50 }}
      >
        <Spin size="large" spinning={loading}>
          <Form
            form={form}
            onFinish={onFinish}
            validateMessages={validateMessages}
            // initialValues={initialValues}
            // initialValues={{
            //   EffectiveDate: [dayjs(), dayjs().add(1, "year")],
            //   ActionCode: "MUL",
            //   ActionPresent: "兌換成功!!",
            // }}
          >
            <p></p>
            <Form.Item
              name="Type"
              label="選擇類型"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="選擇類型"
                options={[
                  {
                    label: "諮商",
                    value: "COUNSELING",
                  },
                  {
                    label: "冥想",
                    value: "MEDITATION",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="Token"
              label="優惠代碼"
              rules={[{ required: true }]}
            >
              <Input rows={3} placeholder="請輸入優惠代碼" maxLength={25} />
            </Form.Item>
            <Row gutter={[10, 10]}>
              <Form.Item
                name="PresentToken"
                label="Code"
                rules={[{ required: true }]}
              >
                <Col span={10}>
                  <Input
                    style={{ width: 100 }}
                    placeholder="Code"
                    maxLength={25}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </Col>
              </Form.Item>
              <Col span={9}>
                <Button type="primary" onClick={handleButtonClick}>
                  Random
                </Button>
              </Col>
              <Col span={2}>
                <InputNumber
                  min={1}
                  max={15}
                  style={{ width: 50 }}
                  defaultValue={5}
                  onChange={(e) => setRandomSize(e)}
                />
              </Col>
            </Row>
            <p></p>
            <Row gutter={[16, 16]}>
              <Col span={14}>
                <Form.Item
                  width="150px"
                  name="ActionCode"
                  label="優惠內容"
                  rules={[{ required: true }]}
                >
                  <Select
                    width="100px"
                    placeholder=""
                    options={[
                      {
                        label: "開通(月)",
                        value: "PREMIUM",
                      },
                      {
                        label: "乘",
                        value: "MUL",
                      },
                      {
                        label: "減",
                        value: "SUB",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item name="Value" rules={[{ required: true }]}>
                  <InputNumber placeholder="請輸入數值" maxLength={5} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="ActionPresent"
              label="成功後顯示說明"
              rules={[{ required: true }]}
            >
              <Input placeholder="使用成功後說明(15字)" maxLength={15} />
            </Form.Item>
            <p></p>
            <Form.Item name="CounselorList" label="諮商師專屬">
              <Select
                mode="multiple"
                width="100px"
                placeholder="選擇轉跳系列"
                options={allCourses}
              />
            </Form.Item>
            <p></p>

            <Form.Item name="DuplicateUse" label="是否允許重複使用">
              <Switch />
            </Form.Item>
            <Form.Item name="ForOneMember" label="單一使用者">
              <Switch />
            </Form.Item>
            <Form.Item name="EnableUseTimesText" label="啟用使用次數無上限">
              <Switch defaultChecked onChange={(e) => setEnableUseTimesText(e)}>
                {" "}
              </Switch>
            </Form.Item>

            <Form.Item
              hidden={enableUseTimesText}
              name="CanUseTimes"
              label="使用上限"
            >
              <InputNumber
                min={1}
                max={9999999}
                placeholder="請輸入使用次數"
                defaultValue={1}
                // onChange={onChange}
              />
            </Form.Item>
            <Form.Item name="Effective" label="啟用">
              <Switch />
            </Form.Item>
            <Form.Item
              name="EffectiveDate"
              label="有效期間"
              rules={[
                { type: "array", required: true, message: "請選擇有效期間" },
              ]}
            >
              <RangePicker
                allowClear={true}
                //defaultValue={[dayjs(), dayjs().add(1, "year")]}
              />
            </Form.Item>
          </Form>
          <Space>
            <Button
              onClick={() => {
                form.submit();
              }}
              type="primary"
            >
              確認
            </Button>
            <Button
              onClick={() => {
                setModal1Open(false);
                setInputValue("");
                setRandomSize(5);
              }}
              type="primary"
            >
              取消
            </Button>
          </Space>
        </Spin>
        <div
          style={{
            position: "absolute",
            bottom: "5%",
          }}
        ></div>
      </Drawer>
    </div>
  );
};
export default PromoCode;
