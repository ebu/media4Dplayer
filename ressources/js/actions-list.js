
var actionList = {
	
																	/* ******************/
																	/*	 MENU PRINCIPAL	*/
																	/* ******************/
	
	"static-menu-button-1":{
		"enter":function(){
			Main.exit();
		}
	},
	"static-menu-button-2":{
		"enter":function(me){
			
			me.removeClass("focus");
			
			LANG.switchLang();
			
			// Recharge l'appli dans la nouvelle langue choisie
			Main.initApp(LANG.codeLang);

			// MAJ de la langue dans le compte de l'user
			if(User.data){
				API.updateLanguage(User.data.uid, {headers:{Authorization:'Bearer ' + User.data.accessToken},lang:LANG.codeLang}, function(data, jqXHR){
					if(jqXHR.status === 200 && typeOf(data) === "object"){
						User.data.userDetails = data;

					}else{
						Popup.info.show({
							titleAndMsg:["", LANG.langData.errors.genericError],
							onBack:Popup.hideAll,
							buttons:[{
								title:LANG.getStr("ok"),
								onClick:Popup.hideAll
							}]
						});
					}
				});						
			}
		}
	},
	"fullscreen-button-menu":{
		"enter":function(){}
	},
	"play-pause-button-menu":{
		"enter":function(){}
	},
	"next-video-button-menu":{
		"enter":function(){}
	},
	"info-video-button-menu":{
		"enter":function(){}
	},
	"return-button-kids-menu":{
		"right":function(me){
			if(Home.isVisible()){
				Navigation.setFocusToCollections(me, "right");
				
			}else if([Section.sections[7], Section.sections[8]].indexOf(Section.name) !== -1){
				me.removeClass("focus");
				Navigation.setClassFocus($(document.getElementById("return-button-dashboard")));			
			}else{
				Navigation.setFocusToGrid(me, "right");
			}
		},
		"enter":function(me){
			me.removeClass("focus");
			Navigation.handleReturnButton();
		}
	},
	
																	/* **********/
																	/*	 LOGIN	*/
																	/* **********/
	
	"email-button":{
		"down":function(me){
			me.removeClass("focus");
			Navigation.setClassFocus(me.next());
		},
		"enter":function(me){
			Popup.keyboard.show(function(input){
				
				Login.email = input;
				me.children(".inputText").html(input);
				me.removeClass("focus");
				Navigation.setClassFocus(me.next());
				
				Login.handleSubmitDisplaying();
			});
		}
	},
	"password-button":{
		"up":function(me){
			me.removeClass("focus");
			Navigation.setClassFocus(me.prev());
		},
		"down":function(me){
			if(Login.email && Login.password){
				me.removeClass("focus");
				Navigation.setClassFocus($(document.getElementById("validate-login-button")));				
			}
		},
		"enter":function(me){			
			Popup.keyboard.show(function(input, clearInput){
				
				Login.password = clearInput;
				me.children(".inputText").html(input);
				
				Login.handleSubmitDisplaying();
				
				var $submitBtn = $(document.getElementById("validate-login-button"));
				if($submitBtn.is(":visible")){
					me.removeClass("focus");
					Navigation.setClassFocus($submitBtn);					
				}
				
			}, Config.minLengthForLogin, null, null, true);
		}
	},
	"validate-login-button":{
		"up":function(me){
			me.removeClass("focus");
			Navigation.setClassFocus($(document.getElementById("password-button")));
		},
		"enter":function(){
			
			var _showErrorMsg = function(){
				Popup.info.show({
					titleAndMsg:["", LANG.langData.errors.loginScreen.badEmailPasswordCombination],
					onBack:Popup.hideAll,
					buttons:[{
							title:LANG.getStr("ok"),
							onClick:Popup.hideAll
					}]
				});				
			};
			
			if(Login.email === "_test_"){
				if(Login.password === "000000"){
					Login.email = "jeugene@dotscreen.com";
					Login.password = "dotscreen";
				}else if(Login.password === "100000"){
					Login.email = "starzplayautomation_1447748537821@starzplayarabia.com";
					Login.password = "tester01.";
				}else if(Login.password === "200000"){
					Login.email = "starzplayautomation_1447748710439@starzplayarabia.com";
					Login.password = "tester01.";
				}else if(Login.password === "300000"){
					Login.email = "starzplayautomation_1447748994739@starzplayarabia.com";
					Login.password = "tester01.";
				}else if(Login.password === "400000"){
					Login.email = "starzplayautomation_1447749439075@starzplayarabia.com";
					Login.password = "tester01.";
				}else if(Login.password === "500000"){
					Login.email = "starzplayautomation_1447749628813@starzplayarabia.com";
					Login.password = "tester01.";
				}else{
					_showErrorMsg();
					return;
				}
			}else if(Login.email === "_stg_"){
				if(Login.password === "100000"){
					Login.email = "jorge.alonso+dotscreen@playco.com";
					Login.password = "dotscreen1";
				}else if(Login.password === "200000"){
					Login.email = "shahneha403@gmail.com";
					Login.password = "ahenshah1";
				}else if(Login.password === "300000"){
					Login.email = "tests3@test.com";
					Login.password = "111111";
				}else{
					_showErrorMsg();
					return;
				}
			}
			/*
			if(Login.email === "a"){
				Login.email = "oygogyf@mailinator.com";
				Login.password = "oygogyf";
			}else if(Login.email === "b"){
				Login.email = "iuqwgoegfw@mailinator.com";
				Login.password = "iuqwgoegfw";
			}else if(Login.email === "c"){
				Login.email = "qqqqqq@mailimator.com";
				Login.password = "qqqqqq";
			}else if(Login.email === "d"){
				Login.email = "lkjhgfd@mailinator.com";
				Login.password = "lkjhgfd";
			}else if(Login.email === "e"){
				Login.email = "iuyutyrjtd@mailinator.com";
				Login.password = "iuyutyrjtd";
			}else if(Login.email === "f"){
				Login.email = "uoyfyuf@mailinator.com";
				Login.password = "uoyfyuf";
			}
			*/
			Login.checkAccess();
		}
	},
	
																	/* ******************************/
																	/*			SOUS-MENU		 	*/
																	/* ******************************/

	"elements-submenu-1":{
		"left":function(me){
			Navigation.unsetFocusToSubmenu(me, "left");
		},
		"right":function(me){
			Navigation.unsetFocusToSubmenu(me, "right");
		},
		"up":function(me){
			Navigation.setFocusToAElementInSubmenu(me,"up");
		},
		"down":function(me){
			Navigation.setFocusToAElementInSubmenu(me,"down");
		},
		"enter":function(me){
			var $item = Navigation.getElFocused2(me);
			var index = (Section.name === Section.sections[5]) ? $item.index() : (Section.name === Section.sections[1] && $item.index() === (json.cache["submenu"][Section.name][LANG.codeLang].length-1)) ? 1 : 0;
			Submenu.indexSel = $item.index();
			Section.change(Section.name, Section.rubrics[Section.name][index], null, $item);
		}
	},
	"arrow-top-submenu-1":{
		"left":function(me){
			me.removeClass("focus");
			Navigation.setClassFocus(Menu.getSelected());
		},
		"right":function(me){
			Navigation.setFocusToGrid(me, "right");
		},
		"up":function(me){
			Submenu.slider.setMovingList(me, "up", true);
		},
		"down":function(me){
			Navigation.setFocusToSubmenu(me, "down");
		},
		"enter":function(me){
			Submenu.slider.setMovingList(me, "up");
		}
	},
	"arrow-bottom-submenu-1":{
		"left":function(me){
			me.removeClass("focus");
			Navigation.setClassFocus(Menu.getSelected());
		},
		"right":function(me){
			Navigation.setFocusToGrid(me, "right");
		},
		"up":function(me){
			Navigation.setFocusToSubmenu(me, "up", true);
		},
		"down":function(me){
			Submenu.slider.setMovingList(me, "down", true);
		},
		"enter":function(me){
			Submenu.slider.setMovingList(me, "down");
		}
	},
	
																	/* **************************/
																	/*			GRID		 	*/
																	/* **************************/

	"submenu-1-grid-tile-list":{
		"left":function(me){
			Navigation.setFocusToAElementInGrid(me, "left");
		},
		"right":function(me){
			Navigation.setFocusToAElementInGrid(me, "right");
		},
		"up":function(me){
			Navigation.setFocusToAElementInGrid(me,"up");
		},
		"down":function(me){
			Navigation.setFocusToAElementInGrid(me,"down");
		},
		"enter":function(me){
			Navigation.handlesEnterActionInGrid(me);
		}
	},
	"top-menu-submenu-grid-button-1":{},
	"top-menu-submenu-grid-button-2":{},
	"top-menu-submenu-grid-button-3":{},	
	
																	/* **************************/
																	/*			CARROUSEL	 	*/
																	/* **************************/

	"carrousel-button-1":{
		"enter":function(){
			var media = Carrousel.data.list[Carrousel.$element.$CurrentIndex()];
			Player.launchStreaming(media, "trailer");
		},
		"up":function(me){
			var $item = $(document.getElementById("arrow-left-carrousel"));
			if($item.length && $item.is(":visible")){
				me.removeClass("focus");
				Navigation.setClassFocus($item);
			}
		}
	},
	"carrousel-button-2":{
		"enter":function(){
			Section.launchDashboard(Carrousel.data.list[Carrousel.$element.$CurrentIndex()]);
		},
		"up":function(me){
			var $prevBtn = me.prev();
			if(!$prevBtn.is(":visible")){
				actionList[$prevBtn[0].id].up(me);
				
			}else if(me.next().length){
				actionList[me.next()[0].id].up(me);
			}
		}
	},
	"carrousel-button-3":{
		"enter":function(){
			Dash.data = null;
			
			var media = Carrousel.data.list[Carrousel.$element.$CurrentIndex()];			
			if(media.type === "Series"){
				
				var _showErrorMsg = function(){
					Popup.info.show({
						titleAndMsg:["", LANG.langData.errors.genericError],
						onBack:Popup.hideAll,
						buttons:[{
							title:LANG.getStr("ok"),
							onClick:Popup.hideAll
						}]
					});						
				};
				
				Navigation.blockNavigation = true;
				$(document.getElementById("carrousel")).find(".loader").show();
				
				var regex = new RegExp("ProgramAvailability/([0-9]+)$", "g"),
					results = regex.exec(media.id);	
				
				// Doit récupérer toutes les data
				var id = results[1];
				var section = Section.sections[8];
				if(id){
					Dash.type = Dash.types[1];
					API.getDashContent(Model.getWSForDash(section, {id:id}), section, function(jqXHR, mediaData, collectionData, seasons, episodes){

						Navigation.blockNavigation = false;
						$(document.getElementById("carrousel")).find(".loader").hide();		

						if(mediaData){
							Dash.data = mediaData;
							Dash.data.titleIdFull = media.id;
							Dash.seasons = seasons;
							Dash.episodes = episodes;
							
							var season = seasons[0];
							var firstEpisode = episodes[season].titles[0];
							if(typeOf(firstEpisode) === "object"){
								
								media.seasonEpisodeTitle = "S"+pad(season)+"-E"+pad(firstEpisode.tvSeasonEpisodeNumber);
								media.streamingInfos = getMediaUrl(firstEpisode.media[0].content, ["hss_playready_vu"]);
								media.subtitles = getSubtitlesData(firstEpisode.media[0].content, ["dfxp_ar_vu", "dfxp_en_vu"], ["ara", "eng"]);
								
								// Pour la watchlist
								Dash.data.season = season;
								Dash.data.episode = firstEpisode.tvSeasonEpisodeNumber;
								Dash.data.streamingInfos = JSON.parse(JSON.stringify(media.streamingInfos));
								Dash.data.subtitles = JSON.parse(JSON.stringify(media.subtitles));
								Dash.data.carrouselLaunch = true;
								
								Player.launchStreaming(media, "streaming");

							}else{
								_showErrorMsg();
							}							

						}else{
							_showErrorMsg();
						}
					});
				}else{
					_showErrorMsg();
				}
			}else{
				Dash.type = Dash.types[0];
				Player.launchStreaming(media, "streaming");
			}
		},
		"up":function(me){
			var $item = $(document.getElementById("arrow-right-carrousel"));
			if($item.length && $item.is(":visible")){
				me.removeClass("focus");
				Navigation.setClassFocus($item);
			}
		}
	},
	"arrow-left-carrousel":{
		"left":function(me){
			if(Submenu.isVisible()){
				Navigation.setFocusToSubmenu(me, "left");

			}else{
				Navigation.setFocusToMainMenu(me);
			}			
		},
		"right":function(me){
			var $arrow = me.next(".arrow:visible");
			if($arrow.length){
				me.removeClass("focus");
				Navigation.setClassFocus($arrow);
			}
		}
	},	
	"arrow-right-carrousel":{
		"left":function(me){
			var $arrow = me.prev(".arrow:visible");
			if($arrow.length){
				me.removeClass("focus");
				Navigation.setClassFocus($arrow);
			}
		}
	},
	
																	/* **************************/
																	/*			COLLECTIONS	 	*/
																	/* **************************/

	"collections":{},
	"full-catalogue-button":{
		"left":function(me){
			if([Section.sections[0], Section.sections[2], Section.sections[11]].indexOf(Section.name) !== -1){
				Navigation.setFocusToMainMenu(me);

			}else{
				Navigation.setFocusToSubmenu(me, "left");
			}	
		},
		"up":function(me){
			Navigation.setFocusToCarrousel(me, "up");
		},
		"down":function(me){
			Navigation.setFocusToCollections(me,"down");
		},
		"enter":function(){
			Section.change(Section.name, Section.rubrics[Section.name][0], {fullCatalogue:true});
		}
	},
	"dashboard-collections":{},
																	/* **********/
																	/*	 POPUP	*/
																	/* **********/
	
	// Clavier
	"keyboard":{
		"up":function(me){
			Navigation.setFocusToOtherLineInKeyboard(me, "up");
		},
		"down":function(me){
			Navigation.setFocusToOtherLineInKeyboard(me, "down");
		},
		"left":function(me){
			Navigation.setFocusInLigneInKeyboard(me, "left");
		},
		"right":function(me){
			Navigation.setFocusInLigneInKeyboard(me, "right");
		},
		"enter":function(me){
			Popup.keyboard.updateInputField(me);
        }
    },
    "validate-keyboard-popup":{
		"left":function(me){
			me.removeClass("focus");
			Navigation.setClassFocus(me.next());
		},
        "enter":function(){
			Popup.keyboard.validateInput();
		}
    },
    "delete-button":{
		"left":function(me){
			Navigation.setFocusToKeyboard(me, true);
		},
		"right":function(me){
			me.removeClass("focus");
			Navigation.setClassFocus(me.prev());
		},
        "enter":function(){
			Popup.keyboard.deleteLastCharacter();
		}
    },
    "close-button-keyboard-popup":{
		"down":function(me){
			me.removeClass("focus");
			Navigation.setClassFocus($(document.getElementById("keyboard-buttons-container")).children(".btn:first-child"));
		},
        "enter":function(){
            Popup.hideAll();
        }
    },
	"keyboard-filter-button-1":{
		"enter":function(me){
			Popup.keyboard.setToLowercase(me);
		}
	},
	"keyboard-filter-button-2":{
		"enter":function(me){
			Popup.keyboard.setToUppercase(me);
		}
	},
	"keyboard-filter-button-3":{
		"enter":function(me){
			Popup.keyboard.showSpecialKeys(me);			
		}
	},
	
	// Languages & subtitles
    "close-button-languages-popup":{
		"up":function(me){
			Navigation.setFocusToATracksList(me);
		},
        "enter":function(){
            Popup.hideAll();
        }
    },
    "languages-and-subtitles-container":{
		"up":function(me){
			Navigation.setFocusToATrack(me, "up");
		},
		"down":function(me){
			Navigation.setFocusToATrack(me, "down");
		},
		"left":function(me){
			Navigation.setFocusToATrack(me, "left");
		},
		"right":function(me){
			Navigation.setFocusToATrack(me, "right");
		},
        "enter":function(me){
            Navigation.handleEnterActionOnTrack(me);
        }
    },
	
	
																	/* **********************/
																	/*			PLAYER	 	*/
																	/* **********************/

	"prev-video-player-button":{
		"right":function(me){
			me.removeClass("focus");
			Navigation.setClassFocus(me.next());
		},
		"enter":function(){
			Player.jumpBackward();
		}
	},
	"pause-play-video-player-button":{
		"left":function(me){
			me.removeClass("focus");
			Navigation.setClassFocus(me.prev());
		},
		"right":function(me){
			me.removeClass("focus");
			Navigation.setClassFocus(me.next());
		},
		"enter":function(){
			Player.playPause();
		}
	},
	"next-video-player-button":{
		"left":function(me){
			me.removeClass("focus");
			Navigation.setClassFocus(me.prev());
		},
		"right":function(me){
			me.removeClass("focus");
			Navigation.setClassFocus($(document.getElementById("buttons-container")).children(".btn:visible:first"));
		},
		"enter":function(){
			Player.jumpForward();
		}
	},
	"language-button":{
		"enter":function(){
			InfoBanner.suspendMaskingAfterDelay();
			Player.getCurrentStreamInfo();
			Popup.languages.show({
				audios:Player.getTrackAudio(),
				subtitles:Player.getTrackSubtitles(),
				audioSelected:Player.currentAudio,
				subtitleSelected:Player.currentSubtitle,
				subHided:Player.subHided
			});
		}
	},
	"return-button":{
		"enter":function(){
			Navigation.handleReturnButton(Player.currentTime);
		}
	},
	"episode-button":{
		"down":function(me){
			me.removeClass("focus");
			Navigation.setClassFocus($(document.getElementById("return-button")));
		},
		"enter":function(){}
	},
	"watch-now-next-episode":{
		"enter":function(){
			InfoBanner.goToNextEpisode();
		},
		"right":function(me){
			me.removeClass("focus");
			Navigation.setClassFocus(me.next());
		}
	},
	"return-next-episode":{
		"enter":function(){
			Navigation.handleReturnButton();
		},
		"left":function(me){
			me.removeClass("focus");
			Navigation.setClassFocus(me.prev());
		}
	},
	"watch-button-splash":{
		"enter":function(){
			var dataEl = Player.playlistTrailer[Player.playlistIndex];
			// dataEl.type = getItemType(data);
			if (typeOf(dataEl) === "object") {
				Navigation.handleReturnButton();
				Section.launchDashboard(dataEl);
			}
		}
	},
	"watchlist-button-splash":{
		"enter":function(){
			if (User.data && User.data.isConnected) {
				var dataEl = Player.playlistTrailer[Player.playlistIndex];
				Model.addRemoveInWatchListSinceTrailerPlaylist(dataEl, dataEl.type);
			}
			else {
				var back = function(){
					Popup.hideAll();
					InfoBanner.launchMaskingAfterDelay();
				};
				Popup.info.show({
					titleAndMsg: ["", LANG.langData.errors.watchlist_errors.notConnected],
					onBack: back,
					buttons: [{
						title: "OK",
						onClick: back
					}]
				});
			}
		}
	},
	"home-button":{
		"enter":function(){
			// Ferme le player
			Navigation.handleReturnButton();
		}
	},

																	/* ******************************/
																	/*			DASHBOARD			*/
																	/* ******************************/

	"dashboard-watch-trailer-button":{
		"enter":function(){
			Player.launchStreaming(Dash.data, "trailer");			
		}
	},
	"dashboard-watch-button":{
		"enter":function(){
			Player.launchStreaming(Dash.data, "streaming");
		}
	},
	"dashboard-resume-button":{
		"enter":function(){
			Dash.resume();
		}
	},
	"dashboard-watchlist-button":{
		"enter":function(){
			if(User.data && User.data.isConnected){
				Model.addRemoveInWatchList(Dash.data, Dash.type);
				
			}else{
				Popup.info.show({
					titleAndMsg:["",LANG.langData.errors.watchlist_errors.notConnected],
					onBack:Popup.hideAll,
					buttons:[{
							title:LANG.getStr("ok"),
							onClick:Popup.hideAll
					}]
				});
			}
		}
	},
	"return-button-dashboard":{
		"left":function(me){
			Navigation.setFocusToMainMenu(me);
		},
		"right":function(me){
			me.removeClass("focus");
			Navigation.setClassFocus($(document.getElementById("dashboard-buttons-container")).children(":visible:first"));
		},
		"enter":function(){
			if(Dash.type === Dash.types[2]){
				if(Section.name === Section.sections[9]){
					Section.oldTemplate[Section.oldTemplate.length-1].removeClass(Dash.type);
				}else{
					Section.template.removeClass(Dash.type);
				}
				Dash.type = Dash.types[1];
				Dash.data = Dash.seriesData;
				Dash.seriesData = null;
				Dash.generate(Dash.data);
			}else{
				Navigation.handleReturnButton();
			}
		}
	},
	
																	/* **************************/
																	/*			SETTINGS	 	*/
																	/* **************************/

	"thresholds":{
		"left":function(me){
			Navigation.setFocusToAElementInThresholds(me, "left");
		},
		"right":function(me){
			Navigation.setFocusToAElementInThresholds(me, "right");
		},
		"enter":function(me){
			Navigation.handlesEnterActionInThresholds(me);
		}
	},
	"logout-button":{
		"left":function(me){
			Navigation.setFocusToSubmenu(me, "left");
		},
		"enter":function(me){
			Popup.info.show({
				titleAndMsg:LANG.getMsg(LANG.getStr("logout_confirmation_message")),
				onBack:Popup.hideAll,
				buttons:[{
						title:LANG.getStr("no_button"),
						onClick:Popup.hideAll
				},{
						title:LANG.getStr("yes_button"),
						onClick:function(){
							Popup.hideAll();
							me.removeClass("focus");
							User.logout();
						}
				}]
			});
		}
	}	
};

