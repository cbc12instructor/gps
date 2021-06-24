let coords;
let oldLat;
let oldLong;

// helper function to provide deg2radians
Number.prototype.deg2rad = function() {
	return this * (Math.PI / 180);
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

	console.log(typeof coords2.latitude);
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

	oldLat  = parseFloat(document.getElementById('oldlat').innerText);
	oldLong = parseFloat(document.getElementById('oldlong').innerText);

	// when we load the page, get the coordinates and store it in an object
	navigator.geolocation.getCurrentPosition(function(geo) {

		// display the lat/lng in our #lat #long spans
		console.log('current position running');
		coords = geo.coords;

		document.getElementById('lat').innerHTML = coords.latitude;
		document.getElementById('long').innerHTML = coords.longitude;

		//getDistanceFromLatLonInKm(oldLat, oldLong, coords.latitude, coords.longitude);
		var oldCoords = { 
			'latitude': oldLat, 
			'longitude': oldLong 
		};
		console.log('distance: ', getDistance(coords, oldCoords, 'meters'));
	});



});