var Section = {
	"dontSaveThisSection":false,
	"name": null,
	"className":"",
	"sections": [
		"profils",					// 0
		"apps-list",				// 1
		"app-playlists",			// 2
		"epg-fiche",				// 3
		"settings",					// 4
		
		"app-options",				// 5
		"my-videos-options",		// 6
		"search-btn",				// 7
		"settings-btn",				// 8
		"profil-btn",				// 9
		"playlist",					// 10
		"playlist-options",			// 11
		"player",					// 12
		"program-options",			// 13
		"add-remove-fav",
		"full-synopsis"],

	"rubrics": {
		"settings":["interface","audio","subtitles","ls"],
		"playlist":["favorites","signets","history","related"]
	},
	"rubric": null,
	"template": "",
	"oldTemplate": [],
	"oldName": [],
	"oldRubric": [],
	"oldClass":[]
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of another section
 * @param {String} newSection The name of the new section
 * @param {String} rubric The rubric's name of the section
 * @param {Various} mixed_var Parameters that will be used for the loading of section
 * @param {jQuery Object} $item The current focused element
 */

Section.change = function(newSection, rubric, mixed_var, $item){
	if(this.sections.indexOf(newSection) !== -1){
		
		// La liste des profils
		if(newSection === this.sections[0]){
			this.change.toProfils(newSection);
		
		// Liste des apps
		}else if(newSection === this.sections[1]){
			this.change.toAppsList(newSection);
		
		// Les playlist
		}else if(newSection === this.sections[2]){
			this.change.toAppPlaylist(newSection, rubric, mixed_var);
		
		// Fiche EPG
		}else if(newSection === this.sections[3]){
			this.change.toEPG(newSection, mixed_var);
		
		// Settings
		}else if(newSection === this.sections[4]){
			this.change.toSettings(newSection, rubric, mixed_var);
		
		// SM - Les options d'une appli : Mes vidéos, recherche, réglages et mon profil
		}else if(newSection === this.sections[5]){
			this.change.toAppOptions(newSection, mixed_var);
		
		// SM - Les options de "Mes vidéos" : Mes vidéos favorites, mes signets, mon historique
		}else if(newSection === this.sections[6]){
			this.change.toMyVideosOptions(newSection);
		
		// SM - Mes vidéos favorites / signets / historiques : la liste des programmes
		}else if(newSection === this.sections[10]){
			this.change.toAppPlaylist(newSection, rubric, Apps.indexAppInSM);
		
		// SM - Les options d'une playlist : Lire la vidéo, accéder à la fiche, supprimer des favoris
		}else if(newSection === this.sections[11]){
			this.change.toPlaylistOptions(mixed_var);
		
		// SM - Les options d'un programme : accéder à la vidéo, mettre en favoris, lire le résumé, les vidéos sur le même thème, partager sur les réseaux
		}else if(newSection === this.sections[13]){
			this.change.toProgramOptions();
		
		// SM - Le synopsis en fullscreen
		}else if(newSection === this.sections[15]){
			this.change.toFullscreenSynopsis();
		}
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the settings section
 * @param {String} newSection The name of the new section
 * @param {Integer} rubric The rubric's name of the section
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toProfils = function(){
	json.cache = {};
	Section.addClass("profils-list");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toAppsList = function(){
	Apps.load(function(){
		Section.addClass("apps-list");
	});
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toAppPlaylist = function(newSection, rubric, index){
	
	if(Main.simplifiedMode && !rubric){
		return;
	}
	
	Apps.programs.load(index, function(){
		Section.save();
		Section.addClass("app-playlists");
		Section.handleMenuSel(newSection);
	}, rubric);
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toEPG = function(newSection, data){
	Dash.load(data, function(){
		Section.addClass("epg-fiche");
	});	
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toSettings = function(newSection, rubric){
	Settings.init(newSection, rubric);
	Section.handleMenuSel(newSection);
	Section.addClass("settings");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the video player
 * @param {String} newSection The name of the new section
 * @param {Integer} rubric The rubric's name of the section
 * @param {Object} params Contains parameters that will be used for the loading of section
 */

Section.change.toPlayer = function(newSection, rubric, params){
	if(rubric && typeOf(params) === "object" && typeOf(params.list) === "array" && params.list.length){
		
		Player.load(params.list, {onSuccess:function(){
			Section.prepare(newSection, null, rubric);
			
		}, onError:function(){
			// TODO: affichage d'une popup d'erreur
		}}, rubric);
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toAppOptions = function(newSection, index){
	Apps.indexAppInSM = index;
	var title = Apps.list[index].title;
	$(document.getElementById("app-title")).html(title);
	$(document.getElementById("my-videos-btn")).children().html("Mes vidéos " + title);
	Section.addClass("app-options");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toMyVideosOptions = function(newSection, $item){
	Section.save();
	
	var title = Apps.list[Apps.indexAppInSM].title;
	$(document.getElementById("my-videos-options-container")).children("h1").html("Mes vidéos " + title);
	Section.addClass("my-videos-options");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toPlaylistOptions = function(params){
	
	var rubrics = Section.rubrics[Section.sections[10]];
	var className = params.type === rubrics[0] ? "options-favorites" : params.type === rubrics[1] ? "options-signets" : params.type === rubrics[2] ? "options-history" : null;
	if(className){
		
		Dash.data = params.data;
		
		Section.save();
		Section.addClass(className);
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toProgramOptions = function(){
	var data = Dash.data;
	
	Section.save();
	$(document.getElementById("epg-fiche-container-sm")).children("h1").html(data.title).end().children("h2").html(data.subtitle);
	$(document.getElementById("add-remove-to-favorites")).children("a").html(Apps.programs.playlistType === Section.rubrics[Section.sections[10]][0] ? "Supprimer des favoris" : "Mettre en favoris");
	Section.addClass("epg-fiche");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toFullscreenSynopsis = function(){
	
	Dash.generateFullscreenSynopsis();
	
	Section.save();
	Section.addClass("full-synopsis");
};

Section.addClass = function(className){
	var cn = Main.simplifiedMode ? "sm " + className : className;
	$("body").attr("class", cn);
};

Section.save = function(){
	this.oldClass.push($("body").attr("class"));
};

Section.handleMenuSel = function(newSection){
	
	if(!Main.simplifiedMode){
		var $nav = $(document.getElementById("menu"));
		$nav.children(".sel").removeClass("sel");

		switch(newSection){
			case this.sections[2]:
				$nav.children(".app-playlists").addClass("sel");
				break;

			case this.sections[4]:
				$nav.children(".settings").addClass("sel");
				break;
		}		
	}
};