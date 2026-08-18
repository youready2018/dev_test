# =============================================
# TP全屋家居 · Pydantic Schemas - 客户获客域
# 功能：预约/留言的请求与响应模型
# =============================================

from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


class AppointmentBase(BaseModel):
    name: str
    phone: str
    city: Optional[str] = None
    address: Optional[str] = None
    appointment_date: Optional[date] = None
    time_slot: Optional[str] = None
    remark: Optional[str] = None

class AppointmentResponse(AppointmentBase):
    id: int
    status: str = "pending"
    created_at: Optional[datetime] = None
    class Config: from_attributes = True


class MessageBase(BaseModel):
    name: str
    phone: str
    content: str

class MessageResponse(MessageBase):
    id: int
    reply: Optional[str] = None
    status: str = "unread"
    created_at: Optional[datetime] = None
    class Config: from_attributes = True