var API = {};

																	/* **************************************/
																	/*	POUR L'INITIALISATION DE L'APPLI	*/
																	/* **************************************/

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to get the config json of the environnement
 * @param {String} env The environnement
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

API.getConfig = function(callback_function){
    json.load({
        url: "ressources/json/config.json",
        callback: function(data, xhr) {
			Config = data;
			callback_function();
        }
    });
};

																	/* ******************************/
																	/*	POUR LA GESTION DU COMPTE	*/
																	/* ******************************/

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to verify authentification informations of the user
 * @param {String} email The user email
 * @param {String} password The user password
 * @param {Function} callback The function which will be triggered after receiving data
 */

API.checkAccess = function(email, password, callback){
	json.load({url:Config.versions[Config.version].domain+"login?email="+email+"&password="+password, callback: function(data, xhr){
		Model.checkAccess(data, xhr, callback);
	}});
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to get details of the user
 * @param {String} userId The user's GUID
 * @param {Object} params The request's parameters
 * @param {Function} callback The function which will be triggered after receiving data
 */

API.getUserDetails = function(userId, params, callback){
	json.load({url:Config.versions[Config.version].domain+"userAccounts/"+userId, callback: function(data, xhr){
		callback(data, xhr);
	}, headers:params.headers});
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to get subscription informations of the user
 * @param {String} userId The user's GUID
 * @param {Object} params The request's parameters
 * @param {Function} callback The function which will be triggered after receiving data
 */

API.getSubscriptions = function(userId, params, callback){
	return json.load({url:Config.versions[Config.version].domain+"userAccounts/"+userId+"/billingAccounts/subscriptions", callback: function(data, xhr){
		callback(data, xhr);
	}, headers:params.headers});
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Updates the user language
 * @param {String} userId The user's GUID
 * @param {Object} params The request's parameters
 * @param {Function} callback The function which will be triggered after receiving data
 */

API.updateLanguage = function(userId, params, callback){
	json.load({url:Config.versions[Config.version].domain+"userAccounts/"+userId, callback: function(data, xhr){
		callback(data, xhr);
	}, headers:params.headers, type:"PUT", data:JSON.stringify({settings:{language:params.lang}})});
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to get all devices of the user
 * @param {String} userId The user's GUID
 * @param {Object} params The request's parameters
 * @param {Function} callback The function which will be triggered after receiving data
 */

API.getDevices = function(userId, params, callback){
	json.load({url:Config.versions[Config.version].domain+"userAccounts/"+userId+"/devices", callback: function(data, xhr){
		callback(data, xhr);
	}, headers:params.headers});
};

																	/* ******************************/
																	/*	POUR LA GESTION DES DEVICES	*/
																	/* ******************************/

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Registers and adds a device for a user.
 * @param {String} userId The user's GUID
 * @param {Object} params The request's parameters
 * @param {Function} callback The function which will be triggered after receiving data
 */

API.addDevice = function(userId, params, callback){
	return json.load({url:Config.versions[Config.version].domain+"userAccounts/"+userId+"/devices", callback: function(data, xhr){
		callback(data, xhr);
	}, headers:params.headers, type:"POST", data:params.data});
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Delete a user device
 * @param {String} userId The user's GUID
 * @param {String} deviceID The device ID
 * @param {Object} params The request's parameters
 * @param {Function} callback The function which will be triggered after receiving data
 */

API.removeDevice = function(userId, deviceID, params, callback){
	json.load({url:Config.versions[Config.version].domain+"userAccounts/"+userId+"/devices/"+deviceID, callback: function(data, xhr){
		callback(data, xhr);
	}, headers:params.headers, type:"DELETE"});
};

																	/* **********************/
																	/*	POUR LE SOUS-MENU	*/
																	/* **********************/

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to get the submenu's data
 * @param {String} url The WS url
 * @param {String} section The section's name
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

API.getSubmenuList = function(url, section, callback_function){
	if(json.cache["submenu"] && json.cache["submenu"][section] && json.cache["submenu"][section][LANG.codeLang]){
		callback_function(json.cache["submenu"][section][LANG.codeLang]);
		
	}else{
		json.load({url:url, callback:function(data, xhr){
			Model.getSubmenu(data, xhr, callback_function, section);
			
		}});
	}
};

																	/* ******************/
																	/*	POUR LA GRID	*/
																	/* ******************/

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to get the grid's data
 * @param {String} url The WS url
 * @param {Object} params The request's parameters
 * @param {String} section The section's name
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

API.getGridContent = function(url, params, section, callback_function){

	json.load({url:url, callback:function(data, xhr){
		Model.getGridContent(data, xhr, callback_function, section);

	}, headers:params.headers});
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to get the grid's data
 * @param {String} url The WS url
 * @param {Object} params The request's parameters
 * @param {String} section The section's name
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

API.getNextGridData = function(url, params, section, callback_function){

	json.load({url:url, callback:function(data, xhr){
		Model.getGridContent(data, xhr, callback_function, section);

	}, headers:params.headers});
};

																	/* ******************************/
																	/*	POUR LA HOME D'UNE SECTION	*/
																	/* ******************************/

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to get the data of the section's home
 * @param {String} url The WS url
 * @param {Object} filters Contains informations for filtered the received data
 * @param {Function} callback_function The function which will be triggered after receiving data
 * @param {String} section The section's name
 */

API.getHomeContent = function(url, filters, callback_function, section){
	if(json.cache[section] && json.cache[section][LANG.codeLang]){
		callback_function(json.cache[section][LANG.codeLang]);
		
	}else{
		json.load({url:url, callback:function(data, xhr){
			Model.getHomeContent(data, xhr, callback_function, filters, section);
		}});
	}
};

/**
 * @author Theo (DOTSCREEN)
 * @description Launches a request to get the data of the section's home since submenu
 * @param {String} url The WS url
 * @param {Object} filters Contains informations for filtered the received data
 * @param {Function} callback_function The function which will be triggered after receiving data
 * @param {String} section The section's name
 */
API.getHomeContentSubmenu = function(url, filters, callback_function, section){
	json.load({url:url, callback:function(data, xhr){
		Model.getHomeContentSubmenu(data, xhr, callback_function, filters, section);
	}});
};

																	/* **********************/
																	/*	POUR LA DASHBOARD	*/
																	/* **********************/

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to get the medias that is in the watch list of the user
 * @param {String} userId The user's GUID
 * @param {Object} params The request's parameters
 * @param {Function} callback The function which will be triggered after receiving data
 */

API.getMediaLists = function(userId, params, callback){
	return json.load({url:Config.versions[Config.version].domain+"userAccounts/"+userId+"/mediaLists", callback: function(data, xhr){
		callback(data, xhr);
	}, headers:params.headers});
};

/**
 * @author Franck VARNAVA (DOTSCREEN)
 * @description Inserts a media in the user watch list
 * @param {String} userId The user's GUID
 * @param {String} listId The list ID
 * @param {Object} params The request's parameters
 * @param {Function} callback The function which will be triggered after receiving data
 */

API.addInMediaLists = function(userId, listId, params, callback){
	return json.load({url:Config.versions[Config.version].domain+"userAccounts/"+userId+"/mediaLists/"+listId+"/items", callback: function(data, xhr){
		callback(data, xhr);
	}, headers:params.headers, type:params.type, data:params.data});
};

/**
 * @author Franck VARNAVA (DOTSCREEN)
 * @description Removes a media from the user watch list
 * @param {String} userId The user's GUID
 * @param {String} listId The list ID
 * @param {String} itemId The item ID
 * @param {Object} params The request's parameters
 * @param {Function} callback The function which will be triggered after receiving data
 */

API.removeFromMediaLists = function(userId, listId, itemId, params, callback){
	return json.load({url:Config.versions[Config.version].domain+"userAccounts/"+userId+"/mediaLists/"+listId+"/items/"+itemId, callback: function(data, xhr){
		callback(data, xhr);
	}, headers:params.headers, type:params.type});
};

/**
 * @author Theo CHAHINE (DOTSCREEN)
 * @description Update a media from the user watch list
 * @param {String} userId The user's GUID
 * @param {String} listId The list ID
 * @param {String} itemId The item ID
 * @param {Object} params The request's parameters
 * @param {Function} callback The function which will be triggered after receiving data
 */

API.updateFromMediaLists = function(userId, listId, itemId, params, callback){
	return json.load({url:Config.versions[Config.version].domain+"userAccounts/"+userId+"/mediaLists/"+listId+"/items/"+itemId, callback: function(data, xhr){
		callback(data, xhr);
	}, headers:params.headers, type:params.type, data:params.data});
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to get the data of a movie/serie
 * @param {Array} urls A list of urls list
 * @param {String} section The section's name
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

API.getDashContent = function(urls, section, callback_function){
	if(Main.networkDisconnected){
		Model.getDashContent(null, null, callback_function, section);
		return;
	}
	
	var def = this.getMultipleJSON(urls);
	$.when.apply($, def)
		.then(function(){
		Model.getDashContent(getWSResponseForMultipleRequests(arguments, urls.length, true), null, callback_function, section);
	}, function(){
		callback_function();
	});
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to update the media playback time
 * @param {Integer} time The playback time
 * @param {Function} callback The function which will be triggered after updating data
 */

API.updatePlaybackTime = function(time, callback, params){
	// log("updatePlaybackTime() : start; time = "+time);
	params = params || {};
	var datas = {};
	var xhr = null;
	if(!time){
		// adding
		if(Dash.type === "movie"){

			xhr = API.addInMediaLists(User.data.uid, User.mediaListsId.watchList, {headers:{Authorization:'Bearer ' + User.data.accessToken}, data:JSON.stringify({
			"itemId":Dash.data.id,
			"index":Dash.data.lastIndexInList.watchList + 1,
			"playbackTime":0,
			"programType":Dash.type,
			// "rankOrder":0,
			"titleId":Dash.data.titleIdFull,
			"seasonNumber": "",
			"episodeNumber": "",
			"userListId": API.userListPath + Dash.data.itemIdInList.watchList
		}), type:"POST"}, function(data, jqXHR){
				Player.xhr.updatePlaybackTime = null;
				if(jqXHR.status === 200 && typeOf(data) === "object" && data.itemId){
					// log("updatePlaybackTime: Ajout du film avec succès dans la watch list;", "blue");
					Dash.data.isInWatchList = true;
					Dash.data.itemIdInList.watchList = data.itemId;
					Dash.data.playbackTime = time / 1000;
					Dash.data.lastIndexInList.watchList++;

					Dash.showResumeWatchAgainBtn();
				}else{
					log("updatePlaybackTime: Echec d'ajout d'un film dans la watch list; typeOf(data) = "+typeOf(data), "error");
				}

				if(typeOf(callback) === "function"){
					callback();
				}
			});
		}else if(["serie","episode"].indexOf(Dash.type) !== -1){
			var seasonNumber, episodeNumber;
			if(Dash.type === "serie"){
				datas = Dash.data;
				seasonNumber = params.season || "1";
				episodeNumber = params.episode || "1";
			}else{
				datas = Dash.seriesData;
				seasonNumber = params.season || Dash.data.season;
				episodeNumber = params.episode || Dash.data.episode;
			}

			xhr = API.addInMediaLists(User.data.uid, User.mediaListsId.watchList, {headers:{Authorization:'Bearer ' + User.data.accessToken}, data:JSON.stringify({
			"itemId":datas.id,
			"index":datas.lastIndexInList.watchList + 1,
			"playbackTime":0,
			"programType":"series",
			// "rankOrder":0,
			"titleId":datas.titleIdFull,
			"seasonNumber": seasonNumber,
			"episodeNumber": episodeNumber,
			"userListId": API.userListPath + datas.itemIdInList.watchList
		}), type:"POST"}, function(data, jqXHR){
				Player.xhr.updatePlaybackTime = null;
				if(jqXHR.status === 200 && typeOf(data) === "object" && data.itemId){
					// log("updatePlaybackTime: Ajout avec succès de l'épisode "+episodeNumber+" de la saison "+seasonNumber+" de la série dans la watch list;", "blue");
					datas.isInWatchList = true;
					datas.itemIdInList.watchList = data.itemId;
					datas.playbackTime = time / 1000;
					Dash.data.playbackTime = datas.playbackTime;
					datas.lastIndexInList.watchList++;
					datas.seasonNumberInWatchList = seasonNumber;
					datas.episodeNumberInWatchList = episodeNumber;

					if(Dash.type === "serie"){
						Dash.data = datas;
					}else{
						Dash.seriesData = datas;
					}

					Dash.showResumeWatchAgainBtn();
				}else{
					// log("updatePlaybackTime: Echec d'ajout de l'épisode "+episodeNumber+" de la saison "+seasonNumber+" dans la watch list; typeOf(data) = "+typeOf(data), "error");
					log("updatePlaybackTime; status = "+jqXHR.status + " : "+jqXHR.statusText, "error");
				}

				if(typeOf(callback) === "function"){
					callback();
				}
			});
		}
	}else{
		// update
		if(Dash.type === "movie"){
			xhr = API.updateFromMediaLists(User.data.uid, User.mediaListsId.watchList, Dash.data.itemIdInList.watchList,{headers:{Authorization:'Bearer ' + User.data.accessToken},data:JSON.stringify({
				"itemId":Dash.data.id,
				"index":Dash.data.lastIndexInList.watchList + 1,
				"playbackTime":time / 1000,
				"programType":Dash.type,
				// "rankOrder":0,
				"titleId":Dash.data.titleIdFull,
				"seasonNumber": "",
				"episodeNumber": "",
				"userListId": API.userListPath + Dash.data.itemIdInList.watchList
			}), type:"PUT"}, function(data, jqXHR){
				Player.xhr.updatePlaybackTime = null;
				if(jqXHR.status === 204){
					// log("updatePlaybackTime: MAJ du film avec succès dans la watch list;", "blue");
					Dash.data.isInWatchList = true;
					Dash.data.playbackTime = time / 1000;
					Dash.data.lastIndexInList.watchList++;

					Dash.showResumeWatchAgainBtn();
				}else{
					// log("updatePlaybackTime: Echec de MAJ de la watch list pour un film", "error");
					log("updatePlaybackTime; status = "+jqXHR.status + " : "+jqXHR.statusText, "error");
				}

				if(typeOf(callback) === "function"){
					callback();
				}
			});
		}else if(["serie","episode"].indexOf(Dash.type) !== -1){
			if(Dash.type === "serie"){
				datas = Dash.data;
			}else{
				datas = Dash.seriesData;
			}
			xhr = API.updateFromMediaLists(User.data.uid, User.mediaListsId.watchList, datas.itemIdInList.watchList,{headers:{Authorization:'Bearer ' + User.data.accessToken},data:JSON.stringify({
				"itemId":datas.id,
				"index":datas.lastIndexInList.watchList + 1,
				"playbackTime":time / 1000,
				"programType":"series",
				// "rankOrder":0,
				"titleId":datas.titleIdFull,
				"seasonNumber": datas.seasonNumberInWatchList,
				"episodeNumber": datas.episodeNumberInWatchList,
				"userListId": API.userListPath + datas.itemIdInList.watchList
			}), type:"PUT"}, function(data, jqXHR){
				Player.xhr.updatePlaybackTime = null;
				if(jqXHR.status === 204){
					datas.isInWatchList = true;
					datas.playbackTime = time / 1000;
					Dash.data.playbackTime = datas.playbackTime;
					datas.lastIndexInList.watchList++;
					// log("updatePlaybackTime: MAJ avec succès de l'épisode "+datas.episodeNumberInWatchList+" de la saison "+datas.seasonNumberInWatchList+" dans la watch list;", "blue");
					
					if(Dash.type === "serie"){
						Dash.data = datas;
					}else{
						Dash.seriesData = datas;
					}

					Dash.showResumeWatchAgainBtn();
				}else{
					// log("updatePlaybackTime: Echec de MAJ de la watch list pour l'épisode "+datas.episodeNumberInWatchList+" de la saison "+datas.seasonNumberInWatchList+" d'une serie", "error");
					log("updatePlaybackTime; status = "+jqXHR.status + " : "+jqXHR.statusText, "error");
				}

				if(typeOf(callback) === "function"){
					callback();
				}
			});
		}
	}
	return xhr;
};

/**
 * @author Theo (DOTSCREEN)
 * @description Launches a request to update the media playback after 90%
 * @param {Function} callback The function which will be triggered after updating data
 */
API.updatePlaybackTimeAtTheEnd = function(callback){
	if(!API.playbackTimeAtTheEndUpdated){
		API.playbackTimeAtTheEndUpdated = true;
		var isEpisode = Dash.type.search(/episode/i) !== -1;
		var dataToUse = isEpisode ? Dash.seriesData : Dash.data;

		// Si c'est une série et qu'il y a un épisode après, ajoute cette épisode à la watch list
		if(Dash.type.search(/episode|serie/i) !== -1 && dataToUse.seasonNumberInWatchList && dataToUse.episodeNumberInWatchList){

			// Tente de savoir si il y un autre épisode après celle-ci dans cette saison
			var data = getNextEpisode(Dash.episodes[dataToUse.seasonNumberInWatchList].titles, dataToUse.episodeNumberInWatchList);
			InfoBanner.prepareDisplayNextEpisode(data);
			if(typeOf(data) === "object"){
				// log('updatePlaybackTimeAtTheEnd tvSeasonEpisodeNumber = '+ data.tvSeasonEpisodeNumber);
				if(isEpisode){
					// log('updatePlaybackTimeAtTheEnd episodeNumberInWatchList = '+Dash.seriesData.episodeNumberInWatchList);
					Dash.seriesData.episodeNumberInWatchList = data.tvSeasonEpisodeNumber;

				}else{
					// log('updatePlaybackTimeAtTheEnd episodeNumberInWatchList = '+Dash.data.episodeNumberInWatchList);
					Dash.data.episodeNumberInWatchList = data.tvSeasonEpisodeNumber;
				}
				API.addNextEpisodeInWatchList({season:dataToUse.seasonNumberInWatchList,episode:data.tvSeasonEpisodeNumber}, callback);
			}else{

				// log('updatePlaybackTimeAtTheEnd no data => first episode');
				// Tente de récupérer les data du 1er épisode de la prochaine saison
				var indexCurrentSeason = Dash.seasons.indexOf(parseInt(dataToUse.seasonNumberInWatchList, 10));
				var nextSeason = Dash.seasons[indexCurrentSeason+1];
				if(nextSeason){

					var firstEpisode = Dash.episodes[nextSeason].titles[0];
					InfoBanner.prepareDisplayNextEpisode(firstEpisode);
					if(typeOf(firstEpisode) === "object"){
						API.addNextEpisodeInWatchList({season:nextSeason,episode:firstEpisode.tvSeasonEpisodeNumber}, callback);
					}else{
						API.addInWatchedList(callback);
					}

				}else{
					API.addInWatchedList(callback);
				}
			}
		}else{
			API.addInWatchedList(callback);
		}
	}else if(callback){
		callback();
	}
};



/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to add the media in the watched list
 * @param {Function} callback The function which will be triggered after updating data
 */

API.addInWatchedList = function(callback){
	// log("addInWatchedList() : start");
	var requestEnded = 0;
	var datas = Dash.data;
	if(Dash.type === "episode"){
		datas = Dash.seriesData;
	}
	// Doit enlever le media de la watch list et l'ajouter à la watched list si on arrive à la fin de la vidéo
	API.removeFromMediaLists(User.data.uid, User.mediaListsId.watchList, datas.itemIdInList.watchList, {headers:{Authorization:'Bearer ' + User.data.accessToken}, type:"DELETE"}, function(data, jqXHR){
		requestEnded++;
		if(jqXHR.status === 204){
			log("addInWatchedList removeFromMediaLists: Suppression de la Watch list réussie", "blue");
		}else{
			// log("addInWatchedList removeFromMediaLists: Echec de suppression de la watch list pour l'épisode "+datas.episodeNumberInWatchList+" de la saison "+datas.seasonNumberInWatchList+" d'une serie", "error");
			log("addInWatchedList removeFromMediaLists; status = "+jqXHR.status + " : "+jqXHR.statusText, "error");
		}

		if(Dash.type === "episode"){
			Dash.seriesData.isInWatchList = false;
			Dash.seriesData.playbackTime = 0;
		}else{
			Dash.data.isInWatchList = false;
			Dash.data.playbackTime = 0;
		}
		if(typeOf(callback) === "function" && requestEnded === 2){
			callback();
		}
	});

	var programType = Dash.type === "movie" ? "movie" : "series";
	API.addInMediaLists(User.data.uid, User.mediaListsId.watchedList, {headers:{Authorization:'Bearer ' + User.data.accessToken}, data:JSON.stringify({
		"itemId":datas.id,
		"index":"1",
		"playbackTime":0,
		"programType":programType,
		// "rankOrder":0,
		"titleId":datas.titleIdFull,
		"seasonNumber": "",
		"episodeNumber": ""
		}), type:"POST"}, function(data, jqXHR){
			requestEnded++;
			if(jqXHR.status === 200 && typeOf(data) === "object" && data.itemId){
				// log("addInWatchedList addInMediaLists Ajout de la Watched list réussie++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
				if(Dash.type === "episode"){
					Dash.seriesData.isInWatchedList = true;
					Dash.seriesData.itemIdInList.watchedList = data.itemId;
					Dash.seriesData.lastIndexInList.watchedList++;
				}else{
					Dash.data.isInWatchedList = true;
					Dash.data.itemIdInList.watchedList = data.itemId;
					Dash.data.lastIndexInList.watchedList++;
				}

				if(["movie dashboard","tvseries dashboard"].indexOf(Section.name) !== -1){
					Dash.showResumeWatchAgainBtn();
				}

			}else{
				// log("addInWatchedList addInMediaLists: Echec d'ajout de la Watched list. status = "+jqXHR.status);
				log("addInWatchedList addInMediaLists; status = "+jqXHR.status + " : "+jqXHR.statusText, "error");
			}

			if(typeOf(callback) === "function" && requestEnded === 2){
				callback();
			}
	});
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to add the media in the watched list
 * @param {Function} callback The function which will be triggered after updating data
 */

API.addNextEpisodeInWatchList = function(params, callback){
	// Doit enlever le media de la watch list et l'ajouter à la watched list si on arrive à la fin de la vidéo
    var dashTarget = null,
        episode = null,
        saison = null;
    if (Dash.type === "serie") {
        dashTarget = Dash.data;
        episode = Dash.data.episodeNumberInWatchList;
        season = Dash.data.seasonNumberInWatchList;
    } else {
        dashTarget = Dash.seriesData;
        episode = Dash.data.episode;
        season = Dash.data.season;
    }
    // log("addNextEpisodeInWatchList");
    var xhr = API.removeFromMediaLists(User.data.uid, User.mediaListsId.watchList, dashTarget.itemIdInList.watchList, {
        headers: {
            Authorization: 'Bearer ' + User.data.accessToken
        },
        type: "DELETE"
    }, function(data, jqXHR) {
        if (jqXHR.status === 204) {
            log("addNextEpisodeInWatchList: Suppression de la Watch list réussie", "blue");
        } else {
            // log("addNextEpisodeInWatchList: Echec de suppression de la watch list pour l'épisode l'épisode " + episode + " de la saison " + season, "error");
            log("addNextEpisodeInWatchList; status = " + jqXHR.status + " : " + jqXHR.statusText, "error");
        }
        if (Dash.type === "serie") {
            Dash.data.isInWatchList = false;
            Dash.data.playbackTime = 0;
        } else {
            Dash.seriesData.isInWatchList = false;
            Dash.seriesData.playbackTime = 0;
        }
        API.updatePlaybackTime(0, callback, params);
    });
    return xhr;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to get an episode of a serie
 * @param {Object} params The request's parameters
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

API.getEpisode = function(params, callback){
	// log("getEpisode start");
	if(typeOf(callback) === "function"){
		json.load({url:Config.versions[Config.version].domain+"mediaCatalog/titles/series/"+params.id+"/seasons/"+params.season+"/episodes/"+params.episode + getParentalControlFilter().replace("&","?"), callback:function(data, xhr){
			if(typeOf(data) === "object" && typeOf(data.titles) === "array"){

				var item = data.titles[0];
				if(typeOf(item) === "object" && typeOf(item.media) === "array" && typeOf(item.media[0]) === "object"){
					callback({
						streamingInfos: getMediaUrl(item.media[0].content, ["hss_playready_vu"]),
						subtitles: getSubtitlesData(item.media[0].content, ["dfxp_ar_vu", "dfxp_en_vu"], ["ara", "eng"]),
						tvSeasonNumber:item.tvSeasonNumber,
						tvSeasonEpisodeNumber:item.tvSeasonEpisodeNumber
					});
				}else{
					callback();
				}
			}else{
				callback();
			}			
		}});		
	}else{
		callback();
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the API for the dashboard, then launches the callback function
 * @param {Object} data The response returned by the request
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Function} callback The function which will be triggered after data processing
 * @param {String} section The section name
 */

API.getAllSeasons = function(id, seasons, callback_function){
	var url = Config.versions[Config.version].domain+"mediaCatalog/titles/series/"+id+"/seasons/";
	var urls = [];
	var i, l = seasons.length;
	for(i=0;i<l;i++){
		urls.push(url + seasons[i] + "/episodes" + getParentalControlFilter().replace("&","?"));
	}
	
	var def = this.getMultipleJSON(urls);
	$.when.apply($, def)
		.then(function(){
		callback_function(getWSResponseForMultipleRequests(arguments, urls.length, true));
	}, function(){
		callback_function();
	});	
};

																	/* ******************/
																	/*	POUR SETTINGS	*/
																	/* ******************/

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to get the submenu's data
 * @param {Array} urls A list of urls list
 * @param {Integer} rubric The rubric's name of the section
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

API.getWSForASetting = function(urls, rubric, callback_function){
	if(Main.networkDisconnected){
		Model.getASettingData(null, rubric, callback_function);
		return;
	}
	
	var def = this.getMultipleJSON(urls);
	$.when.apply($, def)
		.then(function(){
		Model.getASettingData(getWSResponseForMultipleRequests(arguments, urls.length), rubric, callback_function);
	}, function(){
		callback_function();
	});
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Updates the user's parental control
 * @param {Object} params The request's parameters
 */

API.setThreshold = function(params){
	json.load(params);
};

																	/* ******************/
																	/*	POUR LE PLAYER	*/
																	/* ******************/

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to release a play back video
 * @param {Array} url The WS url
 * @param {String} clientID The client ID
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

API.getLockData = function(url, clientID, callback_function){
	
	if(typeof(callback_function) === "function"){
		return json.load({url:url.replace("http","https")+"?auth="+User.data.pegMediaAccessToken+"&clientid="+clientID+"&Tracking=true&Embedded=true&formats=M3U&format=SMIL", callback:function(data, jqXHR){
			callback_function($.parseXML(jqXHR.responseText), jqXHR);
		}});
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to inform the Concurrency service that a concurrency lock is still in use
 * @param {Object} params The request's parameters
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

API.updateLock = function(params, callback_function){
	
	if(typeof(callback_function) === "function"){
		json.load({url:params.concurrencyServiceUrl+"/web/Concurrency/update?_clientId"+"="+encodeURIComponent(params.clientID)+"&_id="+encodeURIComponent(params.lockId)+"&_sequenceToken="+encodeURIComponent(params.lockSequenceToken)+"&_encryptedLock="+encodeURIComponent(params.lock)+"&form=json&schema=1.0", callback:function(data, xhr){
				callback_function(data, xhr);
		}});
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to release a concurrency lock
 * @param {Object} params The request's parameters
 */

API.unlock = function(params){
	
	json.load({url:params.concurrencyServiceUrl+"/web/Concurrency/unlock?_clientId="+encodeURIComponent(params.clientID)+"&_id="+encodeURIComponent(params.lockId)+"&_sequenceToken="+encodeURIComponent(params.lockSequenceToken)+"&_encryptedLock="+encodeURIComponent(params.lock)+"&form=json&schema=1.0", callback:function(data, jqXHR){
		if(typeOf(data) === "object" && typeOf(data.unlockResponse) === "object"){
			// log("API.unlock() : release concurrency is done !!!");
		}else{
			// log("API.unlock() : ERROR > release concurrency failed ("+jqXHR.responseText+")");
		}
	}});
};

																	/* **********************/
																	/*	 AUTRES FONCTIONS	*/
																	/* **********************/

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to get mutiple JSON
 * @param {Array} list Params's list for each request
 * @return {Array} list of jQuery Ajax object
 */

API.getMultipleJSON = function(list){
	$.Deferred();
    var deferreds = [];
    var i, l = list.length;
    for(i=0;i<l;i++){
		if(typeOf(list[i]) === "string"){
			deferreds.push($.ajax({
				url:list[i],
				timeout:Config.jsonTimeout * 1000
			}));	
		}else{		
			deferreds.push($.ajax(list[i]));
		}
    }

    return deferreds;
};