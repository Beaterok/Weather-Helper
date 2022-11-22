var todayElem = document.querySelector('#today');
var fivDayElem = document.querySelector('#fiveday');
var Button = document.querySelector(".btn");
var cityInput = document.getElementById("City");
var key = "6d2d5b2f71684076879fc714e10410de";
var city = "Charlotte";
var state;
var country;
var limit;


// var weather = "http://api.openweathermap.org/geo/1.0/direct?q="+city+","+state+","+country+"&limit="+limit+"&appid="+key;
var getInput = function () {
    var oldLi = document.querySelectorAll('.card')
    for (let i = 0; i < oldLi.length; i++) {
        oldLi[i].remove();
        
    }
city = cityInput.value;
console.log("TEST" + city);
getCoordinates(city);
}
var getCoordinates = function (city) {

    var coordinates = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + key;
    fetch(coordinates)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var lon = data[0].lon;
            var lat = data[0].lat;
            var i = 0;
            console.log("Coordinates:" + lon + ", " + lat)
            getChosenCity(lon, lat, i, todayElem);
            displayFive(lon, lat, i, fivDayElem);
            saveHistory(city);
        }).catch((error) => {
            console.log(error)
            window.alert("Can't find that city, Check spelling.")
          });
}

var getChosenCity = function (lon, lat, i, Elem) {
    var chosenCity = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + key;

    fetch(chosenCity)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            //   console.log("Date: "+data.list[i].dt_txt)
            //   console.log("Temp: "+data.list[i].main.temp)
            //   console.log("Wind Speed: "+data.list[i].wind.speed)
            //   console.log("Humidity: "+data.list[i].main.humidity)
            city = data.city.name;
            var date = data.list[i].dt_txt;
            date = date.slice(0, -8)
            var sun = data.list[i].weather[0].main;
            var temp = data.list[i].main.temp;
            temp = (temp - 273.15) * 9 / 5 + 32;
            temp = Math.round(10 * temp) / 10;
            var wsp = data.list[i].wind.speed;
            var hmd = data.list[i].main.humidity;
            var info = [city, date, sun, temp, wsp, hmd]
            displayToday(info, Elem);
        });
}
var displayToday = function (info, Elem) {
    var bInfo = ["", "Date: ", "Weather: ", "Temperature: ", "Wind Speed: ", "Humidity: ",]
    var aInfo = ["", "", "", " °F", " MPH", "%",]


    ul = document.createElement('div');
    ul.setAttribute("class", "card col")
    Elem.appendChild(ul);
    title = document.createElement('h3')
    title.textContent = info[0];
    title.setAttribute('class',"card-title")
    ul.appendChild(title);
    for (var i = 1; i < info.length; i++) {
        var lines = bInfo[i] + info[i] + aInfo[i];
        li = document.createElement("li");

        li.textContent = lines;
        li.setAttribute("class", 'list-group-item');

        ul.appendChild(li);
    }
}

var displayFive = function (lon, lat, i, Elem) {

    for (let index = 0; index < 5; index++) {

        getChosenCity(lon, lat, i, Elem);
        i = i + 8;
    }

}

var saveHistory= function(city) {
    var citySearchHistory = city;
    localStorage.setItem('searchHistory', JSON.stringify(citySearchHistory))
    createButton(city);
}

function createButton(city) {
    var createBtn = document.createElement('button')
    var prevCities = document.getElementById('History')
    createBtn.textContent = city;
    prevCities.appendChild(createBtn);
    createBtn.addEventListener("click", function(event){
        var btnCity = event.textContent;
        event.preventDefault();
        getCoordinates(btnCity);

    })
    createBtn.setAttribute('class',"w-100 btn btn-secondary btn-lg btn-block")
    createBtn.setAttribute('id',city)
}

function renderLastRegistered() {
    var citySearchHistory = localStorage.getItem('searchHistory');
    var storedCities = JSON.parse(citySearchHistory)
        createButton(localStorage.getItem(storedCities))
        console.log(storedCities)
};

renderLastRegistered();
Button.addEventListener('click', getInput);
console.log(localStorage.getItem('searchHistory'))