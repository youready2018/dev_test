# =============================================
# TP全屋家居 · 内容管理域 ORM 模型
# 业务域说明：新闻与资讯文章管理
# 包含表：news（新闻/资讯表）
# =============================================
# 数据库设计文档参考：TP全屋家居网站数据库设计文档-v1.2
# 第 3.4 节 - 内容管理域（1张表）
# =============================================
# 说明：news 表统一存储企业新闻和行业资讯
#       通过 category 字段区分：
#       - "enterprise" = 企业新闻
#       - "industry"  = 行业资讯
# =============================================

from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.database import Base


# =============================================
# 表10：news — 新闻/资讯表
# 功能：统一存储企业新闻和行业资讯文章
# 说明：category 字段区分新闻类型
#       is_featured 用于置顶重要文章
#       published_at 支持定时发布功能
#       前台只展示 is_published=1 的文章
# =============================================
class News(Base):
    """新闻/资讯模型"""
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, autoincrement=True, comment="主键")
    title = Column(String(200), nullable=False, comment="文章标题")
    category = Column(String(20), nullable=False, default="enterprise", comment="分类：enterprise（企业新闻）/ industry（行业资讯）")
    cover_image = Column(String(255), nullable=True, default=None, comment="封面图片URL")
    summary = Column(String(500), nullable=True, default=None, comment="文章摘要")
    content = Column(Text, nullable=True, default=None, comment="正文（富文本 HTML）")
    source = Column(String(100), nullable=True, default=None, comment="来源（转载时标明）")
    is_published = Column(Integer, nullable=False, default=0, comment="是否发布：1=发布，0=草稿")
    is_featured = Column(Integer, nullable=False, default=0, comment="是否置顶：1=置顶，0=普通")
    published_at = Column(DateTime, nullable=True, default=None, comment="发布时间（定时发布用，为NULL时按created_at排序）")
    created_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), comment="创建时间")
    updated_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), onupdate=func.datetime("now", "localtime"), comment="更新时间")

    def __repr__(self):
        return f"<News(id={self.id}, title='{self.title}', category='{self.category}')>"