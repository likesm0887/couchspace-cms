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
  Modal,
} from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  CustomerServiceOutlined,
  BookOutlined,
  DeleteOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { meditationService } from "../../../service/ServicePool";
import AdminHeader from "./AdminHeader";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { DndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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

const SortableCourseItem = ({ id, title, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    opacity: isDragging ? 0.8 : 1,
    position: isDragging ? "relative" : "static",
    zIndex: isDragging ? 9999 : "auto",
  };
  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        padding: "6px 10px",
        marginBottom: "4px",
        background: "var(--cms-drag)",
        borderRadius: "6px",
        border: "1px solid #adc6ff",
      }}
    >
      <MenuOutlined
        ref={setActivatorNodeRef}
        style={{ touchAction: "none", cursor: "move", marginRight: "8px", color: "#8c8c8c" }}
        {...listeners}
        {...attributes}
      />
      <span style={{ flex: 1, fontSize: "13px" }}>{title}</span>
      <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => onRemove(id)} />
    </div>
  );
};

function Category() {
  const [data, setData] = useState([]);
  const [allCourse, setAllCourse] = useState([]);
  const [allCourseOption, setAllCourseOption] = useState([]);
  const [selectCategory, setSeleteCategory] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
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
      title: "刪除",
      dataIndex: "deleteBtn",
      key: "deleteBtn",
      render: (_, element) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => handleDelete(element)}
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
      // 依照 CourseIds 的順序（即分類內系列的排序）組出對應課程，而非依 courses 原始清單順序
      const categoryCourses = (res[i]?.CourseIds || [])
        .map((courseId) => courses.find((course) => course.CourseID === courseId))
        .filter(Boolean);
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
      console.log(selectCategory);
      let body = {
        CategoryId: selectCategory._id,
        Name: name,
        Seq: seq,
        CourseIds: selectedCourses.map((c) => c.id),
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
      console.log(selectCategory);
      let body = {
        CategoryId: selectCategory._id,
        Name: form.getFieldValue("Name"),
        Seq: form.getFieldValue("Seq"),
        CourseIds: selectedCourses.map((c) => c.id),
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

    // 依照 e.Courses 既有順序（來自 CourseIds）還原已選系列，保留排序
    setSelectedCourses(
      (e.Courses || [])
        .map((courseId) => {
          const option = allCourseOption.find((o) => o.value === courseId);
          return option ? { id: option.value, title: option.label } : null;
        })
        .filter(Boolean)
    );

    // 設置表單值
    form.setFieldsValue({
      Name: e.Name,
      Seq: e.Seq,
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

  const handleDelete = (element) => {
    Modal.confirm({
      title: '確認刪除',
      content: `確定要刪除類別 "${element.Name}" 嗎？此操作無法恢復。`,
      okText: '確定刪除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          await meditationService.deleteCategory(element.key);
          messageApi.open({
            type: "success",
            content: "刪除成功",
          });
          await getData();
        } catch (error) {
          messageApi.open({
            type: "error",
            content: "刪除失敗，請稍後再試",
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const openNew = () => {
    setCurrentModel("New");

    // 重置表單
    form.setFieldsValue({
      Name: "",
      Seq: 0,
      BigCategories: []
    });
    setSelectedCourses([]);

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
          background: 'var(--cms-panel)'
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
            background: 'var(--cms-panel)',
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
            label={
              <span style={{ fontWeight: 'bold', color: '#1890ff', display: 'flex', alignItems: 'center' }}>
                <BookOutlined style={{ marginRight: '6px' }} />
                系列課程
              </span>
            }
            extra={
              <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                選擇此類別所屬的系列課程，並拖曳調整顯示順序（後端讀取時將依此順序回傳）
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
                placeholder="搜尋並新增系列課程..."
                value={null}
                onChange={(value, option) => {
                  if (!selectedCourses.find((c) => c.id === value)) {
                    setSelectedCourses((prev) => [...prev, { id: value, title: option.label }]);
                  }
                }}
                size="large"
                style={{ width: "100%", borderRadius: '6px', marginBottom: selectedCourses.length > 0 ? '10px' : 0 }}
                options={allCourseOption.filter((o) => !selectedCourses.find((c) => c.id === o.value))}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
              {selectedCourses.length > 0 && (
                <DndContext
                  modifiers={[restrictToVerticalAxis]}
                  onDragEnd={({ active, over }) => {
                    if (active.id !== over?.id) {
                      setSelectedCourses((items) => {
                        const oldIndex = items.findIndex((i) => i.id === active.id);
                        const newIndex = items.findIndex((i) => i.id === over.id);
                        return arrayMove(items, oldIndex, newIndex);
                      });
                    }
                  }}
                >
                  <SortableContext
                    items={selectedCourses.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {selectedCourses.map((c) => (
                      <SortableCourseItem
                        key={c.id}
                        id={c.id}
                        title={c.title}
                        onRemove={(id) =>
                          setSelectedCourses((prev) => prev.filter((item) => item.id !== id))
                        }
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
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
            background: 'var(--cms-panel)',
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
                        background: 'var(--cms-panel)',
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
