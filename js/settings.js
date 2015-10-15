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
		console.log("setSize");

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

		var pipWidthReal = (getCookie("LSFPip_size_width") != null) ? getCookie("LSFPip_size_width") : 18.63425925925926;
		var pipHeightReal = (getCookie("LSFPip_size_height") != null) ? getCookie("LSFPip_size_height") : 16.30824372759857;

		var ret = '';
		ret += '<div class="settingsPipVideo ui-draggable ui-resizable" style="left: '+pipLeftPercent+'%; top: '+pipTopPercent+'%; width:'+pipWidthReal+'%; height:'+ pipHeightReal +'%">';
		ret += '<div class="ui-icon-gripsmall-center" style="z-index: 1010;"></div>';
		ret += '</div>';


		videoPipLimitScreen.innerHTML = ret;

		$( ".settingsPipVideo" ).draggable({ 	containment: ".settingsVideoPipLimitScreen",
												scroll:false,
												stop: function() {
        											saveLSFCoordinates();
      											}
      										}).resizable( {
      											containment: ".settingsVideoPipLimitScreen",
      											handles: 'all',
      											minHeight: 120,
      											aspectRatio: 16/9,
      											resize: function() {
      												mySettingsScreen.updateIconCenterPositionToCenter();
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

		mySettingsScreen.updateIconCenterPositionToCenter();
		mySettingsScreen.show();
	};
	
	this.show = function() {
		mySettingsScreen.settingsScreen.style.display = "block";
		mySettingsScreen.updateIconCenterPositionToCenter();
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

	this.updateIconCenterPositionToCenter = function() {
		console.log("updateIconCenterPositionToCenter");
		$(".ui-icon-gripsmall-center").css({
				position:'absolute',
				left:($(".settingsPipVideo").width() - $(".ui-icon-gripsmall-center").outerWidth()) / 2,
				top:($(".settingsPipVideo").height() - $(".ui-icon-gripsmall-center").outerHeight()) / 2
		});
	}

}