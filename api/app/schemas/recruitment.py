# =============================================
# TP全屋家居 · Pydantic Schemas - 招聘管理域
# 功能：职位/投递记录的请求与响应模型
# =============================================

from datetime import datetime, date
from typing import Optional, Any
from pydantic import BaseModel, field_validator


class JobBase(BaseModel):
    title: str
    category: str = "social"  # social / campus
    department: Optional[str] = None
    location: Optional[str] = None
    headcount: Optional[Any] = None
    responsibilities: Optional[str] = None
    requirements: Optional[str] = None
    salary_range: Optional[str] = None
    deadline: Optional[str] = None
    status: str = "published"  # published / closed

class JobResponse(JobBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    class Config: from_attributes = True

    @field_validator("headcount", mode="before")
    @classmethod
    def parse_headcount(cls, v: Any) -> Any:
        """统一处理 int/str 类型"""
        if isinstance(v, int):
            return str(v)
        return v

    @field_validator("deadline", mode="before")
    @classmethod
    def parse_deadline(cls, v: Any) -> Any:
        """将 date 类型转为字符串"""
        if isinstance(v, date):
            return v.isoformat()
        return v


class JobApplicationBase(BaseModel):
    applicant_name: str
    phone: str
    email: str
    cover_letter: Optional[str] = None

class JobApplicationResponse(JobApplicationBase):
    id: int
    job_id: int
    resume_url: Optional[str] = None
    status: str = "unread"
    created_at: Optional[datetime] = None
    class Config: from_attributes = True