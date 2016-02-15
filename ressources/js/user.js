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