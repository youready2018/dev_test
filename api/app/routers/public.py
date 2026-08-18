# =============================================
# TP全屋家居 · 前台公开 API 路由（Phase 3A）
# 功能：供前台官网调用的公开接口，无需 JWT 认证
# 路由前缀：/api
# =============================================
#
# 【前台公开 API 清单】
# GET  /api/categories                  ── 3.1 获取所有空间分类
# GET  /api/products                    ── 3.1 获取产品列表（支持分页、筛选、搜索）
# GET  /api/products/{id}               ── 3.1 获取产品详情（含图片）
# GET  /api/cases                       ── 3.2 获取案例列表
# GET  /api/cases/{id}                  ── 3.2 获取案例详情（含图片、关联产品）
# GET  /api/news                        ── 3.3 获取新闻列表（支持分类筛选）
# GET  /api/news/{id}                   ── 3.3 获取新闻详情
# GET  /api/jobs                        ── 3.4 获取招聘职位列表（支持分类筛选）
# GET  /api/jobs/{id}                   ── 3.4 获取职位详情
# POST /api/appointments                ── 3.5 提交预约量尺申请
# POST /api/messages                    ── 3.5 提交留言咨询
# POST /api/jobs/{id}/applications      ── 3.5 提交职位投递
# GET  /api/banners                     ── 3.6 获取轮播图列表
# GET  /api/settings                    ── 3.6 获取网站公开设置

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from app.database import get_db
from app.models.system import Banner, SiteSetting
from app.models.product import Category, Product, ProductImage
from app.models.case import Case, CaseImage, CaseProduct
from app.models.news import News
from app.models.recruitment import Job, JobApplication
from app.models.customer import Appointment, Message
from app.schemas import (
    CategoryResponse, ProductResponse, ProductDetailResponse,
    CaseResponse, CaseDetailResponse,
    NewsResponse, JobResponse, JobApplicationResponse,
    AppointmentBase, AppointmentResponse,
    MessageBase, MessageResponse,
    BannerResponse, SiteSettingResponse,
)

# 创建公开路由实例
router = APIRouter(tags=["前台公开 API"])


# =============================================
# 3.0 健康检查
# =============================================
@router.get("/health")
def health_check():
    return {"status": "ok", "message": "前台公开 API 运行正常"}


# =============================================
# 3.1 分类 / 产品列表+详情 API
# =============================================

@router.get("/categories", summary="获取所有空间分类")
def get_categories(db: Session = Depends(get_db)):
    """返回所有启用的空间分类列表"""
    cats = db.query(Category).filter(Category.is_active == True).order_by(Category.sort_order).all()
    return [CategoryResponse.model_validate(c) for c in cats]


