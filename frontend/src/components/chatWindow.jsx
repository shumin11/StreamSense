import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomParticles from "./CustomParticles";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./ChatWindow.css";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isChatStarted, setIsChatStarted] = useState(false);

  useEffect(() => {
    const sendInitialMessage = async () => {
      const initialMessage = { role: "user", content: "next month shows" };
      setMessages([initialMessage]);

      try {
        const response = await axios.post("http://localhost:5001/api/ai/query", {
          messages: [initialMessage],
        });

        const aiResponse = {
          role: "assistant",
          content: response.data.answer,
        };

        setMessages([initialMessage, aiResponse]);
      } catch (error) {
        console.error("Error:", error);
        const errorResponse = {
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try again.",
        };
        setMessages([initialMessage, errorResponse]);
      }
    };

    sendInitialMessage();
  }, []);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    if (!isChatStarted) {
      setIsChatStarted(true);
    }

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const response = await axios.post("http://localhost:5001/api/ai/query", {
        messages: updatedMessages,
      });

      const aiResponse = {
        role: "assistant",
        content: response.data.answer,
      };

      setMessages([...updatedMessages, aiResponse]);
    } catch (error) {
      console.error("Error:", error);
      const errorResponse = {
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again.",
      };
      setMessages([...updatedMessages, errorResponse]);
    }

    setInput("");
  };

  const renderMessage = (content) => {
    content = content.substring(
      content.indexOf("<div"),
      content.lastIndexOf("</div>") + "</div>".length
    );
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

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

        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask something..."
        />
        <div className="chatWindow">
          {messages
            .filter((msg) => msg.role === "assistant")
            .map((msg, index) => (
              <div key={index} className="aiMessage">
                {renderMessage(msg.content)}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
