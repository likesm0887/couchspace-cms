import { MenuOutlined } from "@ant-design/icons";
import { esESIntl } from "@ant-design/pro-components";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteFilled,
  CustomerServiceOutlined,
} from "@ant-design/icons";

import {
  Table,
  DatePicker,
  FloatButton,
  Space,
  Input,
  Select,
  Spin,
  Form,
  Row,
  Col,
  Switch,
  Button,
  InputNumber,
  Drawer,
} from "antd";
import React, { useState, useEffect } from "react";
import {
  counselorService,
  meditationService,
  memberService,
} from "../../../service/ServicePool";
import { MemberService } from "../../../service/MemberService";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

const PromoCode = () => {
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
            onBannerDelete(element);
          }}
        ></Button>
      ),
    },
    {
      title: "優惠代碼",
      dataIndex: "Token",
    },
    {
      title: "Code",
      dataIndex: "PresentToken",
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
  const [dataSource, setDataSource] = useState([]);
  const [previewBannerImage, setPreviewBannerImage] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [selectCourse, setSelectCourse] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [promoCode, setPromoCode] = useState([]);
  useEffect(() => {
    getData();
  }, []);
  const onBannerDelete = async (e) => {};
  const toAction = (e) => {
    if (e.Action.ActionCode == "MUL") {
      return e.Action.Value + "折";
    } else {
      return "減" + e.Action.Value + "元";
    }
  };
  const getData = async () => {
    let promoCodes = await memberService.getGetAllPromoCode();
    let counselores = await counselorService.getAllCounselorInfo();

    promoCodes = promoCodes.map((p) => {
      return {
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
  };
  const [inputValue, setInputValue] = useState("");

  const [enableUseTimesText, setEnableUseTimesText] = useState(true);
  const [randomSize, setRandomSize] = useState(5);
  return (
    <div>
      <FloatButton
        shape="circle"
        type="primary"
        style={{ right: 94 }}
        onClick={() => {
          setModal1Open(true);
          setSelectCourse(null);
          form.setFieldValue("image", "");
          setPreviewBannerImage("");
        }}
        tooltip={<div>Add Banner</div>}
        icon={<PlusCircleOutlined />}
      />
      <Table columns={columns} dataSource={promoCode} />

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
          <Form form={form}>
            <p></p>
            <Form.Item name="選擇代碼種類" label="選擇代碼種類">
              <Space>
                <Select
                  //onChange={(e) => setSelectCourse(e)}
                  placeholder="選擇代碼種類"
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
              </Space>
            </Form.Item>
            <Form.Item name="description" label="優惠代碼">
              <Input rows={3} placeholder="請輸入優惠代碼" maxLength={10} />
            </Form.Item>

            <Form.Item name="Code" label="Code">
              <Row gutter={[10, 10]}>
                <Col span={10}>
                  <Input
                    style={{ width: 100 }}
                    placeholder="Code"
                    maxLength={15}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </Col>
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
            </Form.Item>
            <p></p>
            <Row gutter={[16, 16]}>
              <Col span={10}>
                <Form.Item name="優惠內容" label="優惠內容">
                  <Space>
                    <Select
                      //  onChange={(e) => setSelectCourse(e)}
                      placeholder=""
                      options={[
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
                  </Space>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="value">
                  <Input placeholder="請輸入數值" maxLength={5} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="ActionPresent" label="優惠介紹">
              <Input placeholder="使用成功後說明(15字)" maxLength={15} />
            </Form.Item>
            <p></p>
            <Form.Item name="諮商師專屬" label="諮商師專屬">
              <Select
                mode="multiple"
                onChange={(e) => setSelectCourse(e)}
                width="100px"
                placeholder="選擇轉跳系列"
                options={allCourses}
              />
            </Form.Item>
            <Form.Item name="ActionPresent" label="優惠介紹">
              <Input placeholder="使用成功後說明(15字)" maxLength={15} />
            </Form.Item>
            <p></p>
            <Form.Item name="EnableCanUseTimes" label="啟用使用次數無上限">
              <Switch
                defaultChecked
                onChange={(e) => {
                  console.log(e);
                  setEnableUseTimesText(e);
                }}
              />
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
            <Form.Item name="EffectiveDate" label="有效期間">
              <RangePicker allowClear={true} defaultValue={dayjs(Date.now())} />
            </Form.Item>
          </Form>
          <Space>
            <Button onClick={() => {}} type="primary">
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
