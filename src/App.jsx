import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import HomePage from "@/components/pages/HomePage";
import QuestionPage from "@/components/pages/QuestionPage";
import AskPage from "@/components/pages/AskPage";
import TagsPage from "@/components/pages/TagsPage";
import UsersPage from "@/components/pages/UsersPage";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/questions/:id" element={<QuestionPage />} />
        <Route path="/ask" element={<AskPage />} />
        <Route path="/tags" element={<TagsPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;