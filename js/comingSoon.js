function comingSoonScreen() {
	var myComingSoonScreen = this;
	var alreadyInit = false;
	this.comingSoon = document.getElementById("comingSoon");

	this.init = function() {
		var titleDiv = createDiv("comingSoonTitle", myComingSoonScreen.comingSoon, "Prochainement...", "comingSoonTitle");

		var btBack = createButton("comingSoonBackBT", myComingSoonScreen.comingSoon, "comingSoonBackBT", 0, 0, "comingSoonBackBT");
		btBack.innerHTML = "retour";
		btBack.style.margin = "0px 25px 25px 0px";
		btBack.setAttribute("tabindex", 5);

		alreadyInit = true;
	};
	
	this.show = function() {
		if(!alreadyInit) this.init();
		myComingSoonScreen.comingSoon.style.display = "block";
	};
	
	this.hide = function() {
		myComingSoonScreen.comingSoon.style.display = "none";
	};

	var previousScreen; 
	this.displayScreenFrom = function(_previousScreen) {
		console.log("ComingSoon - displayScreenFrom");
		previousScreen = _previousScreen;

		previousScreen.hide();
		this.show();
	}

	this.backToPreviousScreen = function() {
		previousScreen.show();
		this.hide();
	}

	return this;
};