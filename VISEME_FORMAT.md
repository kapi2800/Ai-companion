# VISEME Code Reference

## Overview

This document describes the VISEME code format used by the Avatar component for lip synchronization. The system uses single-letter codes (A-H, X) that map to Three.js morph target names on the 3D avatar model.

## Correct Format

The Avatar component uses **single letter codes** (A-H, X) which map to Three.js morph target names:

### Letter Code Mapping (from Avatar.jsx)

```javascript
const corresponding = {
  A: "viseme_PP", // Lips together (P, B, M sounds)
  B: "viseme_kk", // Tongue up (K, G sounds)
  C: "viseme_I", // Smile (EE, I sounds)
  D: "viseme_AA", // Open mouth (AH, A sounds)
  E: "viseme_O", // Rounded (O, OH sounds)
  F: "viseme_U", // Narrow (OO, U sounds)
  G: "viseme_FF", // Teeth on lip (F, V sounds)
  H: "viseme_TH", // Tongue between teeth (TH sounds)
  X: "viseme_PP", // Silence/neutral
};
```

## JSON File Format

VISEME JSON files must follow this structure:

```json
{
  "metadata": {
    "soundFile": "welcome.mp3",
    "duration": 5.92
  },
  "mouthCues": [
    {
      "start": 0,
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

**Important Notes:**

- The `value` field must contain a single letter code (A-H or X)
- Do NOT use full viseme names like "viseme_sil" or "viseme_DD"
- Times are in seconds
- The `mouthCues` array must be in chronological order

## Common Conversions

When generating VISEME files, use these conversions:

| Full Viseme Name          | Letter Code | Sound   |
| ------------------------- | ----------- | ------- |
| `viseme_sil`              | `X`         | Silence |
| `viseme_PP`               | `A`         | P, B, M |
| `viseme_kk`               | `B`         | K, G, N |
| `viseme_I`                | `C`         | EE, I   |
| `viseme_AA` / `viseme_aa` | `D`         | AH, A   |
| `viseme_O` / `viseme_E`   | `E`         | O, OH   |
| `viseme_U`                | `F`         | OO, U   |
| `viseme_FF`               | `G`         | F, V    |
| `viseme_TH`               | `H`         | TH      |
| `viseme_DD` / `viseme_nn` | `B`         | D, T, N |

## Sample Files

Example VISEME JSON files are located in `frontend/public/audios/`:

- `welcome.json` - Sample greeting audio with VISEME data
- `pizzas.json` - Sample conversation audio with VISEME data

Both files use the correct letter code format.

## Generating VISEME Data

The `tools/` directory contains utilities for generating VISEME data from audio files.

**Requirements:**

- Tool must output letter codes (A-H, X), not full viseme names
- JSON structure must match the format above
- Audio and JSON files must be placed in `frontend/public/audios/`

**Usage:**

```bash
cd tools
npm install
npm run dev
```

Upload an audio file through the web interface to generate the corresponding VISEME JSON file.

## Testing VISEME Synchronization

To test lip synchronization in development mode:

1. Start the application: `npm run dev` (from frontend directory)
2. Open http://localhost:5173 in your browser
3. Open browser console (F12)
4. Leva debug controls should appear in the top-right corner
5. Toggle "playAudio" to true
6. Select audio file in "script" dropdown (welcome or pizzas)
7. The avatar's mouth should synchronize with the audio

## Implementation Details

The Avatar component (`frontend/src/components/Avatar.jsx`) uses:

- `useFrame` hook for 60 FPS animation loop
- `THREE.MathUtils.lerp` for smooth morph target transitions
- `morphTargetInfluences` to control facial expressions
- Real-time lookup of VISEME codes based on audio playback time

## Common Issues

**Issue:** Avatar mouth doesn't move during audio playback

- **Cause:** JSON file contains full viseme names instead of letter codes
- **Solution:** Convert all `value` fields to letter codes (A-H, X)

**Issue:** Jerky or unnatural mouth movements

- **Cause:** Missing smooth interpolation
- **Solution:** Enable "smoothMorphTarget" in Leva controls

**Issue:** Mouth movements don't match audio timing

- **Cause:** Incorrect start/end timestamps in JSON
- **Solution:** Regenerate VISEME data using the tools

## Technical Reference

The letter code system is defined in `Avatar.jsx`:

```javascript
const corresponding = {
  A: "viseme_PP", // P, B, M sounds
  B: "viseme_kk", // K, G, N sounds
  C: "viseme_I", // EE, I sounds
  D: "viseme_AA", // AH, A sounds
  E: "viseme_O", // O, OH sounds
  F: "viseme_U", // OO, U sounds
  G: "viseme_FF", // F, V sounds
  H: "viseme_TH", // TH sounds
  X: "viseme_PP", // Silence/neutral
};
```

This mapping connects the simplified letter codes to the actual morph target names in the 3D avatar model.
