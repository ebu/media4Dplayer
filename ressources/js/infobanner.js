var InfoBanner = {
	progressBar:{},
	timeoutHideBanner:null,
	isVisible:false,
	isOptionDropDownMenuDisplayed:false
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Resets the info banner
 */

InfoBanner.reset = function(){
	$(document.getElementById("playerOptionAudioCurrentValue")).empty();
	$(document.getElementById("playerOptionSubCurrentValue")).empty();
	$(document.getElementById("playerOptionDescriptionCurrentValue")).empty();
	$(document.getElementById("playerOptionSigneCurrentValue")).empty();
	
	this.progressBar.reset();
	
	this.isOptionDropDownMenuDisplayed = false;
	this.isVisible = false;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches the generating of the info banner
 * @param {Object} data Containing data about the media
 */

InfoBanner.load = function(){
	this.reset();
	this.generate();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Inserts the media info in info banner and handles the displaying of buttons
 * @param {Object} data Containing data about the media
 */

InfoBanner.generate = function(){

	// AUDIO
	var $slider = $(document.getElementById("slider"));
	var $audio = $(document.getElementById("playerOptionAudioCurrentValue"));
	if(Media.audioEnabled){
		$audio.text(Media.audiosList[Media.currentAudioIndex]);
		$slider.slider( "option", "disabled", false );
		
	}else{
		$audio.text("Aucun");

		if(typeOf(Media.audiosList) !== "array" || !Media.audiosList.length){
			$audio.parent().addClass("hidden");
			$slider.slider( "option", "disabled", true );
		}else{
			$audio.parent().removeClass("hidden");
			$slider.slider( "option", "disabled", false );
		}
	}
	
	// SOUS-TITRES
	var $subtitles = $(document.getElementById("playerOptionSubCurrentValue"));
	if(Media.subtitleEnabled){
		$subtitles.html(Media.subtitlesList[Media.currentSubtitleIndex] + '<img src="ressources/img/sourd.png" height="100%" style="vertical-align:top;margin-left:10px;"/>');
		
	}else{
		$subtitles.text("Aucun");
		
		if(typeOf(Media.subtitlesList) !== "array" || !Media.subtitlesList.length){
			$subtitles.parent().addClass("hidden");
		}
	}
	
	// AD
	var $ad = $(document.getElementById("playerOptionDescriptionCurrentValue"));
	if(Media.audioDescriptionEnabled){
		$ad.text(Media.audioDescriptions[Media.currentAudioDescriptionIndex].lang);
		
	}else{
		$ad.text("Aucun");

		if(typeOf(Media.audioDescriptions) !== "array" || !Media.audioDescriptions.length){
			$ad.parent().addClass("hidden");
		}
	}
	
	// LS
	var $ls = $(document.getElementById("playerOptionSigneCurrentValue"));
	if(Media.LSFEnabled){
		$ls.text(Media.ls[Media.currentLSFIndex].lang);
		
	}else{
		$ls.text("Aucun");

		if(typeOf(Media.ls) !== "array" || !Media.ls.length){
			$ls.parent().addClass("hidden");
		}
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Shows the info banner
 */

InfoBanner.show = function(){
	$(document.getElementById("playerTopBanner")).show();
	$(document.getElementById("playerBottomBanner")).show();
	$(document.getElementById("playerUI")).css("background-image","url('ressources/img/player/player_ombre_video.png')");
	this.launchMaskingAfterDelay();
	this.isVisible = true;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Hides the info banner
 */

InfoBanner.hide = function(){
	$(document.getElementById("playerTopBanner")).hide();
	$(document.getElementById("playerBottomBanner")).hide();
	$(document.getElementById("playerUI")).css("background-image","none");	
	this.isVisible = false;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Shows the pause button
 */

InfoBanner.showPauseBtn = function(){
	$(document.getElementById("playerControlPlayPause")).addClass("pause");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Hides the pause button
 */

InfoBanner.hidePauseBtn = function(){
	$(document.getElementById("playerControlPlayPause")).removeClass("pause");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Returns which the info banner is currently displayed
 * @return {Boolean} Returns if the info banner is visible
 */

InfoBanner.isDisplayed = function(){
	return this.isVisible;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches the masking of the info banner after an inactivities time
 */

InfoBanner.launchMaskingAfterDelay = function(){
	
	this.suspendMaskingAfterDelay();
	this.timeoutHideBanner = setTimeout(function(){
		InfoBanner.executeMaskingAfterDelay();
	}, Config.infoBannerDelayToHide * 1000);
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Relaunches the masking of the info banner after an inactivities time
 */

InfoBanner.suspendMaskingAfterDelay = function(){
	clearTimeout(this.timeoutHideBanner);
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

InfoBanner.executeMaskingAfterDelay = function(){
	this.hide();
};

																								/************************************************
																								*	GESTION DE LA BANNIERE VIDEO (PROGRESS BAR)	*
																								************************************************/

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Resets the progress bar
 */

InfoBanner.progressBar.reset = function(){
	
	Player.stopCheckVideoPosition();
	
	$(document.getElementById("playerProgressCurrent")).text("-");
	$(document.getElementById("playerProgressTotal")).text("-");
	$(document.getElementById("playerProgressCursor")).css("width", 0);
	
	InfoBanner.hidePauseBtn();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Updates the progress bar
 * @param {Integer} time The current position inside the video (in milliseconds)
 * @param {Integer} tT Total time of the video (in milliseconds)
 */

InfoBanner.progressBar.update = function(time, tT){
	
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

	totalTimeMinute = Math.floor(tT / 60000);
	timeMinute      = Math.floor(time / 60000);                
	totalTimeSecond = Math.floor((tT % 60000) / 1000);
	timeSecond      = Math.floor((time % 60000) / 1000);
	timeC = (!isNaN(timeMinute) && !isNaN(timeSecond)) ? pad(timeMinute) + " : " + pad(timeSecond) : timeC;
	timeT = (!isNaN(totalTimeMinute) && !isNaN(totalTimeSecond)) ? pad(totalTimeMinute) + " : " + pad(totalTimeSecond) : timeT;

	$(document.getElementById("playerProgressCurrent")).text(timeC);
	$(document.getElementById("playerProgressTotal")).text(timeT);
};