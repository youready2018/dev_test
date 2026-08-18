# =============================================
# TP全屋家居 · API 服务配置文件
# 功能：集中管理所有配置项（数据库路径、JWT密钥、CORS域名等）
# 说明：生产环境部署时请修改 SECRET_KEY 和其他敏感配置
# =============================================

import os

# --- 项目基础路径 ---
# 获取当前文件所在目录的上级（即 api/ 目录）
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# --- 数据库配置 ---
# 数据库文件路径：api/data/tp_furniture.db
# SQLite 是文件型数据库，无需额外安装数据库服务
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'data', 'tp_furniture.db')}"

# --- JWT 认证配置 ---
# SECRET_KEY：用于签名 JWT Token，生产环境务必改为复杂随机字符串
SECRET_KEY = "tp-furniture-secret-key-change-in-production"
# Token 算法
ALGORITHM = "HS256"
# Token 过期时间（分钟）
ACCESS_TOKEN_EXPIRE_MINUTES = 480  # 8 小时

# --- CORS 跨域配置 ---
# 允许访问 API 的前端域名列表
# 开发阶段允许本地地址；生产环境需替换为实际域名
CORS_ORIGINS = [
    "http://localhost:3000",   # 前台 React 开发服务器
    "http://localhost:3001",   # 后台 React 开发服务器
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

# --- 文件上传配置 ---
# 上传文件存储根目录
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
# 允许上传的文件扩展名
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf", ".doc", ".docx"}
# 单文件最大大小（字节）：10MB
MAX_UPLOAD_SIZE = 10 * 1024 * 1024