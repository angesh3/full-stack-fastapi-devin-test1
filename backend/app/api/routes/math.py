from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
router = APIRouter(tags=["math"])

@router.get("/divide")
def divide(a: float, b: float):
    result = a / b
    return JSONResponse(content={"result": result})
