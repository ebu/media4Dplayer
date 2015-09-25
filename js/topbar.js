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

		var btAccount = createTopbarButton("Morgan", "http://www.carolinedaily.com/forum/images/smilies/icon_cry.gif", "bonjourZone");
		var btSettings = createTopbarButton("Preferences", "https://www.agencephotoup.fr/public/Medias/picto/dingbats_50x50/2.png", "SettingsZone");
		var btFavorite = createTopbarButton("Favoris", "", "FavorisZone");
		var btSearch = createTopbarButton("Recherche", "", "SearchZone");
		var btHome = createTopbarButton("Accueil", "", "HomeZone");

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