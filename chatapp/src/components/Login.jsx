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
      console.log("Email:", Email);
      console.log("Password:", Password);
      if (!Email || !Password) {
        setMsg("Fill in both Email and Password fields");
      } else {
        const response = await axios.post("http://localhost:5500/Login", {
          Email: Email,
          Password: Password,
        });
  
        console.log("Login response:", response);
  
        if (response.status === 200) {
          if (response.data.message === "Login successful!") {
            setMsg("");
            const token = response.data.token;
            Cookies.set("token", token, { expires: 1 });
            console.log("Token cookie:", Cookies.get("token"));
            navigate("/MsgDiv");
          } else {
            setMsg(response.data.message || "Login failed.");
          }
        } else {
          setMsg("An unexpected error occurred. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Something went wrong:", error);
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
