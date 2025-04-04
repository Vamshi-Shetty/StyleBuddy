"use client";

// Import statements
import React, { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi"; // For a send icon
import { motion } from "framer-motion"; // For animations

interface Message {
  sender: "user" | "bot";
  text: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Greet the user when they open the chat
    const greetUser = () => {
      const currentHour = new Date().getHours();
      let greeting = "Hello! I am Buddy, your personal fashion assistant. 👗✨";

      if (currentHour < 12) {
        greeting = "Good Morning! I am Buddy, your personal fashion assistant. 🌞👗";
      } else if (currentHour < 18) {
        greeting = "Good Afternoon! I am Buddy, your personal fashion assistant. 🌤️👠";
      } else {
        greeting = "Good Evening! I am Buddy, your personal fashion assistant. 🌙🕶️";
      }

      setMessages([{ sender: "bot", text: greeting }]);
    };

    greetUser();
  }, []);

  useEffect(() => {
    // Auto-scroll to the latest message
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Generate bot response based on user input
    generateBotResponse(input);

    setInput("");
  };

  const generateBotResponse = async (input: string) => {
    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const botResponse = getBotResponse(input);
    setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
  };

  const getBotResponse = (input: string) => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      return "Hello! How can I assist you with your fashion choices today? 👗✨";
    }
    if (lowerInput.includes("how are you")) {
      return "I'm feeling fabulous and ready to help you shine! 💃";
    }
    if (lowerInput.includes("outfit")) {
      return "Let’s find the perfect outfit for you! What’s the occasion? 🎉👠";
    }
    if (lowerInput.includes("weather")) {
      return "I can help you dress according to the weather! Is it sunny, rainy, or cold outside? ☀️🌧️❄️";
    }
    if (lowerInput.includes("joke")) {
      return "Why don't scientists trust atoms? Because they make up everything! 😆";
    }
    if (lowerInput.includes("thank you") || lowerInput.includes("thanks")) {
      return "You're welcome! Remember, confidence is the best outfit. Rock it! 😊👑";
    }
    if (lowerInput.includes("bye") || lowerInput.includes("goodbye")) {
      return "It was great chatting with you! Stay stylish! 👋✨";
    }
    // Default response
    return "I'm here to help you with all things fashion! Try asking me about outfits, trends, or styling tips. 👗✨";
  };

  return (
    <div className="flex flex-col h-screen bg-[#212121] text-white font-sans"> {/* Updated Background Color */}
      {/* Chat Header */}
      <div className="p-4 bg-gray-900 flex items-center justify-between shadow-md">
        <h1 className="text-xl font-bold">Buddy - Your Fashion Assistant</h1>
        <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-2xl">
          👗
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex flex-col flex-grow p-4 overflow-auto" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            className={`mb-2 p-3 rounded-lg max-w-xl ${
              msg.sender === "user"
                ? "bg-pink-500 self-end text-white"
                : "bg-gray-700 self-start text-white"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {msg.text}
          </motion.div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-gray-900 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 p-2 rounded-l-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="p-2 bg-pink-500 rounded-r-lg hover:bg-pink-600 transition-colors duration-200 flex items-center justify-center"
        >
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
