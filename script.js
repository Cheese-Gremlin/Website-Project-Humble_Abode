

 // Keep the copyright year current automatically
    document.getElementById('year').textContent = new Date().getFullYear();

// day/night
  async function applyDayNightOpacity() {
    try {
      const response = await fetch(
        "https://api.sunrise-sunset.org/json?lat=-36.85&lng=174.76&formatted=0"
      );
      const data = await response.json();

      // Parse sunrise and sunset as Date objects (returned in UTC)
      const sunrise = new Date(data.results.sunrise);
      const sunset = new Date(data.results.sunset);
      const now = new Date();

      const isDay = now >= sunrise && now <= sunset;
      console.log(isDay);
   const el = document.getElementById("window-day");
   if (el) el.style.opacity = isDay ? 1 : 0;

    } catch (error) {
      console.error("Failed to fetch sunrise/sunset data:", error);
    }
  }

  applyDayNightOpacity();



//music player

// --- Global variables ---
let currentIndex = 0;
let isPlaying = false;
let audio;

// --- Playlist ---
const playlist = [
      {
      title:  "Afternoon Nap - Stream Cafe",
      src:    "music/Afternoon_Nap-Stream_Cafe.mp3"
    },
    {
      title:  "Boba Date - Stream Cafe",
      src:    "music/Boba_Date-Stream_Cafe.mp3"
    },
    {
      title:  "Ocean Railway - Stream Cafe",
      src:    "music/Ocean_Railway-Stream_Cafe.mp3"
    },
    {
      title:  "Sweet Cafe - Stream Cafe",
      src:    "music/Sweet_Cafe-Stream_Cafe.mp3"
    }
];

const playImg  = "music/pause-play.png";
const pauseImg = "music/pause-play.png";

// --- Functions ---
function loadSong(index) {
  const track = playlist[index];
  audio.src = track.src;
  const songTitle = document.getElementById("song-title");
  if (songTitle) songTitle.textContent = track.title;
  const playPauseImg = document.getElementById("play-pause-img");
  if (playPauseImg) playPauseImg.src = playImg;
  isPlaying = false;
}

function togglePlayPause() {
  const playPauseImg = document.getElementById("play-pause-img");
  if (isPlaying) {
    audio.pause();
    if (playPauseImg) playPauseImg.src = playImg;
    isPlaying = false;
  } else {
    audio.play();
    if (playPauseImg) playPauseImg.src = pauseImg;
    isPlaying = true;
  }
}

function nextSong() {
  const playPauseImg = document.getElementById("play-pause-img");
  currentIndex = (currentIndex + 1) % playlist.length;
  loadSong(currentIndex);
  audio.play();
  if (playPauseImg) playPauseImg.src = pauseImg;
  isPlaying = true;
}

function prevSong() {
  const playPauseImg = document.getElementById("play-pause-img");
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentIndex);
  audio.play();
  if (playPauseImg) playPauseImg.src = pauseImg;
  isPlaying = true;
}

function setVolume(value) {
  audio.volume = Math.min(1, Math.max(0, value));
}



// --- Setup on page load ---
document.addEventListener("DOMContentLoaded", function () {
  audio = document.getElementById("audio-player");

  if (!audio) {
    audio = document.createElement("audio");
    audio.id = "audio-player";
    audio.style.display = "none";
    document.body.appendChild(audio);
  }

  audio.addEventListener("ended", nextSong);

  // Restore saved state
  const savedIndex  = sessionStorage.getItem("currentIndex");
  const savedTime   = sessionStorage.getItem("currentTime");
  const savedVolume = sessionStorage.getItem("volume");
  const wasPlaying  = sessionStorage.getItem("wasPlaying");

  if (savedIndex !== null) currentIndex = parseInt(savedIndex);

  loadSong(currentIndex);

  if (savedVolume !== null) {
    audio.volume = parseFloat(savedVolume);
    const slider = document.getElementById("volume-slider");
    if (slider) slider.value = savedVolume;
  }

  if (savedTime !== null) audio.currentTime = parseFloat(savedTime);

  if (wasPlaying === "true") {
    audio.play();
    const playPauseImg = document.getElementById("play-pause-img");
    if (playPauseImg) playPauseImg.src = pauseImg;
    isPlaying = true;
  }

  // Save state before leaving
  window.addEventListener("beforeunload", function () {
    sessionStorage.setItem("currentIndex", currentIndex);
    sessionStorage.setItem("currentTime", audio.currentTime);
    sessionStorage.setItem("wasPlaying", isPlaying);
    sessionStorage.setItem("volume", audio.volume);
  });

  // --- Custom volume slider ---
function initVolumeSlider() {
  const track     = document.getElementById("volume-track");
  const knob = document.getElementById("volume-knob-wrapper");
  const container = document.getElementById("volume-track-container");

  if (!track || !knob || !container) {
    console.log("volume elements not found");
    return;
  }

  console.log("volume slider init OK");

  let isDragging = false;

  function updateKnobPosition(volume) {
    knob.style.left = (volume * 100) + "%";
  }

  function getVolumeFromPosition(clientX) {
    const rect   = container.getBoundingClientRect();
    const offset = clientX - rect.left;
    const ratio  = Math.min(1, Math.max(0, offset / rect.width));
    return ratio;
  }

  container.addEventListener("mousedown", function (e) {
    console.log("mousedown on container");
    isDragging = true;
    const volume = getVolumeFromPosition(e.clientX);
    setVolume(volume);
    updateKnobPosition(volume);
    e.preventDefault();
  });

  knob.addEventListener("mousedown", function (e) {
    console.log("mousedown on knob");
    isDragging = true;
    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener("mousemove", function (e) {
    if (!isDragging) return;
    console.log("dragging");
    const volume = getVolumeFromPosition(e.clientX);
    setVolume(volume);
    updateKnobPosition(volume);
  });

  document.addEventListener("mouseup", function () {
    isDragging = false;
  });

  // set initial position
  const savedVolume = sessionStorage.getItem("volume");
  const startVolume = savedVolume !== null ? parseFloat(savedVolume) : 0.8;
  updateKnobPosition(startVolume);
}

initVolumeSlider()

});
