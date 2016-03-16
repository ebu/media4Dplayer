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
		"add-remove-fav",			// 14
		"full-synopsis",			// 15
		"settings-interface",		// 16
		"settings-subtitles",		// 17
		"settings-ls",						// 18
		"settings-font-size",				// 19
		"settings-subtitles-font-family",	// 20
		"settings-subtitles-color",			// 21
		"settings-subtitles-bgcolor",		// 22
		"settings-subtitles-pip",			// 23
		"in-construction",					// 24
		"share-on-social-network",			// 25
		"settings-audio",					// 26
		"settings-interface-theme",			// 27
		"settings-audio-spatialisation-mode",
		"settings-audio-comments-spatialisation",
		"settings-audio-dialogues-spatialisation"],

	"rubrics": {
		"settings":["interface","audio","subtitles","ls"],
		"playlist":["favorites","signets","history","related"]
	},
	"rubric": null,
	"template": "",
	"oldClass":[],
	"oldClassBeforeSetings":[],
	"oldSelectionInMenu":null
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
			
		// Le player
		}else if(newSection === this.sections[12]){
			this.change.toPlayer(mixed_var);
			
		// Ecran "en construction"
		}else if(newSection === this.sections[24]){
			this.change.toInConstructionScreen();
		
		// SM - Les options d'une appli : Mes vidéos, recherche, réglages et mon profil
		}else if(newSection === this.sections[5]){
			this.change.toAppOptions(newSection, mixed_var);
		
		// SM - Les options de "Mes vidéos" : Mes vidéos favorites, mes signets, mon historique
		}else if(newSection === this.sections[6]){
			this.change.toMyVideosOptions(newSection);
			
		// SM - Le menu réglages : Audio, interface, sous-titres, langue des signes
		}else if(newSection === this.sections[8]){
			this.change.toSettingsMenu();
		
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
			
		// SM - Le menu réglages de l'audio : mode de spatialisation, spatialisation des commentaires et dialogues
		}else if(newSection === this.sections[26]){
			this.change.toSettingsAudioMenu();
			
		// SM - Le menu réglages de l'interface : Taille de texte
		}else if(newSection === this.sections[16]){
			this.change.toSettingsInterfaceMenu();
			
		// SM - Le menu réglages des sous-titres : Audio, interface, sous-titres, langue des signes
		}else if(newSection === this.sections[17]){
			this.change.toSettingsSubtitlesMenu();
			
		// SM - Les réglages du positionnement de la LS
		}else if(newSection === this.sections[18]){
			this.change.toSettingsLS();
			
		// SM - Le choix de la taille des polices
		}else if(newSection === this.sections[19]){
			this.change.toSettingsFontSize();
			
		// SM - Le choix de la police de caractère pour les sous-titres
		}else if(newSection === this.sections[20]){
			this.change.toSettingsFontFamily();
			
		// SM - Le choix de la couleur des sous-titres
		}else if(newSection === this.sections[21]){
			this.change.toSettingsSubtitlesColor();
			
		// SM - Le choix de la couleur d'arrière plan des sous-titres
		}else if(newSection === this.sections[22]){
			this.change.toSettingsSubtitlesBGColor();
			
		// SM - Les réglages du positionnement des sous-titres
		}else if(newSection === this.sections[23]){
			this.change.toSettingsSubtitlesPIP();
			
		// SM - Les réglages du mode de spatialisation
		}else if(newSection === this.sections[28]){
			this.change.toSettingsAudioSpatialisationMode();
			
		// SM - Les réglages de la spatialisation des commentaires
		}else if(newSection === this.sections[29]){
			this.change.toSettingsAudioCommentsSpatialisation();
			
		// SM - Les réglages de la spatialisation des dialogues
		}else if(newSection === this.sections[30]){
			this.change.toSettingsAudioDialoguesSpatialisation();
			
		}else{
			this.change.toInConstructionScreen();
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
	Section.oldClass = [];
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
	
	// TEMPORAIRE
	if(rubric && rubric !== Section.rubrics[newSection][0]){
		Section.change(Section.sections[24]);
		return;
	}
	
	Apps.programs.load(index, {onSuccess:function(){
		Section.save();
		Section.addClass("app-playlists");
		Section.handleMenuSel(newSection);
	}, onError:function(){
		Section.change(Section.sections[24]);
	}}, rubric);
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toEPG = function(newSection, data){
	Dashboard.load(data, function(){
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

Section.change.toPlayer = function(data){
	if(typeOf(data) === "object" && typeOf(data.video) === "object" && data.video.links.dataMain && data.video.links.dataMain.url){
		
		Dashboard.data = data;
		
		Player.load(data.video, function(){
			Section.save();
			Section.addClass("player");		
		});
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the video player
 * @param {String} newSection The name of the new section
 * @param {Integer} rubric The rubric's name of the section
 * @param {Object} params Contains parameters that will be used for the loading of section
 */

Section.change.toInConstructionScreen = function(){
	Section.save();
	Section.addClass("in-construction");
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
	$(document.getElementById("app-title")).html('<span tabindex="1" class="selectable-by-chromevox">'+title+'</span>');
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
	$(document.getElementById("my-videos-options-container")).children("h1").html('<span tabindex="1" class="selectable-by-chromevox">Mes vidéos '+title+'</span>');
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
		
		Dashboard.data = params.data;
		
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
	var data = Dashboard.data;
	
	Section.save();
	var title = data.subtitle ? data.title+' : '+data.subtitle : data.title;
	$(document.getElementById("epg-fiche-container-sm")).children("h1").html('<span tabindex="1" class="selectable-by-chromevox">Fiche de programme</span>').end()
		.children("h2").html('<span tabindex="2" class="selectable-by-chromevox">'+title+'</span>');
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
	
	Dashboard.generateFullscreenSynopsis();
	
	Section.save();
	Section.addClass("full-synopsis");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toSettingsMenu = function(){
	Section.save();
	Section.addClass("settings");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toSettingsAudioMenu = function(){
	Section.save();
	Section.addClass("settings-audio-menu");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toSettingsInterfaceMenu = function(){
	Section.save();
	Section.addClass("settings-interface-menu");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toSettingsSubtitlesMenu = function(){
	Section.save();
	Section.addClass("settings-subtitles-menu");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toSettingsLS = function(){
	Settings.init.ls();
	Section.save();
	Section.addClass("settings-ls");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toSettingsFontSize = function(){
	Settings.init.interface.fontSize();
	Section.save();
	Section.addClass("settings-font-size");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toSettingsFontFamily = function(){
	Settings.init.subtitles.fontFamily();
	Section.save();
	Section.addClass("settings-subtitles-font-family");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toSettingsSubtitlesColor = function(){
	Settings.init.subtitles.color();
	Section.save();
	Section.addClass("settings-subtitles-color");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toSettingsSubtitlesBGColor = function(){
	Settings.init.subtitles.BGColor();
	Section.save();
	Section.addClass("settings-subtitles-bgcolor");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toSettingsSubtitlesPIP = function(){
	Settings.init.subtitles.pip();
	
	Settings.init.subtitles();
	
	Section.save();
	Section.addClass("settings-subtitles-pip");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toSettingsAudioSpatialisationMode = function(){
	Settings.init.audio.spatialisationMode();
	Section.save();
	Section.addClass("settings-audio-spatialisation-mode");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toSettingsAudioCommentsSpatialisation = function(){
	$(document.getElementById("settings-audio-spatialisation-sm-container")).children("h1").html('<span tabindex="1" class="selectable-by-chromevox">Spatialisation des commentaires</span>');
	
	Settings.init.audio.elevationLevel($(document.getElementById("elevation-lvl-sm")), getHtmlStorage("commentsElevationLevel") || Player.commentsElevationLevel, "commentary");
	Settings.init.audio.azim($(document.getElementById("orientation-sm")), getHtmlStorage("commentsAzim") || Player.commentsAzim, "commentary");
	Settings.init.audio.distance($(document.getElementById("distance-sm")), getHtmlStorage("commentsDistance") || Player.commentsDistance, "commentary");
	
	Section.save();
	Section.addClass("settings-audio-spatialisation");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toSettingsAudioDialoguesSpatialisation = function(){
	$(document.getElementById("settings-audio-spatialisation-sm-container")).children("h1").html('<span tabindex="1" class="selectable-by-chromevox">Spatialisation des dialogues</span>');
	
	Settings.init.audio.elevationLevel($(document.getElementById("elevation-lvl-sm")), getHtmlStorage("commentsElevationLevel") || Player.commentsElevationLevel, "dialogues");
	Settings.init.audio.azim($(document.getElementById("orientation-sm")), getHtmlStorage("dialoguesAzim") || Player.dialoguesAzim, "dialogues");
	Settings.init.audio.distance($(document.getElementById("distance-sm")), getHtmlStorage("dialoguesDistance") || Player.dialoguesDistance, "dialogues");
	
	Section.save();
	Section.addClass("settings-audio-spatialisation");
};

Section.addClass = function(className){
	var cn = Main.simplifiedMode ? "sm " + className : className;
	$("body").attr("class", cn);
	
	Navigation.setFocusToFirstItem();
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

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Section.launchPlayerLoading = function(data){
	this.change(this.sections[12], null, data);		
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Section.launchSettingsFromPlayer = function(){
	Player.resetPlayers();
	InfoBanner.progressBar.reset();
	
	Settings.backToPlayerFromSettings = true;
	
	this.oldSelectionInMenu = $(document.getElementById("menu")).children(".sel");
	this.oldClassBeforeSetings = JSON.parse(JSON.stringify(this.oldClass));
	this.change(Section.sections[Main.simplifiedMode?8:4]);
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Section.launchPlayerFromSettings = function(){
	this.launchPlayerLoading(Dashboard.data);
	
	Settings.backToPlayerFromSettings = false;
	this.oldClass = this.oldClassBeforeSetings;
	this.oldClassBeforeSetings = [];
	
	if($(this.oldSelectionInMenu).length){
		$(this.oldSelectionInMenu).addClass("sel").siblings(".sel").removeClass("sel");
	}
	this.oldSelectionInMenu = null;
};