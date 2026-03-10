import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePokemons } from "../hooks/usePokemons";
import { useAppStore } from "../store/useAppStore";
import { fetchPokemon } from "../api/pokemon";
import PokemonCard from "../components/PokemonCard";
import FilterBar from "../components/FilterBar";
import LoadingPokeball from "../components/LoadingPokeball";
import "./HomePage.css";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const selectedType = useAppStore((s) => s.selectedType);
  const { data, isLoading, isError } = usePokemons(page, 20, selectedType ?? undefined);
  const queryClient = useQueryClient();

  const prefetch = useCallback(
    (id: number) => {
      queryClient.prefetchQuery({
        queryKey: ["pokemon", String(id)],
        queryFn: () => fetchPokemon(String(id)),
        staleTime: 5 * 60 * 1000,
      });
    },
    [queryClient]
  );

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <h1 className="hero-title glitch" data-text="PokéVerse">
          PokéVerse
        </h1>
        <p className="hero-sub">Explore the world of Pokémon</p>
      </section>

      <FilterBar />

      {isLoading && <LoadingPokeball />}
      {isError && <p className="error-msg">Failed to load Pokémon. Try again later.</p>}

      {data && (
        <>
          <div className="pokemon-grid">
            {data.items.map((p, i) => (
              <div key={p.id} className="card-appear" style={{ animationDelay: `${i * 50}ms` }}>
                <PokemonCard pokemon={p} onHover={() => prefetch(p.id)} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="page-btn">
              ← Prev
            </button>
            <span className="page-info">
              Page {data.page} / {data.pages}
            </span>
            <button disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)} className="page-btn">
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
