import { useQuery } from "@tanstack/react-query";
import { fetchPokemon } from "../api/pokemon";

export function usePokemonDetail(nameOrId: string) {
  return useQuery({
    queryKey: ["pokemon", nameOrId],
    queryFn: () => fetchPokemon(nameOrId),
    staleTime: 5 * 60 * 1000,
    enabled: !!nameOrId,
  });
}
