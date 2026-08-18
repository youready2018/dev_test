// =============================================
// TP全屋家居 · 后台 - AdminTable 全局组件（Phase 2.4）
// 功能：统一管理列表页，含筛选栏 + 表格 + 分页 + 操作列
// 说明：基于 Ant Design Table 组件封装
//       所有后台管理模块统一使用此组件
// =============================================

import { Table, Card, Input, Button, Space } from 'antd';
import { SearchOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';

interface AdminTableProps {
  title: string;
  columns: any[];
  dataSource: any[];
  loading?: boolean;
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onSearch?: (value: string) => void;
  onAdd?: () => void;
  onRefresh?: () => void;
  searchPlaceholder?: string;
  showAddButton?: boolean;
  rowKey?: string;
}

export default function AdminTable({
  title,
  columns,
  dataSource,
  loading = false,
  total = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  onSearch,
  onAdd,
  onRefresh,
  searchPlaceholder = '搜索...',
  showAddButton = true,
  rowKey = 'id',
}: AdminTableProps) {
  return (
    <Card
      title={title}
      extra={
        <Space>
          {onSearch && (
            <Input.Search
              placeholder={searchPlaceholder}
              prefix={<SearchOutlined />}
              onSearch={onSearch}
              allowClear
              style={{ width: 220 }}
            />
          )}
          {onRefresh && (
            <Button icon={<ReloadOutlined />} onClick={onRefresh}>
              刷新
            </Button>
          )}
          {showAddButton && onAdd && (
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
              新增
            </Button>
          )}
        </Space>
      }
      styles={{ body: { padding: 0 } }}
    >
      <Table
        rowKey={rowKey}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={
          total > pageSize
            ? {
                current: page,
                pageSize,
                total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (t) => `共 ${t} 条`,
                onChange: onPageChange,
              }
            : false
        }
        scroll={{ x: 'max-content' }}
      />
    </Card>
  );
}