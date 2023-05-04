// 新增一個欄位名叫開通會員帳號，提示顯示 請輸入要開通的會員帳號，跟一個選擇日期的元件，新增一個送出按鈕，使用Antd元件, 元件之間有間隔

import React, { useState } from "react";
import {
  Input,
  DatePicker,
  Button,
  Space,
  message,
  Upload,
  Table,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { CardMembership } from "@material-ui/icons";
import { memberService } from "../../../service/ServicePool";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
const Membership = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [memberAccount, setMemberAccount] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [data, setData] = useState([]);
  const handleMemberAccountChange = (e) => {
    setMemberAccount(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = async (level) => {
    var result = await memberService.setMembership([
      {
        Email: memberAccount,
        ExpiredDate: formatTo(selectedDate),
        Command: level,
      },
    ]);
    console.log(result[0]);
    if (result[0].success) {
      console.log(result);
    
      messageApi.open({
        type: "success",
        content: "新增成功",
      });
    } else {
      console.log(result);
      messageApi.open({
        type: "error",
        content: "新增失敗 失敗原因: " + result[0].status_text,
      });
    }
  };

  const batchSubmit = async () => {
    var result = await memberService.setMembership(data);
    console.log(result[0]);
    if (result[0].success) {
      console.log(result);

      result.forEach((r) => {
        if (r.error_code !== "") {
          messageApi.open({
            type: "error",
            content: "新增失敗 失敗原因: " + r.status_text,
          });
        }
      });
      messageApi.open({
        type: "success",
        content: "新增成功",
      });
    } else {
      console.log(result);
      messageApi.open({
        type: "error",
        content: "新增失敗 失敗原因: " + result[0].status_text,
      });
    }
  };

  const formatTo = (dateString) => {
    const dateObj = new Date(dateString);
    const year = dateObj.getUTCFullYear();
    const month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2); // add leading zero if needed
    const day = ("0" + dateObj.getUTCDate()).slice(-2); // add leading zero if needed
    return `${year}-${month}-${day}`;
  };

  const props = {
    name: "file",

    //action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onRemove() {
      setData([]);
    },
    beforeUpload(file) {
      const valid =
        file.type ==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type == "application/vnd.ms-excel";
      if (!valid) {
        message.error(`${file.name} is not a excel file`);
        return false;
      }
      if (valid) {
        console.log(valid);
        const formData = new FormData();
        formData.append("file", file);
        memberService.uploadMembership(formData).then((res) => {
          setData(res);
          return true;
        });
      }
      return false;
    },
  };
  const columns = [
    {
      title: "帳號",
      dataIndex: "Email",
      key: "Email",
    },
    {
      title: "到期日期",
      dataIndex: "ExpiredDate",
      key: "ExpiredDate",
    },
  ];
  //call /api/v1/members/membership呼叫成功用toast顯示，錯誤訊息也是用antd toast
  return (
    <Space direction="vertical">
      <>{contextHolder}</>
      <Row gutter={[16, 16]} style={{ width: 800 }}>
        <Col span={12}>
          <Row>
            <Col>
              <Input
                size="big"
                placeholder="請輸入會員帳號"
                value={memberAccount}
                onChange={handleMemberAccountChange}
                style={{ marginBottom: "16px", width: 200 }}
              />
            </Col>
            <Col>
              <dev style={{ marginBottom: "16px", marginLeft: "10px" }}>
                <DatePicker
                  presets={[
                    {
                      label: "One Month",
                      value: dayjs().add(+1, "month"),
                    },
                    {
                      label: "Three Month",
                      value: dayjs().add(+3, "month"),
                    },
                    {
                      label: "Six Month",
                      value: dayjs().add(+6, "month"),
                    },
                    {
                      label: "Nine Month",
                      value: dayjs().add(+9, "month"),
                    },
                    {
                      label: "One Year",
                      value: dayjs().add(+12, "month"),
                    },
                    {
                      label: "Forever",
                      value: dayjs().add(+999, "year"),
                    },
                  ]}
                  placeholder="選擇日期"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </dev>
            </Col>
          </Row>
          <Row>
            <Button
              type="primary"
              style={{ marginRight: "16px", marginBottom: "20px" }}
              onClick={() => handleSubmit("LEVELUP")}
            >
              升級為Premium
            </Button>

            <Button type="primary" onClick={() => handleSubmit("LEVELDOWN")}>
              降級成平民
            </Button>
          </Row>
        </Col>

        <Col span={12}>
          <Row gutter={[30, 30]}>
            <Col span={10}>
              <Upload {...props} maxCount={1}>
                <Button icon={<UploadOutlined />}>
                  Click to Upload Premium List
                </Button>
              </Upload>
            </Col>
            <Col span={20}>
              {data.length != 0 ? (
                <Button
                  type="primary"
                  style={{ marginRight: "16px", marginBottom: "20px" }}
                  onClick={() => batchSubmit()}
                >
                  通通升級為Premium
                </Button>
              ) : (
                <div></div>
              )}
            </Col>
          </Row>
          <Row>
            {data.length != 0 ? (
              <Table
                dataSource={data}
                columns={columns}
                pagination={{ pageSize: 5 }}
              />
            ) : (
              <div></div>
            )}
          </Row>
        </Col>
      </Row>
    </Space>
  );
};

export default Membership;
