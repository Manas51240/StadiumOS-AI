import sys
import os
import asyncio

# Add backend directory to sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    from app.main import app
    from app.core.database import engine, Base, SessionLocal
    from app.features.auth.data.models import User
    from app.core.security import get_password_hash
except ImportError:
    from backend.app.main import app  # type: ignore
    from backend.app.core.database import engine, Base, SessionLocal  # type: ignore
    from backend.app.features.auth.data.models import User  # type: ignore
    from backend.app.core.security import get_password_hash  # type: ignore

from sqlalchemy import select

# Ensure database tables and seed users are initialized on Vercel serverless load
async def _init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as session:
        # Seed organizer@fifa.com
        stmt = select(User).where(User.email == "organizer@fifa.com")
        res = await session.execute(stmt)
        if not res.scalar_one_or_none():
            session.add(User(
                email="organizer@fifa.com",
                hashed_password=get_password_hash("strongpassword123"),
                full_name="FIFA World Cup Organizer",
                role="organizer",
                is_active=True
            ))

        # Seed manasdeshmukh512@gmail.com
        stmt_m = select(User).where(User.email == "manasdeshmukh512@gmail.com")
        res_m = await session.execute(stmt_m)
        if not res_m.scalar_one_or_none():
            session.add(User(
                email="manasdeshmukh512@gmail.com",
                hashed_password=get_password_hash("strongpassword123"),
                full_name="Manas Deshmukh",
                role="organizer",
                is_active=True
            ))
        await session.commit()

try:
    asyncio.run(_init_db())
except Exception as e:
    print(f"DB Init Exception: {e}")
