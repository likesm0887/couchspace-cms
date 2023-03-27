// 新增一個欄位名叫開通會員帳號，提示顯示 請輸入要開通的會員帳號，跟一個選擇日期的元件，再新增一個+按鈕，新增一個送出按鈕，使用Antd元件, 元件之間有間隔

import React, { useState } from "react";
import { Input, DatePicker, Button, Space,message } from "antd";
import { CardMembership } from "@material-ui/icons";
import { memberService } from "../../../service/ServicePool";
const Membership = () => {
    const [messageApi, contextHolder] = message.useMessage();
  const [memberAccount, setMemberAccount] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const handleMemberAccountChange = (e) => {
    setMemberAccount(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = async() => {
   var result = await memberService
      .setMembership([
        {
          Email: memberAccount,
          ExpiredDate: formatTo(selectedDate),
          Command: "LEVELUP",
        },
      ])
      console.log(result[0])
      if(result[0].success){
        console.log(result)
        messageApi.open({
            type: "success",
            content: "新增成功",
        });
      }else{
        console.log(result)
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
  //call /api/v1/members/membership呼叫成功用toast顯示，錯誤訊息也是用antd toast
  return (
    <Space direction="vertical">
        <>{contextHolder}</>
      <Input
        size="big"
        placeholder="請輸入會員帳號"
        value={memberAccount}
        onChange={handleMemberAccountChange}
      />
      <DatePicker
        placeholder="選擇日期"
        value={selectedDate}
        onChange={handleDateChange}
      />
      <Space>
        <Button type="primary" onClick={handleSubmit}>
          送出
        </Button>
      </Space>
    </Space>
  );
};

export default Membership;
