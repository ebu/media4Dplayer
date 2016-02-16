var Model = {};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the API for menu, then launches the callback function
 * @param {Object} data The response returned by the request
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Function} callback The function which will be triggered after data processing
 */

Model.getAppsList = function(data, jqXHR, callback){
    if (typeOf(data) === "object" && typeOf(data.list) === "array") {
        callback(data.list, jqXHR);
		
    }else{
        callback(null, jqXHR);
    }
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the API for menu, then launches the callback function
 * @param {Object} data The response returned by the request
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Function} callback The function which will be triggered after data processing
 */

Model.getAppPlaylistsOfUser = function(data, jqXHR, callback){
    if (typeOf(data) === "object") {
        callback(data, jqXHR);
		
    }else{
        callback(null, jqXHR);
    }
};