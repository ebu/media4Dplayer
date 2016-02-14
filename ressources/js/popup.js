var Popup = {
	"isOpen": false,
	"popupOpened": null,
	"error":{},
	"info":{
		"onBack":null
	},
	"keyboard":{
		"input":"",
		callback:null,
		isSearchPopup:false,
		isForPassword:false,
		tapedPassword:"",
		minLength:null
	},
	"languages":{}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Hides all popups
 */

Popup.hideAll = function(){
	var isSearchKeyboardPopup = $(Popup.popupOpened).length && $(Popup.popupOpened)[0].id === "keyboard-popup" && Popup.keyboard.isSearchPopup;
	Popup.hide();
	$(document.getElementById("popup-container")).hide().removeClass("hide-background").find(".focus").removeClass("focus");
	Navigation.currentEl = null;
	
	if(isSearchKeyboardPopup && !$(document.getElementById("menu")).find(".focus").length){
		log("Popup.hideAll isSearchKeyboardPopup and not menu focused");
		Navigation.setFocusToMainMenu();
	}
	if(isSearchKeyboardPopup){

		log("Popup.hideAll isSearchKeyboardPopup");
		$(document.getElementById("popup-container")).removeClass("search");
	}	
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Hides the current opened popup
 */

Popup.hide = function(){
	if(this.isOpen){
		if($(this.popupOpened).length){
			$(this.popupOpened).removeClass("selected");
		}
		this.isOpen = false;
		this.popupOpened = null;
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Shows a popup
 * @param {jQuery Object} $popup The popup to show
 */

Popup.show = function($popup){
	if($($popup).length){
		this.hideAll();
		this.isOpen = true;
		this.popupOpened = $popup;

		$(document.getElementById("popup-container")).show();
		$popup.addClass("selected");
	}
};