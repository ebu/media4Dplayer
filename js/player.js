function playerScreen() {
	var myPlayerScreen = this;
	this.activeScreen = false;
	this.playerScreen = document.getElementById("playerScreen");
	this.videoMain = document.getElementById('videoPlayerMain');
	this.videoPip =  document.getElementById('videoPlayerPip');
    this.videoAudio = document.getElementById('videoPlayerAudio');
	
	this.init = function() {
        var context = new MediaPlayer.di.Context();

        var urlMain = "http://m4dp.ateme.com/M4DP_prod/manifest.mpd";
        var playerMain = new MediaPlayer(context);
        playerMain.startup();
        //playerMain.getDebug().setLevel(10);
        playerMain.setAutoPlay(true);
        playerMain.attachView(this.videoMain);

        //var urlPip = "http://m4dp.ateme.com/M4DP_prod/manifest.mpd";
        var urlPip = "http://m4dp.ateme.com/M4DP_prod-LSF/manifest-lsf.mpd";
        var playerPip = new MediaPlayer(context);
        playerPip.startup();
        playerPip.setAutoPlay(true);
        playerPip.attachView(this.videoPip);
        //videoPlayerPipMediaElement.style.zIndex = "2147483648"; //pour etre au dessus du 0x7fffffff du player en fullscreen

        var urlAudio = "http://m4dp.ateme.com/M4DP_prod/manifest-audio-only.mpd";
        var playerAudio = new MediaPlayer(context);
        playerAudio.startup();
        playerAudio.setAutoPlay(true);
        playerAudio.attachView(this.videoAudio);

        var controller = new MediaController();

        console.debug("controller = " + controller);
        console.debug("videoPlayerMainMediaElement.controller = " + this.videoMain.controller);

        this.videoMain.controller = controller;
        this.videoPip.controller = controller;
        this.videoAudio.controller = controller;

        var audioContext = new(window.AudioContext || window.webkitAudioContext)();
        console.debug("######### audioContext: " + audioContext);

        var videoAudioSource = audioContext.createMediaElementSource(this.videoMain);
        var audioAudioSource = audioContext.createMediaElementSource(this.videoAudio);

        var audioGainNode = audioContext.createGain();
        audioGainNode.gain.value = -1.;
        audioAudioSource.connect(audioGainNode);
        audioGainNode.connect(audioContext.destination);

        var videoGainNode = audioContext.createGain();
        videoGainNode.gain.value = 1.;
        videoAudioSource.connect(videoGainNode);
        videoGainNode.connect(audioContext.destination);

        playerMain.attachSource(urlMain);
        playerPip.attachSource(urlPip);
        playerAudio.attachSource(urlAudio);

        playerMain.play();
        playerPip.play();
        playerAudio.play();

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
                playerAudio.startup();
                playerAudio.setAutoPlay(true);
                playerAudio.attachView(videoPlayerAudioMediaElement);
                playerAudio.attachSource(urlAudio);
            }
            else
            {
                videoPlayerAudioMediaElement.controller = null;
                playerAudio.reset();
            }
        }

        function onCheckLSF()
        {
            console.debug("######### onCheckLSF: " + checkboxLSF.checked);
            if (checkboxLSF.checked)
            {
                controller.currentTime = videoPlayerMainMediaElement.currentTime;
                videoPlayerPipMediaElement.controller = controller;
                playerPip.startup();
                playerPip.setAutoPlay(true);
                playerPip.attachView(videoPlayerPipMediaElement);
                playerPip.attachSource(urlPip);
            }
            else
            {
                videoPlayerPipMediaElement.controller = null;
                playerPip.reset();
            }
        }
		
		
		
		
		
		
		
		
		
		
		
		
		
		myPlayerScreen.show();
	};
	
	this.show = function() {
		this.playerScreen.style.display = "block";
		this.activeScreen = true;
	};
	
	this.hide = function() {
		this.playerScreen.style.display = "none";
		this.activeScreen = false;
	};
	
	return this;
};