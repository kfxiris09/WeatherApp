const apiKey = '76ea5da0f8d973154cc78863a3403b9b';
const todayInfo = document.querySelector('.today-info');
const todayWeatherIcon = document.querySelector('.today-weather i');
const todayTemp = document.querySelector('.weather-temp');
const daysList = document.querySelector('.days-list');
const locationInput = document.getElementById("location-input");
const searchButton = document.getElementById("search-button");

// Mapping of weather condition codes to icon class names (Depending on Openweather Api Response)
const weatherIconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'sun',
    '02n': 'moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'cloud-lightning',
    '11n': 'cloud-lightning',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'water',
    '50n': 'water'
};

// Function to fetch weather data from the API based on the location
function fetchWeatherData(location) {
    // Construct the API URL with the location and API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    // Fetch weather data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Update today's info
            const countryCode = data.city.country;

            // Create an <img> element to display the flag
            const flagElement = document.createElement('img');
            flagElement.src = `https://flagcdn.com/16x12/${countryCode.toLowerCase()}.png`;
            flagElement.srcset = `
        https://flagcdn.com/32x24/${countryCode.toLowerCase()}.png 2x,
        https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png 3x
    `;
            flagElement.width = 16;
            flagElement.height = 12;
            flagElement.alt = countryCode;

            // Add the flag to the desired location in your HTML
            const flagContainer = document.querySelector('.flag-container');
            flagContainer.innerHTML = '';
            flagContainer.appendChild(flagElement);

            const todayWeather = data.list[0].weather[0].description;
            const todayTemperature = `${Math.round(data.list[0].main.temp)}°C`;
            const todayWeatherIconCode = data.list[0].weather[0].icon;
            const todayTempReal = `${Math.round(data.list[0].main.feels_like)}°C`;
            todayInfo.querySelector('h2').textContent = new Date().toLocaleDateString('en', { weekday: 'long' });
            todayInfo.querySelector('span').textContent = new Date().toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' });
            todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`;
            todayTemp.textContent = todayTemperature;

            // Update the <h4> element with the "feels like" temperature
            const feelsLikeElement = document.querySelector('.today-weather h4');
            feelsLikeElement.textContent = `but feels like: ${todayTempReal}`;

            // Update location and weather description in the "left-info" section
            const locationElement = document.querySelector('.today-info > div > span');
            locationElement.textContent = `${data.city.name}, ${data.city.country}`;

            const weatherDescriptionElement = document.querySelector('.today-weather > h3');
            weatherDescriptionElement.textContent = todayWeather;

            // Update today's info in the "day-info" section
            const todayPrecipitation = `${data.list[0].pop}%`;
            const todayHumidity = `${data.list[0].main.humidity}%`;
            const todayWindSpeed = `${data.list[0].wind.speed} km/h`;

            const dayInfoContainer = document.querySelector('.day-info');
            dayInfoContainer.innerHTML = `
                <div>
                    <span class="title">PRECIPITATION</span>
                    <span class="value">${todayPrecipitation}</span>
                </div>
                <div>
                    <span class="title">HUMIDITY</span>
                    <span class="value">${todayHumidity}</span>
                </div>
                <div>
                    <span class="title">WIND SPEED</span>
                    <span class="value">${todayWindSpeed}</span>
                </div>
            `;

            // Update next 4 days weather
            const today = new Date();
            const nextDaysData = data.list.slice(1);

            const uniqueDays = new Set();
            let count = 0;
            daysList.innerHTML = '';
            for (const dayData of nextDaysData) {
                const forecastDate = new Date(dayData.dt_txt);
                const dayAbbreviation = forecastDate.toLocaleDateString('en', { weekday: 'short' });
                const dayTemp = `${Math.round(dayData.main.temp)}°C`;
                const iconCode = dayData.weather[0].icon;

                // Ensure the day isn't duplicate and not today
                if (!uniqueDays.has(dayAbbreviation) && forecastDate.getDate() !== today.getDate()) {
                    uniqueDays.add(dayAbbreviation);
                    daysList.innerHTML += `
                        <li>
                            <i class='bx bx-${weatherIconMap[iconCode]}'></i>
                            <span>${dayAbbreviation}</span>
                            <span class="day-temp">${dayTemp}</span>
                        </li>
                    `;
                    count++;
                }

                // Stop after getting 5 distinct days
                if (count === 5) break;
            }
        })
        .catch(error => {
            alert(`Error fetching weather data: ${error} (Api Error)`);
        });
}

// Fetch weather data on document load for the default location (Viseu)
document.addEventListener('DOMContentLoaded', () => {
    const defaultLocation = 'Viseu';
    fetchWeatherData(defaultLocation);
});

// Event listener for the "Enter" key in the input field
locationInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        const location = locationInput.value;
        if (!location) return;
        fetchWeatherData(location);
        locationInput.value = "";
    }
});

const todayInfoText = todayInfo.querySelector('span');
const maxTextLength = 20; // Set the limit you consider "too long"

if (todayInfoText.textContent.length > maxTextLength) {
    todayInfoText.classList.add('center-if-long-text');
} else {
    todayInfoText.classList.remove('center-if-long-text');
}

// Event listener for the "search-button"
searchButton.addEventListener("click", () => {
    const location = locationInput.value;
    if (!location) return;
    fetchWeatherData(location);
    locationInput.value = "";
});

// Function to format a number as a string with at least two digits
function formatNumberWithTwoDigits(number) {
    return number < 10 ? `0${number}` : `${number}`;
}

// Function to update the current time with seconds
function updateCurrentTime() {
    const currentTimeElement = document.querySelector('.rightNowTime');
    const now = new Date();
    const hours = formatNumberWithTwoDigits(now.getHours());
    const minutes = formatNumberWithTwoDigits(now.getMinutes());
    const seconds = formatNumberWithTwoDigits(now.getSeconds());
    const currentTime = `${hours}:${minutes}:${seconds}`;
    currentTimeElement.textContent = currentTime;
}

// Call the function to initially set the current time
updateCurrentTime();

// Update the current time every second
setInterval(updateCurrentTime, 1000); // 1000 milliseconds = 1 second
