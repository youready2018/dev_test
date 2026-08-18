# =============================================
# TP全屋家居 · JWT 认证依赖注入模块
# 功能：为后台管理 API 提供 JWT 认证的依赖注入
#       路由函数通过 Depends(get_current_user) 来保护
# 说明：前端在请求头中携带 Authorization: Bearer <token>
#       此模块负责解析和验证 Token，并返回当前用户信息
# =============================================

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.jwt import verify_token
from app.models.system import SysUser

# =============================================
# 创建 HTTP Bearer 认证方案
# 说明：FastAPI 自动从请求头中提取 Authorization: Bearer xxx
#       Swagger UI 会自动添加"Authorize"按钮方便测试
# =============================================
security_scheme = HTTPBearer(auto_error=False)


# =============================================
# 函数：get_current_user — 获取当前登录用户
# 功能：从请求头中提取并验证 JWT Token
#       如果 Token 有效则返回对应的用户对象
#       如果 Token 无效则抛出 401 未授权异常
# 参数：
#   credentials (HTTPAuthorizationCredentials): 由 FastAPI 自动注入的认证凭证
#   db (Session): 数据库会话，由 FastAPI 自动注入
# 返回：
#   SysUser: 当前登录的用户对象
# 异常：
#   HTTPException 401: Token 缺失、无效或用户不存在/被禁用
# =============================================
def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> SysUser:
    """
    获取当前登录用户（JWT 认证依赖注入）

    使用方式（在后台管理路由中）：
        @router.get("/some-protected-route")
        def protected_route(current_user: SysUser = Depends(get_current_user)):
            ...
    """
    # 检查是否提供了 Authorization 请求头
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="未提供认证令牌，请先登录",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 验证 Token 的有效性
    token = credentials.credentials
    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="认证令牌无效或已过期，请重新登录",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 从 Token 载荷中获取用户 ID
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="认证令牌中缺少用户信息",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 从数据库中查询用户
    user = db.query(SysUser).filter(SysUser.id == int(user_id)).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户不存在",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 检查用户是否被禁用
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="该账号已被禁用，无法访问后台",
        )

    return user