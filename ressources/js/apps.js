var Apps = {
	list:[],
	programs:{
		appIndex:null,
		list:{}
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
	var list = this.list, i, l = list.length, app;
	for(i=0;i<l;i++){
		app = list[i];
		if(Main.simplifiedMode){
			html += '<li class="app menu-item"><a title="'+app.title+'">'+app.title+'</a></li>';
		}else{
			html += '<li tabindex="'+(i+2)+'" class="app icon btn"><a title="'+app.title+'"><img src="'+app.picture+'" alt="Icône de l\'application '+app.title+'"></a></li>';
		}
	}
	
	$(document.getElementById(Main.simplifiedMode ? "apps-list-sm" : "apps-list")).html(html);
};

Apps.programs.reset = function(){
	this.list = {};
	this.appIndex = null;
	$(document.getElementById("favorites-container")).children(".playlist-list").empty();
};

Apps.programs.load = function(appIndex, onSuccess){
	this.reset();
	var app = Apps.list[appIndex];
	if(typeOf(app) === "object" && app.userProgramsListUrl){
		API.getAppPlaylistsOfUser(app.userProgramsListUrl, appIndex, function(data, jqXHR){
			Apps.programs.load.callback(data, jqXHR, onSuccess, appIndex);
		});
	}
};

Apps.programs.load.callback = function(data, jqXHR, onSuccess, appIndex){
	if(typeOf(data) === "object" && !isEmpty(data)){
		
		if(!json.cache["programs"]){
			json.cache["programs"] = data;
			json.cache["programs"].appIndex = appIndex;
		}
		
		Apps.programs.appIndex = appIndex;
		Apps.programs.list = data;
		
		Apps.programs.generates();
		
		if(typeOf(onSuccess) === "function"){
			onSuccess();
		}
	}
};

Apps.programs.generates = function(){
	
	/* FAVORITES */
	var $item, $container = $(document.getElementById("favorites-list"));
	var tabindex = 6;
	var list = this.list.favorites, i, l = list.length, program;
	for(i=0;i<l;i++){
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