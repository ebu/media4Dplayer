var API = {};

/* @description Launches a request to get the config json of the environnement
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

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request to get the submenu's data
 * @param {String} url The WS url
 * @param {String} section The section's name
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
 * @param {String} url The WS url
 * @param {String} section The section's name
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

API.getAppPlaylistsOfUser = function(url, appIndex, callback_function){
	if(json.cache["programs"] && json.cache["programs"].appIndex === appIndex){
		callback_function(json.cache["programs"]);
		
	}else{
		json.load({url:url, callback:function(data, jqXhr){
			Model.getAppPlaylistsOfUser(data, jqXhr, callback_function);
		}});
	}
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