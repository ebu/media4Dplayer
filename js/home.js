function homeScreen() {
	var myHomeScreen = this;
	this.activeScreen = false;
	this.homeScreen = document.getElementById("home");

	this.init = function() {
		var menuButton = createButton("homeVideo", myHomeScreen.homeScreen, "homeMenu", 0, 0, "menuButton");
		menuButton.style.margin = "0px 80px 80px 0px";
		menuButton.setAttribute("tabindex", 1);
		createImg(null, menuButton, "media/home/home_video.png");
		menuButton = createButton("homeMusic", myHomeScreen.homeScreen, "homeMenu", 1, 0, "menuButton");
		menuButton.style.margin = "0px 0px 80px 0px";
		menuButton.setAttribute("tabindex", 2);
		createImg(null, menuButton, "media/home/home_musique.png");
		menuButton = createButton("homeService", myHomeScreen.homeScreen, "homeMenu", 0, 1, "menuButton");
		menuButton.style.margin = "0px 80px 0px 0px";
		menuButton.setAttribute("tabindex", 3);
		createImg(null, menuButton, "media/home/home_service.png");
		menuButton = createButton("homePoste", myHomeScreen.homeScreen, "homeMenu", 1, 1, "menuButton");
		menuButton.setAttribute("tabindex", 4);
		createImg(null, menuButton, "media/home/home_poste.png");
		
		myHomeScreen.show();
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
		myFav.init();
		myTopbar.init();
		
		this.hide();
	};
	
	return this;
};