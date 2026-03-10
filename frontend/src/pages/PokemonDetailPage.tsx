import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { usePokemonDetail } from "../hooks/usePokemonDetail";
import { useAppStore } from "../store/useAppStore";
import {
  capitalize,
  formatId,
  formatHeight,
  formatWeight,
  getTypeColor,
  STAT_COLORS,
} from "../utils/helpers";
import TypeBadge from "../components/TypeBadge";
import LoadingPokeball from "../components/LoadingPokeball";
import "./PokemonDetailPage.css";

export default function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: pokemon, isLoading, isError } = usePokemonDetail(id ?? "");
  const addRecentlyViewed = useAppStore((s) => s.addRecentlyViewed);
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  useEffect(() => {
    if (pokemon) addRecentlyViewed(pokemon.id);
  }, [pokemon, addRecentlyViewed]);

  if (isLoading) return <LoadingPokeball />;
  if (isError || !pokemon)
    return <p className="error-msg">Pokémon not found.</p>;

  const mainColor = getTypeColor(pokemon.types[0] ?? "normal");
  const isFav = favorites.includes(pokemon.id);
  const maxStat = Math.max(...pokemon.stats.map((s) => s.value), 255);

  function goRandom() {
    const rnd = Math.floor(Math.random() * 1010) + 1;
    navigate(`/pokemon/${rnd}`);
  }

  return (
    <div className="detail-page">
      <div className="detail-layout">
        {/* Left: sprite */}
        <div
          className="detail-left"
          style={{ "--detail-color": mainColor } as React.CSSProperties}
        >
          <div className="detail-particles">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="particle"
                style={
                  {
                    "--x": `${Math.random() * 100}%`,
                    "--y": `${Math.random() * 100}%`,
                    "--delay": `${Math.random() * 4}s`,
                    "--size": `${3 + Math.random() * 5}px`,
                    background: mainColor,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
          {pokemon.sprite_url && (
            <img
              src={pokemon.sprite_url}
              alt={pokemon.name}
              className="detail-sprite"
            />
          )}
        </div>

        {/* Right: info */}
        <div className="detail-right">
          <div className="detail-header">
            <span className="detail-id">{formatId(pokemon.id)}</span>
            <h1 className="detail-name">{capitalize(pokemon.name)}</h1>
            <button
              className={`fav-btn ${isFav ? "fav-active" : ""}`}
              onClick={() => toggleFavorite(pokemon.id)}
              title={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              {isFav ? "★" : "☆"}
            </button>
          </div>

          <div className="detail-types">
            {pokemon.types.map((t) => (
              <TypeBadge key={t} type={t} active />
            ))}
          </div>

          <div className="detail-measures">
            <div>
              <span className="measure-label">Height</span>
              <span className="measure-value">{formatHeight(pokemon.height)}</span>
            </div>
            <div>
              <span className="measure-label">Weight</span>
              <span className="measure-value">{formatWeight(pokemon.weight)}</span>
            </div>
            <div>
              <span className="measure-label">Base XP</span>
              <span className="measure-value">{pokemon.base_experience ?? "—"}</span>
            </div>
          </div>

          {/* Stats */}
          <h2 className="section-title">Stats</h2>
          <div className="stats-list">
            {pokemon.stats.map((s) => (
              <div key={s.name} className="stat-row">
                <span className="stat-name">{capitalize(s.name.replace("-", " "))}</span>
                <div className="stat-bar-bg">
                  <div
                    className="stat-bar-fill"
                    style={{
                      width: `${(s.value / maxStat) * 100}%`,
                      background: STAT_COLORS[s.name] ?? mainColor,
                    }}
                  />
                </div>
                <span className="stat-value">{s.value}</span>
              </div>
            ))}
          </div>

          {/* Abilities */}
          <h2 className="section-title">Abilities</h2>
          <div className="abilities">
            {pokemon.abilities.map((a) => (
              <span
                key={a.name}
                className={`ability-chip ${a.is_hidden ? "hidden-ability" : ""}`}
              >
                {capitalize(a.name.replace("-", " "))}
                {a.is_hidden && <small> (hidden)</small>}
              </span>
            ))}
          </div>

          {/* Evolution Chain */}
          {pokemon.evolution_chain && pokemon.evolution_chain.length > 1 && (
            <>
              <h2 className="section-title">Evolution Chain</h2>
              <div className="evo-chain">
                {pokemon.evolution_chain.map((node, i) => (
                  <div key={node.name} className="evo-node-wrapper">
                    {i > 0 && (
                      <div className="evo-arrow">
                        <span className="arrow-line" />
                        {node.level && (
                          <span className="evo-level">Lv.{node.level}</span>
                        )}
                        {!node.level && node.trigger && (
                          <span className="evo-level">{capitalize(node.trigger)}</span>
                        )}
                      </div>
                    )}
                    <div
                      className="evo-node"
                      onClick={() => navigate(`/pokemon/${node.name}`)}
                    >
                      {node.sprite_url && (
                        <img
                          src={node.sprite_url}
                          alt={node.name}
                          className="evo-sprite"
                        />
                      )}
                      <span className="evo-name">{capitalize(node.name)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="detail-nav">
            {pokemon.id > 1 && (
              <button
                className="page-btn"
                onClick={() => navigate(`/pokemon/${pokemon.id - 1}`)}
              >
                ← Prev
              </button>
            )}
            <button className="page-btn" onClick={goRandom}>
              🎲 Random
            </button>
            <button
              className="page-btn"
              onClick={() => navigate(`/pokemon/${pokemon.id + 1}`)}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
