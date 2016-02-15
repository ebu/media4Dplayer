var Section = {
	"dontSaveThisSection":false,
	"name": null,
	"className":"",
	"sections": ["profils","apps-list","app-playlists","epg-fiche","settings"],

	"rubrics": {
		"settings":["interface","audio","subtitles","ls"]
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
			this.change.toAppPlaylist(newSection, mixed_var);
		
		// Fiche EPG
		}else if(newSection === this.sections[3]){
			this.change.toEPG(newSection, mixed_var);
		
		// Fiche EPG
		}else if(newSection === this.sections[4]){
			this.change.toSettings(newSection, rubric, mixed_var);
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
	$("body").attr("class","profils-list");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toAppsList = function(){
	$("body").attr("class","apps-list");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toAppPlaylist = function(newSection, mixed_var){
	$("body").attr("class","app-playlists");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the login section
 * @param {String} newSection The name of the new section
 * @param {Object} callbackList Contains a success and error callback
 * @param {jQuery Object} $item The current focused element
 */

Section.change.toEPG = function(newSection, mixed_var){
	$("body").attr("class","epg-fiche");
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
	$("body").attr("class","settings");
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
 * @description Initializes variables then launches the good template's loading
 * @param {String} name The name of the section to load
 * @param {Function} callback_function The function which will be triggered after initializing of the section
 * @param {String} rubric The rubric's name of the section to load
 * @param {Various} mixed_var Parameters that will be used to load the section
 */

Section.prepare = function(name, callback_function, rubric, mixed_var){
	if(name && this.sections.indexOf(name) !== -1){
				
		// Pour pouvoir revenir facilement à l'écran précédent avec le bouton retour (présent uniquement sur la fiche film et la touche back quand c'est une playlist de vidéos d'un film)
		this.handleEnvSaving(name, rubric);
		
		this.template = $(document.getElementById(this.getTemplateID(name, rubric)));
		if(this.template.length){
			
			// Réinitialise le template
			this.init(name, rubric, mixed_var);
			
			// Affiche ce template et masque les autres
			this.show();
			
			// Mémorise le nom de la section actuelle
			this.name = name;
			this.rubric = rubric;
			
			if(typeof callback_function === "function"){
				callback_function();
			}
			
		}else{
			log("Erreur : Cette section ne corresponds à aucun template / template indisponible");
		}
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Returns the template ID
 * @param {String} name The name of the section to load
 * @param {String} rubric The rubric's name of the section to load
 * @return {String} The template ID
 */

Section.getTemplateID = function(name, rubric){
	var ids = ["profils-list-container","apps-list-container"];
	var sections = {};
	sections[this.sections[0]] = ids[0];
	sections[this.sections[1]] = ids[1];
	
	return sections[name];
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Manages the backup of the current section
 * @param {String} name The name of the section to load
 * @param {String} rubric The rubric's name of the section to load
 */

Section.handleEnvSaving = function(name, rubric){
	if(this.dontSaveThisSection){
		this.dontSaveThisSection = false;
		
	}else if(this.mustSaveSection(name, rubric)){

		if(this.template){
			this.oldTemplate.push(this.template);
		}

		if(this.name){
			this.oldName.push(this.name);
			this.oldRubric.push(this.rubric);
		}

		if(Navigation.currentEl){
			Navigation.oldEl.push(Navigation.currentEl);
		}
		
	}else{
		this.eraseSectionInfo();
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Deletes old section's data
 */

Section.eraseSectionInfo = function(){
	this.template = this.name = null;
	this.oldTemplate = [];
	this.oldName = [];
	this.oldRubric = [];
	Navigation.oldEl = [];
	
	if(!Popup.isOpen){
		Navigation.currentEl = null;
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Determines and returns if the save of current section is necessary
 * @param {String} name The name of the new section
 * @param {String} rubric The rubric's name of the section to load
 * @return {Boolean} Returns true if the save of current section is necessary. False otherwise
 */

Section.mustSaveSection = function(name, rubric){
	
	if(!this.name){
		return false;
	}
	
	// Si on lance le player
	if(name === this.sections[9] && rubric === this.rubrics[name][1]){
		return true;
	}
	
	// Si on lance la dashboard
	if([this.sections[7], this.sections[8]].indexOf(name) !== -1){
		return true;
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the template
 * @param {String} name The name of the section to load
 * @param {String} rubric The rubric's name of the section to load
 * @param {Various} mixed_var Parameters that will be used to load the section
 */

Section.init = function(name, rubric, mixed_var){
	if($(this.template).length && name){
		if(!Popup.isOpen){
			Navigation.currentEl = null;
		}
		
		switch(name){
			case this.sections[0]:
				this.init.home(mixed_var);
				break;
				
			case this.sections[1]:
				this.init.moviesScreen(rubric, mixed_var);
				break;
				
			case this.sections[2]:
				this.init.seriesScreen(rubric, mixed_var);
				break;
				
			case this.sections[4]:
				this.init.searchScreen(mixed_var);
				break;
				
			case this.sections[5]:
				this.init.settings(rubric, mixed_var);
				break;
				
			case this.sections[6]:
				this.init.loginScreen(mixed_var);
				break;
				
			case this.sections[7]:
			case this.sections[8]:
				this.init.dashboardScreen();
				break;
				
			case this.sections[9]:
				this.init.playerScreen();
				break;
				
			case this.sections[10]:
				this.init.watchListScreen(rubric, mixed_var);
				break;
				
			case this.sections[11]:
				this.init.kidsScreen(rubric, mixed_var);
				break;
				
			default:
				break;
		}
		
		// Ajout d'une class pour les sections qui sont en fullscreen
		this.init.addClassName((0) ? "fullscreen" : "");
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Replaces the body class
 * @param {String} className The new class of the body
 */

Section.init.addClassName = function(className){
	$("body").attr("class", className);
	Section.className = className;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the homepage
 * @param {Object} params Contains parameters used to initialize the section
 */

Section.init.home = function(params){
	
	// Donne le class selected au bon bouton
	Menu.getSelected().removeClass("selected");
	$(params.$item).addClass("selected");	
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes settings section
 * @param {String} rubric The rubric's name of the section to load
 * @param {Object} params Contains parameters used to initialize the section
 */

Section.init.settings = function(rubric, params){
	
	if(rubric){
		$(params.$item).addClass("selected").siblings(".selected").removeClass("selected");
	}else{
		// Donne le class selected au bon bouton
		Menu.getSelected().removeClass("selected");
		$(params.$item).addClass("selected");
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the login section
 * @param {Object} params Contains parameters used to initialize the section
 */

Section.init.loginScreen = function(params){
	
	// Mémorise les callback de succès et d'erreur
	Login.callback = params.callbackList;
	
	// Vide les champs email et password
	Login.email = "";
	Login.password = "";
	$(document.getElementById("email-button")).children(".inputText").text(LANG.getStr("email"));
	$(document.getElementById("password-button")).children(".inputText").text(LANG.getStr("password"));
	
	// Supprime les focus
	$(document.getElementById("content-login")).find(".focus").removeClass("focus");
	
	// Masque le loader
	Login.hideLoader();
	
	// Donne le class selected au bon bouton
	Menu.getSelected().removeClass("selected");
	$(params.$item).addClass("selected");
	
	// Masque le bouton Submit
	$(document.getElementById("validate-login-button")).hide();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the watchlist section
 * @param {String} rubric The rubric's name of the section to load
 * @param {Object} params Contains parameters used to initialize the section
 */

Section.init.watchListScreen = function(rubric, params){
	
	if(rubric){
		$(params.$item).addClass("selected").siblings(".selected").removeClass("selected");
	}else{
		// Donne le class selected au bon bouton
		Menu.getSelected().removeClass("selected");
		$(params.$item).addClass("selected");
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the home for the movies section
 * @param {String} rubric The rubric's name of the section to load
 * @param {Object} params Contains parameters used to initialize the section
 */

Section.init.moviesScreen = function(rubric, params){
	
	if(rubric){
		if($(params.$item).length){
			$(params.$item).addClass("selected").siblings(".selected").removeClass("selected");
			
			if(rubric === "fullgrid"){
				Navigation.setClassFocus(Menu.getSelected());			
			}
		}else if(Section.isDisney){
			$(document.getElementById("full-catalogue-button")).removeClass("focus");
			Navigation.setFocusToSubmenu();
		}else{
			$(document.getElementById("full-catalogue-button")).removeClass("focus");
			Navigation.setClassFocus(Menu.getSelected());
		}
		
	}else{
		// Donne le class selected au bon bouton
		Menu.getSelected().removeClass("selected");
		$(params.$item).addClass("selected");
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the home for the series section
 * @param {String} rubric The rubric's name of the section to load
 * @param {Object} params Contains parameters used to initialize the section
 */

Section.init.seriesScreen = function(rubric, params){
	
	if(rubric){
		if($(params.$item).length){
			$(params.$item).addClass("selected").siblings(".selected").removeClass("selected");
		}else{
			$(document.getElementById("full-catalogue-button")).removeClass("focus");
			//Navigation.setClassFocus(Menu.getSelected());
		}
	}else{
		// Donne le class selected au bon bouton
		Menu.getSelected().removeClass("selected");
		$(params.$item).addClass("selected");
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the player section
 */

Section.init.playerScreen = function(){
    if (Player.playlistTrailerActive) {
        Navigation.setClassFocus($(document.getElementById("home-button")));
    }
    else {
        Navigation.setClassFocus($(document.getElementById("pause-play-video-player-button")));
    }
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the dashboard section
 */

Section.init.dashboardScreen = function(){
	$focusInMenu = $(document.getElementById("menu")).find(".focus");
	if($focusInMenu.length && Section.name !== Section.sections[11]){
		$focusInMenu.removeClass("focus");
	}
	Navigation.setClassFocus($(document.getElementById("dashboard-buttons-container")).children(":visible:first"));
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the kids section
 * @param {String} rubric The rubric's name of the section to load
 * @param {Object} params Contains parameters used to initialize the section
 */

Section.init.kidsScreen = function(rubric, params){
	if(rubric){
		if($(params.$item).length){
			$(params.$item).addClass("selected").siblings(".selected").removeClass("selected");
		}else{
			$(document.getElementById("full-catalogue-button")).removeClass("focus");
		}
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the search section
 * @param {Object} params Contains parameters used to initialize the section
 */

Section.init.searchScreen = function(params){
	
	var $loader = $(document.getElementById("search-loader-container")).hide();
	
	// Donne le class selected au bon bouton
	Menu.getSelected().removeClass("selected");
	$(params.$item).addClass("selected");
	
	var _afterValidate = function(input){
		Navigation.blockNavigation = true;
		
		$loader.show();
		
		var _afterCloseErrorPopup = function(){
			Popup.hideAll();
			Popup.keyboard.show(_afterValidate, null, true, params.$item, false, decodeURIComponent(input));
		};
		
		input = encodeURIComponent(input);
        var url = Config.versions[Config.version].domain + "mediaCatalog/titles/?byTags=series|movies" +
            '&byQuery=(title:' + input + '* ^2)+OR+title.loose:"' + input + '"^4+OR+description:"' + input + '"+OR+credits.personName.caseInsensitive:"' + input + '"^4';
            
		var lang = LANG.codeLang !== 'en' ? LANG.getLanguagePath() : '';
        json.load({
            url: url + "&page=1&pageSize=40" + lang + getParentalControlFilter(),
            callback: function(data, xhr){
				
				$loader.hide();
                Navigation.blockNavigation = false;
				
                if (data.titles.length > 0) {

                    Section.change("movies", "fullgrid", {
                        fullCatalogue: true,
                        searchQuery: input,
                        data: data,
                        xhr: xhr,
						url:url
                    }, params.$item);
					
                }else{
					
                    Popup.info.show({
                        titleAndMsg: ["", LANG.getStr(LANG.langData.noContentFor) + decodeURIComponent(input)],
                        onBack: null,
                        buttons: [{
                            title: LANG.getStr("ok"),
                            onClick: _afterCloseErrorPopup
                        }]
                    });
                }
            },
            onError: function(xhr){
                log('Problème de connexion lors de la requête search GET => xhr.responseText() = ' + (xhr ? xhr.responseText : ""));
				$loader.hide();
                Navigation.blockNavigation = false;
                Popup.info.show({
                    titleAndMsg:["", LANG.langData.errors.genericError],
                    onBack: null,
                    buttons: [{
                        title: LANG.getStr("ok"),
                        onClick: _afterCloseErrorPopup
					}]
                });
            }
        });
    };
	
    Popup.keyboard.show(_afterValidate, null, true, params.$item);
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Displays the template, then hides the splashscreen (if present)
 */

Section.show = function(){
	// Affiche le template
	if($(this.template).length){
		this.template.siblings(".section").hide();
		
		if(this.template[0].id !== "info-banner-section-name-and-arrow-container"){
			this.template.show();
		}
	}
	
	// Masque le splashscreen si présent
	Main.hideSplashScreen();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Hides the current template, then launches a callback function
 * @param {Function} callback A callback function to execute after masking of the template
 * @param {String} nextSection The next section's name
 */

Section.hide = function(callback, nextSection){
	
	// Ferme le sous-menu si elle n'est plus nécessaire à la prochaine section
	if(this.sectionsWithSubmenu.indexOf(this.name) !== -1 && this.sectionsWithSubmenu.indexOf(nextSection) === -1){
		Submenu.hide();
	}
	
	Grid.hide();
	Home.hide();
	
	if(this.name === this.sections[11]){
		Home.hide();
		Grid.hide();
		
		// Ne doit pas réafficher le menu si on va dans la dashboard
		if([this.sections[7], this.sections[8], this.sections[11]].indexOf(nextSection) === -1){
			Menu.hideKidsMenu();
		}
	}
	
	if(this.name === this.sections[4]){
		Popup.hideAll();
	}
	
	if(typeof callback === "function"){
		callback();
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Hides the current rubric, then launches a callback function
 * @param {Function} callback A callback function to execute after masking of the rubric
 */

Section.hideRubric = function(callback){
	
	if([this.sections[1], this.sections[2]].indexOf(this.name) !== -1){
		if(this.rubric){
			Grid.hide();
		}else{
			Home.hide();
		}
	}
	
	if(typeof callback === "function"){
		callback();
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches the loading of the dashboard according the media type
 * @param {Object} dataEl The media data
 */

Section.launchDashboard = function(dataEl){
	var sectionToLoad = this.getSectionNameForDashboard(dataEl);
	if(sectionToLoad){
		this.change(sectionToLoad, null, dataEl);
		
	}else if(dataEl.type === "season"){
		Dash.collections.showEpisodes(dataEl.season);
		
	}else if(dataEl.type === "back to saisons list"){
		Collections.$container.replaceWith(Dash.collections.$seasons);
		Collections.$container = $(document.getElementById("dashboard-collections"));
		Dash.collections.$seasons = null;
		
		Collections.$container.off("mouseover");
		Collections.$container.off("click");
		
		Navigation.initMouse.mouseOverEvent(Collections.$container, ".collection div.arrow", "focus3", {focus2:".collection",focus:Collections.$container});
		Navigation.initMouse.clickEvent(Collections.$container, ".collection div.arrow");

		Navigation.initMouse.mouseOverEvent(Collections.$container, ".collection div.item", "focus3", {focus2:".collection",focus:Collections.$container});
		Navigation.initMouse.clickEvent(Collections.$container, "div.item");
		Navigation.initMouse.clickEvent(Collections.$container, "div.arrow");
		
		Dash.collections.show();
		
		// Le clique sur le bouton All seasons réaffiche la fiche série
		if(Dash.type !== Dash.types[1]){
			actionList["return-button-dashboard"].enter();
		}
		
	}else if(dataEl.type === "Episodes"){
		
		if($(document.getElementById("dashboard")).css("display") === "block"){
			
			Navigation.blockNavigation = true;
			Dash.showLoader();
		
			if(User.data && User.data.isConnected){
				API.getMediaLists(User.data.uid, {headers:{Authorization:'Bearer ' + User.data.accessToken}}, function(data, jqXHR){
					if(typeOf(data) === "array"){

						// Récupère les ID des listes (utile pour l'ajout/suppression de la liste)
						if(!User.mediaListsId){
							getMediaListsID(data);
						}

						Dash.showEpisode(dataEl);
					}else{
						Dash.showEpisode(dataEl);
					}
				});
			}else{
				Dash.showEpisode(dataEl);
			}
		}else{
			Section.change("tvseries dashboard", "fromSearchResult", dataEl);
		}
		
	}else{
		log("Le type "+dataEl.type+" n'est pas pris en charge !!!");
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches the loading of the dashboard according the media type
 * @param {Object} dataEl The media data
 */

Section.getSectionNameForDashboard = function(dataEl){
	return ["Movies","Music"].indexOf(dataEl.type) !== -1 ? this.sections[7] : dataEl.type === "Series" ? this.sections[8] : null;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches loading of the submenu, then the first rubric into the list / loads the loading of the requested rubric into the list
 * @param {Object} params Contains parameters used to load the submenu/rubric
 * @param {String} newSection The name of the new section
 * @param {jQuery Object} $item The current focused element
 */

Section.launchSectionContainingSubmenu = function(params, newSection, $item){
	if(params.rubric){
		
		if(params.item && typeOf(params.item.params) === "object"){
			
			Section.hideRubric(function(){
				var requestParams = {
					headers:{Authorization:'Bearer ' + User.data.accessToken},
					context:params.item.params.context
				};
				
				params.loadRubFunc(requestParams, newSection, {onSuccess:function(){
					Section.prepare(newSection, null, params.rubric, {$item:$item});

				}, onErrorLoadRub:params.onError}, params.rubric);
			});
		}
		
	}else{
		
		// Si j'ai pas choisi de rubrique, charge d'abords le sous-menu
		Section.hide(function(){
			Submenu.load(params.submenuUrl, newSection, {onSuccess:function(){
				Section.prepare(newSection, null, null, {$item:$item});
				
				// Provoque un clique sur la 1ère sous-rubrique
				Section.change(newSection, Section.rubrics[newSection][0], null, $(document.getElementById("elements-submenu-1")).children(":first-child"));
				
			}, onError:function(){
				// TODO: affichage d'une popup d'erreur
			}});
			
		}, newSection);
	}
};