import {
  fetchDownloadUrl,
  fetchHierarchyList,
  GetUserHierarchyDataResponse,
  HierarchyData,
} from '@/services/ant-design-pro/hierarchyList';
import { PageContainer, ProList } from '@ant-design/pro-components';
import { Button, Card, Input, message, Select, Space } from 'antd';
import type { Key } from 'react';
import React, { useState } from 'react';

interface HierarchyListPageProps {
  initialData?: GetUserHierarchyDataResponse;
}

const HierarchyList: React.FC<HierarchyListPageProps> = ({ initialData }) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly Key[]>([]);
  const [subExpandedRowKeys, setSubExpandedRowKeys] = useState<readonly Key[]>([]);
  const [dataSource, setDataSource] = useState<HierarchyData[]>([]);
  const [subDataSource, setSubDataSource] = useState<{ [key: number]: HierarchyData[] }>({});
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [sortField, setSortField] = useState<'total_nts' | 'total_user' | 'invite_count'>(
    'invite_count',
  );
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | undefined>(undefined);

  const handleDownload = async (userId?: number) => {
    try {
      setLoading(true);
      console.log('userId:', userId);
      const response = await fetchDownloadUrl({ userId });
      if (response.data.url) {
        // 触发下载
        const link = document.createElement('a');
        link.href = response.data.url;
        link.setAttribute('download', `hierarchy-${userId}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        message.error('下载 URL 获取失败');
      }
    } catch (error) {
      console.error('下载失败:', error);
      message.error('下载失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (userId?: number) => {
    setLoading(true);
    try {
      const response = await fetchHierarchyList({ userId });
      if (response) {
        if (userId) {
          setDataSource((keys) => (response.data.hierarchy ? [response.data.hierarchy] : keys));
        } else {
          const { hierarchy } = response.data;
          setDataSource([hierarchy]);
        }
      } else {
        if (initialData) {
          const { hierarchy } = initialData.data;
          setDataSource([hierarchy]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      message.error('获取数据失败，请重试！');
      if (initialData) {
        const { hierarchy } = initialData.data;
        setDataSource([hierarchy]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSubData = async (userId: number) => {
    setLoading(true);
    try {
      const response = await fetchHierarchyList({ userId });
      if (response.code === 0) {
        const { invite_user_hierarchy } = response.data;
        setSubDataSource((prev) => ({
          ...prev,
          [userId]: invite_user_hierarchy,
        }));
      } else {
        message.error(response.msg);
      }
    } catch (error) {
      console.error('Failed to fetch sub data:', error);
      message.error('获取子数据失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchData().then((r) => console.log(r));
  // }, []);

  const handleExpand = async (record: HierarchyData) => {
    const isExpanded = expandedRowKeys.includes(record?.user_id);
    if (isExpanded) {
      setExpandedRowKeys(expandedRowKeys.filter((key) => key !== record?.user_id));
    } else {
      if (!subDataSource[record?.user_id]) {
        await fetchSubData(record?.user_id);
      }
      setExpandedRowKeys([...expandedRowKeys, record?.user_id]);
    }
  };

  const handleSubExpand = async (record: HierarchyData) => {
    const isExpanded = subExpandedRowKeys.includes(record?.user_id);
    if (isExpanded) {
      setSubExpandedRowKeys(subExpandedRowKeys.filter((key) => key !== record?.user_id));
    } else {
      if (!subDataSource[record?.user_id]) {
        await fetchSubData(record?.user_id);
      }
      setSubExpandedRowKeys([...subExpandedRowKeys, record?.user_id]);
    }
  };

  const handleToggleAll = () => {
    if (expandedRowKeys.length === dataSource.length) {
      setExpandedRowKeys([]);
    } else {
      const allKeys = dataSource.map((item) => item?.user_id);
      setExpandedRowKeys(allKeys);
    }
  };

  const handleFetchByUserId = () => {
    fetchData(userId).then((r) => console.log(r));
  };

  const handleSort = (
    field: 'total_nts' | 'total_user' | 'invite_count',
    order: 'ascend' | 'descend' | undefined,
  ) => {
    setSortField(field);
    setSortOrder(order);
    const sortedData = [...dataSource].sort((a, b) => {
      if (order === 'ascend') {
        return a[field] - b[field];
      }
      if (order === 'descend') {
        return b[field] - a[field];
      }
      return 0;
    });
    setDataSource(sortedData);
  };

  const renderNestedList = (items: HierarchyData[]) => {
    return items.map((item) => (
      <div key={item?.user_id} style={{ marginLeft: 20, padding: '10px 0' }}>
        <ProList
          rowKey="user_id"
          dataSource={[item]}
          expandable={{
            expandedRowKeys: subExpandedRowKeys,
            onExpandedRowsChange: setSubExpandedRowKeys,
          }}
          metas={{
            title: {
              dataIndex: 'ancestor_path',
              render: (_, record) => (
                <Space onClick={() => handleSubExpand(record)}>
                  <span>
                    {record?.user_id} - Email: {record.email} - Phone: {record.phone} - 伞下 NTS:{' '}
                    {record.total_nts} - 伞下用户: {record.total_user} - 伞下激活用户:{' '}
                    {record.total_activat_user} - 邀请人数: {record.invite_count} - 邀请激活人数:{' '}
                    {record.invite_activat_count} - NTS: {record.nts} - 伞下封禁 NTS:{' '}
                    {record.total_block_nts} - 伞下封禁用户: {record.total_block_user}
                  </span>
                </Space>
              ),
            },
            description: {
              dataIndex: 'total_nts',
              render: (_, record) => {
                return subExpandedRowKeys.includes(record?.user_id)
                  ? renderNestedList(subDataSource[record?.user_id] || [])
                  : null;
              },
            },
            actions: {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render: (_, _record) =>
                // <Button type="link" onClick={() => handleSubExpand(record)} style={{ padding: 0 }}>
                //   {subExpandedRowKeys.includes(record?.user_id) ? '关闭' : '展开'}
                // </Button>
                null,
            },
          }}
        />
      </div>
    ));
  };

  return (
    <PageContainer
      ghost
      waterMarkProps={{
        content: '',
      }}
    >
      <Card style={{ minHeight: '30vh' }}>
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="请输入用户ID"
            onChange={(e) => setUserId(Number(e.target.value))}
            style={{ width: 200 }}
          />
          <Button type="primary" onClick={handleFetchByUserId}>
            查询
          </Button>
          <Button
            key="toggle-all"
            type={expandedRowKeys.length === dataSource.length ? 'default' : 'primary'}
            onClick={handleToggleAll}
          >
            {expandedRowKeys.length === dataSource.length ? '全部关闭' : '全部展开'}
          </Button>
          <Select
            placeholder="选择排序字段"
            onChange={(value) => handleSort(value, sortOrder)}
            style={{ width: 200 }}
          >
            <Select.Option value="total_nts">伞下 NTS</Select.Option>
            <Select.Option value="total_user">伞下用户</Select.Option>
            <Select.Option value="invite_count">邀请次数</Select.Option>
          </Select>
          <Select
            placeholder="选择排序顺序"
            onChange={(value) => handleSort(sortField, value)}
            style={{ width: 200 }}
          >
            <Select.Option value="ascend">升序</Select.Option>
            <Select.Option value="descend">降序</Select.Option>
          </Select>
          <Button type="primary" onClick={() => handleDownload(userId)}>
            下载
          </Button>
        </Space>
        <ProList<HierarchyData>
          rowKey="user_id"
          headerTitle="伞下用户列表"
          expandable={{
            expandedRowKeys,
            onExpandedRowsChange: setExpandedRowKeys,
          }}
          dataSource={dataSource}
          loading={loading}
          metas={{
            title: {
              dataIndex: 'user_id',
              render: (_, record) => (
                <Space onClick={() => handleExpand(record)}>
                  <span>
                    {record?.user_id} - Email: {record.email} - Phone: {record.phone} - 伞下 NTS:{' '}
                    {record.total_nts} - 伞下用户: {record.total_user} - 伞下激活用户:{' '}
                    {record.total_activat_user} - 邀请人数: {record.invite_count} - 邀请激活人数:{' '}
                    {record.invite_activat_count} - NTS: {record.nts} - 伞下封禁NTS:{' '}
                    {record.total_block_nts} - 伞下封禁用户: {record.total_block_user}
                  </span>
                </Space>
              ),
            },
            description: {
              dataIndex: 'total_nts',
              render: (_, record) => {
                return expandedRowKeys.includes(record?.user_id)
                  ? renderNestedList(subDataSource[record?.user_id] || [])
                  : null;
              },
            },
            actions: {
              render: (_, record) => (
                <Button type="link" onClick={() => handleExpand(record)} style={{ padding: 0 }}>
                  {expandedRowKeys.includes(record?.user_id) ? '关闭' : '展开'}
                </Button>
              ),
            },
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default HierarchyList;
