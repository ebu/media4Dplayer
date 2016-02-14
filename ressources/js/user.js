var User = {
	data:null,
	lsName:"authenticate",
	lsData:null,
	mediaListsId:null
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Determines and returns whether the user datas had been saved in the localStorage
 * @return {Boolean} Returns true if the user's credentials had been saved in localStorage
 */

User.credentialsIsSaved = function(){
	this.lsData = this.lsData || JSON.parse(this.getUserCredentialsFromLocalStorage());
	return this.lsData !== null;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Backup in the localStorage the user's credentials
 * @param {Object} lsData The user's credentials
 */

User.saveCredentials = function(lsData){
	setHtmlStorage(this.lsName, lsData, Config.userCredentialsIsSavedFor);
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Backup in cache the user's data
 * @param {Object} userData The user's data
 */

User.saveUserData = function(userData){
	User.data = userData;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Returns the user's credentials from the localStorage
 * @return {Object} The user's credentials
 */

User.getUserCredentialsFromLocalStorage = function(){
	var name = this.lsName;
	if(statusHtmlStorage(name)){
		return localStorage.getItem(name);
	}
	return null;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches the disconnection of the user, then launches the loading of the first section
 */

User.logout = function(){
	this.disconnect();
	
	// Vide tous les caches
	json.eraseCacheDynamicsContents();
	
	var list = LANG.cache["menu_"+LANG.codeLang].list;

	// Génère les rubriques du menu
	Menu.rubrics.generate(list);
	
	// Simule un clique sur la 1ère rubrique du menu et lui donne le focus
	var $firstRub = $(document.getElementById("rubrics-list-menu")).children(".btn:visible:first");
	Navigation.setClassFocus($firstRub);
	actionList[$firstRub[0].id].enter($firstRub);
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Disconnects a user
 */

User.disconnect = function(){
	localStorage.removeItem(this.lsName);
	this.data = null;
	this.lsData = null;
	Login.email = "";
	Login.password = "";	
	
	this.mediaListsId = null;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Determines and returns whether the parental control is on PG
 * @return {Boolean} Returns true if the parental control is on PG. False otherwise
 */

User.itsKidsParentalControl = function(){
	return this.data && this.data.userDetails && this.data.userDetails.settings.parentalControl === Config.kidParentalControlValue;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Determines whether the user device is already registered. Then launches the good callback function
 * @param {Function} ifYes The function which will be triggered if the device is already registered
 * @param {Function} ifNo The function which will be triggered if the device isn't registered
 */

User.deviceIsAlreadyRegistered = function(ifYes, ifNo){
	var myDeviceID = isDesktop() ? "DEVCOMPUTER" : getDUID();
	var response = function(result){
		if(result){
			ifYes();
			
		}else{
			ifNo();
		}
	};
	
	API.getDevices(this.data.uid, {headers:{Authorization:'Bearer ' + User.data.accessToken}, lang:LANG.codeLang}, function(data, jqXHR){
		if(jqXHR.status === 200 && typeOf(data) === "object" && typeOf(data.devices) === "array"){
			
			var list = data.devices, i, l = list.length, device;
			for(i=0;i<l;i++){
				
				device = list[i];
				if(typeOf(device.clientIdentifiers) === "object" && device.clientIdentifiers.WMDRM === myDeviceID){
					//log("Mon device est dans la liste++++++++++++++++++++++++");
					response(true);
					return;
				}
			}
		}
		//log("Mon device n'était pas dans la liste--------------------------");
		response(false);
	});
};