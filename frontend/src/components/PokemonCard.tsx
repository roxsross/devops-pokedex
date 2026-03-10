import { Link } from "react-router-dom";
import type { PokemonSummary } from "../types/pokemon";
import { getTypeColor, capitalize, formatId } from "../utils/helpers";
import TypeBadge from "./TypeBadge";
import "./PokemonCard.css";

interface Props {
  pokemon: PokemonSummary;
  onHover?: () => void;
}

export default function PokemonCard({ pokemon, onHover }: Props) {
  const mainColor = getTypeColor(pokemon.types[0] ?? "normal");

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className="pokemon-card"
      style={{ "--glow-color": mainColor } as React.CSSProperties}
      onMouseEnter={onHover}
    >
      <div className="card-sprite-wrapper">
        {pokemon.sprite_url && (
          <img
            src={pokemon.sprite_url}
            alt={pokemon.name}
            className="card-sprite"
            loading="lazy"
          />
        )}
      </div>
      <div className="card-info">
        <span className="card-id">{formatId(pokemon.id)}</span>
        <h3 className="card-name">{capitalize(pokemon.name)}</h3>
        <div className="card-types">
          {pokemon.types.map((t) => (
            <TypeBadge key={t} type={t} active />
          ))}
        </div>
      </div>
    </Link>
  );
}
