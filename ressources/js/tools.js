function log(msg, type){
	var $log = $(document.getElementById("log"));
	if (Config.enableLog) {
		if (Config.logHTML) {
			if ($log.length) {
				$log.show();
				var nbLigne = $log.children("p").size() + 1;
				var ligne = $("<p></p>").append("<span>"+msg+"</span>");
				if (nbLigne >= Config.logHeight) {
					$log.children("p:first-child").remove();
				}
				$log.append(ligne);
				
				if(type){
					ligne.addClass(type);
				}
			}

		} else {
			$log.hide();
			if (typeof console !== "undefined") {
				console.log(msg);
			}
		}
	} else {
		$log.hide();
	}
}

/**
 * 
 * @author Johny EUGENE
 * @description Affiche une exception
 * @version 1.0
 * @create 2011
 * par jeugene
 * modifier 05-12-2011
 * 
 */

function showExceptionMessage(e, text) {
	if (e) {
		var logDisabled = false;
		if (typeOf(Config) === "object" && !Config.enableLog) {
			logDisabled = true;
			Config.enableLog = true;
		}
		(e.message) ? log("ERROR "+text + " : "+ e + ' WITH MESSAGE : ' + e.message,"error") : log("ERROR "+text + " : "+ e,"error");
		if (logDisabled) {
			Config.enableLog = false;
		}
	}
}

/**
 * 
 * @author Johny EUGENE
 * @description Retourne le nombre d'éléments contenu dans un object
 * @version 1.0
 * @create 2012
 * par jeugene
 * modifier 23-01-2012
 * 
 */

Object.size = function (obj) {
	var size = 0;
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			size++;
		}
	}
	return size;
};

/**
 * Vérifie si la valeur recherchée est présente dans le tableau
 *
 * @param {Array} varArray le tableau de référence
 * @param {String} needle l'élément à vérifier
 * @param {Boolean} strict vérification strict selon le type de variable
 * @return boolean
 */

function inArray(varArray, needle, strict) {

	strict = !!strict || false;

	for (var key in varArray) {

		if (strict) {

			if (varArray[key] === needle) {

				return true;
			}
		}
		else if (varArray[key] === needle) {

			return true;
		}
	}

	return false;
}

/**
 * Generate a timestamp
 */

function getTimestamp() {
	return parseInt(+new Date() / 1000, 10);
}

/**
 * 
 * @author Johny EUGENE
 * @description Retourne le type d'une variable
 * @version 1.0
 * @create 2012
 * par jeugene
 * modifier 08-11-2012
 * 
 */

function typeOf(obj) {
	return({}).toString.call(obj).slice(8, -1).toLowerCase();
}

function isEmpty(obj) {
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			return false;
		}
	}
	return true;
}

