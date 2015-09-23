function dashboardScreen() {
	var mydashboard = this;
	this.activeScreen = false;
	this.dashboardScreen = document.getElementById("dashboardScreen");
	this.dashboardTitle = this.dashboardScreen.children[0];
	this.dashboardLeft = this.dashboardScreen.children[1];
	this.dashboardRight = this.dashboardScreen.children[2];
	
	this.contentInfos = null;
	
	this.updateDashboard = function() {
		themeButton = function(index, theme) {
			var themeButton = createButton("theme_" + index, dashboardTheme, "themeChoice", index, 0, "themeButton");
			createImg(null, themeButton, theme.picture);
			createDiv("themeButtonTitle", themeButton, theme.title);
			createDiv("themeButtonSubtitle", themeButton, theme.subtitle);
			return themeButton;
		};
		
		//title
		this.dashboardTitle.innerHtml = mydashboard.contentInfos.title;
		
		//left part
		var playButton = createButton("playButton", this.dashboardLeft, "dashboardPlay", 0, 0);
		createImg(null, playButton, mydashboard.contentInfos.picture);
		createImg(null, playButton, "media/fav_play_icone.png");	
		playButton.setAttribute("tabindex", 1);
		
		var dashboardTheme = createDiv("dashboardTheme", this.dashboardLeft);
		createDiv(null, dashboardTheme, language.fr.themeTitle);
		
		var cpt = 0;
		var btn = null;
		for(var i in mydashboard.contentInfos.link) {
			btn = themeButton(cpt, mydashboard.contentInfos.link[i]);
			btn.setAttribute("tabindex", cpt + 2);
			cpt++;
		}
		
		//right part
		var dashboardSocial = this.dashboardRight.children[0];
		var dashboardSubtitle = this.dashboardRight.children[1];
		var dashboardAccessInfo = this.dashboardRight.children[2];
		var dashboardSynopsis = this.dashboardRight.children[3];
		var dashboardResume = this.dashboardRight.children[4];
		
		dashboardSubtitle.innerHTML = mydashboard.contentInfos.subtitle;
		dashboardSynopsis.innerHTML = mydashboard.contentInfos.synopsis;
		dashboardResume.innerHTML = mydashboard.contentInfos.resume;
	};
	
	this.init = function() {
		if(mydashboard.contentInfos == null) {
			mydashboard.contentInfos = getContentDashboard();
			mydashboard.updateDashboard();
		}
		mydashboard.show();
	};
	
	this.show = function() {
		this.dashboardScreen.style.display = "block";
		this.activeScreen = true;
	};
	
	this.hide = function() {
		this.dashboardScreen.style.display = "none";
		this.activeScreen = false;
	};
	
	this.validPlay = function() {
		myPlayer.init();
		this.hide();
	};
	
	return this;
};