import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
  const [text, setText] = useState("");

  return (
    <div className="app">
      <h1>一起分享</h1>

      <div className="card">
        <input
          placeholder="说点什么..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button>
          发布
        </button>
      </div>

      <p>欢迎来到一起分享社区</p >
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
