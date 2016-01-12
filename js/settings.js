function settingsScreen() {
	var mySettingsScreen = this;
	this.activeScreen = false;
	this.settingsScreen = document.getElementById("settingsScreen");

	var widthReal 	= $("#home").width();
	var heightReal = $("#home").height();

	this.settingsContainerDIV;

	var width 	= 1800;
	var height = 1200;
		
	this.createSettings = function() {
	}

	function setSize(param) {
		console.log("setSize");

	}

	this.init = function() {
		mySettingsScreen.cleanPage();

		// 
		// *** menu ***
		//
		var menuSettingsDIV = createDiv("settingsMenu", this.settingsScreen, "", "settingsMenu");
		this.settingsContainerDIV = createDiv("settingsContainer", this.settingsScreen, "", "settingsContainer");

		var menuSettingsGeneralBT = createButton("settingsMenuButtonGeneral", menuSettingsDIV, "btSettingsMenuGeneral", 0, 0,"settingsMenuButton settingsMenuButton0");
		menuSettingsGeneralBT.innerHTML =  "Géneral";
		menuSettingsGeneralBT.setAttribute("tabindex", 10);
		var menuSettingsLSFBT = createButton("settingsMenuButtonLSF", menuSettingsDIV, "btSettingsMenuLSF", 0, 0, "settingsMenuButton settingsMenuButton1");
		menuSettingsLSFBT.innerHTML =  "Langue des signes";
		menuSettingsLSFBT.setAttribute("tabindex", 11);
		var menuSettingsSubtitleFBT = createButton("settingsMenuButtonSubtitle", menuSettingsDIV, "btSettingsMenuSubtitle", 0, 0, "settingsMenuButton settingsMenuButton2");
		menuSettingsSubtitleFBT.innerHTML =  "Sous-titres";
		menuSettingsSubtitleFBT.setAttribute("tabindex", 12);
		
		if(backToPlayerFromSettings){
			backToPlayerFromSettings = false;
			var menuSettingsBackToPlayer = createButton("settingsMenuButtonBackToPlayer", menuSettingsDIV, "BackToPlayer", 0, 0, "settingsMenuButton settingsMenuButtonBack");
			menuSettingsBackToPlayer.innerHTML =  "Retourner à la vidéo";
			menuSettingsBackToPlayer.setAttribute("tabindex", 13);			
		}

		this.initMain();
		this.show();
	}

	this.initMain = function() {
		this.cleanContainer();
		this.selectButton(".settingsMenuButton0"); //change color bg button & reset all

		var activeNarratorBT = createButton("activeNarrator", this.settingsContainerDIV, "btActiveNarrator", 0, 0, "activeNarrator");
		var activeNarratorText = createDiv("activeNarratorText", activeNarratorBT, "", "activeNarratorText");
		activeNarratorText.innerHTML = "Activer le narrateur";
		activeNarratorText.setAttribute("tabindex", 20);
		createIconeNarrator(activeNarratorBT, 60, 60);

		var activeMagnifyingGlassBT = createButton("activeMagnifyingGlass", this.settingsContainerDIV, "btActiveMagnifyingGlass", 0, 0, "activeMagnifyingGlass");
		var activeMagnifyingGlassText = createDiv("activeMagnifyingGlassText", activeMagnifyingGlassBT, "", "activeMagnifyingGlassText");
		activeMagnifyingGlassText.innerHTML = "Activer la loupe";
		createIconeMagnifyingGlass(activeMagnifyingGlassBT, 60, 60);
		activeMagnifyingGlassText.setAttribute("tabindex", 35);

		var textVoiceControl = createDiv("textVoiceControl", this.settingsContainerDIV, "", "textVoiceControl");
		textVoiceControl.innerHTML = "Contrôle de la voix";
		textVoiceControl.setAttribute("tabindex", 21);
		var textVolume = createDiv("textVolume", this.settingsContainerDIV, "", "textVolume");
		textVolume.innerHTML = "Volume";
		textVolume.setAttribute("tabindex", 22);
		var slideVolumeContainer = createDiv("slideVolumeContainer", this.settingsContainerDIV, "", "slideVolumeContainer");
		var leftMinusDIV = createDiv("leftMinus", slideVolumeContainer, "", "leftMinus");
		leftMinusDIV.innerHTML = "-";
		var slideRangeVolume = createDiv("slideRangeVolume", slideVolumeContainer, "", "slideRangeVolume slideHorizontalInput");
		var volRange = 2; //TODO 
		slideRangeVolume.innerHTML = '<input class="volumeSlide" type="range" min="0" max="4" value="'+volRange+'" step="1" onchange="mySett.onVolumeSlideChangeValue(this.value)" tabindex="23"/>';
		var rightPlusDIV = createDiv("rightPlus", slideVolumeContainer, "", "rightPlus");
		rightPlusDIV.innerHTML = "+";

		var textVitesse = createDiv("textVitesse", this.settingsContainerDIV, "", "textVitesse");
		textVitesse.innerHTML = "Vitesse";
		textVitesse.setAttribute("tabindex", 24);
		var slideVitesseContainer = createDiv("slideVitesseContainer", this.settingsContainerDIV, "", "slideVitesseContainer");
		var leftMinusDIV = createDiv("leftMinus", slideVitesseContainer, "", "leftMinus");
		leftMinusDIV.innerHTML = "-";
		var slideRangeVitesse = createDiv("slideRangeVitesse", slideVitesseContainer, "", "slideRangeVitesse slideHorizontalInput");
		var vitesseRange = 2; //TODO 
		slideRangeVitesse.innerHTML = '<input class="vitesseSlide" type="range" min="0" max="4" value="'+vitesseRange+'" step="1" onchange="mySett.onVitesseSlideChangeValue(this.value)" tabindex="25"/>';
		var rightPlusDIV = createDiv("rightPlus", slideVitesseContainer, "", "rightPlus");
		rightPlusDIV.innerHTML = "+";


		var textTimbre = createDiv("textTimbre", this.settingsContainerDIV, "", "textTimbre");
		textTimbre.innerHTML = "Timbre";
		textTimbre.setAttribute("tabindex", 26);
		var slideTimbreContainer = createDiv("slideTimbreContainer", this.settingsContainerDIV, "", "slideTimbreContainer slideHorizontalInput");
		var leftMinusDIV = createDiv("leftMinus", slideTimbreContainer, "", "leftMinus");
		leftMinusDIV.innerHTML = "-";
		var slideRangeTimbre = createDiv("slideRangeTimbre", slideTimbreContainer, "", "slideRangeTimbre");
		var timbreRange = 2; //TODO 
		slideRangeTimbre.innerHTML = '<input class="timbreSlide" type="range" min="0" max="4" value="'+timbreRange+'" step="1" onchange="mySett.onTimbreSlideChangeValue(this.value)" tabindex="27"/>';
		var rightPlusDIV = createDiv("rightPlus", slideTimbreContainer, "", "rightPlus");
		rightPlusDIV.innerHTML = "+";


		var textLecture = createDiv("textLecture", this.settingsContainerDIV, "", "textLecture");
		textLecture.innerHTML = "Lecture";
		textLecture.setAttribute("tabindex", 28);


		var textCarateresQueLOnTapeContainer = createDiv("textCarateresQueLOnTapeContainer", this.settingsContainerDIV, "", "textCarateresQueLOnTapeContainer");
		var textCarateresQueLOnTape = createDiv("textCarateresQueLOnTape", textCarateresQueLOnTapeContainer, "", "textCarateresQueLOnTape");
		textCarateresQueLOnTape.innerHTML = "Caractères que l'on tape";
		createIconeSwitchOff(textCarateresQueLOnTapeContainer, 60, 40);
		textCarateresQueLOnTape.setAttribute("tabindex", 29);

		var textMotsQueLOnTapeContainer = createDiv("textMotsQueLOnTapeContainer", this.settingsContainerDIV, "", "textMotsQueLOnTapeContainer");
		var textMotsQueLOnTape = createDiv("textMotsQueLOnTape", textMotsQueLOnTapeContainer, "", "textMotsQueLOnTape");
		textMotsQueLOnTape.innerHTML = "Mots que l'on tape";
		createIconeSwitchOff(textMotsQueLOnTapeContainer, 60, 40);
		textMotsQueLOnTape.setAttribute("tabindex", 30);


		var textFontSize = createDiv("textFontSize", this.settingsContainerDIV, "", "textFontSize");
		textFontSize.innerHTML = "Taille de la police";
		textFontSize.setAttribute("tabindex", 36);
		var slideFontSizeContainer = createDiv("slideFontSizeContainer", this.settingsContainerDIV, "", "slideFontSizeContainer");
		var leftLowercaseDIV = createDiv("leftLowercase", slideFontSizeContainer, "", "leftLowercase");
		leftLowercaseDIV.innerHTML = "A";
		var slideRangeFontSize = createDiv("slideRangeFontSize", slideFontSizeContainer, "", "slideRangeFontSize slideHorizontalInput");
		var valueMinSize = (getCookie("settings_min_size") != null) ? getCookie("settings_min_size") : 24;
		slideRangeFontSize.innerHTML = '<input class="horizontalSizeSlide" id="fontSlide" type="range" min="16" max="30" value="'+valueMinSize+'" step="7" onchange="mySett.onSizeSlideChangeValue(this.value)" tabindex="37"/>';
		var rightUppercaseDIV = createDiv("rightUpperCase", slideFontSizeContainer, "", "rightUpperCase");
		rightUppercaseDIV.innerHTML = "A";

		this.setSize(valueMinSize);


		var sizeFontDIV = createDiv("settingsSizeFont", this.settingsContainerDIV, "", "settingsSizeFont");
		var sizeFontSample = createDiv("settingsSizeFontSample", sizeFontDIV, "", "settingsSizeFontSample");
		sizeFontSample.innerHTML = "bonjour";
		var slideContainer = createDiv("settingsSlideContainer", this.settingsContainerDIV, "", "settingsSlideContainer");


	}

	this.initLSFSettings = function() {
		this.cleanContainer();
		this.selectButton(".settingsMenuButton1");

		var videoScreen = createDiv("settingsVideoBackground", this.settingsContainerDIV, "", "settingsVideoBackground");
		var videoPipLimitScreen = createDiv("settingsVideoPipLimitScreen", videoScreen, "", "settingsVideoPipLimitScreen");

		var legende = createDiv("settingsVideoLegende", this.settingsContainerDIV, "Placez et redimensionnez la fenêtre vidéo", "settingsVideoLegende");

		// !! using percent !!
		var pipLeftPercent = (getCookie("LSFPip_position_x") != null && !isNaN(getCookie("LSFPip_position_x"))) ? getCookie("LSFPip_position_x") : 81;
		var pipTopPercent = (getCookie("LSFPip_position_y") != null && !isNaN(getCookie("LSFPip_position_y"))) ? getCookie("LSFPip_position_y") : 45;

		var pipWidthReal = (getCookie("LSFPip_size_width") != null) ? getCookie("LSFPip_size_width") : 18.63425925925926;
		var pipHeightReal = (getCookie("LSFPip_size_height") != null) ? getCookie("LSFPip_size_height") : 16.30824372759857;

		var ret = '';
		ret += '<div class="settingsPipVideo ui-draggable ui-resizable" style="left: '+pipLeftPercent+'%; top: '+pipTopPercent+'%; width:'+pipWidthReal+'%; height:'+ pipHeightReal +'%">';
		ret += '<div id="settingsPipText" class="settingsPipText settingsTitleTexts">LSF</div>';
		ret += '<div class="ui-icon-gripsmall-center" style="z-index: 1010;"></div>';
		ret += '<div id="ui-icon-switchVideos" zone="settingsSwitchVideos" class="ui-icon-switchVideos" style="z-index: 1011;" onMouseOver="moveSelecteur(\'ui-icon-switchVideos\')" onFocus="moveSelecteur(\'ui-icon-switchVideos\')" onClick="move(\'enter\')">';
		ret += createIconeSwitchVideosSVGBalise(44, 33);
		ret += '</div>';
		ret += '</div>';
		videoPipLimitScreen.innerHTML = ret;


		var videoText = createDiv("settingsVideoText", videoPipLimitScreen, "Vidéo", "settingsVideoText settingsTitleTexts");


		$( ".settingsPipVideo" ).draggable({ 	containment: ".settingsVideoPipLimitScreen",
												scroll:false,
												handle:".ui-icon-gripsmall-center",
												stop: function() {
        											saveLSFCoordinates();
      											}
      										}).resizable( {
      											containment: ".settingsVideoPipLimitScreen",
      											handles: 'all',
      											minHeight: 80,
      											aspectRatio: 16/9,
      											resize: function() {
      												mySettingsScreen.updateIconsPip();
      											},
												stop: function() {
        											saveLSFSize();
        											saveLSFCoordinates();
      											}

      										});
		$('.ui-resizable-nw').addClass('ui-icon ui-icon-gripsmall-diagonal-nw');
		$('.ui-resizable-ne').addClass('ui-icon ui-icon-gripsmall-diagonal-ne');
		$('.ui-resizable-sw').addClass('ui-icon ui-icon-gripsmall-diagonal-sw');
		$('.ui-resizable-se').addClass('ui-icon ui-icon-gripsmall-diagonal-se');

		function saveLSFSize() {
			var pipWidth = $(".settingsPipVideo").width();
			var pipHeight = $(".settingsPipVideo").height();
			var containerWidth = $(".settingsVideoPipLimitScreen").width();
			var containerHeight = $(".settingsVideoPipLimitScreen").height();

			var newWidthPercent = (pipWidth/containerWidth)*100;
			var newHeightPercent = (pipHeight/containerHeight)*100;

			console.log("saveLSFSize :", newWidthPercent, "% et ", newHeightPercent, "%");
			setCookie("LSFPip_size_width", newWidthPercent);
			setCookie("LSFPip_size_height", newHeightPercent);
		}
		function saveLSFCoordinates() {
			var pipLeft = $(".settingsPipVideo").position().left;
			var pipTop = $(".settingsPipVideo").position().top;

			var widthContainerString = $(".settingsVideoPipLimitScreen").css("width");
			var widthContainerPx = widthContainerString.substring(0, widthContainerString.length-2);
			var heightContainerString = $(".settingsVideoPipLimitScreen").css("height");
			var heightContainerPx = heightContainerString.substring(0, heightContainerString.length-2);

			var newLeftPercent = (pipLeft/widthContainerPx)*100;
			var newTopPercent = (pipTop/heightContainerPx)*100;

			console.log("saveLSFCoordinates : (left:"+ newLeftPercent+ ", top:" + newTopPercent);

			setCookie("LSFPip_position_x", newLeftPercent);
			setCookie("LSFPip_position_y", newTopPercent);
		}

		mySettingsScreen.initVideoAndPipBackgroundColor("LSF","Vidéo");
		mySettingsScreen.updateIconsPip();
		mySettingsScreen.show();
	};

	this.initSubtitle = function() {
		this.cleanContainer();
		this.selectButton(".settingsMenuButton2");
		
		var titleDIV = createDiv("titleSubRubric", this.settingsContainerDIV, "", "titleSubRubric");
		titleDIV.innerHTML = "Réglez vos sous-titres";
		titleDIV.setAttribute("tabindex", 20);
		
		createDiv("separator", this.settingsContainerDIV, "", "separator");
		
		/* CHOIX DE POLICE */
		var chooseFontTextDIV = createDiv("chooseFontText", this.settingsContainerDIV, "", "chooseFontText");
		chooseFontTextDIV.innerHTML = "Choisir sa police";
		chooseFontTextDIV.setAttribute("tabindex", 21);

		var fontSelectionDIV = createDiv("settingsFontSelection", this.settingsContainerDIV, "", "settingsFontSelection");
		var fontList = ["Arial","OpenDyslexic","Andika","Helvetica","Lexia"];
		
		var font1 = createButton("fontArial", fontSelectionDIV, "btActiveArialFont", 0, 0, "activeFont font" + fontList[0]);
		font1.innerHTML = fontList[0];
		font1.setAttribute("tabindex", 22);
		
		var font2 = createButton("fontOpenDyslexic", fontSelectionDIV, "btActiveOpenDyslexicFont", 0, 0, "activeFont font" + fontList[1]);
		font2.innerHTML = fontList[1];
		font2.setAttribute("tabindex", 23);
		
		var font3 = createButton("fontAndika", fontSelectionDIV, "btActiveAndikaFont", 0, 0, "activeFont font" + fontList[2]);
		font3.innerHTML = fontList[2];
		font3.setAttribute("tabindex", 24);
		
		var font4 = createButton("fontHelvetica", fontSelectionDIV, "btActiveHelveticaFont", 0, 0, "activeFont font" + fontList[3]);
		font4.innerHTML = fontList[3];
		font4.setAttribute("tabindex", 25);
		
		var font5 = createButton("fontLexia", fontSelectionDIV, "btActiveLexiaFont", 0, 0, "activeFont font" + fontList[4]);
		font5.innerHTML = fontList[4];
		font5.setAttribute("tabindex", 26);
		
		var selectedFont = getCookie("subtitleFont");
		if(selectedFont && fontList.indexOf(selectedFont) !== -1){
			this.selectFontButton("font" + selectedFont);
		}else{
			setCookie("subtitleFont", fontList[0]);
			this.selectFontButton("font" + fontList[0]);
		}
		
		/* COULEUR DU TEXTE */
		var fontColorSelectionDIV = createDiv("settingsFontColorSelection", this.settingsContainerDIV, "", "settingsFontColorSelection");
		var settingsFontColorSelectionTitleDIV = createDiv("settingsFontColorSelectionTitle", fontColorSelectionDIV, "", "settingsFontColorSelectionTitle");
		settingsFontColorSelectionTitleDIV.innerHTML = "Couleur de texte";
		settingsFontColorSelectionTitleDIV.setAttribute("tabindex", 40);
		var col1 = createButton("settingsFontColorSelectionCellMulti", fontColorSelectionDIV, "selectMultiColor",0,0, "settingsFontColorSelectionCell settingsFontColorSelectionCellMulti");
		col1.setAttribute("tabindex", 41);
		col1.setAttribute("title", "Multicouleur");
		var col2 = createButton("settingsFontColorSelectionCellWhite", fontColorSelectionDIV, "selectWhiteColor",0,0, "settingsFontColorSelectionCell settingsFontColorSelectionCellWhite");
		col2.setAttribute("tabindex", 42);
		col2.setAttribute("title", "Couleur blanche");
		var col3 = createButton("settingsFontColorSelectionCellYellow", fontColorSelectionDIV, "selectYellowColor",0,0, "settingsFontColorSelectionCell settingsFontColorSelectionCellYellow");
		col3.setAttribute("tabindex", 43);
		col3.setAttribute("title", "Couleur jaune");
		var col4 = createButton("settingsFontColorSelectionCellBlue", fontColorSelectionDIV, "selectBlueColor",0,0, "settingsFontColorSelectionCell settingsFontColorSelectionCellBlue");
		col4.setAttribute("tabindex", 44);
		col4.setAttribute("title", "Couleur bleu");
		var selectedFontColor = getCookie("subtitleFontColor");
		if(selectedFontColor){
			
			switch(selectedFontColor){
				case "multiColor":
					mySett.selectMultiColor();
					break;	
					
				case "whiteColor":
					mySett.selectWhiteColor();
					break;
				
				case "yellowColor":
					mySett.selectYellowColor();
					break;
					
				case "blueColor":
					mySett.selectBlueColor();
					break;		
			}
		}else{
			mySett.selectMultiColor();
		}		

		/* COULEUR D'ARRIERE PLAN */
		var fontBGColorSelectionDIV = createDiv("settingsFontBGColorSelection", this.settingsContainerDIV, "", "settingsFontBGColorSelection");
		var settingsFontColorSelectionTitleDIV = createDiv("settingsFontBGColorSelectionTitle", fontBGColorSelectionDIV, "", "settingsFontColorSelectionTitle");
		settingsFontColorSelectionTitleDIV.innerHTML = "Couleur d'arrière plan";
		settingsFontColorSelectionTitleDIV.setAttribute("tabindex", 30);
		var color1 = createButton("settingsFontBGColorSelectionCellWhite", fontBGColorSelectionDIV, "selectWhiteBGColor",0,0, "settingsFontBGColorSelectionCell settingsFontColorSelectionCellWhite");
		color1.setAttribute("tabindex", 31);
		color1.setAttribute("title", "Couleur blanche");
		var color2 = createButton("settingsFontBGColorSelectionCellBlack", fontBGColorSelectionDIV, "selectBlackBGColor",0,0, "settingsFontBGColorSelectionCell settingsFontColorSelectionCellBlack");
		color2.setAttribute("tabindex", 32);
		color2.setAttribute("title", "Couleur noire");
		var selectedFontBGColor = getCookie("subtitleBGColor");
		if(selectedFontBGColor){
			switch(selectedFontBGColor){
				case "blackBGColor":
					mySett.selectBlackBGColor();
					break;
					
				case "whiteBGColor":
					mySett.selectWhiteBGColor();
					break;
			}
		}else{
			mySett.selectBlackBGColor();
		}
		
		/* OPACITE DE L'ARRIERE PLAN DES SOUS-TITRES */
		var textOpacity = createDiv("textOpacity", this.settingsContainerDIV, "", "textOpacity");
		textOpacity.innerHTML = "Régler l'opacité de son arrière plan";
		textOpacity.setAttribute("tabindex", 35);
		var slideOpacityContainer = createDiv("slideOpacityContainer", this.settingsContainerDIV, "", "slideOpacityContainer");
		createDiv("blackDIV", slideOpacityContainer, "", "blackDIV");
		var slideRangeOpacity = createDiv("slideRangeOpacity", slideOpacityContainer, "", "slideRangeOpacity slideHorizontalInput");
		var valueMinOpacity = (getCookie("subtitleBackgroundOpacity") != null) ? getCookie("subtitleBackgroundOpacity") : 1;
		slideRangeOpacity.innerHTML = '<input class="horizontalOpacitySlide" id="opacitySlide" type="range" min="0" max="1" value="'+valueMinOpacity+'" step="0.25" onchange="mySett.onOpacitySubtitleSlideChangeValue(this.value)" tabindex="36"/>';
		createDiv("transparentUppercaseDIV", slideOpacityContainer, "", "transparentUppercaseDIV");
		
		/* TAILLE DES SOUS-TITRES */
		var textFontSize = createDiv("textFontSize", this.settingsContainerDIV, "", "textFontSizeSubtitle");
		textFontSize.innerHTML = "Régler la taille de ses sous-titres";
		textFontSize.setAttribute("tabindex", 50);
		var slideFontSizeContainer = createDiv("slideFontSizeContainer", this.settingsContainerDIV, "", "slideFontSizeSubtitleContainer");
		var leftLowercaseDIV = createDiv("leftLowercase", slideFontSizeContainer, "", "leftLowercase");
		leftLowercaseDIV.innerHTML = "A";
		var slideRangeFontSize = createDiv("slideRangeFontSize", slideFontSizeContainer, "", "slideRangeFontSize slideHorizontalInput");
		var valueMinSize = (getCookie("subtitleFontSize") != null) ? getCookie("subtitleFontSize") : 24;
		slideRangeFontSize.innerHTML = '<input class="horizontalSizeSlide" id="fontSlide" type="range" min="24" max="44" value="'+valueMinSize+'" step="5" onchange="mySett.onSizeSubtitleSlideChangeValue(this.value)" tabindex="51"/>';
		var rightUppercaseDIV = createDiv("rightUpperCase", slideFontSizeContainer, "", "rightUpperCase");
		rightUppercaseDIV.innerHTML = "A";
		
		/* LSF */
		var videoScreen = createDiv("settingsVideoBackgroundSubtitles", this.settingsContainerDIV, "", "settingsVideoBackgroundSubtitles");
		var videoPipLimitScreen = createDiv("settingsVideoPipLimitScreenSubtitles", videoScreen, "", "settingsVideoPipLimitScreenSubtitles");
	
		// !! using percent !!
		var pipLeftPercent = (getCookie("LSFPipSubtitles_position_x") != null && !isNaN(getCookie("LSFPipSubtitles_position_x"))) ? getCookie("LSFPipSubtitles_position_x") : 81;
		var pipTopPercent = (getCookie("LSFPipSubtitles_position_y") != null && !isNaN(getCookie("LSFPipSubtitles_position_y"))) ? getCookie("LSFPipSubtitles_position_y") : 45;

		var pipWidthReal = (getCookie("LSFPipSubtitles_size_width") != null) ? getCookie("LSFPipSubtitles_size_width") : 18.63425925925926;
		var pipHeightReal = (getCookie("LSFPipSubtitles_size_height") != null) ? getCookie("LSFPipSubtitles_size_height") : 16.30824372759857;

		var ret = '';
		ret += '<div class="settingsPipVideo ui-draggable ui-resizable" style="left: '+pipLeftPercent+'%; top: '+pipTopPercent+'%; width:'+pipWidthReal+'%; height:'+ pipHeightReal +'%;line-height:5em;text-align:center">';
		ret += '<div id="settingsPipText" class="settingsPipText settingsTitleTextsSubtitles" style="display:inline-block;vertical-align:middle;line-height:normal;"></div>';
		ret += '<div class="ui-icon-gripsmall-center" style="z-index: 1010;width:15px;height:15px;background-size:contain"></div>';
		ret += '</div>';
		ret += '</div>';
		videoPipLimitScreen.innerHTML = ret;
		
		
		var selectedFont = getCookie("subtitleFont");
		var $textCtn = $(document.getElementById("settingsPipText"));
		if(selectedFont){
			$textCtn.removeClass("fontArial fontOpenDyslexic fontAndika fontHelvetica fontLexia").addClass("font"+selectedFont);
		}	
		
		var selectedFontColor = getCookie("subtitleFontColor");
		if(selectedFontColor){
			$textCtn.addClass(selectedFontColor);
		}
		
		$textCtn.removeClass("blackBGColor whiteBGColor");
		var selectedFontBGColor = getCookie("subtitleBGColor");
		if(selectedFontBGColor){
			$textCtn.addClass(selectedFontBGColor);
		}
		$textCtn.removeClass("opacity_0 opacity_025 opacity_05 opacity_075 opacity_1");
		var selectedFontBGColor = getCookie("subtitleBackgroundOpacity");
		if(selectedFontBGColor){
			$textCtn.addClass("opacity_"+selectedFontBGColor.replace(".",""));
		}
		var selectedFontSize = getCookie("subtitleFontSize");
		if(selectedFontSize){
			$textCtn.css("font-size", selectedFontSize+"px");
		}


		var videoText = createDiv("settingsVideoText", videoPipLimitScreen, "Vidéo", "settingsVideoText settingsTitleTexts");


		$( ".settingsPipVideo" ).draggable({ 	containment: ".settingsVideoPipLimitScreenSubtitles",
												scroll:false,
												handle:".ui-icon-gripsmall-center",
												stop: function() {
        											saveLSFCoordinates();
      											}
      										}).resizable( {
      											containment: ".settingsVideoPipLimitScreenSubtitles",
      											handles: 'all',
      											minHeight: 60,
      											maxHeight: 60,
												minWidth:866,
												maxWidth:866,
      											//aspectRatio: 16/9,
      											resize: function() {
      												mySettingsScreen.updateIconsPip();
      											},
												stop: function() {
        											saveLSFSize();
        											saveLSFCoordinates();
      											}

      										});
		$('.ui-resizable-nw').addClass('ui-icon ui-icon-gripsmall-diagonal-nw');
		$('.ui-resizable-ne').addClass('ui-icon ui-icon-gripsmall-diagonal-ne');
		$('.ui-resizable-sw').addClass('ui-icon ui-icon-gripsmall-diagonal-sw');
		$('.ui-resizable-se').addClass('ui-icon ui-icon-gripsmall-diagonal-se');

		function saveLSFSize() {
			var pipWidth = $(".settingsPipVideo").width();
			var pipHeight = $(".settingsPipVideo").height();
			var containerWidth = $(".settingsVideoPipLimitScreenSubtitles").width();
			var containerHeight = $(".settingsVideoPipLimitScreenSubtitles").height();

			var newWidthPercent = (pipWidth/containerWidth)*100;
			var newHeightPercent = (pipHeight/containerHeight)*100;

			console.log("saveLSFSize :", newWidthPercent, "% et ", newHeightPercent, "%");
			setCookie("LSFPipSubtitles_size_width", newWidthPercent);
			setCookie("LSFPipSubtitles_size_height", newHeightPercent);
		}
		function saveLSFCoordinates() {
			var pipLeft = $(".settingsPipVideo").position().left;
			var pipTop = $(".settingsPipVideo").position().top;

			var widthContainerString = $(".settingsVideoPipLimitScreenSubtitles").css("width");
			var widthContainerPx = widthContainerString.substring(0, widthContainerString.length-2);
			var heightContainerString = $(".settingsVideoPipLimitScreenSubtitles").css("height");
			var heightContainerPx = heightContainerString.substring(0, heightContainerString.length-2);

			var newLeftPercent = (pipLeft/widthContainerPx)*100;
			var newTopPercent = (pipTop/heightContainerPx)*100;

			console.log("saveLSFCoordinates : (left:"+ newLeftPercent+ ", top:" + newTopPercent);
			
			setCookie("LSFPipSubtitles_position_x", newLeftPercent);
			setCookie("LSFPipSubtitles_position_y", newTopPercent<0?0:newTopPercent);
		}

		mySettingsScreen.initVideoAndPipBackgroundColor("Texte de sous-titre", "");
		mySettingsScreen.updateIconsPip();	
	}
	
	this.show = function() {
		mySettingsScreen.settingsScreen.style.display = "block";
		mySettingsScreen.updateIconsPip();
		this.activeScreen = true;
	};
	
	this.hide = function() {
		mySettingsScreen.settingsScreen.style.display = "none";
		this.activeScreen = false;
	};
	
	this.cleanPage = function() {
		emptyElem(this.settingsScreen);
	};
	this.cleanContainer = function() {
		emptyElem(this.settingsContainerDIV);
	};
	this.clearButtonsSelection = function (){
		$(document.getElementById("settingsMenu")).children(".selected").removeClass("selected");
	}
	this.selectButton = function(buttonElement) {
		this.clearButtonsSelection();
		$(buttonElement).addClass("selected");
	}

	this.onSizeSlideChangeValue = function(newValue) {

		setCookie("settings_min_size", newValue);
		mySett.setSize(newValue);

		console.log("onSizeSlideChangeValue: ", newValue);
		$(".settingsSizeFontSample").css("font-size", newValue+"px");

	}
	this.onVolumeSlideChangeValue = function(newValue) {
		console.log("Settings - onVolumeSlideChangeValue:", newValue);
	}
	this.onVitesseSlideChangeValue = function(newValue) {
		console.log("Settings - onVitesseSlideChangeValue:", newValue);
	}
	this.onTimbreSlideChangeValue = function(newValue) {
		console.log("Settings - onTimbreSlideChangeValue:", newValue);
	}

	this.selectFont0 = function() {
		mySett.selectFontButton("fontArial");
		setCookie("subtitleFont", "Arial");
		$(document.getElementById("settingsPipText")).removeClass("fontArial fontOpenDyslexic fontAndika fontHelvetica fontLexia").addClass("fontArial");
	}
	this.selectFont1 = function() {
		mySett.selectFontButton("fontOpenDyslexic");
		setCookie("subtitleFont", "OpenDyslexic");
		$(document.getElementById("settingsPipText")).removeClass("fontArial fontOpenDyslexic fontAndika fontHelvetica fontLexia").addClass("fontOpenDyslexic");
	}
	this.selectFont2 = function() {
		mySett.selectFontButton("fontAndika");
		setCookie("subtitleFont", "Andika");
		$(document.getElementById("settingsPipText")).removeClass("fontArial fontOpenDyslexic fontAndika fontHelvetica fontLexia").addClass("fontAndika");
	}
	this.selectFont3 = function() {
		mySett.selectFontButton("fontHelvetica");
		setCookie("subtitleFont", "Helvetica");
		$(document.getElementById("settingsPipText")).removeClass("fontArial fontOpenDyslexic fontAndika fontHelvetica fontLexia").addClass("fontHelvetica");
	}
	this.selectFont4 = function() {
		mySett.selectFontButton("fontLexia");
		setCookie("subtitleFont", "Lexia");
		$(document.getElementById("settingsPipText")).removeClass("fontArial fontOpenDyslexic fontAndika fontHelvetica fontLexia").addClass("fontLexia");
	}

	this.selectMultiColor = function() {
		mySett.selectColorCell("#settingsFontColorSelectionCellMulti");
		setCookie("subtitleFontColor", "multiColor");
		$(document.getElementById("settingsPipText")).removeClass("multiColor whiteColor yellowColor blueColor");
	}
	this.selectWhiteColor = function() {
		mySett.selectColorCell("#settingsFontColorSelectionCellWhite");
		setCookie("subtitleFontColor", "whiteColor");
		$(document.getElementById("settingsPipText")).removeClass("multiColor whiteColor yellowColor blueColor").addClass("whiteColor");
	}
	this.selectYellowColor = function() {
		mySett.selectColorCell("#settingsFontColorSelectionCellYellow");
		setCookie("subtitleFontColor", "yellowColor");
		$(document.getElementById("settingsPipText")).removeClass("multiColor whiteColor yellowColor blueColor").addClass("yellowColor");
	}
	this.selectBlueColor = function() {
		mySett.selectColorCell("#settingsFontColorSelectionCellBlue");
		setCookie("subtitleFontColor", "blueColor");
		$(document.getElementById("settingsPipText")).removeClass("multiColor whiteColor yellowColor blueColor").addClass("blueColor");
	}

	this.selectColorCell =  function(cellColorButton) {
		console.log("selectColorCell - ", cellColorButton);
		var cellColorBtsTab = [
								"#settingsFontColorSelectionCellMulti",
								"#settingsFontColorSelectionCellWhite",
								"#settingsFontColorSelectionCellYellow",
								"#settingsFontColorSelectionCellBlue"
								];
		var i;
		for (i = 0; i < cellColorBtsTab.length; i++) { 
			if(cellColorBtsTab[i] == cellColorButton) {
				$(cellColorBtsTab[i]).addClass("selected");
			}
			else {
				$(cellColorBtsTab[i]).removeClass("selected");
			}
		} 	
	}


	this.selectWhiteBGColor = function() {
		mySett.selectBackgroundColorCell("#settingsFontBGColorSelectionCellWhite");
		setCookie("subtitleBGColor", "whiteBGColor");
		$(document.getElementById("settingsPipText")).removeClass("blackBGColor whiteBGColor").addClass("whiteBGColor");
	}
	this.selectBlackBGColor = function() {
		mySett.selectBackgroundColorCell("#settingsFontBGColorSelectionCellBlack");
		setCookie("subtitleBGColor", "blackBGColor");
		$(document.getElementById("settingsPipText")).removeClass("blackBGColor whiteBGColor").addClass("blackBGColor");
	}		
	this.selectBackgroundColorCell =  function(cellColorButton) {
		console.log("selectBackgroundColorCell - ", cellColorButton);
		var cellColorBtsTab = [
								"#settingsFontBGColorSelectionCellWhite",
								"#settingsFontBGColorSelectionCellBlack"
								];
		var i;
		for (i = 0; i < cellColorBtsTab.length; i++) { 
			if(cellColorBtsTab[i] == cellColorButton) {
				$(cellColorBtsTab[i]).addClass("selected");
			}
			else {
				$(cellColorBtsTab[i]).removeClass("selected");
			}
		} 	
	}



	this.selectFontButton = function(fontButton) {
		var btsTab = [
						"fontArial",
						"fontOpenDyslexic",
						"fontAndika",
						"fontHelvetica",
						"fontLexia"
						];
		var i;
		for (i = 0; i < btsTab.length; i++) { 
			if(btsTab[i] === fontButton) {
				$(document.getElementById(btsTab[i])).addClass("selected");	
			}
			else {
				$(document.getElementById(btsTab[i])).removeClass("selected");
			}   			
		} 		
	}

	this.onSizeSubtitleSlideChangeValue = function(newValue) {

		setCookie("subtitleFontSize", newValue);
		$(document.getElementById("settingsPipText")).css("font-size", newValue+"px");
		//mySett.setSize(newValue);

		console.log("onSizeSubtitleSlideChangeValue: ", newValue);
		//$(".settingsSizeFontSample").css("font-size", newValue+"px");
	}

	this.onOpacitySubtitleSlideChangeValue = function(newValue) {

		setCookie("subtitleBackgroundOpacity", newValue);
		$(document.getElementById("settingsPipText")).removeClass("opacity_0 opacity_025 opacity_05 opacity_075 opacity_1").addClass("opacity_"+newValue.replace(".",""));
	}
	
	this.unSelectFontButtons = function() {
				
	}

	this.updateIconsPip = function() {
		this.updateIconCenterPositionToCenter();
		this.updateIconSwitchPositionToTopCenter();
	}

	this.updateIconSwitchPositionToTopCenter = function() {
		console.log("updateIconSwitchPositionToTopCenter");
		$(".ui-icon-switchVideos").css({
			position:'absolute',
			top:'-30px',
			left:($(".settingsPipVideo").width() - $(".ui-icon-switchVideos").outerWidth()) / 2
		});
	}
	this.updateIconCenterPositionToCenter = function() {
		console.log("updateIconCenterPositionToCenter");
		$(".ui-icon-gripsmall-center").css({
			position:'absolute',
			left:($(".settingsPipVideo").width() - $(".ui-icon-gripsmall-center").outerWidth()) / 2,
			top:($(".settingsPipVideo").height() - $(".ui-icon-gripsmall-center").outerHeight()) / 2
		});
	}


	// size 
	this.setSize = function(newSize) {
		$("body > div").css("font-size", (newSize / 16) + "em");
		/*var elementsTab = [	
							".settingsSizeFontSample",							
							"#settingsMenuButtonGeneral",
							"#settingsMenuButtonLSF",
							"#settingsMenuButtonSubtitle",
							".topbarText",

							".activeNarratorText",
							".activeMagnifyingGlassText",
							".textVoiceControl",
							".textVolume",
							".textVitesse",
							".textTimbre",
							".textLecture",
							".textCarateresQueLOnTape",
							".textMotsQueLOnTape",
							".textFontSize"
							];

		var i;
		for (i = 0; i < elementsTab.length; i++) { 
   			//this.setSizeWithElement(elementsTab[i], newSize);
		} */
	}
	this.setSizeWithElement = function(element, newSize) {
		$(element).css("font-size", "");
		if(parseInt($(element).css("font-size"), 10) < newSize) {
			$(element).css("font-size", newSize+"px");
		}
	}

	var currentPipMode;
	this.initVideoAndPipBackgroundColor = function(pipText, videoText) {
		if(currentPipMode == null) {
			currentPipMode = (getCookie("PIPMode") != null) ? getCookie("PIPMode") : "PIP_MODE_LSF";	
		}

		var LSFBackgroundColor = "#4D4D4D";
		var VideoBackgroundColor = "#D8D8D8";

		if(currentPipMode == "PIP_MODE_LSF") {
			$(".settingsPipVideo").css("background-color", LSFBackgroundColor);
			$(".settingsVideoBackground").css("background-color", VideoBackgroundColor);
			$("#settingsPipText").text(pipText);
			$("#settingsVideoText").text(videoText);
		}
		else if(currentPipMode == "PIP_MODE_VIDEO") {
			$(".settingsPipVideo").css("background-color", VideoBackgroundColor);	
			$(".settingsVideoBackground").css("background-color", LSFBackgroundColor);
			$("#settingsPipText").text(pipText);
			$("#settingsVideoText").text(videoText);			
		}
		else {
			console.log("initVideoAndPipBackgroundColor - case not defined [", currentPipMode);
		}
	}

	this.settingsSwitchVideos = function() {
		//console.log("settingsSwitchVideos");

		if(currentPipMode == null) {
			currentPipMode = (getCookie("PIPMode") != null) ? getCookie("PIPMode") : "PIP_MODE_LSF";	
		}
		
		var newPipMode;
		if(currentPipMode == "PIP_MODE_LSF") {
			newPipMode = "PIP_MODE_VIDEO";
		}
		else if(currentPipMode == "PIP_MODE_VIDEO") {
			newPipMode = "PIP_MODE_LSF";
		}
		else {
			console.log("settingsSwitchVideos - case not defined [", currentPipMode);
		}


		console.log("settingsSwitchVideos ", currentPipMode, " TO >>", newPipMode, "<<"); 

		currentPipMode = newPipMode; //to test on locahost

		//reset background color
		mySettingsScreen.initVideoAndPipBackgroundColor()

		setCookie("PIPMode", newPipMode);
	}
}
	
function pad(thing) {
	return (thing < 10) ? "0" + String(thing) : thing;
}