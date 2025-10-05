# Quick Setup Guide

Complete setup instructions for the AI Avatar Companion project.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Modern web browser (Chrome, Firefox, Edge)
- Git (for cloning)

## Installation Steps

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd ai-avatar-companion
```

### 2. Setup Avatar Engine (Backend)

```bash
cd Backend
npm install
cp .env.example .env
# Edit .env if needed
npm run dev
```

The avatar engine will start on http://localhost:5173

### 3. Setup Frontend

Open a new terminal:

```bash
cd Frontend-New
npm install
cp .env.example .env
# Edit .env if needed
npm start
```

The frontend will start on http://localhost:3000

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

You should see:
- The AI avatar in the center
- Chat interface at the bottom
- Sidebar with conversation history
- Theme toggle

## Troubleshooting

### Avatar Not Loading

1. Check that Backend is running on port 5173
2. Check browser console for errors
3. Ensure CORS is not blocking iframe

### Port Already in Use

If port 3000 or 5173 is in use:

**Change Backend Port:**
```bash
# In Backend/.env
VITE_PORT=5174
```

**Change Frontend Port:**
```bash
# In Frontend-New/.env
VITE_PORT=3001
VITE_AVATAR_ENGINE_URL=http://localhost:5174
```

### Modules Not Found

Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Testing the Application

### Test Avatar Animation

1. The avatar should play a greeting animation on load
2. Click the "Disable" button in the top-right
3. Click "Enable" - avatar should greet again

### Test Chat

Try these questions:
- "What is photosynthesis?"
- "Explain calculus"
- "How to write an essay?"
- "Python programming help"

### Test Theme Switching

1. Click the theme toggle in the sidebar
2. Theme should switch between dark and light
3. Refresh page - theme should persist

## Production Build

### Build Frontend

```bash
cd Frontend-New
npm run build
# Output in dist/
```

### Build Avatar Engine

```bash
cd Backend
npm run build
# Output in dist/
```

## Environment Variables

### Backend (.env)
```
VITE_PORT=5173
VITE_AVATAR_MODEL_PATH=/models/646d9dcdc8a5f5bddbfac913.glb
VITE_MORPH_TARGET_SMOOTHING=0.5
VITE_HEAD_FOLLOW=true
```

### Frontend (.env)
```
VITE_PORT=3000
VITE_AVATAR_ENGINE_URL=http://localhost:5173
VITE_DEFAULT_THEME=light
```

## Development Tips

### Hot Reload

Both applications support hot module replacement (HMR). Changes to code will reflect immediately without full reload.

### Debugging

- Use browser DevTools console for errors
- React DevTools for component inspection
- Three.js Inspector for 3D scene debugging

### Adding New Animations

1. Export FBX animation file
2. Place in `Backend/public/animations/`
3. Import in `Avatar.jsx`:
   ```javascript
   const { animations: newAnimation } = useFBX("/animations/NewAnim.fbx");
   newAnimation[0].name = "NewAnim";
   ```
4. Add to animations array

## Next Steps

1. ✅ Complete local setup
2. Test all features
3. Review documentation in `docs/`
4. Explore code structure
5. Start customizing!

## Support

For issues or questions:
- Check `docs/ARCHITECTURE.md` for technical details
- Check `docs/API.md` for API specification
- Review component README files

## Quick Commands Reference

```bash
# Start everything
cd Backend && npm run dev &
cd Frontend-New && npm start

# Build everything
cd Backend && npm run build
cd Frontend-New && npm run build

# Clean install
rm -rf node_modules package-lock.json && npm install

# Audio processing
cd lipsync && node main.js
```

---

**Happy Coding!** 🚀
