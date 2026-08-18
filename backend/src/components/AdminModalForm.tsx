// =============================================
// TP全屋家居 · 后台 - AdminModalForm 全局组件（Phase 2.4）
// 功能：统一增/改弹窗表单
// 说明：基于 Ant Design Modal + Form 封装
//       所有后台管理模块的统一新增/编辑入口
// =============================================

import type { FormInstance } from 'antd';
import { Modal, Form, Spin } from 'antd';

interface AdminModalFormProps {
  title: string;
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
  loading?: boolean;
  submitting?: boolean;
  children: React.ReactNode;
  width?: number;
  form: FormInstance;
}

export default function AdminModalForm({
  title,
  open,
  onCancel,
  onOk,
  loading = false,
  submitting = false,
  children,
  width = 640,
  form,
}: AdminModalFormProps) {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      confirmLoading={submitting}
      destroyOnClose
      width={width}
      maskClosable={false}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          {children}
        </Form>
      </Spin>
    </Modal>
  );
}