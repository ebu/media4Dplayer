var Dash = {
	types:["movie","serie","episode"],
	type:null,
	data:null,
	seriesData:null,
	seasons:[],
	nextEpisode: null,
	collections:{
		$seasons:null
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Resets the dashboard
 * @param {String} type The dashboard type
 */

Dash.reset = function(type){
	
	this.seriesData = null;
	this.data = null;
	this.type = type;
	$(document.getElementById("dashboard")).removeClass("episode");
	$(document.getElementById("dashboard-container")).hide();
	
	$(document.getElementById("dashboard-poster")).removeClass(this.types.toString()).addClass(type);
	
    $(document.getElementById("dashboard-poster")).removeAttr("src");
    $(document.getElementById("dashboard-title")).empty();
	$(document.getElementById("dashboard-media-details")).empty();
    $(document.getElementById("dashboard-genre")).empty();
	$(document.getElementById("dashboard-languages-and-subtitles-container")).find("span.value").empty();
	$(document.getElementById("dashboard-country-and-production-date-container")).find("span.value").empty();
	$(document.getElementById("dashboard-pegi")).children("span.value").empty();
	$(document.getElementById("dashboard-synopsis")).empty();
	$(document.getElementById("dashboard-buttons-container")).children().removeClass("focus").hide();
	
	$(document.getElementById("return-button-dashboard")).removeClass("focus");
	
    Collections.reset($(document.getElementById("dashboard-collections")), {
		minTop:0,
		limitByPage:1,
		height:203,
		reduceModeContainerWidth:760,
		itemsLimitByCollectionBlock:5
	});
	Section.oldCollectionContainer.push(Collections.$container);

    // Masque le loader
    this.hideLoader();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches the initializing and the loading of the dashbord
 * @param {Object} params Contains parameters used to load the dashboard
 * @param {String} section The section's name
 * @param {Object} callbackList Contains a success and error callback
 */

Dash.load = function(params, section, callbackList){
    //log("Dash.load() : start");

    if(typeOf(params) === "object" && this.types.indexOf(params.type) !== -1 && typeOf(callbackList) === "object"){
		
        // Reset avec son loader
        this.reset(params.type);
        this.show();

        this.showLoader();
        Navigation.blockNavigation = true;

    	if(params.from && params.from === "fromSearchResult"){
    		Dash.load.callback({mediaData:params.data, from:params.from, titleIdFull:params.id}, null, callbackList);
    	}else{
    		API.getDashContent(Model.getWSForDash(section, params), section, function(jqXHR, mediaData, collectionData, seasons, episodes){
    			Dash.load.callback({mediaData:mediaData, collectionData:collectionData, titleIdFull:params.id, seasons:seasons, episodes:episodes}, jqXHR, callbackList);
    		});
    	}
    }
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches the initializing and the loading of the dashboard
 * @param {Object} mediaData The media data
 * @param {Object} collectionData The collection data
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Object} callbackList Contains a success and error callback
 * @param {String} from The section where does the user
 * @param {Integer} titleIdFull The media title ID
 */

Dash.load.callback = function(data, jqXHR, callbackList){
	Dash.hideLoader();
	Navigation.blockNavigation = false;

	if(typeOf(data) === "object" && typeOf(data.mediaData) === "object"){
		
		Dash.data = data.mediaData;
		Dash.data.titleIdFull = data.titleIdFull;
		Dash.seasons = data.seasons;
		Dash.episodes = data.episodes;

		if(data.from && data.from === "fromSearchResult"){
			
			$(document.getElementById("dashboard-container")).show();
			
			Dash.showEpisode(data.mediaData, true);
			
			if(typeOf(callbackList.onSuccess) === "function"){
				callbackList.onSuccess();
			}			

			var $watchBtn = $(document.getElementById("dashboard-watch-button"));
			$watchBtn.show().children().text(LANG.getStr("watch_now"));			

        }else{
        	Dash.generate(data.mediaData);
        	
        	// La collection
			Collections.load($(document.getElementById("dashboard-collections")), data.collectionData);

			if(typeOf(callbackList.onSuccess) === "function"){
				callbackList.onSuccess();
			}
        }

	}else{
		Dash.showErrorpopup(jqXHR, callbackList);
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Inserts the media infos in the dashboard
 * @param {Object} mediaData The media data
 */

Dash.generate = function(mediaData){
	
	$(document.getElementById("dashboard-container")).show();
	
	// Le poster
	loadAImg(mediaData.picUrl, $(document.getElementById("dashboard-poster")), "img_def_collection.svg");

	// Les infos sur le film
	this.generate.insertInfos(mediaData);
	
	// Affiche les bons boutons selon le type du media
	var $watchTrailerBtn = $(document.getElementById("dashboard-watch-trailer-button"));
	var watchTrailerIsVisible = false;
	if(mediaData.trailerInfos){
		$watchTrailerBtn.show();
		watchTrailerIsVisible = true;
	}
	
	// Gestion du bouton Watch movie/episode/now
	this.handleButtons(mediaData, watchTrailerIsVisible);	
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Handles the displaying of the dashboard buttons
 * @param {Object} mediaData The media data
 * @param {Boolean} watchTrailerIsVisible Determines whether the Watch trailer button is visible
 */

Dash.handleButtons = function(mediaData, watchTrailerIsVisible){
	var $resumeBtn = $(document.getElementById("dashboard-resume-button")).hide();
	var $watchBtn = $(document.getElementById("dashboard-watch-button"));
	
	// Le bouton Resume est présent seulement avec le bouton Watch trailer
	var resumeEpisode = (Dash.seriesData && Dash.seriesData.isInWatchList && parseInt(Dash.seriesData.seasonNumberInWatchList,10) === mediaData.season && parseInt(Dash.seriesData.episodeNumberInWatchList,10) === mediaData.episode);
	if(mediaData.isInWatchList || resumeEpisode){
		$resumeBtn.show().children().html(LANG.getStr("resume_button"));
		$watchBtn.hide();
		
		if(resumeEpisode){
			Dash.data.playbackTime = Dash.seriesData.playbackTime;
		}
	
	// Le bouton Watch Again n'est présent que sur la fiche épisode
	}else if(mediaData.isInWatchedList/* && this.type === this.types[2]*/){
		$watchBtn.show().children().html(LANG.getStr("watch_again_button"));
		
	}else{
		
		// Si c'est un épisode, ce sera soit le Watch episode, soit Watch now selon si le bouton Watch trailer est visible
		if(this.type === this.types[2]){
			$watchBtn.children().text(LANG.getStr(watchTrailerIsVisible ? "watch_episode" : "watch_now"));
		
		// Si c'est un film ou une série, ce sera soit Watch movie, soit Watch episode
		}else{
			$watchBtn.children().text(LANG.getStr(this.type === "movie" ? "watch_movie" : "watch_episode"));
		}
		$watchBtn.show();
			
		// Gestion du bouton Watchlist
		if(this.type !== this.types[2] && Section.name !== "kids"){
			var $watchListBtn = $(document.getElementById("dashboard-watchlist-button"));
			if(mediaData.isInWishList){
				$watchListBtn.children().html(LANG.getStr("watchlist_button_remove"));
			}else{
				$watchListBtn.children().html(LANG.getStr("watchlist_button_add"));
			}
			$watchListBtn.show();
		}
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Displays the resume/watch again button and hides others
 */

Dash.showResumeWatchAgainBtn = function(){
	if([Section.sections[7], Section.sections[8]].indexOf(Section.name) !== -1){
		var $ctn = $(document.getElementById("dashboard-buttons-container"));
		$ctn.children(".btn:not(#dashboard-watch-trailer-button)").hide();

		this.handleButtons(this.data);

		// Gestion du focus
		$(Navigation.currentEl).removeClass("focus");
		Navigation.setClassFocus($ctn.children(".btn:visible:first"));
		
	}else{
		// log("Dash.showResumeWatchAgainBtn() : Je ne me trouve pas dans la dashboard ! Annulation.");
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Inserts the media details in the dashboard
 * @param {Object} mediaData The media data
 */

Dash.generate.insertInfos = function(mediaData){
	var list = [];
	
	// Le titre
	$(document.getElementById("dashboard-title")).text(mediaData.titles[LANG.codeLang]);
	
	// L'année, la durée et le pays (pour les films)
	if(Dash.type === Dash.types[0]){
		$(document.getElementById("dashboard-media-details")).html(function(){
			var html = "";
			
			if(mediaData.year){
				html+='<span class="year">'+mediaData.year+'</span>';
			}
			
			if(mediaData.duration){
				html+= html ? " - " + mediaData.duration : "";
			}
			
			if(mediaData.country){
				html+= html ? " - " + mediaData.country : "";
			}
			return html;
		});
		
	}else if(Dash.type === Dash.types[1]){
		$(document.getElementById("dashboard-media-details")).html(function(){
			var html = "";
			
			if(mediaData.year){
				html+='<span class="year">'+mediaData.year+'</span>';
			}
			
			if(mediaData.totalSeasons){
				html+= html ? " - " + mediaData.totalSeasons + " " + (mediaData.totalSeasons > 1 ? LANG.getStr("seasons") : LANG.getStr("season")) : "";
			}
			
			if(mediaData.country){
				html+= html ? " - " + mediaData.country : "";
			}
			return html;
		});
	}
	
	// Le genre
	if(mediaData.genres){
		$(document.getElementById("dashboard-genre")).text(mediaData.genres.toString().replace(/,/g, ", "));
	}
	
	var getLanguages = function(list){
		var html = "";
		if(typeOf(list) === "array"){
			
			var i, l = list.length, language;
			for(i=0;i<l;i++){
				
				language = list[i];
				if(html){
					html += ", ";
				}
				html += LANG.getStr(list[i]);
			}
		}
		return html;
	};
	
	var getSubtitles = function(list){
		var html = "";
		if(typeOf(list) === "array"){
			
			var i, l = list.length, subtitle;
			for(i=0;i<l;i++){
				
				subtitle = list[i];
				if(typeOf(subtitle) === "object" && typeOf(subtitle.extra_info) === "object" && subtitle.extra_info.language){
					if(html){
						html += ", ";
					}
					html += LANG.getStr(subtitle.extra_info.language);
				}
			}
		}
		return html;
	};
	
	// Langue et sous-titres
	list = [getLanguages(mediaData.languages), getSubtitles(mediaData.subtitles)];
	$(document.getElementById("dashboard-languages-and-subtitles-container")).find("span.value").each(function(i, span){
		$(span).text(list[i] || "");
	});
	
	// Année de production et pays
	list = [mediaData.year, mediaData.country];
	$(document.getElementById("dashboard-country-and-production-date-container")).find("span.value").each(function(i, span){
		$(span).text(list[i] || "");
	});
	
	// Le PEGI
	$(document.getElementById("dashboard-pegi")).children("span.value").text(mediaData.pegi);
	
	// Le résumé
	$(document.getElementById("dashboard-synopsis")).html(mediaData.descriptions[LANG.codeLang]);
};

/**
 * @author Johny EUGENE
 * @description Displays the dashboard loader
 */

Dash.showLoader = function(){
    $(document.getElementById("loader-dashboard-container")).show();
};

/**
 * @author Johny EUGENE
 * @description Hides the dashboard loader
 */

Dash.hideLoader = function(){
    $(document.getElementById("loader-dashboard-container")).hide();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Displays the dashboard
 */

Dash.show = function(){
    $(document.getElementById("dashboard")).show();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Displays an error popup
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Object} callbackList Contains a success and error callback
 */

Dash.showErrorpopup = function(jqXHR, callbackList){
	
	if(jqXHR){
		
		Popup.info.show({
			titleAndMsg:["", LANG.langData.errors.genericError],
			onBack:Popup.hideAll,
			buttons:[{
					title:LANG.getStr("ok"),
					onClick:Popup.hideAll
			}]
		});
	}

	if(callbackList && typeOf(callbackList.onError) === "function"){
		callbackList.onError();
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Displays the details of an episode in the dashboard
 * @param {Object} mediaData The episode data
 * @param {Boolean} from Determines whether the dashboard has been launched since the search screen
 */

Dash.showEpisode = function(mediaData, from){
	
	Navigation.blockNavigation = false;
	this.hideLoader();
	
	if(this.type === this.types[1]){
		this.seriesData = this.data;
	}	
	this.data = mediaData;
	
	if(from){
		this.type = 0;
		$(document.getElementById("dashboard")).addClass(this.types[2]);
	}else{
		this.type = this.types[2];
		Section.template.addClass(this.type);
	}
	
	loadAImg(mediaData.pictureUrl, $(document.getElementById("dashboard-poster")), "img_def_collection.svg");
	var title, episodeTitle = mediaData.titles && mediaData.titles[LANG.codeLang] ? mediaData.titles[LANG.codeLang] : "";
	var seasonEpisode = mediaData.season && mediaData.episode ? "S"+ pad(mediaData.season)+" - E" + pad(mediaData.episode) : "";
	if(from){
		title = seasonEpisode ? seasonEpisode + " : " + episodeTitle : episodeTitle;
	}else{
		title = this.seriesData.titles[LANG.codeLang] + " " + seasonEpisode + "<br/>" + episodeTitle;
	}
	
	$(document.getElementById("dashboard-title")).html(title);
	$(document.getElementById("dashboard-synopsis")).html(mediaData.descriptions && mediaData.descriptions[LANG.codeLang] ? mediaData.descriptions[LANG.codeLang] : "");
	
	$(document.getElementById("dashboard-buttons-container")).children(".btn").hide();
	this.handleButtons(mediaData);
};
	
																	/* **************************/
																	/*			COLLECTIONS	 	*/
																	/* **************************/

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description launches the loading of the episodes list of a season
 * @param {Integer} season The season
 */

Dash.collections.showEpisodes = function(season){
	
	this.hide();
	var list = Model.getEpisodes(Dash.episodes[season], season);
	if(typeOf(list) === "array" && list.length){

		Dash.collections.$seasons = $(document.getElementById("dashboard-collections")).clone(true);

		// Lance la génération de la liste
		Collections.reset($(document.getElementById("dashboard-collections")), {
			minTop:0,
			limitByPage:1,
			height:203,
			reduceModeContainerWidth:760,
			itemsLimitByCollectionBlock:5
		});

		Dash.collections.show();
		Collections.load($(document.getElementById("dashboard-collections")), list);

		Navigation.setFocusToCollections();			
	}else{
		Dash.collections.show();
		Dash.collections.showErrorpopup();
	}
};

/**
 * @author Johny EUGENE
 * @description Displays the dashboard collections
 */

Dash.collections.show = function(){
    $(document.getElementById("dashboard-collections")).show();
};

/**
 * @author Johny EUGENE
 * @description Hides the dashboard collections
 */

Dash.collections.hide = function(){
    $(document.getElementById("dashboard-collections")).hide();
};

/**
 * @author Johny EUGENE
 * @description Displays the loader of the collections
 */

Dash.collections.showLoader = function(){
    $(document.getElementById("loader-collections-dashboard-container")).show();
};

/**
 * @author Johny EUGENE
 * @description Hides the loader of the collections
 */

Dash.collections.hideLoader = function(){
    $(document.getElementById("loader-collections-dashboard-container")).hide();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Displays an error popup
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 */

Dash.collections.showErrorpopup = function(){
	
	Popup.info.show({
		titleAndMsg:["", LANG.langData.errors.genericError],
		onBack:Popup.hideAll,
		buttons:[{
				title:LANG.getStr("ok"),
				onClick:Popup.hideAll
		}]
	});
};

/**
 * @author Theo
 * @description Resume the video
 */

Dash.resume = function(){
	// Si j'ai cliqué sur le bouton Resume de la fiche Série (doit charger les data de l'épisode concerné pour récupérer les infos sur sa vidéo)

	if(Dash.type === "serie" && Dash.data.seasonNumberInWatchList && Dash.data.episodeNumberInWatchList){
		
		var episodeData = getEpisode(Dash.episodes[Dash.data.seasonNumberInWatchList].titles, Dash.data.episodeNumberInWatchList);
		if(typeOf(episodeData) === "object"){
			Dash.data.seasonEpisodeTitle = "S"+pad(episodeData.tvSeasonNumber)+"-E"+pad(episodeData.tvSeasonEpisodeNumber);
			Dash.data.streamingInfos = getMediaUrl(episodeData.media[0].content, ["hss_playready_vu"]);
			Dash.data.subtitles = getSubtitlesData(episodeData.media[0].content, ["dfxp_ar_vu", "dfxp_en_vu"], ["ara", "eng"]);
			Player.launchStreaming(Dash.data, "streaming");

		}else{
			Popup.info.show({
				titleAndMsg:["", LANG.langData.errors.genericError],
				onBack:Popup.hideAll,
				buttons:[{
					title:LANG.getStr("ok"),
					onClick:Popup.hideAll
				}]
			});
		}
	}else{
		Player.launchStreaming(Dash.data, "streaming");
	}
};
