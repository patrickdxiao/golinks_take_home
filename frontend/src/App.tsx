import { useState, useEffect, useCallback } from "react";
import Board from "./Board";
import Keyboard from "./Keyboard";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

async function fetchWord(): Promise<string> {
  const res = await fetch(`${API}/word`);
  const data = await res.json();
  return data.word;
}

// returns result array, or null if the guess is not a valid word
async function fetchGuess(word: string, guess: string): Promise<string[] | null> {
  const res = await fetch(`${API}/guess`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ word, guess }),
  });
  if (res.status === 400) return null;
  const data = await res.json();
  return data.result;
}

export default function App() {
  const [word, setWord] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [results, setResults] = useState<string[][]>([]);
  const [current, setCurrent] = useState("");
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [error, setError] = useState("");

  const loadWord = useCallback(async () => {
    const w = await fetchWord();
    setWord(w);
    setGuesses([]);
    setResults([]);
    setCurrent("");
    setStatus("playing");
    setError("");
  }, []);

  useEffect(() => { loadWord(); }, [loadWord]);

  const submitGuess = useCallback(async () => {
    if (current.length !== WORD_LENGTH || status !== "playing") return;
    const result = await fetchGuess(word, current);
    if (!result) { setError("Invalid word"); return; }
    setError("");
    const newGuesses = [...guesses, current];
    const newResults = [...results, result];
    setGuesses(newGuesses);
    setResults(newResults);
    setCurrent("");
    if (current.toLowerCase() === word) setStatus("won");
    else if (newGuesses.length === MAX_GUESSES) setStatus("lost");
  }, [current, word, guesses, results, status]);

  const onKey = useCallback((key: string) => {
    if (status !== "playing") return;
    if (key === "ENTER") { submitGuess(); return; }
    if (key === "BACKSPACE") { setCurrent(c => c.slice(0, -1)); return; }
    if (current.length < WORD_LENGTH && /^[A-Z]$/.test(key)) {
      setError("");
      setCurrent(c => c + key);
    }
  }, [status, current, submitGuess]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => onKey(e.key.toUpperCase());
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onKey]);

  // build letter → best color map for keyboard highlighting
  const priority: Record<string, number> = { green: 3, yellow: 2, gray: 1 };
  const letterStates = results.reduce<Record<string, string>>((acc, result, i) => {
    result.forEach((state, j) => {
      const letter = guesses[i][j];
      if (!acc[letter] || priority[state] > priority[acc[letter]]) acc[letter] = state;
    });
    return acc;
  }, {});

  return (
    <div className="app">
      <h1>Definitely Not Wordle</h1>
      <Board guesses={guesses} results={results} current={current} />
      <div className="status">
        <div className="error">{error}</div>
        {status !== "playing" && (
          <>
            <span>{status === "won" ? "You won!" : `The word was ${word.toUpperCase()}`}</span>
            <button onClick={loadWord}>Play Again</button>
          </>
        )}
      </div>
      <Keyboard onKey={onKey} letterStates={letterStates} />
    </div>
  );
}
