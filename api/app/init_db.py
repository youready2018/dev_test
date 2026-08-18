# =============================================
# TP全屋家居 · 数据库初始化脚本
# 功能：创建数据库表结构并写入预置种子数据
#       包括默认管理员、空间分类、网站设置、轮播图占位
# 执行方式：python -m app.init_db
# 安全说明：首次部署时运行，已有数据时不会重复插入
#           （使用 INSERT OR IGNORE 避免重复）
# =============================================
# 数据库设计文档参考：TP全屋家居网站数据库设计文档-v1.2
# 第 6 节 - 种子数据（4类预置数据）
# =============================================

import os
import sys

# 将项目根目录（api/）加入 Python 搜索路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.database import engine, SessionLocal, Base
from app.config import BASE_DIR

# =============================================
# 导入所有 ORM 模型（必须在 create_tables() 之前）
# 确保 Base.metadata 注册全部 14 张表，否则建表会遗漏
# =============================================
from app.models import (  # noqa: F401
    SysUser, SiteSetting, Banner,
    Category, Product, ProductImage,
    Case, CaseImage, CaseProduct,
    News,
    Job, JobApplication,
    Appointment, Message,
)

# =============================================
# 第一步：创建所有数据库表
# 说明：Base.metadata.create_all 会检查表是否存在
#       已存在的表不会重复创建，幂等安全
# =============================================
def create_tables():
    """创建所有数据库表（幂等操作，已存在的表不会重复创建）"""
    print("🔄 正在创建数据库表...")
    # 确保 data/ 目录存在
    os.makedirs(os.path.join(BASE_DIR, "data"), exist_ok=True)
    # 创建所有表
    Base.metadata.create_all(bind=engine)
    print("✅ 数据库表创建完成")


