function favoriteScreen() {
	var myFavoriteScreen = this;
	this.activeScreen = false;
	this.favoriteScreen = document.getElementById("favoriteScreen");
	this.userFavList = null;
	
	this.createFav = function() {
		var favoriteBackground = createDiv("favoriteBackground", this.favoriteScreen, null, "favoriteBackground");
		
		var favoriteBackgroundTitleZone = createDiv("favoriteBackgroundTitleZone", favoriteBackground);
		var favTitleIcone = createDiv("favoriteBackgroundTitleIcone", favoriteBackgroundTitleZone, null, null);
		favTitleIcone.innerHTML = '<svg version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"'
								+ 'width="50px" height="43px" viewBox="0 0 50 43" style="enable-background:new 0 0 50 43;" xml:space="preserve">'
								+ '<g><polygon style="fill:#555555;stroke:#FFFFFF;stroke-width:0.25;stroke-miterlimit:10;" class="st0" points="25.3,0 32.3,14.1 47.9,16.4 36.6,27.4 39.3,43 25.3,35.6 11.4,43 14,27.4 2.8,16.4 18.4,14.1"/></g>'
								+ '</svg>';
		createDiv("favoriteBackgroundTitle", favoriteBackgroundTitleZone, language.fr.favTitle);
		
		var favoriteBackgroundContentZone = createDiv("favoriteBackgroundContentZone", favoriteBackground);
		
		favButton = function(index, parent, fav) {
			var favButton = createButton("fav_" + index, parent, "favoriteChoice", 0, index, "favButton");
			var ariaDescription = createDiv("favAriaLabel_"+index, favButton, null, null);
			ariaDescription.style.display = "none";
			ariaDescription.innerHTML = "Vidéo : " + fav.title;
			favButton.setAttribute("aria-labelledby", "favAriaLabel_"+index);

			var favDelete = createButton("favDelete_" + index, favButton, "favoriteDelete", 0, 0, "favDelete");
			favDelete.setAttribute("tabindex", cpt + 2);
			var favDeleteIcone = createDiv("favoriteDeleteIcone", favDelete, null, null);
			favDeleteIcone.innerHTML = '<div aria-labelledby="AriaFavori"><svg version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"'
								+'width="50px" height="43px" viewBox="0 0 50 43" style="enable-background:new 0 0 50 43;" xml:space="preserve">'
								+ '<g><polygon class="st0" style="fill:#FFDE00;stroke:#FFFFFF;stroke-width:0.25;stroke-miterlimit:10;" points="25.3,0 32.3,14.1 47.9,16.4 36.6,27.4 39.3,43 25.3,35.6 11.4,43 14,27.4 2.8,16.4 18.4,14.1"/></g>'
								+ '</svg></div><div id="AriaFavori" style="display:none;">Enlever des favoris</div>';

			createImg(null, favButton, fav.picture, "favoriteImg", null, "");
			
			var favInfos = createDiv("favInfos", favButton, null, "favoriteInfos");
			createDiv("favInfosTitle", favInfos, fav.title, "favInfosTitle");
			createDiv("favInfosSubitle", favInfos, fav.subtitle, "favInfosSubitle");
			createDiv("favInfosDetail", favInfos, fav.detail, "favInfosDetail");
			
			var favPlay = createButton("favPlay_" + index, favButton, "favoritePlay", 0, 0, "favPlay");
			favPlay.setAttribute("tabindex", cpt + 3);
			createImg(null, favPlay, "media/fav_play_icone.png", null, "lecture de la vidéo");
			
			return favButton;
		};
		
		var cpt = 10;
		var btn = null;
		for(var i in myFavoriteScreen.userFavList.fav) {
			btn = favButton(cpt, favoriteBackgroundContentZone, myFavoriteScreen.userFavList.fav[i]);
			btn.setAttribute("tabindex", cpt + 1);
			cpt = cpt + 3;
		}
	};
	
	this.init = function() {
		myFavoriteScreen.cleanPage();
		myFavoriteScreen.userFavList = getFav();
		myFavoriteScreen.createFav();

		if(getCookie("settings_min_size") != null) {
			myFavoriteScreen.setSize(getCookie("settings_min_size"));
		}
		
		myFavoriteScreen.show();
	};
	
	this.show = function() {
		myFavoriteScreen.favoriteScreen.style.display = "block";
		this.activeScreen = true;

		var descriptionDiv = createDiv("descriptionScreen", this.favoriteScreen, "Page mes vidéos favorites, avec une barre de navigation", null);
		descriptionDiv.setAttribute("tabindex", 1);
		moveSelecteur("descriptionScreen");
		//descriptionDiv.removeAttribute("tabindex");
		descriptionDiv.remove();


	};
	
	this.hide = function() {
		myFavoriteScreen.favoriteScreen.style.display = "none";
		this.activeScreen = false;
	};
	
	this.validFavorite = function() {
		myDash.init();
		this.hide();
	};
	
	this.cleanPage = function() {
		emptyElem(this.favoriteScreen);
	};

	// size 
	this.setSize = function(newSize) {
		var elementsTab = [	".favInfosTitle",
							".favInfosDetail",
							".favInfosSubitle",
							"#favoriteBackgroundTitle",
							".topbarText"
							];

		var i;
		for (i = 0; i < elementsTab.length; i++) { 
   			myFavoriteScreen.setSizeWithElement(elementsTab[i], newSize);
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