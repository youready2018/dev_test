// =============================================
// TP全屋家居 · 后台 - 留言管理（M7 · Phase 4.8）
// =============================================
import { useEffect, useState } from 'react';
import { Form, Input, message, Tag, Descriptions } from 'antd';
import AdminTable from '../components/AdminTable';
import AdminModalForm from '../components/AdminModalForm';
import { messageAPI } from '../api';

const statusMap: Record<string, { label: string; color: string }> = {
  unread: { label: '未读', color: 'red' },
  read: { label: '已读', color: 'blue' },
  replied: { label: '已回复', color: 'green' },
};

export default function MessageManagePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async (p = page) => {
    setLoading(true);
    try {
      const res: any = await messageAPI.list({ page: p, page_size: 10 });
      setData(res.items);
      setTotal(res.total);
    } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const viewDetail = async (r: any) => {
    try {
      const d: any = await messageAPI.get(r.id);
      setDetail(d);
      form.setFieldsValue({ reply: d.reply || '', status: d.status });
      setDetailOpen(true);
    } catch { message.error('获取详情失败'); }
  };

  const handleReply = async () => {
    if (!detail) return;
    try {
      const vals = await form.validateFields();
      setSubmitting(true);
      await messageAPI.reply(detail.id, vals);
      message.success('回复成功');
      setDetailOpen(false);
      fetchData(page);
    } catch {}
    finally { setSubmitting(false); }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '姓名', dataIndex: 'name', width: 90 },
    { title: '电话', dataIndex: 'phone', width: 120 },
    { title: '内容', dataIndex: 'content', ellipsis: true },
    { title: '状态', dataIndex: 'status', width: 70,
      render: (v: string) => {
        const s = statusMap[v] || { label: v, color: 'default' };
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
    { title: '时间', dataIndex: 'created_at', width: 170 },
    {
      title: '操作', width: 100, render: (_: any, r: any) => (
        <a onClick={() => viewDetail(r)}>查看/回复</a>
      ),
    },
  ];

  return (
    <>
      <AdminTable
        title="留言管理"
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
        title="留言详情"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        onOk={handleReply}
        submitting={submitting}
        width={700}
      >
        {detail && (
          <Descriptions column={1} size="small" bordered style={{ marginBottom: 20 }}>
            <Descriptions.Item label="姓名">{detail.name}</Descriptions.Item>
            <Descriptions.Item label="电话">{detail.phone}</Descriptions.Item>
            <Descriptions.Item label="留言内容">{detail.content}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={(statusMap[detail.status] || {}).color}>{(statusMap[detail.status] || {}).label}</Tag>
            </Descriptions.Item>
            {detail.reply && <Descriptions.Item label="已回复内容">{detail.reply}</Descriptions.Item>}
          </Descriptions>
        )}
        <Form.Item name="reply" label="回复内容">
          <Input.TextArea rows={4} placeholder="输入回复内容..." />
        </Form.Item>
      </AdminModalForm>
    </>
  );
}