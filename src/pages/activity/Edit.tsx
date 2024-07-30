import React, { useState, useEffect } from 'react';
import { Card, Form, Input, DatePicker, Select, Button, message } from 'antd';
import { useRequest, useParams } from '@umijs/max';
import { getActivity, updateActivity } from '@/services/ant-design-pro/activity';
import { UpdateActivityParams } from '@/types/activity';
import { PageContainer } from '@ant-design/pro-components';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Edit: React.FC = () => {
  const [form] = Form.useForm();
  const [type, setType] = useState<string>('custom');
  const { id } = useParams<{ id: string }>();

  const { data, loading: loadingActivity } = useRequest(() => getActivity(id as string));
  const { run, loading: updating } = useRequest(updateActivity, {
    manual: true,
    onSuccess: () => {
      message.success('Activity updated successfully');
      form.resetFields();
    },
    onError: () => {
      message.error('Failed to update activity');
    },
  });

  useEffect(() => {
    if (data) {
      const { startDate, endDate, ...rest } = data.data;
      form.setFieldsValue({ ...rest, rangeTime: [startDate, endDate] });
      setType(data.data.type);
    }
  }, [data]);

  const handleTypeChange = (value: string) => {
    setType(value);
  };

  const handleSubmit = (values: any) => {
    const { rangeTime, ...rest } = values;
    const [startDate, endDate] = rangeTime;
    const params: UpdateActivityParams = {
      id: Number(id),
      ...rest,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
    run(params);
  };

  return (
    <PageContainer
      ghost
      waterMarkProps={{
        content: '',
      }}
    >
      <Card>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="taskName" label="Task Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select onChange={handleTypeChange}>
              <Option value="vote">Vote</Option>
              <Option value="custom">Custom</Option>
            </Select>
          </Form.Item>
          <Form.Item name="rangeTime" label="Time Range" rules={[{ required: true }]}>
            <RangePicker showTime />
          </Form.Item>
          {type === 'vote' && (
            <>
              <Form.Item name="optionName" label="Option Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="optionDescription"
                label="Option Description"
                rules={[{ required: true }]}
              >
                <Input.TextArea />
              </Form.Item>
            </>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={updating || loadingActivity}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default Edit;
