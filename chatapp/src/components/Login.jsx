import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Log, setLog] = useState(false);
  const [Msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!Email || !Password) {
        setMsg("Fill in both Email and Password fields");
      } else {
        const User= await axios.post("http://localhost:5500/Login", {
          Email,
          Password,
        });
        if (User.status === 200) {
          setLog(false);
          navigate('/MsgDiv');
        }
      }
    } catch (error) {
      if (error.response.status === 401) {
        setLog(true);
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
        {Log && (
          <div className="Msg-success">
            <span>{Msg}</span>
          </div>
        )}
        <button type="submit" id="Lbt" onClick={handleLogin}>
          Login 
        </button>
      </form>
    </div>
  );
};

export default Login;
