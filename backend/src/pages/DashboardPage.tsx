// =============================================
// TP全屋家居 · 后台 - 仪表盘（M1 · Phase 4.2）
// =============================================
import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Spin } from 'antd';
import { dashboardAPI, appointmentAPI, messageAPI } from '../api';
import { ShoppingOutlined, PictureOutlined, FileTextOutlined, CalendarOutlined, MessageOutlined } from '@ant-design/icons';

interface Stats {
  product_count: number; case_count: number; news_count: number;
  appointment_count: number; pending_appointments: number;
  unread_messages: number; active_jobs: number; total_applications: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentAppts, setRecentAppts] = useState<any[]>([]);
  const [recentMsgs, setRecentMsgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardAPI.getStats(),
      appointmentAPI.list({ page: 1, page_size: 5 }),
      messageAPI.list({ page: 1, page_size: 5 }),
    ]).then(([s, a, m]: any) => {
      setStats(s);
      setRecentAppts(a.items || []);
      setRecentMsgs(m.items || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin style={{ display: 'block', padding: 100 }} />;

  const cards = [
    { title: '产品总数', value: stats?.product_count || 0, icon: <ShoppingOutlined />, color: '#B88846' },
    { title: '案例总数', value: stats?.case_count || 0, icon: <PictureOutlined />, color: '#52C41A' },
    { title: '新闻总数', value: stats?.news_count || 0, icon: <FileTextOutlined />, color: '#1890FF' },
    { title: '待处理预约', value: stats?.pending_appointments || 0, icon: <CalendarOutlined />, color: '#FAAD14' },
    { title: '未读留言', value: stats?.unread_messages || 0, icon: <MessageOutlined />, color: '#FF4D4F' },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        {cards.map((c) => (
          <Col key={c.title} xs={24} sm={12} lg={8} xl={4}>
            <Card hoverable>
              <Statistic
                title={c.title}
                value={c.value}
                prefix={<span style={{ color: c.color }}>{c.icon}</span>}
                valueStyle={{ color: '#2D2A24' }}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="最近预约" size="small">
            <Table
              rowKey="id"
              dataSource={recentAppts}
              pagination={false}
              size="small"
              columns={[
                { title: '姓名', dataIndex: 'name', width: 80 },
                { title: '电话', dataIndex: 'phone', width: 120 },
                { title: '状态', dataIndex: 'status', width: 80,
                  render: (v: string) => ({ pending: '待处理', contacted: '已联系', completed: '已完成', cancelled: '已取消' }[v] || v) },
                { title: '日期', dataIndex: 'appointment_date', width: 100 },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="最新留言" size="small">
            <Table
              rowKey="id"
              dataSource={recentMsgs}
              pagination={false}
              size="small"
              columns={[
                { title: '姓名', dataIndex: 'name', width: 80 },
                { title: '内容', dataIndex: 'content', ellipsis: true },
                { title: '状态', dataIndex: 'status', width: 80,
                  render: (v: string) => ({ unread: '未读', read: '已读', replied: '已回复' }[v] || v) },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}