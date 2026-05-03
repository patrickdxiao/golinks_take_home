const ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","BACKSPACE"],
];

interface Props {
  onKey: (key: string) => void;
  letterStates: Record<string, string>;
}

export default function Keyboard({ onKey, letterStates }: Props) {
  return (
    <div className="keyboard">
      {ROWS.map((row, i) => (
        <div key={i} className="keyboard-row">
          {row.map(key => (
            <button
              key={key}
              className={`key ${letterStates[key] ?? ""}`}
              onClick={() => onKey(key)}
            >
              {key === "BACKSPACE" ? "⌫" : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