@router.get("/products", summary="获取产品列表")
def get_products(
    category_id: Optional[int] = Query(None, description="按分类筛选"),
    search: Optional[str] = Query(None, description="搜索产品名称"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(12, ge=1, le=100, description="每页条数"),
    db: Session = Depends(get_db),
):
    """获取已发布的产品列表，支持分类筛选、名称搜索、分页"""
    query = db.query(Product).filter(Product.is_published == True)
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if search:
        query = query.filter(Product.name.contains(search))
    
    total = query.count()
    products = query.order_by(Product.sort_order).offset((page - 1) * page_size).limit(page_size).all()
    
    return {
        "items": [ProductResponse.model_validate(p) for p in products],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/products/{product_id}", summary="获取产品详情")
def get_product_detail(product_id: int, db: Session = Depends(get_db)):
    """获取产品详细信息，包含分类和所有图片"""
    product = db.query(Product).filter(Product.id == product_id, Product.is_published == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="产品不存在")
    return ProductDetailResponse.model_validate(product)


# =============================================
# 3.2 案例列表+详情 API
# =============================================

@router.get("/cases", summary="获取案例列表")
def get_cases(
    style: Optional[str] = Query(None, description="按风格筛选"),
    page: int = Query(1, ge=1),
    page_size: int = Query(9, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """获取已发布的案例列表，支持风格筛选和分页"""
    query = db.query(Case).filter(Case.is_published == True)
    if style:
        query = query.filter(Case.style == style)
    
    total = query.count()
    cases = query.order_by(Case.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
    
    return {
        "items": [CaseResponse.model_validate(c) for c in cases],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/cases/{case_id}", summary="获取案例详情")
def get_case_detail(case_id: int, db: Session = Depends(get_db)):
    """获取案例详情，包含图片和关联产品ID"""
    case = db.query(Case).filter(Case.id == case_id, Case.is_published == True).first()
    if not case:
        raise HTTPException(status_code=404, detail="案例不存在")
    return CaseDetailResponse.model_validate(case)


# =============================================
# 3.3 新闻列表+详情 API
# =============================================

@router.get("/news", summary="获取新闻列表")
def get_news(
    category: Optional[str] = Query(None, description="enterprise/industry"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """获取已发布的新闻列表，支持分类筛选"""
    query = db.query(News).filter(News.is_published == True)
    if category:
        query = query.filter(News.category == category)
    
    total = query.count()
    news_list = query.order_by(News.published_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    
    return {
        "items": [NewsResponse.model_validate(n) for n in news_list],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/news/{news_id}", summary="获取新闻详情")
def get_news_detail(news_id: int, db: Session = Depends(get_db)):
    """获取新闻文章详情"""
    news = db.query(News).filter(News.id == news_id, News.is_published == True).first()
    if not news:
        raise HTTPException(status_code=404, detail="新闻不存在")
    return NewsResponse.model_validate(news)


# =============================================
# 3.4 职位列表+详情 API
# =============================================

@router.get("/jobs", summary="获取招聘职位列表")
def get_jobs(
    category: Optional[str] = Query(None, description="social/campus"),
    department: Optional[str] = Query(None, description="按部门筛选"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """获取已发布的招聘职位列表，支持分类和部门筛选"""
    query = db.query(Job).filter(Job.status == "published")
    if category:
        query = query.filter(Job.category == category)
    if department:
        query = query.filter(Job.department == department)
    
    total = query.count()
    jobs = query.order_by(Job.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
    
    return {
        "items": [JobResponse.model_validate(j) for j in jobs],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/jobs/{job_id}", summary="获取职位详情")
def get_job_detail(job_id: int, db: Session = Depends(get_db)):
    """获取招聘职位详细信息"""
    job = db.query(Job).filter(Job.id == job_id, Job.status == "published").first()
    if not job:
        raise HTTPException(status_code=404, detail="职位不存在或已关闭")
    return JobResponse.model_validate(job)


# =============================================
# 3.5 提交预约/留言/投递 API（含文件上传）
# =============================================

@router.post("/appointments", summary="提交预约量尺申请", status_code=201)
def create_appointment(data: AppointmentBase, db: Session = Depends(get_db)):
    """客户提交免费量尺预约申请"""
    appointment = Appointment(**data.model_dump())
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return AppointmentResponse.model_validate(appointment)


@router.post("/messages", summary="提交留言咨询", status_code=201)
def create_message(data: MessageBase, db: Session = Depends(get_db)):
    """访客提交在线留言咨询"""
    message = Message(**data.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    return MessageResponse.model_validate(message)


@router.post("/jobs/{job_id}/applications", summary="投递职位简历", status_code=201)
async def create_application(
    job_id: int,
    applicant_name: str = Form(...),
    phone: str = Form(...),
    email: str = Form(...),
    cover_letter: Optional[str] = Form(None),
    resume: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    """求职者投递简历到指定职位，支持 PDF/Word 文件上传"""
    # 检查职位是否存在且开放
    job = db.query(Job).filter(Job.id == job_id, Job.status == "published").first()
    if not job:
        raise HTTPException(status_code=404, detail="职位不存在或已关闭")
    
    # 处理简历文件上传
    resume_url = None
    if resume and resume.filename:
        import os, uuid
        upload_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "..", "uploads", "resumes")
        os.makedirs(upload_dir, exist_ok=True)
        ext = os.path.splitext(resume.filename)[1]
        filename = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(upload_dir, filename)
        content = await resume.read()
        with open(file_path, "wb") as f:
            f.write(content)
        resume_url = f"/uploads/resumes/{filename}"
    
    # 创建投递记录
    application = JobApplication(
        job_id=job_id,
        applicant_name=applicant_name,
        phone=phone,
        email=email,
        cover_letter=cover_letter,
        resume_url=resume_url,
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return JobApplicationResponse.model_validate(application)


# =============================================
# 3.6 轮播图/网站设置 API
# =============================================

@router.get("/banners", summary="获取轮播图列表")
def get_banners(db: Session = Depends(get_db)):
    """获取启用的轮播图列表，按排序字段排列"""
    banners = db.query(Banner).filter(Banner.is_active == True).order_by(Banner.sort_order).all()
    return [BannerResponse.model_validate(b) for b in banners]


@router.get("/settings", summary="获取网站公开设置")
def get_settings(db: Session = Depends(get_db)):
    """获取前台需要的网站公开配置信息"""
    settings = db.query(SiteSetting).all()
    result = {}
    for s in settings:
        result[s.key] = s.value
    return result