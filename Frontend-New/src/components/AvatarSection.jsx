import { useState, useRef, useEffect } from "react";
import { VideoOff, Video } from "lucide-react";
import "./AvatarSection.css";

const AvatarSection = ({ currentMessage }) => {
  const [isAvatarActive, setIsAvatarActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef(null);
  const wasInactive = useRef(false);

  const toggleAvatar = () => {
    if (isAvatarActive) {
      // Avatar is being disabled
      wasInactive.current = true;
      setIsAvatarActive(false);
    } else {
      // Avatar is being re-enabled - show loading and trigger greeting
      setIsLoading(true);
      setIsAvatarActive(true);
      // Remove loading after greeting animation starts
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  useEffect(() => {
    // When avatar becomes active and was previously inactive, trigger greeting gesture
    if (isAvatarActive && wasInactive.current && iframeRef.current) {
      // Wait for iframe to load, then send message
      const timer = setTimeout(() => {
        try {
          iframeRef.current.contentWindow.postMessage("triggerGreeting", "*");
          wasInactive.current = false;
        } catch (error) {
          console.log("Could not send message to iframe:", error);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAvatarActive]);

  return (
    <section className="avatar-section">
      <div className="avatar-container">
        {isAvatarActive ? (
          <>
            <iframe
              ref={iframeRef}
              className="avatar-iframe"
              src="http://localhost:5173"
              title="AI Avatar"
            />
            {isLoading && (
              <div className="avatar-loading">
                <div className="loading-spinner"></div>
                <p>Waking up avatar...</p>
              </div>
            )}
          </>
        ) : (
          <div className="avatar-disabled">
            <div className="disabled-icon">
              <VideoOff size={80} strokeWidth={1.5} />
            </div>
            <h3>Avatar Disabled</h3>
            <p>Click the toggle switch to enable the AI avatar</p>
          </div>
        )}

        <div className="avatar-overlay">
          <div
            className={`status-indicator ${!isAvatarActive ? "inactive" : ""}`}
          >
            <span className="status-dot"></span>
            <span className="status-text">
              {isAvatarActive ? "AI Assistant Active" : "Avatar Stopped"}
            </span>
          </div>

          <button
            className={`avatar-toggle ${!isAvatarActive ? "inactive" : ""}`}
            onClick={toggleAvatar}
            title={isAvatarActive ? "Disable Avatar" : "Enable Avatar"}
          >
            {isAvatarActive ? <Video size={20} /> : <VideoOff size={20} />}
            <span>{isAvatarActive ? "Disable" : "Enable"}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AvatarSection;
