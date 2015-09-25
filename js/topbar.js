function topbar() {
	var myTopbar = this;
	this.activeScreen = false;
	this.alreadyInit = false;
	this.topbar = document.getElementById("topbar");

	this.init = function() {
		if(!this.alreadyInit) {
			$(this.topbar).addClass("topbar");
			
			var countButton = 1;
			var createTopbarButton = function(text, URLimg, zone) {
				var topbarBt = createButton("topbarButton"+countButton, myTopbar.topbar, zone, 0, 0, "topbarButton");
				topbarBt.setAttribute("tabindex", countButton);
				var contentIcoAccount = createDiv("accountContentIco", topbarBt, "", "topbarImg");
				contentIcoAccount.style.backgroundImage = "url('"+URLimg+"')";
				var contentAccount = createDiv("accountContent", topbarBt, "", "topbarText");
				var textAccount = createDiv("accountText", contentAccount, text, "");

				countButton++;
				return topbarBt;
			};

			var btAccount = createTopbarButton("Morgan", "http://www.carolinedaily.com/forum/images/smilies/icon_cry.gif", "topBarProfileZone");
			var btSettings = createTopbarButton("Preferences", "media/topbar/menu_reglages.png", "topbarSettingsZone");
			var btFavorite = createTopbarButton("Favoris", "media/topbar/menu_favoris.png", "topbarFavorisZone");
			var btSearch = createTopbarButton("Recherche", "media/topbar/menu_recherche.png", "topbarSearchZone");
			var btHome = createTopbarButton("Accueil", "media/topbar/menu_accueil.png", "topbarHomeZone");
		
			this.alreadyInit = true;
		}
		this.show();
	};
	
	this.show = function() {
		myTopbar.topbar.style.display = "block";
		this.activeScreen = true;
	};
	
	this.hide = function() {
		myTopbar.topbar.style.display = "none";
		this.activeScreen = false;
	};

	this.validAccount = function() {
		console.log("validAccount");
	};
	

	return this;
};