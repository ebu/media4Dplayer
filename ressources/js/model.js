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
    if (typeOf(data) === "array") {

           callback({
			   favorites:[
				   this.getProgramDetails(data[0]),this.getProgramDetails(data[1]),this.getProgramDetails(data[2]),this.getProgramDetails(data[3]), this.getProgramDetails(data[4])]}, jqXHR);
    } else {
		callback(null, jqXHR);
        log("Subtitles.load.callback; status = " + jqXHR.status + " : " + jqXHR.statusText, "error");
    }
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the API for menu, then launches the callback function
 * @param {Object} data The response returned by the request
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Function} callback The function which will be triggered after data processing
 */

Model.getProgramDetails = function(data){

	var program = {
		"title": data.title || "Titre inconnu",
		"subtitle": data.label || "",
		"detail": this.getProgramDetails.getDetails(data.types ? data.types[data.types.length-1] : null, data.created_at, data.duration),
		"thumbnail":this.getProgramDetails.getThumbnail(data.thumbnails) || "",
		"picture": this.getProgramDetails.getThumbnail(data.thumbnails) || "",
		"synopsis": data.description || "",
		"relatedContent":[]
	};

	var metadata = function(){
		if(typeOf(data.properties) === "array"){
			for(var i = 0;i<data.properties.length;i++){
				var prop = data.properties[i];
				if(prop.predicate && prop.predicate.label === "Metadata" && prop.value){
					return JSON.parse(prop.value);
				}
			}
		}
	}();

	program.video = {
		links:this.getProgramDetails.getLinkDetails(metadata)
	};
	program.video.subtitlesList = program.video.links.dataMain.subtitle ? ["Français"] : null;
	program.video.audioDescriptions = !isEmpty(program.video.links.dataAD) ? [{"lang":"Français", "url":program.video.links.dataAD.url}] : null;
	program.video.ls = !isEmpty(program.video.links.dataLS) ? ["LSF"] : null;
	program.video.audiosList = this.getProgramDetails.getAudiosList(program.video.links);

	program.video.hasEA3DIStream = program.video.links.dataEA.url && program.video.links.dataDI.url ? true : false;
	program.video.hasMCStream = program.video.links.dataMC.url ? true : false;

	return program;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the API for menu, then launches the callback function
 * @param {Object} data The response returned by the request
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Function} callback The function which will be triggered after data processing
 */

Model.getProgramDetails.getDetails = function(programType, startDate, duration){

	var type = this.getDetails.programType(programType);

	var date;
	if(startDate){
		var stringDate = startDate.split("-");
		stringDate[2] = stringDate[2].split("T")[0];
		date = new Date(stringDate[0], stringDate[1]-1, stringDate[2]);
	}

	return {type:type, date:{d:date.getDate(), m:date.getMonth()+1, y:date.getFullYear()}, duration:{h:Math.floor(duration / 60 / 60), m:Math.floor(duration / 60), s:Math.floor(duration % 60)}};
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the API for menu, then launches the callback function
 * @param {Object} data The response returned by the request
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Function} callback The function which will be triggered after data processing
 */

Model.getProgramDetails.getDetails.programType = function(programType){
	var types = Config.programTypes;
	return types[programType] ? types[programType] : programType ? programType : "Genre inconnu";
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the API for menu, then launches the callback function
 * @param {Object} data The response returned by the request
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Function} callback The function which will be triggered after data processing
 */

Model.getProgramDetails.getLinkDetails = function(list){
	var data = {
		dataMain:{},
		dataLS:{},
		dataAD:{},
		dataEA:{},
		dataDI:{},
		dataMC:{}
	};

	if(typeOf(list) === "array" && list.length){

		var convertTrackLanguage = function(value, isFiveDotOne){
			value = typeOf(value) === "string" ? value.toLowerCase() : "";
			var values = {fra:"Français",und:"Indéterminé"};
			var lang = values[value] ? values[value] : value;
			if(isFiveDotOne){
				lang+= " 5.1";
			}
			return lang;
		};

		var getData = function(item){
			return {
				type:item.type,
				dialog:item.dialog,
				ambiance:item.ambiance,
				commentary:item.commentary,
				loudness:item.loudness,
				maxTruePeak:item.maxTruePeak,
				url:item.locator
			};
		};

		var i, l = list.length, item;
		for(i = 0;i<l;i++){
			item = list[i];

			switch(item.formatName){
				case"Main":
					data.dataMain = getData(item);
					data.dataMain.subtitle = item.subtitle;
					data.dataMain.lang = convertTrackLanguage(item.trackLanguage);
					break;

				case"AD":
					data.dataAD = getData(item);
					break;

				case"SL":
					data.dataLS = getData(item);
					break;

				case"DI":
					data.dataDI = getData(item);
					data.dataDI.lang = convertTrackLanguage(item.trackLanguage, true);
					break;

				case"EA3":
					data.dataEA = getData(item);
					data.dataEA.lang = convertTrackLanguage(item.trackLanguage, true);
					break;

				case"EA1":
					data.dataMC = getData(item);
					data.dataMC.lang = convertTrackLanguage(item.trackLanguage, true);
					break;

				default:
					break;
			}
		}
	}
	return data;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the API for menu, then launches the callback function
 * @param {Object} data The response returned by the request
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Function} callback The function which will be triggered after data processing
 */

Model.getProgramDetails.getAudiosList = function(data){
	var newList = [];
	if(data.dataMain.lang){
		newList.push(data.dataMain.lang);
	}

	if((!isEmpty(data.dataEA) && data.dataEA.lang && !isEmpty(data.dataDI)) || (!isEmpty(data.dataMC) && data.dataMC.lang)){
		newList.push(data.dataEA.lang || data.dataMC.lang);
	}
	return newList;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the API for menu, then launches the callback function
 * @param {Object} data The response returned by the request
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Function} callback The function which will be triggered after data processing
 */

Model.getProgramDetails.getThumbnail = function(list){
	if(typeOf(list) === "array" && typeOf(list[0]) === "object"){
		return list[0].url || "";
	}
};

/* @description Launches a request to get the config json of the environnement
 * @param {String} env The environnement
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

Model.getTermsOfAffination = function(method, data, callback_function){
	if(method === "content" && typeOf(callback_function) === "function"){
		if(typeOf(data) === "object"){

			data = JSON.parse(JSON.stringify(data).replace(/"sug"/gi, '"text"').replace(/"sc"/gi, '"weight"'));
			callback_function(data);
		}else{
			callback_function();
		}
	}
};

/* @description Launches a request to get the config json of the environnement
 * @param {String} env The environnement
 * @param {Function} callback_function The function which will be triggered after receiving data
 */

Model.getResults = function(data, callback_function){
	var list = [];
	if(typeOf(data) === "array"){

		var i, media;
		for(i=0;i<data.length;i++){
			media = data[i];
			if(typeOf(media) === "object"){
				list.push(this.getProgramDetails(media));
			}
		}
	}

	callback_function(list);
};