(function(){
	var leftAction = function(me){
		
			var $item = me.prevAll(".btn:first");
			if($item.length){
				
				me.removeClass("focus");
				Navigation.setClassFocus($item);				
			}		
		},
		rightAction = function(me){
		
			var $item = me.nextAll(".btn:first");
			if($item.length){
				
				me.removeClass("focus");
				Navigation.setClassFocus($item);				
			}else{
				Navigation.unsetFocusToMainMenu(me);
			}
		},
		upAction = function(me){
			var $item = $(document.getElementById("rubrics-list-menu")).children(".btn:visible:last");
			if($item.length){
				me.removeClass("focus");
				Navigation.setClassFocus($item);
			}
		};
	
	var i, limit = $(document.getElementById("menu-buttons-container")).children(".btn").length, idEl;
	for(i=0;i<limit;i++){
		idEl = "static-menu-button-"+(i+1);
		actionList[idEl].up = upAction;
		actionList[idEl].left = leftAction;
		actionList[idEl].right = rightAction;
	}
})();
	
																	/* **********/
																	/*	 LOGIN	*/
																	/* **********/
	
(function(){
	var elementsID = ["email-button", "password-button","validate-login-button"];
	 
	var leftAction = function(me){
			me.removeClass("focus");
			Navigation.setFocusToMainMenu(me);
		};
	
	var i, l=elementsID.length;
	for(i=0;i<l;i++){
		actionList[elementsID[i]].left = leftAction;
	}
})();
	
																	/* **************/
																	/*	 CLAVIER	*/
																	/* **************/
	
