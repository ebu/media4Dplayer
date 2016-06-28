var Settings = {
	fontSizeRange:[16,24],
	minOpacity:0,
	minSubtitlesSize:16,
	subtitlesSizeRange:[16,34],
	subtitlesDefaultPosition:71,
	defaultLSPIPCoordonates: {x:75,y:4.5,w:22.51131221719457,h:40.04024144869215},
	fontList:["Arial","OpenDyslexic","Andika","Helvetica","Verdana"],
	defaultFont:"Arial",
	defaultSubtitlesColor:"transparent",
	defaultSubtitlesBGColor:"black",
	init:{},
	change:{},
	defaultVolumeValue:70,
	defaultDialogEnhancementBalance:100,
	adGainRange:[0,100],
	backToPlayerFromSettings:false,
	minDistance:30
};
	
																	/* **************************************************/
																	/*	 FONCTIONS POUR L'INITIALISATION DES PARAMETRES	*/
																	/* **************************************************/
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
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
 * @description Initializes the screen of interface parameters
 */

Settings.init.interface = function(){
	this.interface.fontSize();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the screen of audio parameters
 */

Settings.init.audio = function(){
	
	/* Le bouton Renforcement des dialogues */
	var $dE = $(document.getElementById("dialogues-extended-btn"));
	Player.dialogsEnhanced = Player.getDialogsEnhancedState();
	if(Player.dialogsEnhanced){
		$dE.addClass("active");
	}else{
		$dE.removeClass("active");
	}
		
	/* Le choix du mode de spatialisation */
	this.audio.spatialisationMode();
		
	/* Le choix d'un profil */
	this.audio.audioProfil();
	
	/* Le niveau des commentaires */
	this.audio.elevationLevel($(document.getElementById("comments-elevation-level")), getHtmlStorage("commentsElevationLevel") || Player.commentsElevationLevel);
	
	/* Le niveau des dialogues */
	this.audio.elevationLevel($(document.getElementById("dialogues-elevation-level")), getHtmlStorage("dialoguesElevationLevel") || Player.dialoguesElevationLevel);
	
	/* La zone des commentaires */
	this.audio.azimDistance($(document.getElementById("comments-spatialisation-zone")));
	
	/* La zone des dialogues */
	this.audio.azimDistance($(document.getElementById("dialogues-spatialisation-zone")));
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters of spatialisation mode for the audio screen
 */

Settings.init.audio.spatialisationMode = function(){
	var spatMode = getHtmlStorage("spatializationMode") || Player.spatializationMode,
		binauralEQ = getHtmlStorage("binauralEQ") || Player.binauralEQ,
		val = spatMode === Player.spatializationModes[0] && binauralEQ === "true" ? "binaural-EQ" : spatMode;
	
	Settings.change.audioSpatialisationMode(val);
	
	if(!Main.simplifiedMode){
		$(document.getElementById("spatialisation-options")).selectmenu({
			select: function( event, ui ) {
				Settings.change.audioSpatialisationMode(ui.item.value);
			}
		});
	}	
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Loads the profils catalogue for the audio screen
 */

Settings.init.audio.audioProfil = function(){
	
	var _callback = function(list){
		
		if(!Main.simplifiedMode){
			
			var $select = $(document.getElementById("audio-profils-options")), $option;
			if(!$select.children().length){	
				
				list.forEach( function (url) {
					$option = document.createElement('option');
					$option.textContent = url.replace("http://bili2.ircam.fr/SimpleFreeFieldHRIR/", ".../").replace("_C_HRIR.sofa", "");
					$option.value = url;
					$select.append($option);
				});
			}			
			
			Settings.init.audio.audioProfil.setAudioProfil(list);
				
			$select.selectmenu({
				select: function( event, ui ) {
					Settings.change.audioProfil(ui.item.value);
				}
			}).selectmenu( "menuWidget" ).addClass( "overflow" );
		}
	};
	
	if(Player.catalogue.length){
		_callback(Player.catalogue);
	}else{
		getSofaCatalogue(Player.defaultSampleRate, _callback);
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Sets the default audio profil
 */

Settings.init.audio.audioProfil.setAudioProfil = function(list){
	var audioProfil = getHtmlStorage("audioProfil");
	Player.catalogue = list;

	var val = audioProfil && list.indexOf(audioProfil) !== -1 ? audioProfil : list[0];
	Settings.change.audioProfil(val);
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters of elevation level for the audio screen
 * @param {jQuery Object} $slider The slider element
 * @param {Integer} lvl The elevation level
 * @param {String} type The source (commentary || dialogues)
 */

Settings.init.audio.elevationLevel = function($slider, lvl, type){
	var range = Player.elevationRange, value;
	if(Main.simplifiedMode){
		
		lvl = parseInt(lvl, 10);
		value = lvl >= 45 ? 3 : lvl <= 0 ? 1 : 2;
		
		$slider.data("type", type);
		$slider.parent().siblings(".min-value").text(range[0]+"°").end()
			.siblings(".max-value").text(range[1]+"°");		
		$slider.children("a").attr("aria-valuemin", range[0]).attr("aria-valuemax", range[1]);
		
		$slider.slider({
			range: "min",
			min: 1,
			max: 3,
			value: value,

			slide: function(event, ui){
				Settings.change.audioElevationLevel(ui.value, this);
			}
		});
		
	}else{
		value = lvl;
		$slider.slider({
			range: "min",
			min: range[0],
			max: range[1],
			orientation:"vertical",
			value: value,

			slide: function(event, ui){
				Settings.change.audioElevationLevel(ui.value, this);
			}
		});
	}
	Settings.change.audioElevationLevel(value, $slider);
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters of the azim and distance for the audio screen
 * @param {jQuery Object} $drag The drag element
 */

Settings.init.audio.azimDistance = function($drag){
	if($($drag).length){

		var minDistance = Settings.minDistance;
		var canvas = {
			width: $drag.parent().width(),
			height: $drag.parent().height(),
			top: 0,
			left: 0
		};
		canvas.center = [canvas.left + canvas.width / 2, canvas.top + canvas.height / 2];
		canvas.radius = canvas.width / 2;

		var azim, dist, type = $drag.data("type");
		if(type === "commentary"){
			azim = getHtmlStorage("commentsAzim") || Player.commentsAzim;
			dist = getHtmlStorage("commentsDistance") || Player.commentsDistance;

		}else{
			azim = getHtmlStorage("dialoguesAzim") || Player.dialoguesAzim;
			dist = getHtmlStorage("dialoguesDistance") || Player.dialoguesDistance;
		}
		
		dist = getDistance(dist, Player.distanceRange, [minDistance, canvas.radius]);
		var acos = parseInt(azim, 10) * Math.PI / Player.azimRadius;
		var cosinus = Math.cos(acos);
		var sinus = Math.sin(acos);
		var top = -cosinus * dist + canvas.center[1];
		var left = sinus * dist + canvas.center[0];
		
		$drag.css({top:top,left:left}).draggable({
			scroll:false,
			drag: function(e, ui){
				Settings.onDragAzimDistance(ui, this, canvas);
			}
		});
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Triggered when the user change the position of the azim and distance
 * @param {Object} ui Object containing the position data
 * @param {HTML Element} item The slider
 * @param {Object} canvas Object containing the size and position of the slider parent
 */

Settings.onDragAzimDistance = function(ui, item, canvas){
	if(typeOf(ui) === "object" && typeOf(canvas) === "object"){
		
		var minDistance = Settings.minDistance,
			type = $(item).data("type");
		if(["commentary", "dialogues"].indexOf(type) !== -1){	

			var limit = function(x, y){
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
			};

			var result = limit(ui.position.left, ui.position.top);			
			ui.position.left = result.x;
			ui.position.top = result.y;

			// Récupère la distance
			var dist = distance([result.x, result.y], canvas.center);
			var dist2 = dist < minDistance ? minDistance : dist > canvas.radius ? canvas.radius : dist;
			var distanceMeter = getDistance(dist2, [minDistance, canvas.radius], Player.distanceRange);
			Settings.change.audioDistance(distanceMeter, item);
			//log("distance = " + dist2 + "px ("+distanceMeter+"m)");

			// Récupère l'angle
			var getAzim = function(sinus, angle){
				if(sinus <= 0){
					return  0 - angle;
				}else{
					return angle;
				}
			};

			var cosinus = -(ui.position.top - canvas.center[1]) / dist;
			var sinus = (ui.position.left - canvas.center[0]) / dist;

			var angle1 = Math.acos(cosinus) * Player.azimRadius / Math.PI;
			var azim = Math.round(getAzim(sinus, angle1));
			Settings.change.audioAzim(azim, item);
			//log("angle1 = " + angle1+"; sinus = " + sinus+"; azim = "+azim);

			log(type + " > distance = "+distanceMeter+"m; azim = " + azim + "°");				
		}
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters of the azim (for SM mode)
 * @param {jQuery Object} $slider The slider element
 * @param {Integer} value The value
 * @param {String} type The source (commentary || dialogues)
 */

Settings.init.audio.azim = function($slider, value, type){
	if(Main.simplifiedMode){

		value = parseInt(value, 10);
		var valueStep = value > 90 ? 5 : value > 0 ? 4 : value > -90 ? 3 : value > -180 ? 2 : 1;
		log("Orientation : "+value+"°. Crant "+valueStep);
		
		var range = [-180, 180];
		$slider.data("type", type);
		$slider.parent().siblings(".min-value").text(range[0]+"°").end()
			.siblings(".max-value").text(range[1]+"°");		
		$slider.children("a").attr("aria-valuemin", range[0]).attr("aria-valuemax", range[1]);
		
		$slider.slider({
			range: "min",
			min: 1,
			max: 5,
			value: valueStep,

			slide: function(event, ui){
				Settings.change.audioAzim(ui.value, this);
			}
		});
		
		Settings.change.audioAzim(valueStep, $slider);
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters of the distance (for SM mode)
 * @param {jQuery Object} $slider The slider element
 * @param {Integer} value The value
 * @param {String} type The source (commentary || dialogues)
 */

Settings.init.audio.distance = function($slider, value, type){
	if(Main.simplifiedMode){
		var range = Player.distanceRange;
		$slider.data("type", type).parent().siblings(".min-value").text(range[0]+"m").end()
			.siblings(".max-value").text(range[1]+"m");		
		$slider.children("a").attr("aria-valuemin", range[0]).attr("aria-valuemax", range[1]);
		
		$slider.slider({
			range: "min",
			min: range[0],
			max: range[1],
			value: value,
			step:0.5,

			slide: function(event, ui){
				Settings.change.audioDistance(ui.value, this);
			}
		});
		Settings.change.audioDistance(value, $slider);
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters of the font size for the interface screen
 */

Settings.init.interface.fontSize = function(){
	var range = Settings.fontSizeRange;
	var valueMinSize = getHtmlStorage("settings_min_size") || range[0];
	var $slider = $(document.getElementById(Main.simplifiedMode ? "fontSlide-sm" : "fontSlide"));
	
	$slider.children("a").attr("aria-valuemin", range[0]).attr("aria-valuemax", range[1]);
	$slider.slider({
		range: "min",
		min: range[0],
		max: range[1],
		value: valueMinSize,
		step:0.1,

		slide: function(event, ui){
			Settings.change.fontSize(ui.value, this);
		}
	});
	
	Settings.change.fontSize(valueMinSize, $slider);
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the screen of subtitles parameters
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
	var $opacitySlider = $(document.getElementById("opacitySlide")).slider({
		range: "min",
		min: 0,
		max: 1,
		value: valueMinOpacity,
		step:0.25,

		slide: function(event, ui){
			Settings.change.subtitlesOpacity(ui.value, this);
		}
		
	}).children("a").attr("aria-valuemin", 0).attr("aria-valuemax", 1);
	Settings.change.subtitlesOpacity(valueMinOpacity, $opacitySlider);
	
	/* TAILLE DES SOUS-TITRES */
	var valueMinSize = getHtmlStorage("subtitleFontSize") || Settings.minSubtitlesSize;
	var subRange = Settings.subtitlesSizeRange;
	var $subtitlesSizeSlider = $(document.getElementById("subtitlesFontSlide")).slider({
		range: "min",
		min: subRange[0],
		max: subRange[1],
		value: valueMinSize,
		step:0.1,

		slide: function(event, ui){
			Settings.change.subtitlesFontSize(ui.value, this);
		}
		
	}).children("a").attr("aria-valuemin", subRange[0]).attr("aria-valuemax", subRange[1]);	
	Settings.change.subtitlesFontSize(valueMinSize, $subtitlesSizeSlider);
	
	/* POSITION DES SOUS-TITRES */
	this.subtitles.pip();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters of the font family for the subtitles screen
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
 * @description Initializes the parameters of the color for the subtitles screen
 */

Settings.init.subtitles.color = function(){
	var selectedFontColor = getHtmlStorage("subtitleFontColor") || Settings.defaultSubtitlesColor;
	if(selectedFontColor){
		Settings.change.subtitlesColor(selectedFontColor);
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters of the background color for the subtitles screen
 */

Settings.init.subtitles.BGColor = function(){
	var selectedFontBGColor = getHtmlStorage("subtitleBGColor") || Settings.defaultSubtitlesBGColor;
	if(selectedFontBGColor){
		Settings.change.subtitlesBackgroundColor(selectedFontBGColor);
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters of the drag for the subtitles screen
 */

Settings.init.subtitles.pip = function(){
	
	var coordonates = Settings.getCurrentCoordonates("sub");
	var $container = $(document.getElementById(Main.simplifiedMode ? "uiSubtitles-sm-container" : "uiSubtitles-container")); 
	var $pipVideo = $container.find(".pip-video").css("top", coordonates.y+"%");
	$pipVideo.draggable({ 	
		containment: $container,
		scroll:false,
		axis: "y",
		handle:".ui-icon-gripsmall-center",
		stop: function() {
			Settings.saveSubtitlesPIPPosition($( this ).draggable( "option", "containment" ));
			
			Settings.updateARIAPropertiesForPIP($(this), "sub");
		}
	});
	
	requestAnimationFrame(function(){
		Settings.updateARIAPropertiesForPIP($pipVideo, "sub");
	});
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the screen of the LS parameters
 */

Settings.init.ls = function(){	
	var coordonates = Settings.getCurrentCoordonates("ls");
	
	var $container = $(document.getElementById(Main.simplifiedMode ? "uiLS-container-sm" : "uiLS-container")); 
	var $pipVideo = $container.find(".pip-video").attr("style",'left: '+coordonates.x+'%; top: '+coordonates.y+'%; width:'+coordonates.w+'%; height:'+ coordonates.h +'%');
	$pipVideo.draggable({
		containment: $container,
		scroll:false,
		handle:".ui-icon-gripsmall-center",
		stop: function() {
			Settings.saveLSPIPPosition($( this ).draggable( "option", "containment" ), $(this));
			
			Settings.updateARIAPropertiesForPIP($(this), "ls");
		}
	}).resizable( {
		containment: "parent",
		handles: 'all',
		minWidth: 100,
      	aspectRatio: true,
		stop: function() {
			log("Resize terminé !!!");
			var $parent = $( this ).draggable( "option", "containment" );
			Settings.saveLSPIPSize($parent, $(this));
			Settings.saveLSPIPPosition($parent, $(this));
			
			Settings.updateARIAPropertiesForPIP($(this), "ls");
		}
	});
	
	$container.find('.ui-resizable-nw').attr({role:"slider","aria-valuemin":0,"aria-valuemax":"100","aria-label":"Redimensionnez vers le haut et la gauche","aria-valuenow":0}).addClass('ui-icon ui-icon-gripsmall-diagonal-nw').end()
		.find('.ui-resizable-ne').attr({role:"slider","aria-valuemin":0,"aria-valuemax":"100","aria-label":"Redimensionnez vers le haut et la droite","aria-valuenow":0}).addClass('ui-icon ui-icon-gripsmall-diagonal-ne').end()
		.find('.ui-resizable-sw').attr({role:"slider","aria-valuemin":0,"aria-valuemax":"100","aria-label":"Redimensionnez vers le bas et la gauche","aria-valuenow":0}).addClass('ui-icon ui-icon-gripsmall-diagonal-sw').end()
		.find('.ui-resizable-se').attr({role:"slider","aria-valuemin":0,"aria-valuemax":"100","aria-label":"Redimensionnez vers le bas et la droite","aria-valuenow":0}).addClass('ui-icon ui-icon-gripsmall-diagonal-se').end()
	
		.find('.ui-resizable-n').attr({role:"slider","aria-valuemin":0,"aria-valuemax":"100","aria-label":"Redimensionnez vers le haut"}).end()
		.find('.ui-resizable-e').attr({role:"slider","aria-valuemin":0,"aria-valuemax":"100","aria-label":"Redimensionnez vers la droite"}).end()
		.find('.ui-resizable-s').attr({role:"slider","aria-valuemin":0,"aria-valuemax":"100","aria-label":"Redimensionnez vers le bas"}).end()
		.find('.ui-resizable-w').attr({role:"slider","aria-valuemin":0,"aria-valuemax":"100","aria-label":"Redimensionnez vers la gauche"});
	
	Settings.updateARIAPropertiesForPIP($pipVideo, "ls");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Gets the coordonates of a PIP
 * @param {String} PIPType The PIP type (ls/sub)
 * @return {Object} The PIP coordonates
 */

Settings.getCurrentCoordonates = function(PIPType){
	var pipTopPercent;
	if(PIPType === "ls"){
		var defaultCoordonates = this.defaultLSPIPCoordonates;
		var pipLeftPercent = (getHtmlStorage("LSFPip_position_x") && !isNaN(getHtmlStorage("LSFPip_position_x"))) ? getHtmlStorage("LSFPip_position_x") : defaultCoordonates.x;
		pipTopPercent = (getHtmlStorage("LSFPip_position_y") && !isNaN(getHtmlStorage("LSFPip_position_y"))) ? getHtmlStorage("LSFPip_position_y") : defaultCoordonates.y;
		var pipWidthReal = getHtmlStorage("LSFPip_size_width") || defaultCoordonates.w;
		var pipHeightReal = getHtmlStorage("LSFPip_size_height") || defaultCoordonates.h;	
		
		return {x: pipLeftPercent, y: pipTopPercent, w: pipWidthReal, h: pipHeightReal};
		
	}else if(PIPType === "sub"){
		pipTopPercent = (getHtmlStorage("subtitlePositionY") && !isNaN(getHtmlStorage("subtitlePositionY"))) ? getHtmlStorage("subtitlePositionY") : Settings.subtitlesDefaultPosition;
		return {y: pipTopPercent};
		
	}else{
		return {};
	}
};

																	/* ******************************************/
																	/*	 FONCTIONS POUR LA MAJ DES PARAMETRES	*/
																	/* ******************************************/
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Changes the app font size
 * @param {Integer} newValue The new font size
 * @param {jQuery Object} el The slider element (for SM mode)
 */

Settings.change.fontSize = function(newValue, el){	
	setHtmlStorage("settings_min_size", newValue);
	$("main > div").css("font-size", (newValue / 16) + "em");
	
	if(Main.simplifiedMode){
		$(el).children("a").attr("aria-valuenow", newValue).attr("aria-valuetext", newValue + " pixel");
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Changes the subtitle font family
 * @param {String} ff The new font family
 */

Settings.change.subtitlesFontFamily = function(ff){
	setHtmlStorage("subtitleFont", ff);
	$(".ui-subtitles .pip-text").removeClass("Arial OpenDyslexic Andika Helvetica Verdana").addClass(ff);
	
	if(Main.simplifiedMode){
		$(document.getElementById("font-family")).children(".menu-item."+ff).attr("aria-checked", true).addClass("selected").siblings().attr("aria-checked", false).removeClass("selected");		
	}else{
		$(".option-font-family .font-family."+ff).addClass("selected").siblings().removeClass("selected");
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Changes the subtitle background color
 * @param {String} color The new color
 */

Settings.change.subtitlesBackgroundColor = function(color){
	setHtmlStorage("subtitleBGColor", color);
	$(".option-background-color .color[data-color='"+color+"']").addClass("selected").siblings().removeClass("selected");
	$(".ui-subtitles .pip-text").removeClass("blackBGColor whiteBGColor").addClass(color+"BGColor");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Changes the subtitle color
 * @param {String} color The new color
 */

Settings.change.subtitlesColor = function(color){
	setHtmlStorage("subtitleFontColor", color);
	$(".option-text-color .color[data-color='"+color+"']").addClass("selected").siblings().removeClass("selected");
	$(".ui-subtitles .pip-text").removeClass("transparentColor whiteColor yellowColor blueColor").addClass(color+"Color");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Changes the subtitle opacity
 * @param {Integer} newValue The new opacity
 * @param {jQuery Object} el The slider element
 */

Settings.change.subtitlesOpacity = function(newValue, el){
	setHtmlStorage("subtitleBackgroundOpacity", newValue);
	$(".ui-subtitles .pip-text").removeClass("opacity_0 opacity_025 opacity_05 opacity_075 opacity_1").addClass("opacity_"+newValue.toString().replace(".",""));
	$(el).children("a").attr("aria-valuenow", newValue).attr("aria-valuetext", newValue);
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Changes the subtitle font size
 * @param {Integer} newValue The new font size
 * @param {jQuery Object} el The slider element
 */

Settings.change.subtitlesFontSize = function(newValue, el){
	setHtmlStorage("subtitleFontSize", newValue);
	$(".ui-subtitles .pip-text").css("font-size", newValue+"px");
	$(el).children("a").attr("aria-valuenow", newValue).attr("aria-valuetext", newValue + " pixel");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Changes the audio spatialisation mode
 * @param {String} value The new mode
 */

Settings.change.audioSpatialisationMode = function(value){
	
	var setMode = function(val){
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
	};
	
	if(Main.simplifiedMode){
		$(document.getElementById("spatialisation-options-sm")).children(".menu-item").filter(function(){
			return $(this).data("value") === value;
		}).addClass("selected").attr("aria-checked", true).siblings().removeClass("selected").attr("aria-checked", false);
		setMode(value);
		
	}else{
		$(document.getElementById("spatialisation-options")).val(value);
		setMode(value);
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Changes the audio profil
 * @param {String} value The new mode
 */

Settings.change.audioProfil = function(value){
	
	var setMode = function(val){
		Player.profilLoaded =  false;
		Player.selectedProfil = val;
		setHtmlStorage("audioProfil", val);
	};
	
	if(Main.simplifiedMode){
		/*$(document.getElementById("spatialisation-options-sm")).children(".menu-item").filter(function(){
			return $(this).data("value") === value;
		}).addClass("selected").attr("aria-checked", true).siblings().removeClass("selected").attr("aria-checked", false);
		setMode(value);*/
		
	}else{
		$(document.getElementById("audio-profils-options")).val(value);
		setMode(value);
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Changes the audio elevation level
 * @param {Integer} value The new mode
 * @param {jQuery Object} el The slider element
 */

Settings.change.audioElevationLevel = function(value, el){

	var type = $(el).data("type");
	if(["commentary", "dialogues"].indexOf(type) !== -1){
		
		// Converti les steps en leur valeur correspondante
		if(Main.simplifiedMode){
			var range = Player.elevationRange;
			value = value === 2 ? parseInt((range[1] - Math.abs(range[0])) / 2, 10) : value === 1 ? range[0] : range[1];	
		}
		
		if(type === "commentary"){
			Player.commentsElevationLevel = value;
			setHtmlStorage("commentsElevationLevel", value);
			log("Niveau d'élévation des commentaires : " + value + "°");

		}else{
			Player.dialoguesElevationLevel = value;
			setHtmlStorage("dialoguesElevationLevel", value);
			log("Niveau d'élévation des dialogues : " + value + "°");			
		}
		
		var $slider = $(el).children("a");
		if($slider.length){
			
			var valueText = function(){
				if(value >= 45) {
					return "Haut";

				}else if (value <= 0) {
					return "Bas";

				}else{
					return "Tête";
				}
			}();

			if(Main.simplifiedMode){
				$slider.attr("aria-valuenow", value).attr("aria-valuetext", valueText/*value + "°"*/);

			}else{
				$slider.text(valueText);
			}
		}
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Changes the audio azim
 * @param {Integer} value The new azim
 * @param {jQuery Object} el The slider element
 */

Settings.change.audioAzim = function(value, el){
	
	var type = $(el).data("type");
	if(["commentary", "dialogues"].indexOf(type) !== -1){
		
		// Converti les steps en leur valeur correspondante
		if(Main.simplifiedMode){
			value = value === 5 ? 180 : value === 4 ? 90 : value === 3 ? 0 : value === 2 ? -90 : -180;
		}
		
		if(type === "commentary"){
			Player.commentsAzim = value;
			setHtmlStorage("commentsAzim", value);
			log("Orientation des commentaires : " + value + "°");

		}else{
			Player.dialoguesAzim = value;
			setHtmlStorage("dialoguesAzim", value);
			log("Orientation des dialogues : " + value + "°");
		}
		
		if(Main.simplifiedMode){
			$(el).children("a").attr("aria-valuenow", value).attr("aria-valuetext", value + "°");
		}		
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Changes the audio distance
 * @param {Integer} value The new distance
 * @param {jQuery Object} el The slider element
 */

Settings.change.audioDistance = function(value, el){
	
	var type = $(el).data("type");
	if(type === "commentary"){
		Player.commentsDistance = value;
		setHtmlStorage("commentsDistance", value);

	}else{
		Player.dialoguesDistance = value;
		setHtmlStorage("dialoguesDistance", value);				
	}
		
	if(Main.simplifiedMode){
		$(el).children("a").attr("aria-valuenow", value).attr("aria-valuetext", value + " mètre");
	}		
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Changes the subtitles position
 * @param {jQuery Object} $container The drag element
 */

Settings.saveSubtitlesPIPPosition = function($container){
	if($($container).length){
		var newTopPercent = ($container.children(".pip-video").position().top / $container.height()) * 100;
		newTopPercent -= Math.round(2 * $container.height() / 100 * 2);
		log("Pourcentage sans les marges : "+newTopPercent);

		setHtmlStorage("subtitlePositionY", newTopPercent<0?0:newTopPercent);
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Changes the LS position
 * @param {jQuery Object} $container The drag element container
 * @param {jQuery Object} $pip The drag element
 */

Settings.saveLSPIPPosition = function($container, $pip){
	if($($container).length && $($pip).length){
	
		var newLeftPercent = ($pip.position().left / $container.width()) * 100;
		var newTopPercent = ($pip.position().top / $container.height()) * 100;

		//log("Pourcentage sans les marges = left:"+ newLeftPercent+ ", top:" + newTopPercent);

		setHtmlStorage("LSFPip_position_x", newLeftPercent<0?0:newLeftPercent);
		setHtmlStorage("LSFPip_position_y", newTopPercent<0?0:newTopPercent);
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Changes the LS size
 * @param {jQuery Object} $container The resizable element container
 * @param {jQuery Object} $pip The resizable element
 */

Settings.saveLSPIPSize = function($container, $pip){
	if($($container).length && $($pip).length){
		
		var pipWidth = $pip.width();
		var pipHeight = $pip.height();
		var containerWidth = $container.width();
		var containerHeight = $container.height();

		var newWidthPercent = (pipWidth/containerWidth)*100;
		var newHeightPercent = (pipHeight/containerHeight)*100;

		//log("saveLSFSize :"+newWidthPercent+"x"+newHeightPercent+" dans un container de "+containerWidth+"x"+containerHeight);
		setHtmlStorage("LSFPip_size_width", newWidthPercent);
		setHtmlStorage("LSFPip_size_height", newHeightPercent);
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Updates a PIP object aria properties
 * @param {jQuery Object} $pip The resizable element
 * @param {String} PIPType The PIP type (ls/sub)
 */

Settings.updateARIAPropertiesForPIP = function($pip, PIPType){
	var bottomPercent;
	if(PIPType === "ls"){
		var coordonates = Settings.getCurrentCoordonates("ls");
		var leftPercent = Math.round(coordonates.x),
			rightPercent = 100 - Math.round(($pip[0].offsetLeft + $pip.width()) / $pip.parent().width() * 100),
			topPercent = Math.round(coordonates.y);
		bottomPercent = 100 - Math.round(($pip[0].offsetTop + $pip.height()) / $pip.parent().height() * 100);

		$pip.attr({"aria-valuetext":topPercent + "% depuis le haut et " + leftPercent + "% depuis la gauche"});

		$pip.find('.ui-resizable-nw').attr({"aria-valuetext":topPercent + "% depuis le haut et " + leftPercent + "% depuis la gauche"}).end()
			.find('.ui-resizable-ne').attr({"aria-valuetext":topPercent + "% depuis le haut et " + rightPercent + "% depuis la droite"}).end()
			.find('.ui-resizable-sw').attr({"aria-valuetext":bottomPercent + "% depuis le bas et " + leftPercent + "% depuis la gauche"}).end()
			.find('.ui-resizable-se').attr({"aria-valuetext":bottomPercent + "% depuis le bas et " + rightPercent + "% depuis la droite"}).end()

			.find('.ui-resizable-n').attr({"aria-valuenow":topPercent,"aria-valuetext":topPercent + "% depuis le haut"}).end()
			.find('.ui-resizable-e').attr({"aria-valuenow":rightPercent,"aria-valuetext":rightPercent + "% depuis la droite"}).end()
			.find('.ui-resizable-s').attr({"aria-valuenow":bottomPercent,"aria-valuetext":bottomPercent + "% depuis le bas"}).end()
			.find('.ui-resizable-w').attr({"aria-valuenow":leftPercent,"aria-valuetext":leftPercent + "% depuis la gauche"});
		
	}else if(PIPType === "sub"){
		var $parent = $pip.parent();
		var padding = parseFloat($parent.css("padding").replace("px",""));
		var parentHeight = $parent.height();
		var hPercent = ($pip.height() / parentHeight) * 100;
		var distanceToTop = (($pip[0].offsetTop - padding) / parentHeight * 100);
		bottomPercent = Math.round(100 - distanceToTop - hPercent);
		
		//log("Je suis à " + distanceToTop + " du haut et à " + bottomPercent + " du bas");
		$pip.attr({"aria-valuetext":(bottomPercent<0?0:bottomPercent) + "% depuis le bas"});
	}
};