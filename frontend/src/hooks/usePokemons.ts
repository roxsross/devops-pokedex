import { useQuery } from "@tanstack/react-query";
import { fetchPokemons } from "../api/pokemon";

export function usePokemons(page: number, limit: number, type?: string) {
  return useQuery({
    queryKey: ["pokemons", page, limit, type],
    queryFn: () => fetchPokemons(page, limit, type),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}
