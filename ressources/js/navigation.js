var Navigation = {
	"blockNavigation": false,
	"currentEl": null,
	"oldEl": [],
	"combinationForReloadApp": [],
	"delayOfSaveOldKeys": 1500,
	"oldKeys": [],
	timeoutClearOldKeys:null
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description This is the event handler
 * @param {Object} event The event triggered
 * @param {Boolean} bypassCombinaison For the management of the keys combination
 */

Navigation.onKeyDown = function(event, bypassCombinaison) {
	
	InfoBanner.launchMaskingAfterDelay();
	
	Collections.hideUpArrow();
	
	if(Main.splashscreenIsVisible){
		return false;
	}

	var CurrentElement = Navigation.getElFocused();
	var eventName = eventUtils.getKeyName(event);
	if($(CurrentElement).length || eventName === eventUtils.KEY_BACK || Popup.isOpen){
	
		var idCurrentElement = $(CurrentElement).attr("id");
		
		// L'infobanner reste en LTR
		if(Player.playlistTrailerActive || Section.name !== Section.sections[9] || !$(CurrentElement).parents("#info-banner-section-name-and-arrow-container").length){
		
			if(LANG.isRTL() && eventName && !(Popup.isOpen && $(Popup.popupOpened).attr("id") === "info-popup")){
				eventName = eventName === "left" ? "right" : eventName === "right" ? "left" : eventName;
			}			
		}
		
		if(!Navigation.currentEl){
			log('not currentEl',"warn");
			Navigation.currentEl = CurrentElement;
		}
		
		try{
			
			// Si c'est une combinaison doit mettre en pause la gestion des touches quand c'est une touche de couleur faisant partie de la combinaison
			if(!bypassCombinaison && Navigation.isCombination(event, eventName)){
				return false;
			}

			// Annule l'action si la navigation est désactivée
            if (Navigation.blockNavigation) {
                if (eventName === eventUtils.KEY_BACK && Section.name === Section.sections[9]) {
                    // force back 
                    Player.exitForced();
                }else{
                	log("Evènement désactivé car la navigation est bloquée");
                }
                return false;
			}
			
			// Gestion du réaffichge de l'info banner
			if(Main.displayAfterMasking(eventName)){
				return false;
			}

			// Gestion du back des popup
			if(Navigation.onKeyDown.managingBackKeyOnPopup(eventName)){
				return false;
			}

			// Gestion du back des écrans
			if(eventName === eventUtils.KEY_BACK){
				
				var time = (Section.name === Section.sections[9]) ?	Player.currentTime : null;
				Navigation.handleReturnButton(time);
				return false;
			}

			// Gestion des touches numérotés
			if(Navigation.onKeyDown.managingNumbers(eventName)){
				return false;
			}

			// Gestion des touches couleurs
			if(Navigation.onKeyDown.colorsKeys(eventName, idCurrentElement)){
				return false;
			}

			// Gestion des touches de controle du player
			if(Navigation.onKeyDown.managingPlayerKey(eventName)){
				return false;
			}

			// Gestion de la navigation UP/DOWN/LEFT/RIGHT/ENTER
			if(Navigation.onKeyDown.managingNavigationKeys(eventName, idCurrentElement)){
				return false;
			}
			
		}catch(e){
			console.log("ERROR caused by element "+idCurrentElement+" : " , e);
			console.log("e.stack : " , e.stack);
			showExceptionMessage(e, "ERROR caused by element "+idCurrentElement+" : ");
			return true;
		}

		log("keyDown() : Aucune action définie pour la touche '"+(eventName?eventName:event.keyCode)+"'");
			
		return false;
	}else{
		log("évènement "+eventName+" ignoré car le focus n'a pas été trouvée");
	}
	return true;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Determines if a back event has been triggered. Launches the appropriate action if true
 * @param {Object} eventName The event name
 * @return {Boolean} Returns whether the event handler must stop managing the event
 */

Navigation.onKeyDown.managingBackKeyOnPopup = function(eventName){
	if([eventUtils.KEY_BACK].indexOf(eventName) !== -1 && Popup.isOpen){
		
		Navigation.currentEl = null;
		
		if(Popup.popupOpened[0].id === "info-popup" && typeOf(Popup.info.onBack) === "function"){
			Popup.info.onBack();
			Popup.hideAll();
		
		}else if(Popup.popupOpened[0].id === "languages-popup"){
			Popup.hideAll();
			
		}else if(Popup.popupOpened[0].id === "keyboard-popup"){
			if(Section.name === Section.sections[4]){
				if(Popup.keyboard.input){
					Section.change(Section.name, null, null, $(document.getElementById("rubrics-list-menu")).children(".selected"));
				}
				else{
					Main.exit();
				}
			}else{
				Popup.hideAll();
			}
		}		
		return true;
	}
	return false;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Determines if a number event has been triggered. Launches the appropriate action if true
 * @param {Object} eventName The event name
 * @return {Boolean} Returns whether the event handler must stop managing the event
 */

Navigation.onKeyDown.managingNumbers = function(eventName){
	if([eventUtils.KEY_1, eventUtils.KEY_2, eventUtils.KEY_3, eventUtils.KEY_4, eventUtils.KEY_5, eventUtils.KEY_6, eventUtils.KEY_7, eventUtils.KEY_8, eventUtils.KEY_9, eventUtils.KEY_0].indexOf(eventName) !== -1){
		if(Popup.isOpen && Popup.popupOpened.attr('id') === "keyboard-popup"){
			Popup.keyboard.updateInputField(Popup.popupOpened, eventName);
			return true;
		}
		return false;
	}
	return false;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Determines if a color has been taped. Launches the appropriate action if true
 * @return {Boolean} Returns whether the event handler must stop managing the event
 */

Navigation.onKeyDown.colorsKeys = function(){};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Determines if a player control event has been triggered. Launches the appropriate action if true
 * @param {Object} eventName The event name
 * @return {Boolean} Returns whether the event handler must stop managing the event
 */

Navigation.onKeyDown.managingPlayerKey = function(eventName){
	if([eventUtils.KEY_PLAY, eventUtils.KEY_PAUSE, eventUtils.KEY_PLAY_PAUSE, eventUtils.KEY_STOP, eventUtils.KEY_RW, eventUtils.KEY_FF].indexOf(eventName) !== -1 &&
		[Section.sections[9]].indexOf(Section.name) !== -1){
		if([eventUtils.KEY_PLAY, eventUtils.KEY_PAUSE, eventUtils.KEY_PLAY_PAUSE].indexOf(eventName) !== -1){
			Player.playPause();
			
		}else if(eventName === eventUtils.KEY_FF){
			Player.jumpForward();
			
		}else if(eventName === eventUtils.KEY_RW){
			Player.jumpBackward();

		}else if(eventName === eventUtils.KEY_STOP){
			Navigation.handleReturnButton(Player.currentTime);
		}
		return true;
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Determines if a navigation key event has been triggered. Launches the appropriate action if true
 * @param {Object} eventName The event name
 * @param {String} idCurrentElement The current element's ID
 * @return {Boolean} Returns whether the event handler must stop managing the event
 */

Navigation.onKeyDown.managingNavigationKeys = function(eventName, idCurrentElement){	
	if([eventUtils.KEY_ENTER, eventUtils.KEY_UP, eventUtils.KEY_DOWN, eventUtils.KEY_LEFT, eventUtils.KEY_RIGHT].indexOf(eventName) !== -1){		
		Navigation.getAction(idCurrentElement, eventName);
		return true;
	}
	return false;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches the defined function for this event by the an element
 * @param {String} idCurrentElement The element id
 * @param {String} eventName The event name
 */

Navigation.getAction = function(idCurrentElement, eventName){

	if(idCurrentElement && eventName && typeOf(actionList) === "object"){
		if(typeOf(actionList[idCurrentElement]) === "object" && typeOf(actionList[idCurrentElement][eventName]) === "function"){
			actionList[idCurrentElement][eventName]($(document.getElementById(idCurrentElement)));
		}else{
			log("getAction() : L'élément '"+idCurrentElement+"' n'a pas d'action prédéfinie pour l'évènement '"+eventName+"'");
		}
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Gives the focus to an element and saves it
 * @param {jQuery Object} me The current focused element
 */

Navigation.setClassFocus = function(me){
	if($(me).length){
		me.addClass("focus");
		this.currentEl = me;
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Gives the focus to an element and saves it
 * @param {jQuery Object} me The current focused element
 * @param {String} direction The direction where we need to go for find the next element
 */

Navigation.setClassFocusToPrevOrNextItem = function(me, direction){
	var searchFunc = (direction === "left") ? getPrevItem : getNextItem;
	var $btn = searchFunc(me, LANG.isRTL(), ".btn:first");
	if($btn.length){
		me.removeClass("focus");
		this.setClassFocus($btn);
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Determines and return if an arrow is visible
 * @param {jQuery Object} $arrow The arrow
 * @return {Boolean} Returns true if the arrow is visible. False otherwise
 */

Navigation.arrowIsVisible = function($arrow){
	return $arrow.css("visibility") !== "hidden";
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Gives the focus to an arrow and launches a callback function
 * @param {jQuery Object} $arrow The arrow
 * @param {Function} callback The function which will be triggered after giving the focus to the arrow
 */

Navigation.setFocusToAArrow = function($arrow, callback){
	if(this.arrowIsVisible($arrow)){
		this.setClassFocus($arrow);
		if(typeOf(callback) === "function"){
			callback();
		}
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Handles the keys combination
 * @param {Object} event The event triggered
 * @param {String} eventName The event name
 * @return {Boolean} Returns whether to stop the event in the event handler
 */

Navigation.isCombination = function(event, eventName){
	// Si la touche fait partie de la combinaison...
	if(eventName && this.combinationForReloadApp.indexOf(eventName) !== -1){
		// doit vérifier les positions. qu'est ce qui se trouve en position+1
		if(this.oldKeys.length){
			var conditionForLaunchesAction = function(navigation){
				var combinaison = navigation.combinationForReloadApp;
				if(!combinaison[navigation.oldKeys.length+1]){
					return combinaison[navigation.oldKeys.length-1] === navigation.oldKeys[Navigation.oldKeys.length-1] && combinaison.length === navigation.oldKeys.length+1 && combinaison[Navigation.oldKeys.length] === eventName;
				}
				return false;
			};
			
			if(conditionForLaunchesAction(this)){
				log("isCombination() : touche '"+eventName+"'; combinaison termninée sans faute. Je dois relancer l'application");
				document.location.reload(true);
				return true;

			}else if(this.combinationForReloadApp[this.oldKeys.length] === eventName){
				log("isCombination() : touche '"+eventName+"'; suite de la combinaison");
				this.clearTimeoutOldKeys(true, event);
				this.oldKeys.push(eventName);
				return true;

			}else{
				log("isCombination() : touche '"+eventName+"'; mauvaise combinaison. Tout repart à zéro");
			}

		}else if(this.combinationForReloadApp.indexOf(eventName) === 0){
			log("isCombination() : touche '"+eventName+"'; début de la combinaison");
			this.clearTimeoutOldKeys(true, event);
			this.oldKeys.push(eventName);
			return true;
		}
	}
	this.clearTimeoutOldKeys();
	return false;	
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Deletes the list of previous entries for a combination
 * @param {Boolean} relaunchTo If true will deleted the entries after a idle time, otherwise directly
 * @param {Object} event The event triggered
 */

Navigation.clearTimeoutOldKeys = function(relaunchTo, event){
	try{
		clearTimeout(this.timeoutClearOldKeys);
		if(relaunchTo){
			this.timeoutClearOldKeys = setTimeout(function(){
				this.oldKeys = [];
				this.onKeyDown(event, true);
			}, this.delayOfSaveOldKeys);
		}
		else{
			this.oldKeys = [];
		}
	}catch(e){
		showExceptionMessage(e, 'Exception navigation.clearTimeoutOldKeys : ');
	}		
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Returns the element which have the focus currently
 * @return {jQuery Object} The current element focused
 */

Navigation.getElFocused = function(){
	if(Popup.isOpen && $(Popup.popupOpened).length && Popup.keyboard.isSearchPopup){
		return !$(Navigation.currentEl).length ? $("body .focus:visible").eq(0) : Navigation.currentEl;
	}
	
	if(Popup.isOpen && $(Popup.popupOpened).length){
		return $(Popup.popupOpened).find(".focus:first");
		
	}else if(!$(Navigation.currentEl).length){
		
		var $btnMenu = $(document.getElementById("menu")).find(".focus:visible:first");
		if($btnMenu.length){
			return $btnMenu;
			
		}else if($(Section.template).length && Section.template.find(".focus:first").length){
			return Section.template.find(".focus:first");
			
		}else{
			return $("body .focus:visible").eq(0);
		}
		
	}else{
		return Navigation.currentEl;
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Returns the element which have the focus currently in a list
 * @param {jQuery Object} $parent The parent element
 * @return {jQuery Object} The current element focused
 */

Navigation.getElFocused2 = function($parent){
	return $($parent).find(".focus2:first");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Returns the element which have the focus currently in a list
 * @param {jQuery Object} $parent The parent element
 * @return {jQuery Object} The current element focused
 */

Navigation.getElFocused3 = function($parent){
	return $($parent).find(".focus3:first");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Returns the element which have the focus currently in a list
 * @param {jQuery Object} $parent The parent element
 * @return {jQuery Object} The current element focused
 */

Navigation.getElFocused4 = function($parent){
	return $($parent).find(".focus4:first");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches the redisplay of the previous templage
 * @param {Integer} time The playback current time
 */

Navigation.handleReturnButton = function(time){
	
	var goBackFromFullGrid = function(){
		Grid.hide();
		Section.template = $(document.getElementById("homepage-section"));
		Home.show();
		if(Section.isDisney){
			Section.rubric = Section.rubrics[Section.name][1];
			Section.isDisney = false;
		}else{
			Section.rubric = null;
		}
		
		Grid.fullMode = false;
		$(document.getElementById("submenu-1-grid-tile-list")).removeClass("focus");
	
		// MAJ du nom de la section
		if(Section.sectionsWithSubmenu.indexOf(Section.name) !== -1 && 
			((Section.template[0].id !== "homepage-section" || Home.mode !== "full") && (Section.template[0].id !== "submenu-1-grid" || !Grid.fullMode))){
			Submenu.show();
			if(Section.rubric !== Section.rubrics[Section.sections[1]][1]){
				$(document.getElementById("submenu-1")).find(".selected").removeClass("selected");
			}
		}else{
			Submenu.hide();
		}
	};
	
	// Si je suis dans le Player
	if(Section.name === Section.sections[9]){
		// log("handleReturnButton dans le player");
		Player.cancelPlaying = true;
		InfoBanner.hide();
		clearInterval(InfoBanner.timeoutNextEpisode);
        clearInterval(Player.jumpSeekInterval);
		Player.stop();
		Player.hide();
        for (var id in Player.xhr) {
            if (Player.xhr[id] && typeof(Player.xhr[id].abort) !== 'undefined') {
                log('abort : ' + id);
                try {
                    Player.xhr[id].abort();
                    Player.xhr[id] = null;
                } catch (e) {
                    showExceptionMessage(e, 'Player.exitForced abort');
                }
            }
        }
		this.goBack(time);
	
	// Si je suis dans la Dashboard
	}else if([Section.sections[7], Section.sections[8]].indexOf(Section.name) !== -1){
		// log("handleReturnButton dans le Dashboard");
		this.goBack();
		
	// Si je suis dans Kids
	}else if(Section.name === Section.sections[11]){
		// log("handleReturnButton dans kids");
		if(Section.rubric === Section.rubrics[Section.name][0]){
			goBackFromFullGrid();
		
			Navigation.setClassFocus($(document.getElementById("full-catalogue-button")));
			$(document.getElementById("return-button-kids-menu")).removeClass("focus");	
			
		}else{
			var $rubricBtn = $(document.getElementById("rubrics-list-menu")).children(".selected");
			if(!$rubricBtn.length){
				
				// Ne doit pas charger la section Kids par défaut si on est en mode Kids (boucle sans fin)
				if(User.itsKidsParentalControl()){
					var cache = LANG.cache["menu_" + LANG.codeLang].list;
					var $rubricBtn = $(document.getElementById("rubrics-list-menu")).children(".btn").filter(function(i, item){
						return $(item).css("display") !== "none" && (typeOf(cache[$(item).index()].tags) !== "array" || cache[$(item).index()].tags.indexOf("kids") === -1);
					}).eq(0);
					
				}else{
					$rubricBtn = $(document.getElementById("rubrics-list-menu")).children(".btn:visible:first");
				}
			}
				
			if($rubricBtn.length){
				actionList[$rubricBtn[0].id].enter($rubricBtn);	
			}
		}
	
	// Si je suis dans la Grid pour Movies et Series
	}else if([Section.sections[2], Section.sections[1]].indexOf(Section.name) !== -1 && Section.rubric === Section.rubrics[Section.name][0]){
		// log("handleReturnButton dans la grid");

		goBackFromFullGrid();	
		
		var $focusInMenu = $(document.getElementById("menu")).find(".focus"),
			$focusInSection = Section.template.find(".focus"),
			$focusInSubmenu = Submenu.isVisible() ? $(document.getElementById("submenu-1")).find(".focus") : $();		
	
		if(($focusInMenu.length && $focusInMenu.is(":visible")) || $focusInSubmenu.length){
			
			$focusInSection.removeClass("focus").find(".focus2").removeClass("focus2");
			$(document.getElementById("full-catalogue-button")).removeClass("focus");
			
			Navigation.setClassFocus($focusInMenu.length ? $focusInMenu : $focusInSubmenu);
			
		}else{
			Navigation.setClassFocus($(document.getElementById("full-catalogue-button")));
		}
	
	// Si je suis dans Disney
	}else if([Section.sections[1]].indexOf(Section.name) !== -1 && Section.rubric === Section.rubrics[Section.name][1]){
		// log("handleReturnButton dans Disney");
		
		var $movieBtn = $(document.getElementById("rubrics-list-menu")).children(".selected");
		if($movieBtn.length){
			actionList[$movieBtn[0].id].enter($movieBtn);
		}
		if(Navigation.getElFocused().parent().parent().attr('id') !== "main-menu"){
			Navigation.setFocusToSubmenu();
		}
	
	// Si je suis dans la Grid pour Search
	}else if(Section.name === Section.sections[1] && Section.rubric === "fullgrid"){
		// log("handleReturnButton dans la grid Search");
		
		var $searchBtn = $(document.getElementById("rubrics-list-menu")).children(".selected");
		if($searchBtn.length){
			actionList[$searchBtn[0].id].enter($searchBtn);
		}
	
	// Si je suis dans la Homepage
	}else /*if(Section.name === Section.sections[0])*/{
		// log("handleReturnButton dans la Homepage");
		Main.exit();
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Reverts to the previous template
 * @param {Integer} time The playback current time
 */

Navigation.goBack = function(time){
	var itWasPlayerSection = Section.name === Section.sections[9];
	this.goBack.resetData();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Resets the data of the previous template
 */

Navigation.goBack.resetData = function(){
	
	if(Settings.backToPlayerFromSettings && $("body").hasClass("sm settings")){
		Section.launchPlayerFromSettings();
		
	}else if(Section.oldClass.length){
		$("body").attr("class", Section.oldClass[Section.oldClass.length-1]);
		Section.oldClass.pop();
	}
};

Navigation.moveSelecteur = function(Obj){
	//log("moveSelecteur start; Obj = "+Obj.innerHTML);
	try {
		if (!$(Obj).length) {
			Obj = document.getElementById(Obj);
		}

		var Obj_ref = Obj;
		var absoluteLeft = 0;
		var absoluteTop = 0;
		while (Obj_ref && Obj_ref.tagName !== 'body') {
			absoluteLeft += Obj_ref.offsetLeft;
			absoluteTop += Obj_ref.offsetTop;
			Obj_ref = Obj_ref.offsetParent;
		}
		
		Obj.focus();
	} catch (err) {
		log("Une erreur est survenue...");
	}
};