function homeScreen() {
	var myHomeScreen = this;
	this.alreadyInit = false;
	this.activeScreen = false;
	this.homeScreen = document.getElementById("home");

	this.init = function() {
		if(!this.alreadyInit) {
			var menuButton = createButton("homeVideo", myHomeScreen.homeScreen, "homeMenu", 0, 0, "menuButton");
			menuButton.style.margin = "0px 80px 80px 0px";
			menuButton.setAttribute("tabindex", 5);
			createImg(null, menuButton, "media/home/home_video.png", null, "Section Video");
			menuButton = createButton("homeMusic", myHomeScreen.homeScreen, "homeMenu", 1, 0, "menuButton");
			menuButton.style.margin = "0px 0px 80px 0px";
			menuButton.setAttribute("tabindex", 6);
			createImg(null, menuButton, "media/home/home_musique.png", null, "Section Musique");
			menuButton = createButton("homeService", myHomeScreen.homeScreen, "homeMenu", 0, 1, "menuButton");
			menuButton.style.margin = "0px 80px 0px 0px";
			menuButton.setAttribute("tabindex", 7);
			createImg(null, menuButton, "media/home/home_service.png", null, "Section Service");
			menuButton = createButton("homePoste", myHomeScreen.homeScreen, "homeMenu", 1, 1, "menuButton");
			menuButton.setAttribute("tabindex", 8);
			createImg(null, menuButton, "media/home/home_poste.png", null, "La Poste, plus près de chez vous");
			
			this.alreadyInit = true;
		}
		
		myHomeScreen.show();

		var descriptionDiv = createDiv("descriptionScreen", myHomeScreen.homeScreen, "Selectionnez votre section", null);
		descriptionDiv.setAttribute("tabindex", 1);
		moveSelecteur("descriptionScreen");
		//descriptionDiv.removeAttribute("tabindex");
		descriptionDiv.remove();
	};
	
	this.show = function() {
		myHomeScreen.homeScreen.style.display = "block";
		this.activeScreen = true;
	};
	
	this.hide = function() {
		myHomeScreen.homeScreen.style.display = "none";
		this.activeScreen = false;
	};
	
	this.validVideo = function() {
		myTopbar.init();
		//myFav.init();
		myTopbar.validFavorite();
		
		this.hide();
	};
	
	return this;
};