import React, { useState } from "react";
import axios from "axios";
const Sign = () => {
  const [Username, setName] = useState("");
  const [Phone_no, setPh] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPass] = useState("");
  const [conP, setP] = useState("");
  const [Msg, setMsg] = useState("");
  const [Log, setLog] = useState(false);

  const HandleSignup = async (e) => {
    e.preventDefault();
    try {
      if (!Username.trim() || !Phone_no.trim() || !Email.trim() || !Password.trim()) {
        setMsg("Please fill in all fields");
        return;
      } else if (Password !== conP) {
        setMsg("Passwords don't match");
        return;
      }

      const response = await axios.post("http://localhost:5500/AddUser", {
        Username,
        Phone_no,
        Email,
        Password,
      });

      if (response.status === 200) {
        setLog(true);
        setMsg("Added successfully!");
        setName("");
        setPh("");
        setEmail("");
        setPass("");
        setP("");
      } else {
        setMsg("Failed to add user");
      }
    } catch (error) {
      console.error("Error:", error);
      setMsg("Failed to add user");
    }
  };

  return (
    <>
      <div className="SignUpContainer">
        <div className="SignUp">
          <h2>Sign Up</h2>
          <form>
            <div className="Form">
              <label>Username:</label>
              <input
                value={Username}
                onChange={(e) => setName(e.target.value)}
                type="text"
                id="username"
                name="username"
              />
              <label>Phone_no:</label>
              <input
                value={Phone_no}
                onChange={(e) => setPh(e.target.value)}
                type="number"
                id="ph"
                name="username"
              />
              <label>Email:</label>
              <input
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                name="email"
              />
              <label>Password:</label>
              <input
                value={Password}
                onChange={(e) => setPass(e.target.value)}
                type="password"
                id="password"
                name="password"
              />
              <label>Confirm Password:</label>
              <input
                value={conP}
                onChange={(e) => setP(e.target.value)}
                type="password"
                id="confirmPassword"
                name="confirmPassword"
              />
              {Msg && <div className={Msg === "Added successfully!" ? "Msg-success1" : "Msg-success"}>{Msg}</div>}
              <button id="submit" onClick={HandleSignup}>
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Sign;
