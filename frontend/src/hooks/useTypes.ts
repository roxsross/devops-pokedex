import { useQuery } from "@tanstack/react-query";
import { fetchTypes } from "../api/pokemon";

export function useTypes() {
  return useQuery({
    queryKey: ["types"],
    queryFn: fetchTypes,
    staleTime: 30 * 60 * 1000,
  });
}
