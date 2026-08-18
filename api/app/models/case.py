# =============================================
# TP全屋家居 · 案例管理域 ORM 模型
# 业务域说明：案例信息、案例图片、案例-产品关联
# 包含表：cases（案例表）
#         case_images（案例图片表）
#         case_products（案例-产品关联表/桥接表）
# =============================================
# 数据库设计文档参考：TP全屋家居网站数据库设计文档-v1.2
# 第 3.3 节 - 案例管理域（3张表）
# =============================================

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


# =============================================
# 表7：cases — 案例表
# 功能：展示真实客户案例，包含空间信息、设计风格
# 说明：前台只展示 is_published=1 的案例
#       category_id 关联到 categories 表（空间分类）
#       cover_image 为冗余缓存，方便列表页快速获取封面
# =============================================
class Case(Base):
    """案例模型"""
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, autoincrement=True, comment="主键")
    title = Column(String(200), nullable=False, comment="案例名称")
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False, comment="所属空间分类（外键→categories.id）")
    style = Column(String(50), nullable=True, default=None, comment="设计风格（现代/轻奢/简约等）")
    area = Column(String(50), nullable=True, default=None, comment="面积（如'120㎡'）")
    description = Column(Text, nullable=True, default=None, comment="案例描述（富文本 HTML）")
    cover_image = Column(String(255), nullable=True, default=None, comment="封面图片URL（冗余缓存）")
    is_published = Column(Integer, nullable=False, default=0, comment="是否发布：1=发布，0=未发布")
    sort_order = Column(Integer, nullable=False, default=0, comment="排序值")
    created_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), comment="创建时间")
    updated_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), onupdate=func.datetime("now", "localtime"), comment="更新时间")

    # 关联关系
    images = relationship("CaseImage", back_populates="case", cascade="all, delete-orphan")
    case_products = relationship("CaseProduct", back_populates="case", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Case(id={self.id}, title='{self.title}', style='{self.style}')>"


# =============================================
# 表8：case_images — 案例图片表
# 功能：案例多张效果图/实景照片管理
# 说明：is_cover=1 标识该图为封面图
#       删除案例时级联删除关联图片（CASCADE）
# =============================================
class CaseImage(Base):
    """案例图片模型"""
    __tablename__ = "case_images"

    id = Column(Integer, primary_key=True, autoincrement=True, comment="主键")
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="CASCADE"), nullable=False, comment="关联案例（外键→cases.id，级联删除）")
    image_url = Column(String(255), nullable=False, comment="图片URL")
    is_cover = Column(Integer, nullable=False, default=0, comment="是否为封面：1=是，0=否")
    sort_order = Column(Integer, nullable=False, default=0, comment="排序值")
    created_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), comment="创建时间")
    updated_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), onupdate=func.datetime("now", "localtime"), comment="更新时间")

    # 关联关系
    case = relationship("Case", back_populates="images")

    def __repr__(self):
        return f"<CaseImage(id={self.id}, case_id={self.case_id}, is_cover={self.is_cover})>"


# =============================================
# 表9：case_products — 案例-产品关联表（桥接表）
# 功能：实现案例与产品之间的多对多关系
# 说明：一个案例可使用多个产品，一个产品也可被多个案例引用
#       外键删除策略均为 CASCADE（删除案例或产品时自动删除关联记录）
#       case_id + product_id 联合唯一约束，防止重复关联
# =============================================
class CaseProduct(Base):
    """案例-产品关联模型（多对多桥接表）"""
    __tablename__ = "case_products"

    id = Column(Integer, primary_key=True, autoincrement=True, comment="主键")
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="CASCADE"), nullable=False, comment="关联案例（外键→cases.id）")
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, comment="关联产品（外键→products.id）")
    created_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), comment="创建时间")
    updated_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), onupdate=func.datetime("now", "localtime"), comment="更新时间")

    # 关联关系
    case = relationship("Case", back_populates="case_products")
    product = relationship("Product")

    def __repr__(self):
        return f"<CaseProduct(case_id={self.case_id}, product_id={self.product_id})>"