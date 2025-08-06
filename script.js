async function showCity() {
    const city = document.getElementById('cityInput').value;
    const apiKey = '021ebbc03b60e4b3b2ff1dff34dd3846'; // Replace with your API key!
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        const temp = data.main.temp;
        const desc = data.weather[0].description;
        document.getElementById('result').textContent = 
            `Weather in ${city}: ${temp}°C, ${desc}`;
    } catch (error) {
        document.getElementById('result').textContent = error.message;
    }
}
