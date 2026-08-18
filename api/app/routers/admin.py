# =============================================
# TP全屋家居 · 后台管理 API 路由（Phase 3B）
# 功能：全部后台管理 CRUD 接口，需 JWT 认证
# 路由前缀：/api/admin
# =============================================
#
# 【后台管理 API 清单】
# POST /api/admin/auth/login            ── 3.7 用户登录（无 JWT）
# GET  /api/admin/auth/me               ── 3.7 获取当前用户
# GET  /api/admin/dashboard             ── 3.7 仪表盘数据
# CRUD /api/admin/products              ── 3.8 产品管理
# CRUD /api/admin/categories            ── 3.9 分类管理
# CRUD /api/admin/cases                 ── 3.9 案例管理
# CRUD /api/admin/news                  ── 3.10 新闻管理
# GET+PATCH /api/admin/appointments     ── 3.11 预约管理
# GET+PATCH /api/admin/messages         ── 3.11 留言管理
# CRUD /api/admin/jobs                  ── 3.12 招聘管理
# GET /api/admin/applications           ── 3.12 投递记录查看
# CRUD /api/admin/users                 ── 3.13 用户管理
# CRUD /api/admin/settings              ── 3.13 网站设置
# CRUD /api/admin/banners               ── 3.13 轮播图管理
# POST /api/admin/upload                ── 3.14 文件上传

import bcrypt as _bcrypt
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import date

from app.database import get_db
from app.auth import create_access_token, get_current_user
from app.models.system import SysUser, SiteSetting, Banner
from app.models.product import Category, Product, ProductImage
from app.models.case import Case, CaseImage, CaseProduct
from app.models.news import News
from app.models.recruitment import Job, JobApplication
from app.models.customer import Appointment, Message

# 创建后台路由实例
router = APIRouter(tags=["后台管理 API"])


# =============================================
# Pydantic 请求模型
# =============================================

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


# =============================================
# 3.7 认证 API + 仪表盘
# =============================================

@router.post("/auth/login", summary="用户登录")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """验证用户名密码，返回 JWT Token"""
    user = db.query(SysUser).filter(SysUser.username == request.username).first()
    if user is None or not _bcrypt.checkpw(
        request.password.encode("utf-8"), user.password_hash.encode("utf-8")
    ):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="用户名或密码错误")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="该账号已被禁用")

    access_token = create_access_token(data={
        "sub": str(user.id), "username": user.username, "role": user.role,
    })
    return LoginResponse(
        access_token=access_token,
        user={"id": user.id, "username": user.username, "real_name": user.real_name,
              "role": user.role, "department": user.department, "avatar": user.avatar},
    )

@router.get("/auth/me", summary="获取当前用户信息")
def get_current_user_info(current_user: SysUser = Depends(get_current_user)):
    """返回当前登录用户的完整信息"""
    return {
        "id": current_user.id, "username": current_user.username,
        "real_name": current_user.real_name, "role": current_user.role,
        "department": current_user.department, "email": current_user.email,
        "phone": current_user.phone, "avatar": current_user.avatar, "is_active": current_user.is_active,
    }

@router.get("/dashboard", summary="获取仪表盘数据")
def get_dashboard(db: Session = Depends(get_db), _=Depends(get_current_user)):
    """返回后台仪表盘概览统计数据"""
    return {
        "product_count": db.query(Product).count(),
        "case_count": db.query(Case).count(),
        "news_count": db.query(News).count(),
        "appointment_count": db.query(Appointment).count(),
        "pending_appointments": db.query(Appointment).filter(Appointment.status == "pending").count(),
        "unread_messages": db.query(Message).filter(Message.status == "unread").count(),
        "active_jobs": db.query(Job).filter(Job.status == "published").count(),
        "total_applications": db.query(JobApplication).count(),
    }


# =============================================
# 3.8 产品管理 CRUD API
# =============================================

