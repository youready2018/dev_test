// =============================================
// TP全屋家居 · 后台 - 案例管理（M4 · Phase 4.5）
// =============================================
import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Select, Switch, message, Popconfirm, Tag } from 'antd';
import AdminTable from '../components/AdminTable';
import AdminModalForm from '../components/AdminModalForm';
import { caseAPI, categoryAPI } from '../api';

export default function CaseManagePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [form] = Form.useForm();

  const fetchData = async (p = page) => {
    setLoading(true);
    try {
      const res: any = await caseAPI.list({ page: p, page_size: 10 });
      setData(res.items);
      setTotal(res.total);
    } finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try { setCategories(await categoryAPI.list() as any); } catch {}
  };

  useEffect(() => { fetchData(); fetchCategories(); }, []);

  const openAdd = () => { setEditItem(null); form.resetFields(); setModalOpen(true); };
  const openEdit = async (r: any) => {
    setEditItem(r);
    const detail: any = await caseAPI.get(r.id);
    form.setFieldsValue(detail);
    setModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const vals = await form.validateFields();
      setSubmitting(true);
      if (editItem) {
        await caseAPI.update(editItem.id, vals);
        message.success('案例已更新');
      } else {
        await caseAPI.create(vals);
        message.success('案例已创建');
      }
      setModalOpen(false);
      fetchData(page);
    } catch {}
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    await caseAPI.delete(id);
    message.success('已删除');
    fetchData(page);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '标题', dataIndex: 'title', width: 200, ellipsis: true },
    { title: '风格', dataIndex: 'style', width: 90 },
    { title: '面积', dataIndex: 'area', width: 80 },
    { title: '发布', dataIndex: 'is_published', width: 60, render: (v: number) => v ? <Tag color="green">已发布</Tag> : <Tag>未发布</Tag> },
    { title: '封面', dataIndex: 'cover_image', width: 100, ellipsis: true },
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
        title="案例管理"
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
        title={editItem ? '编辑案例' : '新增案例'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        submitting={submitting}
        width={720}
      >
        <Form.Item name="title" label="案例标题" rules={[{ required: true, message: '请输入标题' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="category_id" label="所属空间" rules={[{ required: true, message: '请选择空间' }]}>
          <Select options={categories.map((c: any) => ({ label: c.name, value: c.id }))} />
        </Form.Item>
        <Form.Item name="style" label="设计风格">
          <Input placeholder="如：现代、轻奢、简约" />
        </Form.Item>
        <Form.Item name="area" label="面积">
          <Input placeholder="如：120㎡" />
        </Form.Item>
        <Form.Item name="description" label="案例描述">
          <Input.TextArea rows={4} placeholder="支持HTML格式" />
        </Form.Item>
        <Form.Item name="cover_image" label="封面图片URL">
          <Input placeholder="/uploads/images/xxx.jpg" />
        </Form.Item>
        <Form.Item name="sort_order" label="排序" initialValue={0}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="is_published" label="发布" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
      </AdminModalForm>
    </>
  );
}