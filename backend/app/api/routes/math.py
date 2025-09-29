from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/math/divide")
def divide(a: float, b: float):
    # BUG: no guard for divide-by-zero, will crash with 500
    result = a / b
    return JSONResponse(content={"result": result})
