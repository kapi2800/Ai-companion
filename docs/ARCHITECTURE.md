# Architecture Documentation

## System Overview

The AI Avatar Companion is a unified React application that integrates:

1. **Frontend UI** - React-based chat interface with sidebar navigation
2. **3D Avatar System** - Three.js/React Three Fiber integrated rendering
3. **Backend API** - Google Gemini AI hosted on Render
4. **Audio Tools** - Standalone VISEME generation utilities

## Component Architecture

### 1. Unified React Application (Port 5173)

```
┌────────────────────────────────────────────────────────────┐
│                  React Application (Vite)                  │
├────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌───────────────────────────────────┐   │
│  │   Sidebar    │  │       MainContent                 │   │
│  │              │  │  ┌─────────────────────────────┐  │   │
│  │ - History    │  │  │    AvatarSection            │  │   │
│  │ - New Chat   │  │  │  ┌───────────────────────┐  │  │   │
│  │ - Theme      │  │  │  │  Three.js Canvas      │  │  │   │
│  │ - Controls   │  │  │  │  - Avatar Component   │  │  │   │
│  │              │  │  │  │  - Experience Setup   │  │  │   │
│  │              │  │  │  └───────────────────────┘  │  │   │
│  │              │  │  └─────────────────────────────┘  │   │
│  │              │  │  ┌─────────────────────────────┐  │   │
│  │              │  │  │    ChatSection              │  │   │
│  │              │  │  │  - Message Display          │  │   │
│  │              │  │  │  - Input Field              │  │   │
│  │              │  │  └─────────────────────────────┘  │   │
│  └──────────────┘  └───────────────────────────────────┘   │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Theme Context                          │   │
│  │           (Dark/Light Management)                   │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

**Key Components:**

- `App.jsx` - Main application logic, message handling, AI integration
- `Sidebar.jsx` - Navigation, conversation history
- `AvatarSection.jsx` - 3D avatar container with Three.js Canvas
- `ChatSection.jsx` - Chat input and message display
- `ThemeContext.jsx` - Theme state management
- `config/api.js` - API configuration and request handling

**State Flow:**

```
User Input → App State → Components → UI Update
     ↓
Message Handler → Gemini API (Render) → AI Response → Update Messages
     ↓
Avatar State Management → Animation Updates
```

### 2. 3D Avatar System (Integrated)

```
┌────────────────────────────────────────┐
│       Three.js / R3F Scene             │
├────────────────────────────────────────┤
│  ┌──────────────────────────────────┐ │
│  │      Experience Component        │ │
│  │  - Scene Setup                   │ │
│  │  - Camera                        │ │
│  │  - Lighting                      │ │
│  │  - Environment                   │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │      Avatar Component            │ │
│  │  ┌────────────────────────────┐  │ │
│  │  │   3D Model (GLB)           │  │ │
│  │  │   - Mesh                   │  │ │
│  │  │   - Skeleton               │  │ │
│  │  │   - Morph Targets          │  │ │
│  │  └────────────────────────────┘  │ │
│  │                                   │ │
│  │  ┌────────────────────────────┐  │ │
│  │  │   Animation System         │  │ │
│  │  │   - Idle                   │  │ │
│  │  │   - Greeting               │  │ │
│  │  │   - State Machine          │  │ │
│  │  └────────────────────────────┘  │ │
│  │                                   │ │
│  │  ┌────────────────────────────┐  │ │
│  │  │   Lip-Sync Engine          │  │ │
│  │  │   - Audio Player           │  │ │
│  │  │   - VISEME Processor       │  │ │
│  │  │   - Morph Target Control   │  │ │
│  │  └────────────────────────────┘  │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

**Core Systems:**

#### a. Lip-Sync System

```javascript
Audio File → Frequency Analysis → Phoneme Detection
     ↓
VISEME Mapping → JSON Cue Points
     ↓
Frame Loop (60 FPS) → Current Time Check
     ↓
Morph Target Update → Smooth Interpolation (Lerp)
     ↓
Visual Output → Natural Lip Movement
```

