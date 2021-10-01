var cityList = $("#remembered-cities");
var cities = [];
var key = "";
var currentDate = moment().format('MM/DD/YYYY');


function init() {
    var savedCities = JSON.parse(localStorage.getItem("cities"));
    if (savedCities !== null) {
        cities = savedCities;
    }
    renderCities();
}

function saveCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
    console.log(localStorage);
}

function getWeather(place) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + place + "&appid=" + key;


    $("#today-weather").empty();
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        cityTitle = $("<h3>").text(response.name + " " + FormatDay());
        $("#todayCity").append(cityTitle);
        var TempetureToNum = parseInt((response.main.temp) * 9 / 5 - 459);
        var cityTemperature = $("<p>").text("Tempeture: " + TempetureToNum + " °F");
        $("#todayTemp").append(cityTemperature);
        var cityHumidity = $("<p>").text("Humidity: " + response.main.humidity + " %");
        $("#todayWind").append(cityHumidity);
        var cityWindSpeed = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");
        $("#todayHumidity").append(cityWindSpeed);
        var CoordLon = response.coord.lon;
        var CoordLat = response.coord.lat;


        var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid=" + key + "&lat=" + CoordLat + "&lon=" + CoordLon;
        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function (responseuv) {
            var todayUV = $("<span>").text(responseuv.value);
            var todayUVp = $("<p>").text("UV Index: ");
            todayUVp.append(todayUV);
            $("#today-weather").append(todayUVp);
            console.log(typeof responseuv.value);
            if (responseuv.value > 0 && responseuv.value <= 2) {
                todayUV.attr("class", "green")
            }
            else if (responseuv.value > 2 && responseuv.value <= 5) {
                todayUV.attr("class", "yellow")
            }
            else if (responseuv.value > 5 && responseuv.value <= 7) {
                todayUV.attr("class", "orange")
            }
            else if (responseuv.value > 7 && responseuv.value <= 10) {
                todayUV.attr("class", "red")
            }
            else {
                todayUV.attr("class", "purple")
            }
        });


        function getForecast(city) {
            var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&APPID=" + APIKey;
            console.log(forecastURL, city);
            $.ajax({
                url: forecastURL,
                method: "GET",
            }).then(function (response) {

                for (let i = 0; i < 5; i++) {
                    var weatherIcon = response.list[i].weather[0].icon;
                    var iconurl = "https://openweathermap.org/img/wn/" + weatherIcon + ".png";
                    $("#date-" + (i + 1)).html(moment().add(1, 'days').format('MM/DD/YYYY') + "<img src=" + iconurl + ">");
                    $("#temp-" + (i + 1)).text("Temp: " + response.list[i].main.temp + "°F");
                    $("#wind-" + (i + 1)).text("Wind: " + response.list[i].wind.speed + "MPH");
                    $("#humidity-" + (i + 1)).text("Humidity: " + response.list[i].main.humidity + "%");
                }


            });
        };

    })};

cities = JSON.parse(localStorage.getItem("cities")) ?? [];

console.log(cities);

cities.forEach(loadCityButton);

function loadCityButton(city){
    var cityButton = $("<button>");
    cityButton.text(city);
    $(".saved-cities").prepend(cityButton);
    cityButton.on("click", function (event) {
        event.preventDefault();
        getWeather(city);
        getForecast(city);
    });
};

function saveCities (city) {
    
    cities.push(city)
    localStorage.setItem("cities", JSON.stringify(cities));
    var value = localStorage.getItem("cities");
    $(".saved-cities").text("")
    cities.forEach(loadCityButton); 
};

searchBtn.on("click", function (event) {
    city = $("#searched-city").val().trim();
    event.preventDefault();
    getCurrentWeather(city);
    getForecast(city);
    saveCity(city);
});
