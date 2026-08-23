import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { supabase } from "./supabase";
import "./style.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  async function signUp() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("注册成功");
      setUser(data.user);
    }
  }

  async function signIn() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("登录成功");
      setUser(data.user);
    }
  }

  async function saveUsername() {
  ...
}

async function createPost() {
  const { error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      content: content
    });

  if (error) {
    alert(error.message);
  } else {
    alert("发布成功");
    setContent("");
  }
}
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      username: username
    });

  if (error) {
    alert(error.message);
  } else {
    alert("昵称保存成功");
  }
}

return (
    <div className="app">
      <h1>一起分享</h1>

      {!user ? (
        <div className="card">
          <input
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="密码"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={signUp}>注册</button>
          <button onClick={signIn}>登录</button>
        </div>
      ) : (
       <div>
  <h2>欢迎回来</h2>
  <p>邮箱：{user.email}</p >

  <input
  placeholder="输入昵称"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>

  <button onClick={saveUsername}>
  保存昵称
</button>
</div> 
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
