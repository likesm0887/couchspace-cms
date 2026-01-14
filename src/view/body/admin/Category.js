import React, { Children, useEffect, useState } from "react";
import {
  message,
  Space,
  Table,
  Input,
  Select,
  Image,
  Dropdown,
  Tag,
  Form,
  Rate,
  List,
  Button,
  Avatar,
  FloatButton,
  InputNumber,
  Layout,
  Menu,
  Spin,
  Alert,
  Drawer,
  Card,
  Typography,
  Transfer,
} from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  CustomerServiceOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { meditationService } from "../../../service/ServicePool";
import AdminHeader from "./AdminHeader";

const tableRowStyles = `
  .table-row-even {
    background-color: #fafafa !important;
  }
  .table-row-odd {
    background-color: #ffffff !important;
  }
  .table-row-even:hover,
  .table-row-odd:hover {
    background-color: #e6f7ff !important;
  }
`;

function Category() {
  const [data, setData] = useState([]);
  const [allCourse, setAllCourse] = useState([]);
  const [allCourseOption, setAllCourseOption] = useState([]);
  const [selectCategory, setSeleteCategory] = useState([]);
  const [currentModel, setCurrentModel] = useState("New");
  const [messageApi, contextHolder] = message.useMessage();
  const [modal1Open, setModal1Open] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const allBigCategoriesOptions = [
    {
      value: "1",
      label: "冥想",
    },
    {
      value: "2",
      label: "睡眠",
    },
    {
      value: "3",
      label: "身心",
    },
    {
      value: "4",
      label: "聲音",
    },
    {
      value: "5",
      label: "專注",
    },
    {
      value: "-1",
      label: "首頁",
    },
  ];
  const columns = [
    {
      title: "編輯",
      dataIndex: "editBtn",
      key: "editBtn",
      render: (_, element) => (
        <Button
          icon={<EditOutlined />}
          type="primary"
          onClick={() => openEdit(element)}
        ></Button>
      ),
    },
    {
      title: "名稱",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "順序",
      dataIndex: "Seq",
      key: "Seq",
    },
    {
      title: "大分類",
      dataIndex: "BigCategories",
      key: "BigCategories",
      render: (_, { BigCategories }) => (
        <>
          {BigCategories?.map((b) => {
            let label = "";
            let color;
            if (b === 1) {
              color = "gold";
              label = "冥想";
            }
            if (b === 2) {
              color = "lime";
              label = "睡眠";
            }
            if (b === 3) {
              color = "geekblue";
              label = "身心";
            }
            if (b === 4) {
              color = "purple";
              label = "聲音";
            }
            if (b === 5) {
              color = "purple";
              label = "專注";
            }
            if (b === -1) {
              color = "purple";
              label = "首頁";
            }
            return (
              <Tag color={color} key={b}>
                {label}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    const res = await meditationService.getAllCategory();
    const courses = await meditationService.getAllCourse();
    console.log(res);
    setAllCourse(courses);
    createOptions(courses);

    const result = [];
    for (let i = 0; i < res.length; i++) {
      const categoryCourses = courses?.filter((course) =>
        res[i]?.CourseIds?.includes(course.CourseID)
      );
      result.push({
        key: res[i]._id,
        Name: res[i].Name,
        Seq: res[i].Seq,
        CourseChild: categoryCourses,
        Courses: categoryCourses?.map((e) => e.CourseID),
        BigCategories: res[i].BigCategories,
      });
    }

    setData(result);
    setLoading(false);
  };
  const onFinish = (e) => {
    if (currentModel === "Edit") {
      let bigCategories = form.getFieldValue("BigCategories");
      let name = form.getFieldValue("Name");
      let seq = form.getFieldValue("Seq");
      let course = form.getFieldValue("Courses");
      console.log(selectCategory);
      let body = {
        CategoryId: selectCategory._id,
        Name: name,
        Seq: seq,
        CourseIds: course,
        BigCategories: bigCategories.map((e) => parseInt(e, 10)),
      };
      setLoading(true);
      meditationService
        .updateCategory(body)
        .then((e) => {
          setLoading(false);
          messageApi.open({
            type: "success",
            content: "修改成功",
          });
          getData().then((e) => e);
          setModal1Open(false);
        })
        .catch((e) => {
          setLoading(false);
          messageApi.open({
            type: "fail",
            content: "Oops 出現一點小錯誤",
          });
        });
    }
    if (currentModel === "New") {
      console.log(form.getFieldValue("Courses"));
      console.log(selectCategory);
      let body = {
        CategoryId: selectCategory._id,
        Name: form.getFieldValue("Name"),
        Seq: form.getFieldValue("Seq"),
        CourseIds: form.getFieldValue("Courses"),
        BigCategories: form
          .getFieldValue("BigCategories")
          .map((e) => parseInt(e, 10)),
      };
      meditationService
        .createCategory(body)
        .then((e) => {
          messageApi.open({
            type: "success",
            content: "新增成功",
          });
          getData().then((e) => e);
          setModal1Open(false);
        })
        .catch((e) => {
          messageApi.open({
            type: "fail",
            content: "Oops 出現一點小錯誤",
          });
        });
    }
  };

  const createOptions = (courses) => {
    let result = [];
    courses.forEach((m) => {
      result.push({ value: m.CourseID, label: m.CourseName });
    });

    setAllCourseOption(result);
  };

  // 為Transfer組件創建數據源
  const createTransferData = (courses) => {
    return courses.map(course => ({
      key: course.CourseID,
      title: course.CourseName,
      description: course.Description || '暫無描述'
    }));
  };
  const onCourseChange = (e) => {
    form.setFieldValue("Courses", e);
  };
  const onBigCategoriesChange = (e) => {
    form.setFieldValue("BigCategories", e);
  };
  const onNameChange = (e) => {
    form.setFieldValue("Name", e.target.value);
    console.log(selectCategory);
  };
  const onSeqChange = (e) => {
    form.setFieldValue("Seq", e);
    selectCategory.Seq = e;
    console.log(selectCategory);
    setSeleteCategory(selectCategory);
  };
  const openEdit = (e) => {
    setModal1Open(true);
    setCurrentModel("Edit");

    setSeleteCategory({
      _id: e.key,
      Name: e.Name,
      Courses: e.Courses,
      Seq: e.Seq,
      BigCategories: e.BigCategories,
    });

    // 設置表單值
    form.setFieldsValue({
      Name: e.Name,
      Seq: e.Seq,
      Courses: e.Courses || [], // 直接設置課程ID列表
      BigCategories: getBigCategoriesDefault("Edit", e.BigCategories)
    });
  };

  const getSeqDefault = () => {
    if (currentModel == "New") {
      return 0;
    }

    form.setFieldsValue({ Seq: selectCategory.Seq });
    return 1;
  };

  function getBigCategoriesDefault(currentModel, selectBigCategories) {
    if (currentModel == "New") {
      return [];
    }
    const result = [];
    for (let index = 0; index < selectBigCategories.length; index++) {
      result.push(
        allBigCategoriesOptions.find(
          (c) => c.value == selectBigCategories[index]
        )
      );
    }

    return result.map((r) => r.value);
  }

  const getDefault = () => {
    console.log(selectCategory.Courses);
    if (currentModel == "New") {
      return [];
    }
    const result = [];

    if (selectCategory.Courses == null) {
      return [];
    }

    for (let index = 0; index < allCourseOption.length; index++) {
      for (let index2 = 0; index2 < selectCategory.Courses.length; index2++) {
        if (result.includes(allCourseOption[index].value)) {
          continue;
        }

        if (allCourseOption[index].value === selectCategory.Courses[index2]) {
          result.push(allCourseOption[index].value);
        }
      }
    }
    if (result.size == 0) {
      form.setFieldsValue({ Courses: [] });
    }
    form.setFieldsValue({ Courses: result });
    return result;
  };

  const openNew = () => {
    setCurrentModel("New");

    // 重置表單
    form.setFieldsValue({
      Name: "",
      Courses: [],
      Seq: 0,
      BigCategories: []
    });

    setModal1Open(true);
  };
  const tableProps = {
    loading,
  };
  return (
    <>
      <style>{tableRowStyles}</style>
      <div style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh',
        padding: '20px'
      }}>
        <>{contextHolder}</>
      <Card
        title={
          <Typography.Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            <CustomerServiceOutlined style={{ marginRight: '10px' }} />
            類別管理
          </Typography.Title>
        }
        bordered={false}
        style={{
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          background: 'white'
        }}
      >
        <FloatButton
          shape="circle"
          type="primary"
          style={{
            right: 94,
            boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
          }}
          onClick={openNew}
          tooltip={<div>新增類別</div>}
          icon={<PlusCircleOutlined />}
        />
      <Drawer
        title={
          <div style={{
            color: '#1890ff',
            fontSize: '20px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center'
          }}>
            {currentModel == "Edit" ? <EditOutlined style={{ marginRight: '8px' }} /> : <PlusCircleOutlined style={{ marginRight: '8px' }} />}
            {currentModel == "Edit" ? "編輯類別" : "新增類別"}
          </div>
        }
        style={{
          top: 20,
        }}
        destroyOnClose={true}
        open={modal1Open}
        onOk={() => onFinish()}
        onClose={() => setModal1Open(false)}
        width={720}
        bodyStyle={{
          paddingBottom: 80,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)'
        }}
      >
        <Form
          form={form}
          onSubmit={onFinish}
          layout="vertical"
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Form.Item
            name="Name"
            label={<span style={{ fontWeight: 'bold', color: '#1890ff' }}>分類名稱</span>}
            rules={[{ required: true, message: '請輸入分類名稱' }]}
          >
            <Input
              onChange={onNameChange}
              allowClear={true}
              placeholder="請輸入分類名稱"
              size="large"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item
            name="Courses"
            label={
              <span style={{ fontWeight: 'bold', color: '#1890ff', display: 'flex', alignItems: 'center' }}>
                <BookOutlined style={{ marginRight: '6px' }} />
                系列課程
              </span>
            }
            extra={
              <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                選擇此類別所屬的系列課程，可多選
              </div>
            }
          >
            <div style={{
              background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%)',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #d6e4ff'
            }}>
              <Select
                placeholder="請選擇系列課程..."
                mode="multiple"
                size="large"
                onChange={onCourseChange}
                tokenSeparators={[","]}
                options={allCourseOption}
                defaultValue={getDefault}
                style={{
                  width: "100%",
                  borderRadius: '6px'
                }}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                tagRender={(props) => {
                  const { label, closable, onClose } = props;
                  return (
                    <Tag
                      color="blue"
                      closable={closable}
                      onClose={onClose}
                      style={{
                        margin: '2px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                    >
                      {label}
                    </Tag>
                  );
                }}
              />
            </div>
          </Form.Item>

          <Form.Item
            name="Seq"
            label={<span style={{ fontWeight: 'bold', color: '#1890ff' }}>顯示順序</span>}
          >
            <InputNumber
              min={0}
              max={999}
              defaultValue={selectCategory.Seq}
              bordered={true}
              onChange={onSeqChange}
              style={{ width: '100%', borderRadius: '6px' }}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="BigCategories"
            label={<span style={{ fontWeight: 'bold', color: '#1890ff' }}>大分類</span>}
          >
            <Select
              mode="multiple"
              size="large"
              placeholder="選擇大分類"
              tokenSeparators={[","]}
              onChange={onBigCategoriesChange}
              defaultValue={getBigCategoriesDefault}
              options={allBigCategoriesOptions}
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>
        </Form>

        <div
          style={{
            position: "absolute",
            bottom: "0",
            right: "0",
            left: "0",
            padding: "16px 24px",
            background: 'white',
            borderTop: '1px solid #f0f0f0',
            borderRadius: '0 0 12px 12px'
          }}
        >
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => setModal1Open(false)}
              size="large"
              style={{ borderRadius: '6px' }}
            >
              取消
            </Button>
            <Button
              onClick={onFinish}
              type="primary"
              size="large"
              style={{
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                border: 'none'
              }}
            >
              確認
            </Button>
          </Space>
        </div>
      </Drawer>
      <Table
        {...tableProps}
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 7,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `顯示 ${range[0]}-${range[1]} 共 ${total} 項`
        }}
        style={{
          borderRadius: '8px',
          overflow: 'hidden'
        }}
        rowClassName={(record, index) => index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}
        expandable={{
          expandedRowRender: (record) => (
            <div style={{
              background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)',
              padding: '20px',
              borderRadius: '12px',
              margin: '8px 0',
              border: '1px solid #d6e4ff'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <Typography.Title level={5} style={{
                  margin: 0,
                  color: '#1890ff',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <BookOutlined style={{ marginRight: '8px' }} />
                  相關課程
                  <Tag color="blue" style={{
                    marginLeft: '8px',
                    borderRadius: '12px'
                  }}>
                    {record.CourseChild?.length || 0}
                  </Tag>
                </Typography.Title>
              </div>

              {record.CourseChild && record.CourseChild.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '12px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  padding: '4px'
                }}>
                  {record.CourseChild.map((item, index) => (
                    <Card
                      key={item.CourseID}
                      size="small"
                      hoverable
                      style={{
                        borderRadius: '10px',
                        border: '1px solid #b7d4ff',
                        background: 'white',
                        boxShadow: '0 4px 12px rgba(24, 144, 255, 0.08)',
                        transition: 'all 0.3s ease',
                        cursor: 'default'
                      }}
                      bodyStyle={{
                        padding: '16px',
                        height: '100%'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(24, 144, 255, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.08)';
                      }}
                    >
                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{
                          background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          marginBottom: '12px',
                          alignSelf: 'flex-start'
                        }}>
                          #{index + 1}
                        </div>

                        <div style={{
                          fontWeight: 'bold',
                          color: '#1890ff',
                          fontSize: '15px',
                          marginBottom: '8px',
                          lineHeight: '1.3',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {item.CourseName}
                        </div>

                        {item.Description && (
                          <div style={{
                            color: '#777',
                            fontSize: '12px',
                            lineHeight: '1.4',
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical'
                          }}>
                            {item.Description}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#999'
                }}>
                  <BookOutlined style={{
                    fontSize: '48px',
                    color: '#d9d9d9',
                    marginBottom: '16px'
                  }} />
                  <div style={{
                    fontSize: '16px',
                    fontStyle: 'italic',
                    marginBottom: '8px'
                  }}>
                    尚未關聯任何課程
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#bbb'
                  }}>
                    編輯此類別以添加相關課程
                  </div>
                </div>
              )}
            </div>
          ),
        }}
      />
      </Card>
    </div>
    </>
  );
}
export default Category;
