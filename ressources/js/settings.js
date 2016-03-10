var Settings = {
	minFontSize:16,
	minOpacity:0,
	minSubtitlesSize:16,
	subtitlesDefaultPosition:71,
	defaultLSPIPCoordonates: {x:75,y:4.5,w:22.51131221719457,h:40.04024144869215},
	fontList:["Arial","OpenDyslexic","Andika","Helvetica","Lexia"],
	defaultFont:"Arial",
	defaultSubtitlesColor:"transparent",
	defaultSubtitlesBGColor:"black",
	init:{},
	change:{},
	defaultVolumeValue:70,
	backToPlayerFromSettings:false,
	minDistance:30
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
	
	var elevationRange = Player.elevationRange,
		distanceRange = Player.distanceRange;
	
	/* Le choix du mode de spatialisation */
	var spatMode = getHtmlStorage("spatializationMode") || Player.spatializationMode,
		binauralEQ = getHtmlStorage("binauralEQ") || Player.binauralEQ,
		val = spatMode === Player.spatializationModes[0] && binauralEQ ? "binaural-EQ" : spatMode;
	
	$(document.getElementById("spatialisation-options")).val(val).selectmenu({
		select: function( event, ui ) {
			
			var val = ui.item.value;
			var values = Player.spatializationModes;
			
			var _save = function(){
				setHtmlStorage("spatializationMode", Player.spatializationMode);
				setHtmlStorage("binauralEQ", Player.binauralEQ);				
			};
			
			if(values.indexOf(val) !== -1){
				Player.spatializationMode = val;
				Player.binauralEQ = false;
				_save();
				
			}else if(val === "binaural-EQ"){
				Player.spatializationMode = values[0];
				Player.binauralEQ = true;
				_save();		
			}
		}
	});
	
	/* Le niveau des commentaires */
	var _onSlide = function(value, el) {
		
		var type = $(el).data("type");
		if(type === "commentary"){
			Player.commentsElevationLevel = value;
			setHtmlStorage("commentsElevationLevel", value);
			log("Niveau d'élévation des commentaires : " + value + "°");
			
		}else if(type === "dialogues"){
			Player.dialoguesElevationLevel = value;
			setHtmlStorage("dialoguesElevationLevel", value);
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
	var commentsElLlv = getHtmlStorage("commentsElevationLevel") || Player.commentsElevationLevel;
	var $vSlider = $( document.getElementById("comments-elevation-level") ).slider({
        range: "min",
        min: elevationRange[0],
		max: elevationRange[1],
		orientation:"vertical",
        value: commentsElLlv,
 
        slide: function(event, ui){
			_onSlide(ui.value, this);
		}
	});
	_onSlide(commentsElLlv, $vSlider);	
	
	/* La zone des commentaires */
	var _onDrag = function(e, ui){
		
		var minDistance = Settings.minDistance,
			type = $(this).data("type"),
			$ctn = $(this).parent(),
			canvas = {
			width: $ctn.width(),
			height: $ctn.height(),
			top: 0,
			left: 0
		};
		canvas.center = [canvas.left + canvas.width / 2, canvas.top + canvas.height / 2];
		canvas.radius = canvas.width / 2;			

		function limit(x, y) {
			var dist = distance([x, y], canvas.center);
			if (dist <= canvas.radius && dist >= minDistance) {
				return {x: x, y: y};

			}else{
				var radius = dist <= minDistance ? minDistance : canvas.radius;
				x = x - canvas.center[0];
				y = y - canvas.center[1];
				var radians = Math.atan2(y, x);
				return {
					x: Math.cos(radians) * radius + canvas.center[0],
					y: Math.sin(radians) * radius + canvas.center[1]
				};		
			}
		}

		function distance(dot1, dot2) {
			var x1 = dot1[0],
				y1 = dot1[1],
				x2 = dot2[0],
				y2 = dot2[1];
			return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
		}

		var result = limit(ui.position.left, ui.position.top);			
		ui.position.left = result.x;
		ui.position.top = result.y;

		// Récupère la distance
		function getDistanceInMeter(d, rangePx, rangeMeter){
			var distance = ((d - rangePx[0]) * (rangeMeter[1] - rangeMeter[0]) / (rangePx[1] - rangePx[0])) + rangeMeter[0];
			return Math.round(distance * Math.pow(10,2)) / Math.pow(10,2);
		}
		function saveDistance(value, type){
			if(type === "commentary"){
				Player.commentsDistance = value;
				setHtmlStorage("commentsDistance", value);
				
			}else if(type === "dialogues"){
				Player.dialoguesDistance = value;
				setHtmlStorage("dialoguesDistance", value);				
			}
		}
		var dist = distance([result.x, result.y], canvas.center);
		var dist2 = dist < minDistance ? minDistance : dist > canvas.radius ? canvas.radius : dist;
		var distanceMeter = getDistanceInMeter(dist2, [minDistance, canvas.radius], distanceRange);
		saveDistance(distanceMeter, type);
		//log("distance = " + dist2 + "px ("+distanceMeter+"m)");
		
		// Récupère l'angle
		function getAzim(sinus, angle){
			if(sinus <= 0){
				return  0 - angle;
			}else{
				return angle;
			}
		}
		function saveAzim(value, type){
			if(type === "commentary"){
				Player.commentsAzim = value;
				setHtmlStorage("commentsAzim", value);
				
			}else if(type === "dialogues"){
				Player.dialoguesAzim = value;
				setHtmlStorage("dialoguesAzim", value);				
			}
		}
		var cosinus = -(ui.position.top - canvas.center[1]) / dist;
		var sinus = (ui.position.left - canvas.center[0]) / dist;
		
		var angle1 = Math.acos(cosinus) * Player.azimRadius / Math.PI;
		var azim = Math.round(getAzim(sinus, angle1));
		saveAzim(azim, type);
		//log("angle1 = " + angle1+"; sinus = " + sinus+"; azim = "+azim);
		
		// Mémorise la position
		if(type === "commentary"){
			setHtmlStorage("commentsDistanceAzimPosition", JSON.stringify(ui.position));

		}else if(type === "dialogues"){
			setHtmlStorage("dialoguesDistanceAzimPosition", ui.position);				
		}
		log("distance = "+distanceMeter+"m; azim = " + azim + "°");
	};
	
	var positions = getHtmlStorage("commentsDistanceAzimPosition");
	if(positions){
		positions = JSON.parse(positions);
	}else{
		positions = {top:92,left:127};
	}
	var $container = $(document.getElementById("comments-spatialisation-zone-ctn")); 
	$container.find(".spatialisation-zone").css(positions).draggable({
		scroll:false,
		drag: _onDrag
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
	var valueMinSize = getHtmlStorage("settings_min_size") || Settings.minFontSize;
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
	var valueMinOpacity = getHtmlStorage("subtitleBackgroundOpacity") || Settings.minOpacity;
	$(document.getElementById("opacitySlide")).val(valueMinOpacity);
	Settings.change.subtitlesOpacity(valueMinOpacity);
	
	/* TAILLE DES SOUS-TITRES */
	var valueMinSize = getHtmlStorage("subtitleFontSize") || Settings.minSubtitlesSize;
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
	var selectedFont = getHtmlStorage("subtitleFont");
	if(selectedFont && Settings.fontList.indexOf(selectedFont) !== -1){
		Settings.change.subtitlesFontFamily(selectedFont);
		
	}else{
		setHtmlStorage("subtitleFont", Settings.defaultFont);
		Settings.change.subtitlesFontFamily(Settings.defaultFont);
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
	var selectedFontColor = getHtmlStorage("subtitleFontColor") || Settings.defaultSubtitlesColor;
	if(selectedFontColor){
		Settings.change.subtitlesColor(selectedFontColor);
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
	var selectedFontBGColor = getHtmlStorage("subtitleBGColor") || Settings.defaultSubtitlesBGColor;
	if(selectedFontBGColor){
		Settings.change.subtitlesBackgroundColor(selectedFontBGColor);
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
	var pipTopPercent = (getHtmlStorage("LSFPipSubtitles_position_y") && !isNaN(getHtmlStorage("LSFPipSubtitles_position_y"))) ? getHtmlStorage("LSFPipSubtitles_position_y") : Settings.subtitlesDefaultPosition;
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
	var pipLeftPercent = (getHtmlStorage("LSFPip_position_x") && !isNaN(getHtmlStorage("LSFPip_position_x"))) ? getHtmlStorage("LSFPip_position_x") : defaultCoordonates.x;
	var pipTopPercent = (getHtmlStorage("LSFPip_position_y") && !isNaN(getHtmlStorage("LSFPip_position_y"))) ? getHtmlStorage("LSFPip_position_y") : defaultCoordonates.y;

	var pipWidthReal = getHtmlStorage("LSFPip_size_width") || defaultCoordonates.w;
	var pipHeightReal = getHtmlStorage("LSFPip_size_height") || defaultCoordonates.h;	
	
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
	setHtmlStorage("settings_min_size", newValue);
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
	setHtmlStorage("subtitleFont", ff);
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
	setHtmlStorage("subtitleBGColor", color);
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
	setHtmlStorage("subtitleFontColor", color);
	$(".option-text-color .color[data-color='"+color+"']").addClass("selected").siblings().removeClass("selected");
	$(".ui-subtitles .pip-text").removeClass("transparentColor whiteColor yellowColor blueColor").addClass(color+"Color");
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
	setHtmlStorage("subtitleBackgroundOpacity", newValue);
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
	setHtmlStorage("subtitleFontSize", newValue);
	$(".ui-subtitles .pip-text").css("font-size", newValue+"px");
};

Settings.saveSubtitlesPIPPosition = function($container){
	var newTopPercent = ($container.children(".pip-video").position().top / $container.height()) * 100;
	newTopPercent -= Math.round(2 * $container.height() / 100 * 2);
	log("Pourcentage sans les marges : "+newTopPercent);

	setHtmlStorage("LSFPipSubtitles_position_y", newTopPercent<0?0:newTopPercent);
};

Settings.saveLSPIPPosition = function($container, $pip){
	
	var newLeftPercent = ($pip.position().left / $container.width()) * 100;
	var newTopPercent = ($pip.position().top / $container.height()) * 100;

	//log("Pourcentage sans les marges = left:"+ newLeftPercent+ ", top:" + newTopPercent);

	setHtmlStorage("LSFPip_position_x", newLeftPercent<0?0:newLeftPercent);
	setHtmlStorage("LSFPip_position_y", newTopPercent<0?0:newTopPercent);		
};

Settings.saveLSPIPSize = function($container, $pip){
	var pipWidth = $pip.width();
	var pipHeight = $pip.height();
	var containerWidth = $container.width();
	var containerHeight = $container.height();

	var newWidthPercent = (pipWidth/containerWidth)*100;
	var newHeightPercent = (pipHeight/containerHeight)*100;

	//log("saveLSFSize :"+newWidthPercent+"x"+newHeightPercent+" dans un container de "+containerWidth+"x"+containerHeight);
	setHtmlStorage("LSFPip_size_width", newWidthPercent);
	setHtmlStorage("LSFPip_size_height", newHeightPercent);	
};