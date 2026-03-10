from fastapi import APIRouter

from models.schemas import TypeInfo
from services import pokeapi_client

router = APIRouter(prefix="/api", tags=["types"])


@router.get("/types", response_model=list[TypeInfo])
async def list_types():
    return await pokeapi_client.list_types()
