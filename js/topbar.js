function topbar() {
	var myTopbar = this;
	this.activeScreen = false;
	this.alreadyInit = false;
	this.topbar = document.getElementById("topbar");

	var countButton = 1;
	this.init = function() {
		if(!this.alreadyInit) {
			var createTopbarButton = function(text, URLimg, zone) {
				var topbarBt = createButton("topbarButton_"+countButton, myTopbar.topbar, zone, 0, 0, "topbarButton");
				topbarBt.setAttribute("tabindex", countButton);
				var ariaDescription = "menu";
				if(countButton == 1) {
					ariaDescription = "Changer utilisateur - profil de";
				}				
				createImg("accountContentIco", topbarBt, URLimg, "topbarImg", ariaDescription);
				createDiv("accountText", topbarBt, text, "topbarText");

				countButton++;
				return topbarBt;
			};

			createTopbarButton("Invité", "http://www.carolinedaily.com/forum/images/smilies/icon_cry.gif", "topBarProfileZone");
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
		myTopbar.selectButton(1);
		myUser.init();
		myFav.hide();
		myDash.hide();
		mySett.hide();
		this.hide();
	};
	
	this.validFavorite = function() {
		myTopbar.selectButton(3);
		myDash.hide();
		mySett.hide();
		myFav.init();

	};
	
	this.validHome = function() {
		myTopbar.selectButton(4);
		myHome.init();
		myFav.hide();
		myDash.hide();
		this.hide();
		mySett.hide();
	};

	this.validSettings = function() {
		myTopbar.selectButton(2);
		myHome.hide();
		myFav.hide();
		myDash.hide();
		mySett.init();
		this.show();
	};

	this.selectButton = function(index) {
		console.log("Topbar - selectButton");
		var i;
		for (i = 1 ; i < countButton; i++) {
			$("#topbarButton_"+i).css("background-color", "transparent");
		}

		$("#topbarButton_"+index).css("background-color", "#C8C8C8");
	}


	
	return this;
};