import { useState } from "react";
import { CHATBOT_CHAT_URL } from "../constants/api";
import {
  CHAT_ERROR_FETCH,
  CHAT_ERROR_INVALID,
  CHAT_ERROR_PARSE,
  CHAT_HISTORY_MAX_TURNS,
  PROMPT_MAX_LENGTH,
} from "../constants/chatbot";

type ChatApiPayload = {
  response: string;
};

const isChatApiPayload = (value: unknown): value is ChatApiPayload =>
  typeof value === "object" &&
  value !== null &&
  "response" in value &&
  typeof (value as { response?: unknown }).response === "string";

type ChatTurn = {
  id: string;
  prompt: string;
  response: string;
};

const Chatbot = () => {
  const [prompt, setPrompt] = useState("");
  const [chatTurns, setChatTurns] = useState<ChatTurn[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const createChatTurn = (userPrompt: string, botResponse: string): ChatTurn => ({
    id: crypto.randomUUID(),
    prompt: userPrompt,
    response: botResponse,
  });

  const handleSend = async () => {
    if (!prompt.trim()) {
      setPrompt("");
      return;
    }
    if (isLoading) return;
    setIsLoading(true);
    const userMessage = prompt;
    setPrompt("");
    setCurrentPrompt(userMessage);

    let response: Response;
    try {
      response = await fetch(CHATBOT_CHAT_URL, {
        method: "POST",
        headers: {},
        body: JSON.stringify({
          prompt: userMessage,
          chat_history: chatTurns.slice(-CHAT_HISTORY_MAX_TURNS),
        }),
      });
    } catch (error) {
      console.error(error);
      setCurrentPrompt("");
      setChatTurns((prev) => [
        ...prev,
        createChatTurn(userMessage, CHAT_ERROR_FETCH),
      ]);
      setIsLoading(false);
      return;
    }
    if (!response.ok) {
      setCurrentPrompt("");
      setChatTurns((prev) => [
        ...prev,
        createChatTurn(userMessage, CHAT_ERROR_FETCH),
      ]);
      setIsLoading(false);
      return;
    }
    let data: unknown;
    try {
      data = await response.json();
    } catch (error) {
      console.error(error);
      setCurrentPrompt("");
      setChatTurns((prev) => [
        ...prev,
        createChatTurn(userMessage, CHAT_ERROR_PARSE),
      ]);
      setIsLoading(false);
      return;
    }

    if (!isChatApiPayload(data)) {
      setCurrentPrompt("");
      setChatTurns((prev) => [
        ...prev,
        createChatTurn(userMessage, CHAT_ERROR_INVALID),
      ]);
      setIsLoading(false);
      return;
    }

    setCurrentPrompt("");
    setChatTurns((prev) => [
      ...prev,
      createChatTurn(userMessage, data.response),
    ]);
    setIsLoading(false);
  };

  return (
    <>
      {/* <label htmlFor="msg">Enter your prompt</label> */}
      <ul>
        {chatTurns.map((turn) => {
          return (
            <li key={turn.id}>
              <div>
                <strong>You:</strong> {turn.prompt}
              </div>
              <div>
                <strong>Bot:</strong> {turn.response}
              </div>
            </li>
          );
        })}
        {currentPrompt && (
          <li>
            <div>
              <strong>You:</strong> {currentPrompt}
            </div>
            <div>
              <strong>Bot:</strong>{" "}
              <span className="spinner-border spinner-border-sm"></span>
            </div>
          </li>
        )}
      </ul>
      <textarea
        id="msg"
        // type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        maxLength={PROMPT_MAX_LENGTH}
        rows={3}
        placeholder="Type something.."
      />
      <p>
        {prompt.length} / {PROMPT_MAX_LENGTH}
      </p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleSend}
        disabled={isLoading || !prompt.trim()}
      >
        {isLoading ? "Sending..." : "Send"}
      </button>
    </>
  );
};

export default Chatbot;
