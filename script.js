const API_KEY = 'af0e3f7ee3959bb01f3d2bd57999c1a0';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const weatherCard = document.getElementById('weatherCard');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weatherDescription');
const weatherIcon = document.getElementById('weatherIcon');
const humidity = document.getElementById('humidity');
const feelsLike = document.getElementById('feelsLike');
const windSpeed = document.getElementById('windSpeed');

searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

async function handleSearch() {
    const city = cityInput.value.trim();

    if (!city) {
        showError('Please enter a city name');
        return;
    }

    hideError();
    hideWeatherCard();
    showLoading();

    try {
        const weatherData = await fetchWeatherData(city);
        
        displayWeatherData(weatherData);
        hideLoading();
        showWeatherCard();
    } catch (error) {
        hideLoading();
        if (error.message === 'City not found') {
            showError('City not found. Please check the spelling and try again.');
        } else if (error.message === 'API key invalid') {
            showError('API key is invalid. Please check your configuration.');
        } else {
            showError('Unable to fetch weather data. Please try again later.');
        }
        console.error('Error:', error);
    }
}

async function fetchWeatherData(city) {
    try {
        const url = `${API_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
        console.log('Fetching weather data from:', url.replace(API_KEY, 'API_KEY_HIDDEN'));
        
        const response = await fetch(url);

        if (!response.ok) {
            console.error('Response status:', response.status);
            const errorData = await response.json().catch(() => ({}));
            console.error('Error details:', errorData);
            
            if (response.status === 404) {
                throw new Error('City not found');
            } else if (response.status === 401) {
                throw new Error('API key invalid - Please check your API key or wait 2 hours for activation');
            } else {
                throw new Error('Failed to fetch weather data');
            }
        }

        const data = await response.json();
        console.log('Weather data received:', data);
        return data;
    } catch (error) {
        throw error;
    }
}

function displayWeatherData(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;

    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;

    humidity.textContent = `${data.main.humidity}%`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
}

function showLoading() {
    loadingSpinner.classList.add('show');
}

function hideLoading() {
    loadingSpinner.classList.remove('show');
}

function showError(message) {
    errorMessage.querySelector('p').textContent = message;
    errorMessage.classList.add('show');
}

function hideError() {
    errorMessage.classList.remove('show');
}

function showWeatherCard() {
    weatherCard.classList.add('show');
}

function hideWeatherCard() {
    weatherCard.classList.remove('show');
}

function getWeatherEmoji(condition) {
    const weatherEmojis = {
        'clear': '☀️',
        'clouds': '☁️',
        'rain': '🌧️',
        'drizzle': '🌦️',
        'thunderstorm': '⛈️',
        'snow': '❄️',
        'mist': '🌫️',
        'smoke': '💨',
        'haze': '🌫️',
        'dust': '💨',
        'fog': '🌫️',
        'sand': '💨',
        'ash': '🌋',
        'squall': '💨',
        'tornado': '🌪️'
    };

    return weatherEmojis[condition.toLowerCase()] || '🌤️';
}
