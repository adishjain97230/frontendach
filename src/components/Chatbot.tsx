import { useState } from "react";

interface ChatbotProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}

type ChatTurn = {
  prompt: string;
  response: string;
};

const Chatbot = ({ prompt, setPrompt }: ChatbotProps) => {
  const [chatTurns, setChatTurns] = useState<ChatTurn[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState("");

  const handleSend = async () => {
    if (!prompt.trim()) {
      setPrompt("");
      return;
    }
    const userMessage = prompt;
    setPrompt("");
    setCurrentPrompt(userMessage);

    let response: Response;
    try {
      response = await fetch(
        "http://13.236.109.109:8000/machine-learning/chatbot/chat/",
        {
          method: "POST",
          headers: {},
          body: JSON.stringify({
            prompt: userMessage,
            chat_history: chatTurns.slice(-10),
          }),
        },
      );
    } catch (error) {
      console.error(error);
      setCurrentPrompt("");
      setChatTurns([
        ...chatTurns,
        { prompt: userMessage, response: "Error fetching response..." },
      ]);
      return;
    }
    let data: any;
    try {
      data = await response.json();
    } catch (error) {
      console.error(error);
      setCurrentPrompt("");
      setChatTurns([
        ...chatTurns,
        { prompt: userMessage, response: "Error parsing response..." },
      ]);
      return;
    }

    if (
      data === null ||
      typeof data !== "object" ||
      !("response" in data) ||
      typeof (data as { response?: unknown }).response !== "string"
    ) {
      setCurrentPrompt("");
      setChatTurns([
        ...chatTurns,
        { prompt: userMessage, response: "Invalid response from server..." },
      ]);
      return;
    }

    setCurrentPrompt("");
    setChatTurns([
      ...chatTurns,
      { prompt: userMessage, response: data.response },
    ]);
  };

  return (
    <>
      {/* <label htmlFor="msg">Enter your prompt</label> */}
      <ul>
        {chatTurns.map((turn, i) => {
          return (
            <li key={i}>
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
        maxLength={2000}
        rows={3}
        placeholder="Type something.."
      />
      <p>{prompt.length} / 2000</p>
      <button type="button" className="btn btn-primary" onClick={handleSend}>
        Send
      </button>
    </>
  );
};

export default Chatbot;
