var Settings = {
	minFontSize:16,
	minOpacity:0,
	minSubtitlesSize:16,
	subtitlesDefaultPosition:71,
	defaultLSPIPCoordonates: {x:75,y:4.5,w:22.51131221719457,h:40.04024144869215},
	fontList:["Arial","OpenDyslexic","Andika","Helvetica","Lexia"],
	init:{},
	change:{},
	defaultVolumeValue:70
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Settings.init = function(section, rubric){	
	$(document.getElementById("settings")).attr("class", "section-with-topbar " + (rubric || Section.rubrics[section][0]));

	var rubrics = Section.rubrics[section];
	if(rubric === rubrics[1]){
		//this.init.audio();
		
	}else if(rubric === rubrics[2]){
		this.init.subtitles();
		
	}else if(rubric === rubrics[3]){
		this.init.ls();
		
	}else{
		this.init.interface();
	}	
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Settings.init.interface = function(){
	var valueMinSize = (getCookie("settings_min_size") != null) ? getCookie("settings_min_size") : Settings.minFontSize;
	$(document.getElementById("fontSlide")).attr("value", valueMinSize);
	Settings.change.fontSize(valueMinSize);
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Settings.init.subtitles = function(){
	
	/* CHOIX DE POLICE */
	var selectedFont = getCookie("subtitleFont");
	if(selectedFont && Settings.fontList.indexOf(selectedFont) !== -1){
		Settings.change.subtitlesFontFamily(selectedFont);
		
	}else{
		setCookie("subtitleFont", Settings.fontList[0]);
		Settings.change.subtitlesFontFamily(Settings.fontList[0]);
	}
	
	/* COULEUR D'ARRIERE PLAN */
	var selectedFontBGColor = getCookie("subtitleBGColor");
	if(selectedFontBGColor){
		Settings.change.subtitlesBackgroundColor(selectedFontBGColor);
	}else{
		Settings.change.subtitlesBackgroundColor("black");
	}
	
	/* COULEUR DU TEXTE */
	var selectedFontColor = getCookie("subtitleFontColor");
	if(selectedFontColor){
		Settings.change.subtitlesColor(selectedFontColor);
	}else{
		Settings.change.subtitlesColor("transparent");
	}
	
	/* OPACITE DE L'ARRIERE PLAN DES SOUS-TITRES */
	var valueMinOpacity = (getCookie("subtitleBackgroundOpacity") != null) ? getCookie("subtitleBackgroundOpacity") : Settings.minOpacity;
	$(document.getElementById("opacitySlide")).attr("value", valueMinOpacity);
	Settings.change.subtitlesOpacity(valueMinOpacity);
	
	/* TAILLE DES SOUS-TITRES */
	var valueMinSize = (getCookie("subtitleFontSize") != null) ? getCookie("subtitleFontSize") : Settings.minSubtitlesSize;
	$(document.getElementById("subtitlesFontSlide")).attr("value", valueMinSize);
	Settings.change.subtitlesFontSize(valueMinSize);
	
	/* PIP SUBTITLES */
	var pipTopPercent = (getCookie("LSFPipSubtitles_position_y") != null && !isNaN(getCookie("LSFPipSubtitles_position_y"))) ? getCookie("LSFPipSubtitles_position_y") : Settings.subtitlesDefaultPosition;
	var $pipVideo = $(".ui-subtitles > .pip-video").css("top", pipTopPercent+"%");
	$pipVideo.draggable({ 	
		containment: ".ui-subtitles",
		scroll:false,
		axis: "y",
		handle:".ui-icon-gripsmall-center",
		stop: function() {
			Settings.saveSubtitlesPIPPosition($( this ).parent($( this ).draggable( "option", "containment" )));
		}
	});	
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Settings.init.ls = function(){
	var defaultCoordonates = Settings.defaultLSPIPCoordonates;
	var pipLeftPercent = (getCookie("LSFPip_position_x") != null && !isNaN(getCookie("LSFPip_position_x"))) ? getCookie("LSFPip_position_x") : defaultCoordonates.x;
	var pipTopPercent = (getCookie("LSFPip_position_y") != null && !isNaN(getCookie("LSFPip_position_y"))) ? getCookie("LSFPip_position_y") : defaultCoordonates.y;

	var pipWidthReal = (getCookie("LSFPip_size_width") != null) ? getCookie("LSFPip_size_width") : defaultCoordonates.w;
	var pipHeightReal = (getCookie("LSFPip_size_height") != null) ? getCookie("LSFPip_size_height") : defaultCoordonates.h;	
	
	var $pipVideo = $(".ui-ls .pip-video").attr("style",'left: '+pipLeftPercent+'%; top: '+pipTopPercent+'%; width:'+pipWidthReal+'%; height:'+ pipHeightReal +'%');
	$pipVideo.draggable({ 	
		containment: $pipVideo.parents(".ui-ls"),
		scroll:false,
		handle:".ui-icon-gripsmall-center",
		stop: function() {
			Settings.saveLSPIPPosition($( this ).parents($( this ).draggable( "option", "containment" )), $(this));
		}
	}).resizable( {
		containment: "parent",
		handles: 'all',
		minWidth: 100,
      	aspectRatio: true,
		resize: function() {
			log("resize");
			//mySettingsScreen.updateIconsPip();
		},
		stop: function() {
			log("Resize terminé !!!");
			Settings.saveLSPIPSize($( this ).parents($( this ).draggable( "option", "containment" )), $(this));
			Settings.saveLSPIPPosition($( this ).parents($( this ).draggable( "option", "containment" )), $(this));
		},
		create: function(){
			log("create event");
		}
	});
	
	$('.ui-ls .ui-resizable-nw').addClass('ui-icon ui-icon-gripsmall-diagonal-nw');
	$('.ui-ls .ui-resizable-ne').addClass('ui-icon ui-icon-gripsmall-diagonal-ne');
	$('.ui-ls .ui-resizable-sw').addClass('ui-icon ui-icon-gripsmall-diagonal-sw');
	$('.ui-ls .ui-resizable-se').addClass('ui-icon ui-icon-gripsmall-diagonal-se');
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Settings.change.fontSize = function(newValue){	
	setCookie("settings_min_size", newValue);
	$("body > div").css("font-size", (newValue / 16) + "em");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Settings.change.subtitlesFontFamily = function(ff){
	$(".option-font-family .font-family."+ff).addClass("selected").siblings().removeClass("selected");
	setCookie("subtitleFont", ff);
	$(".ui-subtitles .pip-text").removeClass("Arial OpenDyslexic Andika Helvetica Lexia").addClass(ff);
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Settings.change.subtitlesBackgroundColor = function(color){
	$(".option-background-color .color."+color).addClass("selected").siblings().removeClass("selected");
	setCookie("subtitleBGColor", color);
	$(".ui-subtitles .pip-text").removeClass("blackBGColor whiteBGColor").addClass(color+"BGColor");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Settings.change.subtitlesColor = function(color){
	$(".option-text-color .color."+color).addClass("selected").siblings().removeClass("selected");
	setCookie("subtitleFontColor", color);
	$(".ui-subtitles .pip-text").removeClass("multiColor whiteColor yellowColor blueColor").addClass(color+"Color");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Settings.change.subtitlesOpacity = function(newValue){
	setCookie("subtitleBackgroundOpacity", newValue);
	$(".ui-subtitles .pip-text").removeClass("opacity_0 opacity_025 opacity_05 opacity_075 opacity_1").addClass("opacity_"+newValue.toString().replace(".",""));
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Settings.change.subtitlesFontSize = function(newValue){
	setCookie("subtitleFontSize", newValue);
	$(".ui-subtitles .pip-text").css("font-size", newValue+"px");
};

Settings.saveSubtitlesPIPPosition = function($container){
	var newTopPercent = ($container.children(".pip-video").position().top / $container.height()) * 100;
	newTopPercent -= Math.round(2 * $container.height() / 100 * 2);
	log("Pourcentage sans les marges : "+newTopPercent);

	setCookie("LSFPipSubtitles_position_y", newTopPercent<0?0:newTopPercent);
};

Settings.saveLSPIPPosition = function($container, $pip){
	
	var newLeftPercent = ($pip.position().left / $container.width()) * 100;
	var newTopPercent = ($pip.position().top / $container.height()) * 100;

	//log("Pourcentage sans les marges = left:"+ newLeftPercent+ ", top:" + newTopPercent);

	setCookie("LSFPip_position_x", newLeftPercent<0?0:newLeftPercent);
	setCookie("LSFPip_position_y", newTopPercent<0?0:newTopPercent);		
};

Settings.saveLSPIPSize = function($container, $pip){
	var pipWidth = $pip.width();
	var pipHeight = $pip.height();
	var containerWidth = $container.width();
	var containerHeight = $container.height();

	var newWidthPercent = (pipWidth/containerWidth)*100;
	var newHeightPercent = (pipHeight/containerHeight)*100;

	//log("saveLSFSize :"+newWidthPercent+"x"+newHeightPercent+" dans un container de "+containerWidth+"x"+containerHeight);
	setCookie("LSFPip_size_width", newWidthPercent);
	setCookie("LSFPip_size_height", newHeightPercent);	
};