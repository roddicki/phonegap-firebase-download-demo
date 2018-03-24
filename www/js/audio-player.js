var audio = {
	isPlaying: [],
	objectList: {},
	currPosition: 0,
	getDevicePath: function() {
	    var path;
	    var platform = device.platform;
    	platform = platform.toLowerCase();
	    if (platform == "ios") {
	        var path = "cdvfile://localhost/bundle/www/";
	    } else if (platform == "android") {
	        var path = "file:///android_asset/www/";
	    };
	    /*path = window.location.pathname;
	    var sizefilename = path.length - (path.lastIndexOf("/")+1);
	    path = path.substr( path, path.length - sizefilename );*/
	    return path;
	},
	createAudioObject: function(filepath) {
		var url = audio.getDevicePath() + filepath;
		console.log("\nfileppath used\n" + url);
	    var mediaObject = new Media(url,
	            // success callback
	            function () { 
	            	console.log("Audio has played - Success"); 
	            	audio.deleteFromisPlaying(filepath); //deleteFromisPlaying
	            },
	            // error callback
	            function (err) { console.log("Audio object Error: " + JSON.stringify(err) ); }
	    );
	    return mediaObject;
	},
	addToisPlaying: function(filepath) {
		//add to isPlaying list
		audio.isPlaying.push(filepath); 
	},
	deleteFromisPlaying: function(index) {
		//delete from isPlaying list
		audio.isPlaying.splice(index, 1); //
	},
	getObject: function(filepath) {
		var audioObject;
		if ( !((audio.getDevicePath() + filepath) in audio.objectList) ) {
			//object in objectList doesn't exist so create audioOject
			audioObject = audio.createAudioObject(filepath);
			audio.objectList[audioObject.src] = audioObject; //add to objectList
			console.log(JSON.stringify(audio.objectList));
		} else {
			//object exists so find it and return it
			audioObject = audio.objectList[audio.getDevicePath() + filepath]
		};
		return audioObject;
	},
	isCurrentlyPlaying: function(filepath) {
		if (audio.isPlaying.indexOf(filepath) != -1) {
			return true;
		} else {
			return false;
		};	
	},
	play: function(filepath) {
		console.log(audio.isPlaying)
		console.log(audio.isPlaying.indexOf(filepath));

		var audioObject = audio.getObject(filepath);
		//if audio is NOT playing
		if (!(audio.isCurrentlyPlaying(filepath))) {
			//is not playing 
			audio.addToisPlaying(filepath); //add to list of playing audio
			audioObject.play();	//play
		};	
	}, 
	pause: function(filepath) {
		console.log("pause clicked - audio.isCurrentlyPlaying: " + audio.isCurrentlyPlaying(filepath)); 
		//if audio is playing
		if (audio.isCurrentlyPlaying(filepath)) {
			//is playing so find object and pause
			var audioObject = audio.objectList[audio.getDevicePath() + filepath]; //search objectList for object
			console.log(JSON.stringify(audioObject.src) + " is playing and will be paused" + "\n object: \n" + JSON.stringify(audioObject));
			audioObject.pause();
			//delete from isPlaying list
			var isPlayingIndex = audio.isPlaying.indexOf(filepath);
			audio.deleteFromisPlaying(isPlayingIndex); 
		};
	},
	getDuration: function(filepath) {
		var audioObject = audio.getObject(filepath);
		console.log("getDuration object:" + JSON.stringify(audioObject));
		return audioObject.getDuration();
	},
	seekTo: function(filepath, milliseconds) {
		var audioObject = audio.getObject(filepath);
		audioObject.seekTo(milliseconds);
	},
	getCurrentPosition: function(filepath) {
		var audioObject = audio.getObject(filepath);
		// get media position
	    audioObject.getCurrentPosition(
	        // success callback
	        function (position) {
	            if (position > -1) {
	                console.log((position) + " sec");
	                audio.currPosition = position;
	            }
	        },
	        // error callback
	        function (e) {
	            console.log("Error getting pos=" + e);
	        }
	    );
	    return audio.currPosition;
	}
};