getTextWhitoutCutWord = function (oldText) {
	var i;
	for (i = oldText.length - 1; i !== 0; i--) {
		if (oldText[i].search(/[ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿa-zA-Z0-9'-]/) === -1) {
			return oldText.substr(0, i) + "...";
		}
	}
	return oldText + "...";
};

getTextWithoutStyleAttr = function (content) {
	return typeOf(content) === "string" ? content.replace(/style="([a-z0-9-;:.#, ]+)"/gi, 'style=""') : "";
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Returns a date to string (for example : 10 Janvier 2014 or Janvier 2014)
 * @param {String} year The year
 * @param {String} month The month
 * @param {String} day The day
 * @return {String} The date converted in string
 */

function getStringDate(year, month, day) {
	if (year) {
		var months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
		var noMonth = !month,
			noDay = !day;

		month = isNaN(parseInt(month, 10)) ? 0 : parseInt(month, 10) - 1;

		var currentDate = new Date(year, month, day || 1);
		return (!noDay ? currentDate.getDate() + " " : "") + (!noMonth ? months[currentDate.getMonth()] + " " : "") + currentDate.getFullYear();
	}
}

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Returns a date to string (for example : Mercredi 10 Janvier)
 * @param {String} year The year
 * @param {String} month The month
 * @param {String} day The day
 * @return {String} The date converted in string
 */

function getStringDate2(year, month, day) {
	if (year && month && day) {
		month = isNaN(parseInt(month, 10)) ? 0 : parseInt(month, 10) - 1;

		var currentDate = new Date(year, month, day || 1);
		return (trads.days[currentDate.getDay()] + " ") + (currentDate.getDate() + " ") + (trads.months[currentDate.getMonth()] + " ");
	}
}

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Returns a date to string (for example : 10 Janvier 2014 or Janvier 2014)
 * @param {String} year The year
 * @param {String} month The month
 * @param {String} day The day
 * @return {String} The date converted in string
 */

function getStringDuration(hour, min, seconde) {
	var stringDuration = "";
	if(hour || min || seconde){
		
		var hasHour, hasMin;
		if(hour){
			hasHour = true;
			stringDuration = hour > 1 ? hour + " heures" : hour + " heure";
		}

		if(min){
			hasMin = true;

			if(hasHour){
				stringDuration = stringDuration + " ";
			}
			stringDuration = stringDuration + (min > 1 ? pad(min) + " minutes" : pad(min) + " minute");
		}

		if(seconde){

			if(hasMin){
				stringDuration = stringDuration + " ";
			}
			stringDuration = stringDuration + seconde;
		}
	}
	return stringDuration;
}

//Covert datetime by GMT offset 
//If toUTC is true then return UTC time other wise return local time
function convertLocalDateToUTCDate(date, toUTC) {
	date = new Date(date);
	//Local time converted to UTC
	var localOffset = date.getTimezoneOffset() * 60000;
	var localTime = date.getTime();
	if (toUTC) {
		date = localTime + localOffset;
	} else {
		date = localTime - localOffset;
	}
	date = new Date(date);
	return date;
}

function pad(thing) {
	return (thing < 10) ? "0" + String(thing) : thing;
}

function setDefaultThumb(img, srcDefaultImg, $title) {
	$(img).css({"opacity": 1});

	// pour éviter qu'il ne lance cette fonction en boucle si l'image par défaut est introuvable
	$(img).off("error");

	img.src = "ressources/img/default_pictures/" + srcDefaultImg;
	if(!$(img).siblings(".text").length && $($title).length){
		$title.insertAfter($(img));
	}
}

var loadAImg = function (url, $img, defaultPicName, $title) {
	if(url){
		
		$img.css("opacity",$img[0].src===url?1:0)
		.on("load", function(){
			$(this).fadeTo("fast", 1);
		})
		.on("error", function () {
			setDefaultThumb(this, defaultPicName, $title);
		});
		$img[0].src = url;

	} else {
		setDefaultThumb($img[0], defaultPicName, $title);
	}
};

var insertPicForTile = function(url, $item, item){
	var title = item.titles ? item.titles[LANG.codeLang] : item.title || "";
	loadAImg(url, $item, "img_def_collection.svg", title ? $('<div class="text no-pic"><span>'+title+'</span></div>') : "");
};

function convertArrayToObject(list) {
	var initObj = {};
	if (typeOf(list) === "array") {
		var i, l = list.length, prop;
		for (i = 0; i < l; i++) {
			prop = list[i];
			if (typeOf(prop) === "object") {
				for (var attr in prop) {
					if (prop.hasOwnProperty(attr)) {
						if (typeOf(prop[attr]) === "array") {
							initObj[attr] = convertArrayToObject(prop[attr]);
						} else {
							initObj[attr] = prop[attr];
						}
					}
				}
			}
		}
	}
	return initObj;
}

/**
 * 
 * @author Johny EUGENE
 * @description Retourne une liste de variables GET avec leurs valeurs
 * @version 1.0
 * @create 2013
 * par jeugene
 * modifier 29-04-2013
 * 
 */

function getVariablesToUrl(urlParamsList) {
	var paramsList = {};
	if (urlParamsList && urlParamsList.length > 1) {
		urlParamsList = (urlParamsList.substring(0, 1) === "?") ? urlParamsList.substring(1) : urlParamsList;

		// Sépare les différents variables
		var urlParamsListSepared = urlParamsList.split("&");

		for (var i = 0; i < urlParamsListSepared.length; i++) {

			// Sépare le nom des variables de sa valeur
			var urlAttrAndValSepared = urlParamsListSepared[i].split("=");
			if (urlAttrAndValSepared.length === 2) {
				paramsList[urlAttrAndValSepared[0]] = urlAttrAndValSepared[1];
			}
		}
	}
	return paramsList;
}

function compare(a, b) {
	return a - b;
}

function getDomainFromUrl(url, returnProtocol) {
	var a = document.createElement('a');
	a.setAttribute('href', url);
	if (returnProtocol) {
		return a.protocol + "//" + a.hostname;
	} else {
		return a.hostname;
	}
}

/**
 * 
 * @author Johny EUGENE
 * @description Compare 2 dates.
 * Retourne :
 *  0 si date_1=date_2
 *  1 si date_1>date_2
 * -1 si date_1<date_2
 * @version 1.0
 * @create 2012
 * par jeugene
 * modifier 09-05-2012
 * 
 */

function compareDates(date_1, date_2) {
	var diff = date_1.getTime() - date_2.getTime();
	return (diff === 0 ? diff : diff / Math.abs(diff));
}

/**
 * 
 * @author Johny EUGENE
 * @description Convertie des secondes en chaine de caractères (ex: 1j 20h 30mn 5s)
 * @version 1.0
 * @create 2012
 * par jeugene
 * modifier 09-05-2012
 * 
 */

function conversionSecondeHeure(time) {
	var reste = time;
	var result = '';

	var nbHours = Math.floor(reste / 3600);
	reste -= nbHours * 3600;

	var nbMinutes = Math.floor(reste / 60);
	reste -= nbMinutes * 60;

	if (nbHours > 0) {
		result = result + nbHours + 'h ';
	}

	if (nbMinutes > 0) {
		result = result + nbMinutes + 'min ';
	}

	return result;
}

function getDate(string, format) {

	if (typeOf(string) === "string" && format) {
		var arrayDateHour, stringDate, arrayDate, stringHour, arrayHour;

		// 16/07/2015 01:35:00
		if (format === 1) {
			arrayDateHour = string.split(" ");

			stringDate = arrayDateHour[0];
			arrayDate = stringDate.split("/");

			stringHour = arrayDateHour[1];
			arrayHour = stringHour.split(":");

			return new Date(arrayDate[2], parseInt(arrayDate[1], 10) - 1, arrayDate[0], arrayHour[0], arrayHour[1], arrayHour[2]);
		}
	}
}

dateIsAfterNow = function (endDate) {
	var utcEndDate = convertLocalDateToUTCDate(new Date(getDate(endDate, 1)));

	return (compareDates(utcEndDate, new Date()) === 1);
};

/**
 * 
 * @author Johny EUGENE
 * @description Précharge une image et lance une fonction callback une fois l'image chargée
 * @version 1.0
 * @create 2012
 * par jeugene
 * modifier 20-10-2012
 * 
 */

function preloadImage(src, callback) {
	var img = new Image();
	img.onload = function () {
		if (typeof callback === "function") {
			callback();
		}
	};

	img.src = src;
}

/* Author: Brynner Ferreira (brynner.net) */
// Functions
function removeHtmlStorage(name){
    localStorage.removeItem(name);
    localStorage.removeItem(name+'_time');
}
 
function setHtmlStorage(name, value, expires){
 
    if(!expires){
		// default: 1h
		expires = 3600;
	}
 
    var date = new Date();
    var schedule = Math.round((date.setSeconds(date.getSeconds()+expires))/1000);
 
    localStorage.setItem(name, value);
    localStorage.setItem(name+'_time', schedule);
}

function getHtmlStorage(name){
	if(statusHtmlStorage(name)){
		return localStorage.getItem(name);
	}
}

function statusHtmlStorage(name){
 
    var date = new Date();
    var current = Math.round(+date/1000);
 
    // Get Schedule
    var stored_time = localStorage.getItem(name+'_time');
    if(!stored_time){
		stored_time = 0;
	}
 
    // Expired
    if(stored_time < current){
 
        // Remove
        removeHtmlStorage(name);

        return 0;
 
    }else{
        return 1;
    }
}

function each(object, start) {
	var ligne = 1;
	start = start || ligne;
	$.each(object, function(i, n) {
		// Si une ligne peut être ajouter
		if (ligne < Config.logHeight && start <= ligne) {
			log("Name: " + i + ", Value: " + n);
		}
		ligne += 1;
	});
}

var getWSResponseForMultipleRequests = function(data, l, noError){
	var i, dataList = [];
	for(i=0;i<l;i++){
		
		if(noError && (typeOf(data[i][1]) === "string" && data[i][1] !== "success") || (l === 1 && typeOf(data[1]) === "string" && data[1] !== "success")){
			return data[i][2] || data[2];
		}
		
		if(typeOf(data[i]) === "array" && data[i][1] === "success" && data[i][0]){
			dataList.push(data[i][0]);

		}else if(l === 1 && data[0]){
			dataList.push(data[0]);
		}
	}
	return dataList;
};

var getAMediaListID = function(list, context){
	if(typeOf(list) === "array" && context){
		
		var i, l = list.length;
		for(i=0;i<l;i++){
			
			if(typeOf(list[i]) === "object" && list[i].context === context){
				return list[i].id;
			}
		}
	}
};

var getItemIDInList = function(items){
	var idList = [], idListItemId = [], playbackTime = [], indexList = [], seasonNumber = [], episodeNumber = [];
	if(typeOf(items) === "array"){

		var i, l = items.length, item;
		for(i=0;i<l;i++){

			item = items[i];
			if(typeOf(item) === "object"){

				var itemId = item.itemId;

				var regex = new RegExp("Program/([0-9]+)$", "g"),
					results = regex.exec(item.titleId);

				if(!results){
					regex = new RegExp("ProgramAvailability/([0-9]+)$", "g");
					results = regex.exec(item.titleId);
				}

				if(results){
					idList.push(results[1]);
					idListItemId.push(itemId);
					playbackTime.push(item.playbackTime);
					indexList.push(item.index);
					seasonNumber.push(item.seasonNumber);
					episodeNumber.push(item.episodeNumber);
				}
			}
		}
	}
	return {idList:idList,idListItemId:idListItemId,playbackTime:playbackTime,index:indexList,seasonNumber:seasonNumber,episodeNumber:episodeNumber};
};

getTimeText = function(min, sec){
	if(!min){
		return sec+' secondes ';
	}else if(!sec){
		return min + ' minutes';
	}else{
		return min + ' minutes ' + sec;
	}
};

var getElementFromXML = function(item, ns, prefix, attr){
	if($(item).length){
		
		// Ne doit pas utiliser getElementsByTagName avec un object jQuery
		if(item.length){
			item = item[0];
		}
		
		// Méthode pour Chrome
		var collection = $(item).find(ns).filter(function(){
			if($(this)[0].prefix === prefix){
				return true;
			}
		});
		
		// Méthode pour Firefox
		if(!collection.length){
			collection = $(item.getElementsByTagName(prefix+':'+ns));
		}
		
		if(collection.length){			
			return collection.filter(function(){
				if(typeOf(attr) === "object" && attr.type && attr.value){
					return $(this).attr(attr.type) === attr.value;
				}else{
					return true;
				}
			}).eq(0);		
		}
	}
};

var getTextFromElement = function($el){
	return $($el).length ? $el.text().trim() : "";
};

function checkMediaControllerSupport() {
    if (!("MediaController" in window)) {
        return "unsupported";
    }
    var mc = new MediaController();
    if ("onended" in mc) {
        return "supported";
    } else {
        return "partially supported";
    }
}	

var getDistance = function(d, rangePx, rangeMeter){
	var distance = ((d - rangePx[0]) * (rangeMeter[1] - rangeMeter[0]) / (rangePx[1] - rangePx[0])) + rangeMeter[0];
	return Math.round(distance * Math.pow(10,2)) / Math.pow(10,2);
};			

var distance = function(dot1, dot2){
	var x1 = dot1[0],
		y1 = dot1[1],
		x2 = dot2[0],
		y2 = dot2[1];
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

function roundDecimal(nombre, precision){
    precision = precision || 2;
    var tmp = Math.pow(10, precision);
    return Math.round( nombre*tmp )/tmp;
}

function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

function removeKey(arrayName, key) {
	var x;
	var tmpArray = new Array();
	for (x in arrayName)
	{
		if (x != key) {
			tmpArray[x] = arrayName[x];
		}
	}
	return tmpArray;
}

var getMediaLabel = function(detail){
	return detail.type + " du " + getStringDate(detail.date.y, detail.date.m, detail.date.d) + " | " + (getStringDuration(detail.duration.h, detail.duration.m, detail.duration.s) || "Durée inconnue");
};

var removeDuplicateItemInList = function(list, property){
	
	var newList = [];
	if(typeOf(list) === "array" && property){
		
		var i, l = list.length, item, itemPassed = [];
		for(i=0;i<l;i++){
			
			item = list[i];
			if(item[property] && itemPassed.indexOf(item[property]) === -1){
				
				itemPassed.push(item[property]);
				newList.push(item);
			}
		}
	}
	return newList;
};

var getItemByAttr = function(list, attr, value, childrenProperty){
	
	if(typeOf(list) === "array"){
		var i, l = list.length, item;
		for(i=0;i<l;i++){

			item = list[i];
			if(item[attr] === value || (childrenProperty && item[childrenProperty][attr] === value)){
				return item;
			}
		}
	}
};