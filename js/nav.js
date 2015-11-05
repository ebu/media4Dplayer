move = function(action, event) {
	switch (selecteur.getAttribute("zone")) {
		case "userChoice":
			myUser.validUser();
			break;
		case "homeMenu":
			myHome.validVideo();
			break;

		case "homeMenuComingSoon":
			myComingSoon.displayScreenFrom(myHome);
			break;
		case "comingSoonBackBT":
			myComingSoon.backToPreviousScreen();
			break;

		case "favoriteChoice":
			myFav.validFavorite();
			break;
		case "dashboardPlay":
			myDash.validPlay();
			break;
		case "topBarProfileZone":
			myTopbar.validAccount();
			break;
		case "topbarFavorisZone":
			myTopbar.validFavorite();
			break;
		case "topbarHomeZone":
			myTopbar.validHome();
			break;
		case "topbarSettingsZone":
			myTopbar.validSettings();
			break;
		case "playerClose":
			myPlayer.validClose();
			break;
		case "playerOptionSigne":
			myPlayer.validOptionSigne();
			break;
		case "playerOptionDescription":
			myPlayer.validOptionDescription();
			break;

		case "playerControlPlayPause":		
			myPlayer.playPause();
			break;

		case "btSettingsMenuGeneral":
			mySett.initMain();
			break;
		case "btSettingsMenuLSF":
			mySett.initLSFSettings();
			break;
		case "btSettingsMenuSubtitle":
			mySett.initSubtitle();
			break;

		case "btActiveTimeNewRomanFont":
			mySett.selectFont0();
			break;
		case "btActiveHerculanumFont":
			mySett.selectFont1();
			break;
		case "btActiveAyuthayaFont":
			mySett.selectFont2();
			break;
		case "btActiveHelveticaFont":
			mySett.selectFont3();
			break;
		case "btActiveGeorgiaFont":
			mySett.selectFont4();
			break;

		case "selectMultiColor":
			mySett.selectYellowColor();
			break;
		case "selectWhiteColor":
			mySett.selectWhiteColor();
			break;
		case "selectYellowColor":
			mySett.selectYellowColor();
			break;
		case "selectDarkGreyColor":
			mySett.selectDarkGreyColor();
			break;
		case "selectGreenColor":
			mySett.selectGreenColor();
			break;
		case "selectBlueColor":
			mySett.selectBlueColor();
			break;
		case "selectPinkColor":
			mySett.selectPinkColor();
			break;
		case "selectRedColor":
			mySett.selectRedColor();
			break;

		case "selectWhiteBGColor":
			mySett.selectWhiteBGColor();
			break;
		case "selectGreyBGColor":
			mySett.selectGreyBGColor();
			break;
		case "selectBlackBGColor":
			mySett.selectBlackBGColor();
			break;
		case "settingsSwitchVideos":
			mySett.settingsSwitchVideos();
			break;

		case "displayTextHelper":
			myTextHelper.displayTextHelperWithText();
			break;
		case "closeTextHelper":
			myTextHelper.hide();
			break;

		case "topbarSearchZone":
			myComingSoon.displayScreenFrom(myHome);
			break;

			
		case "playerControlRW":
		case "playerControlFF":
		case "playerControlStop":
		default:
			console.log(selecteur.getAttribute("zone"), "not yet implemented");
			break;
	}
};

function moveSelecteur(Obj) {
	try {
		pbSelecteur = false;
		if (typeof (Obj) != 'object') {
			Obj = document.getElementById(Obj);
		}

		var Obj_ref = Obj;
		var absoluteLeft = 0;
		var absoluteTop = 0;
		while (Obj_ref && Obj_ref.tagName != 'body') {
			absoluteLeft += Obj_ref.offsetLeft;
			absoluteTop += Obj_ref.offsetTop;
			Obj_ref = Obj_ref.offsetParent;
		}
		selecteur.setAttribute("zone", Obj.getAttribute("zone"));
		selecteur.setAttribute("x", Obj.getAttribute("x"));
		selecteur.setAttribute("y", Obj.getAttribute("y"));
		
		Obj.focus();
	} catch (err) {
		pbSelecteur = true;
	}
};