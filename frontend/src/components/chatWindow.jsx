import React, { useState } from "react";
import axios from "axios";
import CustomParticles from "./CustomParticles";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
    // Check if the content contains HTML cards or tables
    
    content = content.substring(
      content.indexOf("<div"),
      content.lastIndexOf("</div>") + "</div>".length
    );
    console.log("Content:", content);
    // if (
    //   content.includes('<div class="show-card">') ||
    //   content.includes('<div class="price-card">') ||
    //   content.includes('<table class="subscription-table">') ||
    //   content.includes('<table class="show-table">')
    // ) {
       return <div dangerouslySetInnerHTML={{ __html: content }} />;
    // }



    // For regular markdown content
    return (
      <div className="threeColumnDiff">
      <div className="column">
        <h3>Column 1</h3>
        <img src="/images/image1.jpg" alt="Image 1" className="diffImage" />
        <img src="/images/image2.jpg" alt="Image 2" className="diffImage" />
      </div>
      <div className="column">
        <h3>Column 2</h3>
        <img src="/images/image3.jpg" alt="Image 3" className="diffImage" />
        <img src="/images/image4.jpg" alt="Image 4" className="diffImage" />
      </div>
      <div className="column">
        <h3>Column 3</h3>
        <img src="/images/image5.jpg" alt="Image 5" className="diffImage" />
        <img src="/images/image6.jpg" alt="Image 6" className="diffImage" />
      </div>
    </div>
    );
  };

  // if (!isChatStarted) {
  //   return (
  //     <>
  //       <CustomParticles />
  //       <div className="initialContainer">
  //         <div className="welcomeMessage">
  //           <header className="header">
  //             <img
  //               src="/images/logo.png"
  //               alt="StreamWise AI Logo"
  //               className="logo"
  //             />
  //           </header>
  //           <div className="titleContainer">
  //             <h2 className="appTitle">StreamWise AI</h2>
  //             <p className="appDescription">
  //               🎯 Save Money. 📺 Never Miss a Show. 💡 Smart Streaming
  //               Decisions.
  //             </p>
  //           </div>

  //           <h2 className="welcomeTitle">What can I help with?</h2>
  //           <input
  //             className="initialInput"
  //             value={input}
  //             onChange={(e) => setInput(e.target.value)}
  //             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
  //             placeholder="Ready to Stream Smarter? Ask me anything ..."
  //           />
  //         </div>
  //       </div>
  //     </>
  //   );
  // }

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
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.role === "user" ? "userMessage" : "aiMessage"}
            >
              {renderMessage(msg.content)}
            </div>
          ))}
        </div>

      </div>
    </>
  );
};

export default ChatWindow;
