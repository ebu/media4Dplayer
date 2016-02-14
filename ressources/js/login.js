var Login = {
	callback:null,
	email:"",
	password:""
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches the checking of the user's credentials by the WS
 */

Login.checkAccess = function(){
	
	if(this.email && this.password){
		
		this.showLoader();
		Navigation.blockNavigation = true;
		
		API.checkAccess(encodeURIComponent(this.email), encodeURIComponent(this.password), this.checkAccess.callback);
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Processes the data received by the model of the login component
 * @param {Object} user The user's data compiled by the model
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 */

Login.checkAccess.callback = function(user, jqXHR){
			
	Login.hideLoader();
	Navigation.blockNavigation = false;

	if(typeOf(user) === "object" && user.isConnected){

		var email = CryptoJS.AES.encrypt(Login.email, Config.passphrase).toString(),
		password = CryptoJS.AES.encrypt(Login.password, Config.passphrase).toString();
		User.saveCredentials(JSON.stringify({email:email, password:password}));
		User.saveUserData(user);
		
		var _afterLanguageSwitch = function(){
			
			// Vide tous les caches
			json.eraseCacheDynamicsContents();
					
			var hadCallback = Login.callback && typeOf(Login.callback.onSuccess) === "function";

			if(hadCallback){
				Login.callback.onSuccess();
			}			
		};
		
		// Doit changer de langue si la langue choisie par l'user dans son compte est différente de celle-ci
		if(LANG.codeLang && User.data.userDetails.locale !== LANG.codeLang){
			
			LANG.switchLang();
			
			// Recharge l'appli dans la nouvelle langue choisie
			Main.initApp(LANG.codeLang, _afterLanguageSwitch, true);
			
		}else{
			_afterLanguageSwitch();
		}

	}else{
		Login.showErrorpopup(jqXHR);
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Displays the login loader
 */

Login.showLoader = function(){
	$(document.getElementById("login")).find(".vertical-loader").show();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Hides the login loader
 */

Login.hideLoader = function(){
	$(document.getElementById("login")).find(".vertical-loader").hide();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Displays an error popup
 * @param {Object} jqXHR The jQuery XMLHttpRequest returned by the request
 */

Login.showErrorpopup = function(jqXHR){
	
	var msg;
	if(jqXHR && LANG.langData){
		msg = ([400,403].indexOf(jqXHR.status) !== -1) ? LANG.langData.errors.loginScreen.badEmailPasswordCombination : LANG.langData.errors.genericError;
	}
	
	if(msg){

		Popup.info.show({
			titleAndMsg:["", msg],
			onBack:Popup.hideAll,
			buttons:[{
					title:LANG.getStr("ok"),
					onClick:Popup.hideAll
			}]
		});
	}

	if(this.callback && typeOf(this.callback.onError) === "function"){
		this.callback.onError();
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Displays the submit button if the login and password are inform
 */

Login.handleSubmitDisplaying = function(){
	var $submitBtn = $(document.getElementById("validate-login-button"));
	if(this.email && this.password){
		$submitBtn.show();
	}else{
		$submitBtn.hide();
	}
};