(function(){
	var elementsID = ["validate-keyboard-popup","delete-button"];
	 
	var upAction = function(me){
			
			if(!Popup.keyboard.isSearchPopup){
				me.removeClass("focus");
				Navigation.setClassFocus($(document.getElementById("close-button-keyboard-popup")));
			}			
		};
	
	var i, l=elementsID.length;
	for(i=0;i<l;i++){
		actionList[elementsID[i]].up = upAction;
	}
})();

(function(){
	var leftAction = function(me){
		
			var $btn = me.prev();
			if($btn.length){
				me.removeClass("focus");
				Navigation.setClassFocus($btn);
			}
		},
		rightAction = function(me){
		
			var $btn = me.next();
			if($btn.length){
				me.removeClass("focus");
				Navigation.setClassFocus($btn);
			}else{
				me.removeClass("focus");
				Navigation.setClassFocus($(document.getElementById("keyboard-buttons-container")).children(".btn:last-child"));
			}
		},
		downAction = function(me){
			Navigation.setFocusToKeyboard(me);
		};
	
	var i, limit = $(document.getElementById("keyboard-filter-buttons-container")).children(".btn").length, idEl;
	for(i=0;i<limit;i++){
		idEl = "keyboard-filter-button-"+(i+1);
		actionList[idEl].down = downAction;
		actionList[idEl].left = leftAction;
		actionList[idEl].right = rightAction;
	}
})();

																	/* **************************************************************/
																	/*	ACTION LEFT/RIGHT/DOWN COMMUNES AUX ELEMENTS DU CARROUSEL	*/
																	/* **************************************************************/

