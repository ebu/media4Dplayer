var Model = {};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the API for menu, then launches the callback function
 * @param {Object} data The response returned by the request
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Function} callback The function which will be triggered after data processing
 */

Model.getMenu = function(data, jqXHR, callback){
    if (typeOf(data) === "object" && typeOf(data.list) === "array") {
        callback(data.list, jqXHR);
    }
    else {
        callback(null, jqXHR);
    }
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the API for the submenu, then launches the callback function
 * @param {Object} data The response returned by the request
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Function} callback The function which will be triggered after data processing
 * @param {String} section The section name
 */

Model.getSubmenu = function(data, jqXHR, callback, section){
    if (["watchlist","settings"].indexOf(section) !== -1 && typeOf(data) === "object" && typeOf(data.list) === "array"){
        callback(data.list, jqXHR);
		
    }else if(section === "movies" && typeOf(data) === "object" && typeOf(data.titles) === "array"){
		
		var i, l = data.titles.length, item, newList = [], newListBis = [];
		for(i=0;i<l;i++){
			item = data.titles[i];
			if(typeOf(item) === "object"){
				if(item.pegModuleUrl || item.pegModuleUrlTitleAdded){
					newList.push({
						title:item.title,
						params:{
							context:null,
							url:item.pegModuleUrl,
							filterUrl:item.pegModuleUrlTitleAdded
						}
					});
				}else if(item.pegCustomLayout){
					newListBis.push({
						title:item.title,
						params:{
							context:null,
							url:item.pegCustomLayout,
							custom:true
						}
					});
				}
			}
		}
		newList = newList.concat(newListBis);
        callback(newList, jqXHR);
		
    }else{
        callback(null, jqXHR);
    }
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the API about user's credentials, then launches the callback function
 * @param {Object} data The response returned by the request
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Function} callback The function which will be triggered after data processing
 */

