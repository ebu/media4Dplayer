var checkPositionVideo;
function playerScreen() {
	var myPlayerScreen = this;
	this.activeScreen = false;
	this.alreadyInit = false;
	this.playerScreen = document.getElementById("playerScreen");
	this.playerUI = document.getElementById('playerUI');
	
	$(this.playerUI).on('click', function(e){
		if(["pipContainer","playerTopBanner","playerBottomBanner","playerControls","playerControlVolume"].indexOf(e.target.id) !== -1){
			if($(document.getElementById("playerBottomBanner")).is(":visible")){
				myPlayer.hideUI();
			}else{
				myPlayer.diplayUI();
			}
		}else{
			console.log("id="+e.target.id);
		}
	});

	this.videoMain = document.getElementById('videoPlayerMain');
	this.videoPip =  document.getElementById('videoPlayerPip');
    this.videoAudio = document.getElementById('videoPlayerAudio');
    
    this.playerManager = {
    	urlMain: null,
    	urlPip: null,
    	urlAudio: null,

    	urlMain0: "http://videos-pmd.francetv.fr/innovation/media4D/m4dp-set1-LMDJ-ondemand/manifest_ttml.mpd",
    	urlPip0: "http://videos-pmd.francetv.fr/innovation/media4D/m4dp-set1-LMDJ-ondemand/manifest-lsf.mpd",
    	urlAudio0: "http://videos-pmd.francetv.fr/innovation/media4D/m4dp-set1-LMDJ-ondemand/manifest-ad.mpd",

    	//urlMain1: "http://medias2.francetv.fr/innovation/media4D/m4dp-demo1-webvtt/m4dp-demo1-webvtt/manifest-webvtt.mpd",
    	urlMain1: "http://dash.edgesuite.net/akamai/test/caption_test/ElephantsDream/elephants_dream_480p_heaac5_1.mpd",
    	urlPip1: "http://medias2.francetv.fr/innovation/media4D/m4dp-demo1-webvtt/m4dp-demo1-webvtt/manifest-lsf.mpd",
    	urlAudio1: "http://medias2.francetv.fr/innovation/media4D/m4dp-demo1-webvtt/m4dp-demo1-webvtt/manifest-ad.mpd",

    	playerMain: null,
    	playerPip: null,
    	playerAudio: null,
    	controller: null,
    	audioContext: null,
    	optionSigne: true,
    	optionDescription: true,
    	optionSub: true
    };
	
	var btnPlayPause = null;
	var isPlaying = null;
	var currentPipMode = null;
	var pipControlTimeout = null;
	


	
	this.show = function() {
		myTopbar.hide();
		this.playerScreen.style.display = "block";
		this.activeScreen = true;

		this.resetTimerHideUI();
	};
	
	this.hide = function() {
		this.playerScreen.style.display = "none";
		this.activeScreen = false;
	};

	this.onPause = function() {
		console.log("onPause");
		isPlaying = false;
		btnPlayPause.children[0].src="media/player/controle_btn_play.png";
		btnPlayPause.children[0].alt="lecture";
	}	
	this.onPlay = function() {
		console.log("onPlay");
		isPlaying = true;
		btnPlayPause.children[0].src="media/player/controle_btn_pause.png";
		btnPlayPause.children[0].alt="pause";
	}

	this.validClose = function() {
		this.playerManager.playerMain.reset();
		this.playerManager.playerPip.reset();
		this.playerManager.playerAudio.reset();
		
		myTopbar.show();
		//pas de init on veux juste rendre visible l'existant
		myDash.show();
		this.hide();
	};

	var isOptionDropDownMenuDisplayed = false;
	var currentOptionDropDownMenu = "";
	var dropDownMenu;
	this.displayOptionDropDownMenu = function(optionID) {

		if(isOptionDropDownMenuDisplayed && (optionID ==currentOptionDropDownMenu)) {
			console.log("displayOptionDropDownMenu hide");
			$(".optionDropDownMenu").addClass("hidden");
			isOptionDropDownMenuDisplayed = false;
			return;
		}
		else if(isOptionDropDownMenuDisplayed && (optionID ==currentOptionDropDownMenu)) {
		}
		else if(!isOptionDropDownMenuDisplayed) {
			$(".optionDropDownMenu").removeClass("hidden");
			isOptionDropDownMenuDisplayed = true;
		}
		currentOptionDropDownMenu = optionID;

		emptyElem(dropDownMenu);

		var inputsArray = this.getOptionsArrayForOption(optionID);
		$(".optionDropDownMenu").css("top", this.getOptionsDropDownMenuTop(inputsArray));
		$(".optionDropDownMenu").css("left", this.getOptionsDropDownMenuLeft(optionID));
		$(".optionDropDownMenu").css("height", this.getOptionsDropDownMenuHeight(inputsArray));


		for (var i = 0; i < inputsArray.length; i++) {
			//var bt = createButton("opt"+i, dropDownMenu, "optionDropDownMenuButton", 0, 0, "optionDropDownMenuButton");
			var bt = createButtonWithActionFunction(i, dropDownMenu, "optionDropDownMenuButton", "optionDropDownMenuButton", function() {
				var optionSelected = this.getAttribute("id");
				var l = (inputsArray.length-1) + "";
				if(optionID == "signe") {
					myPlayerScreen.activeOptionSigne(optionSelected != l);
				}
				else if(optionID == "sub") {
					myPlayerScreen.activeOptionSub(optionSelected != l);
				}
				else if(optionID == "description") {
					myPlayerScreen.activeOptionDescription(optionSelected != l);	
				}
				else if(optionID == "audio") {
					//myPlayerScreen.activeOptionAudio(this.index == length-1);	
				}
				else {
					console.log("pwet");
				}				
			});
			//bt.index = i;
			bt.innerHTML = inputsArray[i];
		}




//		var btn = createButton("playerClose", playerTopBanner, "playerClose", 0, 0);
//		btn.setAttribute("tabindex", 1);
	}

	this.getOptionsArrayForOption = function(optionID) {
		var optionsArray;

		switch(optionID) {
			case "signe":
				optionsArray = ["Fr", "Aucun"];
				break;
			case "description":
				optionsArray = ["Aucun"];
				break;
			case "sub":
				optionsArray = ["Fr", "Aucun"];
				break;
			case "audio":
				optionsArray = ["Fr", "Aucun"];
				break;
		}
		return optionsArray;
	}

	this.getOptionsDropDownMenuHeight = function(inputsArray) {
		return inputsArray.length * (50 + 1); // +1 for border 
	}
	this.getOptionsDropDownMenuTop = function(inputsArray) {
		return 120; 
	}
	this.getOptionsDropDownMenuLeft = function(optionID) {

		var leftOption = 0;

		switch(optionID) {
			case "signe":
				leftOption = document.getElementById("playerOptionSigne").offsetLeft;
				break;
			case "description":
				leftOption = document.getElementById("playerOptionDescription").offsetLeft;
				break;
			case "sub":
				leftOption = document.getElementById("playerOptionSub").offsetLeft;
				break;
			case "audio":
				leftOption = document.getElementById("playerOptionAudio").offsetLeft;
				break;
			default :
				console.log("getOptionsDropDownMenuLeft - no optionID defined for " + optionID);
				leftOption = 0;
				break;
		}

		var leftDDM = leftOption + 57;
		return leftDDM + "px";
	}

	
	this.validOptionSigne = function() {
		this.displayOptionDropDownMenu("signe");
	}
	this.activeOptionSigne = function(active) {
		console.log("activeOptionSigne: " + active);
		console.log("this.playerManager.optionSigne: " + this.playerManager.optionSigne);

        if (!this.playerManager.optionSigne && active)
        {
        	this.playerManager.controller.currentTime = this.videoMain.currentTime;
            this.videoPip.controller = this.playerManager.controller;
            this.playerManager.playerPip.startup();
            this.playerManager.playerPip.setAutoPlay(false);
            this.playerManager.playerPip.attachView(this.videoPip);
            this.playerManager.playerPip.attachSource(this.playerManager.urlPip);
            this.playerManager.optionSigne = true;
        }
        else
        {
        	this.videoPip.controller = null;
            this.playerManager.playerPip.reset();
            this.playerManager.optionSigne = false;
        }
        this.resetTimerHideUI();
	};
	
	this.validOptionDescription = function() {
		this.displayOptionDropDownMenu("description");
	}
	this.activeOptionDescription = function(active) {

        if (!this.playerManager.optionDescription && active)
        {
        	this.playerManager.controller.currentTime = this.videoMain.currentTime;
            this.videoAudio.controller = this.playerManager.controller;
            this.playerManager.playerAudio.startup();
            this.playerManager.playerAudio.setAutoPlay(false);
            this.playerManager.playerAudio.attachView(this.videoAudio);
            this.playerManager.playerAudio.attachSource(this.playerManager.urlAudio);
            this.playerManager.optionDescription = true;
        }
        else
        {
            this.videoAudio.controller = null;
            this.playerManager.playerAudio.reset();
            this.playerManager.optionDescription = false;
        }
        this.resetTimerHideUI();       
    };
	this.validOption = function(button, zone){
		if($(button).length && !$(button).hasClass("hidden")){
			switch(zone){
				case "playerOptionSigne":
					myPlayer.validOptionSigne();
					break;
				case "playerOptionDescription":
					myPlayer.validOptionDescription();
					break;
				case "playerOptionSub":
					myPlayer.validOptionSub();
					break;
				case "playerOptionAudio":
					myPlayer.validOptionAudio();
					break;
			}
		}
	},
	this.validOptionSub = function() {
		this.displayOptionDropDownMenu("sub");
	}
	this.activeOptionSub = function(active) {
        if (!this.playerManager.optionSub && active) {
            this.playerManager.optionSub = true;
        }
        else {
            this.playerManager.optionSub = false;
        }
	};

	this.validOptionAudio = function() {
		this.displayOptionDropDownMenu("audio");
	}
	this.activeOptionAudio = function(active) {
		console.log("activeOptionAudio TODO");
	}

	this.playPause = function() {
		console.log("playPause : ", isPlaying);
		
		if(isPlaying == true) {
			this.playerManager.controller.pause();
		}
		else {
			this.playerManager.controller.play();	
		}
		//		this.playerManager.controller.pause();

		this.resetTimerHideUI();
	};

	this.ff = function(){
		
		var totalTimeSecond =  this.playerManager.controller.duration;	
		var saut = Math.round(totalTimeSecond*(5/100));
		var currentPosition = this.playerManager.controller.currentTime;
		var newCurrentPosition = currentPosition + saut;
		if (newCurrentPosition > totalTimeSecond) {
			newCurrentPosition = totalTimeSecond;
		}
		//this.playerManager.playerMain.seek(newCurrentPosition);
		
		// check if the new position is seekable
		console.log("newCurrentPosition = "+newCurrentPosition);
		for (var i=0; i<this.playerManager.controller.seekable.length; i++) {
			console.log("check range #" + i + " -> "+this.playerManager.controller.seekable.start(i)+", "+this.playerManager.controller.seekable.end(i));
			if (this.playerManager.controller.seekable.start(i) <= newCurrentPosition && newCurrentPosition <= this.playerManager.controller.seekable.end(i)) {
				console.log("   range match, do seek");
				this.playerManager.controller.currentTime = newCurrentPosition;
				break;
			}
		}
		//Note: if the newCurrentPosition is not seekable, we do nothing for now. It could be interesting to seek to the last seekable position instead.
	};

	this.rw = function(){
		
		var totalTimeSecond =  this.playerManager.controller.duration;	
		var saut = Math.round(totalTimeSecond*(5/100));
		var currentPosition = this.playerManager.controller.currentTime;
		var newCurrentPosition = currentPosition - saut;
		if (newCurrentPosition < 0) {
			newCurrentPosition = 0;
		}
		//this.playerManager.playerMain.seek(newCurrentPosition);
		
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

	this.stop = function(){
		this.playerManager.controller.pause();
		this.playerManager.controller.currentTime = 0;
		this.progressBar.reset();
	};


	this.updateIconsPip = function() {
		this.updateIconCenterPositionToCenter();
		this.updateIconSwitchPositionToTopCenter();
	}

	this.updateIconSwitchPositionToTopCenter = function() {
		console.log("updateIconSwitchPositionToTopCenter");
/*
		$(".ui-icon-switchVideos").css({
			position:'absolute',
			top:'-30px',
			left:($(".settingsPipVideo").width() - $(".ui-icon-switchVideos").outerWidth()) / 2
		});
*/
	}
	this.updateIconCenterPositionToCenter = function() {
		console.log("updateIconCenterPositionToCenter");
		$(".ui-icon-gripsmall-center").css({
			position:'absolute',
			left:($(".pipVideo").width() - $(".ui-icon-gripsmall-center").outerWidth()) / 2,
			top:($(".pipVideo").height() - $(".ui-icon-gripsmall-center").outerHeight()) / 2
		});
	}

	var refreshTimer;
	this.resetTimerHideUI = function() {
		
		if(refreshTimer!= null) {
			clearInterval(refreshTimer);
		}
		refreshTimer = setTimeout(this.hideUI, 4 * 1000);
		
	}

	this.diplayUI = function() {
		$("#playerTopBanner").css("display","block");
		$("#playerBottomBanner").css("display","block");
		$("#playerUI").css("background","");
		this.resetTimerHideUI();	
	}
	this.hideUI = function() {
		$("#playerTopBanner").css("display","none");
		$("#playerBottomBanner").css("display","none");
		$("#playerUI").css("background","url('../media/player/player_ombre_video.png') repeat");
	}
	
	this.init = function(index) {
		if(!this.alreadyInit || (currentIndex != index) ) {

			$("#playerScreen").css("background-color", "black");

			currentIndex = index;
			

			var playerTopBanner = this.playerUI.children[0];
			var playerBottomBanner = this.playerUI.children[1];
	
			//top bar button
			var btn = createButton("playerClose", playerTopBanner, "playerClose", 0, 0);
			btn.setAttribute("tabindex", 11);
			createImg(null, btn, "media/player/inte_close.png", null, "Fermer");
			
			var playerOptions = playerBottomBanner.children[0];
			emptyElem(playerOptions);
			
			//button for accessibility
			var btn = createButton("playerOptionAudio", playerOptions, "playerOptionAudio", 3, 0);
			btn.setAttribute("tabindex", 21);
			createIconeLA(btn, 57, 42);
			createDiv("playerOptionAudioCurrentValue", btn, "Fr", "playerOptionValue");

			btn = createButton("playerOptionSub", playerOptions, "playerOptionSub", 2, 0);
			btn.setAttribute("tabindex", 22);
			createIconeST(btn, 57, 42);
			createDiv("playerOptionSubCurrentValue", btn, "Fr", "playerOptionValue");

			btn = createButton("playerOptionDescription", playerOptions, "playerOptionDescription", 1, 0, "hidden");
			//btn.setAttribute("tabindex", 23);
			createIconeAD(btn, 57, 42);
			createDiv("playerOptionDescriptionCurrentValue", btn, "Aucun", "playerOptionValue");
			
			btn = createButton("playerOptionSigne", playerOptions, "playerOptionSigne", 0, 0);
			btn.setAttribute("tabindex", 24);
			createIconeLSF(btn, 57, 42);
			createDiv("playerOptionSigneCurrentValue", btn, "Aucun", "playerOptionValue");
			
			var playerControls = playerBottomBanner.children[2];
			var playerControlTrickMode = playerControls.children[1];
			
			// button for trick mode
			btn = createButton("playerControlRW", playerControlTrickMode, "playerControlRW", 0, 0);
			btn.setAttribute("tabindex", 31);
			createImg(null, btn, "media/player/controle_btn_previous.png", null, "retour rapide");

			btnPlayPause = createButton("playerControlPlayPause", playerControlTrickMode, "playerControlPlayPause", 1, 0);
			btnPlayPause.setAttribute("tabindex", 11);
			createImg(null, btnPlayPause, "media/player/controle_btn_play.png", null, "lecture");

			btn = createButton("playerControlFF", playerControlTrickMode, "playerControlFF", 2, 0);
			btn.setAttribute("tabindex", 32);
			createImg(null, btn, "media/player/controle_btn_next.png", null, "avance rapide");
			btn = createButton("playerControlStop", playerControlTrickMode, "playerControlStop", 3, 0);
			btn.setAttribute("tabindex", 33);
			createImg(null, btn, "media/player/controle_btn_stop.png", null, "stop");
			
			btn = createButton("playerControlConfig", playerControlTrickMode, "playerControlConfig", 4, 0);
			btn.setAttribute("tabindex", 34);
			createImg(null, btn, "media/topbar/menu_reglages.png", null, "settings");

			dropDownMenu = createDiv("optionDropDownMenu", playerBottomBanner, null, "optionDropDownMenu hidden");
			isOptionDropDownMenuDisplayed = false;

			//LANCEMENT DU PLAYER ATTENTION CODE TOUCHY
	        //var context = new MediaPlayer.di.Context();
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
	
	        console.debug("controller = " + this.playerManager.controller);
	
		    this.videoMain.controller = this.playerManager.controller;
		    this.videoPip.controller = this.playerManager.controller;
		    this.videoAudio.controller = this.playerManager.controller;

	        this.playerManager.audioContext = new(window.AudioContext || window.webkitAudioContext)();
	        console.debug("######### audioContext: " + this.playerManager.audioContext);
	
	        var videoAudioSource = this.playerManager.audioContext.createMediaElementSource(this.videoMain);
	        var audioAudioSource = this.playerManager.audioContext.createMediaElementSource(this.videoAudio);
						
	        audioGainNode = this.playerManager.audioContext.createGain();
	        audioAudioSource.connect(audioGainNode);
	        audioGainNode.connect(this.playerManager.audioContext.destination);
	
	        videoGainNode = this.playerManager.audioContext.createGain();
			myPlayerScreen.setVolume(audioGainNode, videoGainNode, getCookie("volumeValue") || defaultVolumeValue);
	        videoAudioSource.connect(videoGainNode);
	        videoGainNode.connect(this.playerManager.audioContext.destination);

            this.playerManager.controller.addEventListener('play', function(e) {
            	myPlayerScreen.onPlay();
            });
			this.playerManager.controller.addEventListener('pause', function(e) {
            	myPlayerScreen.onPause();
            });

            this.playerManager.playerMain.addEventListener(MediaPlayer.events.TEXT_TRACKS_ADDED, function(e) {
				if(getCookie("subtitlesDisabled")){
					myPlayerScreen.playerManager.playerMain.setTextTrack(-1);
				}else{
					myPlayerScreen.playerManager.playerMain.setTextTrack(0);
				}
            	console.debug("MediaPlayer.events.TEXT_TRACKS_ADDED");
		
				var xPos = getCookie("LSFPipSubtitles_position_x"),
					yPos = getCookie("LSFPipSubtitles_position_y"),
					wSize = getCookie("LSFPipSubtitles_size_width"),
					hSize = getCookie("LSFPipSubtitles_size_height");

				if(xPos !== "undefined" && yPos !== "undefined" && wSize !== "undefined" && hSize !== "undefined"){
					var top = Math.round(yPos);
					if(top <= 0){
						top = 0;
					}else if(top>= 65){
						top = 65 / 2;
					}else{
						top = top / 2;
					}
					$(ttmlDiv).css("top", top + "%")
						.css("left", xPos + "%")
						.css("width", wSize + "%");
				}
            });		
			
	        /*
            function onCheckVideo()
            {
                console.debug("######### onCheckVideo: " + checkboxVideo.checked);
                if (checkboxVideo.checked)
                {
                    videoGainNode.gain.value = 1.;
                }
                else
                {
                    videoGainNode.gain.value = 0.;
                }
            } 
	        */
			this.alreadyInit = true;
		}

		if(currentIndex == 0) {
			this.playerManager.urlMain = this.playerManager.urlMain0;
			this.playerManager.urlPip = this.playerManager.urlPip0;
			this.playerManager.urlAudio = this.playerManager.urlAudio0;

			//$("#videoSubtitle").attr("src", "samplesVTT/w1_jamy.vtt");

		}
		else {
			this.playerManager.urlMain = this.playerManager.urlMain1;
			this.playerManager.urlPip = this.playerManager.urlPip1;
			this.playerManager.urlAudio = this.playerManager.urlAudio1;

			//$("#videoSubtitle").attr("src", "samplesVTT/w1_20h.vtt");
		}
		
		this.playerManager.playerMain.attachView(this.videoMain);
		this.playerManager.playerMain.attachVideoContainer(document.getElementById("playerScreen"));

		// Add HTML-rendered TTML subtitles
		ttmlDiv = document.querySelector("#video-caption");
		this.playerManager.playerMain.attachTTMLRenderingDiv(ttmlDiv);
		this.playerManager.playerPip.attachView(this.videoPip);
	    this.playerManager.playerAudio.attachView(this.videoAudio);

		this.setPIP();

		//JTB
		if(currentPipMode == null) {
			currentPipMode = (getCookie("PIPMode") != null) ? getCookie("PIPMode") : "PIP_MODE_LSF";	
		}
		console.log("Player - currentPipMode : ", currentPipMode);
		if(currentPipMode == "PIP_MODE_VIDEO") {
/*			
			var pipWidth = $(".pipVideo").css("width");
			var pipHeight = $(".pipVideo").css("height");
			var pipTop = $(".pipVideo").css("top");
			var pipLeft = $(".pipVideo").css("left");
			var pipZindex = $(".pipVideo").css("z-index");

			$(".pipVideo").css("width", $("#videoPlayerMain").css("width"));
			$(".pipVideo").css("height", $("#videoPlayerMain").css("height"));
			$(".pipVideo").css("top", $("#videoPlayerMain").position().top);
			$(".pipVideo").css("left", $("#videoPlayerMain").position().left);
			$(".pipVideo").css("z-index", $("#videoPlayerMain").css("z-index"));

			$("#videoPlayerMain").css("width", pipWidth);
			$("#videoPlayerMain").css("height", pipHeight);
			$("#videoPlayerMain").css("top", pipTop);
			$("#videoPlayerMain").css("left", pipLeft);	
			$("#videoPlayerMain").css("z-index", pipZindex);	
*/

			//$("#videoPlayerPip").attr("muted", "false"); // /!\  EFFECT MUTED EVEN "false"
			this.playerManager.playerMain.attachSource(this.playerManager.urlPip);
    		this.playerManager.playerPip.attachSource(this.playerManager.urlMain);
		}
		else {
			//$("#videoPlayerPip").attr("muted", "false"); // /!\  EFFECT MUTED EVEN "false"
			this.playerManager.playerMain.attachSource(this.playerManager.urlMain);
    		this.playerManager.playerPip.attachSource(this.playerManager.urlPip);
		}

		this.playerManager.playerAudio.attachSource(this.playerManager.urlAudio);


        this.playerManager.playerMain.play();
        this.playerManager.playerPip.play();
        this.playerManager.playerAudio.play();
        //this.playerManager.controller.play();

//this.playerManager.playerMain.seek(0);

        myPlayerScreen.onPlay(); // pas d'évenement lors du play... alors on le force.

        myPlayerScreen.updateIconsPip();
		myPlayerScreen.show();

		this.resetTimerHideUI();
		
		this.initSubtitlesParams();
		
		this.launchCheckPositionVideo();
	},
	this.setPIP = function(){
		if(getCookie("LSFPip_position_x") != null) {
			$(".pipVideo").css("left", getCookie("LSFPip_position_x") + "%" );
		}
		if(getCookie("LSFPip_position_y") != null) {
			$(".pipVideo").css("top", getCookie("LSFPip_position_y") + "%" );
		}
		if(getCookie("LSFPip_size_width") != null) {
			$(".pipVideo").css("width", getCookie("LSFPip_size_width") + "%" );
		}
		if(getCookie("LSFPip_size_height") != null) {
			$(".pipVideo").css("height", getCookie("LSFPip_size_height") + "%" );
		}

		$( ".pipVideo" ).draggable({ 	containment: ".videoPipContainer",
										scroll:false,
										handle:".ui-icon-gripsmall-center",
										stop: function() {
											console.log("onDrag STOP");
											appearPipControls()
											saveCoordinates();
										},
										start: function() {
											console.log("onDrag START");
											clearInterval(pipControlTimeout);
        									$(".videoPipContainer").css("border-style","solid");
        									$(".pipVideo").css("border-style","solid");
      									}
										})
						.resizable({
										containment: ".videoPipContainer",
										handles: 'all',
										minHeight: 120,
										aspectRatio: 16/9,
										resize: function() {
											myPlayerScreen.updateIconsPip();
										},
										stop: function() {
											saveLSFSize();
											saveLSFCoordinates();
										}
									})
						.click( function() {
							console.log("onClick .pipVideo !!");
							appearPipControls();
						});

		$('.ui-resizable-nw').addClass('ui-icon ui-icon-gripsmall-diagonal-nw');
		$('.ui-resizable-ne').addClass('ui-icon ui-icon-gripsmall-diagonal-ne');
		$('.ui-resizable-sw').addClass('ui-icon ui-icon-gripsmall-diagonal-sw');
		$('.ui-resizable-se').addClass('ui-icon ui-icon-gripsmall-diagonal-se');
		$(".ui-icon").css("display", "none");
		
		function saveCoordinates() {

			var pipTop  = $(".pipVideo").position().top;
			var pipLeft = $(".pipVideo").position().left;
			var widthContainerString  = $(".videoPipContainer").css("width"); 		// get px here ?!
			var heightContainerString  = $(".videoPipContainer").css("height");		// get px here ?!
			var widthContainerPx  = widthContainerString.substring(0,widthContainerString.length-2);
			var heightContainerPx  = heightContainerString.substring(0,heightContainerString.length-2);
			
			var playerScreenWidthString = $("#playerScreen").css("width");
			var playerScreenWidthPx = playerScreenWidthString.substring(0,playerScreenWidthString.length-2);
			var playerScreenHeightString = $("#playerScreen").css("height");
			var playerScreenHeightPx = playerScreenHeightString.substring(0,playerScreenHeightString.length-2);

			var widthPx = (widthContainerPx/100)*playerScreenWidthPx;
			var heightPx = (heightContainerPx/100)*playerScreenHeightPx;

			var newLeftPercent = (pipLeft/widthContainerPx )*100;
			var newTopPercent = (pipTop/heightContainerPx)*100;

			console.log("saveCoordinates : (left:"+ newLeftPercent+ ", top:"+newTopPercent);

			setCookie("LSFPip_position_x", newLeftPercent);
			setCookie("LSFPip_position_y", newTopPercent);
		}
		function saveLSFSize() {
			console.log("!! saveLSFSize TODO !!");
		}

		function appearPipControls() {
			console.log("appearPipControls");
			if(pipControlTimeout != null) clearInterval(pipControlTimeout);
			pipControlTimeout = setTimeout(disappearPipControls, 3 *1000);

			myPlayerScreen.updateIconsPip(); //debug

			$(".videoPipContainer").css("border-style","solid");
			$(".pipVideo").css("border-style","solid");
			$(".ui-icon").css("display", "block");
		}

		function disappearPipControls() {
			console.log("disappearPipControls");

			$(".videoPipContainer").css("border-style","hidden");
			$(".pipVideo").css("border-style","hidden");
			$(".ui-icon").css("display", "none");
		}		
	},
	this.initSubtitlesParams = function(){
		
		// subtitles
		var $videoPlayer = $(ttmlDiv).removeClass("fontArial fontOpenDyslexic fontAndika fontHelvetica fontLexia");
		var selectedFont = getCookie("subtitleFont");
		if(selectedFont){
			$videoPlayer.addClass("font"+selectedFont);
		}
		
		// color
		$videoPlayer.removeClass("multiColor whiteColor yellowColor blueColor");
		var selectedFontColor = getCookie("subtitleFontColor");
		if(selectedFontColor){
			$videoPlayer.addClass(selectedFontColor);
		}	
		
		// background color & Opacité du background
		$videoPlayer.removeClass("blackBGColor whiteBGColor");
		var selectedFontBGColor = getCookie("subtitleBGColor");
		if(selectedFontBGColor){
			$videoPlayer.addClass(selectedFontBGColor);
		}
		
		// Opacité du background
		$videoPlayer.removeClass("opacity_0 opacity_025 opacity_05 opacity_075 opacity_1");
		var selectedFontBGColor = getCookie("subtitleBackgroundOpacity");
		if(selectedFontBGColor){
			$videoPlayer.addClass("opacity_"+selectedFontBGColor.replace(".",""));
		}
		
		// font-size
		$videoPlayer.css("font-size", "inherit");
		var selectedFontSize = getCookie("subtitleFontSize");
		if(selectedFontSize){
			$videoPlayer.css("font-size", selectedFontSize+"px");
		}		
	},
	


																								/********************************
																								*	GESTION DE LA PROGRESSBAR	*
																								********************************/

	/**
	 * @author Johny EUGENE (DOTSCREEN)
	 * @description Launches the progress bar updating
	 */

	this.launchCheckPositionVideo = function(){

		this.stopCheckVideoPosition();
		var player = this;
		checkPositionVideo = setInterval(function(){

			//if(this.playerManager.controller.isPlaying){
			player.progressBar.update(myPlayerScreen.playerManager.controller.currentTime, myPlayerScreen.playerManager.controller.duration);

			/*}else{
				Main.player.stopCheckVideoPosition();
			}*/

		}, 500);
	};

	/**
	 * @author Johny EUGENE (DOTSCREEN)
	 * @description Stop the progress bar updating
	 */

	this.stopCheckVideoPosition = function(){
		clearInterval(checkPositionVideo);
	};

																								/************************************************
																								*	GESTION DE LA BANNIERE VIDEO (PROGRESS BAR)	*
																								************************************************/

	/**
	 * @author Johny EUGENE (DOTSCREEN)
	 * @description Resets the progress bar
	 */
	
	this.progressBar = {};
	this.progressBar.reset = function(){

		myPlayerScreen.stopCheckVideoPosition();
		clearInterval(checkPositionVideo);
		$(document.getElementById("playerProgressCurrent")).text("-");
		$(document.getElementById("playerProgressTotal")).text("-");
		$(document.getElementById("playerProgressCursor")).css("width",0);

		//Main.banner.hidePauseBtn();
	};

	/**
	 * @author Johny EUGENE (DOTSCREEN)
	 * @description Updates the progress bar
	 * @param {Integer} time The current position inside the video (in milliseconds)
	 * @param {Integer} tT Total time of the video (in milliseconds)
	 */

	this.progressBar.update = function(time, tT){
		
		time = time * 1000;
		tT = tT * 1000;
		var timePercent         = (100 * time) / tT,
			timeC               = " - ",
			timeT               = " - ",
			timeMinute          = 0,   
			timeSecond          = 0,
			totalTimeMinute     = 0,   
			totalTimeSecond     = 0,

		percent = (!isNaN(timePercent)?timePercent:0);

		$(document.getElementById("playerProgressCursor")).css("width", percent + "%");

		//if(myPlayerScreen.playerManager.controller.isPlaying){

			totalTimeMinute = Math.floor(tT / 60000);
			timeMinute      = Math.floor(time / 60000);                
			totalTimeSecond = Math.floor((tT % 60000) / 1000);
			timeSecond      = Math.floor((time % 60000) / 1000);
			timeC = (!isNaN(timeMinute) && !isNaN(timeSecond)) ? pad(timeMinute) + " : " + pad(timeSecond) : timeC;
			timeT = (!isNaN(totalTimeMinute) && !isNaN(totalTimeSecond)) ? pad(totalTimeMinute) + " : " + pad(totalTimeSecond) : timeT;
		//}

		$(document.getElementById("playerProgressCurrent")).text(timeC);
		$(document.getElementById("playerProgressTotal")).text(timeT);
	};
	
	this.setVolume = function(audioGainNode, videoGainNode, volume){
		var gain = volume / 100;
		audioGainNode.gain.value = gain;
		videoGainNode.gain.value = gain;
		console.warn("Volume passé à "+gain);
	};
	
	return this;
};