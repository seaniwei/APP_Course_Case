$(document).ready(function() {
    
    // 選擇縣市 button function
    $("#btn_city01").click(function(){
		$("#city").text("新北市");
		$("#date").text("10/31");
        $(".collapse").collapse("hide");  // hide collapse 收起
    });
    $("#btn_city02").click(function(){
		$("#city").text("台北市");
		$("#date").text("10/31");
        $(".collapse").collapse('hide');  // hide collapse 收起
    });
    $("#btn_city03").click(function(){
        $("#city").text("桃園市");
		$("#date").text("10/31");
        $(".collapse").collapse('hide');  // hide collapse 收起
    });
    $("#btn_city04").click(function(){
		$("#city").text("新竹市");
		$("#date").text("10/31");
        $(".collapse").collapse('hide');  // hide collapse 收起
    });
	$("#btn_city05").click(function(){
		$("#city").text("台中市");
		$("#date").text("10/31");
        $(".collapse").collapse('hide');  // hide collapse 收起
    });
	$("#btn_city06").click(function(){
		getWeather();
		$("#city").text("高雄市");
		$("#date").text("10/31");
        $(".collapse").collapse('hide');  // hide collapse 收起
    });
	

    function getWeather() {
        var lat;
        var lon;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            alert("Geolocation services are not supported.");
        }

        function success(position) {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            var reversegeocodingapi = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+"%2C"+lon;
            $.getJSON(reversegeocodingapi, function(place) {
                for (var i=0; i<place.results[0].address_components.length; i++) {
                    if (place.results[0].address_components[i].types[0]==="locality") {
                        var city = place.results[0].address_components[i].long_name;
                        $("#city").html(city.toUpperCase());
                    }
                    if (place.results[0].address_components[i].types[0]==="administrative_area_level_1") {
                        var state = place.results[0].address_components[i].long_name;
                        $("#state").html(state.toUpperCase());
                    }
                }
            }); //end getJSON()
            getWeatherData(lat, lon);
        } //end success()
        
        function error() {
            alert("Geolocation fail.");
        }
    }  //end getWeather()



  function getWeatherData(latitude, longitude) {
    var weatherapiurl = "https://api.forecast.io/forecast/014dd470e25bffea4a246375af37ba17/"+latitude+","+longitude+"?callback=?"
    $.getJSON(weatherapiurl, function(weatherdata) {
      var tempf = Math.round(weatherdata.currently.temperature);
      $("#temp").html(tempf + "°");
      var tempc = Math.round(((weatherdata.currently.temperature)-32)/(9/5));
      var feelslikef = Math.round(weatherdata.currently.apparentTemperature);
      $("#feels-like").html("體感溫度: " + feelslikef + "°F");
      var feelslikec =  Math.round(((weatherdata.currently.apparentTemperature)-32)/(9/5));
      var summary = weatherdata.currently.summary;
      $("#weather-description").html(summary);
      //skycons
      var icon = weatherdata.currently.icon;
      var skycons = new Skycons({"color": "#A9DD9B"});
      skycons.set("weather-icon", icon);
      skycons.play();


      //3-DAY FORECAST
      //convert future dates (given in API by seconds since Jan 1 1970) to day of the week
      var weekday = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]; //to find day of the week
      var dayArray = []; //to store days of the week
      var iconArray = []; //to store icon values
      var tempMaxArray = []; //to store max temps
      var tempMinArray = []; //to store min temps
      var precipArray = []; //to store precipitation probability
      //first, create function to get all the information
      function weatherInfo() {
        var time = weatherdata.daily.data[i].time;
        var date = new Date(time*1000);
        day = weekday[date.getDay()];
        dayArray.push(day);
        var weatherIcon = weatherdata.daily.data[i].icon;
        iconArray.push(weatherIcon);
        var tempMax = weatherdata.daily.data[i].temperatureMax;
        tempMaxArray.push(tempMax);
        var tempMin = weatherdata.daily.data[i].temperatureMin;
        tempMinArray.push(tempMin);
        var precip = weatherdata.daily.data[i].precipProbability;
        precipArray.push(precip);
      };
      //if it's before 6am (but after midnight), run the function as if later that day = "tomorrow" (so if it's 4am on a Sunday, Sunday will still show up as the first day in the forecast)
      var now = new Date();
      var hour = now.getHours();
      if (hour < 6) {
        for (var i=0; i<3; i++) {
          weatherInfo();
        };
      } else {
        for (var i=1; i<4; i++) {
          weatherInfo();
        };
      };

      //put weekdays into html
      $("#day2").html(dayArray[0]);
      $("#day3").html(dayArray[1]);
      $("#day4").html(dayArray[2]);
      //put icons into html
      skycons.set("weather-icon-day2", iconArray[0]);
      skycons.set("weather-icon-day3", iconArray[1]);
      skycons.set("weather-icon-day4", iconArray[2]);
      //put highs and lows into html
      $("#day2-high-low").html(Math.round(tempMaxArray[0]) + "/" + Math.round(tempMinArray[0])+"°F");
      $("#day3-high-low").html(Math.round(tempMaxArray[1]) + "/" + Math.round(tempMinArray[1])+"°F");
      $("#day4-high-low").html(Math.round(tempMaxArray[2]) + "/" + Math.round(tempMinArray[2])+"°F");
      //put chance of precipitation into html
      $("#day2-precip").html((Math.round(precipArray[0]*10)/10)*100 + "%");
      $("#day3-precip").html((Math.round(precipArray[1]*10)/10)*100 + "%");
      $("#day4-precip").html((Math.round(precipArray[2]*10)/10)*100 + "%");


      //toggle between F and C for every temperature
      $("#cbutton").click(function(event) {
        $("#temp").html(tempc + "°");
        $("#feels-like").html("體感溫度: " + feelslikec + "°C");
        $("#day2-high-low").html(Math.round(((tempMaxArray[0])-32)*(5/9))+"/"+Math.round(((tempMinArray[0])-32)*(5/9))+"°C");
        $("#day3-high-low").html(Math.round(((tempMaxArray[1])-32)*(5/9))+"/"+Math.round(((tempMinArray[1])-32)*(5/9))+"°C");
        $("#day4-high-low").html(Math.round(((tempMaxArray[2])-32)*(5/9))+"/"+Math.round(((tempMinArray[2])-32)*(5/9))+"°C");
      });//end c click
      //f click
      $("#fbutton").click(function(event) {
        $("#temp").html(tempf + "°");
        $("#feels-like").html("體感溫度: " + feelslikef + "°F");
        $("#day2-high-low").html(Math.round(tempMaxArray[0])+"/"+Math.round(tempMinArray[0])+"°F");
        $("#day3-high-low").html(Math.round(tempMaxArray[1])+"/"+Math.round(tempMinArray[1])+"°F");
        $("#day4-high-low").html(Math.round(tempMaxArray[2])+"/"+Math.round(tempMinArray[2])+"°F");
      });//end f click
    }); //end getJSON
  }; //end getWeatherData
  
    //getWeather();  // Call getWeather() Function
}); //end ready
