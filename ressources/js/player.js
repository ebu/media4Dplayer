var checkPositionVideo;

var Media = {
	audiosList:[],
	subtitlesList:[],
	audioDescriptions:[],
	ls:[],
	url:null,
	
	audioEnabled:true,
	subtitleEnabled:true,
	audioDescriptionEnabled:true,
	LSFEnabled:true,
	
	currentLSFIndex:0,
	currentAudioIndex:0,
	currentSubtitleIndex:0,
	currentAudioDescriptionIndex:0
};

var Player = {
	alreadyInit:false,
	onClose:null,
	waaAlreadyInit:false,
	videoMain: document.getElementById('videoPlayerMain'),
	videoPip: document.getElementById('videoPlayerPip'),
    videoAudio: document.getElementById('videoPlayerAudio'),
	ttmlDiv: document.getElementById('video-caption'),
	
	playerManager:{
    	playerMain: null,
    	playerPip: null,
    	playerAudio: null,
    	controller: null,
    	audioContext: null,
    	optionSigne: true,
    	optionDescription: true,
    	optionSub: true
    },
	
	isPlaying:false,
	currentPipMode:null,
	pipControlTimeout:null,
	checkPositionVideo:null
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Player.load = function(videoData, callback, onClose){
	
	this.onClose = onClose;

	if(!this.alreadyInit || (videoData.url !== Media.url)){

		Media = videoData;

		Media.LSFEnabled = !getCookie("LSFDisabled") && typeOf(Media.ls) === "array" && Media.ls.length ? true : false;
		Media.audioEnabled = !getCookie("muteEnabled") && typeOf(Media.audiosList) === "array" && Media.audiosList.length ? true : false;
		Media.subtitleEnabled = !getCookie("subtitlesDisabled") && typeOf(Media.subtitlesList) === "array" && Media.subtitlesList.length ? true : false;
		Media.audioDescriptionEnabled = !getCookie("audioDescriptionDisabled") && typeOf(Media.audioDescriptions) === "array" && Media.audioDescriptions.length ? true : false;

		Media.currentAudioIndex = 0;
		Media.currentAudioDescriptionIndex = 0;
		Media.currentLSFIndex = 0;
		Media.currentSubtitleIndex = 0;
		
		InfoBanner.load();

		//LANCEMENT DU PLAYER ATTENTION CODE TOUCHY
		this.launch();
	}
		
	this.playerManager.playerMain.attachView(this.videoMain);
	this.playerManager.playerMain.attachVideoContainer(document.getElementById("videoPlayerContainer"));

	this.playerManager.playerPip.attachView(this.videoPip);
	if(Media.audioDescriptionEnabled){
		this.playerManager.playerAudio.attachView(this.videoAudio);
	}

	// Add HTML-rendered TTML subtitles
	this.playerManager.playerMain.attachTTMLRenderingDiv(this.ttmlDiv);

	//Gestion du switch LSF/Vidéo comme vidéo plein taille
	this.setPIP();
	if(Media.LSFEnabled){

		this.playerManager.playerMain.attachSource(Media.url);
		this.playerManager.playerPip.attachSource(Media.ls[Media.currentLSFIndex].url);

	}else{
		this.playerManager.playerMain.attachSource(Media.url);			
	}

	if(Media.audioDescriptionEnabled){
		this.playerManager.playerAudio.attachSource(Media.audioDescriptions[Media.currentAudioDescriptionIndex].url);
	}

	this.playerManager.playerMain.play();

	if(Media.LSFEnabled){
		this.playerManager.playerPip.play();
	}

	if(Media.audioDescriptionEnabled){
		this.playerManager.playerAudio.play();
	}

	this.initSubtitlesParams();

	this.onPlay(); // pas d'évenement lors du play... alors on le force.
	this.launchCheckPositionVideo();
	InfoBanner.launchMaskingAfterDelay();

	if(typeOf(callback) === "function"){
		callback();
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Player.launch = function(){
	var context = new Dash.di.DashContext();

	this.playerManager.playerMain = new MediaPlayer(context);
	this.playerManager.playerMain.startup();
	this.playerManager.playerMain.setAutoPlay(false);

	this.playerManager.playerPip = new MediaPlayer(context);
	this.playerManager.playerPip.startup();
	this.playerManager.playerPip.setAutoPlay(false);

	this.playerManager.playerAudio = new MediaPlayer(context);	
	this.playerManager.playerAudio.startup();
	this.playerManager.playerAudio.setAutoPlay(false);

	// remove Dash.js logs
	this.playerManager.playerMain.getDebug().setLogToBrowserConsole(false);
	this.playerManager.playerPip.getDebug().setLogToBrowserConsole(false);
	this.playerManager.playerAudio.getDebug().setLogToBrowserConsole(false);

	this.playerManager.controller = new MediaController();

	log("controller = " + this.playerManager.controller);

	this.videoMain.controller = this.playerManager.controller;

	if(Media.LSFEnabled){
		this.videoPip.controller = this.playerManager.controller;			
	}

	if(Media.audioDescriptionEnabled){
		this.videoAudio.controller = this.playerManager.controller;
	}

	if(!this.waaAlreadyInit){
		this.waaAlreadyInit = true;

		this.playerManager.audioContext = new(window.AudioContext || window.webkitAudioContext)();
		log("######### audioContext: " + this.playerManager.audioContext);

		var videoAudioSource = this.playerManager.audioContext.createMediaElementSource(this.videoMain);
		var audioAudioSource = this.playerManager.audioContext.createMediaElementSource(this.videoAudio);

		audioGainNode = this.playerManager.audioContext.createGain();
		audioAudioSource.connect(audioGainNode);
		audioGainNode.connect(this.playerManager.audioContext.destination);

		videoGainNode = this.playerManager.audioContext.createGain();
		var lastVolumeValue = parseInt(getCookie("volumeValue") || Settings.defaultVolumeValue,10);
		var volumeValue = !Media.audioEnabled || isNaN(lastVolumeValue) || !lastVolumeValue ? 0 : lastVolumeValue;
		Player.setVolume(audioGainNode, videoGainNode, volumeValue);
		videoAudioSource.connect(videoGainNode);
		videoGainNode.connect(this.playerManager.audioContext.destination);				
	}

	this.playerManager.controller.addEventListener('play', function(e) {
		Player.onPlay();
	});
	
	this.playerManager.controller.addEventListener('pause', function(e) {
		Player.onPause();
	});

	var textTrackEvent = function(e){
		if(getCookie("subtitlesDisabled")){
			Player.playerManager.playerMain.setTextTrack(-1);					
		}else{
			Player.playerManager.playerMain.setTextTrack(Media.currentSubtitleIndex);
		}

		console.debug("MediaPlayer.events.TEXT_TRACKS_ADDED");

		var xPos = getCookie("LSFPipSubtitles_position_x"),
			yPos = getCookie("LSFPipSubtitles_position_y");

		if(xPos !== "undefined" && yPos !== "undefined"){
			var top = Math.round(yPos);
			if(top <= 0){
				top = 0;
			}else if(top>= 65){
				top = 65 / 2;
			}else{
				top = top / 2;
			}
			$(Player.ttmlDiv).css("top", top + "%")
				.css("left", xPos + "%")
				.css("width", "100%");
		}
	};
	
	this.playerManager.playerMain.addEventListener(MediaPlayer.events.TEXT_TRACKS_ADDED, textTrackEvent);

	this.alreadyInit = true;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Player.setVolume = function(audioGainNode, videoGainNode, volume){
	var gain = volume / 100;
	audioGainNode.gain.value = gain;
	videoGainNode.gain.value = gain;
	console.warn("Volume passé à "+gain);
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Player.setMute = function(){
	this.setVolume(audioGainNode, videoGainNode, 0);
	setCookie("volumeValue", 0);
	setCookie("muteEnabled", 1);
	$('.volume').css('background-position', '0 0');
	$(document.getElementById("playerOptionAudioCurrentValue")).html("Aucun");
	Media.audioEnabled = false;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Player.onPause = function() {
	this.isPlaying = false;
	InfoBanner.hidePauseBtn();
};	

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Player.onPlay = function() {
	this.isPlaying = true;
	InfoBanner.showPauseBtn();
	
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Player.validClose = function() {
	this.playerManager.playerMain.reset();
	this.playerManager.playerPip.reset();
	this.playerManager.playerAudio.reset();

	if(typeOf(this.onClose) === "function"){
		this.onClose();
	}

	Navigation.goBack();
};

Player.setPIP = function(){
	var $ctn = $(document.getElementById("pipContainer"));
	var $pipVideo = $(document.getElementById("pipVideo")).css("left", (getCookie("LSFPip_position_x") || Settings.defaultLSPIPCoordonates.x) + "%" )
		.css("top", (getCookie("LSFPip_position_y") || Settings.defaultLSPIPCoordonates.y) + "%" )
		.css("width", (getCookie("LSFPip_size_width") || Settings.defaultLSPIPCoordonates.w) + "%" )
		.css("height", (getCookie("LSFPip_size_height") || Settings.defaultLSPIPCoordonates.h) + "%" )
		.draggable({
			containment: $ctn.parent(),
			scroll:false,
			handle:".ui-icon-gripsmall-center",
			stop: function() {
				appearPipControls();
				Settings.saveLSPIPPosition($( this ).parents($( this ).draggable( "option", "containment" )), $(this));
			},
			start: function() {
				clearInterval(Player.pipControlTimeout);
				$ctn.css("border-style","solid");
				$(this).css("border-style","solid");
			}
		}).resizable({
			containment: "parent",
			handles: 'all',
			minWidth: 100,
			aspectRatio: true,
			stop: function() {
				Settings.saveLSPIPSize($( this ).parents($( this ).draggable( "option", "containment" )), $(this));
				Settings.saveLSPIPPosition($( this ).parents($( this ).draggable( "option", "containment" )), $(this));
			}			
		}).click( function() {
			if(Media.LSFEnabled){
				appearPipControls();
			}
		});
		
	var appearPipControls = function(){
		if(Player.pipControlTimeout){
			clearInterval(Player.pipControlTimeout);
		}
		Player.pipControlTimeout = setTimeout(function(){

			$ctn.css("border-style","hidden");
			$pipVideo.css("border-style","hidden");
			$pipVideo.children(".ui-icon").hide();

		}, Config.timeoutHidePIP *1000);

		$ctn.css("border-style","solid");
		$pipVideo.css("border-style","solid").children(".ui-icon").show();		
	};

	$('.ui-resizable-nw').addClass('ui-icon ui-icon-gripsmall-diagonal-nw');
	$('.ui-resizable-ne').addClass('ui-icon ui-icon-gripsmall-diagonal-ne');
	$('.ui-resizable-sw').addClass('ui-icon ui-icon-gripsmall-diagonal-sw');
	$('.ui-resizable-se').addClass('ui-icon ui-icon-gripsmall-diagonal-se');
	$pipVideo.children(".ui-icon").hide();
};

Player.initSubtitlesParams = function(){

	// subtitles
	var $container = $(this.ttmlDiv).removeClass("Arial OpenDyslexic Andika Helvetica Lexia");
	var selectedFont = getCookie("subtitleFont");
	if(selectedFont){
		$container.addClass(selectedFont);
	}

	// color
	$container.removeClass("multiColor whiteColor yellowColor blueColor");
	var selectedFontColor = getCookie("subtitleFontColor");
	if(selectedFontColor){
		$container.addClass(selectedFontColor+"Color");
	}	

	// background color & Opacité du background
	$container.removeClass("blackBGColor whiteBGColor");
	var selectedFontBGColor = getCookie("subtitleBGColor");
	if(selectedFontBGColor){
		$container.addClass(selectedFontBGColor+"BGColor");
	}

	// Opacité du background
	$container.removeClass("opacity_0 opacity_025 opacity_05 opacity_075 opacity_1");
	var selectedFontBGColor = getCookie("subtitleBackgroundOpacity");
	if(selectedFontBGColor){
		$container.addClass("opacity_"+selectedFontBGColor.replace(".",""));
	}

	// font-size
	$container.css("font-size", "inherit");
	var selectedFontSize = getCookie("subtitleFontSize");
	if(selectedFontSize){
		$container.css("font-size", selectedFontSize+"px");
	}	

	var xPos = getCookie("LSFPipSubtitles_position_x"),
		yPos = getCookie("LSFPipSubtitles_position_y");

	if(xPos !== "undefined" && yPos !== "undefined"){
		var top = Math.round(yPos);
		if(top <= 0){
			top = 0;
		}else if(top>= 65){
			top = 65 / 2;
		}else{
			top = top / 2;
		}
		$container.css("top", top + "%")
			.css("left", xPos + "%")
			.css("width", "100%");
	}
};	

																								/********************************
																								*	GESTION DE LA PROGRESSBAR	*
																								********************************/

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches the progress bar updating
 */

Player.launchCheckPositionVideo = function(){

	this.stopCheckVideoPosition();
	this.checkPositionVideo = setInterval(function(){
		InfoBanner.progressBar.update(Player.playerManager.controller.currentTime, Player.playerManager.controller.duration);
	}, 500);
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Stop the progress bar updating
 */

Player.stopCheckVideoPosition = function(){
	clearInterval(this.checkPositionVideo);
};

																								/****************************
																								*	GESTION DU TRICK MODE	*
																								****************************/

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Updates the progress bar
 * @param {Integer} time The current position inside the video (in milliseconds)
 * @param {Integer} tT Total time of the video (in milliseconds)
 */

Player.stop = function(){
	this.playerManager.controller.pause();
	this.playerManager.controller.currentTime = 0;
	InfoBanner.progressBar.reset();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Updates the progress bar
 * @param {Integer} time The current position inside the video (in milliseconds)
 * @param {Integer} tT Total time of the video (in milliseconds)
 */

Player.rw = function(){
		
	var totalTimeSecond =  this.playerManager.controller.duration;	
	var saut = Math.round(totalTimeSecond*(5/100));
	var currentPosition = this.playerManager.controller.currentTime;
	var newCurrentPosition = currentPosition - saut;
	if (newCurrentPosition < 0) {
		newCurrentPosition = 0;
	}

	// check if the new position is seekable
	console.log("newCurrentPosition = "+newCurrentPosition);
	for (var i=0; i<this.playerManager.controller.seekable.length; i++) {
		
		console.log("check range seekable #" + i + " -> "+this.playerManager.controller.seekable.start(i)+", "+this.playerManager.controller.seekable.end(i));
		console.log("check range buffered #" + i + " -> "+this.playerManager.controller.buffered.start(i)+", "+this.playerManager.controller.buffered.end(i));
		
		if (this.playerManager.controller.seekable.start(i) <= newCurrentPosition && newCurrentPosition <= this.playerManager.controller.seekable.end(i)) {
			console.log("   range match, do seek");
			this.playerManager.controller.currentTime = newCurrentPosition;
			break;
		}
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Updates the progress bar
 * @param {Integer} time The current position inside the video (in milliseconds)
 * @param {Integer} tT Total time of the video (in milliseconds)
 */

Player.ff = function(){
		
	var totalTimeSecond =  this.playerManager.controller.duration;	
	var saut = Math.round(totalTimeSecond*(5/100));
	var currentPosition = this.playerManager.controller.currentTime;
	var newCurrentPosition = currentPosition + saut;
	if (newCurrentPosition > totalTimeSecond) {
		newCurrentPosition = totalTimeSecond;
	}

	// check if the new position is seekable
	log("newCurrentPosition = "+newCurrentPosition);
	for (var i=0; i<this.playerManager.controller.seekable.length; i++) {
		
		log("check range #" + i + " -> "+this.playerManager.controller.seekable.start(i)+", "+this.playerManager.controller.seekable.end(i));
		
		if (this.playerManager.controller.seekable.start(i) <= newCurrentPosition && newCurrentPosition <= this.playerManager.controller.seekable.end(i)) {
			log("   range match, do seek");
			this.playerManager.controller.currentTime = newCurrentPosition;
			break;
		}
	}
	//Note: if the newCurrentPosition is not seekable, we do nothing for now. It could be interesting to seek to the last seekable position instead.
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Updates the progress bar
 * @param {Integer} time The current position inside the video (in milliseconds)
 * @param {Integer} tT Total time of the video (in milliseconds)
 */

Player.playPause = function() {
	//log("playPause : ", this.isPlaying);

	if(this.isPlaying) {
		this.playerManager.controller.pause();
		
	}else{
		this.playerManager.controller.play();	
	}

	InfoBanner.launchMaskingAfterDelay();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Updates the progress bar
 * @param {Integer} time The current position inside the video (in milliseconds)
 * @param {Integer} tT Total time of the video (in milliseconds)
 */

Player.activeOptionSigne = function(index) {
	var $textContent = $(document.getElementById("playerOptionSigneCurrentValue"));

	var playerPIP, playerMain;
	playerPIP = this.playerManager.playerPip;
	playerMain = this.playerManager.playerMain;

	if(index !== Media.ls.length){

		this.playerManager.controller.currentTime = this.videoMain.currentTime;
		this.videoPip.controller = this.playerManager.controller;	
		
		playerPIP.startup();
		playerPIP.setAutoPlay(false);
		playerPIP.attachView(this.videoPip);
		playerPIP.attachSource(Media.ls[Media.currentLSFIndex].url);

		Media.currentLSFIndex = index;
		Media.LSFEnabled = true;
		eraseCookie("LSFDisabled");
		$textContent.html(Media.ls[index].lang);

	}else{
		this.videoPip.controller = null;
		playerPIP.reset();

		Media.LSFEnabled = false;
		setCookie("LSFDisabled", 1);
		$textContent.html("Aucun");
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Updates the progress bar
 * @param {Integer} time The current position inside the video (in milliseconds)
 * @param {Integer} tT Total time of the video (in milliseconds)
 */

Player.activeOptionSub = function(index) {
	var $textContent = $(document.getElementById("playerOptionSubCurrentValue"));
	if(index !== Media.subtitlesList.length){
		this.playerManager.playerMain.setTextTrack(index);

		Media.currentSubtitleIndex = index;
		Media.subtitleEnabled = true;
		eraseCookie("subtitlesDisabled");
		$textContent.html(Media.subtitlesList[index] + '<img src="ressources/img/sourd.png" height="100%" style="vertical-align:top;margin-left:10px;"/>');

	}else{
		this.playerManager.playerMain.setTextTrack(-1);
		
		Media.subtitleEnabled = false;
		Media.currentSubtitleIndex = 0;
		setCookie("subtitlesDisabled", 1);
		$textContent.html("Aucun");
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Updates the progress bar
 * @param {Integer} time The current position inside the video (in milliseconds)
 * @param {Integer} tT Total time of the video (in milliseconds)
 */

Player.activeOptionDescription = function(index) {
		
	var $textContent = $(document.getElementById("playerOptionDescriptionCurrentValue"));
	if(index !== Media.audioDescriptions.length){

		this.playerManager.controller.currentTime = this.videoMain.currentTime;
		this.videoAudio.controller = this.playerManager.controller;
		this.playerManager.playerAudio.startup();
		this.playerManager.playerAudio.setAutoPlay(false);
		this.playerManager.playerAudio.attachView(this.videoAudio);
		this.playerManager.playerAudio.attachSource(Media.audioDescriptions[index].url);

		Media.currentAudioDescriptionIndex = index;
		Media.audioDescriptionEnabled = true;
		eraseCookie("audioDescriptionDisabled");
		$textContent.html(Media.audioDescriptions[index].lang);

	}else{

		this.videoAudio.controller = null;
		this.playerManager.playerAudio.reset();

		Media.audioDescriptionEnabled = false;
		setCookie("audioDescriptionDisabled", 1);
		$textContent.html("Aucun");
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Updates the progress bar
 * @param {Integer} time The current position inside the video (in milliseconds)
 * @param {Integer} tT Total time of the video (in milliseconds)
 */

Player.activeOptionAudio = function(index) {
	
	var $textContent = $(document.getElementById("playerOptionAudioCurrentValue"));
	var $sliderVolume = $( document.getElementById("slider") );
	var defaultVol = Settings.defaultVolumeValue;
	
	if(index !== Media.audiosList.length){
		// TODO : changer langue audio de la vidéo principale
		Media.currentAudioIndex = index;
		Media.audioEnabled = true;
		eraseCookie("muteEnabled");

		setCookie("volumeValue", defaultVol);
		this.setVolume(audioGainNode, videoGainNode, defaultVol);	

		$textContent.html(Media.audiosList[index]);
		$('.volume').css('background-position', '0 -50px');
		$('.tooltip').css('left', defaultVol+5).text(defaultVol);
		$sliderVolume.slider( "option", "value", defaultVol );

	}else{
		$sliderVolume.slider( "option", "value", 0 );
		this.setMute();
	}
};