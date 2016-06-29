var Search = {
	term:"",
	minLength:3,
	initialMessage:"Un large choix de vidéo vous attend...",
	method:"content",
	methods:["term","content"],
	autocomplete:{
		limit:5
	},
	termsOfAffination:{
		limit:6,
		terms:[],
		groupID:null,
		groupList:null
	},
	filters:{
		currentOptionDropDownMenu:null,
		isOptionDropDownMenuDisplayed:false,
		list:{
			audio:[],
			subtitle:[],
			ad:[],
			ls:[]
		},
		currentFilter:{
			audio:{index:0,name:"Tout"},
			subtitle:{index:0,name:"Tout"},
			ad:{index:0,name:"Tout"},
			ls:{index:0,name:"Tout"},
		}
	},
	results:{
		list:[]
	}
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.reset = function(rubric){
	if(rubric === Section.rubrics[Section.sections[30]][0]){
		$(document.getElementById("terms-search")).val("");
		$(document.getElementById("search-message")).show().siblings().hide();
		$(document.getElementById("terms-search-container")).removeAttr("class");
		$(document.getElementById("search-message")).show().children("span").text(this.initialMessage);
		this.autocomplete.reset();
		
		Search.term = "";
		Search.termsOfAffination.groupID = null;
		Search.termsOfAffination.groupList = null;
		this.method = this.getMethod();
		
	}else{
		this.results.reset();
		this.results.list = [];

		$(document.getElementById("filters-container")).find(".filter-value").each(function(){
			$(this).text("Tout");
		});
		
		this.filters.currentFilter = {
			audio:{index:0,name:"Tout"},
			subtitle:{index:0,name:"Tout"},
			ad:{index:0,name:"Tout"},
			ls:{index:0,name:"Tout"},
		};
		
		this.filters.hide();		
	}
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.getMethod = function(){
	return $(document.getElementById("methods-container")).find("input:checked").val();
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.changeMethod = function(){
	Search.reset(Section.rubrics[Section.sections[30]][0]);
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.autocomplete.init = function(value){
	
	if(value && value.length >= Search.minLength){
		Search.term = value;
		Search.autocomplete.load(value);
	}else{
		Search.term = "";
		Search.autocomplete.reset();
	}
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.autocomplete.reset = function(){
	$(document.getElementById("autocomplete")).fadeOut(200, function(){
		$(this).empty();
	});
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.autocomplete.load = function(){
	API.autocomplete(Search.term, Search.method, function(list){
		Search.autocomplete.showList(list);
	});
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.autocomplete.showList = function(list){	
	if(typeOf(list) === "array" && list.length){
		var $ctn = $(document.getElementById("autocomplete"));

		var i, l = list.length, html = "", word, term = Search.term;
		for(i=0; i<l&&i<this.limit;i++){
			word = list[i].replace(term, '<span>'+term+'</span>');
			html += '<div class="term oneline">'+word+'</div>';
		}
		$ctn.html(html).clearQueue().stop().fadeIn(200);
		
	}else{
		this.reset();
	}
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.autocomplete.selectTerm = function(term){
	Search.term = term;
	$(document.getElementById("terms-search")).val(term);
	this.reset();
	
	Search.autocomplete.getTermsOfAffination();
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.autocomplete.getTermsOfAffination = function(){
	if(Search.term.length >= Search.minLength){
		Search.autocomplete.reset();
		Search.termsOfAffination.load();
	}
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.termsOfAffination.reset = function(){
	$(document.getElementById("terms-search-container")).addClass("terms-of-affination-list");
	$(document.getElementById("terms-of-affination")).children(".col").empty();
	$(document.getElementById("display-results-button")).removeClass("on");
	this.terms = [];
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.termsOfAffination.showLoader = function(){
	$(document.getElementById("search-message")).children("span").text("Veuillez patienter...");
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.termsOfAffination.hideLoader = function(){
	$(document.getElementById("search-message")).hide();
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.termsOfAffination.load = function(){
	
	this.reset();
	this.showLoader();
	
	API.getTermsOfAffination(Search.term, Search.method, function(list){
		Search.termsOfAffination.init(list);
	});	
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.termsOfAffination.init = function(list){
	console.log(list);
	
	var isGroupList = typeOf(list) === "object" && !isEmpty(list);
	if(isGroupList || (typeOf(list) === "array" && list.length)){
		this.groupList = isGroupList ? list : null;
		this.hideLoader();
		this.showList(list);
		
	}else{
		$(document.getElementById("search-message")).children("span").text("Aucun résultat trouvé pour " + Search.term);
	}
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.termsOfAffination.showList = function(list){
	var $ctn = $(document.getElementById("terms-of-affination"));
	var $topCol = $ctn.children(".top"), $bottomCol = $ctn.children(".bottom");
	
	var insered = 0;
	
	if(Search.method === Search.methods[1] && !this.groupID && typeOf(list) === "object" && !isEmpty(list)){
		
		var words, $group;
		for(var groupID in list){

			if(insered<this.limit){

				words = list[groupID];
				if(typeOf(words) === "array" && words.length){

					$group = $('<div class="block group"></div>').data({groupID: groupID, list:words});

					if(insered<3){
						$topCol.append($group);
					}else{
						$bottomCol.append($group);
					}
					insered++;
					
					$group.jQCloud(words);
				}
			}
		}
		
	}else if(typeOf(list) === "array" && list.length){
		
		var i, l = list.length, data, score, $term, scoreFirst = list[0].weight;
		var toTop = [0, 3, 4];
		for(i=0;i<l&&i<this.limit;i++){

			data = list[i];
			if(typeOf(data) === "object"){

				score = (data.weight*100/scoreFirst);
				$term = $('<div class="block term-of-affination" style="zoom:'+Math.round(score)+'%;background-color: rgba(0,0,0,'+roundDecimal(score/100, 1)+')"><span style="zoom:'+Math.round((100-score)*2+100)+'%;">'+data.text+'</span></div>');

				if(toTop.indexOf(insered) !== -1){

					// Le 3ème devra être insérer en 1er
					if(insered === 4){
						$topCol.prepend($term);
					}else{
						$topCol.append($term);
					}

				}else{

					// Le 5ème devra être insérer en 1er
					if(insered === 5){
						$bottomCol.prepend($term);
					}else{
						$bottomCol.append($term);
					}
				}
				insered++;
			}
		}		
	}
	
	$ctn.show();
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.results.reset = function(){
	$(document.getElementById("full-results-list-container")).empty();
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.results.showLoader = function(){
	$(document.getElementById("full-results-message")).children("span").text("Veuillez patienter...");
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.results.hideLoader = function(){
	$(document.getElementById("full-results-message")).hide();
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.results.load = function(){
	
	this.reset();
	this.showLoader();
	
	API.getResults(Search.term+"|"+Search.termsOfAffination.terms.toString().replace(/,/g, "|"), Search.method, function(list){
		Search.results.init(list);
	});
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.results.init = function(list){
	console.log(list);
	this.list = list;
	if(typeOf(list) === "array" && list.length){
		
		this.hideLoader();
		this.showList(list);
		
	}else{
		$(document.getElementById("full-results-message")).show().children("span").text("Aucun résultat trouvé pour " + Search.term);
	}
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.results.showList = function(list){
	var $ctn = $(document.getElementById("full-results-list-container"));

	var handleCompatibilities = function(list){
		return typeOf(list) === "array" && list.length ? ' style="display:block;"' : '';
	};
	var i, l = list.length, media, $media, mediaInsered = 0, 
		filterAudioActive = ["tout","aucun"].indexOf(Search.filters.currentFilter.audio.name.toLowerCase()) === -1,
		filterSubtitleActive = ["tout","aucun"].indexOf(Search.filters.currentFilter.subtitle.name.toLowerCase()) === -1,
		filterADActive = ["tout","aucun"].indexOf(Search.filters.currentFilter.ad.name.toLowerCase()) === -1,
		filterLSActive = ["tout","aucun"].indexOf(Search.filters.currentFilter.ls.name.toLowerCase()) === -1
	for(i=0; i<l;i++){
		media = list[i];
		
		// Si j'ai choisi une langue mais que c'est pas la langue choisi
		if(filterAudioActive && (typeOf(media.video.audiosList) !== "array" || media.video.audiosList.indexOf(Search.filters.currentFilter.audio.name) === -1)){
			continue;
		}
		
		// Si j'ai choisi une langue de ST mais que c'est pas la langue choisi
		if(filterSubtitleActive && (typeOf(media.video.subtitlesList) !== "array" || media.video.subtitlesList.indexOf(Search.filters.currentFilter.subtitle.name) === -1)){
			continue;
		}
		
		// Si j'ai choisi une langue d'AD mais que c'est pas la langue choisi
		if(filterADActive && (typeOf(media.video.audioDescriptions) !== "array" || media.video.audioDescriptions.indexOf(Search.filters.currentFilter.ad.name) === -1)){
			continue;
		}
		
		// Si j'ai choisi une langue pour la LS mais que c'est pas la langue choisi
		if(filterLSActive && (typeOf(media.video.ls) !== "array" || media.video.ls.indexOf(Search.filters.currentFilter.ls.name) === -1)){
			continue;
		}
		
		// Si j'ai choisi aucun comme langue
		if((Search.filters.currentFilter.audio.name.toLowerCase() === "aucun" && media.video.audiosList) || 
			(Search.filters.currentFilter.subtitle.name.toLowerCase() === "aucun" && media.video.subtitlesList) || 
			(Search.filters.currentFilter.ad.name.toLowerCase() === "aucun" && media.video.audioDescriptions) || 
			(Search.filters.currentFilter.ls.name.toLowerCase() === "aucun" && media.video.ls)){
			continue;
		}
		
		$media = $('<div class="search-result btn"><img alt="Vignette de '+media.title+'" src="'+media.thumbnail+'" class="thumb"/><div class="item-infos"><div class="title">'+media.title+'</div><div class="subtitle">'+pad(media.detail.date.d)+'/'+pad(media.detail.date.m)+'/'+pad(media.detail.date.y)+' / '+media.subtitle+'</div><div class="compatibilities-list"><div class="compatibility audio" title="Contient des pistes audios" '+handleCompatibilities(media.video.audiosList)+'></div><div class="compatibility subtitle" title="Contient des sous-titres" '+handleCompatibilities(media.video.subtitlesList)+'></div><div class="compatibility ad" title="Contient des commentaires" '+handleCompatibilities(media.video.audioDescriptions)+'></div><div class="compatibility ls" title="Contient des videos pour le language des signes" '+handleCompatibilities(media.video.ls)+'></div></div><div class="synopsis">'+media.synopsis+'</div></div></div>').data("data", media);
		
		$ctn.append($media);
		mediaInsered++;
	}
	
	// Si à cause du filtre il n'y a pas d'item à afficher
	if(!mediaInsered){
		$(document.getElementById("full-results-message")).show().children("span").text("Aucun résultat à afficher");
	}
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.results.reloadAfterFiltring = function(){
	this.reset();
	this.hideLoader();
	this.showList(this.list);
};
	
/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Initializes the parameters screen
 * @param {String} section The section name
 * @param {String} rubric The rubric name
 */

Search.filters.show = function(type, button){
	if(type && $(button).length){
		
		var $ctn = $(document.getElementById("filter-values-list"));
		
		if(this.isOptionDropDownMenuDisplayed && type === this.currentOptionDropDownMenu) {
			this.hide();
			return;
		}
		this.currentOptionDropDownMenu = type;
		
		$ctn.empty();
		
		var inputsArray = this.getOptionsArrayForOption(type);
		$ctn.css("left", this.getOptionsDropDownMenuLeft(button))
			.css("height", this.getOptionsDropDownMenuHeight(inputsArray));
		
		var _onclick = function(){
			Search.filters.onClick(this, type);
		};
		
		var tabIndex = button.tabIndex + 1;
		var i, l = inputsArray.length, $bt;
		for (i = 0; i < l; i++) {
			$bt = $('<div id="option_'+i+'" class="optionDropDownMenuButton btn">'+inputsArray[i]+'</div>')
				.appendTo($ctn)
				.data("index", i)
				.on("click", _onclick);
			
			if(type === "subtitle" && inputsArray[i] !== "Aucun"){
				$bt.append('<img src="ressources/img/sourd.png" height="100%" style="vertical-align:top;margin-left:10px;"/>');
			}
			tabIndex++;
		}
		
		this.select(type, $ctn);
		
		if(!this.isOptionDropDownMenuDisplayed) {
			$ctn.fadeIn(200);
			this.isOptionDropDownMenuDisplayed = true;
		}
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

Search.filters.hide = function(){
	$(document.getElementById("filter-values-list")).fadeOut(200);
	this.isOptionDropDownMenuDisplayed = false;		
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

Search.filters.setList = function(list, type){
	this.list[type] = list;
	list.unshift("Tout");
	list.push("Aucun");
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

Search.filters.getOptionsArrayForOption = function(optionID) {
	switch(optionID) {
		case "ls":
			return JSON.parse(JSON.stringify(this.list.ls));

		case "ad":
			return JSON.parse(JSON.stringify(this.list.ad));

		case "subtitle":
			return JSON.parse(JSON.stringify(this.list.subtitle));

		case "audio":
			return JSON.parse(JSON.stringify(this.list.audio));
			
		default:
			break;
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

Search.filters.getOptionsDropDownMenuLeft = function(button) {
	return (button.offsetLeft + $(button).parent()[0].offsetLeft - 30) + "px";
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

Search.filters.getOptionsDropDownMenuHeight = function(inputsArray) {
	// +1 for border 
	return inputsArray.length * (50 + 1);
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

Search.filters.select = function(type, $ctn){
		
	var setSel = function($el){
		$el.css("color", "orange");
	};
	
	if(type === "audio"){
		setSel($ctn.children(":eq("+Search.filters.currentFilter.audio.index+")"));

	}else if(type === "subtitle"){
		setSel($ctn.children(":eq("+Search.filters.currentFilter.subtitle.index+")"));

	}else if(type === "ad"){
		setSel($ctn.children(":eq("+Search.filters.currentFilter.ad.index+")"));

	}else if(type === "ls"){
		setSel($ctn.children(":eq("+Search.filters.currentFilter.ls.index+")"));

	}else{
		setSel($ctn.children(":last"));
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Executes the hiding the info banner
 */

Search.filters.onClick = function(bt, optionID){
	if($(bt).length && optionID){
		
		var _setValue = function(name, type, id){
			Search.filters.currentFilter[type] = {index:index, name:name};
			$(document.getElementById(id)).children(".filter-value").text(name);			
		};
		
		var index = $(bt).data("index");
		if(optionID === "ls"){
			_setValue(this.list.ls[index], "ls", "filter-ls");

		}else if(optionID === "subtitle") {
			_setValue(this.list.subtitle[index], "subtitle", "filter-sub");

		}else if(optionID === "ad") {
			_setValue(this.list.ad[index], "ad", "filter-ad");

		}else if(optionID === "audio") {
			_setValue(this.list.audio[index], "audio", "filter-audio");
		}		
		
		Search.results.reloadAfterFiltring();
		this.hide();
	}	
};