# =============================================
# 第二步：写入种子数据
# 说明：使用 IGNORE 策略避免重复插入
#       首次部署时写入，后续再次运行不会覆盖已有数据
# =============================================
def seed_data():
    """写入预置种子数据（幂等操作，已有数据不会重复插入）"""
    db = SessionLocal()

    try:
        # 启用 SQLite 外键约束（默认关闭，需手动开启）
        db.execute(text("PRAGMA foreign_keys = ON"))

        # =============================================
        # 种子数据 1：默认超级管理员
        # 说明：系统预设管理员账号，部署时必须修改密码
        # 用户名：admin / 密码：admin123
        # 角色：super_admin（超级管理员）
        # =============================================
        import bcrypt as _bcrypt

        # 检查是否已存在 admin 用户
        existing_admin = db.query(SysUser).filter(SysUser.username == "admin").first()
        if not existing_admin:
            # 生成 bcrypt 密码哈希（admin123）
            password_hash = _bcrypt.hashpw("admin123".encode("utf-8"), _bcrypt.gensalt()).decode("utf-8")
            admin_user = SysUser(
                username="admin",
                password_hash=password_hash,
                real_name="系统管理员",
                department="IT部",
                role="super_admin",
                is_active=1,
            )
            db.add(admin_user)
            print("  ✅ 已创建默认超级管理员：admin / admin123")
            print("     ⚠️  生产环境上线前请务必修改密码！")
        else:
            print("  ⏭️  超级管理员已存在，跳过")

        # =============================================
        # 种子数据 2：预置空间分类（6个）
        # 说明：覆盖全屋家居的所有主要空间
        #       前台导航按 sort_order 升序排列
        # =============================================

        categories_data = [
            {"name": "客厅家具", "slug": "living-room", "description": "客厅空间家具，包括沙发、茶几、电视柜等", "sort_order": 1},
            {"name": "卧室家具", "slug": "bedroom", "description": "卧室空间家具，包括床、衣柜、床头柜等", "sort_order": 2},
            {"name": "书房家具", "slug": "study", "description": "书房空间家具，包括书桌、书柜、办公椅等", "sort_order": 3},
            {"name": "餐厅家具", "slug": "dining-room", "description": "餐厅空间家具，包括餐桌、餐椅、餐边柜等", "sort_order": 4},
            {"name": "茶室家具", "slug": "tea-room", "description": "茶室空间家具，包括茶桌、茶椅、茶柜等", "sort_order": 5},
            {"name": "全屋定制", "slug": "custom", "description": "全屋定制家具解决方案", "sort_order": 6},
        ]

        for cat_data in categories_data:
            existing_cat = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
            if not existing_cat:
                category = Category(
                    name=cat_data["name"],
                    slug=cat_data["slug"],
                    description=cat_data["description"],
                    sort_order=cat_data["sort_order"],
                    is_active=1,
                )
                db.add(category)
                print(f"  ✅ 已创建空间分类：{cat_data['name']}（{cat_data['slug']}）")
            else:
                print(f"  ⏭️  空间分类已存在：{cat_data['name']}，跳过")

        # =============================================
        # 种子数据 3：预置网站设置（13项）
        # 说明：以 KV 键值对形式存储，支持 text/html/json 三种类型
        #       前台通过 /api/settings 接口获取公开设置
        # =============================================
        settings_data = [
            ("company_name", "TP全屋家居", "text"),
            ("company_intro", "<p>TP全屋家居集设计、研发、生产、销售于一体，致力于为每个家庭提供高品质的全屋定制家具解决方案。</p>", "html"),
            ("seo_title", "TP全屋家居 - 原创设计 · 品质制造 · 全屋定制", "text"),
            ("seo_keywords", "全屋家居,全屋定制,家具,客厅家具,卧室家具,书房家具,TP家居", "text"),
            ("seo_description", "TP全屋家居是一家集设计、研发、生产、销售于一体的综合性全屋定制家具企业，产品覆盖客厅、卧室、书房、餐厅、茶室等全品类空间家具。", "text"),
            ("phone", "400-xxx-xxxx", "text"),
            ("email", "contact@tp-home.com", "text"),
            ("address", "中国·XX省XX市XX区XX路XX号", "text"),
            ("company_logo", "/uploads/logo.png", "text"),
            ("wechat_qrcode", "/uploads/qrcodes/wechat.jpg", "text"),
            ("video_qrcode", "/uploads/qrcodes/video.jpg", "text"),
            ("douyin_qrcode", "/uploads/qrcodes/douyin.jpg", "text"),
            ("xiaohongshu_qrcode", "/uploads/qrcodes/xiaohongshu.jpg", "text"),
        ]

        for key, value, value_type in settings_data:
            existing_setting = db.query(SiteSetting).filter(SiteSetting.key == key).first()
            if not existing_setting:
                setting = SiteSetting(key=key, value=value, value_type=value_type)
                db.add(setting)
                print(f"  ✅ 已创建设置项：{key}（{value_type}）")
            else:
                print(f"  ⏭️  设置项已存在：{key}，跳过")

        # =============================================
        # 种子数据 4：预置轮播图占位（3个）
        # 说明：首页轮播图占位，图片路径为占位符
        #       上线前需替换为实际图片素材
        # =============================================
        banners_data = [
            {
                "title": "TP 全屋家居<br>打造理想家居空间",
                "subtitle": "匠心品质 · 为每个家庭量身定制",
                "tag_text": "匠心品质 · 原创设计",
                "description": "集设计、研发、生产、销售于一体的综合性全屋定制家具企业<br>以制造实力和原创设计，为客户打造理想家居空间",
                "image_url": "/uploads/banners/banner-1.jpg",
                "btn_primary_text": "免费预约量尺",
                "btn_primary_link": "/booking",
                "btn_outline_text": "浏览产品",
                "btn_outline_link": "/products",
                "sort_order": 1,
            },
            {
                "title": "胡桃禮系列<br>北美黑胡桃木 · 传世经典",
                "subtitle": "榫卯工艺 · 现代设计语言诠释东方韵味",
                "tag_text": "新品推荐",
                "description": "精选北美黑胡桃木，榫卯工艺精心打磨<br>以现代设计语言诠释东方韵味，成就传世经典",
                "image_url": "/uploads/banners/banner-2.jpg",
                "btn_primary_text": "查看详情",
                "btn_primary_link": "/products",
                "btn_outline_text": "预约量尺",
                "btn_outline_link": "/booking",
                "sort_order": 2,
            },
            {
                "title": "全屋定制解决方案<br>一站式打造理想家",
                "subtitle": "从设计到交付 · 全程无忧",
                "tag_text": "全屋定制",
                "description": "客厅 · 卧室 · 书房 · 餐厅 · 茶室全空间覆盖<br>专业设计师一对一服务，从量尺到交付全程无忧",
                "image_url": "/uploads/banners/banner-3.jpg",
                "btn_primary_text": "立即预约",
                "btn_primary_link": "/booking",
                "btn_outline_text": "查看案例",
                "btn_outline_link": "/cases",
                "sort_order": 3,
            },
        ]

        for banner_data in banners_data:
            existing_banner = db.query(Banner).filter(
                Banner.title == banner_data["title"]
            ).first()
            if not existing_banner:
                banner = Banner(
                    title=banner_data["title"],
                    subtitle=banner_data.get("subtitle"),
                    tag_text=banner_data["tag_text"],
                    description=banner_data["description"],
                    image_url=banner_data["image_url"],
                    btn_primary_text=banner_data["btn_primary_text"],
                    btn_primary_link=banner_data["btn_primary_link"],
                    btn_outline_text=banner_data["btn_outline_text"],
                    btn_outline_link=banner_data["btn_outline_link"],
                    sort_order=banner_data["sort_order"],
                    is_active=1,
                )
                db.add(banner)
                print(f"  ✅ 已创建轮播图占位：{banner_data['title']}")
            else:
                print(f"  ⏭️  轮播图已存在：{banner_data['title']}，跳过")

        # =============================================
        # 提交事务
        # =============================================
        db.commit()
        print()
        print("🎉 种子数据初始化完成！")

    except Exception as e:
        # 发生错误时回滚事务，确保数据一致性
        db.rollback()
        print(f"❌ 种子数据初始化失败：{e}")
        raise
    finally:
        # 无论成功还是失败，最后都要关闭数据库会话
        db.close()


# =============================================
# 主函数入口
# 执行方式：python -m app.init_db
# =============================================
def main():
    """数据库初始化的主流程"""
    print("=" * 50)
    print("  TP全屋家居 · 数据库初始化脚本")
    print("=" * 50)
    print()

    # Step 1：创建数据库表
    create_tables()

    print()

    # Step 2：写入种子数据
    seed_data()

    print()
    print("=" * 50)
    print("  ✅ 数据库初始化全部完成！")
    print(f"  📂 数据库文件: data/tp_furniture.db")
    print("=" * 50)


if __name__ == "__main__":
    main()