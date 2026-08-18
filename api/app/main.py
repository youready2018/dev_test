# =============================================
# TP全屋家居 · API 服务入口文件
# 功能：FastAPI 应用初始化、注册 CORS 中间件、挂载路由
# 启动命令：uvicorn app.main:app --reload --port 8000
# =============================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import CORS_ORIGINS, UPLOAD_DIR
from .database import engine, Base

# 导入所有 ORM 模型，确保 Base.metadata 注册全部 14 张表
# 如果不导入，create_all() 将无法创建这些表
from .models import (  # noqa: F401
    SysUser, SiteSetting, Banner,
    Category, Product, ProductImage,
    Case, CaseImage, CaseProduct,
    News,
    Job, JobApplication,
    Appointment, Message,
)

from .routers import public_router, admin_router

# --- 创建 FastAPI 应用实例 ---
app = FastAPI(
    title="TP全屋家居 · API 服务",
    description="提供前台官网数据接口和后台管理系统API",
    version="1.0.0",
    docs_url="/docs",          # Swagger UI 文档地址
    redoc_url="/redoc",        # ReDoc 文档地址
)

# =============================================
# 注册 CORS 中间件
# 作用：允许前端跨域请求（frontend:3000 和 backend:3001）
# =============================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,          # 允许的来源域名列表
    allow_credentials=True,              # 允许携带 Cookie
    allow_methods=["*"],                 # 允许所有 HTTP 方法
    allow_headers=["*"],                 # 允许所有请求头
)

# =============================================
# 挂载静态文件服务
# 作用：使上传的图片/文件可通过 URL 直接访问
# 示例：访问 /uploads/images/xxx.jpg 即可获取上传的图片
# =============================================
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# =============================================
# 应用启动事件
# 作用：在服务启动时自动创建所有数据库表
# =============================================
@app.on_event("startup")
def on_startup():
    """
    应用启动时执行：
    1. 创建数据目录（如果不存在）
    2. 创建所有数据库表（基于 ORM 模型）
    3. 输出启动确认信息
    """
    import os
    from .config import BASE_DIR

    # 确保 data/ 和 uploads/ 目录存在
    os.makedirs(os.path.join(BASE_DIR, "data"), exist_ok=True)
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # 创建所有数据库表
    # Base.metadata.create_all 会检查数据库中是否已存在表
    # 已存在的表不会重复创建
    Base.metadata.create_all(bind=engine)

    print("✅ TP全屋家居 API 服务启动完成")
    print(f"  📂 数据库路径: {os.path.join(BASE_DIR, 'data', 'tp_furniture.db')}")
    print(f"  📂 上传目录: {UPLOAD_DIR}")
    print(f"  📖 API 文档: http://localhost:8000/docs")


# =============================================
# 注册路由
# 说明：将 public.py 和 admin.py 中的路由挂载到 app 上
#       前台公开 API 路径前缀 /api
#       后台管理 API 路径前缀 /api/admin
# =============================================
app.include_router(public_router, prefix="/api")
app.include_router(admin_router, prefix="/api/admin")


# =============================================
# 根路径健康检查
# 访问 http://localhost:8000/ 可验证服务是否正常运行
# =============================================
@app.get("/")
def root():
    """根路径健康检查接口"""
    return {
        "message": "TP全屋家居 API 服务运行中",
        "version": "1.0.0",
        "docs": "/docs",
    }