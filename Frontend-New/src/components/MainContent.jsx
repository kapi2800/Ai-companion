import { useState } from "react";
import AvatarSection from "./AvatarSection";
import ChatSection from "./ChatSection";
import "./MainContent.css";

const MainContent = ({ messages, onSendMessage }) => {
  const [currentMessage, setCurrentMessage] = useState("");

  return (
    <main className="main-content">
      <AvatarSection currentMessage={currentMessage} />
      <ChatSection
        messages={messages}
        currentMessage={currentMessage}
        onMessageChange={setCurrentMessage}
        onSendMessage={onSendMessage}
      />
    </main>
  );
};

export default MainContent;
