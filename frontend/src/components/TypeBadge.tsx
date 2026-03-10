import { getTypeColor, capitalize } from "../utils/helpers";
import "./TypeBadge.css";

interface Props {
  type: string;
  onClick?: () => void;
  active?: boolean;
}

export default function TypeBadge({ type, onClick, active }: Props) {
  const color = getTypeColor(type);

  return (
    <span
      className={`type-badge ${active ? "active" : ""}`}
      style={
        {
          "--type-color": color,
          backgroundColor: active ? color : `${color}33`,
          color: active ? "#fff" : color,
          borderColor: color,
        } as React.CSSProperties
      }
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {capitalize(type)}
    </span>
  );
}
