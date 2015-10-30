function homeScreen() {
	var myHomeScreen = this;
	this.alreadyInit = false;
	this.activeScreen = false;
	this.homeScreen = document.getElementById("home");

	this.init = function() {
		if(!this.alreadyInit) {
			var menuButton = createButton("homeBabdp", myHomeScreen.homeScreen, "homeMenu", 0, 0, "menuButton homeBabdp");
			menuButton.style.margin = "0px 25px 25px 0px";
			menuButton.setAttribute("tabindex", 5);
			createImg(null, menuButton, "media/home/baddp.png", null, "Appplication BABDP");
			menuButton = createButton("homePluzz", myHomeScreen.homeScreen, "homeMenu", 1, 0, "menuButton homePluzz");
			menuButton.style.margin = "0px 0px 25px 0px";
			menuButton.setAttribute("tabindex", 6);
			createImg(null, menuButton, "media/home/pluzz.png", null, "Appplication Pluzz");
/*
			menuButton = createButton("homePlayVideoTop", myHomeScreen.homeScreen, "homeMenuVideo", 1, 0, "doubleMenuButton");
			menuButton.style.margin = "0px 0px 25px 25px";
			menuButton.setAttribute("tabindex", 6);
			createImg(null, menuButton, "", null, "Lecture de la vidéo : Human");

			menuButton = createButton("homePlayVideoBottom", myHomeScreen.homeScreen, "homeMenuVideo", 1, 0, "doubleMenuButton");
			menuButton.style.margin = "0px 25px 25px 0px";
			menuButton.setAttribute("tabindex", 6);
			createImg(null, menuButton, "", null, "Lecture de la vidéo : La chouette et la compagnie");
*/
			menuButton = createButton("homeLeSite", myHomeScreen.homeScreen, "homeMenu", 0, 1, "menuButton");
			menuButton.style.margin = "425px 0px 0px -825px";
			menuButton.setAttribute("tabindex", 7);
			createImg(null, menuButton, "media/home/lesitetv.png", null, "Section lesite.tv");
			menuButton = createButton("homeMediatheque", myHomeScreen.homeScreen, "homeMenu", 1, 1, "menuButton");
			menuButton.style.margin = "425px 0px 0px -400px";
			menuButton.setAttribute("tabindex", 8);
			createImg(null, menuButton, "media/home/media.png", null, "Médiathèque");

			myHomeScreen.homeScreen.style.padding = "200px 0px 0px 500px";
			
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