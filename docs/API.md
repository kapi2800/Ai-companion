# API Documentation

## Current Implementation

### Chat API Endpoint

The application currently uses a single REST API endpoint for AI chat functionality.

**Endpoint:** `https://cyphers101.onrender.com/api/chat`

**Method:** POST

**Request Format:**

```javascript
{
  "message": "User's message text",
  "generateAudio": false  // Optional, currently not implemented
}
```

**Response Format:**

```javascript
{
  "messages": [
    {
      "text": "AI response text",
      "role": "assistant"
    }
  ]
}
```

**Example Usage:**

```javascript
const response = await fetch("https://cyphers101.onrender.com/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: "What is photosynthesis?",
    generateAudio: false,
  }),
});

const data = await response.json();
const aiResponse = data.messages[0].text;
```

### Frontend API Configuration

Location: `frontend/src/config/api.js`

**Features:**

- Centralized API configuration
- Automatic retry logic (2 attempts)
- Timeout handling (30 seconds)
- Exponential backoff on retry
- Error handling and user-friendly messages

**Usage in Frontend:**

```javascript
import { sendChatMessage } from "./config/api.js";

try {
  const response = await sendChatMessage("Hello, how are you?");
  console.log(response);
} catch (error) {
  console.error("Chat failed:", error.message);
}
```

### AI Backend Details

**Technology:** Google Gemini API (gemini-1.5-flash model)

**Hosting:** Render.com (free tier)

**Important Notes:**

- First request may take 30-60 seconds due to cold start
- Subsequent requests typically respond in 1-3 seconds
- No authentication required
- No rate limiting implemented
- Stateless (no conversation history on server)

### Avatar Animation Control

The avatar is integrated directly into the React application (not iframe-based).

**State Management:**

```javascript
// In Avatar.jsx
const [animation, setAnimation] = useState("Idle");

// Trigger greeting
setAnimation("Greeting");
setTimeout(() => setAnimation("Idle"), 4000);
```

**Available Animations:**

- `Idle` - Default looping animation
- `Greeting` - Welcome gesture (4 seconds duration)

### VISEME Audio Playback

The avatar supports pre-recorded audio with VISEME-based lip synchronization.

**Audio File Format:**

- Audio: MP3, OGG, or WAV
- VISEME Data: JSON file with matching filename

**JSON Structure:**

```json
{
  "metadata": {
    "soundFile": "welcome.mp3",
    "duration": 5.92
  },
  "mouthCues": [
    {
      "start": 0.0,
      "end": 0.12,
      "value": "X"
    },
    {
      "start": 0.14,
      "end": 0.29,
      "value": "B"
    }
  ]
}
```

**VISEME Letter Codes:** A, B, C, D, E, F, G, H, X (silence)

**Location:** `frontend/public/audios/`

---

## Future API Specification

**Note:** The following endpoints and features are planned but NOT currently implemented.

### REST API Endpoints

#### 1. Companion Management

**GET /api/companions**

Fetch available AI companions with metadata.

```http
GET /api/companions
Accept: application/json
```

**Response:**

```json
{
  "companions": [
    {
      "id": "companion-001",
      "name": "Alex - Science Tutor",
      "avatarUrl": "https://cdn.readyplayer.me/...",
      "voiceId": "elevenlabs_voice_id",
      "specialties": ["Physics", "Chemistry", "Biology"],
      "metadata": {
        "personality": "Friendly and encouraging",
        "level": "High School to University"
      }
    }
  ]
}
```

**Status Codes:**

- 200: Success
- 500: Server error

---

#### 2. Video Room Management

**POST /api/video/rooms**

Create a new video chat room.

```http
POST /api/video/rooms
Content-Type: application/json

{
  "userId": "user-123",
  "companionId": "companion-001"
}
```

**Response:**

```json
{
  "roomId": "room-abc-123",
  "companionId": "companion-001",
  "userId": "user-123",
  "expiresAt": "2024-10-05T12:00:00Z",
  "status": "active"
}
```

---

**GET /api/video/rooms/:roomId**

Get room information and validate status.

```http
GET /api/video/rooms/room-abc-123
Accept: application/json
```

**Response:**

```json
{
  "roomId": "room-abc-123",
  "status": "active",
  "participants": ["user-123"],
  "companionId": "companion-001",
  "createdAt": "2024-10-05T11:00:00Z",
  "expiresAt": "2024-10-05T12:00:00Z"
}
```

---

#### 3. WebRTC Configuration

**GET /api/webrtc/config**

Get ICE server configuration for WebRTC.

```http
GET /api/webrtc/config
Accept: application/json
```

**Response:**

```json
{
  "iceServers": [
    {
      "urls": ["stun:stun.l.google.com:19302"]
    },
    {
      "urls": "turn:global.turn.twilio.com:3478",
      "username": "username",
      "credential": "password"
    }
  ],
  "iceTransportPolicy": "all"
}
```

---

#### 4. Chat Messages

**POST /api/chat/messages**

Send a chat message in a room.

```http
POST /api/chat/messages
Content-Type: application/json

{
  "roomId": "room-abc-123",
  "from": "user",
  "text": "What is photosynthesis?",
  "timestamp": "2024-10-05T11:30:00Z"
}
```

**Response:**

```json
{
  "messageId": "msg-001",
  "roomId": "room-abc-123",
  "from": "user",
  "text": "What is photosynthesis?",
  "timestamp": "2024-10-05T11:30:00Z",
  "status": "delivered"
}
```

