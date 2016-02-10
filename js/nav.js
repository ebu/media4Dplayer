move = function(action, button, event) {
	var zone = selecteur.getAttribute("zone");
	switch (zone) {
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

		case "favoriteChoice10":
			myFav.validFavorite(0);
			indexVideo = null;
			break;
		case "favoriteChoice13":
			myFav.validFavorite(1);
			indexVideo = null;
			break;
		case "favoriteChoice16":
			myFav.validFavorite(0);
			indexVideo = 2;
			break;
		case "favoriteChoice19":
			myFav.validFavorite(1);
			indexVideo = 3;
			break;			
		case "dashboardPlay0":
			$("#videoSubtitle").attr("src", "samplesVTT/w1_jamy.vtt");
			
			var index = 0;
			if(typeOf(indexVideo) === "number"){
				index = indexVideo;
			}
			myDash.validPlay(index);
			break;
		case "dashboardPlay1":
			$("#videoSubtitle").attr("src", "samplesVTT/w1_20h.vtt");
			
			var index = 1;
			if(typeOf(indexVideo) === "number"){
				index = indexVideo;
			}
			myDash.validPlay(index);
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
			myPlayer.validOption(button, zone);
			break;
		case "playerOptionDescription":
			myPlayer.validOption(button, zone);
			break;
		case "playerOptionSub":
			myPlayer.validOption(button, zone);
			break;
		case "playerOptionAudio":
			myPlayer.validOption(button, zone);
			break;
		case "":
			myPlayer.validOptionAudio();
			break;
		case "playerDisplayUI":
			myPlayer.diplayUI();
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

		case "btActiveArialFont":
			mySett.selectFont0();
			break;
		case "btActiveOpenDyslexicFont":
			mySett.selectFont1();
			break;
		case "btActiveAndikaFont":
			mySett.selectFont2();
			break;
		case "btActiveHelveticaFont":
			mySett.selectFont3();
			break;
		case "btActiveLexiaFont":
			mySett.selectFont4();
			break;

		case "selectMultiColor":
			mySett.selectMultiColor();
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
		case "textHelperOnSynopsis":
			myTextHelper.displayTextHelperWithText($("#dashboardSynopsis").text());
			break;
		case "textHelperOnResumeContent":
			myTextHelper.displayTextHelperWithText($("#dashboardResumeContent").text());
			break;

			
		case "closeTextHelper":
			myTextHelper.hide();
			break;

		case "topbarSearchZone":
			myTopbar.hide();
			myFav.hide();
			mySett.hide();
			myComingSoon.displayScreenFrom(myHome);
			break;
			
		case "playerControlFF":
			myPlayer.ff();
			break;
		case "playerControlRW":
			myPlayer.rw();
			break;
		case "playerControlStop":
			myPlayer.stop();
			break;
		case "playerControlConfig":
			backToPlayerFromSettings = true;
			myPlayer.playerManager.controller.pause();
			myPlayer.hide();			
			myTopbar.validSettings();
			break;
		case "BackToPlayer":
			mySett.hide();
			myTopbar.selectButton(3);
			myPlayer.setPIP();
			myPlayer.initSubtitlesParams();
			myPlayer.playerManager.controller.play();
			myPlayer.show();			
			break;
			
		case "favoritePlay":
			myPlayer.init($(button).parent().index(), function(){
				myFav.show();
			});
			myFav.hide();
			break;
			
		default:
			console.log( selecteur.getAttribute("zone") + " not defined");
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