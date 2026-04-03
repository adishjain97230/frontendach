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
    if (!prompt.trim()) return;
    const userMessage = prompt;
    setCurrentPrompt(prompt);
    setPrompt("");
    console.log(prompt);
    const response = await fetch(
      "http://13.236.109.109:8000/machine-learning/chatbot/chat/",
      {
        method: "POST",
        headers: {},
        body: JSON.stringify({
          prompt: userMessage,
          chat_history: chatTurns,
        }),
      },
    );
    const data = await response.json();
    console.log(data);
    setCurrentPrompt("");
    setChatTurns([...chatTurns, { prompt: prompt, response: data.response }]);
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
        rows={3}
        placeholder="Type something.."
      />
      <button type="button" className="btn btn-primary" onClick={handleSend}>
        Send
      </button>
    </>
  );
};

export default Chatbot;
