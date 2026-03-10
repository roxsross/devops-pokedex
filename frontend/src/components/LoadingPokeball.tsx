import "./LoadingPokeball.css";

export default function LoadingPokeball() {
  return (
    <div className="pokeball-loader">
      <div className="pokeball">
        <div className="pokeball-top" />
        <div className="pokeball-center">
          <div className="pokeball-button" />
        </div>
        <div className="pokeball-bottom" />
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  );
}
