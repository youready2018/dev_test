// =============================================
// TP全屋家居 · 后台 - 招聘管理（M8 · Phase 4.9）
// =============================================
import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Select, message, Popconfirm, Tag, Tabs, Table } from 'antd';
import AdminTable from '../components/AdminTable';
import AdminModalForm from '../components/AdminModalForm';
import { jobAPI } from '../api';
import apiClient from '../api';

export default function JobManagePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const [apps, setApps] = useState<any[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);

  const fetchData = async (p = page) => {
    setLoading(true);
    try {
      const res: any = await jobAPI.list({ page: p, page_size: 10 });
      setData(res.items);
      setTotal(res.total);
    } finally { setLoading(false); }
  };
  const fetchApps = async () => {
    setAppsLoading(true);
    try {
      const res: any = await apiClient.get('/applications', { params: { page: 1, page_size: 100 } });
      setApps(res.items || []);
    } catch {}
    finally { setAppsLoading(false); }
  };
  useEffect(() => { fetchData(); fetchApps(); }, []);

  const openAdd = () => { setEditItem(null); form.resetFields(); setModalOpen(true); };
  const openEdit = async (r: any) => {
    setEditItem(r);
    const detail: any = await jobAPI.get(r.id);
    form.setFieldsValue(detail);
    setModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const vals = await form.validateFields();
      setSubmitting(true);
      if (editItem) {
        await jobAPI.update(editItem.id, vals);
        message.success('职位已更新');
      } else {
        await jobAPI.create(vals);
        message.success('职位已创建');
      }
      setModalOpen(false);
      fetchData(page);
    } catch {}
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    await jobAPI.delete(id);
    message.success('已删除');
    fetchData(page);
  };

  const handleAppStatus = async (id: number, status: string) => {
    await apiClient.patch(`/applications/${id}`, { status });
    message.success('状态已更新');
    fetchApps();
  };

  const jobColumns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '职位名称', dataIndex: 'title', width: 180, ellipsis: true },
    { title: '分类', dataIndex: 'category', width: 80,
      render: (v: string) => v === 'social' ? <Tag color="blue">社招</Tag> : <Tag color="green">校招</Tag> },
    { title: '部门', dataIndex: 'department', width: 100 },
    { title: '地点', dataIndex: 'location', width: 90 },
    { title: '人数', dataIndex: 'headcount', width: 50 },
    { title: '状态', dataIndex: 'status', width: 70,
      render: (v: string) => v === 'published' ? <Tag color="green">发布中</Tag> : <Tag>已关闭</Tag> },
    {
      title: '操作', width: 140, render: (_: any, r: any) => (
        <span>
          <a onClick={() => openEdit(r)} style={{ marginRight: 12 }}>编辑</a>
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete(r.id)}>
            <a style={{ color: '#FF4D4F' }}>删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  const appColumns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '姓名', dataIndex: 'applicant_name', width: 90 },
    { title: '电话', dataIndex: 'phone', width: 120 },
    { title: '邮箱', dataIndex: 'email', width: 160, ellipsis: true },
    { title: '简历', dataIndex: 'resume_url', width: 100,
      render: (v: string) => v ? <a href={v} target="_blank">查看简历</a> : '无' },
    { title: '状态', dataIndex: 'status', width: 80,
      render: (v: string) => ({
        new: <Tag color="blue">新投递</Tag>,
        reviewing: <Tag color="orange">筛选中</Tag>,
        interview: <Tag color="purple">面试中</Tag>,
        accepted: <Tag color="green">已录用</Tag>,
        rejected: <Tag color="red">未通过</Tag>,
      }[v] || <Tag>{v}</Tag>),
    },
    {
      title: '操作', width: 200, render: (_: any, r: any) => (
        <span>
          <a onClick={() => handleAppStatus(r.id, 'reviewing')} style={{ marginRight: 8 }}>筛选</a>
          <a onClick={() => handleAppStatus(r.id, 'interview')} style={{ marginRight: 8 }}>面试</a>
          <a onClick={() => handleAppStatus(r.id, 'accepted')} style={{ marginRight: 8 }}>录用</a>
          <a onClick={() => handleAppStatus(r.id, 'rejected')} style={{ color: '#FF4D4F' }}>拒绝</a>
        </span>
      ),
    },
  ];

  return (
    <>
      <Tabs items={[
        {
          key: 'jobs',
          label: `职位管理 (${total})`,
          children: (
            <AdminTable
              title=""
              columns={jobColumns}
              dataSource={data}
              loading={loading}
              total={total}
              page={page}
              pageSize={10}
              onPageChange={(p) => { setPage(p); fetchData(p); }}
              onAdd={openAdd}
              onRefresh={() => fetchData(page)}
              showAddButton
            />
          ),
        },
        {
          key: 'apps',
          label: `投递记录 (${apps.length})`,
          children: (
            <Table
              rowKey="id"
              columns={appColumns}
              dataSource={apps}
              loading={appsLoading}
              pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
              scroll={{ x: 'max-content' }}
            />
          ),
        },
      ]} />
      <AdminModalForm
        form={form}
        title={editItem ? '编辑职位' : '新增职位'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        submitting={submitting}
        width={720}
      >
        <Form.Item name="title" label="职位名称" rules={[{ required: true, message: '请输入职位名称' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="category" label="招聘类型" rules={[{ required: true }]}>
          <Select options={[
            { label: '社会招聘', value: 'social' },
            { label: '校园招聘', value: 'campus' },
          ]} />
        </Form.Item>
        <Form.Item name="department" label="所属部门">
          <Input placeholder="如：技术部" />
        </Form.Item>
        <Form.Item name="location" label="工作地点">
          <Input placeholder="如：深圳" />
        </Form.Item>
        <Form.Item name="headcount" label="招聘人数" initialValue={1}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="responsibilities" label="岗位职责">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="requirements" label="任职要求">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="salary_range" label="薪资范围">
          <Input placeholder="如：15K-25K" />
        </Form.Item>
        <Form.Item name="deadline" label="截止日期">
          <Input placeholder="如：2026-12-31" />
        </Form.Item>
        <Form.Item name="status" label="状态" initialValue="published">
          <Select options={[
            { label: '发布中', value: 'published' },
            { label: '已关闭', value: 'closed' },
          ]} />
        </Form.Item>
      </AdminModalForm>
    </>
  );
}