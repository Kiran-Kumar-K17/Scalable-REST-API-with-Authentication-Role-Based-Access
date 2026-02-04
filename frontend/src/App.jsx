import { useState, useEffect } from "react";
import "./App.css";
import Auth from "./components/Auth";
import Posts from "./components/Posts";
import Message from "./components/Message";
import AdminPanel from "./components/AdminPanel";

const API_BASE = "http://localhost:8000/api/v1";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    showMessage("Logged out successfully", "success");
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📝 Blog API Tester</h1>
        {token && (
          <div className="user-info">
            <span>Welcome, {user?.name || "User"}</span>
            <button onClick={handleLogout} className="btn btn-logout">
              Logout
            </button>
          </div>
        )}
      </header>

      <Message message={message} />

      <main className="main">
        {!token ? (
          <Auth
            apiBase={API_BASE}
            setToken={setToken}
            setUser={setUser}
            showMessage={showMessage}
          />
        ) : user?.role === "admin" ? (
          <AdminPanel
            apiBase={API_BASE}
            token={token}
            showMessage={showMessage}
          />
        ) : (
          <Posts
            apiBase={API_BASE}
            token={token}
            user={user}
            showMessage={showMessage}
          />
        )}
      </main>
    </div>
  );
}

export default App;