(function(){
	var elementsID = ["carrousel-button-1",
					"carrousel-button-2",
					"carrousel-button-3"];
	 
	var rightAction = function(me){
			var $btn = me.nextAll(".btn:visible:first");
			if($btn.length){
				me.removeClass("focus");
				Navigation.setClassFocus($btn);
				
			}else if(typeOf(Carrousel.data.list) === "array" && Carrousel.data.list.length){
				var $container = $(document.getElementById("carrousel-buttons-container"));
				if($container.children(":visible").length > 1){
					actionList[me[0].id].up(me);
				}else{
					actionList["carrousel-button-3"].up(me);
				}				
			}
		},
		leftAction = function(me){
			var $btn = me.prevAll(".btn:visible:first");
			if($btn.length){
				
				me.removeClass("focus");
				Navigation.setClassFocus($btn);
				
			}else if(typeOf(Carrousel.data.list) === "array" && Carrousel.data.list.length > 1){
				
				var $container = $(document.getElementById("carrousel-buttons-container"));
				if($container.children(":visible").length > 1){
					actionList[me[0].id].up(me);
				}else{
					actionList["carrousel-button-1"].up(me);
				}				
				
			}else if([Section.sections[0], Section.sections[2], Section.sections[11]].indexOf(Section.name) !== -1){
				Navigation.setFocusToMainMenu(me);

			}else{
				Navigation.setFocusToSubmenu(me);
			}
		},
		downAction = function(me){
			var $fullCatalogueBtn = $(document.getElementById("full-catalogue-button"));
			if($fullCatalogueBtn.is(":visible")){

				me.removeClass("focus");
				Navigation.setClassFocus($fullCatalogueBtn);
			}else{
				Navigation.setFocusToCollections(me,"down");
			}			
		};
	
	var i, l=elementsID.length;
	for(i=0;i<l;i++){
		actionList[elementsID[i]].left = leftAction;
		actionList[elementsID[i]].right = rightAction;
		actionList[elementsID[i]].down = downAction;
	}
})();

