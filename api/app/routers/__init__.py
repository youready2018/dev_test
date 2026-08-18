# =============================================
# TP全屋家居 · API 路由模块包初始化
# 功能：导出 public 和 admin 两个路由模块的 router 实例
#       public  → 前台公开 API（无需 JWT 认证）
#       admin   → 后台管理 API（需要 JWT 认证）
# =============================================

from .public import router as public_router
from .admin import router as admin_router