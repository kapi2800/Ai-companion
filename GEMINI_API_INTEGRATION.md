# Gemini AI API Integration

## Overview

The frontend chatbot now uses your deployed Gemini AI API hosted on Render for generating intelligent responses.

**API Endpoint:** `https://cyphers101.onrender.com/api/chat`

---

## Features

✅ **Real-time AI responses** powered by Google Gemini  
✅ **Automatic retry logic** with exponential backoff  
✅ **Timeout handling** (30 seconds max)  
✅ **Typing indicators** for better UX  
✅ **Error handling** with user-friendly messages  
✅ **JSON response parsing** with fallback to plain text

---

## Architecture

### Request Flow

```
User Input → Frontend → API Config → Gemini API (Render) → Response Parser → UI Update
```

### Files Modified

1. **`frontend/src/App.jsx`**

   - Replaced static responses with API calls
   - Added async handling for `handleSendMessage`
   - Integrated typing indicators

2. **`frontend/src/components/ChatSection.jsx`**

   - Added typing indicator UI
   - Disabled input during API processing
   - Dynamic status messages

3. **`frontend/src/components/ChatSection.css`**

   - Typing animation with bouncing dots
   - Smooth transitions

4. **`frontend/src/config/api.js`** (NEW)
   - Centralized API configuration
   - Retry logic with exponential backoff
   - Timeout handling
   - Response parsing utility

---

## API Request Format

```javascript
POST https://cyphers101.onrender.com/api/chat

Headers:
  Content-Type: application/json

Body:
{
  "message": "User's question here",
  "generateAudio": false
}
```

---

## API Response Format

### Success Response

```json
{
  "messages": [
    {
      "text": "AI response text or JSON wrapped response"
    }
  ]
}
```

### Parsed Output

The response parser handles two formats:

1. **Plain text response:**

   ```json
   {
     "messages": [{ "text": "Here is my answer..." }]
   }
   ```

2. **JSON-wrapped response:**
   ````json
   {
     "messages": [
       {
         "text": "```json\n[{\"text\":\"Response 1\"},{\"text\":\"Response 2\"}]\n```"
       }
     ]
   }
   ````

Both are automatically parsed and displayed correctly.

---

## Error Handling

### Timeout (30s)

```
"Request timed out. Please try again."
```

### Network Error

```
"Failed to connect to AI service. Please check your connection."
```

### API Error (4xx/5xx)

```
"API error: 500 Internal Server Error"
```

### Retry Logic

- **Max attempts:** 2
- **Backoff:** 1s, 2s (exponential)
- **Auto-retry** on network failures

---

## Configuration

Edit `/frontend/src/config/api.js` to modify:

```javascript
export const API_CONFIG = {
  CHAT_URL: "https://cyphers101.onrender.com/api/chat",
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 2,
};
```

---

## Testing

### Manual Test

1. Start frontend:

   ```bash
   cd frontend
   npm run dev
   ```

2. Open http://localhost:3000

3. Type a message and press Enter

4. Watch for:
   - ✅ Typing indicator appears
   - ✅ Input is disabled during processing
   - ✅ Response appears after 1-5 seconds
   - ✅ No console errors

### Test with Browser DevTools

```javascript
// Open browser console and test API directly
fetch("https://cyphers101.onrender.com/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: "What is photosynthesis?",
    generateAudio: false,
  }),
})
  .then((r) => r.json())
  .then((d) => console.log(d));
```

---

## User Experience Flow

1. **User types message** → Input enabled
2. **User presses Enter** → Message appears in chat
3. **Typing indicator shows** → "AI is thinking..." with animated dots
4. **API processes** (1-5 seconds typically)
5. **Response appears** → Typing indicator replaced with AI answer
6. **Input re-enabled** → User can send next message

---

## Performance Notes

### Cold Start (Render)

- First request may take **10-30 seconds** (Render spins up instance)
- Subsequent requests are fast (**1-3 seconds**)

### Optimization Tips

- Keep a browser tab open to prevent cold starts
- Consider upgrading Render plan for always-on instances
- Add warming endpoint that pings every 5 minutes

---

## Troubleshooting

### Issue: "Failed to connect to AI service"

**Possible causes:**

1. Render instance is sleeping (cold start)
2. API endpoint is down
3. Network/CORS issue

**Solutions:**

1. Wait 30 seconds and try again (cold start)
2. Check Render dashboard: https://dashboard.render.com/
3. Test API directly with curl:
   ```bash
   curl -X POST https://cyphers101.onrender.com/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"test","generateAudio":false}'
   ```

### Issue: Response is garbled or malformed

**Cause:** JSON parsing failed

**Solution:** Check response format in network tab (F12 → Network → Response)

### Issue: Typing indicator stuck

**Cause:** API request hung or failed silently

**Solution:** Refresh page. Check console for errors.

---

## Future Enhancements

Potential improvements:

1. **Conversation History**

   - Save chat history to localStorage
   - Load previous conversations

2. **Audio Responses**

   - Set `generateAudio: true` in API request
   - Play audio response through avatar

3. **Streaming Responses**

   - Real-time word-by-word display
   - Requires server-sent events (SSE)

4. **Context Awareness**

   - Send conversation history in API request
   - Multi-turn conversations

5. **Rate Limiting**
   - Prevent spam requests
   - Show cooldown timer

---

## API Backend (Reference)

Your deployed API is built with:

- **Google Gemini API** for AI responses
- **Node.js/Express** backend
- **Render** hosting platform

Check your backend code for more details on the implementation.

---

## Success Metrics

The integration is successful when:

✅ Messages send without errors  
✅ Responses appear within 5 seconds (after cold start)  
✅ Typing indicator works correctly  
✅ Error messages are clear and helpful  
✅ Multiple messages can be sent in succession  
✅ No console errors during normal operation

---

**Status:** ✅ Integration Complete

Test it now: Start your frontend and chat with the AI! 🚀