(function(){
	var elementsID = ["arrow-left-carrousel","arrow-right-carrousel"];
	 
	var downAction = function(me){
			var position = me.hasClass("left") ? "first" : "last";
			var $btn = $(document.getElementById("carrousel-buttons-container")).children(".btn:visible:"+position);
			if($btn.length){
				
				me.removeClass("focus");
				Navigation.setClassFocus($btn);
				
			}else{
				me.removeClass("focus");
				Navigation.setClassFocus($(document.getElementById("full-catalogue-button")));
			}
		},
		enterAction = function(me){
			Carrousel.hideButtons();
			me.click();
		};
	
	var i, l=elementsID.length;
	for(i=0;i<l;i++){
		actionList[elementsID[i]].down = downAction;
		actionList[elementsID[i]].enter = enterAction;
	}
})();
	
																	/* **********/
																	/*	 PLAYER	*/
																	/* **********/
	
(function(){
	var elementsID = ["pause-play-video-player-button","prev-video-player-button","next-video-player-button","language-button","return-button"];
	 
	var upAction = function(me){
			if(Section.rubric === Section.rubrics[Section.name][1] && InfoBanner.episodeButtonIsVisible){
				me.removeClass("focus");
				Navigation.setClassFocus($(document.getElementById("episode-button")));
			}
		},
		downAction = function(){
			InfoBanner.hide();
		};
	
	var i, l=elementsID.length;
	for(i=0;i<l;i++){
		actionList[elementsID[i]].up = upAction;
		actionList[elementsID[i]].down = downAction;
	}
})();

