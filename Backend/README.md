# Avatar Engine

3D Avatar rendering system with real-time lip synchronization.

## Overview

This component handles all 3D avatar rendering, animation, and lip-sync processing. It runs as a standalone React Three Fiber application.

## Features

- 3D avatar rendering with Three.js
- VISEME-based lip synchronization
- Animation state management (Idle, Greeting)
- Real-time morph target updates
- Audio playback synchronization

## Tech Stack

- React Three Fiber
- Three.js
- @react-three/drei
- Vite

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
│   ├── Avatar.jsx       # Main avatar with lip-sync
│   └── Experience.jsx   # 3D scene setup
├── App.jsx
└── main.jsx

public/
├── models/              # GLB avatar files
├── animations/          # FBX animation files
├── audios/             # Audio & VISEME JSON
└── textures/           # Background images
```

## Key Files

- **Avatar.jsx** - Core avatar component with lip-sync engine
- **Experience.jsx** - Three.js scene configuration
- **public/audios/*.json** - VISEME mouth cue data

## VISEME System

Uses 15 standard mouth shapes for lip synchronization:
- A-H: Various vowel and consonant shapes
- I-U: Extended mouth positions
- X: Silence/neutral

## Animation System

- **Idle** - Default looping animation
- **Greeting** - Plays on load and re-enable
- Smooth transitions with fade-in/fade-out

## Configuration

See `.env.example` for configuration options.

## Integration

This component is embedded in the frontend via iframe:

```jsx
<iframe src="http://localhost:5173" />
```

Communication via postMessage API:
```javascript
window.postMessage('triggerGreeting', '*');
```

## Performance

- 60 FPS rendering
- <50ms lip-sync latency
- ~80MB memory usage
- Optimized morph target updates
