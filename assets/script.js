function renderHistory() {
    $("#cityList").empty();
    cityHistory.forEach(function(searchedCity) {
        var newCity = $("<li>").text(searchedCity).attr("id", searchedCity).attr("class", "btn city-btn list-group-item").attr("type", "submit").attr("style", "text-align: left;");
        $("#cityList").append(newCity);
    });
    $(".city-btn").on("click", function(event) {
        event.preventDefault();
        var city3 = $(this).attr("id");
        currentWeather(city3);
        forecast(city3);
/*         var indX = cityHistory.indexOf(city3);
        cityHistory.splice(indX, 1);
        cityHistory.unshift(city3); */
    });
}

function cityDuplicate(city3) {
    duplicate = false;
    cityHistory.forEach(function(citi) {
        if (citi === city3) {
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

    $.ajax({url: queryURL, method: "GET"}).then(function(response) {
        $("#currentCity").text(response.name);
        $("#prime").attr("src", iconBaseURL + response.weather[0].icon + iconEndURL);
        $("#temperature").text(response.main.temp);
        $("#humidity").text(response.main.humidity);
        $("#windSpeed").text(response.wind.speed);
        $("#uv").text("some stuff I gotta figure out");
    });
}


// Since the api gives weather forecast in 3 hour increments
// There are a lot of ways to go about picking what to display for the 5 day forecast
// There is an option to go down the rabbit hole in this situation, I'm not going to do that lol
// In the event the user does a search between midnight and 3am UTC
// There will be only one 3 hour weather object from which to pull data for day 5
// For simplicity's sake, I will only use 1 data object per day
// Starting with the very last 1 for day 5, and working my way back from there
function forecast(city2) {
    $("#img1").empty();
    $("#temp1").empty();
    $("#hum1").empty();

    $("#img2").empty();
    $("#temp2").empty();
    $("#hum2").empty();

    $("#temp3").empty();
    $("#hum3").empty();
    $("#img3").empty();

    $("#temp4").empty();
    $("#hum4").empty();
    $("#img4").empty();

    $("#temp5").empty();
    $("#hum5").empty();
    $("#img5").empty();

    var cityQuery2 = "q=" + city2;
    var queryURL2 = baseURL + forecastSearch + cityQuery2 + units + apiKey;

    $.ajax({url: queryURL2, method: "GET"}).then(function(response2) {

        var weatherObj = 39;
        for (var j = 1; j < 6; j++) {
            var imgJ = "#img" + j;
            var tempJ = "#temp" + j;
            var humJ = "#hum" + j;
            $(imgJ).attr("src", iconBaseURL + response2.list[weatherObj].weather[0].icon + iconEndURL);
            $(tempJ).text(response2.list[weatherObj].main.temp);
            $(humJ).text(response2.list[weatherObj].main.humidity);
            weatherObj = weatherObj - 8;
         }

/*         $("#img1").attr("src", iconBaseURL + response2.list[39].weather[0].icon + iconEndURL);
        $("#temp1").text(response2.list[39].main.temp);
        $("#hum1").text(response2.list[39].main.humidity);

        $("#img2").attr("src", iconBaseURL + response2.list[31].weather[0].icon + iconEndURL);
        $("#temp2").text(response2.list[31].main.temp);
        $("#hum2").text(response2.list[31].main.humidity);

        $("#img3").attr("src", iconBaseURL + response2.list[23].weather[0].icon + iconEndURL);
        $("#temp3").text(response2.list[23].main.temp);
        $("#hum3").text(response2.list[23].main.humidity);

        $("#img4").attr("src", iconBaseURL + response2.list[15].weather[0].icon + iconEndURL);
        $("#temp4").text(response2.list[15].main.temp);
        $("#hum4").text(response2.list[15].main.humidity);

        $("#img5").attr("src", iconBaseURL + response2.list[7].weather[0].icon + iconEndURL);
        $("#temp5").text(response2.list[7].main.temp);
        $("#hum5").text(response2.list[7].main.humidity); */

    });
}

var baseURL = "https://api.openweathermap.org/data/2.5/";
var apiKey = "&APPID=e011d63a481c50706494c8592ffe133e";
var units = "&units=imperial";
var weatherSearch = "weather?";
var forecastSearch = "forecast?";

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