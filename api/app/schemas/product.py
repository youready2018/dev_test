# =============================================
# TP全屋家居 · Pydantic Schemas - 产品管理域
# 功能：产品/产品图片的请求与响应模型
# =============================================

import json
from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, field_validator

from .system import CategoryResponse


class ProductImageBase(BaseModel):
    image_url: str
    is_cover: bool = False
    sort_order: int = 0

class ProductImageResponse(ProductImageBase):
    id: int
    product_id: int
    class Config: from_attributes = True


class ProductBase(BaseModel):
    name: str
    category_id: int
    series: Optional[str] = None
    product_code: Optional[str] = None
    description: Optional[str] = None
    specifications: Optional[Any] = None
    cover_image: Optional[str] = None
    is_published: bool = True
    sort_order: int = 0

class ProductResponse(ProductBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    class Config: from_attributes = True

    @field_validator("specifications", mode="before")
    @classmethod
    def parse_specifications(cls, v: Any) -> Any:
        """将 JSON 字符串解析为 dict"""
        if isinstance(v, str):
            try:
                return json.loads(v)
            except (json.JSONDecodeError, TypeError):
                return v
        return v

class ProductDetailResponse(ProductResponse):
    category: Optional[CategoryResponse] = None
    images: list[ProductImageResponse] = []