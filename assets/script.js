
function searchOpenWeatherMaps(city) {
    var baseURL = "api.openweathermap.org/data/2.5/weather?";
    var apiKey = "&APPID=e011d63a481c50706494c8592ffe133e";
    var units = "&units=imperial";
    var cityQuery = "q=" + city;
    
    var queryURL = baseURL + cityQuery + units + apiKey;

    $.ajax({url: queryURL, method: "GET"}).then(function(weather) {
        console.log(weather);
    });

}

$("#searchButton").on("click", function(event) {
    event.preventDefault();
    var cityName = $("#citySearch").val().trim();

    searchOpenWeatherMaps(cityName);
    $("#citySearch").empty();
});