import React, { Children, useEffect, useState } from "react";
import { message, Space, Table, Input, Select, Image, Dropdown, Tag, Form, Rate, List, Button, Avatar, FloatButton, Layout, Menu, Spin, Alert, Drawer } from 'antd';
import { PlusCircleOutlined, EditOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { meditationService } from "../../../service/ServicePool";
function Category() {
    const [data, setData] = useState([])
    const [allCourse, setAllCourse] = useState([])
    const [allCourseOption, setAllCourseOption] = useState([]);
    const [selectCategory, setSeleteCategory] = useState([]);
    const [currentModel, setCurrentModel] = useState("New")
    const [messageApi, contextHolder] = message.useMessage();
    const [modal1Open, setModal1Open] = useState(false);
    const [form] = Form.useForm();
    const allBigCategoriesOptions = [
        {
            value: '1',
            label: '冥想',
        },
        {
            value: '2',
            label: '技巧',
        },
        {
            value: '3',
            label: '睡眠',
        },
        {
            value: '4',
            label: '身心',
        }
    ]
    const columns = [
        {

            title: '編輯',
            dataIndex: 'editBtn',
            key: 'editBtn',
            render: (_, element) => <Button icon={<EditOutlined />} type="primary" onClick={() => openEdit(element)}>

            </Button>,
        },
        {
            title: '名稱',
            dataIndex: 'Name',
            key: 'Name',
        },
        {
            title: '大分類',
            dataIndex: 'BigCategories',
            key: 'BigCategories',
            render: (_, { BigCategories }) => (
                <>
                    {BigCategories?.map((b) => {
                        let label = ""
                        let color
                        if (b === 1) {
                            color = 'gold';
                            label = '冥想'
                        }
                        if (b === 2) {
                            color = 'lime';
                            label = '睡眠'
                        }
                        if (b === 3) {
                            color = 'geekblue';
                            label = '技巧'
                        }
                        if (b === 4) {
                            color = 'purple';
                            label = '身心'
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

    }, [])

    const getData = async () => {
        const res = await meditationService.getAllCategory()
        const courses = await meditationService.getAllCourse()
        setAllCourse(courses)
        createOptions(courses);

        const result = []
        for (let i = 0; i < res.length; i++) {

            const courses = await meditationService.batchQueryCourses({ "ids": res[i].CourseIds })
            result.push({
                key: res[i]._id,
                Name: res[i].Name,
                CourseChild:courses,
                Courses: courses?.map(e => e.CourseID),
                BigCategories: res[i].BigCategories
            })
        }
    
        setData(result)

    }
    const onFinish = (e) => {
        if (currentModel === "Edit") {
            console.log(form.getFieldValue('BigCategories'))
            console.log(selectCategory)
            let body= {
                "CategoryId": selectCategory._id,
                "Name": form.getFieldValue('Name'),
                "CourseIds": form.getFieldValue('Courses'),
                "BigCategories": form.getFieldValue('BigCategories').map(e=>parseInt(e,10)),
            }
            meditationService.updateCategory(body).then((e) => {
                messageApi.open({
                    type: 'success',
                    content: '修改成功',
                });
                getData().then((e) => e)
                setModal1Open(false)
            }).catch((e) => {
                messageApi.open({
                    type: 'fail',
                    content: 'Oops 出現一點小錯誤',
                });
            })
        }
        if (currentModel === "New") {
            console.log(form.getFieldValue('BigCategories'))
            console.log(selectCategory)
            let body= {
                "CategoryId": selectCategory._id,
                "Name": form.getFieldValue('Name'),
                "CourseIds": form.getFieldValue('Courses'),
                "BigCategories": form.getFieldValue('BigCategories').map(e=>parseInt(e,10)),
            }
            meditationService.createCategory(body).then((e) => {
                messageApi.open({
                    type: 'success',
                    content: "新增成功",
                });
                getData().then((e) => e)
                setModal1Open(false)
            }).catch((e) => {
                messageApi.open({
                    type: 'fail',
                    content: 'Oops 出現一點小錯誤',
                });
            })
        }

    }

    const createOptions = (courses) => {

        let result = []
        courses.forEach(m => {
            result.push({ value: m._id, label: m.CourseName });
        })

        setAllCourseOption(result)
    }


    const openEdit = (e) => {
       
        setCurrentModel("Edit")
        setSeleteCategory(({
            _id: e.key,
            Name: e.Name,
            Courses: e.Courses,
            BigCategories: e.BigCategories,
        }))
        console.log(e.Courses)
        form.setFieldValue("Name", e.Name)
        console.log(allCourseOption[0])
       // form.setFieldValue("Courses", getDefault(e.Courses))
        //form.setFieldValue("BigCategories", getBigCategoriesDefault(e.BigCategories))

        setModal1Open(true)
    }

    const onChangeCourse = (values) => {
       
        form.setFieldsValue({ 'Courses': values })
    }
    
    const onChangeBigCategories= (values) => {
       
        console.log(values)
        form.setFieldsValue({ 'BigCategories': values })

    }
    const getBigCategoriesDefault = () => {
        
        if (currentModel == "New") {
            return []
        }
        const result = [];

        for (let index = 0; index < selectCategory.BigCategories.length; index++) {
            result.push(allBigCategoriesOptions.find(c => c.value == selectCategory.BigCategories[index]))
        }
        console.log(result)
        return result;
    }

    const getDefault = () => {
        console.log(selectCategory.Courses)
        if (currentModel == "New") {
            return []
        }
        const result = [];

        if (selectCategory.Courses == null) {
            return []
        }

        for (let index = 0; index < allCourseOption.length; index++) {
            for (let index2 = 0; index2 < selectCategory.Courses.length; index2++) {
                if (result.includes(allCourseOption[index].value)) {
                    continue
                }
              
                if (allCourseOption[index].value === selectCategory.Courses[index2]) {
                    result.push(allCourseOption[index].value)
                }
            }
        }

        return result

    }
    const openNew= ()=>{
        setCurrentModel("New")
        
        
        form.setFieldValue("Name", "")
        form.setFieldValue("Courses", "")
        form.setFieldValue("BigCategories", undefined)
        
        console.log(allCourseOption[0])
    

        setModal1Open(true)
    }
    return (
        <div>
            <>
                {contextHolder}
            </>
            <FloatButton
                shape="circle"
                type="primary"
                style={{ right: 94 }}
                onClick={openNew}
                tooltip={<div>Add Category</div>}
                icon={<PlusCircleOutlined />

                }
            />
            <Drawer
                title={currentModel == "Edit" ? "編輯" : "新增"}
                style={{
                    top: 20,
                }}
                destroyOnClose={true}
                open={modal1Open}
                onOk={() => onFinish()}
                onCancel={() => setModal1Open(false)}
                width={720}
                cancelText='取消'
                okText="確定"
                bodyStyle={{ paddingBottom: 50 }}
            >
                <Form form={form} onFinish={onFinish}>
                    <Space>
                        <Form.Item name="Name"  label="分類名稱">
                            <Input required value={form.name} allowClear={true} placeholder="名稱" size="big" />
                        </Form.Item>
                    </Space>
                    <p></p>
                    <Form.Item name="Courses" label="系列">
                        <Space>
                            <Select
                                placeholder="選擇系列"
                                mode="multiple"
                                size="large"
                                tokenSeparators={[',']}
                                onChange={onChangeCourse}
                                options={allCourseOption}
                               defaultValue={getDefault}
                                style={{
                                    width: '600px',
                                }}
                            />
                        </Space>
                    </Form.Item>
                    <p></p>

                    <Form.Item name="BigCategories" label="大分類">

                        <Select
                            mode="multiple"
                            size="large"
                            placeholder="選擇分類"
                            tokenSeparators={[',']}
                            onChange={onChangeBigCategories}
                            defaultValue={getBigCategoriesDefault}
                            options={allBigCategoriesOptions}

                        />
                    </Form.Item>
                </Form>

                <div style={{
                    position: "absolute",
                    bottom: "5%"
                }}>
                    <Space>

                        <Button onClick={onFinish} type="primary">
                            確認
                        </Button>
                        <Button onClick={() => setModal1Open(false)} type="primary">
                            取消
                        </Button>

                    </Space>
                </div>
            </Drawer>
            <Table columns={columns} dataSource={data} pagination={{ pageSize: 7 }}
                // expandable={{
                //     expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.musicIDs[0].MusicID}</p>,
                // }}

                expandable={{
                    expandedRowRender: (record) =>
                        <List
                            itemLayout="horizontal"
                            dataSource={record.CourseChild}
                            renderItem={(item) =>
                                <List.Item>
                                    {<List.Item.Meta
                                        avatar={<Avatar src={item.Image} />}
                                        title={<a >{item.CourseName}</a>}

                                    />}
                                </List.Item>
                            }
                        />
                }}
            >
            </Table>
        </div>




    );
}
export default Category;