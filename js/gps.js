let coords;
let oldLat;
let oldLong;

/*
let shots = [
	{ coords, timestamp, distance },
	{ coords, timestamp, distance }
];
*/
let game  = [];
let shots = [];

// getCoords is going to return either real coordinates, or fake ones if I'm computer
function getCoords() {

	// use real coords in the future
	// in the future use this -> navigator.geolocation.getCurrentPosition(function(geo) { })
	return { 
		latitude: '' + 33.501 + parseInt(Math.random() * 1000),
		longitude: '' + -82.51 + parseInt(Math.random() * 1000)
	}
}

function endGame() {
	// store our game object in localStorage (or a database)
	localStorage.setItem('gameData', JSON.stringify(game));

	// clear out our page information
	// clear out our local variables
}

function updateScoreCard(shots) {

	// #scorecard (<ol>) element needs to be updated
	let numShots = shots.length;

	// get longest drive
	let longestDrive = 0;
	for ( var i = 0; i < shots.length; i++ ) {
		if ( shots[i].distance > longestDrive ) {
			longestDrive = shots[i].distance;
		}
	}

	// create a new <li> and add it to our #scorecard <ol>
	let el = document.createElement('li');
	el.innerHTML = shots.length + ' shots <small>' + Math.floor(longestDrive) + '</small>';
	document.getElementById('scorecard').appendChild(el);

}

// nextHole is meant to be used _AT_ the pin
// stores the shots of the hole, clears the shots array,
// and stores/displays this info
function nextHole() {
	console.log('Going into hole...');
	document.getElementById('currentHole').innerHTML = game.length + 2;
	document.getElementById('currentShot').innerHTML = 1;
	


	// nextHole is called at the flag. use this coordinate
	// to calculate the length of our final putt
	let shotInfo = getCoords();
	let shotDistance = getDistance( shots[ shots.length - 1], shotInfo);
	shots[ shots.length - 1 ].distance = shotDistance;

	// take current shots and store in game array
	game.push(shots);

	// TODO - update the page to display our scorecard
	updateScoreCard(shots);

	// clear shots[]
	shots = [];
}


// stores the shot information inside a hole
function processShot(event) {
	document.getElementById('currentShot').innerHTML = shots.length + 2;
	document.getElementById('score').innerHTML = 
		parseInt(document.getElementById('score').innerHTML) + 1;

	// get the current coords
	let shotInfo = getCoords();
	shotInfo.shotType = 'putt';
	
	// TODO - store the timestamp?

	// if there is a previous location -- calculate the distance
	if ( shots.length ) {
		// calculate the distance of the previous shot
		// getDistance(coords1, coords2, units)
		// shots.length - 1
		let shotDistance = getDistance( shots[ shots.length - 1], shotInfo);
		//console.log(shotDistance);
		// store the distance in the previous shot.
		if ( shots[ shots.length - 1 ].shotType == 'putt' ) {
			// shot in feet instead of yards
			// 
		}
		shots[ shots.length - 1 ].distance = shotDistance;

		// TODO - this is working, but we're not calculating the distance on
		// the final shot
	}

	shots.push(shotInfo);
}


// helper function to provide deg2radians
Number.prototype.deg2rad = function() {
	return this * (Math.PI / 180);
}
String.prototype.deg2rad = function() {
	return parseFloat(this).deg2rad();
}

Number.prototype.milesToYards = function() {
	return (this * 5280) / 3;
}

// HAVERSINE distance calculation -
// https://en.wikipedia.org/wiki/Haversine_formula
//
// get distance between two points in yards
// 3 feet in a yard -- magic radius of earth in miles 3958.8
// 6371 -- magic radius of earth in km
// units is optional and means meters or yards
function getDistance(coords1, coords2, units) {
	var radius = 3958.8;
	// if units is provided and says meters, we use a different magic number
	if ( units != undefined && units == 'meters' ) {
		radius = 6371;
	}

	var degLat = (coords2.latitude - coords1.latitude).deg2rad();
	var degLong = (coords2.longitude - coords1.longitude).deg2rad();

	//console.log(typeof coords2.latitude);
	var a = 
	  Math.sin(degLat/2) * Math.sin(degLat/2) +
	  Math.cos(coords1.latitude.deg2rad()) * Math.cos(coords2.latitude.deg2rad()) * 
	  Math.sin(degLong/2) * Math.sin(degLong/2); 

	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 

	if ( units != undefined && units == 'meters' ) {
		return (radius * c) * 1000;
	} else { // default is yards
		return (radius * c).milesToYards();
	}
	
}

document.addEventListener('DOMContentLoaded', function() {

	// attach an event on our button
	document.getElementById('shot').addEventListener('click', processShot);
	document.getElementById('nextHole').addEventListener('click', nextHole);

	oldLat  = parseFloat(document.getElementById('oldlat').innerText);
	oldLong = parseFloat(document.getElementById('oldlong').innerText);

	// when we load the page, get the coordinates and store it in an object
	navigator.geolocation.getCurrentPosition(function(geo) {

		// display the lat/lng in our #lat #long spans
		//console.log('current position running');
		coords = geo.coords;

		document.getElementById('lat').innerHTML = coords.latitude;
		document.getElementById('long').innerHTML = coords.longitude;

		//getDistanceFromLatLonInKm(oldLat, oldLong, coords.latitude, coords.longitude);
		var oldCoords = { 
			'latitude': oldLat, 
			'longitude': oldLong 
		};
		//console.log('distance: ', getDistance(coords, oldCoords));
	});



});