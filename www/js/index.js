
ons.ready(function() {
  	/* Javascript for device api here... */
  	console.log('\n-------------\nDEVICE READY');

  	//Put stuff in here that uses the phonegap plugins
  	//geo location (gps) etc
	
}); 

//global variables
var placeMap = '';

///////////////////////////////////////////////
//PAGE Watchers - must live outside of ons.ready function
//WATCH FOR PAGE 1 TO Load
//once it loads do stuff inside it
document.addEventListener('init', function(event) {
  if (event.target.matches('#page1')) {

    ons.notification.alert('Page 1 is initiated.');
    
  }
}, false);
//END WATCH FOR PAGE 1 TO Load


//WATCH FOR PAGE 2 TO Load
//add content into it
document.addEventListener('init', function(event) {
  if (event.target.matches('#page2')) {

  	//page 2 is initiated so now do stuff
    ons.notification.alert('Page 2 is initiated.');

    //get data content passed by the map pin / pushPage action
    document.querySelector('#output-zero').innerHTML = event.target.data.content;

    // EG**** retrieve data - get all the firebase data when page 2 loads
   	var getAllData = firebase.database().ref('stories');
	getAllData.on('value', showMeTheData); //send data to showMeTheData()

  }
}, false);



/////////////////////////////////////////////////
// Initialize Firebase for the whole app
// only do this once
// but retieve data as often as you like EG****
var config = {
    apiKey: "AIzaSyDOoUezKPivRQbKI_dBpQC7X4aUB0vit_I",
    authDomain: "audio-retrieve-test.firebaseapp.com",
    databaseURL: "https://audio-retrieve-test.firebaseio.com",
    projectId: "audio-retrieve-test",
    storageBucket: "audio-retrieve-test.appspot.com",
    messagingSenderId: "899690313623"
};
firebase.initializeApp(config);


///////////////////////////////////////////////////////
//FUNCTIONS LIBRARY

//GET FIREBASE DATA
function showMeTheData(data) {
	var allData = data.val();
	var keys = Object.keys(allData);
	//console all data
	console.log(JSON.stringify(allData));

	//show the first name and title
	var x = keys[0];
	document.querySelector('#output-one').innerHTML = "I am from the function 'showMeTheData': " + allData[x].name + ": " + allData[x].title;
	
	//show everything
	for (var i = 0; i < keys.length; i++) {
	  	var k = keys[i];
	    var title = allData[k].title;
	    var name = allData[k].name;
	    var longitude = allData[k].longitude;
	    var latitude = allData[k].latitude;
	    //console.log(title, name, longitude, latitude);
	    createPara(name, title, latitude, longitude);
	    createPlayBtn(allData[k].audioFile, name);
	  }
}

//CREATE MAP
//get firebase data from INSIDE the map function
//map loads first, 
//then gets the firebase data
//then add the markers using the data.
//Any other order will trigger errors
function initMap() {
	var bristol = {lat: 51.447659, lng: -2.598238};

	//global
	placeMap = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: bristol
	});

  	var getData = firebase.database().ref('stories');
	getData.on('value', gotData);

	function gotData(data) {
	  var stories = data.val();
	  var keys = Object.keys(stories);
	  for (var i = 0; i < keys.length; i++) {
	  	var k = keys[i];
	    var title = stories[k].title;
	    var name = stories[k].name;
	    var longitude = stories[k].longitude;
	    var latitude = stories[k].latitude;
		putMarker(latitude, longitude, name, title);
	  }
	}
}

//ADD MARKER
function putMarker(markerLat, markerLng, storyName, storyTitle) {
  console.log('putMarker');
  var storyPin = {lat: markerLat, lng: markerLng};
  console.log(markerLat, markerLng);
  var marker = new google.maps.Marker({
    position: storyPin,
    map: placeMap
  });
  google.maps.event.addListener(marker, "click", function(){
  	var myNavigator = document.querySelector('ons-navigator');
  	//pass data to page2 and navigate there
    myNavigator.pushPage('page2.html', {data: {content: 'I am data passed from the map pin / pushPage: ' + storyName + ', ' + storyTitle} });
  });
}


//create and output paragraph tag with all the data inside it
//this runs for every iteration of the loop
function createPara(name, title, lat, lng) {
  //create <p>
  var p = document.createElement('p');
  p.id = name;
  p.innerHTML = name + "<br>" + title + ", LatLng:" + lat  + ", " +  lng;
  document.getElementById('output-two').appendChild(p);  //attach it to the div id=output
}

//create random unique string for the id of each button
function makeId() {
	var uniqueId = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
	return uniqueId;
}


//create a button to play audio - for testing
function createPlayBtn(filepath, name){
  //make random string
  var uniqueId = makeId();
  //create <button>
  var button = document.createElement('button');
  button.textContent = "play " + name + "'s audio";
  button.setAttribute('class', 'button');
  button.id = uniqueId + "-audio";
  //attach <button> it to the <div id='output'>
  document.getElementById('output-two').appendChild(button);  
  //make an event listener for each button to listen for a click (show alert and play audio)
  document.getElementById(uniqueId + "-audio").addEventListener('click', function(){
  	ons.notification.alert('This will play ' + name + "'s audio");
  	playAudio(filepath);
  });
}



//play the remote m4a file
//uses the cordova-plugin-media
function playAudio(filepath){
	var myMedia = new Media(filepath);
	myMedia.play({ playAudioWhenScreenIsLocked : true });
	myMedia.setVolume('1.0');
}