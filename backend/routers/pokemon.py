from fastapi import APIRouter, Query

from models.schemas import PaginatedResponse, PokemonDetail, PokemonSummary, EvolutionNode
from services import pokeapi_client

router = APIRouter(prefix="/api", tags=["pokemon"])


@router.get("/pokemon", response_model=PaginatedResponse)
async def list_pokemon(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    type: str | None = Query(None),
):
    if type:
        return await pokeapi_client.get_pokemon_by_type(type, page, limit)
    return await pokeapi_client.list_pokemon(page, limit)


@router.get("/search", response_model=list[PokemonSummary])
async def search_pokemon(q: str = Query(..., min_length=1), limit: int = Query(10, ge=1, le=50)):
    return await pokeapi_client.search_pokemon(q, limit)


@router.get("/pokemon/{name_or_id}", response_model=PokemonDetail)
async def get_pokemon(name_or_id: str):
    return await pokeapi_client.get_pokemon(name_or_id.lower())


@router.get("/pokemon/{name}/evolution", response_model=list[EvolutionNode])
async def get_evolution(name: str):
    return await pokeapi_client.get_evolution(name.lower())
