export default function ProductBulkActions({
  selected,
  onClear,
  onDelete,
}: any) {
  if (selected.length === 0) return null;

  return (
    <div
      style={{
        padding: "8px",
        background: "#111827",
        marginTop: "8px",
      }}
    >
      <span>{selected.length} selected</span>

      <button onClick={onDelete}>Delete</button>
      <button onClick={onClear}>Clear</button>
    </div>
  );
}
