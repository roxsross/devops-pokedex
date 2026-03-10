import { Link } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import SearchBar from "./SearchBar";
import "./Navbar.css";

export default function Navbar() {
  const recentlyViewed = useAppStore((s) => s.recentlyViewed);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <span className="logo-poke">Poké</span>
        <span className="logo-verse">Verse</span>
      </Link>
      <SearchBar />
      <div className="nav-counter">
        <span className="counter-number">{recentlyViewed.length}</span>
        <span className="counter-label">vistos</span>
      </div>
    </nav>
  );
}
