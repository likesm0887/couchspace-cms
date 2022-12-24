
import React, { Children, useEffect, useState } from "react";
import { Space, Table, Input, Select, Image, Tag, List, Avatar } from 'antd';
import { Button, Modal } from 'antd';
import { PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
import { meditationService } from "../../../service/ServicePool";
import ReactAudioPlayer from 'react-audio-player';
import { render } from "@testing-library/react";
import { async } from "@firebase/util";
const { TextArea } = Input;
function Admin() {
    const [data, setData] = useState([])
    const [modal1Open, setModal1Open] = useState(false);
    const [modal2Open, setModal2Open] = useState(false);
    const [shortImage, setShortImage] = useState(false);
    const [shortMusic, setShortMusic] = useState(false);
    const [musicItem, setMusicItem] = useState();
    const [allMusic, setAllMusic] = useState(false);
    const [music, setMusic] = useState(false);
    const [allOption, setAllOption] = useState([]);
    const options = [];
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
            dataIndex: 'courseName',
            key: 'courseName',
        },
        {
            title: '分類',
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
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            render: (_, { tags }) => (
                <>
                    {tags?.map((tag) => {
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
            title: '系列介紹',
            dataIndex: 'description',
            key: 'description',
        },

    ];
    const openEdit = (e) => {
        console.log(e)

        setMusic({
            key: e._id,
            courseName: e.courseName,
            image: e.image,
            series: ['nice', 'developer'],
            tags: e.tags,
            description: e.description,
            musicIDs: e.musicIDs,
            child: e.musics
        })
        setModal1Open(true)
    }
    useEffect(() => {
        getData();

    }, [])

    const getData = async () => {
        const res = await meditationService.getAllCourse()
        const musics = await meditationService.getAllMusic()
        setAllMusic(musics)
        createOptions(musics);
        const result = []
        for (let i = 0; i < res.length; i++) {

            const musics = await fetchMusic(res[i].MusicIDs)
            res[i].Musics = []
            res[i].Musics.push(...musics)
            result.push({
                key: res[i]._id,
                courseName: res[i].CourseName,
                image: res[i].Image,
                series: ['nice', 'developer'],
                tags: res[i].Tags,
                description: res[i].Description,
                musicIDs: res[i].MusicIDs,
                child: res[i].Musics
            })


        }
        setData(result)
        console.log(result)
    }

    const onImageChange = (e) => {
        if (e.target.value.length > 10) {
            setShortImage(e.target.value)
        } else {
            setShortImage('')
        }
    }


    const openModal = (e) => {
        
        setMusic({})
        setModal1Open(true)
    }

    const fetchMusic = async (ids) => {

        const idstring = ids.map(id => id.MusicID)

        const musics = await meditationService.batchQueryMusic({ "ids": idstring })

        return musics
    }

    const createOptions = (musics) => {

        musics.forEach(m => {
            options.push({ value: m._id, label: m.Title });
        })
        setAllOption(options)
    }
    const getDefault = (e) => {
    console.log(e)
    //    return allOption.map(e => { data.child.some(a => a._id = e.value) })
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
                    <Input required defaultValue={music.courseName} allowClear={true} placeholder="名稱" size="big" />
                </Space>
                <p></p>
                <Space>
                    <Select

                        placeholder="選擇系列"
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
                    <Select

                        placeholder="選擇導師"

                        //onChange={onChange}
                        //onSearch={onSearch}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }


                    />
                </Space>
                <p></p>
                <Image width='100px' src={shortImage}></Image>
                <Input allowClear={true} defaultValue={music.image} placeholder="系列圖片" size="big" onFocus={onImageChange} />

                <p></p>
                <Space>
                    <Select
                        mode="multiple"
                        size="large"
                        placeholder="Please select"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        defaultValue={getDefault}
                        tokenSeparators={[',']}
                        style={{
                            width: '300px',
                        }}
                        options={allOption}
                    />
                </Space>
                <p></p>

                <>
                    <TextArea rows={3} placeholder="導師敘述" maxLength={50
                    } />
                </>

                <p></p>




                <Select
                    defaultValue={music.toll}
                    placeholder="選擇分類"
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



            </Modal>
            <Table columns={columns} dataSource={data} pagination={{ pageSize: 7 }}
                // expandable={{
                //     expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.musicIDs[0].MusicID}</p>,
                // }}

                expandable={{
                    expandedRowRender: (record) =>
                        <List
                            itemLayout="horizontal"
                            dataSource={record.child}
                            renderItem={(item) =>
                                <List.Item>
                                    {<List.Item.Meta
                                        avatar={<Avatar src={item.Image} />}
                                        title={<a >{item.Title}</a>}

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


export default Admin;