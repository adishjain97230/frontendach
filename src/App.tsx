// import Button from "./components/Button";
import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Chatbot from "./components/Chatbot";
import { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  return (
    <>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <main style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
          {/* editor / main app */}
        </main>
        <aside
          style={{
            width: 380,
            flexShrink: 0,
            borderLeft: "1px solid var(--border, #ccc)",
            overflow: "auto",
          }}
        >
          <Chatbot prompt={prompt} setPrompt={setPrompt} />
        </aside>
      </div>
    </>
  );
}

export default App;
