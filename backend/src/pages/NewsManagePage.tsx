// =============================================
// TP全屋家居 · 后台 - 新闻管理（M5 · Phase 4.6）
// =============================================
import { useEffect, useState } from 'react';
import { Form, Input, Select, Switch, message, Popconfirm, Tag } from 'antd';
import AdminTable from '../components/AdminTable';
import AdminModalForm from '../components/AdminModalForm';
import { newsAPI } from '../api';

export default function NewsManagePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async (p = page) => {
    setLoading(true);
    try {
      const res: any = await newsAPI.list({ page: p, page_size: 10 });
      setData(res.items);
      setTotal(res.total);
    } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditItem(null); form.resetFields(); setModalOpen(true); };
  const openEdit = async (r: any) => {
    setEditItem(r);
    const detail: any = await newsAPI.get(r.id);
    form.setFieldsValue(detail);
    setModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const vals = await form.validateFields();
      setSubmitting(true);
      if (editItem) {
        await newsAPI.update(editItem.id, vals);
        message.success('新闻已更新');
      } else {
        await newsAPI.create(vals);
        message.success('新闻已创建');
      }
      setModalOpen(false);
      fetchData(page);
    } catch {}
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    await newsAPI.delete(id);
    message.success('已删除');
    fetchData(page);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '标题', dataIndex: 'title', width: 250, ellipsis: true },
    { title: '分类', dataIndex: 'category', width: 100,
      render: (v: string) => v === 'enterprise' ? <Tag color="blue">企业新闻</Tag> : <Tag color="green">行业资讯</Tag> },
    { title: '摘要', dataIndex: 'summary', ellipsis: true },
    { title: '发布', dataIndex: 'is_published', width: 60, render: (v: number) => v ? <Tag color="green">已发布</Tag> : <Tag>未发布</Tag> },
    { title: '日期', dataIndex: 'published_at', width: 110 },
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

  return (
    <>
      <AdminTable
        title="新闻管理"
        columns={columns}
        dataSource={data}
        loading={loading}
        total={total}
        page={page}
        pageSize={10}
        onPageChange={(p) => { setPage(p); fetchData(p); }}
        onAdd={openAdd}
        onRefresh={() => fetchData(page)}
      />
      <AdminModalForm
        form={form}
        title={editItem ? '编辑新闻' : '新增新闻'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        submitting={submitting}
        width={800}
      >
        <Form.Item name="title" label="新闻标题" rules={[{ required: true, message: '请输入标题' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="category" label="分类" rules={[{ required: true, message: '请选择分类' }]}>
          <Select options={[
            { label: '企业新闻', value: 'enterprise' },
            { label: '行业资讯', value: 'industry' },
          ]} />
        </Form.Item>
        <Form.Item name="summary" label="摘要">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="content" label="内容（支持HTML）" rules={[{ required: true, message: '请输入内容' }]}>
          <Input.TextArea rows={8} placeholder="支持HTML格式的富文本内容" />
        </Form.Item>
        <Form.Item name="cover_image" label="封面图片URL">
          <Input placeholder="/uploads/images/xxx.jpg" />
        </Form.Item>
        <Form.Item name="source" label="来源">
          <Input placeholder="如：TP家居编辑部" />
        </Form.Item>
        <Form.Item name="is_featured" label="推荐" valuePropName="checked" initialValue={false}>
          <Switch />
        </Form.Item>
        <Form.Item name="is_published" label="发布" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
      </AdminModalForm>
    </>
  );
}