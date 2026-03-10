from pydantic import BaseModel


class PokemonSummary(BaseModel):
    id: int
    name: str
    types: list[str]
    sprite_url: str | None = None
    base_experience: int | None = None


class Stat(BaseModel):
    name: str
    value: int


class Ability(BaseModel):
    name: str
    is_hidden: bool


class EvolutionNode(BaseModel):
    name: str
    level: int | None = None
    trigger: str | None = None
    sprite_url: str | None = None


class PokemonDetail(BaseModel):
    id: int
    name: str
    types: list[str]
    sprite_url: str | None = None
    base_experience: int | None = None
    stats: list[Stat]
    abilities: list[Ability]
    height: int
    weight: int
    evolution_chain: list[EvolutionNode] | None = None


class DamageRelations(BaseModel):
    double_damage_from: list[str] = []
    double_damage_to: list[str] = []
    half_damage_from: list[str] = []
    half_damage_to: list[str] = []
    no_damage_from: list[str] = []
    no_damage_to: list[str] = []


class TypeInfo(BaseModel):
    name: str
    color_hex: str
    damage_relations: DamageRelations


class PaginatedResponse(BaseModel):
    items: list[PokemonSummary]
    total: int
    page: int
    limit: int
    pages: int
