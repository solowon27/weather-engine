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
  
async function  checkWeather(city){
  const response = await fetch(weatherApiUrl + city + `&appid=${apiKey}`);
  const data = await response.json();
  console.log(data);  


    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°F"; 
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + "mph";
    
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
displayTime();
setInterval(displayTime, 1000);

buttonEl.addEventListener("click", function(){   
checkWeather(inputEl.value);
});