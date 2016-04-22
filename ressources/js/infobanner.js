var InfoBanner = {
	progressBar:{},
	playerParams:{
		none:"Aucun",
		options:{
			isOptionDropDownMenuDisplayed:false,
			currentOptionDropDownMenu:""	
		}
	},
	timeoutHideBanner:null,
	isVisible:false
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Resets the info banner
 */

InfoBanner.reset = function(){
	
	var $sliderADVol = $(document.getElementById("playerControlADVolume"));
	if(Media.audioDescriptionEnabled){
		$sliderADVol.show();
	}else{
		$sliderADVol.hide();
	}
	
	this.progressBar.reset();	
	this.playerParams.reset();
	
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
	
	// OPTIONS DE LA VIDEO
	this.playerParams.init();
	
	// PROGRESS BAR
	this.progressBar.init();
	
	// VOLUME
	this.initVolumeSlider();	
	this.initADVolumeSlider();
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
	$(document.getElementById("playerControlPlayPause")).addClass("pause").attr("title", "Bouton pause");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Hides the pause button
 */

InfoBanner.hidePauseBtn = function(){
	$(document.getElementById("playerControlPlayPause")).removeClass("pause").attr("title", "Bouton lecture");
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
	}, (Main.simplifiedMode ? Config.infoBannerDelayToHideInSimplifiedMode : Config.infoBannerDelayToHide) * 1000);
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
	
																	/* **************************************************/
																	/*	 FONCTIONS POUR LES BOUTONS D'OPTION DU PLAYER	*/
																	/* **************************************************/
		
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

InfoBanner.playerParams.reset = function(){
	
	$(document.getElementById("playerOptionAudioCurrentValue")).empty();
	$(document.getElementById("playerOptionSubCurrentValue")).empty();
	$(document.getElementById("playerOptionDescriptionCurrentValue")).empty();
	$(document.getElementById("playerOptionSigneCurrentValue")).empty();
	$(document.getElementById("playerOptions")).children(".opaque").removeClass("opaque");
	
	this.options.reset();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

InfoBanner.playerParams.init = function(){
	var value, none = this.none;
	
	// AUDIO
	var $audio = $(document.getElementById("playerOptionAudioCurrentValue"));
	if(Media.audioEnabled){
		value = Media.audiosList[Media.currentAudioIndex];
		$audio.text(value);
		
	}else{
		$audio.text(none);

		if(typeOf(Media.audiosList) !== "array" || !Media.audiosList.length){
			$audio.parent().addClass("opaque");
		}
	}
	
	// SOUS-TITRES
	var $subtitles = $(document.getElementById("playerOptionSubCurrentValue"));
	if(Media.subtitleEnabled){
		value = Media.subtitlesList[Media.currentSubtitleIndex];
		$subtitles.html(value + '<img alt="" src="ressources/img/sourd.png" height="100%" style="vertical-align:top;margin-left:10px;"/>');
		
	}else{
		$subtitles.text(none);
		
		if(typeOf(Media.subtitlesList) !== "array" || !Media.subtitlesList.length){
			$subtitles.parent().addClass("opaque");
		}
	}
	
	// AD
	var $ad = $(document.getElementById("playerOptionDescriptionCurrentValue"));
	if(Media.audioDescriptionEnabled){
		value = Media.audioDescriptions[Media.currentAudioDescriptionIndex].lang;
		$ad.text(value);
		
	}else{
		$ad.text(none);

		if(typeOf(Media.audioDescriptions) !== "array" || !Media.audioDescriptions.length){
			$ad.parent().addClass("opaque");
		}
	}
	
	// LS
	var $ls = $(document.getElementById("playerOptionSigneCurrentValue"));
	if(Media.LSFEnabled){
		value = Media.ls[Media.currentLSFIndex].lang;
		$ls.text(value);
		
	}else{
		$ls.text(none);

		if(typeOf(Media.ls) !== "array" || !Media.ls.length){
			$ls.parent().addClass("opaque");
		}
	}	
	
	this.initLabels();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

InfoBanner.playerParams.initLabels = function(){
	var none = this.none;
	
	// AUDIO
	var $labelAudio = $(document.getElementById("label-option-audio"));
	if(Media.audioEnabled){
		var value = Media.audiosList[Media.currentAudioIndex];
		$labelAudio.text("Choix de langue audio : " + value + " sélectionné");
		
	}else{
		$labelAudio.text("Choix de langue audio : " + none + " sélectionné");
	}	
	
	// SOUS-TITRES
	var $labelSubtitle = $(document.getElementById("label-option-subtitle"));
	if(Media.subtitleEnabled){
		value = Media.subtitlesList[Media.currentSubtitleIndex];
		$labelSubtitle.text("Choix du sous-titre : " + value + " sélectionné");
		
	}else{
		$labelSubtitle.text("Choix du sous-titre : " + none + " sélectionné");
	}	
	
	// AD
	var $labelAD = $(document.getElementById("label-option-ad"));
	if(Media.audioDescriptionEnabled){
		value = Media.audioDescriptions[Media.currentAudioDescriptionIndex].lang;
		$labelAD.text("Choix de langue pour l'audio description : " + value + " sélectionné");
		
	}else{
		$labelAD.text("Choix de langue pour l'audio description : " + none + " sélectionné");
	}
	
	// LS
	var $labelLS = $(document.getElementById("label-option-ls"));
	if(Media.LSFEnabled){
		value = Media.ls[Media.currentLSFIndex].lang;
		$labelLS.text("Choix de langue pour la langue des signes : " + value + " sélectionné");
		
	}else{
		$labelLS.text("Choix de langue pour la langue des signes : " + none + " sélectionné");
	}	
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

InfoBanner.playerParams.options.reset = function(){
	
	$(document.getElementById("optionDropDownMenu")).empty();
	
	this.hide();
	this.currentOptionDropDownMenu = "";	
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

InfoBanner.playerParams.options.show = function(type, button){
	if(type && $(button).length && !$(button).hasClass("opaque")){
		
		var $ctn = $(document.getElementById("optionDropDownMenu"));
		
		if(this.isOptionDropDownMenuDisplayed && type === this.currentOptionDropDownMenu) {
			this.hide();
			return;
			
		}else if(!this.isOptionDropDownMenuDisplayed) {
			$ctn.removeClass("hidden");
			this.isOptionDropDownMenuDisplayed = true;
		}
		this.currentOptionDropDownMenu = type;
		
		$ctn.empty();
		
		var inputsArray = this.getOptionsArrayForOption(type);
		$ctn.css("left", this.getOptionsDropDownMenuLeft(type))
			.css("height", this.getOptionsDropDownMenuHeight(inputsArray));
		
		var getLabel = function(type, optionName){
			if(type === "audio"){
				return optionName === "Aucun" ? "Désactiver l'audio" : "Audio " + optionName;

			}else if(type === "subtitle"){
				return optionName === "Aucun" ? "Désactiver les sous-titres" : "Sous-titre " + optionName;

			}else if(type === "ad"){
				return optionName === "Aucun" ? "Désactiver l'audio description" : "Audio description " + optionName;

			}else if(type === "ls"){
				return optionName === "Aucun" ? "Désactiver la langue des signes" : "Langue des signes " + optionName.replace("LSF", "Français");
			}
			return "";
		};
		var _onclick = function(){
			InfoBanner.playerParams.options.onClick(this, type);
		};
		
		var tabIndex = button.tabIndex + 1;
		var i, l = inputsArray.length, $bt;
		for (i = 0; i < l; i++) {
			$bt = $('<div id="option_'+i+'" class="optionDropDownMenuButton btn selectable-by-chromevox" tabindex="'+tabIndex+'" aria-labelledby="label-option-'+i+'">'+inputsArray[i]+'<span id="label-option-'+i+'" aria-hidden="true" class="hidden">'+getLabel(type, inputsArray[i])+'</span></div>')
				.appendTo($ctn)
				.data("index", i)
				.on("click", _onclick);
			
			if(type === "subtitle" && inputsArray[i] !== "Aucun"){
				$bt.append('<img src="ressources/img/sourd.png" height="100%" style="vertical-align:top;margin-left:10px;"/>');
			}
			tabIndex++;
		}
		
		this.select(type, $ctn);
		
		if(Main.simplifiedMode){
			Navigation.moveSelecteur($ctn.children(":first-child"));
		}
	}	
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

InfoBanner.playerParams.options.onClick = function(bt, optionID){
	if($(bt).length && optionID){
		
		var index = $(bt).data("index");
		if(optionID === "ls"){
			Player.activeOptionSigne(index);

		}else if(optionID === "subtitle") {
			Player.activeOptionSub(index);

		}else if(optionID === "ad") {
			Player.activeOptionDescription(index);

		}else if(optionID === "audio") {
			Player.activeOptionAudio(index);
		}
		
		InfoBanner.launchMaskingAfterDelay();
		this.hide();

		if(Main.simplifiedMode){
			var ids = {ls:"playerOptionSigne",subtitle:"playerOptionSub",ad:"playerOptionDescription",audio:"playerOptionAudio"};
			Navigation.moveSelecteur(document.getElementById(ids[optionID]));
		}
		
		InfoBanner.playerParams.initLabels();	
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

InfoBanner.playerParams.options.select = function(type, $ctn){
		
	var setSel = function($el){
		$el.css("color", "orange");
	};
	
	if(type === "audio" && Media.audioEnabled){
		setSel($ctn.children(":eq("+Media.currentAudioIndex+")"));

	}else if(type === "subtitle" && Media.subtitleEnabled){
		setSel($ctn.children(":eq("+Media.currentSubtitleIndex+")"));

	}else if(type === "ad" && Media.audioDescriptionEnabled){
		setSel($ctn.children(":eq("+Media.currentAudioDescriptionIndex+")"));

	}else if(type === "ls" && Media.LSFEnabled){
		setSel($ctn.children(":eq("+Media.currentLSFIndex+")"));

	}else{
		setSel($ctn.children(":last"));
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

InfoBanner.playerParams.options.hide = function(){
	$(document.getElementById("optionDropDownMenu")).addClass("hidden");
	this.isOptionDropDownMenuDisplayed = false;		
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

InfoBanner.playerParams.options.getOptionsArrayForOption = function(optionID) {
	var optionsArray = [];
	var getList = function(list){
		var newList = [];
		for(var i=0;i<list.length;i++){
			newList.push(list[i].lang);
		}
		return newList;
	};

	switch(optionID) {
		case "ls":
			optionsArray = getList(Media.ls);
			break;

		case "ad":
			optionsArray = getList(Media.audioDescriptions);
			break;

		case "subtitle":
			optionsArray = JSON.parse(JSON.stringify(Media.subtitlesList));
			break;

		case "audio":
			optionsArray = JSON.parse(JSON.stringify(Media.audiosList));
			break;
			
		default:
			break;
	}
	optionsArray.push("Aucun");
	return optionsArray;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

InfoBanner.playerParams.options.getOptionsDropDownMenuHeight = function(inputsArray) {
	// +1 for border 
	return inputsArray.length * (50 + 1);
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

InfoBanner.playerParams.options.getOptionsDropDownMenuLeft = function(optionID) {

	var leftOption = 0;

	switch(optionID) {
		case "ls":
			leftOption = document.getElementById("playerOptionSigne").offsetLeft;
			break;
		case "ad":
			leftOption = document.getElementById("playerOptionDescription").offsetLeft;
			break;
		case "subtitle":
			leftOption = document.getElementById("playerOptionSub").offsetLeft;
			break;
		case "audio":
			leftOption = document.getElementById("playerOptionAudio").offsetLeft;
			break;
		default :
			log("getOptionsDropDownMenuLeft - no optionID defined for " + optionID);
			leftOption = 0;
			break;
	}

	var leftDDM = leftOption + 57;
	return leftDDM + "px";
};
	
																	/* ******************************/
																	/*	 LES CONTROLES DE VOLUME	*/
																	/* ******************************/
		
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

InfoBanner.initVolumeSlider = function(){

	var defaultValue = getHtmlStorage("volumeValue") || Settings.defaultVolumeValue;
	var $tooltip = $(document.getElementById("volume-tooltip")).hide();
	var _onSlide = function(el, value) {
		
		InfoBanner.launchMaskingAfterDelay();

		var $volume = $(document.getElementById("up-volume"));
		var $sliderControl = $(el).children("a");
		$tooltip.css('left', $sliderControl.css("left")).text(value);

		if(value <= 5) { 
			$volume.css('background-position', '0 0');

		}else if (value <= 25) {
			$volume.css('background-position', '0 -25px');

		}else if (value <= 75) {
			$volume.css('background-position', '0 -50px');

		}else{
			$volume.css('background-position', '0 -75px');
		}

		$sliderControl.attr("aria-valuenow", value).attr("aria-valuetext", value + " pourcent");

		try{
			if(!value){
				Player.setMute();
			}else{
				removeHtmlStorage("muteEnabled");
				setHtmlStorage("volumeValue", value);
				Player.setVolume(value);
			}
		}catch(e){
			log(e);
		}			
	};
	var $slider = $( document.getElementById("slider") ).slider({
        range: "min",
        min: 0,
        value: defaultValue,
 
        start: function() {
          $tooltip.fadeIn('fast');
        },
 
        slide: function(event, ui){
			_onSlide(this, ui.value);
		},
 
        stop: function() {
          $tooltip.fadeOut('fast');
        }
	});
	_onSlide($slider, defaultValue);
};	

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

InfoBanner.initADVolumeSlider = function(){

	var defaultValue = getHtmlStorage("ADvolumeValue") || Settings.defaultADVolumeValue;
	var $tooltip = $(document.getElementById("ad-volume-tooltip")).hide();
	var _onSlide = function(el, value) {
		
		InfoBanner.launchMaskingAfterDelay();

		var $volume = $(document.getElementById("ad-up-volume"));
		var $sliderControl = $(el).children("a");
		$tooltip.css('left', $sliderControl.css("left")).text(value);

		if(value <= 5) { 
			$volume.css('background-position', '0 -25px');

		}else if (value <= 15) {
			$volume.css('background-position', '0 -25px');

		}else if (value <= 30) {
			$volume.css('background-position', '0 -50px');

		}else{
			$volume.css('background-position', '0 -75px');
		}

		$sliderControl.attr("aria-valuenow", value).attr("aria-valuetext", value + " décibel");
		
		try{
			Player.onChangeADVolume(value);			
		}catch(e){
			log(e);
		}
	};
	var range = Settings.adGainRange;
	var $slider = $( document.getElementById("ad-volume-slider") ).slider({
        range: "min",
        min: range[0],
		max: range[1],
        value: defaultValue,
 
        start: function() {
          $tooltip.fadeIn('fast');
        },
		
        slide: function(event, ui){
			_onSlide(this, ui.value);
		}, 
		
        stop: function() {
          $tooltip.fadeOut('fast');
        }
	});
	
	if(Media.audioDescriptionEnabled){
		_onSlide($slider, defaultValue);
	}
};

																								/********************************
																								*	GESTION DE LA PROGRESS BAR	*
																								********************************/

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Resets the progress bar
 */

InfoBanner.progressBar.reset = function(){
	
	Player.stopCheckVideoPosition();
	
	$(document.getElementById("playerProgressCurrent")).children().empty();
	$(document.getElementById("playerProgressTotal")).children().empty();
	
	if($(document.getElementById("playerProgressBar")).slider( "instance" )){
		$(document.getElementById("playerProgressBar")).slider("value", 0);
	}
	
	InfoBanner.hidePauseBtn();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Resets the progress bar
 */

InfoBanner.progressBar.init = function(){

	$( document.getElementById("playerProgressBar") ).slider({
        range: "min",
        min: 0,
        value: 0,
		step:0.1,
		start:function(){
			Player.pause();
		},
		slide:function(){
			InfoBanner.launchMaskingAfterDelay();			
		},
        stop: function(event, ui) {
			
			var value = ui.value;

			// Récupère la temps
			var time = value * (Player.playerManager.controller.duration / 100);
			log("déplacement à " + value + "% ("+time+"s)");

			try{
				
				// Le currentTime ne se mettra plus à jour si on le get pas avant de le setter !?
				var doNotDeleteMe = Player.playerManager.controller.currentTime;

				// check if the new position is seekable
				Player.doSeek(time);
				Player.play();
			
				$(document.getElementById("playerProgressCursor")).attr("aria-valuenow", value).attr("aria-valuetext", Math.round(value) + " pourcent");
				
			}catch(e){
				log(e);
			}			
        }
	});
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Updates the progress bar
 * @param {Integer} time The current position inside the video (in seconds)
 * @param {Integer} tT Total time of the video (in seconds)
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

	$(document.getElementById("playerProgressBar")).slider("value", percent);

	totalTimeMinute = Math.floor(tT / 60000);
	timeMinute      = Math.floor(time / 60000);                
	totalTimeSecond = Math.floor((tT % 60000) / 1000);
	timeSecond      = Math.floor((time % 60000) / 1000);
	timeC = (!isNaN(timeMinute) && !isNaN(timeSecond)) ? pad(timeMinute) + " : " + pad(timeSecond) : timeC;
	timeT = (!isNaN(totalTimeMinute) && !isNaN(totalTimeSecond)) ? pad(totalTimeMinute) + " : " + pad(totalTimeSecond) : timeT;
	
	var scT = 'Temps actuel '+getTimeText(timeMinute, timeSecond),
		stT = 'Temps total '+getTimeText(totalTimeMinute, totalTimeSecond);
	$(document.getElementById("playerProgressCurrent")).attr("title", scT).children("span:first-child").text(timeC).end().children("span:last-child").text(scT);
	$(document.getElementById("playerProgressTotal")).attr("title", stT).children("span:first-child").text(timeT).end().children("span:last-child").text(stT);
	$(document.getElementById("playerProgressCursor")).attr("aria-valuenow", percent).attr("aria-valuetext", Math.round(percent) + " pourcent");
};