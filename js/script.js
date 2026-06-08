
const userLocation = document.getElementById("userLocation");
converter = document.getElementById("converter");
weatherIcon = document.querySelector(".weatherIcon");
temperature = document.querySelector(".temperature");
feelsLike = document.querySelector(".feelsLike");
description = document.querySelector(".description");
date = document.querySelector(".date");
city = document.querySelector(".city");
HValue = document.getElementById("HValue");
WValue = document.getElementById("WValue");
SRValue = document.getElementById("SRValue");
SSValue = document.getElementById("SSValue");
CValue = document.getElementById("CValue");
UVValue = document.getElementById("UVValue");
PValue = document.getElementById("PValue");
Forecast = document.querySelector(".Forecast");

const WEATHER_API_ENDPOINT =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=23732823a6b2dc05d5398d4b85ab21c6&q=";

function findUserLocation() {
  fetch(WEATHER_API_ENDPOINT + userLocation.value)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod != 200) {
        alert(data.message);
        return;
      }

      console.log("current:", data);

      city.innerHTML = `${data.name}, ${data.sys.country}`;

      weatherIcon.style.background =
        `url(https://openweathermap.org/img/wn/${data.weather[0].icon}.png)`;
      weatherIcon.style.backgroundSize = "contain";
      weatherIcon.style.backgroundRepeat = "no-repeat";
      weatherIcon.style.backgroundPosition = "center";

      // FREE Forecast API (5‑day / 3‑hour)
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=23732823a6b2dc05d5398d4b85ab21c6&lat=${data.coord.lat}&lon=${data.coord.lon}`
      )
        .then((response) => response.json())
        .then((forecastData) => {
          console.log("forecast:", forecastData);

          const current = forecastData.list[0];

          const currentTemp = Math.round(current.main.temp);
          currentTempCelsius = current.main.temp;
          temperature.innerHTML = TemConverter(currentTempCelsius);


          feelsLike.innerHTML =
            `Feels like: ${Math.round(data.main.feels_like)}°C`;

          description.innerHTML =
            `<i class="fa-solid fa-cloud"></i> &nbsp; ${current.weather[0].description}`;
          const options = {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
          };

          date.innerHTML = getLongformatDateTime(
            data.dt,          // NOT data.sys.dt
            data.timezone,    // correct offset
            options
          );


          HValue.innerHTML =
            Math.round(data.main.humidity) + "<span>%</span>";
          WValue.innerHTML =
            Math.round(data.wind.speed) + "<span> m/s</span>";
          const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: "true" };

          // Correct timezone offset for current weather API
          const offset = data.timezone;

          // Sunrise (correct)
          SRValue.innerHTML = getLongformatDateTime(
            data.sys.sunrise,
            offset,
            timeOptions
          );

          // Sunset (correct)
          SSValue.innerHTML = getLongformatDateTime(
            data.sys.sunset,
            offset,
            timeOptions
          );

          // CLOUDS: sahi field
          // option 1: current se
          // CValue.innerHTML = data.clouds.all + "<span>%</span>";

          // option 2: forecast ke current item se
          CValue.innerHTML =
            Math.round(current.clouds.all) + "<span>%</span>";

          // UV INDEX: free current/forecast APIs me nahi milta
          UVValue.innerHTML = "N/A";

          PValue.innerHTML =
            Math.round(data.main.pressure) + "<span> hPa</span>";
          Forecast.innerHTML = "";

          const usedDates = new Set();

          forecastData.list.forEach(item => {

            const dt = new Date(item.dt * 1000);
            const dateKey = dt.toDateString();

            if (usedDates.has(dateKey)) return;

            usedDates.add(dateKey);

            const dateText = dt.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric"
            });

            const div = document.createElement("div");
            div.classList.add("forecast-card");

            div.innerHTML = `
    <p>${dateText}</p>
    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png">
    <p class="weather-desc">${item.weather[0].description}</p>
    <div class="temp">
      <span>${TemConverter(item.main.temp_min)}</span>&nbsp;&nbsp;
      <span>${TemConverter(item.main.temp_max)}</span>
    </div>
  `;

            Forecast.appendChild(div);
          });


        });
    })
    .catch((err) => {
      console.error(err);
      alert("Something went wrong!");
    });
}

function formatUnixTime(dtValue, offset, options = {}) {
  const date = new Date((dtValue + offset) * 1000);
  return date.toLocaleTimeString([], { timeZone: "UTC", ...options });
}

function getLongformatDateTime(dtValue, offset, options) {
  return formatUnixTime(dtValue, offset, options);
}

function TemConverter(temp) {
  let tempValue = Math.round(temp);
  let message = "";

  if (converter.value === "°C") {
    message = tempValue + "<span>°C</span>";
  } else {
    let ctof = Math.round((tempValue * 9) / 5 + 32);
    message = ctof + "<span>°F</span>";
  }

  return message;
}

