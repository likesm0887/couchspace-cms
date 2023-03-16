import React, { useEffect, useState } from "react";
import { Button, Modal, Space } from "antd";
import { message, Form, Select } from "antd";
import cookie from 'react-cookies'
import {changeUrl} from "../../../service/redux/action/action.js"
import { useDispatch,useSelector } from "react-redux";

function Setting() {
  const [form] = Form.useForm();
  const onChange = (value) => {
    form.setFieldValue("url",value)
  };
  const onSubmmit= () => {
    dispatch(changeUrl(form.getFieldValue("url")))
  };
  const url = useSelector((state)=>state)
  console.log(url)
  const dispatch = useDispatch();
  return (
    <div>
      
      <Space>
        <Form.Item name={"url"} label={"選擇環境"} >
          <Select
            defaultValue="測試環境"
            style={{ width: 150 }}
            onChange={onChange}
            defaultOpen={cookie.load("url")}
            allowClear
            options={[
              {
                label: "測試環境",
                value: "https://couchspace-test.azurewebsites.net",
              },
              { label: "本地測試環境", value: "http://localhost:9000" },
              {
                label: "正式環境",
                value: "https://couchspace-prod.azurewebsites.net",
              },
            ]}
          />
        </Form.Item>
      </Space>
      <Form.Item>
        <Space>
          <Button onClick={onSubmmit} type="primary">確認</Button>
        </Space>
      </Form.Item>
    </div>
  );
}

export default Setting;
