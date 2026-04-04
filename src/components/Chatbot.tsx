import { useEffect, useRef, useState } from "react";
import { CHATBOT_CHAT_URL } from "../constants/api";
import {
  CHAT_ERROR_FETCH,
  CHAT_ERROR_INVALID,
  CHAT_ERROR_PARSE,
  CHAT_HISTORY_MAX_TURNS,
  PROMPT_MAX_LENGTH,
} from "../constants/chatbot";
import "./Chatbot.css";

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

const createChatTurn = (userPrompt: string, botResponse: string): ChatTurn => ({
  id: crypto.randomUUID(),
  prompt: userPrompt,
  response: botResponse,
});

/* ── Icons ──────────────────────────────────────────────────── */

const GearIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const PaperclipIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

/* ── Component ──────────────────────────────────────────────── */

const Chatbot = () => {
  const [isDark, setIsDark] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [chatTurns, setChatTurns] = useState<ChatTurn[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatTurns, currentPrompt]);

  const addTurn = (userPrompt: string, botResponse: string) => {
    setChatTurns((prev) => [...prev, createChatTurn(userPrompt, botResponse)]);
  };

  const handleSend = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    const userMessage = prompt;
    setPrompt("");
    setCurrentPrompt(userMessage);

    try {
      const response = await fetch(CHATBOT_CHAT_URL, {
        method: "POST",
        headers: {},
        body: JSON.stringify({
          prompt: userMessage,
          chat_history: chatTurns.slice(-CHAT_HISTORY_MAX_TURNS),
        }),
      });

      if (!response.ok) {
        addTurn(userMessage, CHAT_ERROR_FETCH);
        return;
      }

      let data: unknown;
      try {
        data = await response.json();
      } catch (error) {
        console.error(error);
        addTurn(userMessage, CHAT_ERROR_PARSE);
        return;
      }

      if (!isChatApiPayload(data)) {
        addTurn(userMessage, CHAT_ERROR_INVALID);
        return;
      }

      addTurn(userMessage, data.response);
    } catch (error) {
      console.error(error);
      addTurn(userMessage, CHAT_ERROR_FETCH);
    } finally {
      setCurrentPrompt("");
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasMessages = chatTurns.length > 0 || !!currentPrompt;

  return (
    <div className="chat-root" data-theme={isDark ? "dark" : "light"}>
      <div className="chat-card">
        {/* Header */}
        <header className="chat-header">
          <span className="chat-header-title">Aether Chat</span>
          <div className="chat-header-controls">
            <button className="icon-btn" aria-label="Settings">
              <GearIcon />
            </button>
            <div className="theme-toggle" role="group" aria-label="Theme">
              <button
                className={`theme-btn${!isDark ? " active" : ""}`}
                onClick={() => setIsDark(false)}
                aria-label="Light mode"
              >
                <SunIcon />
              </button>
              <button
                className={`theme-btn${isDark ? " active" : ""}`}
                onClick={() => setIsDark(true)}
                aria-label="Dark mode"
              >
                <MoonIcon />
              </button>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="messages-area">
          {!hasMessages && (
            <div className="empty-state">
              <div className="empty-state-icon">🧠</div>
              <p>Ask me anything to get started.</p>
            </div>
          )}

          {chatTurns.map((turn) => (
            <div key={turn.id} className="chat-turn">
              {/* User bubble */}
              <div className="bubble-row user">
                <div className="bubble">{turn.prompt}</div>
              </div>
              {/* Bot bubble */}
              <div className="bubble-row bot">
                <div className="avatar">🧠</div>
                <div className="bubble">{turn.response}</div>
              </div>
            </div>
          ))}

          {/* Pending user message + loading dots */}
          {currentPrompt && (
            <div className="chat-turn">
              <div className="bubble-row user">
                <div className="bubble">{currentPrompt}</div>
              </div>
              <div className="bubble-row bot">
                <div className="avatar">🧠</div>
                <div className="bubble">
                  <div className="loading-dots">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Char counter */}
        {prompt.length > 0 && (
          <div className="char-count">
            {prompt.length} / {PROMPT_MAX_LENGTH}
          </div>
        )}

        {/* Input bar */}
        <div className="input-bar">
          <div className="input-field">
            <button className="attach-btn" aria-label="Attach file" tabIndex={-1}>
              <PaperclipIcon />
            </button>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={PROMPT_MAX_LENGTH}
              placeholder="How can I help you?"
              aria-label="Message input"
            />
          </div>
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={isLoading || !prompt.trim()}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
