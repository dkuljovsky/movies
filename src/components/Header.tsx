import { useEffect, useState } from "react";
import { Link } from "react-router";

interface HeaderProps {
  count: number;
  filtered: boolean;
  watchlistSize: number;
}

function formatClock() {
  return new Date().toLocaleTimeString("en-GB", { hour12: false }) + " CET";
}

function Header({ count, filtered, watchlistSize }: HeaderProps) {
  const [clock, setClock] = useState(formatClock);

  useEffect(() => {
    const id = setInterval(() => setClock(formatClock()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header>
      <div>
        <span className="dot"></span>
        <b>FILM ARCHIVE</b> — INDEX 001 / 2026
        <span className="clock">{clock}</span>
      </div>
      <div>
        <span>
          {count} TITLES / {filtered ? "FILTERED" : "COMPLETE"}
        </span>
        &nbsp;
        <span style={{ color: "var(--text)" }}>
          <Link to="/watchlist">WATCHLIST [{watchlistSize}]</Link>
        </span>
      </div>
    </header>
  );
}

export default Header;