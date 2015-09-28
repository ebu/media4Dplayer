function topbar() {
	var myTopbar = this;
	this.activeScreen = false;
	this.alreadyInit = false;
	this.topbar = document.getElementById("topbar");

	this.init = function() {
		if(!this.alreadyInit) {
			var countButton = 1;
			var createTopbarButton = function(text, URLimg, zone) {
				var topbarBt = createButton("topbarButton_"+countButton, myTopbar.topbar, zone, 0, 0, "topbarButton");
				topbarBt.setAttribute("tabindex", countButton);
				createImg("accountContentIco", topbarBt, URLimg, "topbarImg", "menu");
				createDiv("accountText", topbarBt, text, "topbarText");

				countButton++;
				return topbarBt;
			};

			createTopbarButton("Morgan", "http://www.carolinedaily.com/forum/images/smilies/icon_cry.gif", "topBarProfileZone");
			createTopbarButton("Preferences", "media/topbar/menu_reglages.png", "topbarSettingsZone");
			createTopbarButton("Favoris", "media/topbar/menu_favoris.png", "topbarFavorisZone");
			createTopbarButton("Recherche", "media/topbar/menu_recherche.png", "topbarSearchZone");
			createTopbarButton("Accueil", "media/topbar/menu_accueil.png", "topbarHomeZone");
		
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
		myUser.init();
		myFav.hide();
		myDash.hide();
		this.hide();
	};
	
	this.validFavorite = function() {
		myDash.hide();
		myFav.init();
	};
	
	this.validHome = function() {
		myHome.init();
		myFav.hide();
		myDash.hide();
		this.hide();
	};
	
	return this;
};