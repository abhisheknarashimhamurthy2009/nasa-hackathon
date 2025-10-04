// Replace with your OpenWeatherMap API key
const API_KEY = "588f98249cd0c755627b71759123e4b9";

// DOM elements
const cityName = document.getElementById("city-name");
const weatherIcon = document.querySelector(".weather-icon");
const metric = document.getElementById("metric");
const weatherMain = document.getElementById("weather-main");
const humidity = document.getElementById("humidity");
const feelsLike = document.getElementById("feels-like");
const tempMinToday = document.getElementById("temp-min-today");
const tempMaxToday = document.getElementById("temp-max-today");

// Detect current location
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showWeather, showError);
  } else {
    alert("Geolocation not supported by this browser.");
  }
};

// Fetch weather for current location
function showWeather(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  // Current weather
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      cityName.textContent = `${data.name}`;
      weatherMain.textContent = data.weather[0].main;
      metric.textContent = `${Math.round(data.main.temp)}°C`;
      humidity.textContent = data.main.humidity;
      feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;

      // Set weather icon
      const iconCode = data.weather[0].icon;
      weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    });

  // Forecast (6 days)
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      const forecastBox = document.getElementById("future-forecast-box");
      forecastBox.innerHTML = ""; // clear old forecast

      // Filter forecast to one entry per day (at noon)
      const daily = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 6);

      daily.forEach(day => {
        const date = new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" });
        const iconCode = day.weather[0].icon;
        const tempMin = Math.round(day.main.temp_min);
        const tempMax = Math.round(day.main.temp_max);

        forecastBox.innerHTML += `
          <div class="forecast-day">
            <h6>${date}</h6>
            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" />
            <p>${tempMin}° / ${tempMax}°</p>
          </div>
        `;
      });

      // Today min/max
      tempMinToday.textContent = `${Math.round(daily[0].main.temp_min)}°C`;
      tempMaxToday.textContent = `${Math.round(daily[0].main.temp_max)}°C`;
    });
}

// Error handler
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}