import './style.css';
import CloudBolt from "./images/cloud-bolt-solid.svg";
import CloudMoonRain from "./images/cloud-moon-rain-solid.svg";
import CloudRain from "./images/cloud-rain-solid.svg";
import CloudShowersHeavy from "./images/cloud-showers-heavy-solid.svg";
import Cloud from "./images/cloud-solid.svg";
import CloudSunRain from "./images/cloud-sun-rain-solid.svg";
import CloudSun from "./images/cloud-sun-solid.svg";
import Moon from "./images/moon-solid.svg";
import Smog from "./images/smog-solid.svg";
import Sun from "./images/sun-solid.svg";
import TemperatureHalf from "./images/temperature-half-solid.svg";
import Wind from "./images/wind-solid.svg";

const API_KEY = "e4cb62eba5da1b0dd44ba86650e28ccc";
let currentTempUnit = "metric";
let otherTempUnit = "imperial";
let currentCity = "Bandung";

const container = document.createElement('div');

const mainInfoContainer = document.createElement('div');
const mainStatus = document.createElement('div');
const locationName = document.createElement('div');
const dateTime = document.createElement('div');
const mainTemp = document.createElement('div');
const changeTempUnit = document.createElement('button');
const mainIcon = document.createElement('img');
const formLocationContainer = document.createElement('div');
const formLocation = document.createElement("form");
const formLocationName = document.createElement("input");
const formLocatoinSubmit = document.createElement("button");
const locationNotFound = document.createElement('div');

const otherInfoContainer = document.createElement('div');
const feelsLikeContainer = document.createElement('div');
const feelsLikeText = document.createElement('div');
const feelsLikeValue = document.createElement('div');
const feelsLikeIcon = document.createElement('img');
const humidityContainer = document.createElement('div');
const humidityText = document.createElement('div');
const humidityValue = document.createElement('div');
const humidityIcon = document.createElement('img');
const windSpeedContainer = document.createElement('div');
const windSpeedText = document.createElement('div');
const windSpeedValue = document.createElement('div');
const windSpeedIcon = document.createElement('img');

const footer = document.createElement('div');

container.classList.add('container');
mainInfoContainer.classList.add('main-info-container');
mainStatus.classList.add('main-status');
locationName.classList.add('location-name');
dateTime.classList.add('date-time');
mainTemp.classList.add('main-temp');
changeTempUnit.classList.add('change-temp-unit');
mainIcon.classList.add('main-icon');
formLocationContainer.classList.add('form-location-container');
formLocation.classList.add('form-location');
formLocationName.classList.add('form-location-name');
formLocatoinSubmit.classList.add('form-location-submit');
locationNotFound.classList.add('location-not-found');

otherInfoContainer.classList.add('other-info-container');
feelsLikeContainer.classList.add('feelslike-container');
feelsLikeText.classList.add('feelslike-text');
feelsLikeValue.classList.add('feelslike-value');
feelsLikeIcon.classList.add('feelslike-icon');
humidityContainer.classList.add('humidity-container');
humidityText.classList.add('humidity-text');
humidityValue.classList.add('humidity-value');
humidityIcon.classList.add('humidity-icon');
windSpeedContainer.classList.add('windspeed-container');
windSpeedText.classList.add('windspeed-text');
windSpeedValue.classList.add('windspeed-value');
windSpeedIcon.classList.add('windspeed-icon');

footer.classList.add('footer');

mainIcon.src = Cloud;
locationName.textContent = currentCity;
changeTempUnit.textContent = `Display ${otherTempUnit}`;
formLocationName.placeholder = "Search Location...";
formLocatoinSubmit.textContent = "Search";
// locationNotFound.textContent = "Location not found. Search must be in the form of "City", "City, State" or "City, Country"."

feelsLikeIcon.src = TemperatureHalf;
feelsLikeText.textContent = "Feels Like";
humidityIcon.src = Smog;
humidityText.textContent = "Humidity";
windSpeedIcon.src = Wind;
windSpeedText.textContent = "Wind Speed ";

footer.innerHTML = "By yours truly, &nbsp; <a href='https://github.com/mraffia'> mraffia</a>";

mainInfoContainer.appendChild(mainStatus);
mainInfoContainer.appendChild(locationName);
mainInfoContainer.appendChild(dateTime);
mainInfoContainer.appendChild(mainTemp);
mainInfoContainer.appendChild(changeTempUnit);
mainInfoContainer.appendChild(mainIcon);
formLocationContainer.appendChild(formLocation);
formLocationContainer.appendChild(formLocationName);
formLocationContainer.appendChild(formLocatoinSubmit);
mainInfoContainer.appendChild(formLocationContainer);
mainInfoContainer.appendChild(locationNotFound);

feelsLikeContainer.appendChild(feelsLikeIcon);
feelsLikeContainer.appendChild(feelsLikeText);
feelsLikeContainer.appendChild(feelsLikeValue);
humidityContainer.appendChild(humidityIcon);
humidityContainer.appendChild(humidityText);
humidityContainer.appendChild(humidityValue);
windSpeedContainer.appendChild(windSpeedIcon);
windSpeedContainer.appendChild(windSpeedText);
windSpeedContainer.appendChild(windSpeedValue);
otherInfoContainer.appendChild(feelsLikeContainer);
otherInfoContainer.appendChild(humidityContainer);
otherInfoContainer.appendChild(windSpeedContainer);

container.appendChild(mainInfoContainer);
container.appendChild(otherInfoContainer);
container.appendChild(footer);

async function getWeatherData() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${API_KEY}&units=${currentTempUnit}`, {
            mode: 'cors'
        })
        const weatherData = await response.json();
        console.log(weatherData);
        
        let filtered = filterWeatherData(weatherData);
        console.log(filtered);

        populateWeatherData(filtered);
    } catch (error) {
        alert("WHOOPS " + error);
        console.error(error);
    }
}

function filterWeatherData(data) {
    let currentWeatherData = {};

    currentWeatherData["dt"] = data["dt"];
    currentWeatherData["main"] = { "feels_like": data["main"]["feels_like"] };
    currentWeatherData["main"]["humidity"] = data["main"]["humidity"];
    currentWeatherData["main"]["temp"] = data["main"]["temp"];
    currentWeatherData["name"] = data["name"];
    currentWeatherData["weather"] = [{ "description": data["weather"]["0"]["description"] }];
    currentWeatherData["weather"][0]["icon"] = data["weather"]["0"]["icon"];
    currentWeatherData["wind"] = { "speed": data["wind"]["speed"] };

    return currentWeatherData;
}

function populateWeatherData(data) {
    let currentDate = new Date(data["dt"]);

    locationName.textContent = data["name"];
    dateTime.textContent = currentDate.toString();
    mainTemp.textContent = Math.round(data["main"]["temp"]) + "°C";

    feelsLikeValue.textContent = Math.round(data["main"]["feels_like"]) + "°C";
    humidityValue.textContent = data["main"]["humidity"] + "%";
    windSpeedValue.textContent = data["wind"]["speed"] + "m/s";
}

getWeatherData();

document.body.appendChild(container);