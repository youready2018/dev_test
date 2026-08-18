# =============================================
# TP全屋家居 · 系统与配置管理域 ORM 模型
# 业务域说明：后台用户、网站设置、轮播图
# 包含表：sys_users（后台用户表）
#         site_settings（网站设置表）
#         banners（轮播图表）
# =============================================
# 数据库设计文档参考：TP全屋家居网站数据库设计文档-v1.2
# 第 3.1 节 - 系统与配置域（3张表）
# =============================================

from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.database import Base


# =============================================
# 表1：sys_users — 后台用户表
# 功能：存储后台管理系统用户信息
# 说明：每位员工拥有独立账号，按角色分配权限
# 角色枚举：super_admin（超级管理员）
#           content_admin（内容管理员）
#           recruitment_admin（招聘管理员）
#           sales（客服/销售）
# =============================================
class SysUser(Base):
    """后台管理系统用户模型"""
    __tablename__ = "sys_users"

    id = Column(Integer, primary_key=True, autoincrement=True, comment="主键，用户编号")
    username = Column(String(50), nullable=False, unique=True, comment="登录用户名（工号或邮箱前缀）")
    password_hash = Column(String(255), nullable=False, comment="bcrypt 密码哈希")
    real_name = Column(String(50), nullable=False, comment="真实姓名")
    department = Column(String(100), nullable=True, default=None, comment="所属部门")
    role = Column(String(20), nullable=False, default="content_admin", comment="角色：super_admin/content_admin/recruitment_admin/sales")
    phone = Column(String(20), nullable=True, default=None, comment="手机号")
    email = Column(String(100), nullable=True, default=None, comment="企业邮箱")
    avatar = Column(String(255), nullable=True, default=None, comment="头像URL")
    is_active = Column(Integer, nullable=False, default=1, comment="是否启用：1=启用，0=禁用")
    created_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), comment="创建时间")
    updated_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), onupdate=func.datetime("now", "localtime"), comment="更新时间")

    def __repr__(self):
        return f"<SysUser(id={self.id}, username='{self.username}', role='{self.role}')>"


# =============================================
# 表2：site_settings — 网站设置表
# 功能：以键值对（KV）方式存储网站全局配置项
# 说明：支持多种值类型（text/json/html）
#       预置键名：company_name, company_logo, company_intro,
#       phone, email, address, seo_title, seo_keywords,
#       seo_description, wechat_qrcode 等
# =============================================
class SiteSetting(Base):
    """网站设置模型（KV键值对存储）"""
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, autoincrement=True, comment="主键")
    key = Column(String(100), nullable=False, unique=True, comment="设置键名")
    value = Column(Text, nullable=True, default=None, comment="设置值")
    value_type = Column(String(20), nullable=False, default="text", comment="值类型：text/json/html")
    created_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), comment="创建时间")
    updated_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), onupdate=func.datetime("now", "localtime"), comment="更新时间")

    def __repr__(self):
        return f"<SiteSetting(key='{self.key}', type='{self.value_type}')>"


# =============================================
# 表3：banners — 轮播图表
# 功能：首页轮播图配置，支持多图排序和链接跳转
# 说明：前台按 sort_order 升序、is_active=1 展示
# =============================================
class Banner(Base):
    """轮播图配置模型"""
    __tablename__ = "banners"

    id = Column(Integer, primary_key=True, autoincrement=True, comment="主键")
    title = Column(String(200), nullable=True, default=None, comment="轮播图标题")
    subtitle = Column(String(200), nullable=True, default=None, comment="轮播图副标题")
    description = Column(Text, nullable=True, default=None, comment="轮播图描述文字")
    tag_text = Column(String(100), nullable=True, default=None, comment="标签文字（如：匠心品质·原创设计）")
    image_url = Column(String(255), nullable=False, comment="图片URL")
    link_url = Column(String(255), nullable=True, default=None, comment="点击跳转链接（可选）")
    btn_primary_text = Column(String(50), nullable=True, default=None, comment="主按钮文字（如：免费预约量尺）")
    btn_primary_link = Column(String(255), nullable=True, default=None, comment="主按钮跳转路径")
    btn_outline_text = Column(String(50), nullable=True, default=None, comment="副按钮文字（如：浏览产品）")
    btn_outline_link = Column(String(255), nullable=True, default=None, comment="副按钮跳转路径")
    sort_order = Column(Integer, nullable=False, default=0, comment="排序值（升序排列）")
    is_active = Column(Integer, nullable=False, default=1, comment="是否启用：1=启用，0=禁用")
    created_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), comment="创建时间")
    updated_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), onupdate=func.datetime("now", "localtime"), comment="更新时间")

    def __repr__(self):
        return f"<Banner(id={self.id}, title='{self.title}', sort={self.sort_order})>"