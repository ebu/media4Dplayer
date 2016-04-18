var Apps = {
	list:[],
	programs:{
		appIndex:null,
		list:{},
		
		limitByPage:5,
		limitByPageSM:8,
		start:0,
		playlistType:null
	}
};

Apps.reset = function(){
	this.list = [];
	$(document.getElementById(Main.simplifiedMode ? "apps-list-sm" : "apps-list")).empty();
};

Apps.load = function(onSuccess){
	// TODO : afficher un loader
	this.reset();
	API.getAppsList("ressources/json/apps.json", function(list, jqXHR){
		Apps.load.callback(list, jqXHR, onSuccess);
	});
};

Apps.load.callback = function(list, jqXHR, onSuccess){
	if(typeOf(list) === "array"){
		
		if(!json.cache["apps"]){
			json.cache["apps"] = list;
		}
		
		Apps.list = list;
		Apps.generates();
		
		if(typeOf(onSuccess) === "function"){
			onSuccess();
		}
	}
};

Apps.generates = function(){
	
	var html = "";
	var list = this.list, i, l = list.length, app, isDisabled, hiddenClass, classList, start = Main.simplifiedMode ? 3 : 2;
	for(i=0;i<l;i++){
		app = list[i];
		if(Main.simplifiedMode){
			isDisabled = app.disabled;
			hiddenClass = isDisabled ? " disabled" : "";
			classList = !isDisabled ? "selectable-by-chromevox" : "";
			html += '<li class="app menu-item'+hiddenClass+'"><a tabindex="'+(i+start)+'" title="'+app.title+'" class="'+classList+'">'+app.title+'</a></li>';
		}else{
			html += '<li tabindex="'+(i+start)+'" class="app icon btn selectable-by-chromevox"><a title="'+app.title+'"><img src="'+app.picture+'" alt="Icône de l\'application '+app.title+'"></a></li>';
		}
	}
	
	$(document.getElementById(Main.simplifiedMode ? "apps-list-sm" : "apps-list")).html(html);
};

Apps.programs.reset = function(){
	this.list = {};
	this.appIndex = null;
	this.playlistType = null;
	
	if(Main.simplifiedMode){
		this.start = 0;
		$(document.getElementById("playlist")).empty();
		$(document.getElementById("previous-page-playlist")).hide();
		$(document.getElementById("next-page-playlist")).hide();
		$(document.getElementById("playlist-title")).empty();
	}else{
		$(document.getElementById("favorites-container")).children(".playlist-list").empty();
	}	
};

Apps.programs.load = function(appIndex, callbackList, rubric){
	this.reset();
	var app = Apps.list[appIndex];
	if(typeOf(app) === "object" && app.userProgramsListUrl){
		API.getAppPlaylistsOfUser(app.userProgramsListUrl, appIndex, function(data, jqXHR){
			Apps.programs.load.callback(data, jqXHR, callbackList, appIndex, rubric);
		});
	
	// TEMPORAIRE : affichera "page en construction" pour les app qui n'ont pas de programmes
	}else if(typeOf(callbackList) === "object" && typeOf(callbackList.onError) === "function"){
		callbackList.onError();
	}
};

Apps.programs.load.callback = function(data, jqXHR, callbackList, appIndex, rubric){
	if(typeOf(data) === "object" && !isEmpty(data)){
		
		if(!json.cache["programs"]){
			json.cache["programs"] = data;
			json.cache["programs"].appIndex = appIndex;
		}
		
		Apps.programs.appIndex = appIndex;
		Apps.programs.list = data;
		Apps.programs.playlistType = rubric;
		
		if(Main.simplifiedMode){
			
			var rubrics = Section.rubrics[Section.sections[10]];
			var list = data[rubric === rubrics[0] ? "favorites" : rubric === rubrics[1] ? "signets" : "history"];
			if(typeOf(list) === "array" && list.length){	
			
				$(document.getElementById("playlist-title")).html('<span tabindex="1" class="selectable-by-chromevox">'+(rubric === rubrics[0] ? "Mes vidéos " + Apps.list[appIndex].title : rubric === rubrics[1] ? "Mes signets" : "Mon historique")+'</span>');

				Apps.programs.generatesForSM(rubric);					
			}else{
				// TODO : afficher une message d'erreur
				return;
			}
		}else{
			Apps.programs.generates();
		}
		
		if(typeOf(callbackList) === "object" && typeOf(callbackList.onSuccess) === "function"){
			callbackList.onSuccess();
		}
	}
};

Apps.programs.generates = function(){
	
	/* FAVORITES */
	var $item, $container = $(document.getElementById("favorites-list"));
	var tabindex = 6;
	var limit = this.limitByPage;
	var list = this.list.favorites, i, l = list.length, program;
	for(i=0;i<l&&i<limit;i++){
		program = list[i];
		$item = $('<div tabindex="'+tabindex+'" class="item-playlist btn">'+
							'<div tabindex="'+(tabindex+1)+'" class="delete">'+
								'<div class="delete-icon">'+
									'<svg version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 43" style="enable-background:new 0 0 50 43;" xml:space="preserve"><g><polygon class="st0" style="fill:#FFDE00;stroke:#FFFFFF;stroke-width:0.25;stroke-miterlimit:10;" points="25.3,0 32.3,14.1 47.9,16.4 36.6,27.4 39.3,43 25.3,35.6 11.4,43 14,27.4 2.8,16.4 18.4,14.1"/></g></svg>			'+							
								'</div>	'+								
							'</div>'+
							'<img alt="Vignette de '+program.title+'" src="'+program.thumbnail+'" class="thumb">'+
							'<div class="item-infos">'+
								'<div class="title">'+program.title+'</div>'+
								'<div class="subtitle">'+program.subtitle+'</div>'+
								'<div class="infos">'+program.detail+'</div>	'+								
							'</div>'+
							'<div tabindex="'+(tabindex+2)+'" class="play">'+
								'<img src="ressources/img/fav_play_icone.png" alt="Lecture de la vidéo">'+
							'</div>'+
						'</div>').appendTo($container);
					
		$item.data("data", program);
		tabindex+=3;
	}
};

Apps.programs.generatesForSM = function(rubric){
	
	var $item, $container = $(document.getElementById("playlist"));
	var tabindex = 5;
	var limit = this.limitByPageSM;
	var rubrics = Section.rubrics[Section.sections[10]];
	var list = this.list[rubric === rubrics[0] ? "favorites" : rubric === rubrics[1] ? "signets" : "history"], i, l = list.length, program;
	for(i=this.start;i<l&&i<limit;i++){
		program = list[i];
		$item = $('<li tabindex="'+tabindex+'" class="item btn selectable-by-chromevox"><div class="title">'+program.title+'</div><div class="subtitle">'+program.subtitle+'</div><div class="type">'+program.detail+'</div></li>').appendTo($container);
					
		$item.data("data", program);
		tabindex++;
	}
};