#### b. Animation State Machine

```
Initial Load
     ↓
  Greeting (4s)
     ↓
  Idle (Loop) ←──┐
     ↓           │
Avatar Disabled  │
     ↓           │
Re-enabled       │
     ↓           │
  Greeting (4s)──┘
```

#### c. State Management

```
React Component State
     ↓
setAnimation("Greeting")
     ↓
Avatar Component Re-renders
     ↓
Animation Mixer Updates
     ↓
Visual Update (60 FPS)
```

## Data Flow Diagrams

### User Message Flow

```
┌──────────┐      ┌─────────┐      ┌──────────┐      ┌──────────┐
│   User   │─────→│  Input  │─────→│   App    │─────→│ Messages │
│  Types   │      │  Field  │      │  State   │      │  Array   │
└──────────┘      └─────────┘      └──────────┘      └──────────┘
                                          │
                                          ↓
                                    ┌──────────────┐
                                    │  Fetch API   │
                                    │  POST /chat  │
                                    └──────────────┘
                                          │
                                          ↓
                                    ┌──────────────┐
                                    │ Gemini API   │
                                    │  (Render)    │
                                    └──────────────┘
                                          │
                                          ↓
                                    ┌──────────────┐
                                    │ AI Response  │
                                    │   (JSON)     │
                                    └──────────────┘
                                          │
                                          ↓
                                    ┌──────────────┐
                                    │ Update       │
                                    │ Messages     │
                                    └──────────────┘
                                          │
                                          ↓
                                    ┌──────────────┐
                                    │  Render      │
                                    │   Chat       │
                                    └──────────────┘
```

### Lip-Sync Processing Flow

```
┌───────────────┐
│  Audio File   │
│  (.mp3/.ogg)  │
└───────┬───────┘
        │
        ↓
┌───────────────┐
│  Web Audio    │
│     API       │
│ (Frequency    │
│  Analysis)    │
└───────┬───────┘
        │
        ↓
┌───────────────┐
│   Phoneme     │
│  Detection    │
│ (rhubarb-     │
│  lipsync)     │
└───────┬───────┘
        │
        ↓
┌───────────────┐
│    VISEME     │
│   Mapping     │
│ (15 shapes)   │
└───────┬───────┘
        │
        ↓
┌───────────────┐
│  JSON Cues    │
│  {start, end, │
│   value}      │
└───────┬───────┘
        │
        ↓
┌───────────────┐
│  useFrame     │
│   Loop        │
│  (60 FPS)     │
└───────┬───────┘
        │
        ↓
┌───────────────┐
│ Morph Target  │
│   Update      │
│  (Lerp 0-1)   │
└───────┬───────┘
        │
        ↓
┌───────────────┐
│  3D Avatar    │
│    Render     │
└───────────────┘
```

## Technology Stack Details

### Frontend Stack

- **React 18.2.0** - UI framework
- **Vite 5.0.8** - Build tool and dev server
- **Lucide React 0.294.0** - Icon library
- **CSS3** - Styling with custom properties

### 3D Rendering Stack

- **Three.js** - WebGL 3D library
- **React Three Fiber 8.x** - React renderer for Three.js
- **@react-three/drei** - Helper components
- **@react-three/fiber** - Core R3F

### Audio Processing

- **Web Audio API** - Browser native audio playback
- **wawa-lipsync** - VISEME generation from audio files
- **Pre-generated VISEME JSON** - Timestamped mouth cue data

### Backend

- **Google Gemini API** - AI chat responses (gemini-1.5-flash)
- **Express.js** - Lightweight API proxy server
- **Render.com** - Free tier hosting (cold start delays)

## Performance Optimization

### Rendering Optimization

```javascript
// Frame rate management
useFrame(() => {
  // Only update changed morph targets
  // Use lerp for smooth transitions
  // Avoid unnecessary re-renders
});

// Memoization
const audio = useMemo(() => new Audio(path), [path]);
```

