import { Component, type ReactNode } from "react";
import "./ErrorBoundary.css";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          {/* Gengar triste SVG */}
          <svg
            className="gengar-svg"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="100" cy="110" rx="75" ry="70" fill="#705898" />
            <ellipse cx="70" cy="80" rx="20" ry="22" fill="#705898" />
            <ellipse cx="130" cy="80" rx="20" ry="22" fill="#705898" />
            {/* Eyes */}
            <ellipse cx="75" cy="100" rx="12" ry="14" fill="#fff" />
            <ellipse cx="125" cy="100" rx="12" ry="14" fill="#fff" />
            <ellipse cx="78" cy="102" rx="6" ry="8" fill="#e74c3c" />
            <ellipse cx="128" cy="102" rx="6" ry="8" fill="#e74c3c" />
            {/* Sad mouth */}
            <path
              d="M 75 140 Q 100 125 125 140"
              stroke="#fff"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* Tears */}
            <ellipse cx="68" cy="118" rx="3" ry="6" fill="#6890F0" opacity="0.7" />
            <ellipse cx="132" cy="118" rx="3" ry="6" fill="#6890F0" opacity="0.7" />
          </svg>
          <h2 className="error-title">Something went wrong!</h2>
          <p className="error-message">Gengar is sad. Please try reloading.</p>
          <button
            className="error-btn"
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
