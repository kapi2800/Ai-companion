# API Documentation

## Current Implementation

### Frontend-to-Avatar Communication

The current system uses `postMessage` API for communication between the frontend and the avatar engine (iframe).

#### Message Protocol

**Trigger Greeting Animation**
```javascript
// From Frontend
iframeRef.current.contentWindow.postMessage('triggerGreeting', '*');

// In Avatar Engine
window.addEventListener('message', (event) => {
  if (event.data === 'triggerGreeting') {
    // Play greeting animation
    setAnimation("Greeting");
    setTimeout(() => setAnimation("Idle"), 4000);
  }
});
```

### AI Response Generator

**Function: `generateAIResponse(userMessage)`**

Takes user input and returns educational responses.

```javascript
const response = generateAIResponse("What is photosynthesis?");
// Returns: "Photosynthesis is the process by which..."
```

**Supported Topics:**
- Science (photosynthesis, gravity, DNA, cell)
- Math (calculus, algebra, Pythagorean theorem)
- Programming (Python, JavaScript, algorithms)
- History (World War, Renaissance)
- Writing (essays, grammar)
- Study skills (time management, study techniques)

---

## Future API Specification

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
socket.emit('join', {
  roomId: 'room-abc-123',
  userId: 'user-123',
  role: 'user' // or 'companion'
});

// Server response
socket.on('joined', (data) => {
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
socket.emit('leave', {
  roomId: 'room-abc-123',
  userId: 'user-123'
});

socket.on('user-left', (data) => {
  // { roomId, userId }
});
```

**6. End Call**
```javascript
socket.emit('end', {
  roomId: 'room-abc-123',
  reason: 'User ended call'
});

socket.on('call-ended', (data) => {
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
  joinRoom(roomId: string, role: 'user' | 'companion'): Promise<void>;
  
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
  stunServers: ['stun:stun.l.google.com:19302']
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
  const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5
      }
    })
  });
  
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
  const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GEMINI_API_KEY}`
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: message
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    })
  });
  
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
```

---

## Error Handling

### HTTP Error Codes

- **200 OK** - Request successful
- **201 Created** - Resource created
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **409 Conflict** - Resource conflict (e.g., room already exists)
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Server error
- **503 Service Unavailable** - Service temporarily unavailable

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_ROOM_ID",
    "message": "The specified room ID is invalid",
    "details": {
      "roomId": "invalid-room-123"
    }
  }
}
```

---

## Rate Limiting

### Limits (Future)

- **API Requests:** 100 requests/minute per user
- **WebSocket Messages:** 1000 messages/minute per room
- **File Uploads:** 10 uploads/hour per user

### Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1696512000
```

---

## Authentication (Future)

### JWT Token Authentication

```http
Authorization: Bearer <jwt_token>
```

### Token Structure

```json
{
  "userId": "user-123",
  "email": "user@example.com",
  "role": "student",
  "exp": 1696512000
}
```

---

## Versioning

API Version: **v1**

All endpoints are prefixed with `/api/v1/`

Future versions will use `/api/v2/`, etc.

---

**Last Updated**: October 2024
**Status**: Specification for Future Implementation
