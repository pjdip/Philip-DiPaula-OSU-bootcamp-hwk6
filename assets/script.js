var baseURL = "api.openweathermap.org/data/2.5/";
var apiKey = "&APPID=e011d63a481c50706494c8592ffe133e";
var units = "&units=imperial";

function currentWeather(city) {
    $("#temperature").empty();
    $("#humidity").empty();
    $("#windSpeed").empty();
    $("#uv").empty();

    var weatherSearch = "weather?";
    var cityQuery = "q=" + city;
    var queryURL = baseURL + weatherSearch + cityQuery + units + apiKey;

    $.ajax({url: queryURL, method: "GET"}).then(function(response) {
        console.log(response);
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

    var forecastSearch = "forecast?";
    var cityQuery2 = "q=" + city2;
    var queryURL2 = baseURL + forecastSearch + cityQuery2 + units + apiKey;
    $.ajax({url: queryURL2, method: "GET"}).then(function(response2) {
        console.log(response2);
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
    var cityName = $("#citySearch").val().trim();

    currentWeather(cityName);
    forecast(cityName);

    $("#citySearch").empty();
});