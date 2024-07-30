import React, { useState } from 'react';
import { Card, Form, Input, DatePicker, Select, Button, message } from 'antd';
import { useRequest } from '@umijs/max';
import { addActivity } from '@/services/ant-design-pro/activity';
import { PageContainer } from '@ant-design/pro-components';
import { AddActivityParams } from '@/types/activity';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Add: React.FC = () => {
  const [form] = Form.useForm();
  const [type, setType] = useState<string>('custom');

  const { run, loading } = useRequest(addActivity, {
    manual: true,
    onSuccess: () => {
      message.success('Activity added successfully');
      form.resetFields();
    },
    onError: () => {
      message.error('Failed to add activity');
    },
  });

  const handleTypeChange = (value: string) => {
    setType(value);
  };

  const handleSubmit = (values: any) => {
    const { rangeTime, ...rest } = values;
    const [startDate, endDate] = rangeTime;
    const params: AddActivityParams = {
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
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default Add;
