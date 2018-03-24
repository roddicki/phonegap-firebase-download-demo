# PhoneGap firebase download demo

This phonegap app for iOS and Android downloads and receives realtime database info (including audio) from firebase.

## Usage
Create a new phonegap project using Phonegap cli or desktop app. 
Replace the www directory with this demo / working repository.

Add your own  firebase config in index.js

	// Initialize Firebase
	var config = {
		apiKey: "",
		authDomain: "",
		databaseURL: "",
		projectId: "",
		storageBucket: "",
		messagingSenderId: ""
	};

(Matt use the config info for the database you already have working).

This app will also work on the phonegap mobile developer app.

