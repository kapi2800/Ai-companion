import { useState, useRef, useEffect, createContext, useContext } from "react";
import { Canvas } from "@react-three/fiber";
import { VideoOff, Video } from "lucide-react";
import { Experience } from "./Experience";
import "./AvatarSection.css";

// Create context to communicate with Avatar component
export const AvatarControlContext = createContext();

const AvatarSection = () => {
  const [isAvatarActive, setIsAvatarActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [triggerGreeting, setTriggerGreeting] = useState(0);
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
    // When avatar becomes active and was previously inactive, trigger greeting
    if (isAvatarActive && wasInactive.current) {
      const timer = setTimeout(() => {
        setTriggerGreeting((prev) => prev + 1);
        wasInactive.current = false;
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAvatarActive]);

  return (
    <section className="avatar-section">
      <div className="avatar-container">
        {isAvatarActive ? (
          <AvatarControlContext.Provider value={{ triggerGreeting }}>
            <Canvas
              shadows
              camera={{ position: [0, 0, 8], fov: 42 }}
              className="avatar-canvas"
            >
              <color attach="background" args={["#ececec"]} />
              <Experience />
            </Canvas>
            {isLoading && (
              <div className="avatar-loading">
                <div className="loading-spinner"></div>
                <p>Waking up avatar...</p>
              </div>
            )}
          </AvatarControlContext.Provider>
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
