const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

interface Props {
  guesses: string[];
  results: string[][];
  current: string;
}

function Tile({ letter, state }: { letter: string; state: string }) {
  return <div className={`tile ${state}`}>{letter}</div>;
}

function Row({ letters, states }: { letters: string[]; states: string[] }) {
  return (
    <div className="row">
      {Array.from({ length: WORD_LENGTH }, (_, i) => (
        <Tile key={i} letter={letters[i] ?? ""} state={states[i]} />
      ))}
    </div>
  );
}

export default function Board({ guesses, results, current }: Props) {
  const rows = Array.from({ length: MAX_GUESSES }, (_, i) => {
    if (i < guesses.length) return { letters: guesses[i].split(""), states: results[i] };
    if (i === guesses.length) return { letters: current.split(""), states: Array(WORD_LENGTH).fill("active") };
    return { letters: [], states: Array(WORD_LENGTH).fill("empty") };
  });

  return (
    <div className="board">
      {rows.map((row, i) => <Row key={i} letters={row.letters} states={row.states} />)}
    </div>
  );
}
