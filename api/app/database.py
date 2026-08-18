# =============================================
# TP全屋家居 · 数据库连接模块
# 功能：创建数据库引擎、会话工厂、依赖注入函数
# 说明：SQLite + SQLAlchemy 同步模式
#       每次数据库操作后需手动调用 db.close()
# =============================================

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import DATABASE_URL

# --- 创建数据库引擎 ---
# connect_args={"check_same_thread": False} 是 SQLite 的必需参数
# 因为 FastAPI 的多线程环境中，多个请求可能共享同一个连接
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # SQLite 多线程访问支持
    echo=False,  # 设为 True 可打印 SQL 日志（调试用）
)

# --- 创建会话工厂 ---
# SessionLocal 是一个工厂函数，每次调用创建一个新的数据库会话
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- 声明基类 ---
# 所有 ORM 模型类都继承自这个 Base
Base = declarative_base()


# --- 数据库会话依赖注入函数 ---
# 在 FastAPI 的路由函数中通过 Depends(get_db) 使用
# 功能：自动管理数据库会话的生命周期（创建 → 使用 → 关闭）
def get_db():
    """
    数据库会话依赖注入
    使用方式：
        @router.get("/items")
        def get_items(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        # 将数据库会话交给路由函数使用
        yield db
    finally:
        # 路由函数执行完毕后自动关闭会话，释放连接
        db.close()