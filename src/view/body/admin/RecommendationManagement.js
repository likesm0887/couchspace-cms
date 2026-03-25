import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Form,
  message,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Typography,
} from "antd";
import { MenuOutlined, ReloadOutlined, SaveOutlined } from "@ant-design/icons";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import dayjs from "dayjs";
import { meditationService } from "../../../service/ServicePool";

const { RangePicker } = DatePicker;

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

const Row = ({ children, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });
  const style = {
    ...props.style,
    transform: CSS.Transform.toString(
      transform && {
        ...transform,
        scaleY: 1,
      }
    ),
    transition,
    ...(isDragging
      ? {
          position: "relative",
          zIndex: 9999,
        }
      : {}),
  };
  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if (child.key === "sort") {
          return React.cloneElement(child, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{
                  touchAction: "none",
                  cursor: "move",
                }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

const DEFAULT_RANGE = [dayjs().startOf("day"), dayjs().add(7, "day").endOf("day")];

const buildMusicOptions = (musics = []) =>
  musics.map((music) => ({
    value: music.MusicID || music.id,
    label: music.Title || music.name || music.MusicName || "未命名單堂",
  }));

const normalizeDateValue = (value) => {
  if (!value) return null;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};

const normalizeRecommendations = (recommendations = []) =>
  recommendations
    .map((item, index) => ({
      key: item.SeriesID || item.CourseID || `recommend-${index}`,
      SeriesID: item.SeriesID || item.CourseID || "",
      Sequence: typeof item.Sequence === "number" ? item.Sequence : index,
      Enable: Boolean(item.Enable),
      EnableStartTime: item.EnableStartTime || "",
      EnableEndTime: item.EnableEndTime || "",
    }))
    .sort((a, b) => a.Sequence - b.Sequence);

function RecommendationManagement() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [musics, setMusics] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recommendationList, musicList] = await Promise.all([
        meditationService.getRecommendations(true),
        meditationService.getAllMusic(),
      ]);
      const normalized = normalizeRecommendations(recommendationList || []);
      setRecommendations(normalized);
      setMusics(musicList || []);
    } catch (error) {
      console.error(error);
      messageApi.error("取得每日推薦失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    form.setFieldsValue({ recommendations });
  }, [form, recommendations]);

  const musicOptions = useMemo(() => buildMusicOptions(musics), [musics]);

  const updateRecommendation = (index, patch) => {
    setRecommendations((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item))
    );
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) {
      return;
    }
    setRecommendations((prev) => {
      const oldIndex = prev.findIndex((item) => item.key === active.id);
      const newIndex = prev.findIndex((item) => item.key === over.id);
      const moved = arrayMove(prev, oldIndex, newIndex).map((item, index) => ({
        ...item,
        Sequence: index,
      }));
      return moved;
    });
  };

  const handleAdd = () => {
    setRecommendations((prev) => {
      const nextIndex = prev.length;
      return [
        ...prev,
        {
          key: `new-${Date.now()}`,
          SeriesID: "",
          Sequence: nextIndex,
          Enable: true,
          EnableStartTime: DEFAULT_RANGE[0].format("YYYY/MM/DD"),
          EnableEndTime: DEFAULT_RANGE[1].format("YYYY/MM/DD"),
        },
      ];
    });
  };

  const handleRemove = (index) => {
    setRecommendations((prev) =>
      prev
        .filter((_, idx) => idx !== index)
        .map((item, idx) => ({ ...item, Sequence: idx }))
    );
  };

  const handleSave = async () => {
    const invalid = recommendations.some((item) => !item.SeriesID);
    if (invalid) {
      messageApi.warning("請先為每筆推薦選擇單堂");
      return;
    }

    setSaving(true);
    try {
      const payload = recommendations.map((item) => ({
        SeriesID: item.SeriesID,
        Sequence: item.Sequence,
        Enable: item.Enable,
        EnableStartTime: item.EnableStartTime || "",
        EnableEndTime: item.EnableEndTime || "",
      }));
      await meditationService.updateRecommendations(payload);
      messageApi.success("每日推薦已更新");
      await fetchData();
    } catch (error) {
      console.error(error);
      messageApi.error("更新失敗，請稍後再試");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: "sort",
      title: "排序",
      dataIndex: "sort",
      width: 70,
    },
    {
      title: "單堂",
      dataIndex: "SeriesID",
      key: "SeriesID",
      render: (_, record, index) => (
        <Select
          placeholder="選擇單堂"
          value={record.SeriesID || undefined}
          style={{ width: "100%" }}
          onChange={(value) => updateRecommendation(index, { SeriesID: value })}
          options={musicOptions}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />
      ),
    },
    {
      title: "生效",
      dataIndex: "Enable",
      key: "Enable",
      width: 120,
      render: (_, record, index) => (
        <Switch
          checked={record.Enable}
          onChange={(value) => updateRecommendation(index, { Enable: value })}
        />
      ),
    },
    {
      title: "生效期間",
      dataIndex: "EnableRange",
      key: "EnableRange",
      render: (_, record, index) => (
        <RangePicker
          value={[
            normalizeDateValue(record.EnableStartTime),
            normalizeDateValue(record.EnableEndTime),
          ]}
          format="YYYY/MM/DD"
          onChange={(values) => {
            const [start, end] = values || [];
            updateRecommendation(index, {
              EnableStartTime: start ? start.format("YYYY/MM/DD") : "",
              EnableEndTime: end ? end.format("YYYY/MM/DD") : "",
            });
          }}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "動作",
      dataIndex: "actions",
      key: "actions",
      width: 120,
      render: (_, __, index) => (
        <Button danger onClick={() => handleRemove(index)}>
          移除
        </Button>
      ),
    },
  ];

  const tableProps = {
    loading,
  };

  return (
    <>
      <style>{tableRowStyles}</style>
      {contextHolder}
      <div
        style={{
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <Card
          title={
            <Typography.Title level={2} style={{ margin: 0, color: "#1890ff" }}>
              營運管理 - 每日推薦
            </Typography.Title>
          }
          bordered={false}
          style={{
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            background: "white",
          }}
        >
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            message="拖拉左側排序欄位可調整每日推薦順序，並設定生效期間與是否啟用。"
          />
          <Space style={{ marginBottom: 16 }}>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>
              重新載入
            </Button>
            <Button type="primary" onClick={handleAdd}>
              新增推薦
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={saving}
              onClick={handleSave}
            >
              儲存設定
            </Button>
          </Space>
          <Spin spinning={loading}>
            <Form form={form} layout="vertical">
              <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
                <SortableContext
                  items={recommendations.map((item) => item.key)}
                  strategy={verticalListSortingStrategy}
                >
                  <Table
                    {...tableProps}
                    components={{
                      body: {
                        row: Row,
                      },
                    }}
                    rowKey="key"
                    columns={columns}
                    dataSource={recommendations}
                    pagination={false}
                    rowClassName={(record, index) =>
                      index % 2 === 0 ? "table-row-even" : "table-row-odd"
                    }
                  />
                </SortableContext>
              </DndContext>
            </Form>
          </Spin>
        </Card>
      </div>
    </>
  );
}

export default RecommendationManagement;