Model.checkAccess = function(data, jqXHR, callback){
    if(typeOf(data) === "object" && data.statusReason === "OK"){
		
		// Récupère les détails
		API.getUserDetails(data.uid, {headers:{Authorization:'Bearer ' + data.accessToken}}, function(userData, jqXHR){
			if(typeOf(userData) === "object" && userData.globalUserId){

				callback({
					accessToken:data.accessToken,
					expireIn:data.expireIn,
					uid:data.uid,
					isConnected:true,
					userDetails:userData,
					pegMediaAccessToken:jqXHR.getResponseHeader('x-peg-media-access-token')
				});

				if (LANG.cache && LANG.cache["menu_"+LANG.codeLang]) {
					var list = LANG.cache["menu_"+LANG.codeLang].list;
					$(document.getElementById("rubrics-list-menu")).children().each(function(i, item){

						var $rubric = $(document.getElementById("rubric-" + (i + 1) + "-button"));

						if(User.itsKidsParentalControl()){
							if(Menu.rubrics.hidingRubricIsNecessary(list[i])){
								$(item).hide();
							}
						}else{
							if(list[i].tags && typeOf(list[i].tags) === "array" && list[i].tags.indexOf("hiddenIfNotConnected") !== -1){
								if(!User.data || !User.data.isConnected){
									$rubric.hide();
								}else{
									$rubric.show();
								}
							}

						}
						if(list[i].tags && typeOf(list[i].tags) === "array" && list[i].tags.indexOf("LogInOrangeIfNotConnected") !== -1){
							if(!User.data || !User.data.isConnected){
								$rubric.addClass("orange").children('span').text(LANG.getStr("login_title"));
							}else{
								$rubric.children('span').text(LANG.getStr("settings"));
								$rubric.removeClass("orange");
							}
						}
					});
				}

			}else{
				callback(null, jqXHR);
			}
		});
		
    }else{
        callback(null, jqXHR);
    }
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Determines and returns the WS url for the loading of the grid according to the section
 * @param {String} section The section name
 * @param {Object} params Contains parameters used to construct the url
 * @return {String} The WS url
 */

Model.getWSForGrid = function(section, params){
	var wsLinks = Config.versions[Config.version];
    if(section === "watchlist" && typeOf(params) === "object"){
        return wsLinks.domain+"userAccounts/"+User.data.uid+"/mediaLists?context="+params.context;
	
	}else if(Section.name === Section.sections[1] && Section.rubric === "fullgrid"){
		return params.url + getParentalControlFilter();
		
    }else if(["movies","series","kids"].indexOf(section) !== -1 && typeOf(params) === "object"){
		return wsLinks.domain+"mediaCatalog/feeds?feedUrl="+encodeURIComponent(params.url) + getParentalControlFilter();
    }
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches the processes the data received by the API for the grid
 * @param {Object} data The response returned by the request
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Function} callback The function which will be triggered after data processing
 * @param {String} section The section name
 */

Model.getGridContent = function(data, jqXHR, callback, section){
    if(section === "watchlist" && typeOf(data) === "array" && typeOf(data[0]) === "object" && typeOf(data[0].items) === "array"){
		this.getGridContent.forWatchlist(data[0].items, callback);
		
	}else if(["movies","series","kids"].indexOf(section) !== -1 && typeOf(data) === "object" && (typeOf(data.entries) === "array" || typeOf(data.titles) === "array")){
		this.getGridContent.forMovies(data.entries || data.titles, jqXHR, callback);
		
    }else{
        callback(null, jqXHR);
    }
};
Model.getGridContent.calls = 0;
Model.getGridContent.watchlist = [];
Model.getGridContent.watchlistId = [];
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Constructs a list containing all the ID's of the items in the list, then launches a function that will go get data about these items
 * @param {Array} list The list
 * @param {Function} callback The function which will be triggered after data processing
 */

Model.getGridContent.forWatchlist = function(list, callback){
	var i, idList = [], l = list.length, item;
	for(i=0;i<l;i++){
		item = list[i];
		if(typeOf(item) === "object"){
			var regex = new RegExp("Program/([0-9]+)$", "g"),
				results = regex.exec(item.titleId);
			if(!results){
				regex = new RegExp("ProgramAvailability/([0-9]+)$", "g");
				results = regex.exec(item.titleId);
			}
			if(results){
				idList.push(results[1]);
			}
		}
	}

	var filter = "?form=cjson&byMediaAvailabilityState=available&fields=id,title,titleLocalized,tags,thumbnails&thumbnailFilter="+Config.posterSize;
	Model.getGridContent.watchlist = [];
	Model.getGridContent.watchlistId = [];
	if(idList.length){
		var wsLinks = Config.versions[Config.version];
		var nbCall = Math.ceil(idList.length/10);
		for (var i = 0; i < nbCall; i++) {
			Model.getGridContent.calls++;
			var start = 10*i;
			var end = i == nbCall-1 ? idList.length : 10*(i+1);
			var newIdList = idList.slice(start,end);
			
			Model.getMediasInfo(encodeURIComponent(wsLinks.feed+wsLinks.prefix1+newIdList.toString()+filter), callback);
		};
	}else{
		callback([]);
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the API for the grid of the movies, then launches the callback function
 * @param {Array} list The list
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Function} callback The function which will be triggered after data processing
 */

Model.getGridContent.forMovies = function(list, jqXHR, callback){
	var i, newList = [], l = list.length, item;
	for(i=0;i<l;i++){
		
		item = list[i];
		if(typeOf(item) === "object"){
			
			newList.push({
				picUrl:typeOf(item.thumbnails)==="object"&&typeOf(item.thumbnails[Config.posterSize])==="object"&&item.thumbnails[Config.posterSize].url?item.thumbnails[Config.posterSize].url:"",
				pictureUrl:typeOf(item.thumbnails)==="object"&&typeOf(item.thumbnails[Config.pictureSize])==="object"&&item.thumbnails[Config.pictureSize].url?item.thumbnails[Config.pictureSize].url:"",
				titles:{
					en:item.title,
					ar:typeOf(item.titleLocalized) === "object" ? item.titleLocalized.ar : ""
				},
				descriptions:{
					en:item.description || item.shortDescription,
					ar:typeOf(item.descriptionLocalized) === "object" ? item.descriptionLocalized.ar : typeOf(item.shortDescriptionLocalized) === "object" ? item.shortDescriptionLocalized.ar : ""
				},
				tags:item.tags,
				year:item.year,
				parentalRating:item.peg$arAgeRating,
				id:item.titleId,
				type:getItemType(item),
				season:item.tvSeasonNumber,
				episode:item.tvSeasonEpisodeNumber
			});
		}
	}
	callback(newList, jqXHR);
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to get the items data, processes the data received by the API for the grid of the movies, then launches the callback function
 * @param {String} url The WS url
 * @param {Function} callback The function which will be triggered after data processing
 */

Model.getMediasInfo = function(url, callback){
	json.load({url:Config.versions[Config.version].domain+"mediaCatalog/feeds?feedUrl=" + url + (User.data ? "&globalUserId=" + User.data.uid : ""), callback:function(data, jqXHR){
		Model.getGridContent.calls--;

		if (typeOf(data) === "object" && typeOf(data.titles) === "array"){
			var i, l = data.titles.length, item;
			for(i=0;i<l;i++){
				
				item = data.titles[i];
				if(typeOf(item) === "object"){

					if(Model.getGridContent.watchlistId.indexOf(item.titleId) < 0){
						Model.getGridContent.watchlistId.push(item.titleId);
						Model.getGridContent.watchlist.push({
							picUrl:typeOf(item.thumbnails)==="object"&&typeOf(item.thumbnails[Config.posterSize])==="object"&&item.thumbnails[Config.posterSize].url?item.thumbnails[Config.posterSize].url:"",
							id:item.titleId,
							type:getItemType(item),
							titles:{
								en:item.title,
								ar:typeOf(item.titleLocalized) === "object" ? item.titleLocalized.ar : ""
							}
						});
					}
					
				}
			}
		}

		if(!Model.getGridContent.calls) {
			callback(Model.getGridContent.watchlist, jqXHR);
		}

	}});
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the API for the Home component, then launches the callback function
 * @param {Object} data The response returned by the request
 * @param {Object} filters Contains informations for filtered the received data
 */
Model.getHomeContentGeneric = function(data, filters){
	var newData = {
		carrousel:null,
		collections:[],
		indexCharacterCollection:null
	};
    if(typeOf(data) === "object" && typeOf(data.titles) === "array" && typeOf(filters) === "object"){
		var i, l = data.titles.length, item;
		for(i=0;i<l;i++){
			item = data.titles[i];
			if(typeOf(item) === "object" && item.pegModuleUrlType){
				
				var isCharacterCollection = typeOf(newData.indexCharacterCollection) !== "number" && filters.characterTypeName && item.pegModuleUrlType.toLowerCase() === filters.characterTypeName;
				
				// Ne récupère qu'un item pour le Carrousel
				if(item.pegModuleUrlType.toUpperCase() === filters.carrousel.toUpperCase() && !newData.carrousel){
					var list = item.layoutTitles;
					if(!item.layoutTitles && item.pegModuleUrl){
						list = {titles:[item]};
					}
					newData.carrousel = {
						list:this.getItemsList(list, Config.heroAssetTypes)
					};
				
				// Récupère les collections selon les mots clefs définit dans la liste
				}else if(filters.collections.indexOf(item.pegModuleUrlType) !== -1 || isCharacterCollection){
					newData.collections.push(this.getCollection(item, {isCharacterCollection:isCharacterCollection}));
					
					if(isCharacterCollection){
						newData.indexCharacterCollection = newData.collections.length-1;
					}
					
				}else if(filters.catalogue && item.pegModuleUrlType.toLowerCase() === filters.catalogue.toLowerCase()){
					newData.fullCatalogueData = {
						url:item.pegModuleUrl,
						filterUrl:item.pegModuleUrlTitleAdded
					};
				}
			}
		}
	}
	return newData;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the API for the Home component, then launches the callback function
 * @param {Object} data The response returned by the request
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Function} callback The function which will be triggered after data processing
 * @param {Object} filters Contains informations for filtered the received data
 * @param {String} section The section's name
 */
Model.getHomeContent = function(data, jqXHR, callback, filters, section){
    if(typeOf(data) === "object" && typeOf(data.titles) === "array" && typeOf(filters) === "object"){
		var newData = this.getHomeContentGeneric(data, filters);
		if(!json.cache[section]){
			json.cache[section] = {};
		}
		json.cache[section][LANG.codeLang] = newData;
		callback(newData, jqXHR);
    }else{
        callback(null, jqXHR);
    }
};
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the API for the Home Disney component, then launches the callback function
 * @param {Object} data The response returned by the request
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Function} callback The function which will be triggered after data processing
 * @param {Object} filters Contains informations for filtered the received data
 * @param {String} section The section's name
 */
Model.getHomeContentSubmenu = function(data, jqXHR, callback, filters, section){
    if(typeOf(data) === "object" && typeOf(data.titles) === "array" && typeOf(filters) === "object"){
		var newData = this.getHomeContentGeneric(data, filters);
		if(!json.cache[Section.rubrics[Section.name][1]]){
			json.cache[Section.rubrics[Section.name][1]] = {};
		}
		json.cache[Section.rubrics[Section.name][1]][LANG.codeLang] = newData;
		callback(newData, jqXHR);
    }else{
        callback(null, jqXHR);
    }
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates and returns a collection
 * @param {Object} item The data
 * @param {Object} params Parameters to generate the collection
 * @return {Object} A collection
 */

Model.getCollection = function(item, params){
	return {
		titles:{
			en:item.title,
			ar:typeOf(item.titleLocalized) === "object" ? item.titleLocalized.ar : ""
		},
		url:item.pegModuleUrl,
		list:this.getItemsList(item.layoutTitles),
		isCharacterCollection:params.isCharacterCollection,
		isSeasonsCollection:params.isSeasonList
	};
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates and returns a list of items of a module
 * @param {Object} layoutTitles The module data
 * @param {Array} assetTypes A list of assets to find the item url
 * @return {Array} A list of items
 */

Model.getItemsList = function(layoutTitles, assetTypes){
	
	var newList = [];
	var list = typeOf(layoutTitles) === "object" ? layoutTitles.titles : [];
	if(typeOf(list) === "array" && list.length){
				
		var i, l = list.length, item, clearItem;
		for(i=0;i<l;i++){
			item = list[i];
			if(typeOf(item) === "object"){
				clearItem = {
					id:item.titleId,
					posterUrl:typeOf(item.thumbnails)==="object" ? typeOf(assetTypes) === "array" ? getPictureByAsset(item.thumbnails, assetTypes) : getFirstThumb(item.thumbnails) : item.pegModuleUrl ? item.pegModuleUrl : "",
					title:item.title,
					type:getItemType(item)
				};
				
				if(typeOf(item.media) === "array" && typeOf(item.media[0]) === "object"){
					clearItem.streamingInfos = getMediaUrl(item.media[0].content, ["hss_playready_vu"]);
					clearItem.trailerInfos = getMediaUrl(item.media[0].content, ["hss_t01_movie_vu","hss_t01_serie_vu"]);
					clearItem.subtitles = getSubtitlesData(item.media[0].content, ["dfxp_ar_vu", "dfxp_en_vu"], ["ara", "eng"]);
				}
				
				newList.push(clearItem);
			}
		}
	}
	return newList;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Determines and returns the WS url for the loading of the dashboard according to the section
 * @param {String} section The section name
 * @param {Object} params Contains parameters used to construct the url
 * @return {String} The WS url
 */

Model.getWSForDash = function(section, params){
    if(["movie dashboard","tvseries dashboard"].indexOf(section) !== -1 && typeOf(params) === "object"){
		
		var domain = Config.versions[Config.version].domain;
		var regex = new RegExp("/([0-9]+)$", "g"),
			results = regex.exec(params.id);	
		
		if(section === "movie dashboard"){
			if(typeOf(results) === "array"){
				return [domain+"mediaCatalog/titles/"+results[1]];
			}else{
				return [domain+"mediaCatalog/titles/"+params.id];
			}
			
		}else{
			if(typeOf(results) === "array"){
				return [
					domain+"mediaCatalog/titles/series/"+results[1], 
					domain+"mediaCatalog/titles/series/"+results[1]+"/seasons"
				];
			}else{
				return [domain+"mediaCatalog/titles/series/"+params.id, domain+"mediaCatalog/titles/series/"+params.id+"/seasons"];
			}
		}
    }else return [];
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the API for the dashboard, then launches the callback function
 * @param {Object} data The response returned by the request
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Function} callback The function which will be triggered after data processing
 * @param {String} section The section name
 */

Model.getDashContent = function(data, jqXHR, callback, section){
    if(typeOf(data) === "array" && typeOf(data[0]) === "object" && typeOf(data[0].titles) === "array" && data[0].titles.length){

		// Récupère les infos sur le media
		var item = data[0].titles[0];
		var itemData = {
			picUrl:typeOf(item.thumbnails)==="object"&&typeOf(item.thumbnails[Config.posterSize])==="object"&&item.thumbnails[Config.posterSize].url?item.thumbnails[Config.posterSize].url:"",
			titles:{
				en:item.title,
				ar:typeOf(item.titleLocalized) === "object" ? item.titleLocalized.ar : ""
			},
			descriptions:{
				en:item.longDescription,
				ar:typeOf(item.longDescriptionLocalized) === "object" ? item.longDescriptionLocalized.ar : ""
			},
			languages:item.languages,
			year:item.year,
			pegi:item.arAgeRating,
			country:item.countryOfOrigin,
			genres:getAItemTag(item.tags, "urn:peg:genre"),
			id:item.titleId
		};
		
		if(typeOf(item.media) === "array" && typeOf(item.media[0]) === "object"){
			itemData.streamingInfos = getMediaUrl(item.media[0].content, ["hss_playready_vu"]);
			itemData.trailerInfos = getMediaUrl(item.media[0].content, ["hss_t01_movie_vu","hss_t01_serie_vu"]);
			itemData.subtitles = getSubtitlesData(item.media[0].content, ["dfxp_ar_vu", "dfxp_en_vu"], ["ara", "eng"]);
		}

		// Récupère les infos sur la collection (les saisons si c'est une série)
		var collection = [], seasons, episodes;
		if(typeOf(data[1]) === "object" && typeOf(data[1].titles) === "array" && data[1].titles.length){
			
			item = data[1].titles[0];
			
			// Génère la liste des saisons
			seasons = this.getSeasonsNumbers(data[1].titles);
			
			// Mémorise le nombre de saison
			itemData.totalSeasons = seasons.length;
			
			collection = [{
				list:this.getSeasonsList(seasons),
				isSeasonsCollection:true
			}];			
		}
		
		var _afterGettingAllEpisodes = function(){

			itemData.isInWishList = false;
			itemData.isInWatchList = false;
			itemData.isInWatchedList = false;
			itemData.itemIdInList = {};
			itemData.lastIndexInList = {
				wishList:0,
				watchList:0,
				watchedList:0
			};

			if(User.data && User.data.isConnected){
				API.getMediaLists(User.data.uid, {headers:{Authorization:'Bearer ' + User.data.accessToken}}, function(data, jqXHR){
					if(typeOf(data) === "array"){

						// Récupère les ID des listes (utile pour l'ajout/suppression de la liste)
						if(!User.mediaListsId){
							getMediaListsID(data);
						}

						// Récupère les ID des items se trouvant dans la wish list du json
						var itemIDList = getItemIDInList(getItemsOfMediaList(data, "wishList"));

						// Verifie si le contenu se trouve dans la watch list. Dans ce cas devra afficher le bouton -Watchlist
						var i, l = itemIDList.idList.length;
						for(i=0;i<l;i++){

							if(itemIDList.idList[i] === itemData.id){
								log("L'item se trouve dans la wish list. id = "+itemIDList.idListItemId[i]);
								itemData.isInWishList = true;
								itemData.itemIdInList.wishList = itemIDList.idListItemId[i];
								itemData.lastIndexInList.wishList = itemIDList.index[i];
								break;
							}
						}

						// Récupère les ID des items se trouvant dans la watch list (watching dans le menu de l'appli)
						itemIDList = getItemIDInList(getItemsOfMediaList(data, "watchList"));

						// Verifie si le contenu se trouve dans la watch list. Dans ce cas devra afficher le bouton Resume
						i;
						l = itemIDList.idList.length;
						for(i=0;i<l;i++){

							if(itemIDList.idList[i] === itemData.id){
								log("L'item se trouve dans la watch list. id = "+itemIDList.idListItemId[i]);						
								itemData.isInWatchList = true;
								itemData.itemIdInList.watchList = itemIDList.idListItemId[i];
								itemData.playbackTime = itemIDList.playbackTime[i];
								itemData.lastIndexInList.watchList = itemIDList.index[i];
								itemData.seasonNumberInWatchList = itemIDList.seasonNumber[i];
								itemData.episodeNumberInWatchList = itemIDList.episodeNumber[i];
								break;
							}
						}

						// Récupère les ID des items se trouvant dans la Watched list
						itemIDList = getItemIDInList(getItemsOfMediaList(data, "watchedList"));

						// Verifie si le contenu se trouve dans la Watched list. Dans ce cas ne devra pas afficher le bouton Resume
						i;
						l = itemIDList.idList.length;
						for(i=0;i<l;i++){

							if(itemIDList.idList[i] === itemData.id){
								log("L'item se trouve dans la Watched list. id = "+itemIDList.idListItemId[i]);						
								itemData.isInWatchedList = true;
								itemData.itemIdInList.watchedList = itemIDList.idListItemId[i];
								itemData.lastIndexInList.watchedList = itemIDList.index[i];
								break;
							}
						}

						callback(jqXHR, itemData, collection, seasons, episodes);
					}
				});

			}else{
				callback(jqXHR, itemData, collection, seasons, episodes);
			}			
		};
		
		// Récupère les infos sur la langue
		/*if(section === "tvseries dashboard" && typeOf(data[2]) === "object" && typeOf(data[2].titles) === "array" && data[2].titles.length){
			itemData.languages = data[2].titles[0].languages;
		}*/
		
		// Si c'est une série, doit charger et mettre en cache les épisodes de toutes les saisons. Annule l'affichage de la dashboard si pas de saison
		if(Dash.type === Dash.types[1]){
			if(itemData.totalSeasons && seasons){
				API.getAllSeasons(itemData.id, seasons, function(list){
					
					if(typeOf(list) === "array"){
						
						episodes = {};
						var i, l = seasons.length;
						for(i=0;i<l;i++){
							
							episodes[seasons[i]] = list[i];
						}
						
						_afterGettingAllEpisodes();
					}else{
						callback(jqXHR);
					}
				});
			}else{
				callback(jqXHR);
			}
		}else{
			_afterGettingAllEpisodes();
		}
		
    }else{
        callback(jqXHR);
    }
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates and returns a list of seasons
 * @param {Integer} total The season number to generate
 * @return {Array} A list of seasons
 */

Model.getSeasonsNumbers = function(list){
	
	var newList = [];
	if(typeOf(list) === "array"){
		var i, season, l = list.length;
		for(i=0;i<l;i++){
			season = list[i];
			newList.push(season.tvSeasonNumber);
		}
	}
	return newList;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates and returns a list of seasons
 * @param {Integer} total The season number to generate
 * @return {Array} A list of seasons
 */

Model.getSeasonsList = function(list){
	
	var newList = [];
	if(typeOf(list) === "array"){
		
		var i, season, l = list.length;;
		for(i=0;i<l;i++){
			season = list[i];
			newList.push({
				season:season,
				title:LANG.getStr("season") + " " + season,
				type:"season"
			});
		}
	}
	return newList;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the API for a season, then launches the callback function
 * @param {Object} data The data
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Function} callback The function which will be triggered after data processing
 * @param {Integer} season The season
 */

Model.getEpisodes = function(data, season){
	if(typeOf(data) === "object" && typeOf(data.titles) === "array"){

		var _getList = function(list){

			var i, newList = [{
					type:"back to saisons list",
					title:LANG.getStr("all_seasons")
					
			}], l = list.length, item;
			for(i=0;i<l;i++){

				item = list[i];
				if(typeOf(item) === "object"){
					
					var itemData = {
						id:item.titleId,
						posterUrl:typeOf(item.thumbnails)==="object"&&typeOf(item.thumbnails[Config.posterSize])==="object"&&item.thumbnails[Config.posterSize].url?item.thumbnails[Config.posterSize].url:"",
						pictureUrl:typeOf(item.thumbnails)==="object"&&typeOf(item.thumbnails[Config.pictureSize])==="object"&&item.thumbnails[Config.pictureSize].url?item.thumbnails[Config.pictureSize].url:"",
						titles:{
							en:item.title,
							ar:typeOf(item.titleLocalized) === "object" ? item.titleLocalized.ar : ""
						},
						descriptions:{
							en:item.description,
							ar:typeOf(item.descriptionLocalized) === "object" ? item.descriptionLocalized.ar : ""
						},
						type:getItemType(item),
						season:season,
						episode:item.tvSeasonEpisodeNumber
					};
		
					if(typeOf(item.media) === "array" && typeOf(item.media[0]) === "object"){
						itemData.streamingInfos = getMediaUrl(item.media[0].content, ["hss_playready_vu"]);
						itemData.trailerInfos = getMediaUrl(item.media[0].content, ["hss_t01_movie_vu","hss_t01_serie_vu"]);
						itemData.subtitles = getSubtitlesData(item.media[0].content, ["dfxp_ar_vu", "dfxp_en_vu"], ["ara", "eng"]);
					}
					
					newList.push(itemData);
				}
			}
			return newList;
		};
		
		return [{
			titles:{
				en:LANG.getStr("season") + " " + season,
				ar:LANG.getStr("season") + " " + season
			},
			list:_getList(data.titles)
		}];
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Returns a list of object for the loading of a settings's rubric
 * @param {String} rubric The rubric name
 * @param {Object} params Contains parameters used to construct the requests parameters
 * @return {Array} A list of parameters to launch the requests
 */

Model.getWSForASetting = function(rubric, params){
	var wsLinks = Config.versions[Config.version];
	var uid = User.data.uid;
	var timeout = Config.jsonTimeout * 1000;
    if(rubric === "payment"){
        return [{url:wsLinks.domain+"userAccounts/"+uid+"/billingAccounts/subscriptions", headers:params.headers||{}, timeout:timeout},
				{url:wsLinks.domain+"userAccounts/"+uid+"/billingAccounts", headers:params.headers||{}, timeout:timeout}];
		
    }else if(rubric === "devices"){
		return [{url:wsLinks.domain+"userAccounts/"+uid+"/devices", headers:params.headers||{}, timeout:timeout}];
    }
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the API for a settings's rubric, then launches the callback function
 * @param {Object} data The data
 * @param {String} rubric The rubric name
 * @param {Function} callback The function which will be triggered after data processing
 */

Model.getASettingData = function(data, rubric, callback){
    if(rubric === "payment" && typeOf(data) === "array"){
		
		var subData = typeOf(data[0]) === "object" && typeOf(data[0].subscriptions) === "array" && data[0].subscriptions[0] ? data[0].subscriptions[0] : {};			
		var paymentData = typeOf(data[1]) === "object" && typeOf(data[1].paymentMethods) === "array" && data[1].paymentMethods[0] ? data[1].paymentMethods[0] : {};

		callback({
			payment:{
				paymentType:paymentData.paymentType,
				paymentMethod:paymentData.paymentMethod,
				creditCard:paymentData.creditCardNumber
			},
			subscription:{
				state:subData.state,
				nextBillingDate:subData.nextBillingDate
			}
		});
		
	}else if(rubric === "devices" && typeOf(data) === "array" && typeOf(data[0]) === "object"){
		var newList = [];
		if(typeOf(data[0].devices) === "array"){
			
			var list = data[0].devices;
			var i, l = list.length, device;
			for(i=0;i<l;i++){
				
				device = list[i];
				newList.push({
					type:device.type ? device.type : "",
					name:device.name,
					publicKey:device.publicKey ? device.publicKey.substr(device.publicKey.length-6, device.publicKey.length) : ""
				});
			}
		}
		callback({list:newList});
		
    }else{
        callback();
    }
};

/**
 * @author Frank Varnava (DOTSCREEN)
 * @description 
 * @param {jQuery Object} $item The current focused element
 */
Model.addRemoveInWatchList = function(data, type, isEpisode){
	var dataToUse = isEpisode ? Dash.seriesData : Dash.data;
	if(dataToUse.isInWishList){
		API.removeFromMediaLists(User.data.uid, User.mediaListsId.wishList, dataToUse.itemIdInList.wishList, {headers:{Authorization:'Bearer ' + User.data.accessToken}, type:"DELETE"}, function(data, jqXHR){
			if(jqXHR.status === 204){
				if(isEpisode){
					Dash.seriesData.isInWishList = false;
				}else{
					Dash.data.isInWishList = false;
				}
				
				if([Section.sections[7], Section.sections[8]].indexOf(Section.name) !== -1){
					$(document.getElementById("dashboard-watchlist-button")).children().html(LANG.getStr("watchlist_button_add"));
				}
			}
		});
		
	}else{

		if(Dash.type === "movie"){		
			API.addInMediaLists(User.data.uid, User.mediaListsId.wishList, {headers:{Authorization:'Bearer ' + User.data.accessToken}, data:JSON.stringify({
			"index":"1",
			"playbackTime":0,
			"programType":type,
			"rankOrder":0,
			"titleId":Dash.data.titleIdFull,
			"seasonNumber": "",
			"episodeNumber": ""
		}), type:"POST"}, function(data, jqXHR){
				if(jqXHR.status === 200 && typeOf(data) === "object" && data.itemId){
					Dash.data.isInWishList = true;
					Dash.data.itemIdInList.wishList = data.itemId;

					if([Section.sections[7], Section.sections[8]].indexOf(Section.name) !== -1){
						$(document.getElementById("dashboard-watchlist-button")).children().html(LANG.getStr("watchlist_button_remove"));
					}				
				}
			});			
		}else if(Dash.type === "serie"){

			API.addInMediaLists(User.data.uid, User.mediaListsId.wishList, {headers:{Authorization:'Bearer ' + User.data.accessToken}, data:JSON.stringify({
			"index":"1",
			"playbackTime":0,
			"programType":type,
			"rankOrder":0,
			"titleId":Dash.data.titleIdFull,
			"seasonNumber": "",
			"episodeNumber": ""
		}), type:"POST"}, function(data, jqXHR){
				if(jqXHR.status === 200 && typeOf(data) === "object" && data.itemId){
					Dash.data.isInWishList = true;
					Dash.data.itemIdInList.wishList = data.itemId;

					if([Section.sections[7], Section.sections[8]].indexOf(Section.name) !== -1){
						$(document.getElementById("dashboard-watchlist-button")).children().html(LANG.getStr("watchlist_button_remove"));
					}
				}
			});
		}else{

			API.addInMediaLists(User.data.uid, User.mediaListsId.wishList, {headers:{Authorization:'Bearer ' + User.data.accessToken}, data:JSON.stringify({
			"index":"1",
			"playbackTime":0,
			"programType":type,
			"rankOrder":0,
			"titleId":Dash.seriesData.titleIdFull,
			"seasonNumber": "",
			"episodeNumber": ""
		}), type:"POST"}, function(data, jqXHR){
				if(jqXHR.status === 200 && typeOf(data) === "object" && data.itemId){
					Dash.seriesData.isInWishList = true;
					Dash.seriesData.itemIdInList.wishList = data.itemId;

					if([Section.sections[7], Section.sections[8]].indexOf(Section.name) !== -1){
						$(document.getElementById("dashboard-watchlist-button")).children().html(LANG.getStr("watchlist_button_remove"));
					}
				}
			});
		}
	}
};

/**
 * @author Theo (DOTSCREEN)
 * @description add or remove media of the whish list
 * @param {Object} data data of media
 * @param {string} type type of media
 */
Model.addRemoveInWatchListSinceTrailerPlaylist = function(data, type){
	type = data.type === "Series" ? "serie" : data.type === "Episodes" ? "episode" : "movie";
	if(data.isInWishList){
		API.removeFromMediaLists(User.data.uid, User.mediaListsId.wishList, data.itemIdInList.wishList, {headers:{Authorization:'Bearer ' + User.data.accessToken}, type:"DELETE"}, function(data, jqXHR){
			if(jqXHR.status === 204){
				Player.playlistTrailer[Player.playlistIndex].isInWishList = false;
				$(document.getElementById("watchlist-button-splash")).children().html(LANG.getStr("watchlist_button_add"));
			}
		});
	}else{
		if(type === "movie"){
			API.addInMediaLists(User.data.uid, User.mediaListsId.wishList, {headers:{Authorization:'Bearer ' + User.data.accessToken}, data:JSON.stringify({
			"index":"1",
			"playbackTime":0,
			"programType":type,
			"rankOrder":0,
			"titleId":data.titleId,
			"seasonNumber": "",
			"episodeNumber": ""
		}), type:"POST"}, function(data, jqXHR){
				if(jqXHR.status === 200 && typeOf(data) === "object" && data.itemId){
					Player.playlistTrailer[Player.playlistIndex].isInWishList = true;
					Player.playlistTrailer[Player.playlistIndex].itemIdInList.wishList = data.itemId;
					$(document.getElementById("watchlist-button-splash")).children().html(LANG.getStr("watchlist_button_remove"));
				}
			});
		}else if(type === "serie"){

			API.addInMediaLists(User.data.uid, User.mediaListsId.wishList, {headers:{Authorization:'Bearer ' + User.data.accessToken}, data:JSON.stringify({
			"index":"1",
			"playbackTime":0,
			"programType":type,
			"rankOrder":0,
			"titleId":data.titleId,
			"seasonNumber": "",
			"episodeNumber": ""
		}), type:"POST"}, function(data, jqXHR){
				if(jqXHR.status === 200 && typeOf(data) === "object" && data.itemId){
					Player.playlistTrailer[Player.playlistIndex].isInWishList = true;
					Player.playlistTrailer[Player.playlistIndex].itemIdInList.wishList = data.itemId;
					$(document.getElementById("watchlist-button-splash")).children().html(LANG.getStr("watchlist_button_remove"));
				}
			});
		}
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the API for a season, then launches the callback function
 * @param {Object} data The data
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Function} callback The function which will be triggered after data processing
 * @param {Integer} season The season
 */

Model.getPayloadData = function(data, clientID, jqXHR, callback){
	if(typeOf(data) === "object" && readCookie("LockControl_" + clientID) && readCookie("LockId_" + clientID) && readCookie("LockEncr_" + clientID)){
		callback();
	}else{
        
    }
};

/**
 * @author Frank Varnava (DOTSCREEN)
 * @description 
 * @param {jQuery Object} $item The current focused element
 */
 
Model.getPlaylistTrailer = function() {
    Player.resetPlaylistTrailer();

    json.load({
        url: Config.versions[Config.version].domain + "mediaCatalog/layout?byScheme=urn:peg:layoutBigHomePage",
        timeout: Config.superhome_timeout,
        callback: function(data, jqXHR) {

            if (typeOf(data) === "object" && typeOf(data.titles) === "array" && typeOf(data.titles[0].layoutTitles) === "object" && typeOf(data.titles[0].layoutTitles.titles) === "array") {

                var titlesPlaylist = data.titles[0].layoutTitles.titles;
                var i, l = titlesPlaylist.length,
                    item, j, contentItem;

                for (i = 0; i < l; i++) {

                    item = titlesPlaylist[i];

                    var parentalControlGood = true;
                    if(User.data && User.data.userDetails.settings.parentalControl){
                        parentalControlGood = parseInt(User.data.userDetails.settings.parentalControl) >= parseInt(item.arAgeRating);
                    }
                    if (typeOf(item) === "object" && typeOf(item.media) === "array" && typeOf(item.media[0] && item.media[0].content) === "array" && item.media[0].content.length > 0 && "Episodes"!== getItemType(item) && parentalControlGood) {

                        contentItem = item.media[0].content;

                        for (j = 0; j < contentItem.length; j++) {

                            if (contentItem[j].assetTypes[0] === "hss_t01_movie_vu" ||
                                contentItem[j].assetTypes[1] === "hss_t01_movie_vu" ||
                                contentItem[j].assetTypes[0] === "hss_t01_series_vu" ||
                                contentItem[j].assetTypes[1] === "hss_t01_series_vu") {
                                item.trailerInfos = {
                                    streamingUrl : contentItem[j].streamingUrl,
                                    releasesUrl: contentItem[j].streamingUrl,
                                };
                                item.subtitles = null;
                                Player.playlistTrailer.push(item);
                            }
                        }
                    }
                }

                if(!Player.playlistTrailer.length){
					Main.launchMenuGenerating();
                }else{
                    Player.playlistTrailerActive = true;
                    var media = Player.playlistTrailer[Player.playlistIndex];

                    Model.launchTrailerOfPlaylist(media);
                }

            }else{
				Main.launchMenuGenerating();
            }
        }
    });
};

Model.launchTrailerOfPlaylist = function(data,callback){
	data.type = getItemType(data);
	var sectionToLoad = Section.getSectionNameForDashboard(data);
	var regex = new RegExp("/([0-9]+)$", "g"),
		results = regex.exec(data.titleId);
		
	API.getDashContent(Model.getWSForDash(sectionToLoad, {id:results[1]}), sectionToLoad, function(xhr, mediaData){
		if(mediaData){
			data.id = data.titleId;
			data.isInWishList = mediaData.isInWishList;
			if(!data.itemIdInList){
				data.itemIdInList = {wishList:null};
			}
			data.itemIdInList.wishList = mediaData.itemIdInList.wishList;

			if(data.isInWishList){
				$(document.getElementById("watchlist-button-splash")).children().html(LANG.getStr("watchlist_button_remove"));
			}else{
				$(document.getElementById("watchlist-button-splash")).children().html(LANG.getStr("watchlist_button_add"));
			}
			Player.launchStreaming(data, "trailer");
		}else{
			log("Je n'ai pas pu récupérer les data pour le media","error");
			if(Section.name){
				Navigation.handleReturnButton();
			}
		}
	});
};