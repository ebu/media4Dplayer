var InfoBanner = {
	progressBar:{},
	episodeButtonIsVisible:false,
	timeoutHideBanner:null,
	isVisible:false,
	nextEpisodeToDisplay: false,
	timeoutNextEpisode: null,
	toTheNextEpisode: false
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Resets the info banner
 */

InfoBanner.reset = function(){
	$(document.getElementById("info-banner-section-name-and-arrow-container")).find(".focus").removeClass("focus");
	$(document.getElementById("media-title-banner")).removeClass("small").children().empty();
	$(document.getElementById("episode-button")).hide();
	$(document.getElementById("language-button")).hide();
	$(document.getElementById("next-episode-container")).hide();
	clearInterval(InfoBanner.timeoutNextEpisode);
	this.episodeButtonIsVisible = false;
	this.isVisible = false;
	this.toTheNextEpisode = false;
	this.nextEpisodeToDisplay = false;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches the generating of the info banner
 * @param {Object} data Containing data about the media
 */

InfoBanner.load = function(data){
	
	if(typeOf(data) === "object"){
		this.reset();
		this.generate(data);
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Inserts the media info in info banner and handles the displaying of buttons
 * @param {Object} data Containing data about the media
 */

InfoBanner.generate = function(data){
	var title = "";
    if (Player.playlistTrailerActive) {
        if (data.thumbnails[Config.trailerPosterSize] && data.thumbnails[Config.trailerPosterSize].url) {
            $(document.getElementById("media-thumb")).attr("src", data.thumbnails[Config.trailerPosterSize].url);
        }
        else if (data.thumbnails[Config.trailerPosterSize2] && data.thumbnails[Config.trailerPosterSize2].url) {
            $(document.getElementById("media-thumb")).attr("src", data.thumbnails[Config.trailerPosterSize2].url);
        }
        $(document.getElementById("info-banner-section-name-and-arrow-container")).addClass("splash");
    }
    else{
        $(document.getElementById("info-banner-section-name-and-arrow-container")).removeClass("splash");
		title = data.titles ? data.titles[LANG.codeLang] : data.title;
		if(data.seasonEpisodeTitle){
			title += "<br/>" + data.seasonEpisodeTitle;
			
		}else if(data.type === "Episodes" && typeOf(Dash.seriesData) ==="object" && typeOf(Dash.seriesData.titles) === "object" && Dash.seriesData.titles[LANG.codeLang]){
			title = Dash.seriesData.titles[LANG.codeLang] + "<br/>" + LANG.getMsg(LANG.getStr("saisonAndEpisode"), "%s",pad(data.season), "%e",pad(data.episode))[1];
		}else if(data.type !== "Movies" && Dash.type === "serie"){
			var season = Dash.seasons[0];
			var firstEpisode = Dash.episodes[season].titles[0];
			data.seasonEpisodeTitle = LANG.getMsg(LANG.getStr("saisonAndEpisode"), "%s",pad(season), "%e",pad(firstEpisode.tvSeasonEpisodeNumber));
			title += "<br/>" + data.seasonEpisodeTitle[1];
		}
    }

	var $titleCtn = $(document.getElementById("media-title-banner"));
	$titleCtn.children().html(title);

	if(0/*data.type === "Series"*/){
		this.episodeButtonIsVisible = true;
		$(document.getElementById("episode-button")).show();
		$titleCtn.addClass("small");
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Shows the info banner
 */

InfoBanner.show = function(){
	if(Section.name === Section.sections[9]){
		$(document.getElementById("info-banner-section-name-and-arrow-container")).show();
		this.isVisible = true;
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Hides the info banner
 */

InfoBanner.hide = function(){
	$(document.getElementById("info-banner-section-name-and-arrow-container")).hide();
	this.isVisible = false;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Shows the pause button
 */

InfoBanner.showPauseBtn = function(){
	$(document.getElementById("pause-play-video-player-button")).addClass("pause");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Hides the pause button
 */

InfoBanner.hidePauseBtn = function(){
	$(document.getElementById("pause-play-video-player-button")).removeClass("pause");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Returns which the info banner is currently displayed
 * @return {Boolean} Returns if the info banner is visible
 */

InfoBanner.isDisplayed = function(){
	return this.isVisible;
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches the masking of the info banner after an inactivities time
 */

InfoBanner.launchMaskingAfterDelay = function(){
	
	this.suspendMaskingAfterDelay();
	if(Section.name === Section.sections[9]){
		var time = Player.playlistTrailer && Player.playlistTrailer.length ? Config.infoBannerDelayToHideSuperhome : Config.infoBannerDelayToHide;
		this.timeoutHideBanner = setTimeout(function(){
			InfoBanner.executeMaskingAfterDelay();
		}, time * 1000);
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Relaunches the masking of the info banner after an inactivities time
 */

InfoBanner.suspendMaskingAfterDelay = function(){
	clearTimeout(this.timeoutHideBanner);
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

InfoBanner.executeMaskingAfterDelay = function(){
	if(Section.name === Section.sections[9] && Player.PAUSED !== Player.state && !Popup.isOpen){
		this.hide();
	}else{
		clearTimeout(this.timeoutHideBanner);
	}
};

																								/************************************************
																								*	GESTION DE LA BANNIERE VIDEO (PROGRESS BAR)	*
																								************************************************/

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Resets the progress bar
 */

InfoBanner.progressBar.reset = function(){
		
	$(document.getElementById("current-time")).text("-");
	$(document.getElementById("end-time")).text("-");
	$(document.getElementById("progressbar")).css("width", 0);
	
	InfoBanner.hidePauseBtn();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Updates the progress bar
 * @param {Integer} time The current position inside the video (in milliseconds)
 * @param {Integer} tT Total time of the video (in milliseconds)
 */

InfoBanner.progressBar.update = function(time, tT){
	// millisecond to second
	time = Math.floor(time/1000);
	tT = Math.floor(tT/1000);
	
	var timePercent         = (100 * time) / tT,
		timeC               = " - ",
		timeT               = " - ",
        timeHour            = 0,
		timeMinute          = 0,
		timeSecond          = 0,
        totalTimeHour       = 0,
		totalTimeMinute     = 0,
		totalTimeSecond     = 0,
	
	percent = (!isNaN(timePercent)?timePercent:0);

	$(document.getElementById("progressbar")).css("width", percent + "%");
	
	if([Player.PLAYING, Player.PAUSED].indexOf(Player.state) !== -1){
        totalTimeHour   = Math.floor(tT / 3600);
        timeHour        = Math.floor(time / 3600);
		totalTimeMinute = Math.floor((tT % 3600) / 60);
		timeMinute      = Math.floor((time % 3600) / 60);
		totalTimeSecond = Math.floor(tT % 60);
		timeSecond      = Math.floor(time % 60);

		var h = '';
		if((!isNaN(timeHour) && !isNaN(timeMinute) && !isNaN(timeSecond))){
			if(timeHour > 0){
				h = pad(timeHour) + ":";
			}
			timeC = h + pad(timeMinute) + ":" + pad(timeSecond);
		}
		var ht = '';
		if((!isNaN(totalTimeHour) && !isNaN(totalTimeMinute) && !isNaN(totalTimeSecond))){
			if(totalTimeHour > 0){
				ht = pad(totalTimeHour) + ":";
			}
			timeT = ht + pad(totalTimeMinute) + ":" + pad(totalTimeSecond);
		}
	}

	if([Player.PLAYING].indexOf(Player.state) !== -1){
		Player.hideLoaderSeek();
	}
	
	$(document.getElementById("current-time")).text(timeC);
	$(document.getElementById("end-time")).text(timeT);
};

/**
 * Update the display of the speed seek
 * @param {Integer} speed speed of jump seek : 2,4,8,16,32,64,128,256
 * @param {String} type : FF or RW
 */
InfoBanner.updateSpeedSeek = function(speed, type){
	var $type = $(document.getElementById("seek-video-type"));
	
	switch(type){
		case Player.RW:
			$type.addClass("RW");
			break;
			
		case Player.FF:
			$type.removeClass("RW");
			break;
			
		default :
			break;
	}
	
	$(document.getElementById("seek-video-speed")).text("x"+speed);
	Player.showLoaderSeek();
};

/**
 * @author Theo (DOTSCREEN)
 * @description Prepare DisplayNextEpisode
 * @param {Integer} episode The object episode
 */
InfoBanner.prepareDisplayNextEpisode = function(episode){
    if(typeOf(episode) === "object"){
        log("prepareDisplayNextEpisode next !!");
        InfoBanner.nextEpisodeToDisplay = true;
        InfoBanner.nextEpisode = episode;
        $(document.getElementById("starts-in")).html(LANG.getMsg(LANG.getStr("starts_in"), "%s",'20'));
    }else{
        log("prepareDisplayNextEpisode quit");
        InfoBanner.nextEpisodeToDisplay = false;
    }
};

/**
 * @author Theo (DOTSCREEN)
 * @description Display screen of next episode
 */
InfoBanner.displayNextEpisode = function(){

	log('InfoBanner.displayNextEpisode','blue');
	InfoBanner.hide();
	InfoBanner.toTheNextEpisode = true;
	var index = Config.timeoutToNextEpisode;

	$(document.getElementById("next-episode-button-container")).children().removeClass('focus');
	$(document.getElementById("next-episode-container")).show();
	var pictureUrl = InfoBanner.nextEpisode.thumbnails[Config.pictureSize] ? InfoBanner.nextEpisode.thumbnails[Config.pictureSize].url : null;
	loadAImg(pictureUrl, $(document.getElementById("preview-next-episode")),'img_def_episode.svg');
        
	Navigation.setClassFocus($(document.getElementById("watch-now-next-episode")));

	clearInterval(InfoBanner.timeoutNextEpisode);
	InfoBanner.timeoutNextEpisode = setInterval(function(){
		index--;
		if(index > 1){
			$(document.getElementById("starts-in")).html(LANG.getMsg(LANG.getStr("starts_in"), "%s",index));
		}else if(index === 1){
			$(document.getElementById("starts-in")).html(LANG.getStr("starts_in_one"));
		}else if(index === 0){
			InfoBanner.goToNextEpisode();
		}else{
			clearInterval(InfoBanner.timeoutNextEpisode);
		}
	},1000);
};

/**
 * @author Theo (DOTSCREEN)
 * @description launch the next episode
 */
InfoBanner.goToNextEpisode = function(){
	log('InfoBanner.goToNextEpisode','blue');
	clearInterval(InfoBanner.timeoutNextEpisode);
	InfoBanner.toTheNextEpisode = false;
	if(Dash.type !== Dash.types[1]){
		actionList["return-button-dashboard"].enter();
	}
	Dash.resume();
};