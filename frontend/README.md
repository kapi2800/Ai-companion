# Frontend - AI Avatar Companion

React application featuring a 3D avatar with AI chat capabilities, powered by Google Gemini API.

## Overview

This is the main application featuring an integrated 3D avatar, chat interface with Gemini AI, theme management, and conversation history.

## Features

- Modern, responsive UI design
- Dark/Light theme with persistent storage (localStorage)
- Real-time chat interface with AI responses
- Conversation history sidebar
- Avatar enable/disable controls
- Integrated 3D avatar rendering (Three.js)
- VISEME-based lip synchronization

## Tech Stack

- React 18
- Three.js & React Three Fiber
- @react-three/drei
- CSS3 with Custom Properties
- Lucide React (Icons)
- Vite (Build Tool)
- Leva (Debug Controls)

## Running Locally

```bash
npm install
npm run dev
```

Runs on http://localhost:5173

## Project Structure

```
src/
├── components/
│   ├── Avatar.jsx          # 3D avatar with VISEME lip-sync
│   ├── Experience.jsx      # Three.js scene setup
│   ├── Sidebar.jsx         # Navigation & history
│   ├── MainContent.jsx     # Main container
│   ├── AvatarSection.jsx   # Avatar container with Canvas
│   └── ChatSection.jsx     # Chat input interface
├── contexts/
│   └── ThemeContext.jsx    # Theme management
├── config/
│   └── api.js              # API configuration
├── App.jsx                 # Main app logic
├── App.css
├── index.css               # Global styles
└── main.jsx
```

## Key Components

### Avatar

- 3D model rendering (GLB format)
- VISEME-based lip synchronization
- Animation system (Idle, Greeting)
- Morph target control for facial expressions

### Experience

- Three.js scene configuration
- Camera and lighting setup
- Environment settings

### Sidebar

- Conversation history
- New chat button
- Theme toggle
- Avatar control toggle

### AvatarSection

- Three.js Canvas container
- Avatar component integration
- Enable/disable toggle
- Status indicator

### ChatSection

- Message input field
- AI response display
- Message history
- Send button

### ThemeContext

- Dark/Light mode state
- localStorage persistence
- Global theme provider

## Styling

Uses CSS custom properties for theming:

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
  --accent-primary: #6366f1;
  /* ... */
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  /* ... */
}
```

## API Integration

**Backend:** Google Gemini API via Express.js proxy
**Endpoint:** `https://cyphers101.onrender.com/api/chat`

**Configuration:** `src/config/api.js`

- Automatic retry logic
- Timeout handling (30 seconds)
- Error handling

**Note:** First request may take 30-60 seconds due to cold start (free tier hosting).

## 3D Avatar System

**Model:** ReadyPlayerMe GLB format
**Animations:** FBX files (Idle, Greeting)
**Lip Sync:** VISEME-based morph target animation
**Audio:** Pre-generated VISEME JSON with audio files

Location: `public/audios/` contains sample audio files with VISEME data.

## Development Tools

**Leva Controls** (Development Mode Only)

- Audio playback testing
- Animation debugging
- Morph target visualization
- Script selection (welcome, pizzas)

Access Leva controls by opening the app in development mode - controls appear in top-right corner.

## Future Enhancements

- WebSocket for real-time updates
- WebRTC video calls
- ElevenLabs TTS integration
- Voice input (Speech-to-Text)
- Multiple avatar selection
- Session recording
