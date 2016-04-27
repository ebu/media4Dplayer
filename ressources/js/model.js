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

Model.getProgramDetails = function(xml){
	if(!((typeOf(xml) === "document" || typeOf(xml) === "xmldocument") && xml.getElementsByTagName('ebucore:ebuCoreMain'))){
		return {};
	}

	var program = {
		"title": getTextFromElement(getElementFromXML(xml, "title", "dc")),
		"subtitle": getTextFromElement(getElementFromXML(xml, "alternativeTitle", "ebucore", {type:"typeLabel", value:"EpisodeTitle"})),
		"detail": this.getProgramDetails.getDetails(getTextFromElement(getElementFromXML(xml, "genre", "ebucore", {type:"typeDefinition", value:"ProgramType"})), getElementFromXML(xml, "alternative", "ebucore", {type:"typeLabel", value:"DateDiffusion"}), getElementFromXML(xml, "partDuration", "ebucore")),
		"thumbnail":this.getProgramDetails.getThumbnail(getElementFromXML(xml, "format", "ebucore", {type:"formatName", value:"SequenceThumbnail"})),
		"picture": this.getProgramDetails.getThumbnail(getElementFromXML(xml, "format", "ebucore", {type:"formatName", value:"SequenceThumbnail"})),
		"synopsis": getTextFromElement(getElementFromXML(xml, "description", "ebucore", {type:"typeLabel", value:"Synopsis"})),
		"relatedContent":[/*{
			   "title": "Le Monde de Jamy : A couper le souffle.",
			   "subtitle": "Des forêts et des hommes",
			   "picture": "ressources/img/temp/related/icone_pt_video_soufle.png"
		   },{
			   "title": "Le repas des koalas",
			   "subtitle": "Des forêts et des hommes",
			   "picture": "ressources/img/temp/related/icone_pt_video_koala.png"
		   },{
			   "title": "Attention sangsue !",
			   "subtitle": "Des forêts et des hommes",
			   "picture": "ressources/img/temp/related/icone_pt_video_sangsue.png"
		}*/]
	};

	program.video = {
		links:this.getProgramDetails.getLinkDetails(getElementFromXML(xml, "part", "ebucore", {type:"partName", value:"Links"}))
	};
	//program.video.subtitlesList = !isEmpty(program.video.links.dataSub) ? ["Français"] : null;
	program.video.subtitlesList = ["Français"];
	program.video.audioDescriptions = !isEmpty(program.video.links.dataAD) ? [{"lang":"Français", "url":"http://videos-pmd.francetv.fr/innovation/media4D/m4d--LMDJ4-ondemand/manifest-ad.mpd"}] : null;
	program.video.ls = !isEmpty(program.video.links.dataLS) ? [{"lang":"LSF", "url":"http://videos-pmd.francetv.fr/innovation/media4D/m4d--LMDJ4-ondemand/manifest-lsf.mpd"}] : null;
	program.video.audiosList = this.getProgramDetails.getAudiosList(program.video.links);
	
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

	var type = programType || "Émission";

	if($(startDate).length && $(startDate).attr("startDate")){
		var stringDate = $(startDate).attr("startDate").split("-");
		stringDate[2] = stringDate[2].split("+")[0];
		var date = new Date(stringDate[0], stringDate[1], stringDate[2]);
		var formatedDate = getStringDate(date.getFullYear(), date.getMonth()-1, date.getDate());			
	}

	var durationMin = "";
	if($(duration).length && $(duration).children().length){
		var stringDuration = $(duration).children().text().split(":"), hasHour, hasMin;
		durationMin =  " | ";
		if(parseInt(stringDuration[0],10)){
			hasHour = true;
			durationMin = durationMin + (parseInt(stringDuration[0],10) > 1 ? parseInt(stringDuration[0],10) + " heures" : parseInt(stringDuration[0],10) + " heure");
		}

		if(parseInt(stringDuration[1],10)){
			hasMin = true;

			if(hasHour){
				durationMin = durationMin + " ";
			}
			durationMin = durationMin + (parseInt(stringDuration[1],10) > 1 ? parseInt(stringDuration[1],10) + " minutes" : parseInt(stringDuration[1],10) + " minute");
		}

		if(parseInt(stringDuration[2],10)){

			if(hasMin){
				durationMin = durationMin + " ";
			}
			durationMin = durationMin + stringDuration[2];
		}
	}
	return type + " du " + formatedDate + durationMin;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the API for menu, then launches the callback function
 * @param {Object} data The response returned by the request
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 * @param {Function} callback The function which will be triggered after data processing
 */

Model.getProgramDetails.getLinkDetails = function(ctn){
	var data = {
		dataMain:{},
		dataLS:{},
		dataAD:{},
		dataSub:{},
		dataEA:{},
		dataDI:{},
		dataMC:{}
	};

	if($(ctn).length){

		var getData = function($data){
			var data = {};
			$data.children().each(function(){
				if($(this).attr("typeLabel")){
					data[$(this).attr("typeLabel")] = $(this).text().trim();
				}
			});
			return data;
		};

		var convertTrackLanguage = function(value, isFiveDotOne){
			value = typeOf(value) === "string" ? value.toLowerCase() : "";
			var values = {fra:"Français",und:"Indéterminé"};
			var lang = values[value] ? values[value] : value;
			if(isFiveDotOne){
				lang+= " 5.1";
			}
			return lang;
		};

		// Main
		var $data = $(getElementFromXML(ctn, "format", "ebucore", {type:"formatName", value:"Main"})),
			$audioFormat = getElementFromXML($data, "audioFormat", "ebucore");
		if($data.length && $audioFormat.length && $audioFormat.attr("audioPresenceFlag") === "true"){
			data.dataMain = getData($audioFormat);
			data.dataMain.url = getElementFromXML($data, "locator", "ebucore").text().trim();
			data.dataMain.lang = convertTrackLanguage(getElementFromXML($audioFormat, "audioTrack", "ebucore").attr("trackLanguage"));
		}

		// LS
		$data = $(getElementFromXML(ctn, "format", "ebucore", {type:"formatName", value:"SL"}));
		if($data.length && $data.attr("videoPresenceFlag") === "true"){
			data.dataLS = {
				url:getElementFromXML($data, "locator", "ebucore").text().trim()
			};
		}

		// AD
		$data = $(getElementFromXML(ctn, "format", "ebucore", {type:"formatName", value:"AD"}));
		$audioFormat = getElementFromXML($data, "audioFormat", "ebucore");
		if($data.length && $audioFormat.length && $audioFormat.attr("audioPresenceFlag") === "true"){
			data.dataAD = getData($audioFormat);
			data.dataAD.url = getElementFromXML($data, "locator", "ebucore").text().trim();
			data.dataAD.lang = convertTrackLanguage(getElementFromXML($audioFormat, "audioTrack", "ebucore").attr("trackLanguage"));
		}

		// SUB
		$data = $(getElementFromXML(ctn, "format", "ebucore", {type:"formatName", value:"TTML"}));
		if($data.length){
			data.dataSub = {
				url:getElementFromXML($data, "locator", "ebucore").text().trim()
			};
		}

		// Pour le 5.1; les dialogues et l'ambiance sont séparés. Il faut donc récupérer les 2 sources
		// EA
		$data = $(getElementFromXML(ctn, "format", "ebucore", {type:"formatName", value:"EA3"}));
		$audioFormat = getElementFromXML($data, "audioFormat", "ebucore");
		if($data.length && $audioFormat.length && $audioFormat.attr("audioPresenceFlag") === "true"){
			data.dataEA = getData($audioFormat);
			data.dataEA.url = getElementFromXML($data, "locator", "ebucore").text().trim();
			data.dataEA.lang = convertTrackLanguage(getElementFromXML($audioFormat, "audioTrack", "ebucore").attr("trackLanguage"), true);
		}

		// DI
		$data = $(getElementFromXML(ctn, "format", "ebucore", {type:"formatName", value:"DI"}));
		$audioFormat = getElementFromXML($data, "audioFormat", "ebucore");
		if($data.length && $audioFormat.length && $audioFormat.attr("audioPresenceFlag") === "true"){
			data.dataDI = getData($audioFormat);
			data.dataDI.url = getElementFromXML($data, "locator", "ebucore").text().trim();
		}

		// Pour le 5.1; les dialogues et l'ambiance incluent
		// MC
		/*$data = $(getElementFromXML(ctn, "format", "ebucore", {type:"formatName", value:"MC"}));
		$audioFormat = getElementFromXML($data, "audioFormat", "ebucore");
		if($data.length){
			data.dataMC = getData($audioFormat);
			data.dataMC.url = getElementFromXML($data, "locator", "ebucore").text().trim();
			data.dataMC.lang = convertTrackLanguage(getElementFromXML($audioFormat, "audioTrack", "ebucore").attr("trackLanguage"), true);
		}*/
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
	newList.push(data.dataMain.lang);

	if(data.dataEA.lang && !isEmpty(data.dataDI)){
		newList.push(data.dataEA.lang);
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

Model.getProgramDetails.getThumbnail = function(ctn){
	if($(ctn).length){
		var thumbElement = getElementFromXML(ctn, "locator", "ebucore");
		if($(thumbElement).length){
			return $(thumbElement).text();
		}
	}
};