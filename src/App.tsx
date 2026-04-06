import { Navigate, Route, Routes } from "react-router-dom";
import ProjectsPage from "./pages/ProjectsPage";
import MLChatbotPage from "./pages/MLChatbotPage";
import WordleGame from "./pages/WordleGame";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProjectsPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/ml-chatbot" element={<MLChatbotPage />} />
      <Route path="/wordle" element={<WordleGame />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
