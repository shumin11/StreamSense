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
  const renderPrice = () => {
    return (
      <table className="subscription-table">
        <tr>
          <th>Netflix</th>
          <th>Amazon Prime Video</th>
          <th>Disney+</th>
        </tr>
        <tr>
          <td>
            <div className="plan-name">Basic Plan</div>
            <div className="price">$6.99 USD / $7.99 CAD</div>
            <div className="features">Features: Ad-supported, Single device, HD quality</div>
            <div className="plan-name">Standard Plan</div>
            <div className="price">$15.49 USD / $16.49 CAD</div>
            <div className="features">Features: Ad-free, 2 devices, HD quality</div>
            <div className="plan-name">Premium Plan</div>
            <div className="price">$22.99 USD / $23.99 CAD</div>
            <div className="features">Features: Ad-free, 4 devices, 4K quality</div>
            <a href="https://netflix.com/signup" className="subscribe-btn" target="_blank" rel="noopener noreferrer">Subscribe Now</a>
          </td>
          <td>
            <div className="plan-name">Basic Plan</div>
            <div className="price">$8.99 USD / $9.99 CAD</div>
            <div className="features">Features: Ad-supported, Single device, HD quality</div>
            <div className="plan-name">Premium Plan</div>
            <div className="price">$14.99 USD / $16.99 CAD</div>
            <div className="features">Features: Ad-free, Unlimited devices, 4K quality, Free shipping</div>
            <a href="https://amazon.com/prime" className="subscribe-btn" target="_blank" rel="noopener noreferrer">Subscribe Now</a>
          </td>
          <td>
            <div className="plan-name">Basic Plan</div>
            <div className="price">$7.99 USD / $8.99 CAD</div>
            <div className="features">Features: Ad-supported, 4 devices, HD quality</div>
            <div className="plan-name">Standard Plan</div>
            <div className="price">$13.99 USD / $14.99 CAD</div>
            <div className="features">Features: Ad-free, 4 devices, 4K quality, HDR</div>
            <div className="plan-name">Premium Plan</div>
            <div className="price">$19.99 USD / $21.99 CAD</div>
            <div className="features">Features: Ad-free, 4 devices, 4K quality, HDR, Exclusive content</div>
            <a href="https://disneyplus.com" className="subscribe-btn" target="_blank" rel="noopener noreferrer">Subscribe Now</a>
          </td>
        </tr>
      </table>
    );
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
        <div className="price">
          {renderPrice()}
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
