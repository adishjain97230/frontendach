import { useEffect, useRef, useState, type KeyboardEvent } from "react";
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

const SAMPLE_PROMPTS = [
  "hey man, i really need some help. i'm tryin to get 8500 bucks to fix up my truck and pay off some cards. i make about 3200 a month workin construction, been there for like 4 years now. i'm rentin a small place right now. you think they're gonna let me have the money for like 30 years?",
  "I got hit with a huge medical bill and need $12,000 as soon as possible. I've been at my current job for 12 years and make $95,000 a year. I own my home outright. Can I pay this back over 5 years?",
  "I'm looking to get a loan for $3,500 to buy some new equipment for my side business. I'm currently renting an apartment and my take-home pay is exactly $2,800 every month. I've been doing this for about 2 years. Is a 24-month plan okay for someone like me?",
  "Hi, I just started a new position 6 months ago making $55k annually. I'm trying to consolidate some debt, about $15,000 total. I have a mortgage on a condo. I'd prefer to spread the payments out over 36 months if possible. What do you think?",
];

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

const SendIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
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
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );
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

  const handleUseSamplePrompt = (samplePrompt: string) => {
    setPrompt(samplePrompt);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasMessages = chatTurns.length > 0 || !!currentPrompt;

  return (
    <div className="chat-root" data-theme={isDark ? "dark" : "light"}>
      <div className="chat-shell">
        <aside className="info-panel">
          <div className="info-content">
            <h1 className="info-title">Loan Assistant</h1>
            <p className="info-description">
              Get fast, easy-to-understand guidance on loans, eligibility,
              documentation, rates, repayment strategy, and credit readiness.
              Ask in plain language and get practical, actionable answers.
            </p>

            <h2 className="info-heading">How to use</h2>
            <ul className="info-list">
              <li>
                Share your context (income, goal, timeline, and location).
              </li>
              <li>Ask one focused question for better results.</li>
              <li>Use follow-up questions to refine recommendations.</li>
            </ul>

            <h2 className="info-heading">Try one of these prompts</h2>
            <div className="sample-prompts">
              {SAMPLE_PROMPTS.map((samplePrompt) => (
                <button
                  key={samplePrompt}
                  type="button"
                  className="prompt-chip"
                  onClick={() => handleUseSamplePrompt(samplePrompt)}
                >
                  {samplePrompt}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="chat-panel">
          <div className="chat-card">
            {/* Header */}
            <header className="chat-header">
              <span className="chat-header-title">Loan Chatbot</span>
              <div className="chat-header-controls">
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
                        <span />
                        <span />
                        <span />
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
                <input
                  ref={inputRef}
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
        </section>
      </div>
    </div>
  );
};

export default Chatbot;
