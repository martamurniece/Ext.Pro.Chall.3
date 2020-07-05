var elevator, infoWindow;
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: 63.333, lng: -150.5},  // Denali.
    mapTypeId: 'terrain'
  });
   elevator = new google.maps.ElevationService();
   infoWindow = new google.maps.InfoWindow({map: map});

  map.addListener('click', function(event) {
    displayLocationElevation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
  });
}
function displayLocationElevation(location) {
  fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+location.lat+"&lon="+location.lng+"&exclude=minutely,daily&appid=2763a53e6f8a155a616bb0bc4713d94e")
  .then((blob) => blob.json())
    .then((data) => {
      document.getElementById("current-temperature").innerHTML = "Temp: "+Math.round((data.current.temp -273) * 100) / 100;
      document.getElementById("current-humidity").innerHTML = "Humidity: "+data.current.humidity;
      document.getElementById("current-clouds").innerHTML = "Clouds: "+data.current.clouds+"%";
      document.getElementById("current-wind").innerHTML = "Wind: "+data.current.wind_speed+"m/s "+data.current.wind_deg+"°";

      document.getElementById("hourly").innerHTML = "";
      data.hourly.forEach(hourData => {
        var el = document.createElement("div");
        el.id = hourData.dt;
        el.onclick=function(){
          if(el.classList.contains("waving")){
            el.classList.remove("waving");
          }else{
          el.classList.add("waving");
          }
        }
        var time = document.createElement("h4");
        time.innerHTML = new Date(hourData.dt*1000).toLocaleTimeString();
        var temp = document.createElement("div");
        temp.innerHTML = "Temp: " + Math.round((hourData.temp - 273) * 100) / 100+"°C";
        var humidity = document.createElement("div");
        humidity.innerHTML = "Humidity: " + hourData.humidity+"%";
        var clouds = document.createElement("div");
        clouds.innerHTML = "Clouds: " + hourData.clouds+"%";
        var wind = document.createElement("div");
        wind.innerHTML = "Wind: " + hourData.wind_speed + "m/s " + hourData.wind_deg + "°";
        el.append(time);
        el.append(temp);
        el.append(humidity);
        el.append(clouds);
        el.append(wind);
        document.getElementById("hourly").append(el);
      });
  });
  elevator.getElevationForLocations({locations: [location]},function (results, status) {
      infoWindow.setPosition(location);
      if (status === "OK") {
        if (results[0]) {
            infoWindow.setContent("The elevation at this point <br>is " +results[0].elevation +" meters."
          );
        } else {
          infoWindow.setContent("No results found");
        }
      } else {
        infoWindow.setContent("Elevation service failed due to: " + status);
      }
    }
  );
}
