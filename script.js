const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your actual API key!
const recentLimit = 5;

// Theme Switcher
document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    themeToggle.addEventListener("click", toggleTheme);
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }
    loadRecentSearches();
});

// Show weather for city
async function showCity(cityInput = null) {
    const city = cityInput || document.getElementById('cityInput').value.trim();
    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    showLoading(true);
    clearResult();

    // OpenWeatherMap API
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('City not found. Please try again.');
        }
        const data = await response.json();

        // Weather details
        const temp = data.main.temp;
        const feels = data.main.feels_like;
        const desc = data.weather[0].description;
        const humidity = data.main.humidity;
        const wind = data.wind.speed;
        const country = data.sys.country;
        const icon = data.weather[0].icon;
        const timezone = data.timezone;

        // Get local time
        const localTime = getLocalTime(timezone);

        // Weather icon
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        // Display
        document.getElementById('result').innerHTML = `
            <div>
                <img class="weather-icon" src="${iconUrl}" alt="${desc}">
                <strong>${city}, ${country}</strong>
            </div>
            <div>Local Time: ${localTime}</div>
            <div>Temperature: ${temp}°C (Feels like: ${feels}°C)</div>
            <div>Description: ${desc}</div>
            <div>Humidity: ${humidity}%</div>
            <div>Wind Speed: ${wind} m/s</div>
        `;

        addRecentSearch(city);
    } catch (error) {
        showError(error.message || "An error occurred.");
    } finally {
        showLoading(false);
    }
}

// Get local time based on timezone offset (seconds)
function getLocalTime(offsetSeconds) {
    const utc = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    const local = new Date(utc + (offsetSeconds * 1000));
    return local.toLocaleString();
}

// Show loading spinner/message
function showLoading(show) {
    document.getElementById('loading').classList.toggle('hidden', !show);
}

// Show error message
function showError(msg) {
    document.getElementById('result').innerHTML = `<span style="color: red;">${msg}</span>`;
}

// Clear result
function clearResult() {
    document.getElementById('result').innerHTML = "";
}

// Recent Searches: Save to localStorage
function addRecentSearch(city) {
    let recents = JSON.parse(localStorage.getItem('recentCities') || "[]");
    city = city.trim();
    recents = recents.filter(c => c.toLowerCase() !== city.toLowerCase());
    recents.unshift(city);
    if (recents.length > recentLimit) recents = recents.slice(0, recentLimit);
    localStorage.setItem('recentCities', JSON.stringify(recents));
    loadRecentSearches();
}

// Load recent searches
function loadRecentSearches() {
    const recents = JSON.parse(localStorage.getItem('recentCities') || "[]");
    const list = document.getElementById('recentList');
    list.innerHTML = "";
    if (recents.length === 0) {
        document.getElementById('recent').style.display = "none";
        return;
    }
    document.getElementById('recent').style.display = "block";
    recents.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.onclick = () => {
            document.getElementById('cityInput').value = city;
            showCity(city);
        };
        list.appendChild(li);
    });
}

// Theme switcher
function toggleTheme() {
    document.body.classList.toggle("dark");
    const theme = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", theme);
}

// Allow Enter key to search
document.getElementById('cityInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        showCity();
    }
});
