var InfoBanner = {
	progressBar:{},
	timeoutHideBanner:null,
	isVisible:false,
	isOptionDropDownMenuDisplayed:false,
	currentOptionDropDownMenu:""
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
	this.currentOptionDropDownMenu = "";
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
		$subtitles.html(Media.subtitlesList[Media.currentSubtitleIndex] + '<img alt="" src="ressources/img/sourd.png" height="100%" style="vertical-align:top;margin-left:10px;"/>');
		
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

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

InfoBanner.showOptionPopup = function(type, button){
	if(type && $(button).length && !$(button).hasClass("hidden")){
		
		if(this.isOptionDropDownMenuDisplayed && (type === this.currentOptionDropDownMenu)) {
			this.hideOptionDropDownMenu();
			return;
			
		}else if(this.isOptionDropDownMenuDisplayed && type === this.currentOptionDropDownMenu) {
			
		}else if(!this.isOptionDropDownMenuDisplayed) {
			$(".optionDropDownMenu").removeClass("hidden");
			this.isOptionDropDownMenuDisplayed = true;
		}
		this.currentOptionDropDownMenu = type;
		
		var $ctn = $(document.getElementById("optionDropDownMenu")).empty();

		var inputsArray = this.getOptionsArrayForOption(type);
		$ctn.css("left", this.getOptionsDropDownMenuLeft(type))
			.css("height", this.getOptionsDropDownMenuHeight(inputsArray));
		
		var actionEvent = function(bt, optionID) {
			var index = $(bt).data("index");
			if(optionID === "ls"){
				Player.activeOptionSigne(index);
			}
			else if(optionID === "subtitle") {
				Player.activeOptionSub(index);
			}
			else if(optionID === "ad") {
				Player.activeOptionDescription(index);	
			}
			else if(optionID === "audio") {
				Player.activeOptionAudio(index);
			}
			InfoBanner.launchMaskingAfterDelay();
			InfoBanner.hideOptionDropDownMenu();
		};
		
		var getLabel = function(optionName){
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
		
		var tabIndex = button.tabIndex + 1;
		var i, l = inputsArray.length;
		for (i = 0; i < l; i++) {
			var $bt = $('<div id="option_'+i+'" class="optionDropDownMenuButton btn selectable-by-chromevox" tabindex="'+tabIndex+'" aria-labelledby="label-option-'+i+'">'+inputsArray[i]+'<span id="label-option-'+i+'" aria-hidden="true" class="hidden">'+getLabel(inputsArray[i])+'</span></div>').appendTo($ctn);
			$bt.data("index", i);
			(function(bt, optionID){
				bt.on("click", function(){
					actionEvent(bt, optionID);
				});
			})($bt, type);
			
			if(type === "subtitle" && inputsArray[i] !== "Aucun"){
				$bt.append('<img src="ressources/img/sourd.png" height="100%" style="vertical-align:top;margin-left:10px;"/>');
				tabIndex++;
			}
		}
		
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
	}	
};

InfoBanner.hideOptionDropDownMenu = function() {
	$(document.getElementById("optionDropDownMenu")).addClass("hidden");
	this.isOptionDropDownMenuDisplayed = false;		
};

InfoBanner.getOptionsArrayForOption = function(optionID) {
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
	}
	optionsArray.push("Aucun");
	return optionsArray;
};

InfoBanner.getOptionsDropDownMenuHeight = function(inputsArray) {
	return inputsArray.length * (50 + 1); // +1 for border 
};
InfoBanner.getOptionsDropDownMenuTop = function(inputsArray) {
	return 120; 
};
InfoBanner.getOptionsDropDownMenuLeft = function(optionID) {

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
			console.log("getOptionsDropDownMenuLeft - no optionID defined for " + optionID);
			leftOption = 0;
			break;
	}

	var leftDDM = leftOption + 57;
	return leftDDM + "px";
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
	
	$(document.getElementById("playerProgressCurrent")).children().empty();
	$(document.getElementById("playerProgressTotal")).children().empty();
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

	$(document.getElementById("playerProgressCurrent")).children("span:first-child").text(timeC).end().children("span:last-child").text('Temps actuel '+getTimeText(timeMinute, timeSecond));
	$(document.getElementById("playerProgressTotal")).children("span:first-child").text(timeT).end().children("span:last-child").text('Temps total '+getTimeText(totalTimeMinute, totalTimeSecond));
};