import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import {
  Card,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Table,
  message,
  Modal,
  Space,
  Row,
  Col,
} from 'antd';
import { useRequest } from '@umijs/max';
import moment from 'moment';
import { getQuests, addQuest, updateQuest, getQuest } from '@/services/ant-design-pro/quest';
import { TgTask } from '@/types/quest';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Quest: React.FC = () => {
  const [form] = Form.useForm();
  const [type, setType] = useState<string>('custom');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentQuest, setCurrentQuest] = useState<Partial<TgTask> | null>(null);
  const [voteOptions, setVoteOptions] = useState<{ name: string; description: string }[]>([
    { name: '', description: '' },
    { name: '', description: '' },
  ]);

  const { data: activities, loading, refresh } = useRequest(getQuests);

  const { run: addRun } = useRequest(addQuest, {
    manual: true,
    onSuccess: () => {
      message.success('活动添加成功');
      form.resetFields();
      refresh();
    },
    onError: () => {
      message.error('添加活动失败');
    },
  });

  const { run: updateRun } = useRequest(updateQuest, {
    manual: true,
    onSuccess: () => {
      message.success('活动更新成功');
      form.resetFields();
      refresh();
    },
    onError: () => {
      message.error('更新活动失败');
    },
  });

  const handleTypeChange = (value: string) => {
    setType(value);
  };

  const handleEdit = async (id: number) => {
    const { data } = await getQuest(id.toString());
    setCurrentQuest(data);
    form.setFieldsValue({
      ...data,
      rangeTime: [moment(data.startDate), moment(data.endDate)],
    });
    setType(data.type);
    if (data.type === 'vote' && data.votes) {
      setVoteOptions(
        data.votes.map((vote) => ({ name: vote.optionName, description: vote.optionDescription })),
      );
    }
    setIsModalVisible(true);
  };

  const handleAddOption = () => {
    if (voteOptions.length < 10) {
      setVoteOptions([...voteOptions, { name: '', description: '' }]);
    } else {
      message.warning('选项不能超过10个');
    }
  };

  const handleRemoveOption = (index: number) => {
    if (voteOptions.length > 2) {
      const newOptions = voteOptions.filter((_, i) => i !== index);
      setVoteOptions(newOptions);
    } else {
      message.warning('选项不能少于2个');
    }
  };

  const handleOptionChange = (index: number, field: 'name' | 'description', value: string) => {
    const newOptions = [...voteOptions];
    newOptions[index][field] = value;
    setVoteOptions(newOptions);
  };

  const handleSubmit = (values: any) => {
    const { rangeTime, ...rest } = values;
    const [startDate, endDate] = rangeTime;
    const params = { ...rest, startDate: startDate.toISOString(), endDate: endDate.toISOString(), votes: voteOptions };


    console.log(params);
    if (currentQuest) {
      updateRun({ id: currentQuest.id, ...params });
    } else {
      addRun(params);
    }
    setIsModalVisible(false);
    setCurrentQuest(null);
  };

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
    },
    {
      title: '任务类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '开始时间',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: TgTask) => (
        <Button onClick={() => handleEdit(record.id)}>编辑</Button>
      ),
    },
  ];

  return (
    <PageContainer
      ghost
      waterMarkProps={{
        content: '',
      }}
    >
      <Card>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          添加活动
        </Button>
        <Table columns={columns} dataSource={activities || []} loading={loading} rowKey="id" />
      </Card>

      <Modal
        title={currentQuest ? '编辑活动' : '添加活动'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setCurrentQuest(null);
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="taskName" label="任务名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="任务描述">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="type" label="任务类型" rules={[{ required: true }]}>
            <Select onChange={handleTypeChange}>
              <Option value="vote">投票</Option>
              <Option value="custom">自定义</Option>
            </Select>
          </Form.Item>
          <Form.Item name="rangeTime" label="时间范围" rules={[{ required: true }]}>
            <RangePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          {type === 'vote' && (
            <>
              {voteOptions.map((option, index) => (
                <Space key={index} direction="vertical" style={{ width: '100%' }}>
                  <Row gutter={16}>
                    <Col span={10}>
                      <Form.Item label={`选项 ${index + 1} 名称`} required>
                        <Input
                          value={option.name}
                          onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={`选项 ${index + 1} 描述`} required>
                        <Input.TextArea
                          value={option.description}
                          onChange={(e) => handleOptionChange(index, 'description', e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Button type="link" onClick={() => handleRemoveOption(index)}>
                        删除
                      </Button>
                    </Col>
                  </Row>
                </Space>
              ))}
              <Button type="dashed" onClick={handleAddOption} style={{ width: '100%' }}>
                添加选项
              </Button>
            </>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Quest;
