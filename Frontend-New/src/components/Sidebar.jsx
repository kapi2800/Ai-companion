import {
  Plus,
  MessageSquare,
  Moon,
  Sun,
  History,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import "./Sidebar.css";

const Sidebar = ({
  conversations,
  onNewChat,
  onSelectConversation,
  currentConversation,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <Sparkles size={24} />
          </div>
          <h1 className="logo-text">AI Companion</h1>
        </div>
        <button className="new-chat-btn" onClick={onNewChat}>
          <Plus size={20} />
          <span>New Chat</span>
        </button>
      </div>

      <div className="sidebar-content">
        <div className="history-header">
          <History size={16} />
          <span>Chat History</span>
        </div>
        <div className="conversations-list">
          {conversations.length === 0 ? (
            <div className="empty-state">
              <MessageSquare size={32} opacity={0.3} />
              <p>No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                className={`conversation-item ${
                  currentConversation === conv.id ? "active" : ""
                }`}
                onClick={() => onSelectConversation(conv.id)}
              >
                <MessageSquare size={18} />
                <div className="conversation-info">
                  <span className="conversation-title">{conv.title}</span>
                  <span className="conversation-time">{conv.timestamp}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
        </button>
        <div className="user-info">
          <div className="user-avatar">
            <span>S</span>
          </div>
          <div className="user-details">
            <span className="user-name">Student</span>
            <span className="user-status">Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
