import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import { ThemeProvider } from "./contexts/ThemeContext";
import { sendChatMessage } from "./config/api";
import "./App.css";

function App() {
  const [conversations, setConversations] = useState([
    { id: 1, title: "Introduction to Calculus", timestamp: "2 hours ago" },
    { id: 2, title: "Python Programming Help", timestamp: "Yesterday" },
    { id: 3, title: "Essay Writing Tips", timestamp: "2 days ago" },
  ]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleNewChat = () => {
    setCurrentConversation(null);
    setMessages([]);
  };

  const handleSelectConversation = (conversationId) => {
    setCurrentConversation(conversationId);
    // Load messages for selected conversation
    setMessages([]);
  };

  const handleSendMessage = async (message) => {
    // Add user message immediately
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, newMessage]);

    // Add a "typing" indicator message
    const typingMessage = {
      id: Date.now() + 1,
      text: "Thinking...",
      sender: "ai",
      timestamp: new Date().toISOString(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      // Get AI response from deployed Gemini API
      const aiResponse = await sendChatMessage(message, false);

      // Replace typing indicator with actual response
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isTyping);
        return [
          ...filtered,
          {
            id: Date.now() + 2,
            text: aiResponse,
            sender: "ai",
            timestamp: new Date().toISOString(),
          },
        ];
      });
    } catch (error) {
      console.error("❌ Error getting AI response:", error);
      // Replace typing indicator with error message
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isTyping);
        return [
          ...filtered,
          {
            id: Date.now() + 2,
            text:
              error.message ||
              "Sorry, I encountered an error. Please try again.",
            sender: "ai",
            timestamp: new Date().toISOString(),
          },
        ];
      });
    }
  };

  return (
    <ThemeProvider>
      <div className="app">
        <Sidebar
          conversations={conversations}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          currentConversation={currentConversation}
        />
        <MainContent messages={messages} onSendMessage={handleSendMessage} />
      </div>
    </ThemeProvider>
  );
}

export default App;
