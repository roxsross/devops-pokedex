import httpx
from fastapi import HTTPException

from core.config import settings
from services import cache_service

TYPE_COLORS: dict[str, str] = {
    "normal": "#A8A878",
    "fire": "#F08030",
    "water": "#6890F0",
    "electric": "#F8D030",
    "grass": "#78C850",
    "ice": "#98D8D8",
    "fighting": "#C03028",
    "poison": "#A040A0",
    "ground": "#E0C068",
    "flying": "#A890F0",
    "psychic": "#F85888",
    "bug": "#A8B820",
    "rock": "#B8A038",
    "ghost": "#705898",
    "dragon": "#7038F8",
    "dark": "#705848",
    "steel": "#B8B8D0",
    "fairy": "#EE99AC",
}

_client: httpx.AsyncClient | None = None


async def get_client() -> httpx.AsyncClient:
    global _client
    if _client is None or _client.is_closed:
        _client = httpx.AsyncClient(
            base_url=settings.pokeapi_base_url,
            timeout=httpx.Timeout(15.0, connect=5.0),
        )
    return _client


async def close_client():
    global _client
    if _client and not _client.is_closed:
        await _client.aclose()
        _client = None


async def _fetch(path: str) -> dict:
    cached = cache_service.get(path)
    if cached is not None:
        return cached

    client = await get_client()
    try:
        resp = await client.get(path)
    except httpx.RequestError as exc:
        raise HTTPException(status_code=503, detail=f"PokeAPI unavailable: {exc}")

    if resp.status_code == 404:
        raise HTTPException(status_code=404, detail="Resource not found on PokeAPI")
    if resp.status_code >= 400:
        raise HTTPException(status_code=502, detail="Bad response from PokeAPI")

    data = resp.json()
    cache_service.set(path, data)
    return data


# ---- Pokemon helpers ----

def _parse_summary(data: dict) -> dict:
    return {
        "id": data["id"],
        "name": data["name"],
        "types": [t["type"]["name"] for t in data["types"]],
        "sprite_url": data["sprites"]["other"]["official-artwork"]["front_default"]
        or data["sprites"]["front_default"],
        "base_experience": data.get("base_experience"),
    }


def _parse_detail(data: dict) -> dict:
    return {
        **_parse_summary(data),
        "stats": [
            {"name": s["stat"]["name"], "value": s["base_stat"]}
            for s in data["stats"]
        ],
        "abilities": [
            {"name": a["ability"]["name"], "is_hidden": a["is_hidden"]}
            for a in data["abilities"]
        ],
        "height": data["height"],
        "weight": data["weight"],
    }


async def list_pokemon(page: int = 1, limit: int = 20):
    offset = (page - 1) * limit
    data = await _fetch(f"/pokemon?offset={offset}&limit={limit}")
    total = data["count"]

    summaries = []
    for entry in data["results"]:
        pokemon_data = await _fetch(f"/pokemon/{entry['name']}")
        summaries.append(_parse_summary(pokemon_data))

    return {
        "items": summaries,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
    }


async def get_pokemon(name_or_id: str) -> dict:
    data = await _fetch(f"/pokemon/{name_or_id}")
    detail = _parse_detail(data)

    # get evolution chain
    species_data = await _fetch(f"/pokemon-species/{data['id']}")
    evo_url = species_data.get("evolution_chain", {}).get("url")
    if evo_url:
        evo_path = evo_url.replace(settings.pokeapi_base_url, "")
        evo_data = await _fetch(evo_path)
        detail["evolution_chain"] = _parse_evolution_chain(evo_data["chain"])
    else:
        detail["evolution_chain"] = []

    return detail


def _parse_evolution_chain(chain: dict) -> list[dict]:
    nodes: list[dict] = []
    _walk_chain(chain, nodes)
    return nodes


def _walk_chain(node: dict, result: list[dict]):
    species_name = node["species"]["name"]
    level = None
    trigger = None
    details = node.get("evolution_details")
    if details and len(details) > 0:
        d = details[0]
        level = d.get("min_level")
        trigger = d.get("trigger", {}).get("name")

    species_id = node["species"]["url"].rstrip("/").split("/")[-1]
    sprite_url = f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{species_id}.png"

    result.append(
        {
            "name": species_name,
            "level": level,
            "trigger": trigger,
            "sprite_url": sprite_url,
        }
    )

    for child in node.get("evolves_to", []):
        _walk_chain(child, result)


async def get_evolution(name: str) -> list[dict]:
    species_data = await _fetch(f"/pokemon-species/{name}")
    evo_url = species_data.get("evolution_chain", {}).get("url")
    if not evo_url:
        return []
    evo_path = evo_url.replace(settings.pokeapi_base_url, "")
    evo_data = await _fetch(evo_path)
    return _parse_evolution_chain(evo_data["chain"])


async def list_types() -> list[dict]:
    data = await _fetch("/type")
    types_list = []
    for entry in data["results"]:
        name = entry["name"]
        if name in ("unknown", "shadow"):
            continue
        type_data = await _fetch(f"/type/{name}")
        dr = type_data.get("damage_relations", {})
        types_list.append(
            {
                "name": name,
                "color_hex": TYPE_COLORS.get(name, "#777777"),
                "damage_relations": {
                    "double_damage_from": [t["name"] for t in dr.get("double_damage_from", [])],
                    "double_damage_to": [t["name"] for t in dr.get("double_damage_to", [])],
                    "half_damage_from": [t["name"] for t in dr.get("half_damage_from", [])],
                    "half_damage_to": [t["name"] for t in dr.get("half_damage_to", [])],
                    "no_damage_from": [t["name"] for t in dr.get("no_damage_from", [])],
                    "no_damage_to": [t["name"] for t in dr.get("no_damage_to", [])],
                },
            }
        )
    return types_list


async def get_pokemon_by_type(type_name: str, page: int = 1, limit: int = 20):
    data = await _fetch(f"/type/{type_name}")
    all_pokemon = data.get("pokemon", [])
    total = len(all_pokemon)
    offset = (page - 1) * limit
    page_slice = all_pokemon[offset : offset + limit]

    summaries = []
    for entry in page_slice:
        pokemon_data = await _fetch(f"/pokemon/{entry['pokemon']['name']}")
        summaries.append(_parse_summary(pokemon_data))

    return {
        "items": summaries,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
    }


async def search_pokemon(query: str, limit: int = 10) -> list[dict]:
    data = await _fetch("/pokemon?offset=0&limit=1302")
    q = query.lower()
    matches = [e for e in data["results"] if q in e["name"].lower()][:limit]

    results = []
    for entry in matches:
        pokemon_data = await _fetch(f"/pokemon/{entry['name']}")
        results.append(_parse_summary(pokemon_data))
    return results
