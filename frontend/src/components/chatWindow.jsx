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

      try {
        const response = await axios.post("http://localhost:5001/api/ai/query", {
          messages: [initialMessage],
        });

        const aiResponse = {
          role: "assistant",
          content: response.data.data,
        };

        setMessages([aiResponse]);
      } catch (error) {
        console.error("Error:", error);
        const errorResponse = {
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try again.",
        };
        setMessages([errorResponse]);
      }
    };

    sendInitialMessage();
  }, []);

  const sendMessage = async () => {
    const inputBox = document.querySelector(".input");
    const input = inputBox ? inputBox.value : "";
    console.log("input", input);
    if (input.trim() === "") return;

    if (!isChatStarted) {
      setIsChatStarted(true);
    }

    const userMessage = { role: "user", content: input };
    const updatedMessages = [userMessage];
    setMessages(updatedMessages);

    try {
      const response = await axios.post("http://localhost:5001/api/ai/query", {
        messages: updatedMessages,
      });

      const aiResponse = {
        role: "assistant",
        content: response.data.data,
      };

      setMessages([aiResponse]);
    } catch (error) {
      console.error("Error:", error);
      const errorResponse = {
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again.",
      };
      // setMessages([errorResponse]);
    }

    setInput("");
  };

  const renderWindow = (content) => {
    console.log(content);
    const platforms = ["Netflix", "Disney+", "Amazon Prime Video"];
    return (
      <div className="platform-container">
        {platforms.map((platform) => {
          const platformShows = content.filter((show) => show.platform === platform);
          if (platformShows.length === 0) return null; // Skip rendering if no content for the platform
          return (
            <div key={platform} className="platform-column">
              <h2>📺 {platform}</h2>
              {platformShows.map((show) => (
                <div key={show.id} className="show">
                  <div className="show-title">🎬 {show.title}</div>
                  <div className="show-synopsis">{show.synopsis}</div>
                  <img
                    src={show.imageUrl}
                    alt={show.title}
                    width="200"
                    height="150"
                  />
                  <p>📅 Release Date: {show.releaseDate}</p>
                  <p>🎭 <strong>Genre:</strong> {show.genre}</p>
                  <p>👥 <strong>Cast:</strong> {show.cast}</p>
                  <a
                    href={show.resourceLink}
                    className="subscribe-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Subscribe Now
                  </a>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
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
        <div className="brand"><span>StreamWise AI</span>     <img
            src="/images/logo.png"
            alt="StreamWise AI Logo"
            className="logo"
          /></div>
        <div className="searchContainer">
        <input
          className="input"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Show name, platform, genre, date etc." 
        />
   
          </div>
        <div className="chatWindow">
          {messages
            .filter((msg) => msg.role === "assistant")
            .map((msg, index) => (
              <div key={index} className="aiMessage">
                {renderWindow(msg.content)}
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
