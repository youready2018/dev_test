# =============================================
# TP全屋家居 · ORM 模型模块统一导出
# 功能：导入所有业务域的 ORM 模型类
#       确保 Base.metadata.create_all() 能发现全部 14 张表
# 说明：按业务域分文件组织，便于维护
#       所有模型从各子模块导入后统一在此暴露
# =============================================
# 业务域拆分：
#   system.py     → 系统与配置（3张表）
#   product.py    → 产品管理（3张表）
#   case.py       → 案例管理（3张表）
#   news.py       → 内容管理（1张表）
#   recruitment.py → 招聘管理（2张表）
#   customer.py   → 客户获客（2张表）
# =============================================

# --- 系统与配置域 ---
from .system import SysUser, SiteSetting, Banner

# --- 产品管理域 ---
from .product import Category, Product, ProductImage

# --- 案例管理域 ---
from .case import Case, CaseImage, CaseProduct

# --- 内容管理域 ---
from .news import News

# --- 招聘管理域 ---
from .recruitment import Job, JobApplication

# --- 客户获客域 ---
from .customer import Appointment, Message

# =============================================
# 可用模型汇总（14张表）：
# 1. SysUser        - 后台用户表
# 2. SiteSetting    - 网站设置表
# 3. Banner         - 轮播图表
# 4. Category       - 产品空间分类表
# 5. Product        - 产品表
# 6. ProductImage   - 产品图片表
# 7. Case           - 案例表
# 8. CaseImage      - 案例图片表
# 9. CaseProduct    - 案例-产品关联表（桥接表）
# 10. News          - 新闻/资讯表
# 11. Job           - 招聘职位表
# 12. JobApplication - 投递记录表
# 13. Appointment   - 预约量尺表
# 14. Message       - 留言咨询表
# =============================================