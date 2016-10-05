var json = {
	cache:{}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches a request, then call back a function after receiving the request response
 * @param {Object} params Contains parameters used to make the request
 */

json.load = function(params){
	var xhr = null;
	if(Main.networkDisconnected){
		if(typeOf(params.onError) === "function"){
			params.onError();
		}else{
			params.callback(null);
		}
		return;
	}
	if(typeOf(params) === "object" && typeOf(params.url) === "string" && typeOf(params.callback) === "function"){
		//log("lancement de la requete pour l'url "+params.url);
		var timeout = params.timeout || Config.jsonTimeout;
		xhr = $.ajax({
			url:params.url,
			type:params.type||"GET",
			timeout:timeout * 1000,
			async:typeOf(params.async)!=="boolean"?true:params.async,
			dataType: params.dataType || "json",
			contentType: params.contentType || "application/json; charset=utf-8",
			data:params.data,
			headers:params.headers||{},
			success: function(data, status, xhr){
				params.callback(data, xhr);
			},
			error : function(xhr, erreur, e){
				log("json.load() : "+erreur+" > "+e);
				if(typeOf(params.onError) === "function"){
					params.onError(xhr);
				}else{
					params.callback(null, xhr);
				}
			}
		});
	}
	return xhr;
};