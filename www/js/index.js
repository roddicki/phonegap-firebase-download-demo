
ons.ready(function() {
  	/* Javascript for device api here... */
  	console.log('\n-------------\nDEVICE READY');

	// Initialize Firebase
	var config = {
		apiKey: "",
		authDomain: "",
		databaseURL: "",
		projectId: "",
		storageBucket: "",
		messagingSenderId: ""
	};
	firebase.initializeApp(config);
	console.log(firebase);

	var database = firebase.database();
	var ref = database.ref('stories');
	ref.on('value', gotData, errData);


	function gotData(data) {
	  //console.log(data.val());
	  var stories = data.val();
	  var keys = Object.keys(stories);
	  console.log(keys);
	  for (var i = 0; i < keys.length; i++) {
	    var k = keys[i];
	    var title = stories[k].title;
	    var name = stories[k].name;
	    var longitude = stories[k].longitude;
	    var latitude = stories[k].latitude;
	    console.log(title, name, longitude, latitude);
	    console.log(JSON.stringify(stories[k]));
	    createPara(name, title, latitude, longitude);
	    createPlayBtn(stories[k].audioFile, name);
	  }
	}

	function errData(err) {
	  console.log("Error!");
	  console.log(err);
	}

	//create and output paragraph tag with all the data inside it
	//this runs for every iteration of the loop
	function createPara(name, title, lat, lng) {
	  //create <p>
	  var p = document.createElement('p');
	  p.id = name;
	  p.innerHTML = name + "<br>" + title + ", LatLng:" + lat  + ", " +  lng;
	  document.getElementById('output').appendChild(p);  //attach it to the div id=output
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
	  document.getElementById('output').appendChild(button);  
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
	


});

