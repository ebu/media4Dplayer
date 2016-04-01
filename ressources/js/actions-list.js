
var actionList = {};
	
																	/* ******************/
																	/*	 MODE NORMAL	*/
																	/* ******************/
	
$(document.getElementById("menu")).on("click", ".btn", function(){
	var section, sections = Section.sections, classList = $(this).attr("class"), mixed_var;
	if(classList.indexOf(sections[0]) !== -1){
		section = sections[0];
	
	// La liste des apps
	}else if(classList.indexOf(sections[1]) !== -1){
		section = sections[1];
	
	// Les playlists
	}else if(classList.indexOf(sections[2]) !== -1){
		section = sections[2];
		mixed_var = Apps.programs.appIndex;
	
	// Les settings
	}else if(classList.indexOf(sections[4]) !== -1){
		section = sections[4];
	}
	
	if(section){
		Section.oldClass = [];
		Section.change(section, null, mixed_var, $(this));
	}else{
		Section.change(sections[24]);
	}
});

$(document.getElementById("profils-list")).on("click", ".btn", function(){
	Section.change(Section.sections[1]);
});

$(document.getElementById("apps-list")).on("click", ".app", function(){
	Section.change(Section.sections[2], null, $(this).index());
});

$(document.getElementById("favorites-list")).on("click", ".item-playlist", function(e){
	if(!($(e.target).hasClass("play") || $(e.target).parent().hasClass("play"))){
		Section.save();
		Section.change(Section.sections[3], null, $(this).data("data"));		
	}
});

$(document.getElementById("app-playlists")).on("click", ".item-playlist .play", function(){
	Section.launchPlayerLoading($(this).parents(".btn").data("data"));
});

$("body").on("click", ".back-button, .back-to-home-button, .back", function(){
	Navigation.goBack();
});

$(document.getElementById("settings-menu")).on("click", ".btn", function(){
	var section = Section.sections[4];
	var rubric, rubrics = Section.rubrics[section], classList = $(this).attr("class");
	if(classList.indexOf(rubrics[0]) !== -1){
		rubric = rubrics[0];
		
	}else if(classList.indexOf(rubrics[1]) !== -1){
		rubric = rubrics[1];
		
	}else if(classList.indexOf(rubrics[2]) !== -1){
		rubric = rubrics[2];
		
	}else if(classList.indexOf(rubrics[3]) !== -1){
		rubric = rubrics[3];
	}
	
	if(rubric){
		Section.change(section, rubric);
	}
});

$(".option-font-family").on("click", ".font-family", function(){
	Settings.change.subtitlesFontFamily($(this).css("font-family"));
});

$(".option-background-color").on("click", ".color", function(){
	Settings.change.subtitlesBackgroundColor($(this).data("color"));
});

$(".option-text-color").on("click", ".color", function(){
	Settings.change.subtitlesColor($(this).data("color"));
});

$(document.getElementById("synopsis-container")).on("click", function(){
	Section.change(Section.sections[15]);
});

$(document.getElementById('playerUI')).on('click', function(e){
	if(["pipContainer","playerTopBanner","playerBottomBanner","playerControls","playerControlVolume"].indexOf(e.target.id) !== -1){
		if(!$(document.getElementById("playerBottomBanner")).is(":visible")){
			InfoBanner.show();
		}else{
			InfoBanner.hide();
		}
	}else if($(e.target.id).hasClass(".video-option")){
		InfoBanner.showOptionPopup($(e.target.id), this);
	}else{
		//log("id="+e.target.id);
	}
	
}).on("mouseover", ".btn", function(){
	InfoBanner.launchMaskingAfterDelay();
});

$("body").on("keydown", function(e){
	if(["enter","tab"].indexOf(e.key.toLowerCase()) !== -1 && $(this).hasClass("player") && !$(document.getElementById("playerBottomBanner")).is(":visible")){
		InfoBanner.show();
		InfoBanner.hideOptionDropDownMenu();
		Navigation.moveSelecteur(document.getElementById("playerClose"));
	}
});
	
																	/* **************/
																	/*	 MODE SM	*/
																	/* **************/
	
$(document.getElementById("apps-list-sm")).on("click", ".app:not(.disabled)", function(){
	Section.save();
	Section.change(Section.sections[5], null, $(this).index());
});

$(document.getElementById("app-options")).on("click", ".menu-item", function(){
	var indexes = {"my-videos-btn":6,"search-btn":7,"settings-btn":8,"profil-btn":9};
	Section.change(Section.sections[indexes[this.id]]);
});

