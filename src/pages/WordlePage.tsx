import { useState } from "react";
import { WORDLE_CHECK_WORD_URL, WORDLE_GET_WORD_URL } from "../constants/api";
import { useRef } from "react";

export default function WordlePage() {
  const [currentWord, setCurrentWord] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [feedbacks, setFeedbacks] = useState<number[][]>([]);
  const targetWordIdRef = useRef<number | null>(null);

  const handleSubmit = async () => {
    if (currentWord.length !== 5) {
      return;
    } else {
      setWords((prev) => [...prev, currentWord]);
      setCurrentWord("");
      if (words.length === 0) {
        const word_response = await fetch(WORDLE_GET_WORD_URL, {
          method: "GET",
          headers: {},
        });
        if (!word_response.ok) {
          return;
        }
        const word_data = await word_response.json();
        targetWordIdRef.current = word_data.word_id;
      }

      const feedback_response = await fetch(WORDLE_CHECK_WORD_URL, {
        method: "POST",
        headers: {},
        body: JSON.stringify({
          word_id: targetWordIdRef.current,
          guess: currentWord,
          guess_number: words.length,
        }),
      });
      if (!feedback_response.ok) {
        return;
      }
      const feedback_data = await feedback_response.json();
      setFeedbacks((prev) => [...prev, feedback_data.feedback]);
      return;
    }
  };

  return (
    <>
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
      <button id="wordle-submit" onClick={handleSubmit}>
        Submit
      </button>
    </>
  );
}
