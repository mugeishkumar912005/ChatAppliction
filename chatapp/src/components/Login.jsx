import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!Email || !Password) {
        setMsg("Fill in both Email and Password fields");
      } else {
        const response = await axios.post("http://localhost:5500/Login", {
          Email,
          Password,
        });
        if (response.status === 200) {
          const expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
          document.cookie = `token=${response.data.Token}; expires=${expires.toUTCString()}; path=/`;
          navigate('/MsgDiv');
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMsg("Invalid email or password. Please Sign up.");
      } else {
        console.error("Something went wrong:", error);
        setMsg("An unexpected error occurred. Please try again later.");
      }
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
        {Msg && (
          <div className="Msg-success">
            <span>{Msg}</span>
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
