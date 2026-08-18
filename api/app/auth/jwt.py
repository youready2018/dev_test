# =============================================
# TP全屋家居 · JWT Token 工具模块
# 功能：创建和验证 JWT 访问令牌
# 说明：使用 HS256 算法签名
#       Token 过期时间默认为 8 小时
# =============================================

from datetime import datetime, timedelta, timezone
import jwt
from app.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES


# =============================================
# 函数：create_access_token — 创建 JWT 访问令牌
# 功能：根据用户数据生成一个包含过期时间的 JWT Token
# 参数：
#   data (dict): 要编码到 Token 中的数据（至少包含 sub 字段）
#   expires_delta (timedelta, 可选): 自定义过期时间，默认为配置值
# 返回：
#   str: 编码后的 JWT Token 字符串
# =============================================
def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    创建 JWT 访问令牌

    使用示例：
        token = create_access_token({"sub": user.id, "username": user.username, "role": user.role})
    """
    # 深拷贝数据，避免修改原始传入的字典
    to_encode = data.copy()

    # 计算过期时间：如果传入了 expires_delta 则使用它，否则使用配置中的默认值
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    # 将过期时间添加到载荷中
    to_encode.update({"exp": expire})

    # 使用 PyJWT 编码生成 Token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


# =============================================
# 函数：verify_token — 验证并解码 JWT Token
# 功能：验证 Token 的有效性（签名和过期时间），返回解码后的数据
# 参数：
#   token (str): 要验证的 JWT Token 字符串
# 返回：
#   dict | None: 解码成功返回 payload 字典，验证失败返回 None
# =============================================
def verify_token(token: str) -> dict | None:
    """
    验证 JWT Token 的有效性

    验证内容：
    1. Token 签名是否正确（使用 SECRET_KEY）
    2. Token 是否已过期（exp 字段）
    3. Token 格式是否正确

    返回：
    - 验证成功：payload 字典（包含 sub, username, role 等字段）
    - 验证失败：None（Token 无效、过期或格式错误）
    """
    try:
        # 解码 Token，如果签名无效或已过期会抛出异常
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        # Token 已过期
        return None
    except jwt.InvalidTokenError:
        # Token 格式错误或签名无效
        return None