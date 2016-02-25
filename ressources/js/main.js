var isHTML5 = isHTML5 || false;
var Main = {
	splashscreenIsVisible:true,
	simplifiedMode:false
};

/**
 * @description Show popup if no network
 */

Main.showErrorNetworkPopup = function(){
	Popup.info.show({
		titleAndMsg:["", LANG.getStr(LANG.langData.errors.networkError)],
		onBack:Main.exit,
		buttons:[{
			title:LANG.getStr("retry"),
			onClick:Main.checkConnection
		},{
			title:LANG.getStr("exit"),
			onClick:Main.exit
		}]
	});
};

Main.onLoad = function () {
	log("onLoad() : start;");
	
	$(document.getElementById("appVersion")).html("v"+Config.appVersion);
	
	Main.simplifiedMode = statusHtmlStorage("simplifiedMode") && localStorage.getItem("simplifiedMode") === "true" ? true : false;
	
	var valueMinSize = (getCookie("settings_min_size") != null) ? getCookie("settings_min_size") : Settings.minFontSize;
	Settings.change.fontSize(valueMinSize);
	
	var defaultValue = getCookie("volumeValue") || Settings.defaultVolumeValue;
	$( document.getElementById("slider") ).slider({
        range: "min",
        min: 0,
        value: defaultValue,
 
        start: function(event,ui) {
          tooltip.fadeIn('fast');
        },
 
        slide: function(event, ui) {
			InfoBanner.launchMaskingAfterDelay();
			
            var value = ui.value,//slider.slider('value'),
                volume = $('.volume');
			
			var $slider = $(this).children("a");
            tooltip.css('left', $slider.css("left")).text(ui.value);
 
            if(value <= 5) { 
                volume.css('background-position', '0 0');
				
            }else if (value <= 25) {
                volume.css('background-position', '0 -25px');
				
            }else if (value <= 75) {
                volume.css('background-position', '0 -50px');
				
            }else{
                volume.css('background-position', '0 -75px');
            }
			
			$slider.attr("aria-valuenow", value).attr("aria-valuetext", value + " pourcent");
			
			try{
				if(!value){
					Player.setMute();
				}else{
					eraseCookie("muteEnabled");
					setCookie("volumeValue", value);
					Player.setVolume(audioGainNode, videoGainNode, value);		
					$(document.getElementById("playerOptionAudioCurrentValue")).html(Media.audiosList[Media.currentAudioIndex]);
				}
			}catch(e){
				console.error(e);
			}			
        },
 
        stop: function(event, ui) {
          tooltip.fadeOut('fast');
        }
	});
	var tooltip = $('.tooltip').hide();	
	
	Main.firstLaunch = true;
	API.getConfig(function() {
		setTimeout(function(){
			Section.change(Section.sections[0]);
			Main.hideSplashScreen();
		}, 5000);
	});
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the app
 * @param {String} lang A default language to use to load the app
 * @param {Function} afterInitApp The function which will be triggered after menu generating
 * @param {Boolean} dontLoadRubric Determines whether the first rubric must be loaded after menu generating
 */

Main.initApp = function(afterInitApp){
	
	var _callback = function(){
		
		//var urlLangFile = "ressources/json/translations.json";
		/*LANG.init({
			langFile: urlLangFile,
			codeLang:lang,
        	headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'},
			onComplete: function(){*/
				
				// MAJ des textes et boutons
				//Main.updateStaticText();	
				
				if(typeOf(afterInitApp) === "function"){
					afterInitApp();
				}
			/*}
		});	*/	
	};
	
	// Ne rentre ici qu'au démarrage de l'appli (login et password sauvé dans le localStorage)
	if(User.credentialsIsSaved() && !User.data){
		Login.email = CryptoJS.AES.decrypt(User.lsData.email, Config.passphrase).toString(CryptoJS.enc.Utf8);
		Login.password = CryptoJS.AES.decrypt(User.lsData.password, Config.passphrase).toString(CryptoJS.enc.Utf8);
		
		Login.callback = {
			onSuccess:function(){
				_callback();
			},
			onError:function(){
				User.disconnect();
				_callback();
			}
		};
		Login.checkAccess();
		
	}else{
		_callback();
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Inserts static text in HTML elements
 */

Main.updateStaticText = function(){
	
	// Le menu
    $(document.getElementById("static-menu-button-1")).children().html(LANG.getStr("exit"));
	$(document.getElementById("static-menu-button-2")).children().html(LANG.getStr(LANG.codeLang === "ar" ? "english_button" : "arabic_button"));
	
	// Login
	$(document.getElementById("login-title")).html(LANG.getStr("login_title"));
	$(document.getElementById("validate-login-button")).children().html(LANG.getStr("ok"));
	
	// Popup
	$(document.getElementById("validate-keyboard-popup")).children().html(LANG.getStr("ok"));
	$(document.getElementById("delete-button")).children().html(LANG.getStr("delete_button"));
	
	// Boutons
	$(document.getElementById("carrousel-button-1")).children().html(LANG.getStr("watch_trailer"));
	$(document.getElementById("carrousel-button-2")).children().html(LANG.getStr("view_more"));
	$(document.getElementById("carrousel-button-3")).children().html(LANG.getStr("watch_movie"));
	$(document.getElementById("top-menu-submenu-grid-button-1")).children().html(LANG.getStr("recommended_button"));
	$(document.getElementById("top-menu-submenu-grid-button-2")).children().html(LANG.getStr("alphabetical_button"));
	$(document.getElementById("top-menu-submenu-grid-button-3")).children().html(LANG.getStr("last_added_button"));
	$(document.getElementById("episode-button")).children().html(LANG.getStr("episode_button"));
	$(document.getElementById("language-button")).children().html(LANG.getStr("language_button"));
	$(document.getElementById("return-button")).children().html(LANG.getStr("return_button"));
	$(document.getElementById("home-button")).children().html(LANG.getStr("home_button"));
	$(document.getElementById("watch-button-splash")).children().html(LANG.getStr("view_more"));
	$(document.getElementById("watchlist-button-splash")).children().html(LANG.getStr("watchlist_button_add"));
	$(document.getElementById("dashboard-watch-trailer-button")).children().html(LANG.getStr("watch_trailer"));
	$(document.getElementById("dashboard-watchlist-button")).children().html(LANG.getStr("watchlist_button_add"));
	$(document.getElementById("return-button-kids-menu")).children().html(LANG.getStr("return_button"));
	$(document.getElementById("close-button-languages-popup")).children().html(LANG.getStr("close_button"));
	$(document.getElementById("subtitles-container")).find(".value:first-child span").text(LANG.getStr("none"));
	$(document.getElementById("watch-now-next-episode")).children().html(LANG.getStr("watch_now"));
	$(document.getElementById("return-next-episode")).children().html(LANG.getStr("return_button"));

	// Textes
	var texts = [LANG.getStr("languages"), LANG.getStr("subtitles")];
	$(document.getElementById("dashboard-languages-and-subtitles-container")).find("span.title").each(function(i, span){
		$(span).text(texts[i]+": ");
	});
	
	texts = [LANG.getStr("production_year"), LANG.getStr("origin_country")];
	$(document.getElementById("dashboard-country-and-production-date-container")).find("span.title").each(function(i, span){
		$(span).text(texts[i]+": ");
	});
	$(document.getElementById("dashboard-pegi")).children("span.title").text(LANG.getStr("pegi")+": ");
	
	$(document.getElementById("languages-container")).find(".label span").text(LANG.getStr("audio"));
	$(document.getElementById("subtitles-container")).find(".label span").text(LANG.getStr("subtitles"));

	$(document.getElementById("next-episode")).text(LANG.getStr("next_episode").toUpperCase());

};
	

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Cleans and returns a title according the limit to display
 * @param {String} title The title
 * @param {Integer} maxLength The limit to display
 * @return {String} The new title
 */

Main.getTitle = function(title, maxLength){
	title = $.trim(title);
	if(title.length > maxLength){
		title = getTextWhitoutCutWord(title.substr(0,(maxLength-3)));
	}

	return title || "";
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

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Exits the application
 */

Main.exit = function(){
	window.open('', '_self', '');
	window.close();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Handles the redisplay of the last elements displayed according the event name
 * @param {String} eventName The event name
 * @return {Boolean} Returns whether the event handler must stop managing the event
 */

Main.displayAfterMasking = function(eventName){
	
	// Si on est en fullscreen et qu'aucune popup n'est affiché
	if(Section.name === Section.sections[9] && !InfoBanner.isDisplayed() && !Popup.isOpen && !InfoBanner.toTheNextEpisode){
		
		// Pour pouvoir gérer les touches de navigation en fullscreen
		if([eventUtils.KEY_STOP, eventUtils.KEY_PLAY, eventUtils.KEY_PAUSE, eventUtils.KEY_PLAY_PAUSE, eventUtils.KEY_RW, eventUtils.KEY_FF].indexOf(eventName) !== -1){
			return false;
			
		}else{
			this.displayAfterMasking.displayAfterFullscreen(eventName);
			return true;
		}
	}
	return false;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Exits the fullscreen mode, then performs an action according the event name
 * @param {String} eventName The event name
 */

Main.displayAfterMasking.displayAfterFullscreen = function(eventName){
	
	// Un back permet de revenir à l'écran précédent
	if(eventName === eventUtils.KEY_BACK){
		Navigation.handleReturnButton(Player.getCurrentTime());

	// N'importe quelle touche permet de réafficher la banner
	}else{
		InfoBanner.launchMaskingAfterDelay();
		InfoBanner.show();
	}
};

Main.switchToMode = function(){
	this.simplifiedMode = this.simplifiedMode ? false : true;
	
	setHtmlStorage("simplifiedMode", this.simplifiedMode, 1000 * 60 * 60 * 24 * 365);
	
	Section.change(Section.sections[1]);
};

Main.goToHome = function(){
	Section.change(Section.sections[1]);
};

// Add onload event to window
window.onload = Main.onLoad;