(function(){
	var elementsID = ["language-button","return-button","watch-button-splash","watchlist-button-splash","home-button"];

	var leftAction = function(me){
			var $item = me.prevAll(".btn:visible:first");
			if($item.length){
				me.removeClass("focus");
				Navigation.setClassFocus($item);
			}else{
				if(!Player.playlistTrailerActive){
					me.removeClass("focus");
					Navigation.setClassFocus($(document.getElementById("next-video-player-button")));
				}
			}
		},
		rightAction = function(me){
			
			var $item = me.nextAll(".btn:visible:first");
			if($item.length){
				me.removeClass("focus");
				Navigation.setClassFocus($item);
			}
		};
	
	var i, l=elementsID.length;
	for(i=0;i<l;i++){
		actionList[elementsID[i]].left = leftAction;
		actionList[elementsID[i]].right = rightAction;
	}
})();
	
																	/* **************/
																	/*	 DASHBOARD	*/
																	/* **************/
	
(function(){
	var elementsID = ["dashboard-watch-trailer-button","dashboard-watch-button","dashboard-resume-button","dashboard-watchlist-button"];
	 
	var leftAction = function(me){
			me.removeClass("focus");
			
			var $item = me.prevAll(".btn:visible:first");
			if($item.length){
				Navigation.setClassFocus($item);
			}else{
				Navigation.setClassFocus($(document.getElementById("return-button-dashboard")));
			}
		},
		rightAction = function(me){
			
			var $item = me.nextAll(".btn:visible:first");
			if($item.length){
				me.removeClass("focus");
				Navigation.setClassFocus($item);
			}
		},
		downAction = function(me){
			Navigation.setFocusToCollections(me, "down");
		};
	
	var i, l=elementsID.length;
	for(i=0;i<l;i++){
		actionList[elementsID[i]].left = leftAction;
		actionList[elementsID[i]].right = rightAction;
		actionList[elementsID[i]].down = downAction;
	}
})();
	
																	/* **********/
																	/*	 GRID	*/
																	/* **********/
	
