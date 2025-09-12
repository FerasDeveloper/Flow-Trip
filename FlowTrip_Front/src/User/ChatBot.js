import React, { useState } from "react";
import "./ChatBot.css";
import { baseURL, CHATBOT } from "../Api/Api";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { sender: "bot", type: "text", text: "Hello! How can I help you today? 😊" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", type: "text", text: input }]);
    const userMessage = input;
    setInput("");

    setIsLoading(true);

    try {
      const res = await fetch(`${baseURL}/${CHATBOT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage, lang: "ar" }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.source === "code-map") {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", type: "text", text: "🔄 You will be transferred to the technical department..." }
        ]);
      
        setTimeout(() => {
          window.open(`https://wa.me/+${data.code}`, "_blank");
        }, 2000);
      }
       else if (data.source === "local" || data.source === "gemini") {
        setMessages((prev) => [...prev, { sender: "bot", type: "text", text: data.answer }]);
      } else {
        setMessages((prev) => [...prev, { sender: "bot", type: "text", text: "❌ Unexpected response." }]);
      }

    } catch (err) {
      setIsLoading(false);
      setMessages((prev) => [...prev, { sender: "bot", type: "text", text: "⚠️ Error connecting to server." }]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">💬 Chat</div>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            <p>{msg.text}</p>
          </div>
        ))}

        {isLoading && (
          <div className="chat-message bot typing">
            <span></span><span></span><span></span>
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}