### Memory Management

- Proper cleanup in useEffect
- Dispose of Three.js resources
- Remove event listeners
- Clear timers

### State Optimization

- Context API for global state
- Local state for component-specific data
- Refs for values that don't trigger re-renders

## Security Considerations

### Current Implementation

- No authentication or authorization
- No sensitive data storage in browser
- API calls to public Gemini endpoint via proxy
- CORS enabled on backend
- No rate limiting
- Client-side state management only

### Production Considerations (Future)

- Environment variable management for API keys
- HTTPS enforcement
- Proper CORS configuration
- Input sanitization and validation
- Rate limiting and request throttling
- User authentication system
- Session management

## Deployment Architecture

### Current Development Setup

```
localhost:5173 (Vite Dev Server)
     │
     ├─ React Frontend
     ├─ Three.js 3D Avatar (integrated)
     └─ Fetches from → https://cyphers101.onrender.com/api/chat
                            │
                            └─ Express.js → Google Gemini API
```

### Current Production Architecture

```
┌─────────────────────────────────────────┐
│    Frontend (Development - Vite)        │
│    - React Application                  │
│    - Three.js Avatar (integrated)       │
│    - Chat Interface                     │
└─────────────────────────────────────────┘
              ↓ HTTPS
┌─────────────────────────────────────────┐
│    Backend API (Render.com)             │
│    - Express.js Server                  │
│    - Endpoint: /api/chat                │
└─────────────────────────────────────────┘
              ↓ HTTPS
┌─────────────────────────────────────────┐
│    Google Gemini API                    │
│    - gemini-1.5-flash model             │
│    - AI response generation             │
└─────────────────────────────────────────┘
```

### Future Production Architecture (Planned)

```
┌─────────────────────────────────────────┐
│         CDN (Static Assets)             │
│  - Avatar models (GLB)                  │
│  - Animations (FBX)                     │
│  - Textures                             │
│  - Audio files with VISEME JSON         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    Frontend (Vercel/Netlify)            │
│    - React Application                  │
│    - Integrated 3D Avatar               │
│    - Chat Interface                     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    Enhanced Backend API                 │
│    - User authentication                │
│    - Session management                 │
│    - WebSocket support                  │
│    - WebRTC signaling                   │
│    - Real-time TTS with VISEME          │
└─────────────────────────────────────────┘
```

## Future Enhancements

### Phase 1: Real-time Communication

- WebSocket server for live updates
- Real-time typing indicators
- Live connection status
- Message delivery confirmations

### Phase 2: WebRTC Video Integration

- WebSocket signaling server
- STUN/TURN server configuration
- Peer-to-peer video connections
- Media stream management

### Phase 3: Enhanced Backend

- User authentication and authorization
- Session management and persistence
- Rate limiting and abuse prevention
- Database integration (PostgreSQL/MongoDB)
- Redis for caching and sessions

### Phase 4: Advanced AI Features

- ElevenLabs TTS integration for dynamic audio
- Real-time VISEME generation from TTS
- Context-aware conversation memory
- Multiple AI personality options
- Voice input (Speech-to-Text)
- Emotion detection and response

## Scalability Considerations

### Horizontal Scaling

- Stateless frontend (can replicate)
- CDN for static assets
- Load balancer for API

### Vertical Scaling

- GPU acceleration for 3D rendering
- Web Workers for audio processing
- Service Workers for caching

### Monitoring

- Performance metrics
- Error tracking
- Usage analytics
- Resource monitoring

## Current System Limitations

- Backend hosted on free tier (30-60 second cold starts)
- No user authentication or authorization
- No persistent conversation history
- No real-time communication (HTTP polling only)
- Pre-generated VISEME data required (no real-time TTS)
- Single avatar model per session
- No mobile optimization
- Limited error recovery mechanisms

---

**Last Updated**: October 2025
**Version**: 1.0.0
**Status**: Current implementation accurately documented
