import { Lipsync } from "wawa-lipsync";

// Create lipsync manager
const lipsyncManager = new Lipsync();

// DOM elements
const audioFile = document.getElementById("audioFile");
const audioPlayer = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");
const exportBtn = document.getElementById("exportBtn");
const visemeDisplay = document.getElementById("visemeText");
const statusMessage = document.getElementById("statusMessage");
const mouthImage = document.getElementById("mouthImage");

let isConnected = false;
let animationFrameId = null;

// Variables for recording visemes with timestamps
let recordedMouthCues = [];
let isRecording = false;
let currentAudioFile = null;
let lastViseme = null;
let lastTimestamp = 0;

// Show status message
function showStatus(message, type = "info") {
  statusMessage.textContent = message;
  statusMessage.className = `status ${type}`;
  statusMessage.classList.remove("hidden");

  setTimeout(() => {
    statusMessage.classList.add("hidden");
  }, 3000);
}

// Preload all mouth images
const mouthImages = {};
const visemeLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'X'];
visemeLetters.forEach(letter => {
  const img = new Image();
  img.src = `mouths/${letter}.png`;
  mouthImages[letter] = img;
  img.onload = () => console.log(`✅ Preloaded: mouths/${letter}.png`);
  img.onerror = () => console.error(`❌ Failed to preload: mouths/${letter}.png`);
});

// Update mouth image based on viseme
function updateMouthImage(viseme) {
  // Make sure it's uppercase
  const visemeUpper = String(viseme).toUpperCase().trim();
  
  console.log("Viseme:", visemeUpper);

  // Use preloaded image if available, otherwise fallback to path
  if (mouthImages[visemeUpper] && mouthImages[visemeUpper].complete) {
    mouthImage.src = mouthImages[visemeUpper].src;
    console.log(`✅ Using preloaded image for ${visemeUpper}`);
  } else {
    // Fallback to direct path
    mouthImage.src = `mouths/${visemeUpper}.png`;
    console.log(`⚠️ Fallback path for ${visemeUpper}: mouths/${visemeUpper}.png`);
  }
}

// Function to export viseme data as JSON
function exportVisemeJSON() {
  if (recordedMouthCues.length === 0) {
    showStatus("⚠️ No viseme data to export. Please play the audio first.", "error");
    return;
  }

  const jsonData = {
    metadata: {
      soundFile: currentAudioFile || "audio.mp3",
      duration: parseFloat(audioPlayer.duration.toFixed(2))
    },
    mouthCues: recordedMouthCues.map(cue => ({
      start: parseFloat(cue.start.toFixed(2)),
      end: parseFloat(cue.end.toFixed(2)),
      value: cue.value
    }))
  };

  // Create blob and download
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "viseme-output.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showStatus("✅ Viseme JSON exported successfully!", "success");
  console.log("Exported JSON:", jsonData);
}

// Handle file selection
audioFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    currentAudioFile = file.name;
    const url = URL.createObjectURL(file);
    audioPlayer.src = url;

    // Wait for audio to be ready before connecting
    audioPlayer.addEventListener(
      "loadedmetadata",
      () => {
        try {
          lipsyncManager.connectAudio(audioPlayer);
          isConnected = true;
          playBtn.disabled = false;
          showStatus("✅ Audio file loaded successfully!", "success");
        } catch (error) {
          showStatus("❌ Error connecting audio: " + error.message, "error");
          console.error("Connection error:", error);
        }
      },
      { once: true }
    );
  }
});

