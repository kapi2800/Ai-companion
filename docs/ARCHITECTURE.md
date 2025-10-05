# Architecture Documentation

## System Overview

The AI Avatar Companion platform consists of three main components:

1. **Frontend** - React-based UI for user interaction
2. **Avatar Engine** - 3D rendering and lip-sync system
3. **Tools** - Audio processing utilities

## Component Architecture

### 1. Frontend (Port 3000)

```
┌─────────────────────────────────────┐
│         React Application           │
├─────────────────────────────────────┤
│  ┌──────────────┐  ┌─────────────┐ │
│  │   Sidebar    │  │ MainContent │ │
│  │              │  │             │ │
│  │ - History    │  │ - Avatar    │ │
│  │ - New Chat   │  │ - Chat UI   │ │
│  │ - Theme      │  │             │ │
│  └──────────────┘  └─────────────┘ │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Theme Context           │   │
│  │  (Dark/Light Management)    │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Key Components:**
- `App.jsx` - Main application logic, message handling
- `Sidebar.jsx` - Navigation, conversation history
- `AvatarSection.jsx` - Avatar container with controls
- `ChatSection.jsx` - Chat input and message display
- `ThemeContext.jsx` - Theme state management

**State Flow:**
```
User Input → App State → Components → UI Update
     ↓
Message Handler → AI Response → Update Messages
     ↓
Avatar Control → postMessage → Avatar Engine
```

### 2. Avatar Engine (Port 5173)

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

#### c. Message Communication
```
Frontend (postMessage)
     ↓
window.addEventListener('message')
     ↓
Avatar Component Handler
     ↓
Animation State Change
     ↓
Visual Update
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
                                    ┌──────────┐
                                    │    AI    │
                                    │ Response │
                                    │Generator │
                                    └──────────┘
                                          │
                                          ↓
                                    ┌──────────┐
                                    │ Update   │
                                    │ Messages │
                                    └──────────┘
                                          │
                                          ↓
                                    ┌──────────┐
                                    │  Render  │
                                    │   Chat   │
                                    └──────────┘
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
- **Web Audio API** - Browser native
- **rhubarb-lip-sync** - Modified for VISEME generation
- **Custom frequency analyzer** - Optimized for real-time

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
- No sensitive data storage
- Client-side only processing
- No external API calls (yet)

### Future Considerations
- API key management (.env)
- HTTPS for production
- CORS configuration
- Input sanitization
- Rate limiting

## Deployment Architecture

### Development
```
localhost:3000 (Frontend) ←→ localhost:5173 (Avatar Engine)
```

### Production (Planned)
```
┌─────────────────────────────────────────┐
│         CDN (Static Assets)             │
│  - Avatar models                        │
│  - Animations                           │
│  - Textures                             │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    Frontend (Vercel/Netlify)            │
│    - React App                          │
│    - Avatar Engine iframe               │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    API Server (FastAPI - Future)        │
│    - Companion selection                │
│    - WebRTC signaling                   │
│    - AI responses                       │
└─────────────────────────────────────────┘
```

## Future Enhancements

### Phase 1: WebRTC Integration
- WebSocket signaling server
- STUN/TURN configuration
- Peer connection management
- Media stream handling

### Phase 2: Backend API
- FastAPI server
- Redis for caching
- PostgreSQL for data
- Authentication/Authorization

### Phase 3: AI Integration
- ElevenLabs TTS
- Google Gemini AI
- LangMem for context
- Real-time VISEME generation

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

---

**Last Updated**: October 2024
**Version**: 1.0.0
