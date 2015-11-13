function playerScreen() {
	var myPlayerScreen = this;
	this.activeScreen = false;
	this.alreadyInit = false;
	this.playerScreen = document.getElementById("playerScreen");
	this.playerUI = document.getElementById('playerUI');

	this.videoMain = document.getElementById('videoPlayerMain');
	this.videoPip =  document.getElementById('videoPlayerPip');
    this.videoAudio = document.getElementById('videoPlayerAudio');
    
    this.playerManager = {
    	urlMain: "http://medias2.francetv.fr/innovation/media4D/m4dp-demo1-webvtt/m4dp-demo1-webvtt/manifest-webvtt.mpd",
    	urlPip: "http://medias2.francetv.fr/innovation/media4D/m4dp-demo1-webvtt/m4dp-demo1-webvtt/manifest-lsf.mpd",
    	urlAudio: "http://medias2.francetv.fr/innovation/media4D/m4dp-demo1-webvtt/m4dp-demo1-webvtt/manifest-ad.mpd",
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
	this.init = function() {
		if(!this.alreadyInit) {
			var playerTopBanner = this.playerUI.children[0];
			var playerBottomBanner = this.playerUI.children[1];
	
			//top bar button
			var btn = createButton("playerClose", playerTopBanner, "playerClose", 0, 0);
			btn.setAttribute("tabindex", 11);
			createImg(null, btn, "media/player/inte_close.png", null, "Fermer");
/*			btn = createButton("playerShare", playerTopBanner, "playerShare", 1, 0);
			btn.setAttribute("tabindex", 12);
			createImg(null, btn, "media/player/inte_share.png", null, "Partager cette vidéo");
			btn = createButton("playerSignet", playerTopBanner, "playerSignet", 2, 0);
			btn.setAttribute("tabindex", 13);
			createImg(null, btn, "media/player/inte_signet.png", null, "Mettre un signet");
			btn = createButton("playerFavorite", playerTopBanner, "playerFavorite", 3, 0);
			btn.setAttribute("tabindex", 14);
			createImg(null, btn, "media/favoris/favoris_icone_bloc.png", null, "Ajouter aux favoris");
//			btn = createButton("playerSize", playerTopBanner, "playerSize", 4, 0);
//			btn.setAttribute("tabindex", 5);
//			createImg(null, btn, "media/player/inte_exitfullscreen.png", null, "Réduire la taille");

*/
			
			var playerOptions = playerBottomBanner.children[0];
			
			//button for accessibility
			btn = createButton("playerOptionSigne", playerOptions, "playerOptionSigne", 0, 0);
			btn.setAttribute("tabindex", 21);
			createIconeLSF(btn, 120, 120);

			var btn = createButton("playerOptionDescription", playerOptions, "playerOptionDescription", 1, 0);
			btn.setAttribute("tabindex", 22);
			createIconeAD(btn, 120, 120);

			var btn = createButton("playerOptionSub", playerOptions, "playerOptionSub", 2, 0);
			btn.setAttribute("tabindex", 23);
			createIconeST(btn, 120, 120);

			var btn = createButton("playerOptionView", playerOptions, "playerOptionView", 3, 0);
			btn.setAttribute("tabindex", 24);
			createIconeLA(btn, 120, 120);
			
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

			//LANCEMENT DU PLAYER ATTENTION CODE TOUCHY
	        var context = new MediaPlayer.di.Context();
	       
	       	this.playerManager.playerMain = new MediaPlayer(context);
	       	this.playerManager.playerMain.startup();
	        //this.playerManager.playerMain.getDebug().setLevel(10);
	       	this.playerManager.playerMain.setAutoPlay(true);
	

	        this.playerManager.playerPip = new MediaPlayer(context);
	        this.playerManager.playerPip.startup();
	        this.playerManager.playerPip.setAutoPlay(false);

			this.playerManager.playerMain.attachView(this.videoMain);
			this.playerManager.playerPip.attachView(this.videoPip);

	        
	        this.playerManager.playerAudio = new MediaPlayer(context);
	        this.playerManager.playerAudio.startup();
	        this.playerManager.playerAudio.setAutoPlay(false);
	        this.playerManager.playerAudio.attachView(this.videoAudio);
	
	        this.playerManager.controller = new MediaController();
	
	        console.debug("controller = " + this.playerManager.controller);
	        console.debug("videoPlayerMainMediaElement.controller = " + this.videoMain.controller);
	
	        this.videoMain.controller = this.playerManager.controller;
	        this.videoPip.controller = this.playerManager.controller;
	        this.videoAudio.controller = this.playerManager.controller;
	
	        this.playerManager.audioContext = new(window.AudioContext || window.webkitAudioContext)();
	        console.debug("######### audioContext: " + this.playerManager.audioContext);
	
	        var videoAudioSource = this.playerManager.audioContext.createMediaElementSource(this.videoMain);
	        var audioAudioSource = this.playerManager.audioContext.createMediaElementSource(this.videoAudio);
	
	        var audioGainNode = this.playerManager.audioContext.createGain();
	        audioGainNode.gain.value = -1.;
	        audioAudioSource.connect(audioGainNode);
	        audioGainNode.connect(this.playerManager.audioContext.destination);
	
	        var videoGainNode = this.playerManager.audioContext.createGain();
	        videoGainNode.gain.value = 1.;
	        videoAudioSource.connect(videoGainNode);
	        videoGainNode.connect(this.playerManager.audioContext.destination);

	        this.playerManager.controller.addEventListener('timeupdate', function(e)
            {
                /*deltaPip = Math.abs(videoPlayerPipMediaElement.currentTime - videoPlayerMainMediaElement.currentTime);
                deltaAudio = Math.abs(videoPlayerAudioMediaElement.currentTime - videoPlayerMainMediaElement.currentTime);
                console.debug("# timeupdate,");
                console.debug("##    delta main vs pip   : "+deltaPip);
                console.debug("##    delta main vs audio : "+deltaAudio);*/
            });


            this.playerManager.controller.addEventListener('play', function(e) {
            	myPlayerScreen.onPlay();
            });
			this.playerManager.controller.addEventListener('pause', function(e) {
            	myPlayerScreen.onPause();
            });

            /*controller.addEventListener('canplay', function(e) {
                var textTracks = videoPlayerMainMediaElement.textTracks;
                var textTrack = textTracks[0];
                dumpObject(textTrack);
                dumpObject(textTrack.regions);
                console.debug("# textTrack.kind = "+textTrack.kind);
                console.debug("# textTrack.mode = "+textTrack.mode);
                //textTrack.mode = "hidden";
                var cues = textTrack.cues;
                
                var region = new VTTRegion();
                region.width = 80;
                region.id = "regionMain";
                region.regionAnchorX = 0;
                region.regionAnchorY = 100;
                region.viewportAnchorX = 10;
                region.viewportAnchorY = 90;
                region.lines = 3;
                region.scroll = "up";
                dumpObject(region);
                textTrack.addRegion(region);
                
                for (var i=0;i<cues.length;i++) {
                    cues[i].regionId = "regionMain";
                    //cues[i].region = region;
                    cues[i].onenter = function(e) {
                        dumpObject(e.target);
                    }
                }
            });*/
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

//style="left: '+pipLeftPercent+'%; top: '+pipTopPercent+'%; width:'+pipWidthReal+'%; height:'+ pipHeightReal +'%">';


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
        myPlayerScreen.onPlay(); // pas d'évenement lors du play... alors on le force.


        myPlayerScreen.updateIconsPip();
		myPlayerScreen.show();

		this.resetTimerHideUI();
	};


	
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
	
	this.validOptionSigne = function() {
        if (!this.playerManager.optionSigne)
        {
        	this.playerManager.controller.currentTime = this.videoMain.currentTime;
            this.videoPip.controller = this.playerManager.controller;
            this.playerManager.playerPip.startup();
            this.playerManager.playerPip.setAutoPlay(true);
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
	
	this.validOptionDescription = function()
    {
        if (!this.playerManager.optionDescription)
        {
        	this.playerManager.controller.currentTime = this.videoMain.currentTime;
            this.videoAudio.controller = this.playerManager.controller;
            this.playerManager.playerAudio.startup();
            this.playerManager.playerAudio.setAutoPlay(true);
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
	this.validOptionSub = function() {
        if (!this.playerManager.optionSub) {
            this.playerManager.optionSub = true;
        }
        else {
            this.playerManager.optionSub = false;
        }
	};

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
	}


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
		document.getElementById("BTdisplayUI").remove();
		$("#playerUI").css("display","block");
		this.resetTimerHideUI();	
	}
	this.hideUI = function() {
		$("#playerUI").css("display","none");
		var btn = createButton("BTdisplayUI", document.getElementById("playerScreen"), "playerDisplayUI", 0, 0);
	}
	
	return this;
};