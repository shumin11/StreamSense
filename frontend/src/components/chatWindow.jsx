import React, { useState } from "react";
import axios from "axios";
import CustomParticles from "./CustomParticles";
import "./ChatWindow.css";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isChatStarted, setIsChatStarted] = useState(false);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    if (!isChatStarted) {
      setIsChatStarted(true);
    }

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const response = await axios.post("http://localhost:5000/api/ai/chat", {
        messages: updatedMessages,
      });

      const aiResponse = {
        role: "assistant",
        content: response.data.choices[0].message.content,
      };

      setMessages([...updatedMessages, aiResponse]);
    } catch (error) {
      console.error("Error:", error);
    }

    setInput("");
  };

  if (!isChatStarted) {
    return (
      <>
        <CustomParticles />
        <div className="initialContainer">
          <div className="welcomeMessage">
            <header className="header">
              <img
                src="/images/logo.png"
                alt="StreamWise AI Logo"
                className="logo"
              />
            </header>
            <div className="titleContainer">
              <h2 className="appTitle">StreamAI</h2>
              <p className="appDescription">
                Your intelligent streaming companion for personalized
                recommendations and insights
              </p>
            </div>

            <h1 className="welcomeTitle">What can I help you with?</h1>
            <input
              className="initialInput"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask us something..."
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <CustomParticles />
      <div className="container">
        <header className="header">
          <img
            src="/images/logo.png"
            alt="StreamWise AI Logo"
            className="logo"
          />
        </header>
        <div className="chatWindow">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.role === "user" ? "userMessage" : "aiMessage"}
            >
              {msg.content}
            </div>
          ))}
        </div>
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask something..."
        />
      </div>
    </>
  );
};

export default ChatWindow;
