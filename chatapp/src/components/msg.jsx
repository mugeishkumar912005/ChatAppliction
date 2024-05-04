import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import chatbg from './images/chatbg.jpg'
import phonecall from "./images/phonecall.png"
import video from"./images/video.png"
const MsgDiv = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const token = location.state?.token;

  useEffect(() => {
    if (!token) {
      navigate("/Home");
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5500/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setUsers(response.data.All);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [navigate, token]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchChatHistory(user._id);
  };

  const fetchChatHistory = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5500/recMsg/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(response.data.Msg);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!selectedUser || !newMessage.trim()) {
      console.warn('Please select a user and type a message');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5500/MsgSend/${selectedUser._id}`, {
        Msg: newMessage.trim(),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages([...messages, response.data.Msg]);
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  const lout=()=>{
    const loutM=axios.get("http://localhost:5500/Logout");
    if(loutM){
      navigate('/Home')
    }
  }
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="left-chat">
        <div className="nav">
          <nav>
            <h1>Keep in Touch</h1>
          </nav>
          <button id="set" onClick={() => setShowSettings(!showSettings)}>
              <img src="./images/dots.png" alt="" width="100px" />
            </button>
          <button id="logout" onClick={lout}>Logout</button>
        </div>
        <div className="list">
          <ul>
            {users.map((user, index) => (
              <li key={index} className={`cont ${selectedUser && selectedUser._id === user._id ? 'active' : ''}`} onClick={() => handleSelectUser(user)}>
                <img src="./images/dog.webp" alt="" />
                <div className="name">
                  <h3>{user.Username}</h3>
                  <h6>{user.Phone_no}</h6>
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
        {selectedUser ? (
          <div className="container">
            <div className="navR">
              <div className="prop">
                <div className="profIm">
                  {selectedUser.image}
                </div>
                <div className="name">
                  <span>
                    <h2>{selectedUser.Username}</h2>
                  </span>
                </div>
              </div>
              <div className="contact">
                <button><img src={phonecall} width="30px" alt="" className="cont"/></button>
                <button><img src={video} width="30px" alt="" className="cont"/></button>
              </div>
            </div>
            <div className="chat-box">
              <ul>
                {messages.map((message, index) => (
                  <li key={index} className={message.fromMe ? "you" : "other"}>
                    {message.content}
                  </li>
                ))}
              </ul>
            </div>
            <div className="input-container">
              <input
                type="text"
                className="input-field"
                id="messageInput"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button className="send-button" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="no-chat">Select a user to start chatting.</div>
        )}
      </div>
    </div>
  );
};

export default MsgDiv;
