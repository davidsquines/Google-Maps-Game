let map;
let marker;
var chicano_bdg = {lat: 34.2427, lng: -118.5317}
const theTimer = document.querySelector(".timer");
const startButton = document.querySelector("#start");
const resetButton = document.querySelector("#reset");
const prompt = document.getElementById("prompt");
const display = document.getElementsByClassName('target');
var turn = 1;
var a1 = document.getElementById("a1");
var a2 = document.getElementById("a2");
var a3 = document.getElementById("a3");
var a4 = document.getElementById("a4");
var a5 = document.getElementById("a5");

var endResult = document.getElementById("result");
var endScore = document.getElementById("score");
var timeElapsed = document.getElementById("time-elapsed");
var promptedLocation = document.getElementById("location");



//define locations in CSUN for user to find
let locations = [];
var winning_location;
var location_place = 0;
var ans = false;
var gameStart = true;
var score = 0;
var timer = [0,0,0,0];
var interval;
var startGame = false;

//define locations in CSUN for user to find
//This defines the path of the polygon that represents the building
const oviatt = [
    { lat: 34.2404, lng: -118.5286 }, //top right
    { lat: 34.2404, lng: -118.5300}, //top left
    { lat: 34.2396, lng: -118.5300 }, //bottom left
    { lat: 34.2396, lng: -118.5286}, //bottom right
];
const src = [
    { lat: 34.2406, lng:  -118.5247 }, //top right
    { lat: 34.2406, lng: -118.52512}, //top left
    { lat: 34.2392, lng: -118.5251 }, //bottom left
    { lat: 34.2392, lng:-118.5247 }, //bottom right
];
const chicano = [
    { lat: 34.24257, lng: -118.5298 }, //top right
    { lat: 34.24257, lng: -118.5300}, //top left
    { lat: 34.2423, lng: -118.5300 }, //bottom left
    { lat: 34.2423, lng: -118.5298}, //bottom right
];
const jacaranda = [
    { lat: 34.24207, lng: -118.5278 }, //top right
    { lat: 34.24207, lng: -118.5294}, //top left
    { lat: 34.24103, lng: -118.5294 }, //bottom left
    { lat: 34.24103, lng: -118.5278}, //bottom right
];
const sierra = [
    { lat: 34.2384, lng: -118.5300 }, //top right
    { lat: 34.2384, lng: -118.5313}, //top left
    { lat: 34.2381, lng:-118.5313 }, //bottom left
    { lat: 34.2381, lng: -118.5300}, //bottom right
];
locations = [oviatt, src, chicano, jacaranda, sierra]

function initMap(){
    //This creates a new map on which the user will play their game
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 34.2400, lng: -118.5293 },
        zoom: 16.85,
        disableDefaultUI: true,
        zoomControl: false,
        rotateControl: false,
        scrollwheel: false,
        keyboardShortcuts: false,
        mapId: '3655a8ca8305f374',
        gestureHandling: "none",
        
    });
    
    //This method adds a listener to that map. The function will execute when the user double clicks on the map     
    google.maps.event.addListener(map, "dblclick", (e) => {
        console.log(e.latLng.lat() + " " + e.latLng.lng());
        //This constructs a polygon based on the latitude and longiture coordinates given on in the locations array
        let userInput = new google.maps.Polygon({ 
            paths: locations[location_place],
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            });
        //containsLocation will return a bool based on if the double click of the user was on the right location
        const result = google.maps.geometry.poly.containsLocation(
            e.latLng,
            userInput
        )
            ? true
            : false;
        if(result){
            userInput.fillColor = "#00FF00";
            userInput.strokeColor = "#00FF00";
            ans = true
            
        }
        else{
            ans = false
            userInput.fillColor = "#ff0000";
            userInput.strokeColor = "#ff0000";
        }
        userInput.setMap(map);
        if(gameStart){
            interval = setInterval(runTimer,10)
            runTimer();
            gameStart = false;
        }
        
        
        updateLocation();
        renderNextQuestion();
        if(turn === 6 && !gameStart){
            endGame();
            clearInterval(interval);
            interval = null;
        }

      });
    map.addListener(map,'click', function(e){
        console.log(e.latLng.lat() + " " + e.latLng.lng());
    })
   
}

function printLocation(e){
    if(e){
        prompt.innerHTML = "yes";
    }
    else{
        prompt.innerHTML = "no";
    }
  
}

//This function renders the next location to find onto the html file
//Turn is used to keep track of what turn the user is on. When the turn has passed six, then the game is over
//All the answers are shown as a_x. The next one is loaded when the previous location was found or not found.
function renderNextQuestion(){
    let res = "You got it right";
    if(!ans){
        res = "You got it wrong";
    }
    switch(turn){
        case 1:
            if(ans){
                a1.style.color = "green";
            }
            else{
                a1.style.color = "red";
            }
            a1.innerHTML += "Oviatt Library: " + res;
            promptedLocation.innerHTML = "Student Recrational Center";
        break;
        case 2:
            if(ans){
                a2.style.color = "green";
            }
            else{
                a2.style.color = "red";
            }
            a2.innerHTML = "Student Reacreational Center: " + res;
            promptedLocation.innerHTML = "Chicano house";
        break;
        case 3:
            if(ans){
                a3.style.color = "green";
               
            }
            else{
                a3.style.color = "red";
            }
            a3.innerHTML = "Chicano house: " + res;
            promptedLocation.innerHTML = "Jacaranda House?";
        break;
        case 4:
            if(ans){
                a4.style.color = "green";
            }
            else{
                a4.style.color = "red";
            }
            a4.innerHTML = "Jacaranda House: " + res;
            promptedLocation.innerHTML = "Sierra Hall?";
        break;
        case 5:
            if(ans){
                a5.style.color = "green";
            }
            else{
                a5.style.color = "red";
            }
            a5.innerHTML = "Sierra Hall: "+res;
            
        break;
    }
    turn++;
    if(ans) {
        score++;
    }
    console.log("score" + score);
   
    console.log(turn);

}


//This function will update the location that the user has to find.
function updateLocation(){
    winning_location = locations[location_place];
    if(location_place < locations.length -1){
        location_place++;
    }else {
        location_place = 0;
    }
   
}
//adds leading zeros to the timer
function addLeadingZeros(time){
    if(time <=9){
        time = "0" + time;
    }
    return time;
}
//function needed to start the timer
function runTimer(){
    let currentTimer = addLeadingZeros(timer[0]) + ":" + addLeadingZeros(timer[1]) + ":" + addLeadingZeros(timer[2]);
    theTimer.innerHTML = currentTimer;
    timer[3]++;

    timer[0] = Math.floor((timer[3]/100)/60);
    timer[1] = Math.floor((timer[3]/100) - (timer[0] * 60));
    timer[2] = Math.floor(timer[3] - (timer[1] * 100) - (timer[0] * 6000));

   
}
//This function will return the proper results to the webpage
function endGame(){
    endScore.innerHTML += score + "/5";
    timeElapsed.innerHTML += addLeadingZeros(timer[0]) + ":" + addLeadingZeros(timer[1]) + ":" + addLeadingZeros(timer[2] - 1) ;   
    console.log("end game");

}
