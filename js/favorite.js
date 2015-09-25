function favoriteScreen() {
	var myFavoriteScreen = this;
	this.activeScreen = false;
	this.favoriteScreen = document.getElementById("favoriteScreen");
	this.userFavList = null;
	
	this.createFav = function() {
		var favoriteBackground = createDiv("favoriteBackground", this.favoriteScreen, null, "favoriteBackground");
		
		var favoriteBackgroundTitleZone = createDiv("favoriteBackgroundTitleZone", favoriteBackground);
		createImg(null, favoriteBackgroundTitleZone, "media/favoris/favoris_icone_section.png");
		createDiv("favoriteBackgroundTitle", favoriteBackgroundTitleZone, language.fr.favTitle);
		
		var favoriteBackgroundContentZone = createDiv("favoriteBackgroundContentZone", favoriteBackground);
		
		favButton = function(index, parent, fav) {
			var favButton = createButton("fav_" + index, parent, "favoriteChoice", 0, index, "favButton");
			
			var favDelete = createButton("favDelete_" + index, favButton, "favoriteDelete", 0, 0, "favDelete");
			favDelete.setAttribute("tabindex", cpt + 2);
			createImg(null, favDelete, "media/favoris/favoris_icone_bloc.png");
			
			createImg(null, favButton, fav.picture, "favoriteImg");
			
			var favInfos = createDiv("favInfos", favButton, null, "favoriteInfos");
			createDiv("favInfosTitle", favInfos, fav.title);
			createDiv("favInfosSubitle", favInfos, fav.subtitle);
			createDiv("favInfosDetail", favInfos, fav.detail);
			
			var favPlay = createButton("favPlay_" + index, favButton, "favoritePlay", 0, 0, "favPlay");
			favPlay.setAttribute("tabindex", cpt + 3);
			createImg(null, favPlay, "media/fav_play_icone.png");	
			
			return favButton;
		};
		
		var cpt = 0;
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
		myFavoriteScreen.show();
	};
	
	this.show = function() {
		myFavoriteScreen.favoriteScreen.style.display = "block";
		this.activeScreen = true;
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
	
	return this;
};