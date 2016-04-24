var Navigation = {};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Reverts to the previous template
 * @param {Integer} time The playback current time
 */

Navigation.goBack = function(){
	
	if(Settings.backToPlayerFromSettings && $("body").hasClass("sm settings")){
		Section.launchPlayerFromSettings();
		
	}else if(Section.oldClass.length){
		$("body").attr("class", Section.oldClass[Section.oldClass.length-1]);
		Section.oldClass.pop();
	}
	
	Navigation.setFocusToFirstItem();
};

Navigation.moveSelecteur = function(Obj){
	log("moveSelecteur start; TABINDEX = "+$(Obj).attr("tabindex"));
	try {
		if (!$(Obj).length) {
			Obj = document.getElementById(Obj);
		}
		
		Obj.focus();
	} catch (err) {
		log("Une erreur est survenue...");
	}
};

Navigation.setFocusToFirstItem = function(){
	var $defaultFocus = $("body").find("h1:visible span.selectable-by-chromevox, .back-button:visible span.selectable-by-chromevox, #in-construction:visible .selectable-by-chromevox, #switch-to-simplified-mode-btn.selectable-by-chromevox:visible, .closeBtn:visible, .list-container:visible .selectable-by-chromevox");
	if($defaultFocus.length){
		this.moveSelecteur($defaultFocus[0]);
	}else{
		log("Je n'ai pas trouvé à qui donner le focus par défaut");
	}
};