/* Weather API Task
	Written by Joseph Distler
*/

//Fahrenheit is default
var selection = true;

//JQuery to detect input change and button clicks
$(document).ready(function(){
	
	//input is detected, and checked for validity
	$("#searchBar").on('input',function(e){
		clearDisplays();
		var input = $("#searchBar").val();
		processInput(input);
    });
	
	//buttons for Fahrenheit and Celsius
	//color changes for mouseover, mouseout, and click
	$("#fBut").on('mouseover', function(){
		if(! $("#fBut").hasClass('clicked')){
			$("#fBut").removeClass().addClass('btn btn-default tempButtons');
		}
	});
	$("#fBut").on('mouseout', function(){
		if(! $("#fBut").hasClass('clicked')){
			$("#fBut").removeClass().addClass('btn btn-primary tempButtons');
		}
	});
	$("#fBut").on('click', function(){
		clearDisplays();
		input = $("#searchBar").val();
		processInput(input);
		selection = true;
		$("#fBut").addClass('btn btn-default tempButtons').addClass('clicked');
		$("#cBut").removeClass().addClass('btn btn-success tempButtons');
	});
	
	$("#cBut").on('mouseover', function(){
		if(! $("#cBut").hasClass('clicked')){
			$("#cBut").removeClass().addClass('btn btn-default tempButtons');
		}
	});
	$("#cBut").on('mouseout', function(){
		if(! $("#cBut").hasClass('clicked')){
			$("#cBut").removeClass().addClass('btn btn-success tempButtons');
		}
	});
	$("#cBut").on('click', function(){
		clearDisplays();
		input = $("#searchBar").val();
		processInput(input);
		selection = false;
		$("#cBut").addClass('btn btn-default tempButtons').addClass('clicked');
		$("#fBut").removeClass().addClass('btn btn-primary tempButtons');
	});
	
});

//processes the text input
function processInput(input){
	//input is determined to be zip code, city, or invalid
	if(isZipCode(input)){
		if(input.length === 5){
			//make ajax call
			callAPI(input, selection);
		}
	}
	else if(isCity(input)){
		//make ajax call
		callAPI(input, selection);
	}
	else{
		//invalid input
		$("#warningNote").show();
		$("#alert").html("<h4>Invalid Input</h4>");
		}
}

//checks if string is a number
function isZipCode(input){
	//converts string to number and determines if variable is valid
	var zip = Number(input);
	if(isNaN(zip) || input.length > 5){
		return false;
	}
	return true;
}

//checks that string has no numbers
function isCity(input){
	//regex to find numbers in string
	var numbers = input.match(/\d+/g);
	if(numbers === null){
		return true;
	}
	if(numbers.length > 0){
		return false;
	}
	return true;
}

//API Call
function callAPI(input){
	//ajax url call with JSON result
	var url = "http://api.worldweatheronline.com/free/v1/weather.ashx?q={"+input+"}&format=json&num_of_days=3&key=4925da30d1aa95a1460e52de2c833d6c18fbba28";
	$.ajax({url: url, success: function(result){
        processWeather(result);
    }});
}

//processes API call data
function processWeather(data){
	//will store relevant weather data
	var loc;
	var tempNow;
	var maxTempLater = [];
	var minTempLater = [];
	var descr = [];
	var url = [];
	var dates = [];
	
	//stores Fahrenheit or Celsius, depending on button selection
	if(selection){
		tempNow = data.data.current_condition[0].temp_F;
		
		maxTempLater.push(data.data.weather[1].tempMaxF);
		minTempLater.push(data.data.weather[1].tempMinF);
		
		maxTempLater.push(data.data.weather[2].tempMaxF);
		minTempLater.push(data.data.weather[2].tempMinF);
	}
	else{
		tempNow = data.data.current_condition[0].temp_C;
		
		maxTempLater.push(data.data.weather[1].tempMaxC);
		minTempLater.push(data.data.weather[1].tempMinC);
		
		maxTempLater.push(data.data.weather[2].tempMaxC);
		minTempLater.push(data.data.weather[2].tempMinC);
	}
	//rest of the relevant data is added to arrays
	descr.push(data.data.current_condition[0].weatherDesc[0].value);
	descr.push(data.data.weather[1].weatherDesc[0].value);
	descr.push(data.data.weather[2].weatherDesc[0].value);
	
	url.push(data.data.current_condition[0].weatherIconUrl[0].value);
	url.push(data.data.weather[1].weatherIconUrl[0].value);
	url.push(data.data.weather[2].weatherIconUrl[0].value);
	
	dates.push(data.data.weather[0].date);
	dates.push(data.data.weather[1].date);
	dates.push(data.data.weather[2].date);
	
	loc = data.data.request[0].query;
	
	displayWeather(tempNow, maxTempLater, minTempLater, descr, url, dates, loc)
}

//Uses Jquery to display weather data
function displayWeather(tempNow, maxLater, minLater, descr, url, dates, loc){
	var type = "F";
	if(!selection){
		type = "C";
	}
	clearDisplays();
	$("#location").show();
	$("#location").html("<h3>"+loc+"</h3>");
	$("#weatherBox").show();
	$("#weatherBox").append("<div class='col-md-3'></div>");
	$("#weatherBox").append("<div class='col-md-2' class='weatherContent'><h3 class='weatherText'>Current</h3>"+"<br /><h4 class='weatherText'>&nbsp;</h4><br /><h4 class='weatherText'>"+tempNow+"&deg; "+type+"</h4><br /><img class='weatherIcon' src='"+url[0]+"' />"+"<br /><h4>"+descr[0]+"</h4></div>");
	$("#weatherBox").append("<div class='col-md-2' class='weatherContent'><h3 class='weatherText'>"+dates[1]+"</h3>"+"<br /><h4 class='weatherText'>Max: "+maxLater[0]+"&deg; "+type+"</h4><br /><h4 class='weatherText'>Min: "+minLater[0]+"&deg; "+type+"</h4><br /><img class='weatherIcon' src='"+url[1]+"' />"+"<br /><h4>"+descr[1]+"</h4></div>");
	$("#weatherBox").append("<div class='col-md-2' class='weatherContent'><h3 class='weatherText'>"+dates[2]+"</h3>"+"<br /><h4 class='weatherText'>Max: "+maxLater[1]+"&deg; "+type+"</h4><br /><h4 class='weatherText'>Min: "+minLater[1]+"&deg; "+type+"</h4><br /><img class='weatherIcon' src='"+url[2]+"' />"+"<br /><h4>"+descr[2]+"</h4></div>");
}

//empties every display box to not overlap weather data
function clearDisplays(){
	$("#location").hide();
	$("#location").html('');
	$("#weatherBox").hide();
	$("#weatherBox").html('');
	$("#warningNote").hide();
	$("#alert").html("");
}