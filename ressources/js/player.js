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
	audioFiveDotOne:document.getElementById('playerAudioFiveDotOne'),
	audioFiveDotOne2:document.getElementById('playerAudioFiveDotOne-2'),
	ttmlDiv: document.getElementById('video-caption'),
	
	playerManager:{
    	playerMain: null,
    	playerPip: null,
    	playerAudio: null,
		playerAudioFiveDotOne:null,
		playerAudioFiveDotOne2:null,		
    	controller: null,
    	audioContext: null,
    	optionSigne: true,
    	optionDescription: true,
    	optionSub: true
    },
	
	isPlaying:false,
	currentPipMode:null,
	pipControlTimeout:null,
	checkPositionVideo:null,
	
	mode:"5.1",
	spatializationMode:"binaural",
	spatializationModes:["binaural","transaural"],
	binauralEQ:false,
	compressionRatio:"2:1",
	catalogue:[],
	selectedProfil:null
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

	if(!this.alreadyInit || (videoData.links.dataMain.url !== Media.links.dataMain.url)){

		Media = videoData;

		Media.LSFEnabled = !getCookie("LSFDisabled") && Media.links.dataLS && Media.links.dataLS.url ? true : false;
		Media.audioEnabled = !getCookie("audioDisabled") && Media.links.dataMain && Media.links.dataMain.url ? true : false;
		Media.subtitleEnabled = !getCookie("subtitlesDisabled") && Media.links.dataSub && Media.links.dataSub.url ? true : false;
		Media.audioDescriptionEnabled = !getCookie("audioDescriptionDisabled") && Media.links.dataAD && Media.links.dataAD.url ? true : false;

		Media.currentAudioIndex = this.mode === "5.1" && Media.audiosList[1] ? 1 : 0;
		Media.currentAudioDescriptionIndex = 0;
		Media.currentLSFIndex = 0;
		Media.currentSubtitleIndex = 0;
		
		InfoBanner.load();

		//LANCEMENT DU PLAYER ATTENTION CODE TOUCHY
		this.launch();
	}

	var urlMain 			= Media.links.dataMain.url;
	var urlPip 				= Media.links.dataLS.url;
	var urlAudioDescription	= Media.links.dataAD.url;
	var urlAudioFiveDotOne 	= Media.links.dataEA.url;
	var urlAudioFiveDotOne2	= Media.links.dataDI.url;
		
	this.playerManager.playerMain.attachView(this.videoMain);
	this.playerManager.playerMain.attachSource(urlMain);	
	if(Media.LSFEnabled){
		this.playerManager.playerPip.attachView(this.videoPip);
		this.playerManager.playerPip.attachSource(urlPip);
	}	
	this.playerManager.playerAudioFiveDotOne.attachView(this.audioFiveDotOne);
	this.playerManager.playerAudioFiveDotOne.attachSource(urlAudioFiveDotOne);
	this.playerManager.playerAudioFiveDotOne2.attachView(this.audioFiveDotOne2);	
	this.playerManager.playerAudioFiveDotOne2.attachSource(urlAudioFiveDotOne2);
	this.playerManager.playerAudio.attachView(this.videoAudio);	
	this.playerManager.playerAudio.attachSource(urlAudioDescription);

	// Add HTML-rendered TTML subtitles
	this.playerManager.playerMain.attachTTMLRenderingDiv(this.ttmlDiv);
	
	this.playerManager.playerMain.play();	
	if(Media.LSFEnabled){
		this.playerManager.playerPip.play();
	}
	this.playerManager.playerAudioFiveDotOne.play();
	this.playerManager.playerAudioFiveDotOne2.play();
	this.playerManager.playerAudio.play();
	
	this.updateActiveStreams();
	
	this.playerManager.controller.play();
	
	//Gestion du PIP
	this.setPIP();
	
	//this.initSmartFader();
	var lastVolumeValue = parseInt(getCookie("volumeValue") || Settings.defaultVolumeValue,10);
	var volumeValue = isNaN(lastVolumeValue) || !lastVolumeValue ? 0 : lastVolumeValue;
	this.setVolume(volumeValue);
	
	/// prepare the sofa catalog of HRTF
	this.prepareSofaCatalog();
	
	this.onChangeEqualization();

	this.initSubtitlesParams();

	InfoBanner.show();

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

	//==============================================================================
	this.playerManager.playerMain = new MediaPlayer(context);
	this.playerManager.playerMain.startup();
	this.playerManager.playerMain.setAutoPlay(false);

	this.playerManager.playerPip = new MediaPlayer(context);
	this.playerManager.playerPip.startup();
	this.playerManager.playerPip.setAutoPlay(false);

	this.playerManager.playerAudioFiveDotOne = new MediaPlayer(context);	
	this.playerManager.playerAudioFiveDotOne.startup();
	this.playerManager.playerAudioFiveDotOne.setAutoPlay(false);

	this.playerManager.playerAudioFiveDotOne2 = new MediaPlayer(context);	
	this.playerManager.playerAudioFiveDotOne2.startup();
	this.playerManager.playerAudioFiveDotOne2.setAutoPlay(false);

	this.playerManager.playerAudio = new MediaPlayer(context);	
	this.playerManager.playerAudio.startup();
	this.playerManager.playerAudio.setAutoPlay(false);

	// remove Dash.js logs
	this.playerManager.playerMain.getDebug().setLogToBrowserConsole(false);
	this.playerManager.playerPip.getDebug().setLogToBrowserConsole(false);
	this.playerManager.playerAudioFiveDotOne.getDebug().setLogToBrowserConsole(false);
	this.playerManager.playerAudioFiveDotOne2.getDebug().setLogToBrowserConsole(false);
	this.playerManager.playerAudio.getDebug().setLogToBrowserConsole(false);

	this.playerManager.controller = new MediaController();

	//log("controller = " + this.playerManager.controller);
	
	this.videoMain.controller			= this.playerManager.controller;
	this.audioFiveDotOne.controller		= this.playerManager.controller;
	this.audioFiveDotOne2.controller	= this.playerManager.controller;
	this.videoAudio.controller			= this.playerManager.controller;
	if(Media.LSFEnabled){
		this.videoPip.controller		= this.playerManager.controller;			
	}

	if(!this.waaAlreadyInit){
		this.waaAlreadyInit = true;

		this.playerManager.audioContext = new(window.AudioContext || window.webkitAudioContext)();
		log("######### audioContext: " + this.playerManager.audioContext);

		//==============================================================================
		var audioSourceMain 	 	= this.playerManager.audioContext.createMediaElementSource( this.videoMain );
		var audioSourceFiveDotOne  	= this.playerManager.audioContext.createMediaElementSource( this.audioFiveDotOne );
		var audioSourceFiveDotOne2 	= this.playerManager.audioContext.createMediaElementSource( this.audioFiveDotOne2 );
		var audioSourceDescription	= this.playerManager.audioContext.createMediaElementSource(this.videoAudio);

		/// create a 10-channel stream containing all audio materials
		var channelMerger = this.playerManager.audioContext.createChannelMerger(10);

		var channelSplitterMain 		= this.playerManager.audioContext.createChannelSplitter( 2 );
		var channelSplitterFiveDotOne	= this.playerManager.audioContext.createChannelSplitter( 6 );
		var channelSplitterFiveDotOne2	= this.playerManager.audioContext.createChannelSplitter( 1 );
		var channelSplitterDescription 	= this.playerManager.audioContext.createChannelSplitter( 1 );

		audioSourceMain.connect( channelSplitterMain );
		audioSourceFiveDotOne.connect( channelSplitterFiveDotOne );
		audioSourceFiveDotOne2.connect( channelSplitterFiveDotOne2 );
		audioSourceDescription.connect( channelSplitterDescription );

		channelSplitterMain.connect( channelMerger, 0, 0 );
		channelSplitterMain.connect( channelMerger, 1, 1 );

		channelSplitterFiveDotOne.connect( channelMerger, 0, 2 );
		channelSplitterFiveDotOne.connect( channelMerger, 1, 3 );
		channelSplitterFiveDotOne.connect( channelMerger, 2, 4 );
		channelSplitterFiveDotOne.connect( channelMerger, 3, 5 );
		channelSplitterFiveDotOne.connect( channelMerger, 4, 6 );
		channelSplitterFiveDotOne.connect( channelMerger, 5, 7 );
		
		channelSplitterDescription.connect( channelMerger, 0, 8 );
		
		channelSplitterFiveDotOne2.connect( channelMerger, 0, 9 );
	
		//==============================================================================
		var mainData = Media.links.dataMain;
		var eaData = Media.links.dataEA;
		var adData = Media.links.dataAD;
		var diData = Media.links.dataDI;
		
		// Son principal
		mainAudioASD = new M4DPAudioModules.AudioStreamDescription(
				type = mainData.type,
				active = this.mode === "stereo" && Media.audioEnabled,
				loudness = parseInt(mainData.loudness,10),
				maxTruePeak = parseInt(mainData.maxTruePeak,10),
				dialog = mainData.dialog === "true",
				ambiance = mainData.ambiance === "true",
				commentary = mainData.commentary === "true");
		
		// Ambiance (pour le 5.1)
		extendedAmbienceASD = new M4DPAudioModules.AudioStreamDescription(
				type = eaData.type,
				active = this.mode === "5.1" && Media.audioEnabled,
				loudness = parseInt(eaData.loudness,10),
				maxTruePeak = parseInt(eaData.maxTruePeak,10),
				dialog = eaData.dialog === "true",
				ambiance = eaData.ambiance === "true",
				commentary = eaData.commentary === "true");
		
		// Audio description
		extendedCommentsASD = new M4DPAudioModules.AudioStreamDescription(
				type = adData.type,
				active = Media.audioDescriptionEnabled,
				loudness = parseInt(adData.loudness,10),
				maxTruePeak = parseInt(adData.maxTruePeak,10),
				dialog = adData.dialog === "true",
				ambiance = adData.ambiance === "true",
				commentary = adData.commentary === "true");
		
		// Dialogue (pour le 5.1)
		extendedDialogsASD = new M4DPAudioModules.AudioStreamDescription(
				type = diData.type,
				active = this.mode === "5.1" && Media.audioEnabled,
				loudness = parseInt(diData.loudness,10),
				maxTruePeak = parseInt(diData.maxTruePeak,10),
				dialog = diData.dialog === "true",
				ambiance = diData.ambiance === "true",
				commentary = diData.commentary === "true");

		var asdc = new M4DPAudioModules.AudioStreamDescriptionCollection(
				[mainAudioASD, extendedAmbienceASD, extendedCommentsASD, extendedDialogsASD]
		);
	
		//==============================================================================
		// M4DPAudioModules
		streamSelector = new M4DPAudioModules.StreamSelector( this.playerManager.audioContext, asdc );
		smartFader = new M4DPAudioModules.SmartFader( this.playerManager.audioContext, asdc );
		objectSpatialiserAndMixer = new M4DPAudioModules.ObjectSpatialiserAndMixer( this.playerManager.audioContext, asdc, this.spatializationMode );
		var noiseAdaptation = new M4DPAudioModules.NoiseAdaptation(this.playerManager.audioContext);
		multichannelSpatialiser = new M4DPAudioModules.MultichannelSpatialiser( this.playerManager.audioContext, asdc, this.spatializationMode );
		var dialogEnhancement = new M4DPAudioModules.DialogEnhancement(this.playerManager.audioContext);

		{
			///@bug : the channelSplitterMain MUST be connected to the AudioContext,
			/// otherwise the video wont read.
			/// so as a workaround, we just add a dummuy node, with 0 gain,
			/// to connect the channelSplitterMain
			var uselessGain = this.playerManager.audioContext.createGain();
			channelSplitterMain.connect( uselessGain, 0, 0 );
			uselessGain.gain.value = 0;
			
			uselessGain.connect( this.playerManager.audioContext.destination, 0, 0 );
		}

		/// receives 4 ADSC with 10 channels in total
		channelMerger.connect( streamSelector._input );

		/// mute or unmute the inactive streams
		/// (process 10 channels in total)
		streamSelector.connect( smartFader._input );

		smartFader.connect( multichannelSpatialiser._input );

		/// apply the multichannel spatialiser
		multichannelSpatialiser.connect( this.playerManager.audioContext.destination );
	}
	
	this.playerManager.controller.addEventListener('playing', function(e) {
		Player.onPlay();
	});
	
	this.playerManager.controller.addEventListener('pause', function(e) {
		Player.onPause();
	});
	
	this.playerManager.controller.addEventListener('ended', function(e) {
		Player.stop();
		Player.validClose();
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

Player.setVolume = function(volume){
	
	var minFader = 0;
	var maxFader = 100;

	//const [minValue, maxValue] = M4DPAudioModules.SmartFader.dBRange();
	var minValue = -60;
	var maxValue = 8;

	/// scale from GUI to DSP
	var value = M4DPAudioModules.utilities.scale( volume, minFader, maxFader, minValue, maxValue );

	log('Smart Fader = ' + Math.round(value).toString() + ' dB');

	/// sets the smart fader dB gain
	smartFader.dB = value;
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
	this.setVolume(0);
	setCookie("volumeValue", 0);
	setCookie("muteEnabled", 1);
	$('.volume').css('background-position', '0 0');
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
	this.stopCheckVideoPosition();
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
	this.launchCheckPositionVideo();
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
	this.resetPlayers();
	
	InfoBanner.progressBar.reset();

	if(typeOf(this.onClose) === "function"){
		this.onClose();
	}

	Navigation.goBack();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Player.resetPlayers = function(){
	this.playerManager.playerMain.reset();
	this.playerManager.playerPip.reset();
	this.playerManager.playerAudio.reset();	
	this.playerManager.playerAudioFiveDotOne.reset();	
	this.playerManager.playerAudioFiveDotOne2.reset();
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
			if(InfoBanner.isDisplayed()){
				InfoBanner.hide();
			}else if(Media.LSFEnabled){
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

Player.initSmartFader = function(){
	var minFader = 0;
	var maxFader = 100;

	/// default value in dB
	var value = 0.0;

	//const [minValue, maxValue] = M4DPAudioModules.SmartFader.dBRange();
	var minValue = -60;
	var maxValue = 8;

	/// scale from dB to GUI
	var valueFader = M4DPAudioModules.utilities.scale( value, minValue, maxValue, minFader, maxFader );

	this.setVolume(valueFader);	
};

Player.prepareSofaCatalog = function(callback){
	
	if(this.catalogue.length){
		Player.onChangeProfil();
		
		if(typeOf(callback) === "object" && callback.onSuccess){
			callback.onSuccess();
		}
		return;
	}
	
	var _callback = function(url){
		Player.selectedProfil = url;
		Player.onChangeProfil(url);

		if(typeOf(callback) === "object" && callback.onSuccess){
			callback.onSuccess();
		}		
	};

    /// retrieves the catalog of URLs from the OpenDAP server
	var serverDataBase = new M4DPAudioModules.binaural.sofa.ServerDataBase();
	serverDataBase
         .loadCatalogue()
         .then( function(){
            var urls = serverDataBase.getUrls({
                convention: 'HRIR',
                equalisation: 'compensated',
                sampleRate: Player.playerManager.audioContext.sampleRate
            });
			
			Player.catalogue = urls;
            defaultUrl = urls.findIndex( function (url) {
                return url.match('1018');
            });
			
			_callback(urls[defaultUrl]);

            return urls;
        })
        .catch( function (){
			 
         	log('could not access bili2.ircam.fr...');

         	sofaUrl = multichannelSpatialiser._virtualSpeakers.getFallbackUrl();
			
			_callback(sofaUrl);

         	return sofaUrl;
        });
};

Player.onChangeProfil = function(){
	
	var url = this.selectedProfil;
	if(url){

		/// load the URL in the spatialiser
		multichannelSpatialiser.loadHrtfSet( url );
		objectSpatialiserAndMixer.loadHrtfSet( url );		
	}
};

Player.onChangeEqualization = function(){
	multichannelSpatialiser.eqPreset = "eq1";

	if (this.binauralEQ) {
		multichannelSpatialiser.bypassHeadphoneEqualization( false );
	} else {
		multichannelSpatialiser.bypassHeadphoneEqualization( true );
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
	log("launchCheckPositionVideo() : start; je vais lancer le stop");
	this.stopCheckVideoPosition();
	this.checkPositionVideo = setInterval(function(){
		InfoBanner.progressBar.update(Player.playerManager.controller.currentTime, Player.playerManager.controller.duration);
		
		var upVol = document.getElementById('up-volume');
		var isCompressed = smartFader.dynamicCompressionState;
		if( isCompressed === true){
			upVol.style.backgroundColor = "rgba(255, 0, 0, 0.7)";
		}
		else{
			upVol.style.backgroundColor = "rgba(0, 0, 0, 0)";
		}		
	}, 500);
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Stop the progress bar updating
 */

Player.stopCheckVideoPosition = function(){
	log("stopCheckVideoPosition() : start;");
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
	$(this.ttmlDiv).empty();
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
			InfoBanner.launchMaskingAfterDelay();
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
			InfoBanner.launchMaskingAfterDelay();
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

		/*this.playerManager.controller.currentTime = this.videoMain.currentTime;
		this.videoAudio.controller = this.playerManager.controller;
		this.playerManager.playerAudio.startup();
		this.playerManager.playerAudio.setAutoPlay(false);
		this.playerManager.playerAudio.attachView(this.videoAudio);
		this.playerManager.playerAudio.attachSource(Media.audioDescriptions[index].url);*/
		extendedCommentsASD.active = true;

		Media.currentAudioDescriptionIndex = index;
		Media.audioDescriptionEnabled = true;
		eraseCookie("audioDescriptionDisabled");
		$textContent.html(Media.audioDescriptions[index].lang);

	}else{

		/*this.videoAudio.controller = null;
		this.playerManager.playerAudio.reset();*/
		extendedCommentsASD.active = false;

		Media.audioDescriptionEnabled = false;
		setCookie("audioDescriptionDisabled", 1);
		$textContent.html("Aucun");
	}
	
	this.updateActiveStreams();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Updates the progress bar
 * @param {Integer} time The current position inside the video (in milliseconds)
 * @param {Integer} tT Total time of the video (in milliseconds)
 */

Player.activeOptionAudio = function(index) {
	
	var $textContent = $(document.getElementById("playerOptionAudioCurrentValue"));
	
	Media.currentAudioIndex = index;
	if(index !== Media.audiosList.length){
		Media.audioEnabled = true;
		eraseCookie("audioDisabled");
		
		if(Media.audiosList[index].search("5.1") !== -1){
			Player.mode = "5.1";
			mainAudioASD.active = false;
		}else{
			Player.mode = "stereo";
			extendedAmbienceASD.active = false;
			extendedDialogsASD.active = false;
		}
		
		if(Player.mode === "5.1"){
			extendedAmbienceASD.active = true;
			extendedDialogsASD.active = true;
		}else{
			mainAudioASD.active = true;
		}

		$textContent.html(Media.audiosList[index]);

	}else{
		setCookie("audioDisabled", 1);
		$(document.getElementById("playerOptionAudioCurrentValue")).html("Aucun");
		if(Player.mode === "5.1"){
			extendedAmbienceASD.active = false;
			extendedDialogsASD.active = false;
		}else{
			mainAudioASD.active = false;
		}
	}
	this.updateActiveStreams();
};

Player.updateActiveStreams = function(){
	
	/// notify the modification of active streams
	streamSelector.activeStreamsChanged();
	smartFader.activeStreamsChanged();
	multichannelSpatialiser.activeStreamsChanged();
	objectSpatialiserAndMixer.activeStreamsChanged();	
};