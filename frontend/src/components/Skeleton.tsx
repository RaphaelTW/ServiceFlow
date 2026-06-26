export function Skeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: rows }).map((_, index) => (
        <div className="skeleton" key={index} />
      ))}
    </div>
  );
}

