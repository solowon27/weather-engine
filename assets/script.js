const apiKey = "f65b5dad37dd2e590d76b26428ca41ae"; //API key for OpenWeatherMap
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q="; //API URL for OpenWeatherMap
// const timeApiUrl = "https://worldtimeapi.org/api/ip";

//variables for the weather data and time display
const weatherIcon = document.querySelector(".weather-icon");
const inputEl = document.querySelector(".search input");
const buttonEl = document.querySelector(".search button");
var condition = document.getElementById("condition");
var feelsLike = document.getElementById("feels-like");
var timeDisplayEl = document.getElementById("time");

function displayTime() { //function to display the current time and date
    var rightNow = dayjs().format('MMM DD, YYYY [at] hh:mm:ss a');
    timeDisplayEl.textContent = rightNow;
}

async function checkWeather(city) { //function to check the weather for the city entered by the user 
    const response = await fetch(weatherApiUrl + city + `&appid=${apiKey}`); //fetches the weather data from the API using the async/await method
    const data = await response.json();
    // console.log(data);
    if (data.cod === "404") { //if the city entered by the user is not found, an error message is displayed
        document.getElementById("error-msg").style.display = "block";
    }

    //on the following lines(27-34), the weather data is displayed on the page using the DOM method
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°F";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + "mph";
    document.querySelector(".visibility").innerHTML = data.visibility + " miles";
    document.querySelector(".pressure").innerHTML = data.main.pressure + " hPa";
    document.getElementById("sun-rise").innerHTML = dayjs.unix(data.sys.sunrise).format('hh:mm a');
    document.getElementById("sun-set").innerHTML =  dayjs.unix(data.sys.sunset).format('hh:mm a');

    //on the following lines(36-52), the weather icon is displayed on the page based on the weather condition
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
    document.querySelector(".container").style.display = "block"; //so that the weather data is displayed only after the user enters a valid city name
    document.getElementById("search-icon").style.display = "none"; // the big search icon becomes hidden after the user enters a valid city name
    document.getElementById("error-msg").style.display = "none"; //the error message is hidden after the user enters a valid city name
    document.getElementById("forecast-header").style.display = "block"; //the forecast header is displayed after the user enters a valid city name
}
//the following function is for the search history display
function searchHistory (city){
    const searchHistory = document.querySelector('.history-list'); //selects the unordered list element from the HTML
   
    var historyList = document.createElement("li"); //creates a list item element
        historyList.textContent = city; //the text content of the list item is the city name entered by the user
        searchHistory.appendChild(historyList);

        historyList.addEventListener("click", function () { //when the user clicks on the city name in the search history, the weather data for that city is displayed from local storage
        checkWeather(historyList.textContent); //the weather data is displayed for the city name that is clicked on
        forecastDataBase(historyList.textContent);//the forecast data is displayed for the city name that is clicked on
    }
    )
}
//the following function is for the 5 days forecast display and from line 87-140 i get some help from chatGPT
function forecastDataBase(city) {

    var url = 'https://api.openweathermap.org/data/2.5/forecast?cnt=35&units=imperial&q=' + city + '&appid=' + apiKey; //API URL for OpenWeatherMap for the 5 days forecast data 'i use cnt=35 to get the forecast for 5 days'
    fetch(url) //fetches the forecast data from the API using the .then method and the arrow function which is my preferred method
        .then(res => res.json())
        .then(data => {
            var forecast = data.list; //the forecast data is stored in the variable forecast
            var forecastList = document.querySelector(".forecast-list"); //selects the unordered list element from the HTML
            var previousDate = null; //the previous date is set to null

            forecastList.innerHTML = ""; //the unordered list is cleared after the user enters a new city name
            inputEl.value = ""; //the input field is cleared after the user enters a new city name

            forecast.forEach(function (forecastDay) { //this forEach loop is to loop through the forecast data 
                
                var currentDay = new Date().getDate(); //gets the current date from the system
                var weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; //array of the days of the week
                              
                var day = new Date(forecastDay.dt_txt).getDay(); //gets the day of the week from the forecast data
                var dayName = weekDays[day];    
                var forecastDate = forecastDay.dt_txt.split(" ")[0];
                var forecastTemp = forecastDay.main.temp;
                var forecastHumidity = forecastDay.main.humidity;

                if (forecastDate === currentDay) { //if the forecast date is equal to the current date, then it is displayed as "Today" otherwise the day of the week is displayed
                    forecastDate = "Today";
                } else {
                    forecastDate = dayName;
                }
                
                if (forecastDate !== previousDate) { // if the forecast date is not equal to the previous date, then the following code is executed

                    var listItem = document.createElement("li"); //creates a list item element for the forecast data

                    var forIcon = document.createElement("img"); //creates an image element for the forecast data
                    forIcon.src = ""; //replace the icons related with the data from the API
                    forIcon.alt = "Weather Icon";
                    listItem.appendChild(forIcon);

                    //the following if statements are to display the weather icon based on the weather condition
                    if (forecastDay.weather[0].main === "Clouds") {
                        forIcon.src = "assets/images/cloudy.png";
                    } else if (forecastDay.weather[0].main === "Rain") {
                        forIcon.src = "assets/images/rainy.png";
                    } else if (forecastDay.weather[0].main === "Snow") {
                        forIcon.src = "assets/images/snowy.png";
                    } else if (forecastDay.weather[0].main === "Clear") {
                        forIcon.src = "assets/images/sunny.png";
                    } else if (forecastDay.weather[0].main === "Thunderstorm") {
                        forIcon.src = "assets/images/thunderstorm.png";
                    }
                    
                    var forDate = document.createElement("span"); //creates a span element for the forecast data
                    forDate.textContent = forecastDate; //and set the text content of the span element to the forecast date
                    listItem.appendChild(forDate);

                    var forTemp = document.createElement("span");
                    forTemp.textContent = String.fromCharCode(176); //Unicode character for an icon
                    forTemp.innerHTML += ` ${forecastTemp}°F  `;
                    listItem.appendChild(forTemp);

                    var forHumidity = document.createElement("span");
                    forHumidity.textContent = String.fromCharCode(9732); 
                    forHumidity.innerHTML += ` ${forecastHumidity}%  `;
                    listItem.appendChild(forHumidity);

                    forecastList.appendChild(listItem);
                    previousDate = forecastDate; //then the previous date is set to the forecast date so that the forecast data is not repeated
                   
                }
            });
           

        })
        .catch(error => {
            console.log('Error:', error);
            window.alert("Please enter a valid city name"); //if the user enters an invalid city name, then an error message is displayed
        });
}

displayTime();
setInterval(displayTime, 1000);

inputEl.addEventListener("keydown", function(event) { // Listen for the "keydown" event to act as a submit button click
  if (event.keyCode === 13) {
    event.preventDefault(); // Prevent the default form submission behavior
    buttonEl.click(); // Trigger the click event of the submit button
  }
});
buttonEl.addEventListener("click", function () {
    checkWeather(inputEl.value);
    forecastDataBase(inputEl.value);
    searchHistory(inputEl.value);
});