import './style.css';
import Smog from "./images/smog-solid.svg";
import TemperatureHalf from "./images/temperature-half-solid.svg";
import Wind from "./images/wind-solid.svg";

const API_KEY = "e4cb62eba5da1b0dd44ba86650e28ccc";
let currentUnit = "metric";
let otherUnit = "imperial";
let currentLocation = "Bandung";

let currentWeatherData = {};

const container = document.createElement('div');

const mainInfoContainer = document.createElement('div');
const mainStatus = document.createElement('div');
const locationName = document.createElement('div');
const dateTime = document.createElement('div');
const mainTemp = document.createElement('div');
const changeUnitButton = document.createElement('button');
const mainIcon = document.createElement('img');
const formLocationContainer = document.createElement('div');
const formLocation = document.createElement("form");
const formLocationName = document.createElement("input");
const formLocationSubmit = document.createElement("button");
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
changeUnitButton.classList.add('change-unit-button');
mainIcon.classList.add('main-icon');
formLocationContainer.classList.add('form-location-container');
formLocation.classList.add('form-location');
formLocationName.classList.add('form-location-name');
formLocationSubmit.classList.add('form-location-submit');
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

locationName.textContent = currentLocation;
changeUnitButton.textContent = `Display ${otherUnit}`;
formLocationName.placeholder = "Search Location...";
formLocationSubmit.textContent = "Search";
locationNotFound.hidden = true;
locationNotFound.textContent = "Location not found. Search must be in the form of \"City\", \"City, State\" or \"City, Country\"."

feelsLikeIcon.src = TemperatureHalf;
feelsLikeText.textContent = "Feels Like";
humidityIcon.src = Smog;
humidityText.textContent = "Humidity";
windSpeedIcon.src = Wind;
windSpeedText.textContent = "Wind Speed ";

footer.innerHTML = "By yours truly,&nbsp;<a href='https://github.com/mraffia'>mraffia</a>&nbsp;(Photo by&nbsp;<a href='https://www.pexels.com/photo/blue-and-white-sky-with-stars-4737484/'>Rafael Cerqueira</a>)";

mainInfoContainer.appendChild(mainStatus);
mainInfoContainer.appendChild(locationName);
mainInfoContainer.appendChild(dateTime);
mainInfoContainer.appendChild(mainTemp);
mainInfoContainer.appendChild(changeUnitButton);
mainInfoContainer.appendChild(mainIcon);
formLocation.appendChild(formLocationName);
formLocation.appendChild(formLocationSubmit);
formLocationContainer.appendChild(formLocation);
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

async function getWeatherData(location, unit) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=${unit}`, {
            mode: 'cors'
        })
        const weatherData = await response.json();
        let filtered = filterWeatherData(weatherData);
        locationNotFound.hidden = true;

        populateWeatherData(filtered);
    } catch (error) {
        locationNotFound.hidden = false;
        console.error(error);
    }
}

function filterWeatherData(data) {
    let kiloPerHour = Number(data["wind"]["speed"]) * 3.6;

    let statusLow = data["weather"][0]["description"];
    let statusLowArr = statusLow.split(" ");

    for (let i = 0; i < statusLowArr.length; i++) {
        statusLowArr[i] = statusLowArr[i][0].toUpperCase() + statusLowArr[i].substr(1);
    }

    let status = statusLowArr.join(" ");

    currentWeatherData["main"] = { "feels_like": data["main"]["feels_like"] };
    currentWeatherData["main"]["humidity"] = data["main"]["humidity"];
    currentWeatherData["main"]["temp"] = data["main"]["temp"];
    currentWeatherData["name"] = data["name"];
    currentWeatherData["weather"] = [{ "description": status }];
    currentWeatherData["weather"][0]["icon"] = data["weather"][0]["icon"];
    currentWeatherData["wind"] = { "speed": data["wind"]["speed"] };

    return currentWeatherData;
}

function populateWeatherData(data) {
    let currentDate = new Date();
    let tempUnit;
    let speedUnit;

    if(currentUnit === "metric") {
        tempUnit = "°C";
        speedUnit = "km/h";
    } else {
        tempUnit = "°F";
        speedUnit = "mph";
    }

    mainStatus.textContent = data["weather"][0]["description"];
    locationName.textContent = data["name"];
    dateTime.textContent = currentDate.toString();
    mainTemp.textContent = Math.round(data["main"]["temp"]) + tempUnit;

    feelsLikeValue.textContent = Math.round(data["main"]["feels_like"]) + tempUnit;
    humidityValue.textContent = data["main"]["humidity"] + "%";
    windSpeedValue.textContent = Number(data["wind"]["speed"]).toFixed(2) + speedUnit;

    changeUnitButton.textContent = `Display ${otherUnit}`;
    mainIcon.src = "http://openweathermap.org/img/wn/" + data["weather"][0]["icon"] + "@2x.png";
}

function cToF(celsius) {
    let cTemp = celsius;
    let cToFahr = cTemp * 9 / 5 + 32;
    return cToFahr;
}

function fToC(fahrenheit) {
    let fTemp = fahrenheit;
    let fToCel = (fTemp - 32) * 5 / 9;
    return fToCel;
}

function changeUnit() {
    let temp = currentWeatherData["main"]["temp"];
    let speed = currentWeatherData["wind"]["speed"];

    let newTemp;
    let newSpeed;

    if (currentUnit === "metric") {
        newTemp = cToF(temp);
        newSpeed = speed / 1.609;
        currentUnit = "imperial";
        otherUnit = "metric";
    } else {
        newTemp = fToC(temp);
        newSpeed = speed * 1.609;
        currentUnit = "metric";
        otherUnit = "imperial";
    }

    currentWeatherData["main"]["feels_like"] = newTemp;
    currentWeatherData["main"]["temp"] = newTemp;
    currentWeatherData["wind"]["speed"] = newSpeed;

    populateWeatherData(currentWeatherData);
}

changeUnitButton.addEventListener('click', () => {
    changeUnit();
});

formLocation.addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.target[0].value !== "") {
        currentLocation = e.target[0].value;
        e.target.reset();
        getWeatherData(currentLocation, currentUnit);
    }
});

getWeatherData(currentLocation, currentUnit);

document.body.appendChild(container);