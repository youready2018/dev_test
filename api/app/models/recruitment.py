# =============================================
# TP全屋家居 · 招聘管理域 ORM 模型
# 业务域说明：招聘职位信息、求职者投递记录
# 包含表：jobs（招聘职位表）
#         job_applications（投递记录表）
# =============================================
# 数据库设计文档参考：TP全屋家居网站数据库设计文档-v1.2
# 第 3.5 节 - 招聘管理域（2张表）
# =============================================
# 说明：jobs 表存储社会招聘和校园招聘的职位信息
#       通过 category 字段区分：
#       - "social" = 社会招聘
#       - "campus" = 校园招聘
# =============================================

from sqlalchemy import Column, Integer, String, Text, DateTime, Date, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


# =============================================
# 表11：jobs — 招聘职位表
# 功能：存储社会招聘和校园招聘的职位信息
# 说明：status = 'published' 时前台可见（招聘中）
#       status = 'closed' 时前台显示"招聘已结束"
#       前台只展示 status='published' 且未过截止日期的职位
# =============================================
class Job(Base):
    """招聘职位模型"""
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, autoincrement=True, comment="主键")
    title = Column(String(200), nullable=False, comment="职位名称")
    category = Column(String(20), nullable=False, default="social", comment="分类：social（社会招聘）/ campus（校园招聘）")
    department = Column(String(100), nullable=True, default=None, comment="所属部门")
    location = Column(String(100), nullable=True, default=None, comment="工作地点")
    headcount = Column(Integer, nullable=False, default=1, comment="招聘人数")
    responsibilities = Column(Text, nullable=True, default=None, comment="岗位职责（富文本 HTML）")
    requirements = Column(Text, nullable=True, default=None, comment="任职要求（富文本 HTML）")
    salary_range = Column(String(100), nullable=True, default=None, comment="薪资范围（可选展示）")
    benefits = Column(Text, nullable=True, default=None, comment="福利待遇（富文本）")
    contact_email = Column(String(100), nullable=True, default=None, comment="联系邮箱")
    deadline = Column(Date, nullable=True, default=None, comment="截止日期")
    status = Column(String(20), nullable=False, default="published", comment="状态：published（发布中）/ closed（已下架）")
    sort_order = Column(Integer, nullable=False, default=0, comment="排序值")
    created_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), comment="创建时间")
    updated_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), onupdate=func.datetime("now", "localtime"), comment="更新时间")

    # 关联关系：一个职位下有多个投递记录
    applications = relationship("JobApplication", back_populates="job", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Job(id={self.id}, title='{self.title}', category='{self.category}')>"


# =============================================
# 表12：job_applications — 投递记录表
# 功能：记录求职者在线投递的简历信息
# 说明：求职者通过前台职位详情页的在线投递表单提交
#       简历文件通过文件上传接口存储
#       status = 'unread'（未查看）/ 'read'（已查看）
#       删除职位时级联删除关联投递记录（CASCADE）
# =============================================
class JobApplication(Base):
    """投递记录模型"""
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, autoincrement=True, comment="主键")
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, comment="关联职位（外键→jobs.id，级联删除）")
    applicant_name = Column(String(50), nullable=False, comment="投递人姓名")
    phone = Column(String(20), nullable=True, default=None, comment="联系电话")
    email = Column(String(100), nullable=True, default=None, comment="电子邮箱")
    resume_url = Column(String(255), nullable=True, default=None, comment="简历附件URL")
    cover_letter = Column(Text, nullable=True, default=None, comment="求职信（可选）")
    status = Column(String(20), nullable=False, default="unread", comment="状态：unread（未查看）/ read（已查看）")
    applied_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), comment="投递时间")
    updated_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), onupdate=func.datetime("now", "localtime"), comment="更新时间")

    # 关联关系
    job = relationship("Job", back_populates="applications")

    def __repr__(self):
        return f"<JobApplication(id={self.id}, applicant='{self.applicant_name}', job_id={self.job_id})>"