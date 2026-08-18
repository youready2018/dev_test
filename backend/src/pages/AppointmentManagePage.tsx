// =============================================
// TP全屋家居 · 后台 - 预约管理（M6 · Phase 4.7）
// =============================================
import { useEffect, useState } from 'react';
import { Form, Input, Select, message, Tag, Card, Descriptions } from 'antd';
import AdminTable from '../components/AdminTable';
import AdminModalForm from '../components/AdminModalForm';
import { appointmentAPI } from '../api';

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '待处理', color: 'orange' },
  contacted: { label: '已联系', color: 'blue' },
  completed: { label: '已完成', color: 'green' },
  cancelled: { label: '已取消', color: 'red' },
};

export default function AppointmentManagePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchData = async (p = page) => {
    setLoading(true);
    try {
      const res: any = await appointmentAPI.list({ page: p, page_size: 10 });
      setData(res.items);
      setTotal(res.total);
    } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const viewDetail = async (r: any) => {
    try {
      const d: any = await appointmentAPI.get(r.id);
      setDetail(d);
      form.setFieldsValue({ status: d.status, internal_note: d.internal_note });
      setDetailOpen(true);
    } catch { message.error('获取详情失败'); }
  };

  const handleUpdate = async () => {
    if (!detail) return;
    try {
      const vals = await form.validateFields();
      await appointmentAPI.update(detail.id, vals);
      message.success('状态已更新');
      setDetailOpen(false);
      fetchData(page);
    } catch {}
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '姓名', dataIndex: 'name', width: 90 },
    { title: '电话', dataIndex: 'phone', width: 120 },
    { title: '城市', dataIndex: 'city', width: 90 },
    { title: '地址', dataIndex: 'address', ellipsis: true },
    { title: '日期', dataIndex: 'appointment_date', width: 100 },
    { title: '时段', dataIndex: 'time_slot', width: 70 },
    { title: '状态', dataIndex: 'status', width: 80,
      render: (v: string) => {
        const s = statusMap[v] || { label: v, color: 'default' };
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
    {
      title: '操作', width: 100, render: (_: any, r: any) => (
        <a onClick={() => viewDetail(r)}>查看详情</a>
      ),
    },
  ];

  return (
    <>
      <AdminTable
        title="预约管理"
        columns={columns}
        dataSource={data}
        loading={loading}
        total={total}
        page={page}
        pageSize={10}
        onPageChange={(p) => { setPage(p); fetchData(p); }}
        onRefresh={() => fetchData(page)}
        showAddButton={false}
      />
      <AdminModalForm
        form={form}
        title="预约详情"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        onOk={handleUpdate}
        width={700}
      >
        {detail && (
          <Descriptions column={2} size="small" bordered style={{ marginBottom: 20 }}>
            <Descriptions.Item label="姓名">{detail.name}</Descriptions.Item>
            <Descriptions.Item label="电话">{detail.phone}</Descriptions.Item>
            <Descriptions.Item label="城市">{detail.city}</Descriptions.Item>
            <Descriptions.Item label="地址">{detail.address}</Descriptions.Item>
            <Descriptions.Item label="预约日期">{detail.appointment_date}</Descriptions.Item>
            <Descriptions.Item label="时段">{detail.time_slot}</Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>{detail.remark || '无'}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{detail.created_at}</Descriptions.Item>
            <Descriptions.Item label="当前状态">
              <Tag color={(statusMap[detail.status] || {}).color}>{(statusMap[detail.status] || {}).label || detail.status}</Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
        <Form.Item name="status" label="更新状态" rules={[{ required: true }]}>
          <Select options={[
            { label: '待处理', value: 'pending' },
            { label: '已联系', value: 'contacted' },
            { label: '已完成', value: 'completed' },
            { label: '已取消', value: 'cancelled' },
          ]} />
        </Form.Item>
        <Form.Item name="internal_note" label="内部备注">
          <Input.TextArea rows={3} />
        </Form.Item>
      </AdminModalForm>
    </>
  );
}