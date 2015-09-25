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
    	playerMain: null,
    	playerPip: null,
    	playerAudio: null,
    	audioContext: null
    	
    };
	
	this.init = function() {
		if(!this.alreadyInit) {
			var playerTopBanner = this.playerUI.children[0];
			var playerBottomBanner = this.playerUI.children[1];
	
			//top bar button
			var btn = createButton("playerClose", playerTopBanner, "playerClose", 0, 0);
			btn.setAttribute("tabindex", 1);
			createImg(null, btn, "");
			btn = createButton("playerShare", playerTopBanner, "playerShare", 1, 0);
			btn.setAttribute("tabindex", 2);
			createImg(null, btn, "");
			btn = createButton("playerSignet", playerTopBanner, "playerSignet", 2, 0);
			btn.setAttribute("tabindex", 3);
			createImg(null, btn, "");
			btn = createButton("playerFavorite", playerTopBanner, "playerFavorite", 3, 0);
			btn.setAttribute("tabindex", 4);
			createImg(null, btn, "");
			btn = createButton("playerSize", playerTopBanner, "playerSize", 4, 0);
			btn.setAttribute("tabindex", 5);
			createImg(null, btn, "");
			
			var playerOptions = playerBottomBanner.children[0];
			
			//button for accessibility
			btn = createButton("playerOptionSigne", playerOptions, "playerOptionSigne", 0, 0);
			btn.setAttribute("tabindex", 6);
			createImg(null, btn, "");
			var btn = createButton("playerOptionView", playerOptions, "playerOptionView", 1, 0);
			btn.setAttribute("tabindex", 7);
			createImg(null, btn, "");
			var btn = createButton("playerOptionSub", playerOptions, "playerOptionSub", 2, 0);
			btn.setAttribute("tabindex", 8);
			createImg(null, btn, "");
			var btn = createButton("playeroptionDescription", playerOptions, "playeroptionDescription", 3, 0);
			btn.setAttribute("tabindex", 9);
			createImg(null, btn, "");
			
			var playerControls = playerBottomBanner.children[2];
			var playerControlTrickMode = playerControls.children[1];
			
			// button for trick mode
			btn = createButton("playerControlRW", playerControlTrickMode, "playerControlRW", 0, 0);
			btn.setAttribute("tabindex", 10);
			createImg(null, btn, "");
			btn = createButton("playerControlPlayPause", playerControlTrickMode, "playerControlPlayPause", 1, 0);
			btn.setAttribute("tabindex", 11);
			createImg(null, btn, "");
			btn = createButton("playerControlFF", playerControlTrickMode, "playerControlFF", 2, 0);
			btn.setAttribute("tabindex", 12);
			createImg(null, btn, "");
			btn = createButton("playerControlStop", playerControlTrickMode, "playerControlStop", 3, 0);
			btn.setAttribute("tabindex", 13);
			createImg(null, btn, "");
		
		
			//LANCEMENT DU PLAYER ATTENTION CODE TOUCHY
	        var context = new MediaPlayer.di.Context();
	
	        var urlMain = "http://m4dp.ateme.com/M4DP_prod/manifest.mpd";
	       	this.playerManager.playerMain = new MediaPlayer(context);
	       	this.playerManager.playerMain.startup();
	        //playerMain.getDebug().setLevel(10);
	       	this.playerManager.playerMain.setAutoPlay(true);
	       	this.playerManager.playerMain.attachView(this.videoMain);
	
	        //var urlPip = "http://m4dp.ateme.com/M4DP_prod/manifest.mpd";
	        var urlPip = "http://m4dp.ateme.com/M4DP_prod-LSF/manifest-lsf.mpd";
	        this.playerManager.playerPip = new MediaPlayer(context);
	        this.playerManager.playerPip.startup();
	        this.playerManager.playerPip.setAutoPlay(true);
	        this.playerManager.playerPip.attachView(this.videoPip);
	        //videoPlayerPipMediaElement.style.zIndex = "2147483648"; //pour etre au dessus du 0x7fffffff du player en fullscreen
	
	        var urlAudio = "http://m4dp.ateme.com/M4DP_prod/manifest-audio-only.mpd";
	        this.playerManager.playerAudio = new MediaPlayer(context);
	        this.playerManager.playerAudio.startup();
	        this.playerManager.playerAudio.setAutoPlay(true);
	        this.playerManager.playerAudio.attachView(this.videoAudio);
	
	        var controller = new MediaController();
	
	        console.debug("controller = " + controller);
	        console.debug("videoPlayerMainMediaElement.controller = " + this.videoMain.controller);
	
	        this.videoMain.controller = controller;
	        this.videoPip.controller = controller;
	        this.videoAudio.controller = controller;
	
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
	
	        this.playerManager.playerMain.attachSource(urlMain);
	        this.playerManager.playerPip.attachSource(urlPip);
	        this.playerManager.playerAudio.attachSource(urlAudio);
	
	
	        controller.addEventListener('timeupdate', function(e)
	        {
	            /*deltaPip = Math.abs(videoPlayerPipMediaElement.currentTime - videoPlayerMainMediaElement.currentTime);
	            deltaAudio = Math.abs(videoPlayerAudioMediaElement.currentTime - videoPlayerMainMediaElement.currentTime);
	            console.debug("# timeupdate,");
	            console.debug("##    delta main vs pip   : "+deltaPip);
	            console.debug("##    delta main vs audio : "+deltaAudio);*/
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
	
	        function onCheckAudio()
	        {
	            console.debug("######### onCheckAudio: " + checkboxAudio.checked);
	            if (checkboxAudio.checked)
	            {
	                controller.currentTime = videoPlayerMainMediaElement.currentTime;
	                videoPlayerAudioMediaElement.controller = controller;
	                this.playerManager.playerAudio.startup();
	                this.playerManager.playerAudio.setAutoPlay(true);
	                this.playerManager.playerAudio.attachView(videoPlayerAudioMediaElement);
	                this.playerManager.playerAudio.attachSource(urlAudio);
	            }
	            else
	            {
	                videoPlayerAudioMediaElement.controller = null;
	                this.playerManager.playerAudio.reset();
	            }
	        }
	
	        function onCheckLSF()
	        {
	            console.debug("######### onCheckLSF: " + checkboxLSF.checked);
	            if (checkboxLSF.checked)
	            {
	                controller.currentTime = videoPlayerMainMediaElement.currentTime;
	                videoPlayerPipMediaElement.controller = controller;
	                this.playerManager.playerPip.startup();
	                this.playerManager.playerPip.setAutoPlay(true);
	                this.playerManager.playerPip.attachView(videoPlayerPipMediaElement);
	                this.playerManager.playerPip.attachSource(urlPip);
	            }
	            else
	            {
	                videoPlayerPipMediaElement.controller = null;
	                this.playerManager.playerPip.reset();
	            }
	        }
		
			this.alreadyInit = true;
		}
        
		this.playerManager.playerMain.play();
        this.playerManager.playerPip.play();
        this.playerManager.playerAudio.play();
		
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
	
	this.validClose = function() {
		this.playerManager.playerMain.reset();
		this.playerManager.playerPip.reset();
		this.playerManager.playerAudio.reset();
		
		myTopbar.show();
		//pas de init on veux juste rendre visible l'existant
		myDash.show();
		this.hide();
	};
	
	return this;
};