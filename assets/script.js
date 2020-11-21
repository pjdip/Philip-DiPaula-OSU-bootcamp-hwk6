
// Same storage function as previous assignments
function storeCities() {
    var stringyCities = JSON.stringify(cityHistory);
    localStorage.setItem("cities", stringyCities);
}

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

        // Grabbing the city name
        var city3 = $(this).attr("id");

        // Move the city to the top of the history
        var indX = cityHistory.indexOf(city3);
        cityHistory.splice(indX, 1);
        cityHistory.unshift(city3);

        // Render and store things
        renderWeather(city3);
        storeRender();
    });
}

// Consolidating function calls
function storeRender() {
    storeCities();
    renderHistory();
}

function renderWeather(city5) {
    currentWeather(city5);
    forecast(city5);
}

// Checking for duplicates in the array
function cityDuplicate(city4) {
    duplicate = false;
    cityHistory.forEach(function(citi) {
        if (citi === city4) {
            duplicate = true;
        }
    });
    return duplicate;
}

// Ajax call and rendering for the current weather of a given city parameter
function currentWeather(city) {

    // empty all the things
    $("#currentCity").empty(), $("#prime").empty(), $("#temperature").empty();
    $("#humidity").empty(), $("#windSpeed").empty(), $("#uv").empty();

    // building the query url from strings and teh city parameter
    var cityQuery = "q=" + city;
    var queryURL = baseURL + weatherSearch + cityQuery + units + apiKey;
    var lat = "lat=";
    var lon = "&lon=";

    // ajax promise with then function acting on the received json object
    $.ajax({url: queryURL, method: "GET"}).then(function(response) {

        console.log(response);
        console.log(response.cod);

        // navigating the json object and dynamically generating some html with the bits
        $("#currentCity").text(response.name);
        $("#prime").attr("src", iconBaseURL + response.weather[0].icon + iconEndURL);
        $("#temperature").text(response.main.temp);
        $("#humidity").text(response.main.humidity);
        $("#windSpeed").text(response.wind.speed);

        // building the query url for the uvi data request
        lat += response.coord.lat;
        lon += response.coord.lon;
        var uvQuery = baseURL + uvi + lat + lon + apiKey;
        $.ajax({url: uvQuery, method: "GET"}).then(function(response2) {

            // dynamic html generating with background colors based on uvi data
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
// Would ideally use the 16day forecast api to grab daily forecast data, but that costs money...
// In the event the user does a search between midnight and 3am UTC
// The first 7 increments will be for the same day "today"
// There will be only one 3 hour weather object from which to pull data for day 5
// For simplicity's sake, I will only use 1 data object per day
// Using the very last object for day 5, and working my way back from there

function forecast(city2) {

    var cityQuery2 = "q=" + city2;
    var queryURL2 = baseURL + forecastSearch + cityQuery2 + units + apiKey;

    $.ajax({url: queryURL2, method: "GET"}).then(function(response3) {

        // Forty 3-hr weather data objects are returned in a list (representing 120hr or 5 days worth of data)
        // Start by grabbing the 7th one, as this represents approx 24 hours from the current time
        // This is the only one guaranteed to be the next day (depending on the time you search)
        var weatherObj = 7;
        for (var j = 1; j < 6; j++) {

            // assembling span ID's for each loop and emptying the html elements
            var imgJ = "#img" + j;
            var tempJ = "#temp" + j;
            var humJ = "#hum" + j;
            $(imgJ).empty(), $(tempJ).empty(), $(humJ).empty();

            // html generation with weather object navigation
            $(imgJ).attr("src", iconBaseURL + response3.list[weatherObj].weather[0].icon + iconEndURL);
            $(tempJ).text(response3.list[weatherObj].main.temp);
            $(humJ).text(response3.list[weatherObj].main.humidity);

            // increment the object grabber variable to move 24 hours into the future
            // final loop iteration grabs the last object at index 39 --> 7, 15, 23, 31, 39
            weatherObj += 8;
         }
    });
}

// bunch of strings for query purposes
var baseURL = "https://api.openweathermap.org/data/2.5/";
var apiKey = "&APPID=e011d63a481c50706494c8592ffe133e";
var units = "&units=imperial";
var weatherSearch = "weather?";
var forecastSearch = "forecast?";
var uvi = "uvi?";

var iconBaseURL = "http://openweathermap.org/img/wn/";
var iconEndURL = "@2x.png";

// creating array for later
var cityHistory = [];

// date generation with jQuery and moment
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
    renderWeather(cityHistory[0]);
}

renderHistory();

// search button stuff
$("#searchButton").on("click", function(event) {
    event.preventDefault();

    // grab and format the input
    var cityName = $("#citySearch").val().trim().toLowerCase();
    cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    $("#citySearch").empty();

    // logic to verify valid input
    // some way to alert user if invalid input was given
    // no idea how to do this lol

    // if the searched city is already in the history, remove it
    if (cityDuplicate(cityName) === true) {
        var index = cityHistory.indexOf(cityName);
        cityHistory.splice(index, 1);
    }
    // add searched city to the top of the history
    cityHistory.unshift(cityName);

    // render weather and store things
    renderWeather(cityName);
    storeRender();
    $("#citySearch").empty();
});

// clear the history when clicked
$("#clearHistory").on("click", function(event) {
    event.preventDefault();
    cityHistory = [];
    storeRender();
});