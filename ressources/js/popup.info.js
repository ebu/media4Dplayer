
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Resets the info popup
 */

Popup.info.reset = function(){
	
	clearTimeout(Player.timeouts.toStopLoading);
	
	$(document.getElementById("info")).empty();
	$(document.getElementById("info-popup")).find(".focus").removeClass("focus").end()
		.find(".button-container").empty();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Shows the info popup
 * @param {Object} params Contains parameters used to display the popup
 */

Popup.info.show = function(params){
	if(typeOf(params) === "object" && typeOf(params.titleAndMsg) === "array" && params.titleAndMsg){
		
		var $popup = $(document.getElementById("info-popup"));
		
		// Réinitialise la popup
		this.reset();
		
		// Insère le titre
		$popup.find(".title-container .title").text(params.titleAndMsg[0]||"");
		
		// Insère le message
		$(document.getElementById("info")).append(params.titleAndMsg[1]);
		
		// Affiche la popup
		Popup.show($popup);
		
		// Insère les boutons
		if(typeOf(params.buttons) === "array" && params.buttons.length){
			var leftAction = function(me){
					Navigation.setClassFocusToPrevOrNextItem(me, "left");
				},
				rightAction = function(me){
					Navigation.setClassFocusToPrevOrNextItem(me, "right");
				};
				
			var $btnContainer = $(document.getElementById("info-popup")).find(".button-container");
			var i, l = params.buttons.length, button, $button, id;
			for(i=0;i<l;i++){
				
				button = params.buttons[i];
				if(typeOf(button) === "object"){

					id = "button-"+(i+1)+"-info-popup";
					$button = $('<div id="'+id+'" class="btn btn-style-1"><span>'+button.title+'</span></div>');

					actionList[id] = {
						left:leftAction,
						right:rightAction,
						enter:button.onClick
					};
					
					$btnContainer.append($button);
				}
			}
		}
		
		// Action sur le bouton BACK
		this.onBack = params.onBack;
		
		// Donne le focus au 1er bouton
		Navigation.setClassFocus($btnContainer.children(".btn:first-child"));
	}
};