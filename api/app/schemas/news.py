# =============================================
# TP全屋家居 · Pydantic Schemas - 内容管理域
# 功能：新闻/资讯的请求与响应模型
# =============================================

from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class NewsBase(BaseModel):
    title: str
    category: str = "enterprise"  # enterprise / industry
    cover_image: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    source: Optional[str] = None
    is_published: bool = True
    is_featured: bool = False

class NewsResponse(NewsBase):
    id: int
    published_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    class Config: from_attributes = True