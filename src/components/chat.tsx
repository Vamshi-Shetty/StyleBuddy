"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Bot, User } from "lucide-react";
import Sidebar from "@/components/sidebar";

type Message = {
  content: string;
  isBot: boolean;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { content: input, isBot: false }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error("Request failed");
      
      const data = await response.json();
      setMessages((prev) => [...prev, { content: data.reply, isBot: true }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { content: "Sorry, I encountered an error. Please try again.", isBot: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex flex-col flex-1">
        {/* Chat messages container */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-800">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start mb-4 ${
                message.isBot ? "justify-start" : "justify-end"
              }`}
            >
              {message.isBot && (
                <Bot className="h-5 w-5 mt-1 text-green-400" />
              )}
              <div
                className={`max-w-lg px-4 py-2 rounded-lg shadow-md ${
                  message.isBot ? "bg-gray-700 ml-2" : "bg-blue-600 mr-2"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              {!message.isBot && (
                <User className="h-5 w-5 mt-1 text-blue-400" />
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 mb-4">
              <Bot className="h-5 w-5 mt-1 text-green-400" />
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <form onSubmit={handleSubmit} className="p-4 bg-gray-800">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send a message..."
              disabled={isLoading}
              className="flex-1 bg-gray-700 text-white border-none focus:ring-2 focus:ring-blue-500 rounded-lg py-2 px-3"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
