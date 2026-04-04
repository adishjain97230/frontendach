// import Button from "./components/Button";
import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Chatbot from "./components/Chatbot";

const layout = {
  shell: { display: "flex", height: "100vh", overflow: "hidden" },
  main: { flex: 1, minWidth: 0, overflow: "auto" },
  aside: {
    width: 380,
    flexShrink: 0,
    borderLeft: "1px solid var(--border, #ccc)",
    overflow: "auto",
  },
} as const;

function App() {
  return (
    <>
      <div style={layout.shell}>
        <main style={layout.main}>
          {/* editor / main app */}
        </main>
        <aside style={layout.aside}>
          <Chatbot />
        </aside>
      </div>
    </>
  );
}

export default App;
