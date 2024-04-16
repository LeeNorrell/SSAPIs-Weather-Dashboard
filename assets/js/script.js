const apiKey = 'a25eedf723e2ad42229e0aa7593d6137'
const apiLatLongWeatherInfo = ({ lat, lon }) => `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
const apiLatLongWeatherForecast = ({ lat, lon }) => `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
const apiLatLongFromCityName = ({ cityName }) => (`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`);

function getnextId() {
  const currentId = localStorage.getItem('nextId') || 0;
  const newId = +currentId + 1;
  localStorage.setItem('nextId', newId);
  return newId;
}

function createIdFromFields(IdName){
  const newId ={
    IdName: IdName,
  };
  return newId;
}

function createId(props) {
  const {IdName} = props;
  const boxHtml =`
  <li class="list"><a>${IdName}</a></li>
  `;
  return boxHtml;
}


function handleSearchId(event) {
  event.preventDefault();
  const currentId =getnextId();
  const newId = createId(currentId);

  const Id = readId();
  Id.push(newId);
  writeId(Id);

  const boxHtml = createId(newId);
  $('#Id').append(boxHtml);
}

function readId() {
  const currentId = JSON.parse(localStorage.getItem('Id')) || [];
  return currentId;
}

function writeId(Id) {
  const storeId = JSON.stringify(Id);
 return localStorage.setItem('Id', storeId);
}

function renderId() {
  const Id = readId();
  Id.forEach((Id) => {
    const boxHtml = createId(Id);
    $('#Id').append(boxHtml);
  });
}


async function getLocationFromCityName(cityName) {
  const apiUrl = apiLatLongFromCityName({ cityName });
  const response = await fetch(apiUrl);
  const data = await response.json();
  const {
    name,
    lat,
    lon,
  } = data[0];
  return ({name, lat, lon});
}

async function getWeatherFromCityInfo(cityInfo) {
  const apiUrl = apiLatLongWeatherInfo(cityInfo);
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}


async function getWeatherForecastFromCityInfo(cityInfo) {
  const apiUrl = apiLatLongWeatherForecast(cityInfo);
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

function currentWeatherTemplate(weatherInfo) {
  const {
    name,
    main: {
      temp,
      humidity,
    },
    wind: {
      speed,
    },

  } = weatherInfo;

  return `
    <div class="currentWeather">
      <h2>${name}</h2>
      <p>Temp: ${temp}</p>
      <p>Wind: ${speed} MPH</p>
      <p>Humidity: ${humidity}%</p>
    </div>
  `;
}

function forecastWeatherTemplate() {
  for(let i = 0; i < 5; i++) {
    const {
      main: {
        temp,
        humidity,
      },
      wind: {
        speed,
      },
    } = forecastInfo.list[i];
    return `
        /*<div class = "forecast">
          <p>Temp: ${temp}</p>
          <p>Wind: ${speed} MPH</p>
          <p>Humidity: ${humidity}%</p>
        <div>
        `;
}
}

console.log(forecastInfo);
const weatherConditionsElement = $("#currentWeatherConditions");
function displayCurrentWeatherConditions(weatherInfo) {
  weatherConditionsElement.empty();
  weatherConditionsElement.append(currentWeatherTemplate(weatherInfo))
}

const forecastInfoElement = $("#forecastInfo");
function displayWeatherForecast(forecastInfo){
  forecastInfoElement.empty();
  forecastInfo.list.forEach(function(dayForecastInfo) {
    forecastInfoElement.append(forecastWeatherTemplate(dayForecastInfo));
  });
};

const searchField = $('#mySearch');
function getWeatherCityValue() {
  return searchField.val();
}

$(document).ready(function() {
  searchField.val('Atlanta');
  $('#searchButton').click(async function() {
    const cityInfo = await getLocationFromCityName(searchField.val());

    const weatherInfo = await getWeatherFromCityInfo(cityInfo);
    displayCurrentWeatherConditions(weatherInfo);

    const weatherForecast = await getWeatherForecastFromCityInfo(cityInfo);
    displayWeatherForecast(weatherForecast);
  });
});