@router.get("/products", summary="产品列表")
def admin_get_products(page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100),
                       category_id: Optional[int] = Query(None), search: Optional[str] = Query(None),
                       db: Session = Depends(get_db), _=Depends(get_current_user)):
    """获取全部产品列表（含未发布）"""
    query = db.query(Product)
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if search:
        query = query.filter(Product.name.contains(search))
    total = query.count()
    items = query.order_by(Product.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return {"items": [{"id": p.id, "name": p.name, "category_id": p.category_id,
                       "series": p.series, "product_code": p.product_code,
                       "is_published": p.is_published, "sort_order": p.sort_order,
                       "cover_image": p.cover_image, "created_at": str(p.created_at or "")} for p in items],
            "total": total, "page": page, "page_size": page_size}

@router.post("/products", summary="新增产品", status_code=201)
def admin_create_product(data: dict, db: Session = Depends(get_db), _=Depends(get_current_user)):
    """新增产品（JSON body 中包含 name, category_id 等字段）"""
    product = Product(**{k: v for k, v in data.items() if hasattr(Product, k)})
    db.add(product)
    db.commit()
    db.refresh(product)
    return {"id": product.id, "message": "产品创建成功"}

@router.get("/products/{product_id}", summary="产品详情")
def admin_get_product(product_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    """获取产品编辑详情（含图片）"""
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="产品不存在")
    images = [{"id": img.id, "image_url": img.image_url, "is_cover": img.is_cover, "sort_order": img.sort_order}
              for img in p.images]
    return {"id": p.id, "name": p.name, "category_id": p.category_id, "series": p.series,
            "product_code": p.product_code, "description": p.description,
            "specifications": p.specifications, "cover_image": p.cover_image,
            "is_published": p.is_published, "sort_order": p.sort_order,
            "created_at": str(p.created_at or ""), "updated_at": str(p.updated_at or ""),
            "images": images}

@router.put("/products/{product_id}", summary="更新产品")
def admin_update_product(product_id: int, data: dict, db: Session = Depends(get_db),
                         _=Depends(get_current_user)):
    """更新产品信息"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="产品不存在")
    for k, v in data.items():
        if hasattr(product, k):
            setattr(product, k, v)
    db.commit()
    return {"message": "产品更新成功"}

@router.delete("/products/{product_id}", summary="删除产品")
def admin_delete_product(product_id: int, db: Session = Depends(get_db),
                         _=Depends(get_current_user)):
    """删除产品及其关联图片"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="产品不存在")
    db.delete(product)
    db.commit()
    return {"message": "产品删除成功"}


# =============================================
# 3.9 分类/案例管理 CRUD API
# =============================================

# ---------- 分类管理 ----------
@router.get("/categories", summary="分类列表")
def admin_get_categories(db: Session = Depends(get_db), _=Depends(get_current_user)):
    cats = db.query(Category).order_by(Category.sort_order).all()
    return [{"id": c.id, "name": c.name, "slug": c.slug, "description": c.description,
             "icon": c.icon, "sort_order": c.sort_order, "is_active": c.is_active} for c in cats]

@router.post("/categories", summary="新增分类", status_code=201)
def admin_create_category(data: dict, db: Session = Depends(get_db), _=Depends(get_current_user)):
    cat = Category(**{k: v for k, v in data.items() if hasattr(Category, k)})
    db.add(cat); db.commit(); db.refresh(cat)
    return {"id": cat.id, "message": "分类创建成功"}

@router.put("/categories/{category_id}", summary="更新分类")
def admin_update_category(category_id: int, data: dict, db: Session = Depends(get_db),
                          _=Depends(get_current_user)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat: raise HTTPException(status_code=404, detail="分类不存在")
    for k, v in data.items():
        if hasattr(cat, k): setattr(cat, k, v)
    db.commit()
    return {"message": "分类更新成功"}

@router.delete("/categories/{category_id}", summary="删除分类")
def admin_delete_category(category_id: int, db: Session = Depends(get_db),
                          _=Depends(get_current_user)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat: raise HTTPException(status_code=404, detail="分类不存在")
    db.delete(cat); db.commit()
    return {"message": "分类删除成功"}

# ---------- 案例管理 ----------
@router.get("/cases", summary="案例列表")
def admin_get_cases(page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100),
                    db: Session = Depends(get_db), _=Depends(get_current_user)):
    total = db.query(Case).count()
    items = db.query(Case).order_by(Case.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return {"items": [{"id": c.id, "title": c.title, "style": c.style, "area": c.area,
                       "cover_image": c.cover_image, "is_published": c.is_published,
                       "created_at": str(c.created_at or "")} for c in items],
            "total": total, "page": page, "page_size": page_size}

@router.post("/cases", summary="新增案例", status_code=201)
def admin_create_case(data: dict, db: Session = Depends(get_db), _=Depends(get_current_user)):
    case = Case(**{k: v for k, v in data.items() if hasattr(Case, k)})
    db.add(case); db.commit(); db.refresh(case)
    return {"id": case.id, "message": "案例创建成功"}

@router.get("/cases/{case_id}", summary="案例详情")
def admin_get_case(case_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case: raise HTTPException(status_code=404, detail="案例不存在")
    images = [{"id": img.id, "image_url": img.image_url, "is_cover": img.is_cover} for img in (case.images or [])]
    product_ids = [cp.product_id for cp in (case.case_products or [])]
    return {"id": case.id, "title": case.title, "style": case.style, "area": case.area,
            "description": case.description, "cover_image": case.cover_image,
            "is_published": case.is_published, "images": images, "product_ids": product_ids}

@router.put("/cases/{case_id}", summary="更新案例")
def admin_update_case(case_id: int, data: dict, db: Session = Depends(get_db),
                      _=Depends(get_current_user)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case: raise HTTPException(status_code=404, detail="案例不存在")
    for k, v in data.items():
        if hasattr(case, k): setattr(case, k, v)
    db.commit()
    return {"message": "案例更新成功"}

@router.delete("/cases/{case_id}", summary="删除案例")
def admin_delete_case(case_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case: raise HTTPException(status_code=404, detail="案例不存在")
    db.delete(case); db.commit()
    return {"message": "案例删除成功"}


# =============================================
# 3.10 新闻管理 CRUD API
# =============================================

@router.get("/news", summary="新闻列表")
def admin_get_news(page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100),
                   category: Optional[str] = Query(None),
                   db: Session = Depends(get_db), _=Depends(get_current_user)):
    query = db.query(News)
    if category: query = query.filter(News.category == category)
    total = query.count()
    items = query.order_by(News.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return {"items": [{"id": n.id, "title": n.title, "category": n.category,
                       "cover_image": n.cover_image, "summary": n.summary,
                       "is_published": n.is_published, "is_featured": n.is_featured,
                       "published_at": str(n.published_at or ""),
                       "created_at": str(n.created_at or "")} for n in items],
            "total": total, "page": page, "page_size": page_size}

@router.post("/news", summary="新增新闻", status_code=201)
def admin_create_news(data: dict, db: Session = Depends(get_db), _=Depends(get_current_user)):
    news = News(**{k: v for k, v in data.items() if hasattr(News, k)})
    db.add(news); db.commit(); db.refresh(news)
    return {"id": news.id, "message": "新闻创建成功"}

@router.get("/news/{news_id}", summary="新闻详情")
def admin_get_news_detail(news_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    news = db.query(News).filter(News.id == news_id).first()
    if not news: raise HTTPException(status_code=404, detail="新闻不存在")
    return {"id": news.id, "title": news.title, "category": news.category,
            "cover_image": news.cover_image, "summary": news.summary,
            "content": news.content, "source": news.source,
            "is_published": news.is_published, "is_featured": news.is_featured,
            "published_at": str(news.published_at or ""), "created_at": str(news.created_at or ""),
            "updated_at": str(news.updated_at or "")}

@router.put("/news/{news_id}", summary="更新新闻")
def admin_update_news(news_id: int, data: dict, db: Session = Depends(get_db),
                      _=Depends(get_current_user)):
    news = db.query(News).filter(News.id == news_id).first()
    if not news: raise HTTPException(status_code=404, detail="新闻不存在")
    for k, v in data.items():
        if hasattr(news, k): setattr(news, k, v)
    db.commit()
    return {"message": "新闻更新成功"}

@router.delete("/news/{news_id}", summary="删除新闻")
def admin_delete_news(news_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    news = db.query(News).filter(News.id == news_id).first()
    if not news: raise HTTPException(status_code=404, detail="新闻不存在")
    db.delete(news); db.commit()
    return {"message": "新闻删除成功"}


# =============================================
# 3.11 预约/留言管理 API
# =============================================

@router.get("/appointments", summary="预约列表")
def admin_get_appointments(page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100),
                           status_filter: Optional[str] = Query(None, alias="status"),
                           db: Session = Depends(get_db), _=Depends(get_current_user)):
    query = db.query(Appointment)
    if status_filter: query = query.filter(Appointment.status == status_filter)
    total = query.count()
    items = query.order_by(Appointment.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return {"items": [{"id": a.id, "name": a.name, "phone": a.phone, "city": a.city,
                       "address": a.address, "appointment_date": str(a.appointment_date or ""),
                       "time_slot": a.time_slot, "status": a.status,
                       "created_at": str(a.created_at or "")} for a in items],
            "total": total, "page": page, "page_size": page_size}

@router.get("/appointments/{appointment_id}", summary="预约详情")
def admin_get_appointment(appointment_id: int, db: Session = Depends(get_db),
                          _=Depends(get_current_user)):
    a = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not a: raise HTTPException(status_code=404, detail="预约不存在")
    return {"id": a.id, "name": a.name, "phone": a.phone, "city": a.city, "address": a.address,
            "appointment_date": str(a.appointment_date or ""), "time_slot": a.time_slot,
            "remark": a.remark, "status": a.status, "internal_note": a.internal_note,
            "created_at": str(a.created_at or "")}

@router.patch("/appointments/{appointment_id}", summary="更新预约状态")
def admin_update_appointment(appointment_id: int, data: dict, db: Session = Depends(get_db),
                             _=Depends(get_current_user)):
    a = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not a: raise HTTPException(status_code=404, detail="预约不存在")
    for k, v in data.items():
        if hasattr(a, k): setattr(a, k, v)
    db.commit()
    return {"message": "预约更新成功"}

@router.get("/messages", summary="留言列表")
def admin_get_messages(page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100),
                       status_filter: Optional[str] = Query(None, alias="status"),
                       db: Session = Depends(get_db), _=Depends(get_current_user)):
    query = db.query(Message)
    if status_filter: query = query.filter(Message.status == status_filter)
    total = query.count()
    items = query.order_by(Message.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return {"items": [{"id": m.id, "name": m.name, "phone": m.phone,
                       "content": m.content[:100], "status": m.status,
                       "created_at": str(m.created_at or "")} for m in items],
            "total": total, "page": page, "page_size": page_size}

@router.get("/messages/{message_id}", summary="留言详情")
def admin_get_message(message_id: int, db: Session = Depends(get_db),
                      _=Depends(get_current_user)):
    m = db.query(Message).filter(Message.id == message_id).first()
    if not m: raise HTTPException(status_code=404, detail="留言不存在")
    return {"id": m.id, "name": m.name, "phone": m.phone, "content": m.content,
            "reply": m.reply, "status": m.status, "created_at": str(m.created_at or "")}

@router.patch("/messages/{message_id}", summary="回复留言")
def admin_reply_message(message_id: int, data: dict, db: Session = Depends(get_db),
                        _=Depends(get_current_user)):
    m = db.query(Message).filter(Message.id == message_id).first()
    if not m: raise HTTPException(status_code=404, detail="留言不存在")
    if "reply" in data:
        m.reply = data["reply"]
        m.status = "replied"
    if "status" in data:
        m.status = data["status"]
    db.commit()
    return {"message": "留言更新成功"}


# =============================================
# 3.12 招聘管理 CRUD + 投递记录 API
# =============================================

@router.get("/jobs", summary="职位列表")
def admin_get_jobs(page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100),
                   category: Optional[str] = Query(None),
                   status_filter: Optional[str] = Query(None, alias="status"),
                   db: Session = Depends(get_db), _=Depends(get_current_user)):
    query = db.query(Job)
    if category: query = query.filter(Job.category == category)
    if status_filter: query = query.filter(Job.status == status_filter)
    total = query.count()
    items = query.order_by(Job.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return {"items": [{"id": j.id, "title": j.title, "category": j.category,
                       "department": j.department, "location": j.location,
                       "headcount": j.headcount, "status": j.status,
                       "deadline": j.deadline, "created_at": str(j.created_at or "")} for j in items],
            "total": total, "page": page, "page_size": page_size}

@router.post("/jobs", summary="新增职位", status_code=201)
def admin_create_job(data: dict, db: Session = Depends(get_db), _=Depends(get_current_user)):
    job = Job(**{k: v for k, v in data.items() if hasattr(Job, k)})
    db.add(job); db.commit(); db.refresh(job)
    return {"id": job.id, "message": "职位创建成功"}

@router.get("/jobs/{job_id}", summary="职位详情")
def admin_get_job(job_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job: raise HTTPException(status_code=404, detail="职位不存在")
    return {"id": job.id, "title": job.title, "category": job.category,
            "department": job.department, "location": job.location,
            "headcount": job.headcount, "responsibilities": job.responsibilities,
            "requirements": job.requirements, "salary_range": job.salary_range,
            "deadline": job.deadline, "status": job.status,
            "created_at": str(job.created_at or ""), "updated_at": str(job.updated_at or "")}

@router.put("/jobs/{job_id}", summary="更新职位")
def admin_update_job(job_id: int, data: dict, db: Session = Depends(get_db),
                     _=Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job: raise HTTPException(status_code=404, detail="职位不存在")
    for k, v in data.items():
        if hasattr(job, k): setattr(job, k, v)
    db.commit()
    return {"message": "职位更新成功"}

@router.delete("/jobs/{job_id}", summary="删除职位")
def admin_delete_job(job_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job: raise HTTPException(status_code=404, detail="职位不存在")
    db.delete(job); db.commit()
    return {"message": "职位删除成功"}

@router.get("/applications", summary="投递记录列表")
def admin_get_applications(job_id: Optional[int] = Query(None),
                           page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100),
                           db: Session = Depends(get_db), _=Depends(get_current_user)):
    query = db.query(JobApplication)
    if job_id: query = query.filter(JobApplication.job_id == job_id)
    total = query.count()
    items = query.order_by(JobApplication.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return {"items": [{"id": a.id, "job_id": a.job_id, "applicant_name": a.applicant_name,
                       "phone": a.phone, "email": a.email, "resume_url": a.resume_url,
                       "status": a.status, "created_at": str(a.created_at or "")} for a in items],
            "total": total, "page": page, "page_size": page_size}

@router.patch("/applications/{application_id}", summary="更新投递状态")
def admin_update_application(application_id: int, data: dict, db: Session = Depends(get_db),
                             _=Depends(get_current_user)):
    a = db.query(JobApplication).filter(JobApplication.id == application_id).first()
    if not a: raise HTTPException(status_code=404, detail="投递记录不存在")
    if "status" in data: a.status = data["status"]
    db.commit()
    return {"message": "投递状态更新成功"}


# =============================================
# 3.13 用户管理 CRUD + 网站设置 + 轮播图 API
# =============================================

@router.get("/users", summary="用户列表")
def admin_get_users(db: Session = Depends(get_db), _=Depends(get_current_user)):
    users = db.query(SysUser).all()
    return [{"id": u.id, "username": u.username, "real_name": u.real_name,
             "role": u.role, "department": u.department, "email": u.email,
             "phone": u.phone, "is_active": u.is_active} for u in users]

@router.post("/users", summary="新增用户", status_code=201)
def admin_create_user(data: dict, db: Session = Depends(get_db), _=Depends(get_current_user)):
    if "password" not in data:
        raise HTTPException(status_code=400, detail="密码不能为空")
    password = data.pop("password")
    user = SysUser(**{k: v for k, v in data.items() if hasattr(SysUser, k)})
    user.password_hash = _bcrypt.hashpw(password.encode("utf-8"), _bcrypt.gensalt()).decode("utf-8")
    db.add(user); db.commit(); db.refresh(user)
    return {"id": user.id, "message": "用户创建成功"}

@router.put("/users/{user_id}", summary="更新用户")
def admin_update_user(user_id: int, data: dict, db: Session = Depends(get_db),
                      _=Depends(get_current_user)):
    user = db.query(SysUser).filter(SysUser.id == user_id).first()
    if not user: raise HTTPException(status_code=404, detail="用户不存在")
    if "password" in data and data["password"]:
        user.password_hash = _bcrypt.hashpw(data["password"].encode("utf-8"), _bcrypt.gensalt()).decode("utf-8")
        del data["password"]
    for k, v in data.items():
        if hasattr(user, k): setattr(user, k, v)
    db.commit()
    return {"message": "用户更新成功"}

@router.put("/users/{user_id}/status", summary="启用/禁用用户")
def admin_toggle_user_status(user_id: int, data: dict, db: Session = Depends(get_db),
                             _=Depends(get_current_user)):
    user = db.query(SysUser).filter(SysUser.id == user_id).first()
    if not user: raise HTTPException(status_code=404, detail="用户不存在")
    user.is_active = data.get("is_active", user.is_active)
    db.commit()
    return {"message": "用户状态更新成功", "is_active": user.is_active}

# ---------- 网站设置 ----------
@router.get("/settings", summary="获取全部设置")
def admin_get_settings(db: Session = Depends(get_db), _=Depends(get_current_user)):
    settings = db.query(SiteSetting).all()
    return {s.key: s.value for s in settings}

@router.put("/settings", summary="批量更新设置")
def admin_update_settings(data: dict, db: Session = Depends(get_db), _=Depends(get_current_user)):
    for key, value in data.items():
        setting = db.query(SiteSetting).filter(SiteSetting.key == key).first()
        if setting:
            setting.value = str(value)
        else:
            db.add(SiteSetting(key=key, value=str(value)))
    db.commit()
    return {"message": "设置更新成功"}

# ---------- 轮播图管理 ----------
@router.get("/banners", summary="轮播图列表")
def admin_get_banners(db: Session = Depends(get_db), _=Depends(get_current_user)):
    banners = db.query(Banner).order_by(Banner.sort_order).all()
    return [{"id": b.id, "title": b.title, "subtitle": b.subtitle,
             "description": b.description, "tag_text": b.tag_text,
             "image_url": b.image_url, "link_url": b.link_url,
             "btn_primary_text": b.btn_primary_text, "btn_primary_link": b.btn_primary_link,
             "btn_outline_text": b.btn_outline_text, "btn_outline_link": b.btn_outline_link,
             "sort_order": b.sort_order, "is_active": b.is_active} for b in banners]

@router.post("/banners", summary="新增轮播图", status_code=201)
def admin_create_banner(data: dict, db: Session = Depends(get_db), _=Depends(get_current_user)):
    banner = Banner(**{k: v for k, v in data.items() if hasattr(Banner, k)})
    db.add(banner); db.commit(); db.refresh(banner)
    return {"id": banner.id, "message": "轮播图创建成功"}

@router.put("/banners/{banner_id}", summary="更新轮播图")
def admin_update_banner(banner_id: int, data: dict, db: Session = Depends(get_db),
                        _=Depends(get_current_user)):
    banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not banner: raise HTTPException(status_code=404, detail="轮播图不存在")
    for k, v in data.items():
        if hasattr(banner, k): setattr(banner, k, v)
    db.commit()
    return {"message": "轮播图更新成功"}

@router.delete("/banners/{banner_id}", summary="删除轮播图")
def admin_delete_banner(banner_id: int, db: Session = Depends(get_db),
                        _=Depends(get_current_user)):
    banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not banner: raise HTTPException(status_code=404, detail="轮播图不存在")
    db.delete(banner); db.commit()
    return {"message": "轮播图删除成功"}


# =============================================
# 3.14 文件上传 API
# =============================================

@router.post("/upload", summary="上传文件")
async def admin_upload_file(file: UploadFile = File(...), sub_dir: str = "images",
                            db: Session = Depends(get_db), _=Depends(get_current_user)):
    """上传文件到 /uploads 目录，返回可访问的 URL 路径"""
    import os, uuid
    upload_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                              "..", "uploads", sub_dir)
    os.makedirs(upload_dir, exist_ok=True)
    ext = os.path.splitext(file.filename or ".bin")[1]
    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(upload_dir, filename)
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    url = f"/uploads/{sub_dir}/{filename}"
    return {"url": url, "filename": filename, "message": "文件上传成功"}


# =============================================
# 健康检查（无需 JWT）
# =============================================

@router.get("/health", summary="健康检查")
def admin_health_check():
    return {"status": "ok", "message": "后台管理 API 运行正常"}