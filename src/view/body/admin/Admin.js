
import React, { useEffect, useState } from "react";
import { Space, Table, Input, Select, Image, Dropdown, Tag } from 'antd';
import { Button, Modal } from 'antd';
import { PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
import { meditationService } from "../../../service/ServicePool";
import ReactAudioPlayer from 'react-audio-player';
import { render } from "@testing-library/react";
function Course() {
    const [data, setData] = useState([])
    const [modal1Open, setModal1Open] = useState(false);
    const [modal2Open, setModal2Open] = useState(false);
    const [shortImage, setShortImage] = useState(false);
    const [shortMusic, setShortMusic] = useState(false);
    const [music, setMusic] = useState(false);
    const columns = [
        {
            title: '編輯',
            dataIndex: 'editBtn',
            key: 'editBtn',
            render: (_, element) => <Button icon={<EditOutlined />} type="primary" onClick={() => openEdit(element)}>

            </Button>,
        },

        {
            title: '圖片',
            dataIndex: 'image',
            key: 'image',
            render: (image) => <Image src={image} width='70px' />,
        },
        {
            title: '名稱',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '系列',
            dataIndex: 'series',
            key: 'series',
            render: (_, { tags }) => (
                <>
                    {['主題', '技巧']?.map((tag) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === '主題') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),

        },

        {
            title: '收費',
            dataIndex: 'toll',
            key: 'toll',
        },
        {
            title: '收聽',
            dataIndex: 'views',
            key: 'views',
        }, {
            title: '音檔',
            dataIndex: 'path',
            key: 'path',
            render: (path) => <ReactAudioPlayer src={path} controls />
        }

    ];
    const openEdit = (e) => {
        console.log(e)

        setMusic({
            key: e.key,
            name: e.name,
            image: e.image,
            series: ['nice', 'developer'],
            toll: e.toll,
            path: e.path,
        })
        setModal1Open(true)
    }
    useEffect(() => {
        getData();
        //setitems('free','peirumn')
    }, [])
    const getData = async () => {
        const res = await meditationService.getAllMusic()
        console.log(res)
        const result = res.map(element => ({
            key: element._id,
            name: element.Title,
            image: element.Image,
            series: ['nice', 'developer'],
            toll: element.Free ? "Free" : "Premium",
            path: element.Path,
            views: element.TotalView
        }
        )
        );
        setData(result)

    }
    const items = [
        {
            key: 'free',
            label: (
                <a size='10'>free</a>
            ),
        },
        {
            key: 'premium',
            label: (
                <a>premium</a>
            ),
        }


    ];
    const onImageChange = (e) => {
        if (e.target.value.length > 10) {
            setShortImage(e.target.value)
        } else {
            setShortImage('')
        }
    }

    const onshortMusicChange = (e) => {
        if (e.target.value.length > 10) {
            setShortMusic(e.target.value)
        }
    }
    const openModal = (e) => {
        console.log(e)
        setMusic({})
        setModal1Open(true)
    }
    return (

        <div>
            <Button icon={<PlusCircleOutlined />} type="primary" onClick={openModal}>

            </Button>
            <Modal
                title="新增"
                style={{
                    top: 20,
                }}
                destroyOnClose={true}
                open={modal1Open}
                onOk={() => setModal1Open(false)}
                onCancel={() => setModal1Open(false)}
                cancelText='取消'
                okText="確定"
            >
                <Space>
                    <Input required  defaultValue={music.name} allowClear={true} placeholder="標題" size="big" />
                </Space>
                <p></p>
                <Space>
                    <Select

                        placeholder="選擇系列"

                        //onChange={onChange}
                        //onSearch={onSearch}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={[
                            {
                                value: '正念生活',
                                label: '正念生活',
                            },
                            {
                                value: '親子冥想',
                                label: '親子冥想',
                            }
                        ]}
                    />
                </Space>
                <p></p>
                <Space>
                    <Input placeholder="屬性" size="big" />
                </Space>
                <p></p>
                <Image width='100px' src={shortImage}></Image>
                <Input allowClear={true} defaultValue={music.image} placeholder="圖片" size="big" onFocus={onImageChange} />

                <p></p>
                <Space>
                    <Input defaultValue={music.path} allowClear={true} placeholder="檔案" size="big" onFocus={onshortMusicChange} />
                    <ReactAudioPlayer src={shortMusic} controls width='100px' />
                </Space>
                <p></p>
                <Space>
                    <Input allowClear={true} placeholder="熱門程度" size="big" />
                </Space>
                <p></p>
                <Space>
                    <Input placeholder="推薦" size="big" />
                </Space>

                <p></p>

                <Select
                    defaultValue={music.toll}
                    placeholder="選擇收費"

                    //onChange={onChange}
                    //onSearch={onSearch}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={[
                        {
                            value: 'Free',
                            label: 'Free',
                        },
                        {
                            value: 'Premium',
                            label: 'Premium',
                        }
                    ]}
                />

                <p></p>

            </Modal>
            <Table columns={columns} dataSource={data} pagination={{ pageSize: 7 }}>
            </Table>

        </div>

    );

}


export default Course;