interface HomeFooterProps {
  filtered: boolean;
  count: number;
}

function HomeFooter({ filtered, count }: HomeFooterProps) {
  return (
    <footer>
      <span>SWISS STYLE — MONOSPACE — DARK — NO FRAMEWORK</span>
      <span>
        ARCHIVE {filtered ? "FILTERED" : "COMPLETE"} — {count} ENTRIES
      </span>
    </footer>
  );
}

export default HomeFooter;
