// =============================================
// TP全屋家居 · 后台 - 产品管理（M2 · Phase 4.3）
// =============================================
import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Select, Switch, message, Popconfirm, Tag } from 'antd';
import AdminTable from '../components/AdminTable';
import AdminModalForm from '../components/AdminModalForm';
import { productAPI, categoryAPI } from '../api';

export default function ProductManagePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [form] = Form.useForm();

  const fetchData = async (p = page, s = search) => {
    setLoading(true);
    try {
      const res: any = await productAPI.list({ page: p, page_size: 10, search: s || undefined });
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
    const detail: any = await productAPI.get(r.id);
    form.setFieldsValue(detail);
    setModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const vals = await form.validateFields();
      setSubmitting(true);
      if (editItem) {
        await productAPI.update(editItem.id, vals);
        message.success('产品已更新');
      } else {
        await productAPI.create(vals);
        message.success('产品已创建');
      }
      setModalOpen(false);
      fetchData(page);
    } catch {}
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    await productAPI.delete(id);
    message.success('已删除');
    fetchData(page);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '名称', dataIndex: 'name', width: 180, ellipsis: true },
    { title: '编号', dataIndex: 'product_code', width: 110 },
    { title: '系列', dataIndex: 'series', width: 100 },
    { title: '发布', dataIndex: 'is_published', width: 60, render: (v: number) => v ? <Tag color="green">已发布</Tag> : <Tag>未发布</Tag> },
    { title: '排序', dataIndex: 'sort_order', width: 60 },
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
        title="产品管理"
        columns={columns}
        dataSource={data}
        loading={loading}
        total={total}
        page={page}
        pageSize={10}
        onPageChange={(p) => { setPage(p); fetchData(p, search); }}
        onSearch={(v) => { setSearch(v); setPage(1); fetchData(1, v); }}
        onAdd={openAdd}
        onRefresh={() => fetchData(page, search)}
        searchPlaceholder="搜索产品名称..."
      />
      <AdminModalForm
        form={form}
        title={editItem ? '编辑产品' : '新增产品'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        submitting={submitting}
        width={720}
      >
        <Form.Item name="name" label="产品名称" rules={[{ required: true, message: '请输入产品名称' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="category_id" label="所属分类" rules={[{ required: true, message: '请选择分类' }]}>
          <Select
            options={categories.map((c: any) => ({ label: c.name, value: c.id }))}
          />
        </Form.Item>
        <Form.Item name="product_code" label="产品编号">
          <Input placeholder="如：TP-8000" />
        </Form.Item>
        <Form.Item name="series" label="系列">
          <Input placeholder="如：经典系列" />
        </Form.Item>
        <Form.Item name="description" label="产品描述">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="specifications" label="规格参数 (JSON)">
          <Input.TextArea rows={2} placeholder='{"材质":"真皮","尺寸":"200x80cm"}' />
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