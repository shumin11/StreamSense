import React, { useState } from "react";
import axios from "axios";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (input.trim() === "") return;

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

  return (
    <div style={styles.container}>
      <div style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={
              msg.role === "user" ? styles.userMessage : styles.aiMessage
            }
          >
            {msg.content}
          </div>
        ))}
      </div>
      <input
        style={styles.input}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Ask something..."
      />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "90vh",
    justifyContent: "center",
    alignItems: "center",
  },
  chatWindow: {
    width: "80%",
    height: "70%",
    border: "1px solid #ccc",
    padding: "10px",
    overflowY: "scroll",
    marginBottom: "10px",
  },
  userMessage: {
    textAlign: "right",
    margin: "5px",
    padding: "10px",
    backgroundColor: "#DCF8C6",
    borderRadius: "5px",
  },
  aiMessage: {
    textAlign: "left",
    margin: "5px",
    padding: "10px",
    backgroundColor: "#EAEAEA",
    borderRadius: "5px",
  },
  input: {
    width: "80%",
    padding: "10px",
  },
};

export default ChatWindow;
