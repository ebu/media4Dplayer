function topbar() {
	var myTopbar = this;
	this.activeScreen = false;
	this.topbar = document.getElementById("topbar");

	this.init = function() {
		$(this.topbar).addClass("topbar");
		this.show();

		var createTopbarButton = function(text, URLimg, zone) {
			var topbarBt = createButton("topbarButton", myTopbar.topbar, zone, 0, 0, "topbarButton");
			var contentIcoAccount = createDiv("accountContentIco", topbarBt, "", "topbarImg");
			contentIcoAccount.style.backgroundImage = "url('"+URLimg+"')";
			var contentAccount = createDiv("accountContent", topbarBt, "", "topbarText");
			var textAccount = createDiv("accountText", contentAccount, text, "");

			return topbarBt;
		};

		var btAccount = createTopbarButton("Morgan", "http://www.carolinedaily.com/forum/images/smilies/icon_cry.gif", "topBarProfileZone");
		var btSettings = createTopbarButton("Preferences", "media/topbar/menu_reglages.png", "topbarSettingsZone");
		var btFavorite = createTopbarButton("Favoris", "media/topbar/menu_favoris.png", "topbarFavorisZone");
		var btSearch = createTopbarButton("Recherche", "media/topbar/menu_recherche.png", "topbarSearchZone");
		var btHome = createTopbarButton("Accueil", "media/topbar/menu_accueil.png", "topbarHomeZone");
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