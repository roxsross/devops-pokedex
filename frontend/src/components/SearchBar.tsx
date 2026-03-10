import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchPokemon } from "../api/pokemon";
import type { PokemonSummary } from "../types/pokemon";
import { capitalize } from "../utils/helpers";
import "./SearchBar.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PokemonSummary[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const data = await searchPokemon(query);
        setResults(data);
        setOpen(data.length > 0);
      } catch {
        setResults([]);
        setOpen(false);
      }
    }, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectPokemon(id: number) {
    setQuery("");
    setOpen(false);
    navigate(`/pokemon/${id}`);
  }

  return (
    <div className="search-bar" ref={wrapperRef}>
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      {open && (
        <ul className="search-dropdown">
          {results.map((p) => (
            <li key={p.id} onClick={() => selectPokemon(p.id)}>
              {p.sprite_url && (
                <img src={p.sprite_url} alt={p.name} className="search-sprite" />
              )}
              <span>{capitalize(p.name)}</span>
              <span className="search-id">#{p.id}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
