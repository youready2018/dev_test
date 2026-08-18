// =============================================
// TP全屋家居 · 后台 - 用户管理（M9 · Phase 4.10）
// =============================================
import { useEffect, useState } from 'react';
import { Form, Input, Select, Switch, message, Popconfirm, Tag } from 'antd';
import AdminTable from '../components/AdminTable';
import AdminModalForm from '../components/AdminModalForm';
import { userAPI } from '../api';

export default function UserManagePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try { setData(await userAPI.list() as any); }
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
        const { password, ...rest } = vals;
        await userAPI.update(editItem.id, password ? vals : rest);
        message.success('用户已更新');
      } else {
        if (!vals.password) { message.warning('请设置密码'); return; }
        await userAPI.create(vals);
        message.success('用户已创建');
      }
      setModalOpen(false);
      fetchData();
    } catch {}
    finally { setSubmitting(false); }
  };

  const toggleStatus = async (r: any) => {
    await userAPI.toggleStatus(r.id, !r.is_active);
    message.success(r.is_active ? '已禁用' : '已启用');
    fetchData();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '用户名', dataIndex: 'username', width: 100 },
    { title: '姓名', dataIndex: 'real_name', width: 100 },
    { title: '角色', dataIndex: 'role', width: 110,
      render: (v: string) => ({
        super_admin: <Tag color="red">超级管理员</Tag>,
        content_admin: <Tag color="blue">内容管理员</Tag>,
        recruitment_admin: <Tag color="green">招聘管理员</Tag>,
        sales: <Tag color="orange">客服/销售</Tag>,
      }[v] || <Tag>{v}</Tag>),
    },
    { title: '部门', dataIndex: 'department', width: 100 },
    { title: '邮箱', dataIndex: 'email', width: 160, ellipsis: true },
    { title: '电话', dataIndex: 'phone', width: 110 },
    { title: '状态', dataIndex: 'is_active', width: 60,
      render: (v: number) => v ? <Tag color="green">启用</Tag> : <Tag color="red">禁用</Tag> },
    {
      title: '操作', width: 160, render: (_: any, r: any) => (
        <span>
          <a onClick={() => openEdit(r)} style={{ marginRight: 12 }}>编辑</a>
          <a onClick={() => toggleStatus(r)} style={{ marginRight: 12, color: r.is_active ? '#FF4D4F' : '#52C41A' }}>
            {r.is_active ? '禁用' : '启用'}
          </a>
          <Popconfirm title="确认删除用户？" onConfirm={async () => {
            // Users don't have a delete endpoint in our admin API, so we'll use update to disable
            await userAPI.toggleStatus(r.id, false);
            message.success('用户已禁用');
            fetchData();
          }}>
            <a style={{ color: '#FF4D4F' }}>删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <>
      <AdminTable
        title="用户管理"
        columns={columns}
        dataSource={data}
        loading={loading}
        onAdd={openAdd}
        onRefresh={fetchData}
      />
      <AdminModalForm
        form={form}
        title={editItem ? '编辑用户' : '新增用户'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        submitting={submitting}
        width={640}
      >
        <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input placeholder="工号或邮箱前缀" />
        </Form.Item>
        <Form.Item name="real_name" label="真实姓名" rules={[{ required: true, message: '请输入姓名' }]}>
          <Input />
        </Form.Item>
        {!editItem && (
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请设置密码' }]}>
            <Input.Password />
          </Form.Item>
        )}
        {editItem && (
          <Form.Item name="password" label="新密码（留空不修改）">
            <Input.Password placeholder="留空则不修改密码" />
          </Form.Item>
        )}
        <Form.Item name="role" label="角色" initialValue="content_admin">
          <Select options={[
            { label: '超级管理员', value: 'super_admin' },
            { label: '内容管理员', value: 'content_admin' },
            { label: '招聘管理员', value: 'recruitment_admin' },
            { label: '客服/销售', value: 'sales' },
          ]} />
        </Form.Item>
        <Form.Item name="department" label="部门">
          <Input placeholder="如：IT部" />
        </Form.Item>
        <Form.Item name="email" label="邮箱">
          <Input type="email" />
        </Form.Item>
        <Form.Item name="phone" label="电话">
          <Input />
        </Form.Item>
        <Form.Item name="is_active" label="启用" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
      </AdminModalForm>
    </>
  );
}