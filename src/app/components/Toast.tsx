interface Props {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: Props) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        background: "#f87171",
        color: "white",
        padding: "8px 12px",
        borderRadius: 4
      }}
    >
      {message}
      <button style={{ marginLeft: 8 }} onClick={onClose}>
        ×
      </button>
    </div>
  );
}
