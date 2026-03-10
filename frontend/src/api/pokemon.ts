import api from "./client";
import type {
  PaginatedResponse,
  PokemonDetail,
  PokemonSummary,
  EvolutionNode,
  TypeInfo,
} from "../types/pokemon";

export async function fetchPokemons(
  page: number,
  limit: number,
  type?: string
): Promise<PaginatedResponse> {
  const params: Record<string, string | number> = { page, limit };
  if (type) params.type = type;
  const { data } = await api.get<PaginatedResponse>("/pokemon", { params });
  return data;
}

export async function fetchPokemon(
  nameOrId: string
): Promise<PokemonDetail> {
  const { data } = await api.get<PokemonDetail>(`/pokemon/${nameOrId}`);
  return data;
}

export async function fetchEvolution(
  name: string
): Promise<EvolutionNode[]> {
  const { data } = await api.get<EvolutionNode[]>(
    `/pokemon/${name}/evolution`
  );
  return data;
}

export async function fetchTypes(): Promise<TypeInfo[]> {
  const { data } = await api.get<TypeInfo[]>("/types");
  return data;
}

export async function searchPokemon(
  query: string
): Promise<PokemonSummary[]> {
  const { data } = await api.get<PokemonSummary[]>("/search", {
    params: { q: query },
  });
  return data;
}
