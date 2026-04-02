interface ChatbotProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}

const Chatbot = ({ prompt, setPrompt }: ChatbotProps) => {
  const handleSend = async () => {
    console.log(prompt);
    const response = await fetch(
      "http://13.236.109.109:8000/machine-learning/chatbot/chat/",
      {
        method: "POST",
        headers: {},
        body: JSON.stringify({
          "prompt": prompt,
        }),
      },
    );
    const data = await response.json();
    console.log(data);
  };
  return (
    <>
      {/* <label htmlFor="msg">Enter your prompt</label> */}
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
