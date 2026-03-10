import TypeBadge from "./TypeBadge";
import { useAppStore } from "../store/useAppStore";
import "./FilterBar.css";

const MAIN_TYPES = [
  "fire", "water", "grass", "electric", "ice", "fighting",
  "poison", "ground", "flying", "psychic", "bug", "rock",
  "ghost", "dragon", "dark", "steel", "fairy", "normal",
];

export default function FilterBar() {
  const selectedType = useAppStore((s) => s.selectedType);
  const setSelectedType = useAppStore((s) => s.setSelectedType);

  return (
    <div className="filter-bar">
      <TypeBadge
        type="all"
        active={!selectedType}
        onClick={() => setSelectedType(null)}
      />
      {MAIN_TYPES.map((t) => (
        <TypeBadge
          key={t}
          type={t}
          active={selectedType === t}
          onClick={() => setSelectedType(selectedType === t ? null : t)}
        />
      ))}
    </div>
  );
}