$(document.getElementById("my-videos-options")).on("click", ".menu-item", function(){
	var rubric = Section.rubrics[Section.sections[10]][$(this).index()];
	if(rubric){
		Section.change(Section.sections[10], rubric);
	}
});

$(document.getElementById("playlist")).on("click", ".item", function(){
	Section.change(Section.sections[11], null, {type:Apps.programs.playlistType, data:$(this).data("data")});
});

$(document.getElementById("options-favorites")).on("click", ".menu-item", function(){
	if(Dashboard.data){
		var indexes = {"play-video-btn":12,"see-fiche-btn":13,"remove-favorite-btn":14};
		Section.change(Section.sections[indexes[this.id]]);		
	}
});

$(document.getElementById("program-options")).on("click", ".menu-item", function(){
	if(Dashboard.data){
		
		if(this.id === "see-related-content-btn"){
			Section.change(Section.sections[10], Section.rubrics[Section.sections[10]][3]);
		}else{
			var indexes = {"play-video-btn-2":12,"add-remove-to-favorites":14,"see-full-synopsis-btn":15,"share-btn":25};
			Section.change(Section.sections[indexes[this.id]]);			
		}
	}
});

$(document.getElementById("font-family")).on("click", ".menu-item", function(){
	Settings.change.subtitlesFontFamily($(this).children("a").text());
});

$(document.getElementById("spatialisation-options-sm")).on("click", ".menu-item", function(){
	Settings.change.audioSpatialisationMode($(this).data("value"));
});

/* POUR CHROMEVOX */
$("body").on("keydown", ".selectable-by-chromevox", function(e){
	log(e.key);
	var eventName = e.key.toLowerCase();
	if($(this).is(":focus") && eventName === "enter"){
		log("J'ai cliqué sur un item focusé");		
		if(this.click){
			this.click();
		}
		
	}else if($(this).is(":focus") && eventName === "tab"){
		var $current = this, $nextSel;
		
		if($($current).hasClass("optionDropDownMenuButton") && $($current).is(":last-child")){
			var $first = $($current).parent().children(":first-child");			
			if($first.length){
				Navigation.moveSelecteur($first[0]);
			}
			return false;
			
		}else{
		
			$nextSel = $("body .selectable-by-chromevox:visible").filter(function(){
				return this.tabIndex > $current.tabIndex;
			}).eq(0);			
		}
		
		if(!$nextSel.length){
			log("Il n'y a pas d'élément suivant");
			
			var $firstSel = $("body .selectable-by-chromevox:visible").filter(function(){
				return this.tabIndex < $current.tabIndex;
			}).eq(0);
			
			if($firstSel.length){
				Navigation.moveSelecteur($firstSel[0]);
			}
			
			return false;
		}else{
			log("Un élément suivant à été trouvé");
		}
		
	}else if(["arrowup","arrowdown","arrowleft","arrowright"].indexOf(eventName) !== -1){
		if($(this).hasClass("pip-video") && !$(this).data("animation-started")){
			var pip = this;
			var _move = function(position){
				$(pip).data("animation-started", true).clearQueue().finish().animate(position, 250, function(){
					$(pip).data("animation-started", false);
					log("animation done !!!");
				});
			};
			
			var $parent = $(this).parent(), value, moveValue = 5, padding = parseFloat($parent.css("padding").replace("px",""));
			if(eventName === "arrowup") {
				value = (this.offsetTop - moveValue > padding) ? '-='+moveValue : 0;
				_move({top:value});
				
			}else if(eventName === "arrowdown"){
				value = (this.offsetTop + this.offsetHeight + moveValue - padding <= $parent.height()) ? '+='+moveValue : $parent.height() - this.offsetHeight;
				_move({top:value});
				
			}else if(eventName === "arrowleft") {
				value = (this.offsetLeft - moveValue > padding) ? '-='+moveValue : 0;
				_move({left:value});	
				
			}else if(eventName === "arrowright"){
				value = (this.offsetLeft + this.offsetWidth + moveValue - padding <= $parent.width()) ? '+='+moveValue : $parent.width() - this.offsetWidth;
				_move({left:value});
				
			}
		}
	}
	
}).on("click", ".selectable-by-chromevox:not(.final-option)", function(e){
	$("body > .cvox_indicator_container").find(".cvox_indicator_top, .cvox_indicator_middle_nw, .cvox_indicator_middle_ne, .cvox_indicator_middle_sw, .cvox_indicator_middle_se, .cvox_indicator_bottom").removeAttr("style");
	this.blur();
	$(this).mouseout();
	
}).on("focus", "#videoPlayerContainer .selectable-by-chromevox", function(){
	//log("focus déclenché");
	InfoBanner.launchMaskingAfterDelay();
});