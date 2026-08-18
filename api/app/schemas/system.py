# =============================================
# TP全屋家居 · Pydantic Schemas - 系统与配置域
# 功能：分类/Banner/网站设置的请求与响应模型
# =============================================

from datetime import datetime
from typing import Optional
from pydantic import BaseModel


# ---------- 分类（空间分类） ----------
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True

class CategoryResponse(CategoryBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    class Config: from_attributes = True


# ---------- 轮播图 ----------
class BannerBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    tag_text: Optional[str] = None
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    btn_primary_text: Optional[str] = None
    btn_primary_link: Optional[str] = None
    btn_outline_text: Optional[str] = None
    btn_outline_link: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True

class BannerResponse(BannerBase):
    id: int
    created_at: Optional[datetime] = None
    class Config: from_attributes = True


# ---------- 网站设置 ----------
class SiteSettingBase(BaseModel):
    key: str
    value: str
    value_type: str = "text"

class SiteSettingResponse(SiteSettingBase):
    id: int
    class Config: from_attributes = True