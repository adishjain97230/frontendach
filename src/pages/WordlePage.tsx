import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { WORDLE_CHECK_WORD_URL, WORDLE_GET_WORD_URL } from "../constants/api";
import "./WordlePage.css";

type GetWordResponse = {
  word_id: number;
};

type CheckWordResponse = {
  feedback: number[];
};

type FeedbackCode = 0 | 1 | 2;
type KeyboardStatus = "gray" | "yellow" | "green";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const KEYBOARD_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"] as const;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isGetWordResponse(value: unknown): value is GetWordResponse {
  return isObject(value) && typeof value.word_id === "number";
}

function isCheckWordResponse(value: unknown): value is CheckWordResponse {
  return (
    isObject(value) &&
    Array.isArray(value.feedback) &&
    value.feedback.length === WORD_LENGTH &&
    value.feedback.every(
      (item) =>
        typeof item === "number" && (item === 0 || item === 1 || item === 2),
    )
  );
}

const SunIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function WordlePage() {
  const [currentWord, setCurrentWord] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [feedbacks, setFeedbacks] = useState<number[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const targetWordIdRef = useRef<number | null>(null);
  const hasWon = feedbacks.some((row) => row.every((tile) => tile === 2));
  const hasFinished = hasWon || words.length >= MAX_GUESSES;
  const keyboardStatuses = words.reduce<Record<string, KeyboardStatus>>(
    (statusMap, guess, rowIndex) => {
      const rowFeedback = feedbacks[rowIndex] ?? [];

      guess.split("").forEach((letter, colIndex) => {
        const key = letter.toUpperCase();
        const code = rowFeedback[colIndex] as FeedbackCode | undefined;

        if (code === undefined) {
          return;
        }

        const nextStatus: KeyboardStatus =
          code === 2 ? "green" : code === 1 ? "yellow" : "gray";
        const previousStatus = statusMap[key];

        if (
          previousStatus === "green" ||
          (previousStatus === "yellow" && nextStatus === "gray")
        ) {
          return;
        }

        statusMap[key] = nextStatus;
      });

      return statusMap;
    },
    {},
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );
  }, [isDark]);

  const handleNewGame = () => {
    if (isSubmitting) {
      return;
    }

    setWords([]);
    setFeedbacks([]);
    setCurrentWord("");
    setError(null);
    targetWordIdRef.current = null;
  };

  const handleSubmit = async () => {
    if (currentWord.length !== WORD_LENGTH) {
      setError("Please enter exactly 5 letters.");
      return;
    }

    if (hasFinished) {
      setError(
        hasWon
          ? "Game finished. You already won."
          : "No guesses left in this round.",
      );
      return;
    }

    if (isSubmitting) {
      return;
    }

    const guess = currentWord;
    setError(null);
    setIsSubmitting(true);

    try {
      let wordId = targetWordIdRef.current;

      if (wordId === null) {
        const wordResponse = await fetch(WORDLE_GET_WORD_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!wordResponse.ok) {
          setError(`Could not start game (HTTP ${wordResponse.status}).`);
          return;
        }

        const rawWordData: unknown = await wordResponse.json();
        if (!isGetWordResponse(rawWordData)) {
          setError("Invalid response received while starting the game.");
          return;
        }

        wordId = rawWordData.word_id;
        targetWordIdRef.current = wordId;
      }

      const feedbackResponse = await fetch(WORDLE_CHECK_WORD_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word_id: wordId,
          guess,
          guess_number: words.length,
        }),
      });

      if (!feedbackResponse.ok) {
        setError(`Could not validate guess (HTTP ${feedbackResponse.status}).`);
        return;
      }

      const rawFeedbackData: unknown = await feedbackResponse.json();
      if (!isCheckWordResponse(rawFeedbackData)) {
        setError("Invalid response received while checking your guess.");
        return;
      }

      setWords((prev) => [...prev, guess]);
      setFeedbacks((prev) => [...prev, rawFeedbackData.feedback]);
      setCurrentWord("");
    } catch {
      setError("Unexpected network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wordle-root" data-theme={isDark ? "dark" : "light"}>
      <main className="wordle-shell">
        <section className="wordle-hero-card">
          <div className="wordle-hero-copy">
            <p className="wordle-kicker">Mini Game</p>
            <h1>Wordle</h1>
            <p className="wordle-subtitle">
              Guess the hidden five-letter word in six tries.
              <span
                className="wordle-rules-trigger"
                tabIndex={0}
                aria-label="Game rules"
              >
                ?
                <span className="wordle-rules-tooltip" role="tooltip">
                  Guess a valid five-letter word. Green means correct letter in
                  the correct spot, yellow means correct letter in the wrong
                  spot, and gray means the letter is not in the word. You have
                  six guesses.
                </span>
              </span>
            </p>
          </div>
          <div className="wordle-hero-actions">
            <Link to="/" className="wordle-profile-btn">
              View Complete Profile
            </Link>
            <div
              className="wordle-theme-toggle"
              role="group"
              aria-label="Theme toggle"
            >
              <button
                type="button"
                className={`wordle-theme-btn ${!isDark ? "active" : ""}`}
                onClick={() => setIsDark(false)}
                aria-label="Use light mode"
              >
                <SunIcon />
              </button>
              <button
                type="button"
                className={`wordle-theme-btn ${isDark ? "active" : ""}`}
                onClick={() => setIsDark(true)}
                aria-label="Use dark mode"
              >
                <MoonIcon />
              </button>
            </div>
          </div>
        </section>

        <section className="wordle-panel">
          <div className="wordle-status-row">
            <span className="wordle-status-pill">
              Guess {Math.min(words.length + 1, MAX_GUESSES)} / {MAX_GUESSES}
            </span>
            {hasWon && (
              <span className="wordle-status-pill success">You solved it!</span>
            )}
            {!hasWon && words.length >= MAX_GUESSES && (
              <span className="wordle-status-pill danger">Round complete</span>
            )}
            <button
              type="button"
              className="wordle-new-game"
              onClick={handleNewGame}
              disabled={isSubmitting}
            >
              New Game
            </button>
          </div>

          {error && (
            <p className="wordle-error" role="alert">
              {error}
            </p>
          )}

          <div className="wordle-grid" aria-live="polite">
            {Array.from({ length: MAX_GUESSES }, (_, rowIndex) => {
              const guess = words[rowIndex] ?? "";
              const feedback = feedbacks[rowIndex] ?? [];

              return (
                <div key={`row-${rowIndex}`} className="wordle-row">
                  {Array.from({ length: WORD_LENGTH }, (_, colIndex) => {
                    const letter = guess[colIndex]?.toUpperCase() ?? "";
                    const feedbackCode = feedback[colIndex] as
                      | FeedbackCode
                      | undefined;
                    const tileClass =
                      feedbackCode === 2
                        ? "wordle-tile green"
                        : feedbackCode === 1
                          ? "wordle-tile yellow"
                          : feedbackCode === 0
                            ? "wordle-tile gray"
                            : "wordle-tile";

                    return (
                      <div
                        key={`tile-${rowIndex}-${colIndex}`}
                        className={tileClass}
                      >
                        {letter}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div className="wordle-keyboard" aria-label="Used letters keyboard">
            {KEYBOARD_ROWS.map((row) => (
              <div key={row} className="wordle-keyboard-row">
                {row.split("").map((letter) => (
                  <div
                    key={letter}
                    className={`wordle-key ${keyboardStatuses[letter] ?? ""}`}
                    aria-label={`${letter} ${
                      keyboardStatuses[letter] ?? "unused"
                    }`}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="wordle-input-row">
            <input
              id="wordle-input"
              className="wordle-input"
              type="text"
              value={currentWord}
              disabled={isSubmitting || hasFinished}
              placeholder="enter guess"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void handleSubmit();
                }
              }}
              onChange={(e) =>
                setCurrentWord(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z]/g, "")
                    .slice(0, WORD_LENGTH),
                )
              }
            />
            <button
              id="wordle-submit"
              className="wordle-submit"
              onClick={() => void handleSubmit()}
              disabled={isSubmitting || hasFinished}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