(function(){
	var elementsID = ["top-menu-submenu-grid-button-1","top-menu-submenu-grid-button-2","top-menu-submenu-grid-button-3"];
	 
	var leftAction = function(me){
			me.removeClass("focus");
			
			var $item = me.prevAll(".btn:visible:first");
			if($item.length){
				
				Navigation.setClassFocus($item);
			}else if(Grid.fullMode){
				Navigation.setFocusToMainMenu();
			}else{
				Navigation.setFocusToSubmenu();
			}
		},
		rightAction = function(me){
			
			var $item = me.nextAll(".btn:visible:first");
			if($item.length){
				
				me.removeClass("focus");
				Navigation.setClassFocus($item);
			}
		},
		downAction = function(me){
			Navigation.setFocusToGrid(me, "down");
		},
		enterAction = function(me){
			Section.change(Section.name, Section.rubrics[Section.name][0], {url:Grid.getSortUrl(me.index(), Grid.fullMode, Submenu.indexSel)}, me);
		};
	
	var i, l=elementsID.length;
	for(i=0;i<l;i++){
		actionList[elementsID[i]].left = leftAction;
		actionList[elementsID[i]].right = rightAction;
		actionList[elementsID[i]].down = downAction;
		actionList[elementsID[i]].enter = enterAction;
	}
})();
	
																	/* **************************/
																	/*			COLLECTIONS	 	*/
																	/* **************************/
	
(function(){
	var elementsID = ["collections","dashboard-collections"];
	 
	var leftAction = function(me){
			Navigation.setFocusToAElementInCollections(me, "left");
		},
		rightAction = function(me){
			Navigation.setFocusToAElementInCollections(me, "right");
		},
		upAction = function(me){
			Navigation.setFocusToAElementInCollections(me,"up");
		},
		downAction = function(me){
			Navigation.setFocusToAElementInCollections(me,"down");
		},
		enterAction = function(me){
			Navigation.handlesEnterActionInCollections(me);
		};
	
	var i, l=elementsID.length;
	for(i=0;i<l;i++){
		actionList[elementsID[i]].left = leftAction;
		actionList[elementsID[i]].right = rightAction;
		actionList[elementsID[i]].up = upAction;
		actionList[elementsID[i]].down = downAction;
		actionList[elementsID[i]].enter = enterAction;
	}
})();