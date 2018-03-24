
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
	    createAudio(stories[k].audioFile);
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
	  var p = document.createElement('p');
	  p.id = name;
	  p.innerHTML = name + "<br>" + title + ", LatLng:" + lat  + ", " +  lng;
	  document.getElementById('output').appendChild(p);  //attach it to the div id=output
	}

	//create and output audio tag 
	//this runs for every iteration of the loop
	function createAudio(filepath){
	  var audio = document.createElement('audio');
	  var source = document.createElement('source');
	  source.src = filepath;
	  source.type = "audio/mp4";
	  audio.controls = "true";
	  audio.appendChild(source);
	  document.getElementById('output').appendChild(audio); //attach it to the div id=output         
	}

	//create a play audio button - for testing
	//uses the cordova-plugin-media
	function createPlayBtn(filepath, name){
	  var button = document.createElement('button');
	  button.textContent = "play " + name + "'s audio";
	  button.setAttribute('class', 'button');
	  button.id = name + "-audio";
	  document.getElementById('output').appendChild(button);  //attach it to the div id=output
	  document.getElementById(name + "-audio").addEventListener('click', function(){
	  	ons.notification.alert('This will play ' + name + "'s audio");
	  	playAudio(filepath);
	  })
	}

	//play the remote m4a file
	function playAudio(filepath){
		var myMedia = new Media(filepath);
		myMedia.play({ playAudioWhenScreenIsLocked : true });
		myMedia.setVolume('1.0');
	}
	


});

