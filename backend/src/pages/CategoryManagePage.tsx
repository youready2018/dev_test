// =============================================
// TP全屋家居 · 后台 - 分类管理（M3 · Phase 4.4）
// =============================================
import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Switch, message, Popconfirm } from 'antd';
import AdminTable from '../components/AdminTable';
import AdminModalForm from '../components/AdminModalForm';
import { categoryAPI } from '../api';

export default function CategoryManagePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try { setData(await categoryAPI.list() as any); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditItem(null); form.resetFields(); setModalOpen(true); };
  const openEdit = (r: any) => { setEditItem(r); form.setFieldsValue(r); setModalOpen(true); };

  const handleOk = async () => {
    try {
      const vals = await form.validateFields();
      setSubmitting(true);
      if (editItem) {
        await categoryAPI.update(editItem.id, vals);
        message.success('分类已更新');
      } else {
        await categoryAPI.create(vals);
        message.success('分类已创建');
      }
      setModalOpen(false);
      fetchData();
    } catch { /* validation failed */ }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    await categoryAPI.delete(id);
    message.success('已删除');
    fetchData();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '名称', dataIndex: 'name', width: 150 },
    { title: '标识', dataIndex: 'slug', width: 120 },
    { title: '描述', dataIndex: 'description', ellipsis: true },
    { title: '排序', dataIndex: 'sort_order', width: 60 },
    { title: '启用', dataIndex: 'is_active', width: 60, render: (v: number) => v ? '✅' : '❌' },
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
        title="分类管理"
        columns={columns}
        dataSource={data}
        loading={loading}
        onAdd={openAdd}
        onRefresh={fetchData}
        showAddButton
      />
      <AdminModalForm
        form={form}
        title={editItem ? '编辑分类' : '新增分类'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        submitting={submitting}
      >
        <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
          <Input placeholder="如：客厅家具" />
        </Form.Item>
        <Form.Item name="slug" label="标识" rules={[{ required: true, message: '请输入唯一标识' }]}>
          <Input placeholder="如：living-room" />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="sort_order" label="排序" initialValue={0}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="is_active" label="启用" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
      </AdminModalForm>
    </>
  );
}