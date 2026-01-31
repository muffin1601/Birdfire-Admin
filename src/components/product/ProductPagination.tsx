export default function ProductPagination({
  page,
  totalPages,
  onChange,
}: any) {
  if (totalPages <= 1) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Prev
      </button>

      <span style={{ margin: "0 8px" }}>
        Page {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