// Animation loop with recording
function analyzeAudio() {
  if (!audioPlayer.paused) {
    lipsyncManager.processAudio();
    const viseme = lipsyncManager.viseme;
    const currentTime = audioPlayer.currentTime;

    console.log("Raw viseme from library:", viseme, "Type:", typeof viseme);

    // Update the text display
    visemeDisplay.textContent = viseme;

    // Update the mouth image
    updateMouthImage(viseme);

    // Record viseme with timestamp if recording
    if (isRecording) {
      const visemeUpper = String(viseme).toUpperCase().trim();
      const timestamp = currentTime;
      
      // If viseme changed or it's the first entry
      if (visemeUpper !== lastViseme) {
        // Close previous cue if exists
        if (lastViseme !== null && recordedMouthCues.length > 0) {
          recordedMouthCues[recordedMouthCues.length - 1].end = timestamp;
        }
        
        // Start new cue
        recordedMouthCues.push({
          start: timestamp,
          end: timestamp,
          value: visemeUpper
        });
        
        lastViseme = visemeUpper;
      } else {
        // Update end time of current cue
        if (recordedMouthCues.length > 0) {
          recordedMouthCues[recordedMouthCues.length - 1].end = timestamp;
        }
      }
      
      lastTimestamp = timestamp;
    }

    // Highlight active viseme in chart
    const visemeUpper = String(viseme).toUpperCase();
    document.querySelectorAll(".viseme-item").forEach((item) => {
      if (item.dataset.viseme === visemeUpper) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    animationFrameId = requestAnimationFrame(analyzeAudio);
  }
}

// Play button
playBtn.addEventListener("click", () => {
  if (isConnected) {
    // Start recording fresh if at beginning
    if (audioPlayer.currentTime === 0) {
      recordedMouthCues = [];
      lastViseme = null;
      lastTimestamp = 0;
      isRecording = true;
      exportBtn.disabled = true;
    } else {
      // Continue recording if resuming
      isRecording = true;
    }
    
    audioPlayer.play();
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    stopBtn.disabled = false;
    analyzeAudio();
    showStatus("🎵 Playing audio...", "info");
  }
});

// Pause button
pauseBtn.addEventListener("click", () => {
  audioPlayer.pause();
  isRecording = false;
  playBtn.disabled = false;
  pauseBtn.disabled = true;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  showStatus("⏸️ Audio paused", "info");
});

// Stop button
stopBtn.addEventListener("click", () => {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  isRecording = false;
  playBtn.disabled = false;
  pauseBtn.disabled = true;
  stopBtn.disabled = true;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  visemeDisplay.textContent = "X";
  updateMouthImage("X");
  document.querySelectorAll(".viseme-item").forEach((item) => {
    item.classList.remove("active");
  });
  document
    .querySelector('.viseme-item[data-viseme="X"]')
    .classList.add("active");
  showStatus("⏹️ Audio stopped", "info");
});

// Handle audio end
audioPlayer.addEventListener("ended", () => {
  isRecording = false;
  playBtn.disabled = false;
  pauseBtn.disabled = true;
  stopBtn.disabled = true;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  visemeDisplay.textContent = "X";
  updateMouthImage("X");
  document.querySelectorAll(".viseme-item").forEach((item) => {
    item.classList.remove("active");
  });
  document
    .querySelector('.viseme-item[data-viseme="X"]')
    .classList.add("active");
  
  // Enable export button
  if (recordedMouthCues.length > 0) {
    exportBtn.disabled = false;
    showStatus("✅ Audio finished! You can now export the viseme data.", "success");
  } else {
    showStatus("✅ Audio finished playing", "success");
  }
  
  console.log("Recorded mouth cues:", recordedMouthCues);
});

// Export button handler
exportBtn.addEventListener("click", exportVisemeJSON);

// Create viseme chart
const visemes = ["A", "B", "C", "D", "E", "F", "G", "H", "X"];
const visemeChart = document.getElementById("visemeChart");

visemes.forEach((viseme) => {
  const item = document.createElement("div");
  item.className = "viseme-item";
  item.dataset.viseme = viseme;
  item.innerHTML = `
        <span class="viseme-char">${viseme}</span>
        <span>${viseme === "X" ? "Rest" : "Viseme"}</span>
    `;
  if (viseme === "X") {
    item.classList.add("active");
  }
  visemeChart.appendChild(item);
});

// Initialize with neutral mouth
updateMouthImage("X");

console.log("Lipsync test platform initialized!");