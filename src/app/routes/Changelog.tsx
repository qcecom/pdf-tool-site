import changes from "./changelog.json";

export default function Changelog() {
  return (
    <main>
      <h2>Changelog</h2>
      <ul>
        {changes.map((c) => (
          <li key={c.date}>
            <strong>{c.date}</strong> - {c.text}
          </li>
        ))}
      </ul>
    </main>
  );
}
