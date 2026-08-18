# =============================================
# TP全屋家居 · 客户获客域 ORM 模型
# 业务域说明：预约量尺、留言咨询
# 包含表：appointments（预约量尺表）
#         messages（留言咨询表）
# =============================================
# 数据库设计文档参考：TP全屋家居网站数据库设计文档-v1.2
# 第 3.6 节 - 客户获客域（2张表）
# =============================================
# 说明：预约和留言均为独立表，v1.0 无用户登录体系
#       故不关联 sys_users 表
#       访客通过前台表单提交记录，后台管理员查看和处理
# =============================================

from sqlalchemy import Column, Integer, String, Text, DateTime, Date, func
from app.database import Base


# =============================================
# 表13：appointments — 预约量尺表
# 功能：记录潜在客户提交的预约量尺申请
# 说明：访客通过前台"在线预约"页面提交表单
#       后台管理员查看和处理预约记录
#       状态流转：pending（待处理）→ contacted（已联系）
#              → completed（已完成）/ cancelled（已取消）
# =============================================
class Appointment(Base):
    """预约量尺模型"""
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, autoincrement=True, comment="主键")
    name = Column(String(50), nullable=False, comment="联系人姓名")
    phone = Column(String(20), nullable=False, comment="联系电话")
    city = Column(String(50), nullable=True, default=None, comment="所在城市（可选字段）")
    address = Column(String(255), nullable=True, default=None, comment="预约地址")
    appointment_date = Column(Date, nullable=True, default=None, comment="预约日期")
    time_slot = Column(String(20), nullable=True, default=None, comment="时间段（上午/下午/全天）")
    remark = Column(Text, nullable=True, default=None, comment="备注说明")
    status = Column(String(20), nullable=False, default="pending", comment="状态：pending（待处理）/ contacted（已联系）/ completed（已完成）/ cancelled（已取消）")
    internal_note = Column(Text, nullable=True, default=None, comment="内部处理备注（仅后台可见）")
    created_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), comment="创建时间")
    updated_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), onupdate=func.datetime("now", "localtime"), comment="更新时间")

    def __repr__(self):
        return f"<Appointment(id={self.id}, name='{self.name}', status='{self.status}')>"


# =============================================
# 表14：messages — 留言咨询表
# 功能：记录访客提交的留言咨询
# 说明：访客通过前台"联系我们"页面提交留言表单
#       后台管理员查看和回复留言
#       状态流转：unread（未读）→ read（已读）→ replied（已回复）
# =============================================
class Message(Base):
    """留言咨询模型"""
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, autoincrement=True, comment="主键")
    name = Column(String(50), nullable=False, comment="留言人姓名")
    phone = Column(String(20), nullable=True, default=None, comment="联系电话")
    content = Column(Text, nullable=False, comment="留言内容")
    reply = Column(Text, nullable=True, default=None, comment="后台回复内容")
    status = Column(String(20), nullable=False, default="unread", comment="状态：unread（未读）/ read（已读）/ replied（已回复）")
    created_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), comment="创建时间")
    updated_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), onupdate=func.datetime("now", "localtime"), comment="更新时间")

    def __repr__(self):
        return f"<Message(id={self.id}, name='{self.name}', status='{self.status}')>"