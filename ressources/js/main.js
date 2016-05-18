var isHTML5 = isHTML5 || false;
var Main = {
	splashscreenIsVisible:true,
	simplifiedMode:false,
	MCSupport:false
};

Main.onLoad = function () {
	log("onLoad() : start;");
	
	var $errorMCSupport = $(document.getElementById("noMCSupport"));
	if(checkMediaControllerSupport() === "unsupported"){
		$errorMCSupport.show();
	}else{
		$errorMCSupport.hide();
		Main.MCSupport = true;
	}
	
	Main.simplifiedMode = getHtmlStorage("simplifiedMode") === "true" ? true : false;
	
	var valueMinSize = getHtmlStorage("settings_min_size") || Settings.fontSizeRange[0];
	Settings.change.fontSize(valueMinSize);
	
	Main.firstLaunch = true;
	API.getConfig(function() {
	
		$(document.getElementById("appVersion")).html("v"+Config.appVersion);
		
		API.loadConfigurationSet(function(){
			API.getUserTokens();
		});
		
		setTimeout(function(){
			Section.change(Section.sections[0]);
			Main.hideSplashScreen();
		}, Main.simplifiedMode ? 5000 : 500);
	});
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Hides the splashscreen if displayed
 */

Main.hideSplashScreen = function(){
	if(Main.splashscreenIsVisible){
		$("body").removeClass("splashscreen");
		Main.splashscreenIsVisible = false;
	}
};

Main.switchToMode = function(){
	this.simplifiedMode = this.simplifiedMode ? false : true;
	
	setHtmlStorage("simplifiedMode", this.simplifiedMode, 1000 * 60 * 60 * 24 * 365);
	
	Section.change(Section.sections[1]);
};

// Add onload event to window
window.onload = Main.onLoad;