---

#### 5. Recording Management (Optional)

**POST /api/video/recordings**

Upload a recorded session.

```http
POST /api/video/recordings
Content-Type: multipart/form-data

{
  "roomId": "room-abc-123",
  "videoFile": <binary data>
}
```

**Response:**

```json
{
  "recordingId": "rec-001",
  "roomId": "room-abc-123",
  "url": "https://cdn.example.com/recordings/rec-001.webm",
  "duration": 300,
  "size": 15728640
}
```

---

### WebSocket API (Socket.IO)

**Endpoint:** `ws://<host>/signal`

#### Events

**1. Join Room**

```javascript
socket.emit("join", {
  roomId: "room-abc-123",
  userId: "user-123",
  role: "user", // or 'companion'
});

// Server response
socket.on("joined", (data) => {
  // { roomId, userId, participants: [] }
});
```

**2. WebRTC Offer**

```javascript
socket.emit('offer', {
  roomId: 'room-abc-123',
  from: 'user-123',
  sdp: <SDP object>
});

// Receiver gets
socket.on('offer', (data) => {
  // { roomId, from, sdp }
});
```

**3. WebRTC Answer**

```javascript
socket.emit('answer', {
  roomId: 'room-abc-123',
  from: 'companion-001',
  sdp: <SDP object>
});

socket.on('answer', (data) => {
  // { roomId, from, sdp }
});
```

**4. ICE Candidate**

```javascript
socket.emit('candidate', {
  roomId: 'room-abc-123',
  from: 'user-123',
  candidate: <ICE candidate>
});

socket.on('candidate', (data) => {
  // { roomId, from, candidate }
});
```

**5. Leave Room**

```javascript
socket.emit("leave", {
  roomId: "room-abc-123",
  userId: "user-123",
});

socket.on("user-left", (data) => {
  // { roomId, userId }
});
```

**6. End Call**

```javascript
socket.emit("end", {
  roomId: "room-abc-123",
  reason: "User ended call",
});

socket.on("call-ended", (data) => {
  // { roomId, reason }
});
```

---

### Frontend Hooks API

#### useWebRTC Hook

**Purpose:** Manage WebRTC connections and media streams.

```typescript
interface UseWebRTCOptions {
  stunServers?: string[];
  turnServers?: TURNServer[];
}

interface UseWebRTCReturn {
  // Room Management
  createRoom(): Promise<{ roomId: string }>;
  joinRoom(roomId: string, role: "user" | "companion"): Promise<void>;

  // Media Management
  startLocalMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
  toggleMic(enabled: boolean): void;
  toggleCamera(enabled: boolean): void;

  // Recording
  startRecording(): void;
  stopRecording(): Promise<Blob>;

  // Call Management
  endCall(): Promise<void>;

  // State
  isConnected: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  connectionState: RTCPeerConnectionState;
}

// Usage
const webrtc = useWebRTC({
  stunServers: ["stun:stun.l.google.com:19302"],
});

await webrtc.createRoom();
await webrtc.startLocalMedia();
```

---

### Text-to-Speech API Integration

#### ElevenLabs TTS (Future)

```javascript
// Generate audio with VISEME data
async function generateSpeech(text, voiceId) {
  const response = await fetch(
    "https://api.elevenlabs.io/v1/text-to-speech/" + voiceId,
    {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    }
  );

  const audioBlob = await response.blob();

  // Process audio to generate VISEME data
  const visemeData = await generateVISEME(audioBlob);

  return { audioBlob, visemeData };
}
```

---

### AI Integration API

#### Google Gemini (Future)

```javascript
async function getAIResponse(message, context) {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: message,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    }
  );

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
```

---

## Current Error Handling

### Implemented Error Scenarios

**Timeout Errors:**

```javascript
// After 30 seconds
throw new Error("Request timed out. Please try again.");
```

**Network Errors:**

```javascript
// After 2 retry attempts
throw new Error(
  "Failed to connect to AI service. Please check your connection."
);
```

**HTTP Errors:**

```javascript
// Non-200 responses
throw new Error(`API error: ${response.status} ${response.statusText}`);
```

### Frontend Error Display

Errors are caught and displayed in the chat interface:

```javascript
try {
  const response = await sendChatMessage(input);
  // Handle success
} catch (error) {
  // Display error message to user in chat
  setMessages([
    ...messages,
    {
      role: "assistant",
      text: `Error: ${error.message}`,
    },
  ]);
}
```

---

## Future Enhancements

The following features are planned for future development:

### Rate Limiting (Planned)

- API request limits per user
- WebSocket message throttling
- File upload restrictions

### Authentication (Planned)

- JWT token-based authentication
- User account management
- Session handling

### Advanced Error Handling (Planned)

- Detailed error codes
- Structured error responses
- Retry strategies for different error types

### WebSocket Support (Planned)

- Real-time bidirectional communication
- WebRTC signaling for video calls
- Live status updates

### Additional Endpoints (Planned)

- Companion selection API
- Video room management
- Recording management
- TTS integration with ElevenLabs

---

## API Versioning

Current API: Unversioned endpoint at `/api/chat`

Future versions will implement proper versioning:

- `/api/v1/chat`
- `/api/v2/chat`

---

**Last Updated**: October 2025
**Status**: Current implementation documented. Future features clearly marked as planned.
