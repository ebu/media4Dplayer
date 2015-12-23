function dashboardScreen() {
	var mydashboard = this;
	this.activeScreen = false;
	this.dashboardScreen = document.getElementById("dashboardScreen");
	this.dashboardTop = this.dashboardScreen.children[0];
	this.dashboardLeft = this.dashboardScreen.children[1];
	this.dashboardRight = this.dashboardScreen.children[2];
	
	this.contentInfos = null;
	this.indexContentDashboard = null;
	
	this.updateDashboard = function() {
		themeButton = function(index, parent, theme) {
			var themeButton = createButton("theme_" + index, parent, "themeChoice", index, 0, "themeButton");
			createImg(null, themeButton, theme.picture);
			createDiv("themeButtonTitle", themeButton, theme.title, "themeButtonTitle");
			createDiv("themeButtonSubtitle", themeButton, theme.subtitle, "themeButtonSubtitle");
			return themeButton;
		};
		
		var dashboardBack = this.dashboardTop.children[0];
		var dashboardTitle = this.dashboardTop.children[1];
		dashboardTitle.setAttribute("tabindex", 10);


		//title
		dashboardTitle.innerHTML = mydashboard.contentInfos.title;
		
		//left part
		var playButton = createButton("playButton", this.dashboardLeft, "dashboardPlay"+this.indexContentDashboard, 0, 0, "playButton");
		createImg(null, playButton, mydashboard.contentInfos.picture, null, "Lire la vidéo " + mydashboard.contentInfos.title);
		createImg("playButtonIcone", playButton, "media/dashboard/icone_gr_play_video.png", null, "");	
		playButton.setAttribute("tabindex", 11);
		
		var dashboardTheme = createDiv("dashboardTheme", this.dashboardLeft);
		var dashboardThemeTitle = createDiv("dashboardThemeTitle", dashboardTheme, language.fr.themeTitle);
		dashboardThemeTitle.setAttribute("tabindex", 17);
		var dashboardThemeContent = createDiv("dashboardThemeContent", dashboardTheme);
		
		var cpt = 20;
		var btn = null;
		for(var i in mydashboard.contentInfos.link) {
			btn = themeButton(cpt, dashboardThemeContent, mydashboard.contentInfos.link[i]);
			btn.setAttribute("tabindex", cpt);
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
		createImg(null, dashboardFavoriteControl, "media/dashboard/icone_favoris_actif.png", null, "Ajouter aux favoris");
		dashboardFavoriteControl.setAttribute("tabindex", 12);
		var dashboardFacebookZone = createDiv("dashboardFacebookZone", dashboardSocial);
		createImg(null, dashboardFacebookZone, "media/dashboard/icone_facebook_actif.png", null, "facebook");
		dashboardFacebookZone.setAttribute("tabindex", 13);
		createDiv("dahsboardFacebookLike", dashboardFacebookZone, "16");
		var dashboardTwitterZone = createDiv("dashboardTwitterZone", dashboardSocial);
		createImg(null, dashboardTwitterZone, "media/dashboard/icone_twitter_actif.png", null, "Tweet");
		dashboardTwitterZone.setAttribute("tabindex", 14);
		createDiv("dahsboardTwitterFollower", dashboardTwitterZone, "1");
		
		dashboardSubtitle.innerHTML = mydashboard.contentInfos.subtitle;
		dashboardSubtitle.setAttribute("tabindex", 15);
		dashboardSynopsis.innerHTML = mydashboard.contentInfos.synopsis;
		if(mydashboard.contentInfos.resume.length > 0 ) {
			dashboardResumeTitle.innerHTML = language.fr.resumeTitle;
		}
		else {
			dashboardResumeTitle.innerHTML = "";
		}
		dashboardResumeContent.innerHTML = mydashboard.contentInfos.resume;

		var textHelperOnSynopsis = createButton("textHelperOnSynopsis", dashboardSynopsis, "textHelperOnSynopsis", 0, 0, "textHelperButton");
		createButton("textHelperOnResumeContent", dashboardResumeContent, "textHelperOnResumeContent", 0, 0, "textHelperButton");
		textHelperOnSynopsis.setAttribute("tabindex", 16);
	};
	
	this.init = function(index) {
		this.indexContentDashboard = index;

		mydashboard.cleanPage();
		mydashboard.contentInfos = getContentDashboard(index);
		mydashboard.updateDashboard();

		if(getCookie("settings_min_size") != null) {
			mydashboard.setSize(getCookie("settings_min_size"));
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
	
	this.validPlay = function(index) {
		myPlayer.init(index);
		this.hide();
	};
	
	this.cleanPage = function() {
		//top part
		var dashboardTitle = this.dashboardTop.children[1];
		dashboardTitle.innerHTML = "";
		
		//left part
		emptyElem(this.dashboardLeft);
		
		//right part
		var dashboardSocial = this.dashboardRight.children[0];
		var dashboardSubtitle = this.dashboardRight.children[1];
		var dashboardDetails = this.dashboardRight.children[2];
		var dashboardAccessInfo = this.dashboardRight.children[3];
		var dashboardSynopsis = this.dashboardRight.children[4];
		var dashboardResume = this.dashboardRight.children[5];
		var dashboardResumeTitle = dashboardResume.children[0];
		var dashboardResumeContent = dashboardResume.children[1];
		
		emptyElem(dashboardSocial);
		dashboardSubtitle.innerHTML = "";
		dashboardDetails.innerHTML = "";
		emptyElem(dashboardAccessInfo);
		dashboardSynopsis.innerHTML = "";
		dashboardResumeTitle.innerHTML = "";
		dashboardResumeContent.innerHTML = "";
	};


	// size 
	this.setSize = function(newSize) {
		var elementsTab = [	
							".topbarText",

							"#dashboardTopTitle",

							"#dashboardThemeTitle",
							".themeButtonTitle",
							".themeButtonSubtitle",
							
							"#dahsboardFacebookLike",
							"#dahsboardTwitterFollower",
							"#dashboardSubtitle",
							"#dashboardSynopsis",
							"#dashboardResumeTitle",
							"#dashboardResumeContent"
							];

		var i;
		for (i = 0; i < elementsTab.length; i++) { 
   			mydashboard.setSizeWithElement(elementsTab[i], newSize);
		} 
	}
	this.setSizeWithElement = function(element, newSize) {
		$(element).css("font-size", "");
		if(parseInt($(element).css("font-size"), 10) < newSize) {
			$(element).css("font-size", newSize+"px");
		}
	}


	
	return this;
};