interface Props {
  files: File[];
  onReorder: (files: File[]) => void;
}

export default function FileList({ files, onReorder }: Props) {
  const move = (from: number, to: number) => {
    const arr = [...files];
    const [item] = arr.splice(from, 1);
    if (!item) return;
    arr.splice(to, 0, item);
    onReorder(arr);
  };
  return (
    <ul>
      {files.map((f, i) => (
        <li key={f.name}>
          {f.name} ({Math.round(f.size / 1024)} KB)
          <button disabled={i === 0} onClick={() => move(i, i - 1)}>
            ^
          </button>
          <button
            disabled={i === files.length - 1}
            onClick={() => move(i, i + 1)}
          >
            v
          </button>
        </li>
      ))}
    </ul>
  );
}
