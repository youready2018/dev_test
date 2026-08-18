# =============================================
# TP全屋家居 · 产品管理域 ORM 模型
# 业务域说明：空间分类、产品信息、产品多图
# 包含表：categories（产品空间分类表）
#         products（产品表）
#         product_images（产品图片表）
# =============================================
# 数据库设计文档参考：TP全屋家居网站数据库设计文档-v1.2
# 第 3.2 节 - 产品管理域（3张表）
# =============================================

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


# =============================================
# 表4：categories — 产品空间分类表
# 功能：产品按家居空间分类
#       如客厅家具、卧室家具、书房家具、餐厅家具、茶室家具、全屋定制
# 说明：slug 字段用于 URL 友好标识（如 "living-room"）
#       前台按 sort_order 升序、is_active=1 展示
# =============================================
class Category(Base):
    """产品空间分类模型"""
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, autoincrement=True, comment="主键")
    name = Column(String(50), nullable=False, comment="分类名称（如'客厅家具'）")
    slug = Column(String(50), nullable=False, unique=True, comment="URL友好标识（如'living-room'）")
    description = Column(Text, nullable=True, default=None, comment="分类描述")
    icon = Column(String(255), nullable=True, default=None, comment="分类图标URL")
    sort_order = Column(Integer, nullable=False, default=0, comment="排序值（升序排列）")
    is_active = Column(Integer, nullable=False, default=1, comment="是否启用：1=启用，0=禁用")
    created_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), comment="创建时间")
    updated_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), onupdate=func.datetime("now", "localtime"), comment="更新时间")

    # 关联关系：一个分类下有多个产品
    products = relationship("Product", back_populates="category")

    def __repr__(self):
        return f"<Category(id={self.id}, name='{self.name}', slug='{self.slug}')>"


# =============================================
# 表5：products — 产品表
# 功能：存储全屋家居产品的核心信息
# 说明：specifications 字段以 JSON 格式存储规格参数
#       cover_image 为主表冗余缓存，方便列表页快速获取封面
#       前台只展示 is_published=1 的产品
# =============================================
class Product(Base):
    """产品模型"""
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True, comment="主键，产品编号")
    name = Column(String(200), nullable=False, comment="产品名称")
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False, comment="所属空间分类（外键→categories.id）")
    series = Column(String(100), nullable=True, default=None, comment="所属系列（如胡桃禮、如意春等）")
    product_code = Column(String(50), nullable=True, default=None, unique=True, comment="产品编号/货号（唯一）")
    description = Column(Text, nullable=True, default=None, comment="产品描述（富文本 HTML）")
    specifications = Column(Text, nullable=True, default=None, comment="规格参数（JSON格式存储）")
    cover_image = Column(String(255), nullable=True, default=None, comment="封面图片URL（冗余缓存，方便列表页快速获取）")
    is_published = Column(Integer, nullable=False, default=0, comment="是否上架：1=上架，0=下架")
    sort_order = Column(Integer, nullable=False, default=0, comment="排序值")
    created_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), comment="创建时间")
    updated_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), onupdate=func.datetime("now", "localtime"), comment="更新时间")

    # 关联关系
    category = relationship("Category", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Product(id={self.id}, name='{self.name}', series='{self.series}')>"


# =============================================
# 表6：product_images — 产品图片表
# 功能：产品多角度图片管理，支持封面设置和排序
# 说明：is_cover=1 标识该图为封面图
#       删除产品时级联删除关联图片（CASCADE）
# =============================================
class ProductImage(Base):
    """产品图片模型"""
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, autoincrement=True, comment="主键")
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, comment="关联产品（外键→products.id，级联删除）")
    image_url = Column(String(255), nullable=False, comment="图片URL")
    is_cover = Column(Integer, nullable=False, default=0, comment="是否为封面：1=是，0=否")
    sort_order = Column(Integer, nullable=False, default=0, comment="排序值")
    created_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), comment="创建时间")
    updated_at = Column(DateTime, nullable=False, server_default=func.datetime("now", "localtime"), onupdate=func.datetime("now", "localtime"), comment="更新时间")

    # 关联关系
    product = relationship("Product", back_populates="images")

    def __repr__(self):
        return f"<ProductImage(id={self.id}, product_id={self.product_id}, is_cover={self.is_cover})>"