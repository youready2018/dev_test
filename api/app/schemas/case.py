# =============================================
# TP全屋家居 · Pydantic Schemas - 案例管理域
# 功能：案例/案例图片/案例-产品关联的请求与响应模型
# =============================================

from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class CaseImageBase(BaseModel):
    image_url: str
    is_cover: bool = False
    sort_order: int = 0

class CaseImageResponse(CaseImageBase):
    id: int
    case_id: int
    class Config: from_attributes = True


class CaseProductBase(BaseModel):
    product_id: int

class CaseProductResponse(CaseProductBase):
    id: int
    case_id: int
    class Config: from_attributes = True


class CaseBase(BaseModel):
    title: str
    category_id: Optional[int] = None
    style: Optional[str] = None
    area: Optional[str] = None
    description: Optional[str] = None
    cover_image: Optional[str] = None
    is_published: bool = True

class CaseResponse(CaseBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    class Config: from_attributes = True

class CaseDetailResponse(CaseResponse):
    images: list[CaseImageResponse] = []
    product_ids: list[int] = []