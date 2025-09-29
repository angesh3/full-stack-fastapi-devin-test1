from fastapi import APIRouter

from app.api.routes import items, login, private, users, utils
from app.api.routes import math
from app.core.config import settings

api_router = APIRouter()
#api_router.include_router(login.router)
#api_router.include_router(users.router)
#api_router.include_router(utils.router)
#api_router.include_router(items.router)
#api_router.include_router(math.router, prefix="/math", tags=["math"])

if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)

api_router.include_router(items.router, prefix="/items", tags=["items"])
api_router.include_router(login.router, prefix="/login", tags=["login"])
api_router.include_router(private.router, prefix="/private", tags=["private"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(math.router, prefix="/math", tags=["math"])  # 👈 add this line

if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
