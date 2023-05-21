const apiKey = "f65b5dad37dd2e590d76b26428ca41ae";
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=";
const timeApiUrl = "https://worldtimeapi.org/api/ip";

const weatherIcon = document.querySelector(".weather-icon");
const inputEl = document.querySelector(".search input");
const buttonEl = document.querySelector(".search button");
var condition = document.getElementById("condition");
var feelsLike = document.getElementById("feels-like");
var timeDisplayEl = document.getElementById("time");





function displayTime() {
    var rightNow = dayjs().format('MMM DD, YYYY [at] hh:mm:ss a');
    timeDisplayEl.textContent = rightNow;
}

async function checkWeather(city) {
    const response = await fetch(weatherApiUrl + city + `&appid=${apiKey}`);
    const data = await response.json();
    console.log(data);


    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°F";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + "mph";
    document.querySelector(".visibility").innerHTML = data.visibility + " miles";
    document.querySelector(".pressure").innerHTML = data.main.pressure + " hPa";
    document.getElementById("sun-rise").innerHTML = dayjs.unix(data.sys.sunrise).format('hh:mm a');
    document.getElementById("sun-set").innerHTML =  dayjs.unix(data.sys.sunset).format('hh:mm a');

    if (data.weather[0].main === "Clouds") {
        weatherIcon.src = "assets/images/cloudy.png";
        condition.innerHTML = "Cloudy";
        feelsLike.innerHTML = "Feels like " + Math.round(data.main.feels_like) + "°F";
    } else if (data.weather[0].main === "Rain") {
        weatherIcon.src = "assets/images/rainy.png";
        condition.innerHTML = "Rainy";
    } else if (data.weather[0].main === "Snow") {
        weatherIcon.src = "assets/images/snowy.png";
        condition.innerHTML = "Snowy";
    } else if (data.weather[0].main === "Clear") {
        weatherIcon.src = "assets/images/sunny.png";
        condition.innerHTML = "Sunny";
    } else if (data.weather[0].main === "Thunderstorm") {
        weatherIcon.src = "assets/images/thunderstorm.png";
        condition.innerHTML = "Thunderstorm";
    }
}
function searchHistory (city){
    const searchHistory = document.querySelector('.history-list');
    var historyList = document.createElement("li");
    
        historyList.textContent = city;
        searchHistory.appendChild(historyList);

        historyList.addEventListener("click", function () {
        checkWeather(historyList.textContent);
        forecastDataBase(historyList.textContent);
    }
    )
}
function forecastDataBase(city) {

    var url = 'https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=' + city + '&appid=' + apiKey;
    
    

    fetch(url)
        .then(res => res.json())
        .then(data => {
            var forecast = data.list;
            var forecastList = document.querySelector(".forecast-list");
            var previousDate = null;

            forecastList.innerHTML = "";

            forecast.forEach(function (forecastDay) {
                var forecastDate = forecastDay.dt_txt.split(" ")[0];
                var forecastTemp = forecastDay.main.temp;
                var forecastHumidity = forecastDay.main.humidity;
                var forecastWind = forecastDay.wind.speed;

                console.log(`Date/Time: ${forecastDate} Temp: ${forecastTemp} Humidity: ${forecastHumidity} Wind: ${forecastWind}`);
                
                if (forecastDate !== previousDate) {
                    var listItem = document.createElement("li");

                    listItem.textContent = 
                  ` ${forecastDate} 
                    ${forecastTemp}  
                    ${forecastHumidity} 
                    ${forecastWind}`;

                    forecastList.appendChild(listItem);
                    previousDate = forecastDate;

                    inputEl.value = "";
                }
            });
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

displayTime();
setInterval(displayTime, 1000);

buttonEl.addEventListener("click", function () {
    checkWeather(inputEl.value);
    forecastDataBase(inputEl.value);
    searchHistory(inputEl.value);
});
