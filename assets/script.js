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
    console.log(data);
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
        document.querySelector(".forecast-box").style.display = "none"; 
        document.querySelector(".container").style.display = "block";
        document.querySelector(".forecast-box").style.display = "none";
    }
    )
}
//the following function is for the 5 days forecast display and from line 87-140 i get some help from chatGPT
function forecastDataBase(city) {
    var url = 'https://api.openweathermap.org/data/2.5/forecast?cnt=35&units=imperial&q=' + city + '&appid=' + apiKey;
  
    fetch(url) //fetches the forecast data from the API using a .then method and arrow function my preferred method 
      .then(res => res.json()) //converts the data into JSON format
      .then(data => {
        var forecast = data.list; //now the forecast data is stored in the variable forecast
        var forecastList = document.querySelector('.forecast-list'); //selects the unordered list element from the HTML
        var previousDate = null; //here we are setting the previous date to null so our data will be start from the current date
  
        forecastList.innerHTML = ''; //clears the forecast list element after each search
        inputEl.value = ''; //clears the input field after each search
  
        if (data.cod === '200') { //if the city entered by the user is found, the forecast data is displayed
          forecast.forEach(function(forecastDay) {
            var currentDay = new Date().getDate(); //gets the current date from the system and stores it in the variable currentDay
            var weekDays = [
              'Sunday',
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday'
            ];
  
            var forecastDate = forecastDay.dt_txt.split(' ')[0]; //this [0] is for the date and [1] is for the time but we only need the date for this project           
            var forecastMaxTemp = forecastDay.main.temp_max; //gets the maximum temperature for the forecast day and stores it in the variable forecastMaxTemp
            var forecastMinTemp = forecastDay.main.temp_min; //gets the minimum temperature for the forecast day and stores it in the variable forecastMinTemp
             //console.log(forecastDay.main.temp_max);
            
            if (forecastDate !== previousDate) { //if the forecast date is not equal to the previous date, the forecast data is displayed this is to avoid displaying the same data for the next 5 days
              var listItem = document.createElement('li');
              var forIcon = document.createElement('img');
              forIcon.alt = 'Weather Icon';
  
              //the following if statements are for displaying the weather icon based on the weather condition
              if (forecastDay.weather[0].main === 'Clouds') {
                forIcon.src = 'assets/images/cloudy.png';
              } else if (forecastDay.weather[0].main === 'Rain') {
                forIcon.src = 'assets/images/rainy.png';
              } else if (forecastDay.weather[0].main === 'Snow') {
                forIcon.src = 'assets/images/snowy.png';
              } else if (forecastDay.weather[0].main === 'Clear') {
                forIcon.src = 'assets/images/sunny.png';
              } else if (forecastDay.weather[0].main === 'Thunderstorm') {
                forIcon.src = 'assets/images/thunderstorm.png';
              }
  
              listItem.appendChild(forIcon); //then the weather icon is appended to the list item
  
              var forDate = document.createElement('span'); //creates a span element for the forecast date
              var forecastDateObj = new Date(forecastDay.dt_txt); //gets the forecast date from the system and stores it in the variable forecastDateObj
              if (forecastDateObj.getDate() === currentDay) { //if the forecast date is equal to the current date, the text content of the span element is set to 'Today'
                forDate.textContent = 'Today'; 
              } else {
                var dayName = weekDays[forecastDateObj.getDay()]; //else the text content of the span element is set to the day name according to the forecast date
                forDate.textContent = dayName;
              }
              listItem.appendChild(forDate);
  
              var forMinTemp = document.createElement('span');
              forMinTemp.textContent = String.fromCharCode(176) + 'min ' + forecastMinTemp + '°F'; //the minimum temperature for the forecast day is displayed
              listItem.appendChild(forMinTemp);
  
              var forMaxTemp = document.createElement('span');
              forMaxTemp.textContent = String.fromCharCode(176) + 'max ' + forecastMaxTemp + '°F'; //the maximum temperature for the forecast day is displayed
              listItem.appendChild(forMaxTemp);
  
              forecastList.appendChild(listItem);
              previousDate = forecastDate; 

              listItem.addEventListener('click', function() {
                eachForecastData(forecastDay);
                document.querySelector('.container').style.display = 'none';
                document.querySelector('.forecast-box').style.display = 'block';
              });
            }
          });
        } else {
          window.alert('Error: Invalid response from the API');
        }
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }
  //the following function is for displaying the forecast data for each day when the user clicks on the forecasted day data
  function eachForecastData(forecastData) {
    var targetDate = forecastData.dt_txt.split(' ')[0];
    var maxTemp = forecastData.main.temp_max;
    var minTemp = forecastData.main.temp_min;
    var humidity = forecastData.main.humidity;
    var windSpeed = forecastData.wind.speed;
    var weatherCondition = forecastData.weather[0].main;
    

    var forecastDataEl = document.querySelector('.forecast-data');
    forecastDataEl.innerHTML = '';

    var forecastDataTitle = document.createElement('h2');
    forecastDataTitle.textContent = 'Forecast Data';
    forecastDataEl.appendChild(forecastDataTitle);

    var forecastDataList = document.createElement('ul');
    forecastDataList.classList.add('forecast-data-list');
    forecastDataEl.appendChild(forecastDataList);

    var forecastDataListItem1 = document.createElement('li');
    forecastDataListItem1.textContent = 'Date: ' + targetDate;
    forecastDataList.appendChild(forecastDataListItem1);

    var forecastDataListItem2 = document.createElement('li');
    forecastDataListItem2.textContent = 'Max Temp: ' + maxTemp + String.fromCharCode(176) + 'F';
    forecastDataList.appendChild(forecastDataListItem2);

    var forecastDataListItem3 = document.createElement('li');
    forecastDataListItem3.textContent = 'Min Temp: ' + minTemp + String.fromCharCode(176) + 'F';
    forecastDataList.appendChild(forecastDataListItem3);

    var forecastDataListItem4 = document.createElement('li');
    forecastDataListItem4.textContent = 'Humidity: ' + humidity + '%';
    forecastDataList.appendChild(forecastDataListItem4);

    var forecastDataListItem5 = document.createElement('li');
    forecastDataListItem5.textContent = 'Wind Speed: ' + windSpeed + 'mph';
    forecastDataList.appendChild(forecastDataListItem5);

    var forecastDataListItem6 = document.createElement('li');
    forecastDataListItem6.textContent = 'Weather Condition: ' + weatherCondition;
    forecastDataList.appendChild(forecastDataListItem6);

    console.log(forecastData);
  }

displayTime();
setInterval(displayTime, 1000);

inputEl.addEventListener("keydown", function(event) { // Listen for the "keydown" event to act as a submit button click
  if (event.keyCode === 13) { //number 13 is the "Enter" key on the keyboard
    event.preventDefault(); // Prevent the default form submission behavior
    buttonEl.click(); // Trigger the click event of the submit button
  }
});
buttonEl.addEventListener("click", function () { //when the user clicks on the search button, the weather data is displayed
    checkWeather(inputEl.value);
    forecastDataBase(inputEl.value);
    searchHistory(inputEl.value);
});