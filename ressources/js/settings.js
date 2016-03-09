var Settings = {
	minFontSize:16,
	minOpacity:0,
	minSubtitlesSize:16,
	subtitlesDefaultPosition:71,
	defaultLSPIPCoordonates: {x:75,y:4.5,w:22.51131221719457,h:40.04024144869215},
	fontList:["Arial","OpenDyslexic","Andika","Helvetica","Lexia"],
	init:{},
	change:{},
	defaultVolumeValue:70,
	backToPlayerFromSettings:false
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
	
	var $backToPlayerCtn = $(document.getElementById("back-to-player-button-container"));
	if(this.backToPlayerFromSettings){
		$backToPlayerCtn.show();
	}else{
		$backToPlayerCtn.hide();
	}

	var rubrics = Section.rubrics[section];
	if(rubric === rubrics[1]){
		this.init.audio();
		
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
	this.interface.fontSize();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Settings.init.audio = function(){
	
	/* Le choix du mode de spatialisation */
	var val = Player.spatializationMode === Player.spatializationModes[0] && Player.binauralEQ ? "binaural-EQ" : Player.spatializationMode;
	$(document.getElementById("spatialisation-options")).val(val).selectmenu({
		select: function( event, ui ) {
			
			var val = ui.item.value;
			var values = Player.spatializationModes;
			
			if(values.indexOf(val) !== -1){
				Player.spatializationMode = val;
				Player.binauralEQ = false;
				
			}else if(val === "binaural-EQ"){
				Player.spatializationMode = values[0];
				Player.binauralEQ = true;				
			}
		}
	});
	
	/* Le niveau des dialogues */
	var _onSlide = function(value, el) {
		
		var type = $(el).data("type");
		if(type === "commentary"){
			Player.commentsElevationLevel = value;
			log("Niveau d'élévation des commentaires : " + value + "°");
			
		}else if(type === "dialogues"){
			log("Niveau d'élévation des dialogues : " + value + "°");			
		}

		var $slider = $(el).children("a");

		if(value >= 45) { 
			$slider.text("Haut");

		}else if (value <= 0) {
			$slider.text("Bas");

		}else{
			$slider.text("Tête");
		}
	};
	
	var $vSlider = $( document.getElementById("comments-elevation-level") ).slider({
        range: "min",
        min: -40,
		max: 90,
		orientation:"vertical",
        value: Player.commentsElevationLevel,
 
        slide: function(event, ui){
			_onSlide(ui.value, this);
		}
	});
	_onSlide(Player.commentsElevationLevel, $vSlider);
	
	
	
	
	
	var $container = $(document.getElementById("comments-spatialisation-zone-ctn")); 
	var $pipVideo = $container.find(".spatialisation-zone").css("top", "127px").css("left", "127px");
	$pipVideo.draggable({ 	
		containment: $container,
		scroll:false,
		drag: function (e, ui) {
			
			/*var pointerEl = this;
			var canvasEl = $container[0];
			var canvas = {
				width: canvasEl.offsetWidth,
				height: canvasEl.offsetHeight,
				top: canvasEl.offsetTop,
				left: canvasEl.offsetLeft
			};
			canvas.center = [canvas.left + canvas.width / 2, canvas.top + canvas.height / 2];
			canvas.radius = canvas.width / 2;			
			
			function limit(x, y) {
				var dist = distance([x, y], canvas.center);
				if (dist <= canvas.radius) {
					log("yes++++++++++++++++++++++++");
					return {x: x, y: y};
				} 
				else {
					log("no--------------------");
					x = x - canvas.center[0];
					y = y - canvas.center[1];
					var radians = Math.atan2(y, x)
				   return {
					   x: Math.cos(radians) * canvas.radius + canvas.center[0],
					   y: Math.sin(radians) * canvas.radius + canvas.center[1]
				   }
				} 
			}

			function distance(dot1, dot2) {
				var x1 = dot1[0],
					y1 = dot1[1],
					x2 = dot2[0],
					y2 = dot2[1];
				return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
			}
			
			var result = limit(ui.offset.left, ui.offset.top);
			if(!result){
				
			}
			pointerEl.style.left = result.x + "px";
			pointerEl.style.top = result.y + "px";		*/	

			
			
			
		},
		stop: function(e, ui) {
			/*log("stop event");
			
			var canvasEl = $container[0];
			var canvas = {
				width: canvasEl.offsetWidth,
				height: canvasEl.offsetHeight,
				top: canvasEl.offsetTop,
				left: canvasEl.offsetLeft
			};
			canvas.center = [canvas.left + canvas.width / 2, canvas.top + canvas.height / 2];
			canvas.radius = canvas.width / 2;			
			
			function limit(x, y) {
				var dist = distance([x, y], canvas.center);
				if (dist <= canvas.radius) {
					log("yes++++++++++++++++++++++++");
					return {x: x, y: y};
				} 
				else {
					log("no--------------------");
					x = x - canvas.center[0];
					y = y - canvas.center[1];
					var radians = Math.atan2(y, x)
				   return {
					   x: Math.cos(radians) * canvas.radius + canvas.center[0],
					   y: Math.sin(radians) * canvas.radius + canvas.center[1]
				   }
				} 
			}

			function distance(dot1, dot2) {
				var x1 = dot1[0],
					y1 = dot1[1],
					x2 = dot2[0],
					y2 = dot2[1];
				return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
			}
			
			var result = limit(ui.offset.left, ui.offset.top);
			log($(this).offset().left+" > "+result.x);
			log($(this).offset().top+" > "+result.y);
			$(this).offset().left = result.x;
			$(this).offset().top = result.y;	*/		
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

Settings.init.interface.fontSize = function(){
	var valueMinSize = (getCookie("settings_min_size") != null) ? getCookie("settings_min_size") : Settings.minFontSize;
	$(document.getElementById(Main.simplifiedMode ? "fontSlide-sm" : "fontSlide")).val(valueMinSize);
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
	this.subtitles.fontFamily();
	
	/* COULEUR D'ARRIERE PLAN */
	this.subtitles.BGColor();
	
	/* COULEUR DU TEXTE */
	this.subtitles.color();
	
	/* OPACITE DE L'ARRIERE PLAN DES SOUS-TITRES */
	var valueMinOpacity = (getCookie("subtitleBackgroundOpacity") != null) ? getCookie("subtitleBackgroundOpacity") : Settings.minOpacity;
	$(document.getElementById("opacitySlide")).val(valueMinOpacity);
	Settings.change.subtitlesOpacity(valueMinOpacity);
	
	/* TAILLE DES SOUS-TITRES */
	var valueMinSize = (getCookie("subtitleFontSize") != null) ? getCookie("subtitleFontSize") : Settings.minSubtitlesSize;
	$(document.getElementById("subtitlesFontSlide")).val(valueMinSize);
	Settings.change.subtitlesFontSize(valueMinSize);
	
	/* POSITION DES SOUS-TITRES */
	this.subtitles.pip();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Generates the parental rating rubric of the settings section
 * @param {String} name The user's name
 * @param {Object} userDetails The user's data
 * @param {Array} thresholds Thresholds list
 * @param {Object} callbackList Contains a success and error callback
 */

Settings.init.subtitles.fontFamily = function(){
	var selectedFont = getCookie("subtitleFont");
	if(selectedFont && Settings.fontList.indexOf(selectedFont) !== -1){
		Settings.change.subtitlesFontFamily(selectedFont);
		
	}else{
		setCookie("subtitleFont", Settings.fontList[0]);
		Settings.change.subtitlesFontFamily(Settings.fontList[0]);
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

Settings.init.subtitles.color = function(){
	var selectedFontColor = getCookie("subtitleFontColor");
	if(selectedFontColor){
		Settings.change.subtitlesColor(selectedFontColor);
	}else{
		Settings.change.subtitlesColor("transparent");
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

Settings.init.subtitles.BGColor = function(){
	var selectedFontBGColor = getCookie("subtitleBGColor");
	if(selectedFontBGColor){
		Settings.change.subtitlesBackgroundColor(selectedFontBGColor);
	}else{
		Settings.change.subtitlesBackgroundColor("black");
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

Settings.init.subtitles.pip = function(){
	
	/* PIP SUBTITLES */
	var pipTopPercent = (getCookie("LSFPipSubtitles_position_y") != null && !isNaN(getCookie("LSFPipSubtitles_position_y"))) ? getCookie("LSFPipSubtitles_position_y") : Settings.subtitlesDefaultPosition;
	var $container = $(document.getElementById(Main.simplifiedMode ? "uiSubtitles-sm-container" : "uiSubtitles-container")); 
	var $pipVideo = $container.find(".pip-video").css("top", pipTopPercent+"%");
	$pipVideo.draggable({ 	
		containment: $container,
		scroll:false,
		axis: "y",
		handle:".ui-icon-gripsmall-center",
		stop: function() {
			Settings.saveSubtitlesPIPPosition($( this ).parent($( this ).draggable( "option", "containment" )));
		},
		create: function(){
			log("create event");
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
	
	var $container = $(document.getElementById(Main.simplifiedMode ? "uiLS-container-sm" : "uiLS-container")); 
	var $pipVideo = $container.find(".pip-video").attr("style",'left: '+pipLeftPercent+'%; top: '+pipTopPercent+'%; width:'+pipWidthReal+'%; height:'+ pipHeightReal +'%');
	$pipVideo.draggable({
		containment: $container,
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
		stop: function() {
			log("Resize terminé !!!");
			Settings.saveLSPIPSize($( this ).parents($( this ).draggable( "option", "containment" )), $(this));
			Settings.saveLSPIPPosition($( this ).parents($( this ).draggable( "option", "containment" )), $(this));
		},
		create: function(){
			log("create event");
		}
	});
	
	$container.find('.ui-resizable-nw').addClass('ui-icon ui-icon-gripsmall-diagonal-nw').end()
		.find('.ui-resizable-ne').addClass('ui-icon ui-icon-gripsmall-diagonal-ne').end()
		.find('.ui-resizable-sw').addClass('ui-icon ui-icon-gripsmall-diagonal-sw').end()
		.find('.ui-resizable-se').addClass('ui-icon ui-icon-gripsmall-diagonal-se');
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
	setCookie("subtitleFont", ff);
	$(".ui-subtitles .pip-text").removeClass("Arial OpenDyslexic Andika Helvetica Lexia").addClass(ff);
	
	if(Main.simplifiedMode){
		$(document.getElementById("font-family")).children(".menu-item."+ff).addClass("selected").siblings().removeClass("selected");		
	}else{
		$(".option-font-family .font-family."+ff).addClass("selected").siblings().removeClass("selected");
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

Settings.change.subtitlesBackgroundColor = function(color){
	setCookie("subtitleBGColor", color);
	$(".option-background-color .color[data-color='"+color+"']").addClass("selected").siblings().removeClass("selected");
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
	setCookie("subtitleFontColor", color);
	$(".option-text-color .color[data-color='"+color+"']").addClass("selected").siblings().removeClass("selected");
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