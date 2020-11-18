// This function dynamically creates the search history list
function renderHistory() {

    // First the list is emptied, then we loop through every city in the cityHistory array
    $("#cityList").empty();
    cityHistory.forEach(function(searchedCity) {
        // Creating a new li element for each one and appending them to the ul in the html
        var newCity = $("<li>").text(searchedCity).attr("id", searchedCity).attr("class", "btn city-btn list-group-item").attr("type", "submit").attr("style", "text-align: left;");
        $("#cityList").append(newCity);
    });

    // Adding an event listener to each one
    $(".city-btn").on("click", function(event) {
        event.preventDefault();
        var city3 = $(this).attr("id");
        var indX = cityHistory.indexOf(city3);
        cityHistory.splice(indX, 1);
        cityHistory.unshift(city3);
        currentWeather(city3);
        forecast(city3);
        storeCities();
        renderHistory();
    });
}

function cityDuplicate(city4) {
    duplicate = false;
    cityHistory.forEach(function(citi) {
        if (citi === city4) {
            duplicate = true;
        }
    });
    return duplicate;
}

function storeCities() {
    var stringyCities = JSON.stringify(cityHistory);
    localStorage.setItem("cities", stringyCities);
}

function currentWeather(city) {
    $("#currentCity").empty();
    $("#prime").empty();
    $("#temperature").empty();
    $("#humidity").empty();
    $("#windSpeed").empty();
    $("#uv").empty();

    var cityQuery = "q=" + city;
    var queryURL = baseURL + weatherSearch + cityQuery + units + apiKey;
    var lat = "lat=";
    var lon = "&lon=";

    $.ajax({url: queryURL, method: "GET"}).then(function(response) {
        $("#currentCity").text(response.name);
        $("#prime").attr("src", iconBaseURL + response.weather[0].icon + iconEndURL);
        $("#temperature").text(response.main.temp);
        $("#humidity").text(response.main.humidity);
        $("#windSpeed").text(response.wind.speed);
        lat += response.coord.lat;
        lon += response.coord.lon;
        var uvQuery = baseURL + uvi + lat + lon + apiKey;
        $.ajax({url: uvQuery, method: "GET"}).then(function(response2) {
            $("#uv").text(response2.value).attr("style", "background-color: LawnGreen;");
            if (response2.value >= 3 && response2.value < 6) {
                $("#uv").attr("style", "background-color: yellow;");
            } else if (response2.value >= 6 && response2.value < 8) {
                $("#uv").attr("style", "background-color: orange;");
            } else if (response2.value >= 8) {
                $("#uv").attr("style", "background-color: red;");
            }
        });
    });
}

// Since the api gives weather forecast in 3 hour increments
// There are a lot of ways to go about picking what to display for the 5 day forecast
// There is an option to go down the rabbit hole in this situation, I'm not going to do that lol
// In the event the user does a search between midnight and 3am UTC
// There will be only one 3 hour weather object from which to pull data for day 5
// For simplicity's sake, I will only use 1 data object per day
// Starting with the very last 1 for day 5, and working my way back from there
// Would ideally use the 16day forecast api for this, but that costs money...
function forecast(city2) {

    var cityQuery2 = "q=" + city2;
    var queryURL2 = baseURL + forecastSearch + cityQuery2 + units + apiKey;

    $.ajax({url: queryURL2, method: "GET"}).then(function(response3) {

        var weatherObj = 39;
        for (var j = 1; j < 6; j++) {
            var imgJ = "#img" + j;
            var tempJ = "#temp" + j;
            var humJ = "#hum" + j;
            $(imgJ).empty();
            $(tempJ).empty();
            $(humJ).empty();
            $(imgJ).attr("src", iconBaseURL + response3.list[weatherObj].weather[0].icon + iconEndURL);
            $(tempJ).text(response3.list[weatherObj].main.temp);
            $(humJ).text(response3.list[weatherObj].main.humidity);
            weatherObj = weatherObj - 8;
         }
    });
}

var baseURL = "https://api.openweathermap.org/data/2.5/";
var apiKey = "&APPID=e011d63a481c50706494c8592ffe133e";
var units = "&units=imperial";
var weatherSearch = "weather?";
var forecastSearch = "forecast?";
var uvi = "uvi?";

var iconBaseURL = "http://openweathermap.org/img/wn/";
var iconEndURL = "@2x.png";

var cityHistory = [];

var today = moment().format("ddd, MMM Do YYYY");
$("#currentDate").text("(" + today + ")");

for (var i = 1; i < 6; i++) {
    var day = "#day" + i;
    var date = moment().add(i, 'days').format("l");
    $(day).text(date);
}

// check localStorage to see if there are saved cities
// If there are, update cityHistory
var retrievedCities = localStorage.getItem("cities");
if (retrievedCities !== null) {
    cityHistory = JSON.parse(retrievedCities);
}

// display last searched city if it exists
if (cityHistory.length > 0) {
    currentWeather(cityHistory[0]);
    forecast(cityHistory[0]);
}

renderHistory();

$("#searchButton").on("click", function(event) {
    event.preventDefault();
    var cityName = $("#citySearch").val().trim().toLowerCase();
    cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    $("#citySearch").text("");

    // logic to verify valid input
    // some way to alert user if invalid input was given

    if (cityDuplicate(cityName) === true) {
        var index = cityHistory.indexOf(cityName);
        cityHistory.splice(index, 1);
    }
    cityHistory.unshift(cityName);

    currentWeather(cityName);
    forecast(cityName);
    storeCities();
    renderHistory();

});

$("#clearHistory").on("click", function(event) {
    event.preventDefault();
    cityHistory = [];
    storeCities();
    renderHistory();
});