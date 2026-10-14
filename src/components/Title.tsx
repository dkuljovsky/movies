interface TitleProps {
  title: any;
  onSelect: (id: number) => void;
  selected: boolean;
  inList: boolean;
  onHover: (id: number) => void;
  addedAt?: number;
  showAddedAt?: boolean;
  isWatchable?: boolean;
  onWatch?: (id: number) => void;
}

function round(num: number): string {
  return num.toFixed(1);
}

function formatAddedAt(ts: number): string {
  return new Date(ts).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Title({
  title,
  onSelect,
  selected,
  inList,
  onHover,
  addedAt,
  showAddedAt,
  isWatchable,
  onWatch,
}: TitleProps) {
  function handleWatch(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();

    onWatch?.(title?.id);
  }

  return (
    <tr
      className="table-row"
      onClick={() => onSelect(title?.id)}
      onPointerEnter={() => onHover(title?.id)}
      data-selected={selected}
      data-in-list={inList}
    >
      <td className="table-cell-title">
        {isWatchable && <button onClick={handleWatch}>▶</button>}
        <div>{title?.title}</div>
      </td>
      <td>{title?.year}</td>
      <td>{title?.genres?.map((genre: any) => `[${genre}]`)}</td>
      <td>{round(title?.rating)}</td>
      {showAddedAt && <td>{addedAt ? formatAddedAt(addedAt) : "—"}</td>}
    </tr>
  );
}

export default Title;
