

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

      const windowOpacity = isDay ? 1 : 0.3; // adjust to your liking

   const el = document.getElementById("window-day");
   if (el) el.style.opacity = isDay ? 1 : 0;

    } catch (error) {
      console.error("Failed to fetch sunrise/sunset data:", error);
    }
  }

  applyDayNightOpacity();