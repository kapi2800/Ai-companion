import { Send, Sparkles } from "lucide-react";
import "./ChatSection.css";

const ChatSection = ({
  messages,
  currentMessage,
  onMessageChange,
  onSendMessage,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      onSendMessage(currentMessage);
      onMessageChange("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <section className="chat-section">
      {messages.length > 0 && (
        <div className="caption-display">
          <div className="caption-label">
            <Sparkles size={14} />
            <span>AI Response</span>
          </div>
          <div className="caption-text">
            {messages[messages.length - 1]?.text || "Waiting for response..."}
          </div>
        </div>
      )}

      <div className="chat-input-container">
        <form onSubmit={handleSubmit} className="chat-form">
          <div className="input-wrapper">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask me anything about your studies..."
              value={currentMessage}
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              type="submit"
              className="send-button"
              disabled={!currentMessage.trim()}
            >
              <Send size={20} />
            </button>
          </div>
          <div className="input-hint">
            Press <kbd>Enter</kbd> to send • <kbd>Shift + Enter</kbd> for new
            line
          </div>
        </form>
      </div>
    </section>
  );
};

export default ChatSection;
