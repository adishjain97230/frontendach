import { useState } from "react";
import { WORDLE_CHECK_WORD_URL, WORDLE_GET_WORD_URL } from "../constants/api";
import { useRef } from "react";

type GetWordResponse = {
  word_id: number;
};

type CheckWordResponse = {
  feedback: number[];
};

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
    value.feedback.every((item) => typeof item === "number")
  );
}

export default function WordlePage() {
  const [currentWord, setCurrentWord] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [feedbacks, setFeedbacks] = useState<number[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const targetWordIdRef = useRef<number | null>(null);

  const handleSubmit = async () => {
    if (currentWord.length !== 5) {
      setError("Please enter exactly 5 letters.");
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
    <>
      {error && <p role="alert">{error}</p>}
      <ul>
        {words.map((word) => (
          <li key={word}>{word}</li>
        ))}
      </ul>
      <ul>
        {feedbacks.map((feedback) => (
          <li key={feedback.join("")}>{feedback.join("")}</li>
        ))}
      </ul>
      <textarea
        id="wordle-input"
        value={currentWord}
        onChange={(e) =>
          setCurrentWord(
            e.target.value
              .toLowerCase()
              .replace(/[^a-z]/g, "")
              .slice(0, 5),
          )
        }
      ></textarea>
      <button id="wordle-submit" onClick={handleSubmit} disabled={isSubmitting}>
        Submit
      </button>
    </>
  );
}
