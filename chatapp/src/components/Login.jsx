// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!Email || !Password) {
        setMsg("Fill in both Email and Password fields");
        return;
      }

      console.log("Login request: ", Email, Password); // Debug log

      const response = await axios.post("http://localhost:5500/Login", {
        Email,
        Password,
      });

      console.log("Login response:", response.data); // Debug log

      if (response.status === 200) {
        const data = response.data;
        if (data && data.message === "Login successful!") {
          setMsg("");
          const token = data.token;
          Cookies.set("JWT", token, { expires: 1 }); // Consider a more secure expiration
          console.log("JWT token:", token); // Debug log

          navigate("/MsgDiv", { state: { token } }); // Pass token as state
        } else {
          setMsg(data.message || "Login failed.");
        }
      } else {
        setMsg("An unexpected error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error.response.data);
      setMsg("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="Logdiv">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label>E-Mail:</label>
        <input
          type="text"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {msg && (
          <div className="Msg-success">
            <span>{msg}</span>
          </div>
        )}
        <button type="submit" id="Lbt">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
