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
	this.init = function() {
		if(!this.alreadyInit) {
			var playerTopBanner = this.playerUI.children[0];
			var playerBottomBanner = this.playerUI.children[1];
	
			//top bar button
			var btn = createButton("playerClose", playerTopBanner, "playerClose", 0, 0);
			btn.setAttribute("tabindex", 1);
			createImg(null, btn, "media/player/inte_close.png", null, "Fermer");
			btn = createButton("playerShare", playerTopBanner, "playerShare", 1, 0);
			btn.setAttribute("tabindex", 2);
			createImg(null, btn, "media/player/inte_share.png", null, "Partager cette vidéo");
			btn = createButton("playerSignet", playerTopBanner, "playerSignet", 2, 0);
			btn.setAttribute("tabindex", 3);
			createImg(null, btn, "media/player/inte_signet.png", null, "Mettre un signet");
			btn = createButton("playerFavorite", playerTopBanner, "playerFavorite", 3, 0);
			btn.setAttribute("tabindex", 4);
			createImg(null, btn, "media/favoris/favoris_icone_bloc.png", null, "Ajouter aux favoris");
			btn = createButton("playerSize", playerTopBanner, "playerSize", 4, 0);
			btn.setAttribute("tabindex", 5);
			createImg(null, btn, "media/player/inte_exitfullscreen.png", null, "Réduire la taille");
			
			var playerOptions = playerBottomBanner.children[0];
			
			//button for accessibility
			btn = createButton("playerOptionSigne", playerOptions, "playerOptionSigne", 0, 0);
			btn.setAttribute("tabindex", 6);
			createIconeLSF(btn, 120, 120);

			var btn = createButton("playerOptionDescription", playerOptions, "playerOptionDescription", 1, 0);
			btn.setAttribute("tabindex", 7);
			createIconeAD(btn, 120, 120);

			var btn = createButton("playerOptionSub", playerOptions, "playerOptionSub", 2, 0);
			btn.setAttribute("tabindex", 8);
			createIconeST(btn, 120, 120);

			var btn = createButton("playerOptionView", playerOptions, "playerOptionView", 3, 0);
			btn.setAttribute("tabindex", 9);
			createIconeLA(btn, 120, 120);
			
			var playerControls = playerBottomBanner.children[2];
			var playerControlTrickMode = playerControls.children[1];
			
			// button for trick mode
			btn = createButton("playerControlRW", playerControlTrickMode, "playerControlRW", 0, 0);
			btn.setAttribute("tabindex", 10);
			createImg(null, btn, "media/player/controle_btn_previous.png", null, "retour rapide");

			btnPlayPause = createButton("playerControlPlayPause", playerControlTrickMode, "playerControlPlayPause", 1, 0);
			btnPlayPause.setAttribute("tabindex", 11);
			createImg(null, btnPlayPause, "media/player/controle_btn_play.png", null, "lecture");

			btn = createButton("playerControlFF", playerControlTrickMode, "playerControlFF", 2, 0);
			btn.setAttribute("tabindex", 12);
			createImg(null, btn, "media/player/controle_btn_next.png", null, "avance rapide");
			btn = createButton("playerControlStop", playerControlTrickMode, "playerControlStop", 3, 0);
			btn.setAttribute("tabindex", 13);
			createImg(null, btn, "media/player/controle_btn_stop.png", null, "stop");

			//LANCEMENT DU PLAYER ATTENTION CODE TOUCHY
	        var context = new MediaPlayer.di.Context();
	       
	       	this.playerManager.playerMain = new MediaPlayer(context);
	       	this.playerManager.playerMain.startup();
	        //playerMain.getDebug().setLevel(10);
	       	this.playerManager.playerMain.setAutoPlay(true);
	       	this.playerManager.playerMain.attachView(this.videoMain);
	

	        this.playerManager.playerPip = new MediaPlayer(context);
	        this.playerManager.playerPip.startup();
	        this.playerManager.playerPip.setAutoPlay(false);
	        this.playerManager.playerPip.attachView(this.videoPip);
	        //videoPlayerPipMediaElement.style.zIndex = "2147483648"; //pour etre au dessus du 0x7fffffff du player en fullscreen
	        
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
			this.videoPip.style.left = getCookie("LSFPip_position_x") + "%";
		}
		if(getCookie("LSFPip_position_y") != null) {
			this.videoPip.style.top = getCookie("LSFPip_position_y") + "%";
		}
		if(getCookie("LSFPip_size_width") != null) {
			this.videoPip.style.width = getCookie("LSFPip_size_width") + "%";
		}
		if(getCookie("LSFPip_size_height") != null) {
			this.videoPip.style.height = getCookie("LSFPip_size_height") + "%";
		}

//style="left: '+pipLeftPercent+'%; top: '+pipTopPercent+'%; width:'+pipWidthReal+'%; height:'+ pipHeightReal +'%">';



		//$(".pipPlayer" ).draggable();
		$( ".pipPlayer" ).draggable({ 	containment: ".videoPipContainer",
										scroll:false,
										stop: function() {
											console.log("onDrag STOP");
											$(".videoPipContainer").css("border-style","hidden");
											$(".pipPlayer").css("border-style","hidden");
											saveCoordinates();
										},
										start: function() {
											console.log("onDrag START");
        									$(".videoPipContainer").css("border-style","solid");
        									$(".pipPlayer").css("border-style","solid");
      									}
										});

		function saveCoordinates() {

			var pipTop  = $(".pipPlayer").position().top;
			var pipLeft = $(".pipPlayer").position().left;
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
        
        this.playerManager.playerMain.attachSource(this.playerManager.urlMain);
        this.playerManager.playerPip.attachSource(this.playerManager.urlPip);
        this.playerManager.playerAudio.attachSource(this.playerManager.urlAudio);

        this.playerManager.playerMain.play();
        this.playerManager.playerPip.play();
        this.playerManager.playerAudio.play();
        myPlayerScreen.onPlay(); // pas d'évenement lors du play... alors on le force.

		myPlayerScreen.show();
	};


	
	this.show = function() {
		myTopbar.hide();
		this.playerScreen.style.display = "block";
		this.activeScreen = true;
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

	}
	
	return this;
};