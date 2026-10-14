interface HeroProps {
  query: string | null;
  onQueryChange: (query: string) => void;
}

function Hero({ query, onQueryChange }: HeroProps) {
  return (
    <div className="hero">
      <h1>FilmIndex</h1>

      <section>
        <p>
          A queryable archive of cinema's essential records. Every film
          numbered, dated, and typed once — no recommendation engine, no noise.
          Query the index below or open any record directly.
        </p>

        <input
          type="text"
          name="query"
          value={query ?? ""}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </section>
    </div>
  );
}

export default Hero;
