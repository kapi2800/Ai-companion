# Frontend - AI Avatar Companion UI

Modern React application providing the user interface for the AI Avatar Companion platform.

## Overview

This is the main user-facing application featuring a chat interface, avatar controls, theme management, and conversation history.

## Features

- 🎨 Modern, responsive UI design
- 🌓 Dark/Light theme with persistent storage
- 💬 Real-time chat interface
- 📜 Conversation history sidebar
- 🎭 Avatar enable/disable controls
- 📱 Mobile-friendly design
- ⚡ Fast, smooth interactions

## Tech Stack

- React 18
- CSS3 with Custom Properties
- Lucide React (Icons)
- Vite
- Context API for state management

## Running Locally

```bash
npm install
npm start
```

Runs on http://localhost:3000

## Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx         # Navigation & history
│   ├── MainContent.jsx     # Main container
│   ├── AvatarSection.jsx   # Avatar embed & controls
│   └── ChatSection.jsx     # Chat UI
├── contexts/
│   └── ThemeContext.jsx    # Theme management
├── App.jsx                 # Main app logic
├── App.css
├── index.css               # Global styles
└── main.jsx

```

## Key Components

### Sidebar
- Conversation history
- New chat button
- Theme toggle
- User info

### AvatarSection
- Avatar iframe container
- Enable/disable toggle
- Status indicator
- Loading states

### ChatSection
- Message input
- AI response display
- Caption area
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

## Configuration

See `.env.example` for configuration options:
- Avatar engine URL
- API endpoints (future)
- Default theme

## AI Response System

Currently uses a built-in knowledge base for educational topics:
- Science (photosynthesis, gravity, DNA, etc.)
- Math (calculus, algebra, etc.)
- Programming (Python, JavaScript, etc.)
- Study tips and writing help

## Integration

Communicates with Avatar Engine via iframe postMessage:

```javascript
iframeRef.current.contentWindow.postMessage('triggerGreeting', '*');
```

## Future Enhancements

- WebRTC video calls
- Real-time AI integration (Gemini)
- Voice input
- Multiple avatar selection
- Recording functionality
