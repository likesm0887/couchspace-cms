// 新增一個欄位名叫開通會員帳號，提示顯示 請輸入要開通的會員帳號，跟一個選擇日期的元件，新增一個送出按鈕，使用Antd元件, 元件之間有間隔

import React, { useState } from "react";
import { Input, DatePicker, Button, Space,message } from "antd";
import { CardMembership } from "@material-ui/icons";
import { memberService } from "../../../service/ServicePool";
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;
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

  const handleSubmit = async(level) => {
   var result = await memberService
      .setMembership([
        {
          Email: memberAccount,
          ExpiredDate: formatTo(selectedDate),
          Command: level,
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
  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      console.log('From: ', dates[0], ', to: ', dates[1]);
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    } else {
      console.log('Clear');
    }
  };
  const rangePresets = [
    {
      label: 'Next 7 Days',
      value: [dayjs().add(+7, 'd'), dayjs()],
    },
    {
      label: 'Next 14 Days',
      value: [dayjs().add(+14, 'd'), dayjs()],
    },
    {
      label: 'Next 30 Days',
      value: [dayjs().add(+30, 'd'), dayjs()],
    },
    {
      label: 'Next 90 Days',
      value: [dayjs().add(+90, 'd'), dayjs()],
    },
  ];
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
      presets={[
        {
          label: 'One Month',
          value: dayjs().add(+1, 'month'),
        },
        {
            label: 'Three Month',
            value: dayjs().add(+3, 'month'),
          },
          {
            label: 'Six Month',
            value: dayjs().add(+6, 'month'),
          },
          {
            label: 'Nine Month',
            value: dayjs().add(+9, 'month'),
          },
          {
            label: 'One Year',
            value: dayjs().add(+12, 'month'),
          }, 
          {
            label: 'Forever',
            value: dayjs().add(+999, 'year'),
          }
      ]}
        placeholder="選擇日期"
        value={selectedDate}
        onChange={handleDateChange}
      />
  
   
      <Space>
        <Button type="primary" onClick={()=>handleSubmit('LEVELUP')}>
          升級為Premium
        </Button>
        <Button type="primary" onClick={()=>handleSubmit('LEVELDOWN')}>
          降級成平民
        </Button>
      </Space>
    </Space>
  );
};

export default Membership;
