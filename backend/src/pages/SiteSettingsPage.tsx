// =============================================
// TP全屋家居 · 后台 - 网站设置（M10 · Phase 4.11）
// =============================================
import { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message, Tabs, Table, Modal, InputNumber, Switch, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { settingAPI, bannerAPI } from '../api';

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const [banners, setBanners] = useState<any[]>([]);
  const [bannerLoading, setBannerLoading] = useState(false);
  const [bannerModal, setBannerModal] = useState(false);
  const [editBanner, setEditBanner] = useState<any>(null);
  const [bannerSubmitting, setBannerSubmitting] = useState(false);
  const [bannerForm] = Form.useForm();

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data: any = await settingAPI.get();
      setSettings(data);
      form.setFieldsValue(data);
    } finally { setLoading(false); }
  };

  const fetchBanners = async () => {
    setBannerLoading(true);
    try { setBanners(await bannerAPI.list() as any); }
    finally { setBannerLoading(false); }
  };

  useEffect(() => { fetchSettings(); fetchBanners(); }, []);

  const handleSave = async () => {
    try {
      const vals = await form.validateFields();
      setSaving(true);
      await settingAPI.update(vals);
      message.success('设置已保存');
      fetchSettings();
    } catch { }
    finally { setSaving(false); }
  };

  const openBannerAdd = () => { setEditBanner(null); bannerForm.resetFields(); setBannerModal(true); };
  const openBannerEdit = (r: any) => { setEditBanner(r); bannerForm.setFieldsValue(r); setBannerModal(true); };

  const handleBannerOk = async () => {
    try {
      const vals = await bannerForm.validateFields();
      setBannerSubmitting(true);
      if (editBanner) {
        await bannerAPI.update(editBanner.id, vals);
        message.success('轮播图已更新');
      } else {
        await bannerAPI.create(vals);
        message.success('轮播图已创建');
      }
      setBannerModal(false);
      fetchBanners();
    } catch { }
    finally { setBannerSubmitting(false); }
  };

  const handleBannerDelete = async (id: number) => {
    await bannerAPI.delete(id);
    message.success('已删除');
    fetchBanners();
  };

  const bannerColumns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '标题', dataIndex: 'title', width: 140, ellipsis: true },
    { title: '标签', dataIndex: 'tag_text', width: 90, ellipsis: true, render: (v: string) => v || '-' },
    { title: '副标题', dataIndex: 'subtitle', width: 140, ellipsis: true, render: (v: string) => v || '-' },
    { title: '描述', dataIndex: 'description', width: 180, ellipsis: true, render: (v: string) => v || '-' },
    { title: '主按钮', dataIndex: 'btn_primary_text', width: 130, ellipsis: true, render: (v: string, r: any) =>
      v ? `${v} → ${r.btn_primary_link || '-'}` : '-'
    },
    { title: '次要按钮', dataIndex: 'btn_outline_text', width: 130, ellipsis: true, render: (v: string, r: any) =>
      v ? `${v} → ${r.btn_outline_link || '-'}` : '-'
    },
    { title: '图片URL', dataIndex: 'image_url', width: 160, ellipsis: true },
    { title: '排序', dataIndex: 'sort_order', width: 60 },
    { title: '启用', dataIndex: 'is_active', width: 60, render: (v: number) => v ? '✅' : '❌' },
    {
      title: '操作', width: 140, render: (_: any, r: any) => (
        <span>
          <a onClick={() => openBannerEdit(r)} style={{ marginRight: 12 }}>编辑</a>
          <Popconfirm title="确认删除？" onConfirm={() => handleBannerDelete(r.id)}>
            <a style={{ color: '#FF4D4F' }}>删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <Tabs items={[
      {
        key: 'settings',
        label: '基本设置',
        children: (
          <Card title="网站设置" loading={loading}>
            <Form form={form} layout="vertical" style={{ maxWidth: 600 }}>
              <Form.Item name="company_name" label="公司名称">
                <Input />
              </Form.Item>
              <Form.Item name="company_intro" label="公司简介（HTML）">
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item name="phone" label="联系电话">
                <Input placeholder="如：400-xxx-xxxx" />
              </Form.Item>
              <Form.Item name="email" label="联系邮箱">
                <Input />
              </Form.Item>
              <Form.Item name="address" label="公司地址">
                <Input />
              </Form.Item>
              <Form.Item name="seo_title" label="SEO 标题">
                <Input />
              </Form.Item>
              <Form.Item name="seo_keywords" label="SEO 关键词">
                <Input placeholder="逗号分隔" />
              </Form.Item>
              <Form.Item name="seo_description" label="SEO 描述">
                <Input.TextArea rows={2} />
              </Form.Item>
              <Form.Item name="company_logo" label="Logo URL">
                <Input placeholder="/uploads/logo.png" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={handleSave} loading={saving}>保存设置</Button>
              </Form.Item>
            </Form>
          </Card>
        ),
      },
      {
        key: 'banners',
        label: '轮播图管理',
        children: (
          <Card
            title="首页轮播图"
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={openBannerAdd}>新增轮播图</Button>}
          >
            <Table
              rowKey="id"
              columns={bannerColumns}
              dataSource={banners}
              loading={bannerLoading}
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
            <Modal
              title={editBanner ? '编辑轮播图' : '新增轮播图'}
              open={bannerModal}
              onCancel={() => setBannerModal(false)}
              onOk={handleBannerOk}
              confirmLoading={bannerSubmitting}
              destroyOnClose
              width={600}
            >
              <Form form={bannerForm} layout="vertical" style={{ marginTop: 16 }}>
                <Form.Item name="title" label="主标题">
                  <Input placeholder="如：全屋定制·品质生活" />
                </Form.Item>
                <Form.Item name="subtitle" label="副标题">
                  <Input placeholder="如：TP全屋家居，为每个家庭量身定制" />
                </Form.Item>
                <Form.Item name="tag_text" label="标签文字">
                  <Input placeholder="如：新品上市 / 限时特惠" />
                </Form.Item>
                <Form.Item name="description" label="描述">
                  <Input.TextArea rows={3} placeholder="轮播图中的详细描述文字" />
                </Form.Item>
                <Form.Item name="image_url" label="图片URL" rules={[{ required: true, message: '请输入图片URL' }]}>
                  <Input placeholder="/uploads/banners/xxx.jpg" />
                </Form.Item>
                <Form.Item name="link_url" label="整体跳转链接">
                  <Input placeholder="可选，点击整个轮播图时跳转" />
                </Form.Item>

                <div style={{ borderTop: '1px solid #e8e8e8', margin: '16px 0 8px', paddingTop: 12 }}>
                  <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>主按钮（实心）</div>
                  <Form.Item name="btn_primary_text" label="文字" style={{ marginBottom: 8 }}>
                    <Input placeholder="如：立即咨询" />
                  </Form.Item>
                  <Form.Item name="btn_primary_link" label="跳转链接" style={{ marginBottom: 8 }}>
                    <Input placeholder="/products" />
                  </Form.Item>
                </div>

                <div style={{ borderTop: '1px solid #e8e8e8', margin: '8px 0', paddingTop: 12 }}>
                  <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>次要按钮（描边）</div>
                  <Form.Item name="btn_outline_text" label="文字" style={{ marginBottom: 8 }}>
                    <Input placeholder="如：查看案例" />
                  </Form.Item>
                  <Form.Item name="btn_outline_link" label="跳转链接" style={{ marginBottom: 8 }}>
                    <Input placeholder="/cases" />
                  </Form.Item>
                </div>

                <Form.Item name="sort_order" label="排序" initialValue={0}>
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="is_active" label="启用" valuePropName="checked" initialValue={true}>
                  <Switch />
                </Form.Item>
              </Form>
            </Modal>
          </Card>
        ),
      },
    ]} />
  );
}