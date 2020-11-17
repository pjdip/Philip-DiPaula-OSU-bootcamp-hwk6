var baseURL = "api.openweathermap.org/data/2.5/";
var apiKey = "&APPID=e011d63a481c50706494c8592ffe133e";
var units = "&units=imperial";
var weatherSearch = "weather?";
var forecastSearch = "forecast?";
var cityHistory = [];
var timeDif = moment.utc().hour() - moment().hour();

//moment display (make a function)
var today = moment().format("ddd, MMM Do YYYY");
var tomorrow = moment().add(1, 'days').format("ddd, MMM Do YYYY");
var day2 = moment().add(2, 'days').format("ddd, MMM Do YYYY");
var day3 = moment().add(3, 'days').format("ddd, MMM Do YYYY");
var day4 = moment().add(4, 'days').format("ddd, MMM Do YYYY");
var day5 = moment().add(5, 'days').format("ddd, MMM Do YYYY");

$("#currentDate").text("(" + today + ")");
$("#day1").text(tomorrow);
$("#day2").text(day2);
$("#day3").text(day3);
$("#day4").text(day4);
$("#day5").text(day5);


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
    $("#temperature").empty();
    $("#humidity").empty();
    $("#windSpeed").empty();
    $("#uv").empty();

    var cityQuery = "q=" + city;
    var queryURL = baseURL + weatherSearch + cityQuery + units + apiKey;

    $.ajax({url: queryURL, method: "GET"}).then(function(response) {
        console.log(response);
        $("#currentCity").text(response.name);
        $("#temperature").text(response.main.temp);
        $("#humidity").text(response.main.humidity);
        $("#windSpeed").text(response.wind.speed);
        $("#uv").text("some stuff I gotta figure out");
    });
}

function forecast(city2) {
    $("#temp1").empty();
    $("#hum1").empty();
    $("#temp2").empty();
    $("#hum2").empty();
    $("#temp3").empty();
    $("#hum3").empty();
    $("#temp4").empty();
    $("#hum4").empty();
    $("#temp5").empty();
    $("#hum5").empty();

    var cityQuery2 = "q=" + city2;
    var queryURL2 = baseURL + forecastSearch + cityQuery2 + units + apiKey;
    $.ajax({url: queryURL2, method: "GET"}).then(function(response2) {
        console.log(response2);

        if (moment().hour() <= 8) {

        }

        if (moment().hour() > 8 && moment().hour() <= 16) {

        }

        if (moment().hour() > 16) {

        }

        $("#temp1").empty();
        $("#hum1").empty();
        $("#temp2").empty();
        $("#hum2").empty();
        $("#temp3").empty();
        $("#hum3").empty();
        $("#temp4").empty();
        $("#hum4").empty();
        $("#temp5").empty();
        $("#hum5").empty();
    });
}

$("#searchButton").on("click", function(event) {
    event.preventDefault();
    var cityName = $("#citySearch").val().trim().toLowerCase();

    // logic to verify valid input
    // some way to alert user if invalid input was given

    if (cityDuplicate(cityName) === false) {
        cityHistory.unshift(cityName);
    }

    currentWeather(cityName);
    forecast(cityName);
    storeCities();

    $("#citySearch").empty();
});