import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dots from "./images/dots.png";
import dog from "./images/dog.webp";
import aud from "./images/phone-call.png";
import Vid from "./images/video.png";
import axios from "axios";
import Cookies from "js-cookie";

const MsgDiv = () => {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = Cookies.get("token");
    console.log(token);
    if (!token) {
      navigate("/MsgDiv");
    } else {
      axios.get('http://localhost:5500/', { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          setUsers(response.data.All);
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    }
  }, [navigate]);

  return (
    <div className="chat-container">
      <div className="left-chat">
        <div className="nav">
          <nav>
            <h1>Keep in Touch</h1>
            <button id="set" onClick={() => setShowSettings(!showSettings)}>
              <img src={dots} alt="" width="40px" />
            </button>
          </nav>
        </div>
        <div className="list">
          <ul>
            {users.map((user, index) => (
              <li key={index} className="cont">
                <img src={dog} alt="" />
                <div className="name">
                  <span>{user.Username}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <hr />
        <div className="hiddensetings">
          {showSettings && (
            <ul>
              <li>
                <span>Create Group</span>
              </li>
              <hr />
              <li>Settings</li>
            </ul>
          )}
        </div>
      </div>
      <div className="right-chat">
        <div className="container">
          <div className="navR">
            <div className="prop">
              <div className="profIm">
                <img src={dog} alt="" id="prof" width="50px" />
              </div>
              <div className="name">
                <span>
                  <h2 id="name" color="black">
                    Subramani
                  </h2>
                </span>
              </div>
            </div>
          </div>
          <div className="contact">
            <button id="aud">
              <img src={aud} alt="" width="30px" />
            </button>
            <button id="vid">
              <img src={Vid} alt="" width="30px" />
            </button>
          </div>
        </div>
        <div className="input-container">
          <input
            type="text"
            className="input-field"
            id="messageInput"
            placeholder="Type a message..."
          />
          <button className="send-button">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MsgDiv;
