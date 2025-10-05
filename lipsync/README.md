# Audio Processing Tools

Utilities for generating VISEME data from audio files.

## Overview

This directory contains tools for converting audio files into VISEME (Visual Phoneme) JSON format for lip synchronization.

## Features

- Audio frequency analysis
- Phoneme detection
- VISEME code generation
- JSON export for avatar use

## Dependencies

```bash
npm install
```

Uses modified `wawa-lipsync` library for phoneme detection.

## Usage

```bash
node main.js
```

This will process audio files and generate corresponding `.json` files with VISEME cue data.

## Input Format

Supported audio formats:
- MP3
- OGG
- WAV

## Output Format

JSON file with VISEME mouth cues:

```json
{
  "metadata": {
    "soundFile": "audios/sample.ogg",
    "duration": 6.92
  },
  "mouthCues": [
    { "start": 0.00, "end": 0.04, "value": "X" },
    { "start": 0.04, "end": 0.26, "value": "F" },
    { "start": 0.26, "end": 0.33, "value": "C" },
    ...
  ]
}
```

## VISEME Codes

- A-H: Vowel and consonant shapes
- I-U: Extended mouth positions
- X: Silence/neutral

## Integration

Generated JSON files are used by the Avatar Engine for lip synchronization:

```javascript
const lipsync = JSON.parse(jsonFile);
// Use mouthCues for animation
```

## Future Enhancements

- Real-time processing
- Support for more audio formats
- Improved phoneme detection
- Web-based processing interface
