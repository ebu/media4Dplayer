function dashboardScreen() {
	var mydashboard = this;
	this.activeScreen = false;
	this.dashboardScreen = document.getElementById("dashboardScreen");
	this.dashboardTop = this.dashboardScreen.children[0];
	this.dashboardLeft = this.dashboardScreen.children[1];
	this.dashboardRight = this.dashboardScreen.children[2];
	
	this.contentInfos = null;
	
	this.updateDashboard = function() {
		themeButton = function(index, parent, theme) {
			var themeButton = createButton("theme_" + index, parent, "themeChoice", index, 0, "themeButton");
			createImg(null, themeButton, theme.picture);
			createDiv("themeButtonTitle", themeButton, theme.title);
			createDiv("themeButtonSubtitle", themeButton, theme.subtitle);
			return themeButton;
		};
		
		var dashboardBack = this.dashboardTop.children[0];
		var dashboardTitle = this.dashboardTop.children[1];

		//title
		dashboardTitle.innerHTML = mydashboard.contentInfos.title;
		
		//left part
		var playButton = createButton("playButton", this.dashboardLeft, "dashboardPlay", 0, 0);
		createImg(null, playButton, mydashboard.contentInfos.picture);
		createImg("playButtonIcone", playButton, "media/dashboard/icone_gr_play_video.png");	
		playButton.setAttribute("tabindex", 1);
		
		var dashboardTheme = createDiv("dashboardTheme", this.dashboardLeft);
		createDiv("dashboardThemeTitle", dashboardTheme, language.fr.themeTitle);
		var dashboardThemeContent = createDiv("dashboardThemeContent", dashboardTheme);
		
		var cpt = 0;
		var btn = null;
		for(var i in mydashboard.contentInfos.link) {
			btn = themeButton(cpt, dashboardThemeContent, mydashboard.contentInfos.link[i]);
			btn.setAttribute("tabindex", cpt + 2);
			cpt++;
		}
		
		//right part
		var dashboardSocial = this.dashboardRight.children[0];
		var dashboardSubtitle = this.dashboardRight.children[1];
		var dashboardDetails = this.dashboardRight.children[2];
		var dashboardAccessInfo = this.dashboardRight.children[3];
		var dashboardSynopsis = this.dashboardRight.children[4];
		var dashboardResume = this.dashboardRight.children[5];
		var dashboardResumeTitle = dashboardResume.children[0];
		var dashboardResumeContent = dashboardResume.children[1];
		
		var dashboardFavoriteControl = createButton("dashboardFavoriteControl", dashboardSocial, "dashboardFavoriteControl", 0, 0);
		createImg(null, dashboardFavoriteControl, "media/dashboard/icone_favoris_actif.png");
		dashboardFavoriteControl.setAttribute("tabindex", 5);
		var dashboardFacebookZone = createDiv("dashboardFacebookZone", dashboardSocial);
		createImg(null, dashboardFacebookZone, "media/dashboard/icone_facebook_actif.png");
		createDiv("dahsboardFacebookLike", dashboardFacebookZone, "16");
		var dashboardTwitterZone = createDiv("dashboardTwitterZone", dashboardSocial);
		createImg(null, dashboardTwitterZone, "media/dashboard/icone_twitter_actif.png");
		createDiv("dahsboardTwitterFollower", dashboardTwitterZone, "1");
		
		dashboardSubtitle.innerHTML = mydashboard.contentInfos.subtitle;
		dashboardSynopsis.innerHTML = mydashboard.contentInfos.synopsis;
		dashboardResumeTitle.innerHTML = language.fr.resumeTitle;
		dashboardResumeContent.innerHTML = mydashboard.contentInfos.resume;
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