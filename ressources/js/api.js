var API = {};

/* @description Launches a request to get the config json of the environnement
 * @param {String} env The environnement
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

API.getConfig = function(callback_function){
    json.load({
        url: "ressources/json/config.json",
        callback: function(data) {
			Config = data;
			callback_function();
        }
    });
};

/* @description Launches a request to get the config json of the environnement
 * @param {String} env The environnement
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

API.loadConfigurationSet = function(callback_function){
	json.load({
        url: Config.perfectMemoryWS + "configuration/sets",
		headers: {
			"Accept-language":"fr"
		},
        callback: function(data) {
			console.log(data);
			
			if(typeOf(callback_function) === "function"){
				callback_function(data);
			}
        }
    });
};

/* @description Launches a request to get the config json of the environnement
 * @param {String} env The environnement
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

API.getUserTokens = function(callback_function){
	json.load({
        url: Config.perfectMemoryWS + "tokens",
		type:"post",
		headers: {
		    "Authorization": "Basic " + btoa("guest:fEjebruph3zA")
		},
        callback: function(data) {
			console.log(data);
			if(typeOf(data) === "object"){
				User.tokens = data;
			}
			
			if(typeOf(callback_function) === "function"){
				callback_function();
			}
        },
		onError:function(){
			
		}
    });
};

/* @description Launches a request to get the config json of the environnement
 * @param {String} env The environnement
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

API.getMediasList = function(callback_function){
	json.load({
        url: Config.perfectMemoryWS + "medias?auth_token=" + User.tokens.auth_token + "&types=movie&max_count=10&offset=0",
        callback: function(data) {
			console.log(data);
			
			if(typeOf(callback_function) === "function"){
				callback_function(data);
			}
        },
		headers: {
			"Accept-language":"fr"
		}
    });
};

/* @description Launches a request to get the config json of the environnement
 * @param {String} env The environnement
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

API.autocomplete = function(term, method, callback_function){
	if(method === "content"){
		json.load({
			url: Config.TSPWS,
			callback: function(data) {
				if(typeOf(callback_function) === "function"){
					callback_function(data);
				}
			},
			type:"post",
			data:{type:"autocomplete",phrase:term},
			contentType:"application/x-www-form-urlencoded"
		});
		
	}else if(typeOf(callback_function) === "function"){
		callback_function();
	}
};

/* @description Launches a request to get the config json of the environnement
 * @param {String} env The environnement
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

API.getTermsOfAffination = function(term, method, callback_function){
	if(method === "content"){
		json.load({
			url: Config.TSPWS,
			callback: function(data) {
				Model.getTermsOfAffination(method, data, callback_function);
			},
			type:"post",
			data:{type:"wordCloud",phrase:term},
			contentType:"application/x-www-form-urlencoded"
		});
		
	}else if(typeOf(callback_function) === "function"){
		callback_function();
	}
};

/* @description Launches a request to get the config json of the environnement
 * @param {String} env The environnement
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

API.getResults = function(term, method, callback_function){
	if(typeOf(callback_function) === "function"){
		if(method === "content"){
			json.load({
				url: Config.TSPWS,
				callback: function(data) {

					var urls = Model.getUrlsListForSearch(method, data);
					if(urls.length){

						var def = API.getMultipleJSON(urls);
						$.when.apply($, def)
							.then(function(){
							Model.getResults(getWSResponseForMultipleRequests(arguments, urls.length), callback_function);

						}, function(){
							callback_function();
						});

					}else{
						callback_function();
					}
				},
				type:"post",
				data:{type:"query",phrase:term},
				contentType:"application/x-www-form-urlencoded"
			});

		}else{
			callback_function();
		}
	}
};

/* @description Launches a request to get the config json of the environnement
 * @param {String} env The environnement
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

API.getMedia = function(id, callback_function){
	json.load({
        url: Config.perfectMemoryWS + "medias/"+id+"?auth_token=" + User.tokens.auth_token,
        callback: function(data) {
			console.log(data);
			
			if(typeOf(callback_function) === "function"){
				callback_function(data);
			}
        },
		headers: {
			"Accept-language":"fr"
		}
    });
};

/* @description Launches a request to get the config json of the environnement
 * @param {String} env The environnement
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

API.searchMedia = function(term, callback_function){
    json.load({
        url: Config.perfectMemoryWS + "medias/search?auth_token=" + User.tokens.auth_token,
		type:"post",
        callback: function(data) {
			console.log(data);
			
			if(typeOf(callback_function) === "function"){
				callback_function(data);
			}
        },
		headers: {
			"Accept-language":"fr"
		},
		data:JSON.stringify({"max_count":30,"offset":0,"filters":[],"sort_order":-1,"sort_fields":"created_at",value:term})
    });
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to get the apps list
 * @param {String} url The WS url
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

API.getAppsList = function(url, callback_function){
	if(json.cache["apps"]){
		callback_function(json.cache["apps"]);
		
	}else{
		json.load({url:url, callback:function(data, jqXhr){
			Model.getAppsList(data, jqXhr, callback_function);
		}});
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to get the submenu's data
 * @param {Array} urls A list of program's url
 * @param {Integer} appIndex The app position in apps list
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

API.getAppPlaylistsOfUser = function(urls, appIndex, callback_function){
	/*if(json.cache["programs"] && json.cache["programs"].appIndex === appIndex){
		callback_function(json.cache["programs"]);
		
	}else{
		json.load({url:url, callback:function(data, jqXhr){
			Model.getAppPlaylistsOfUser(data, jqXhr, callback_function);
		}, dataType:"xml",contentType:"text/xml; charset=utf-8"});*/
		var def = this.getMultipleJSON(urls);
		$.when.apply($, def)
			.then(function(){
			Model.getAppPlaylistsOfUser(getWSResponseForMultipleRequests(arguments, urls.length), null, callback_function);
		}, function(){
			callback_function();
		});		
	//}
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