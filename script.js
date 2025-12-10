// DOM Elements
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');
const forecastContainer = document.getElementById('forecastContainer');
const unitToggle = document.getElementById('unitToggle');

// App State
let currentUnit = 'metric'; // 'metric' for Celsius, 'imperial' for Fahrenheit
let currentCity = '';

// API Configuration
const apiKey = '450609898ce58398cb1f85d37b5a632c'; // Replace with your OpenWeatherMap API key
const baseUrl = 'https://api.openweathermap.org/data/2.5';
const weatherUrl = `${baseUrl}/weather`;
const forecastUrl = `${baseUrl}/forecast`;

// Weather Icons Mapping
const weatherIcons = {
    '01d': 'wi-day-sunny',
    '01n': 'wi-night-clear',
    '02d': 'wi-day-cloudy',
    '02n': 'wi-night-cloudy',
    '03d': 'wi-cloud',
    '03n': 'wi-cloud',
    '04d': 'wi-cloudy',
    '04n': 'wi-cloudy',
    '09d': 'wi-rain',
    '09n': 'wi-rain',
    '10d': 'wi-day-rain',
    '10n': 'wi-night-rain',
    '11d': 'wi-thunderstorm',
    '11n': 'wi-thunderstorm',
    '13d': 'wi-snow',
    '13n': 'wi-snow',
    '50d': 'wi-fog',
    '50n': 'wi-fog'
};

// Get weather data from API
async function getWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    currentCity = city;
    
    try {
        // Show loading state
        weatherInfo.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Fetching weather data...</p>
            </div>
        `;
        
        // Get current weather
        const weatherResponse = await fetch(`${weatherUrl}?q=${city}&appid=${apiKey}&units=${currentUnit}`);
        const weatherData = await weatherResponse.json();

        if (weatherData.cod === '404') {
            showError('City not found. Please try another location.');
            return;
        }

        // Get forecast
        const forecastResponse = await fetch(`${forecastUrl}?q=${city}&appid=${apiKey}&units=${currentUnit}`);
        const forecastData = await forecastResponse.json();

        displayWeather(weatherData);
        displayForecast(forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError('Error fetching weather data. Please try again later.');
    }
}

// Toggle between Celsius and Fahrenheit
function toggleUnit() {
    currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
    unitToggle.textContent = currentUnit === 'metric' ? '°C | °F' : '°F | °C';
    if (currentCity) {
        getWeather();
    }
}

// Get unit symbol
function getUnitSymbol() {
    return currentUnit === 'metric' ? '°C' : '°F';
}

// Get speed unit
function getSpeedUnit() {
    return currentUnit === 'metric' ? 'm/s' : 'mph';
}

// Format date
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// Display 5-day forecast
function displayForecast(data) {
    if (!data || !data.list) {
        forecastContainer.innerHTML = '<p class="text-center text-muted">Forecast data not available</p>';
        return;
    }

    // Group forecast by day
    const dailyForecast = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyForecast[date]) {
            dailyForecast[date] = [];
        }
        dailyForecast[date].push(item);
    });

    // Get forecast for next 5 days
    const forecastDays = Object.entries(dailyForecast).slice(0, 6);
    
    let forecastHTML = '<h4 class="mt-4 mb-3">5-Day Forecast</h4><div class="row g-3">';
    
    forecastDays.forEach(([date, forecasts]) => {
        if (forecasts.length > 0) {
            const day = new Date(forecasts[0].dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
            const iconCode = forecasts[0].weather[0].icon;
            const iconClass = weatherIcons[iconCode] || 'wi-day-sunny';
            const tempMax = Math.round(Math.max(...forecasts.map(f => f.main.temp_max)));
            const tempMin = Math.round(Math.min(...forecasts.map(f => f.main.temp_min)));
            
            forecastHTML += `
                <div class="col-6 col-md-4 col-lg-2">
                    <div class="forecast-day card h-100">
                        <div class="card-body text-center">
                            <h6 class="card-subtitle mb-2">${day}</h6>
                            <i class="wi ${iconClass} weather-icon" style="font-size: 2rem;"></i>
                            <div class="mt-2">
                                <span class="fw-bold">${tempMax}°</span> / ${tempMin}°
                            </div>
                            <div class="small text-muted">${forecasts[0].weather[0].description}</div>
                        </div>
                    </div>
                </div>
            `;
        }
    });
    
    forecastHTML += '</div>';
    forecastContainer.innerHTML = forecastHTML;
}

// Display current weather data
function displayWeather(data) {
    const iconCode = data.weather[0].icon;
    const iconClass = weatherIcons[iconCode] || 'wi-day-sunny';
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const windSpeed = data.wind.speed.toFixed(1);
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const visibility = (data.visibility / 1000).toFixed(1); // Convert meters to km
    
    const weatherHTML = `
        <div class="weather-result">
            <div class="text-center">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h2 class="city-name mb-0">${data.name}, ${data.sys.country}</h2>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="unitToggleBtn" onchange="toggleUnit()">
                        <label class="form-check-label" for="unitToggleBtn" id="unitToggle">${getUnitSymbol()}</label>
                    </div>
                </div>
                
                <div class="d-flex justify-content-center align-items-center mb-3">
                    <i class="wi ${iconClass} weather-icon-large"></i>
                    <div class="ms-4 text-start">
                        <div class="temperature display-3 fw-bold">${temp}${getUnitSymbol()}</div>
                        <p class="weather-description text-capitalize mb-0">${data.weather[0].description}</p>
                        <div class="text-muted small">Feels like ${feelsLike}${getUnitSymbol()}</div>
                    </div>
                </div>
                
                <div class="additional-info bg-light p-3 rounded-3">
                    <div class="row g-3">
                        <div class="col-6 col-md-3">
                            <div class="info-item">
                                <span class="info-label"><i class="wi wi-humidity me-2"></i>Humidity</span>
                                <span class="info-value">${data.main.humidity}%</span>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="info-item">
                                <span class="info-label"><i class="wi wi-strong-wind me-2"></i>Wind</span>
                                <span class="info-value">${windSpeed} ${getSpeedUnit()}</span>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="info-item">
                                <span class="info-label"><i class="wi wi-barometer me-2"></i>Pressure</span>
                                <span class="info-value">${data.main.pressure} hPa</span>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="info-item">
                                <span class="info-label"><i class="wi wi-raindrop me-2"></i>Visibility</span>
                                <span class="info-value">${visibility} km</span>
                            </div>
                        </div>
                        <div class="col-6 col-md-6">
                            <div class="info-item">
                                <span class="info-label"><i class="wi wi-sunrise me-2"></i>Sunrise</span>
                                <span class="info-value">${sunrise}</span>
                            </div>
                        </div>
                        <div class="col-6 col-md-6">
                            <div class="info-item">
                                <span class="info-label"><i class="wi wi-sunset me-2"></i>Sunset</span>
                                <span class="info-value">${sunset}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    weatherInfo.innerHTML = weatherHTML;
}

// Show error message
function showError(message) {
    weatherInfo.innerHTML = `
        <div class="text-center py-5">
            <i class="wi wi-alert weather-icon" style="color: #e74c3c; font-size: 48px;"></i>
            <p class="mt-3 text-danger">${message}</p>
        </div>
    `;
}

// Allow searching with Enter key
cityInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});

// Initial load with default city (optional)
// getWeatherByCity('London');
