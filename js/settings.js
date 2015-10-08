function settingsScreen() {
	var mySettingsScreen = this;
	this.activeScreen = false;
	this.settingsScreen = document.getElementById("settingsScreen");

	var widthReal 	= $("#home").width();
	var heightReal = $("#home").height();

	var width 	= 1800;
	var height = 1200;
		
	this.createSettings = function() {
	}

	function setSize(param) {

	}

	this.init = function() {
		mySettingsScreen.cleanPage();

		var sizeFontDIV = createDiv("settingsSizeFont", this.settingsScreen, "", "settingsSizeFont");
		///function createButton(idElement, parent, zone, x, y, style){
		var sizeFontTiny = createButton("sizeFontTiny", sizeFontDIV, "zoneEnlargeText", 0, 0, "sizeFontTiny");
		sizeFontTiny.innerHTML = "a";
		var sizeFontSample = createDiv("settingsSizeFontSample", sizeFontDIV, "", "settingsSizeFontSample");
		sizeFontSample.innerHTML = "bonjour";
		var sizeFontBig = createButton("sizeFontBig", sizeFontDIV, "zoneReduceText", 0, 0, "sizeFontBig");
		sizeFontBig.innerHTML = "A";

		var slideContainer = createDiv("settingsSlideContainer", this.settingsScreen, "", "settingsSlideContainer");
		slideContainer.innerHTML = '<input class="sizeSlide" type="range" min="16" max="48" value="24" step="8" onchange="mySett.onSizeSlideChangeValue(this.value)"/>'


		var videoScreen = createDiv("settingsBackground", this.settingsScreen, "", "settingsBackground");
		var videoPipLimitScreen = createDiv("settingsVideoPipLimitScreen", videoScreen, "", "settingsVideoPipLimitScreen");

		// !! using percent !!
		var pipLeftPercent = (getCookie("LSFPip_position_x") != null && !isNaN(getCookie("LSFPip_position_x"))) ? getCookie("LSFPip_position_x") : 81;
		var pipTopPercent = (getCookie("LSFPip_position_y") != null && !isNaN(getCookie("LSFPip_position_y"))) ? getCookie("LSFPip_position_y") : 45;

		var PipWidthReal = (getCookie("LSFPip_size_width") != null) ? getCookie("LSFPip_size_width") : 320;
		var PipHeightReal = (getCookie("LSFPip_size_height") != null) ? getCookie("LSFPip_size_height") : 180;

		var ret = '';
		ret += '<div class="settingsPipVideo ui-draggable ui-resizable" style="left: '+pipLeftPercent+'%; top: '+pipTopPercent+'%;'+'">';
		ret += '';
		ret += '	<div class="ui-resizable-handle ui-resizable-e" unselectable="on"></div>';
		ret += '	<div class="ui-resizable-handle ui-resizable-s" unselectable="on"></div>';
		ret += '	<div class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se" unselectable="on" style="z-index: 1001;"></div>';
		ret += '</div>';

		videoPipLimitScreen.innerHTML = ret;

		$( ".settingsPipVideo" ).draggable({ 	containment: ".settingsVideoPipLimitScreen",
												scroll:false,
												stop: function() {
        											saveCoordinates();
      											}
      										});
		//$('.settingsPipVideo').resizable();

		function saveCoordinates() {
			var pipLeft = $(".settingsPipVideo").position().left;
			var pipTop = $(".settingsPipVideo").position().top;

			var widthContainerString = $(".settingsVideoPipLimitScreen").css("width");
			var widthContainerPx = widthContainerString.substring(0, widthContainerString.length-2);
			var heightContainerString = $(".settingsVideoPipLimitScreen").css("height");
			var heightContainerPx = heightContainerString.substring(0, heightContainerString.length-2);

			var newLeftPercent = (pipLeft/widthContainerPx)*100;
			var newTopPercent = (pipTop/heightContainerPx)*100;

			console.log("saveCoordinates : (left:"+ newLeftPercent+ ", top:" + newTopPercent);

			setCookie("LSFPip_position_x", newLeftPercent);
			setCookie("LSFPip_position_y", newTopPercent);
		}

		mySettingsScreen.show();
	};
	
	this.show = function() {
		mySettingsScreen.settingsScreen.style.display = "block";
		this.activeScreen = true;
	};
	
	this.hide = function() {
		mySettingsScreen.settingsScreen.style.display = "none";
		this.activeScreen = false;
	};
	
	this.cleanPage = function() {
		emptyElem(this.settingsScreen);
	};

	this.onSizeSlideChangeValue = function(newValue) {
		console.log("onSizeSlideChangeValue: ", newValue);
		$(".settingsSizeFontSample").css("font-size", newValue+"px");
	}
}