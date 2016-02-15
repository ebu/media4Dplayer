
var actionList = {};

$(document.getElementById("menu")).on("click", ".btn", function(){
	var section, sections = Section.sections, classList = $(this).attr("class");
	if(classList.indexOf(sections[0]) !== -1){
		section = sections[0];
		
	}else if(classList.indexOf(sections[1]) !== -1){
		section = sections[1];
		
	}else if(classList.indexOf(sections[2]) !== -1){
		section = sections[2];
		
	}else if(classList.indexOf(sections[4]) !== -1){
		section = sections[4];
	}
	
	if(section){
		Section.oldClass = [];
		Section.change(section, null, null, $(this));
	}
});

$(document.getElementById("profils-list")).on("click", ".btn", function(){
	Section.change(Section.sections[1]);
});

$(document.getElementById("apps-list")).on("click", ".btn", function(){
	Section.change(Section.sections[2], null, $(this).index());
});

$(document.getElementById("favorites-list")).on("click", ".item-playlist", function(){
	Section.oldClass.push($("body").attr("class"));
	Section.change(Section.sections[3]);
});

$(document.getElementById("favorites-list")).on("click", ".item-playlist .delete, .item-playlist .play", function(){
	
});

$("body").on("click", ".back-button", function(){
	Navigation.goBack();
});

$(document.getElementById("settings-menu")).on("click", ".btn", function(){
	var section = Section.sections[4];
	var rubric, rubrics = Section.rubrics[section], classList = $(this).attr("class");
	if(classList.indexOf(rubrics[0]) !== -1){
		rubric = rubrics[0];
		
	}else if(classList.indexOf(rubrics[1]) !== -1){
		rubric = rubrics[1];
		
	}else if(classList.indexOf(rubrics[2]) !== -1){
		rubric = rubrics[2];
		
	}else if(classList.indexOf(rubrics[4]) !== -1){
		rubric = rubrics[4];
	}
	
	if(rubric){
		Section.change(section, rubric);
	}
});

$(".option-font-family").on("click", ".font-family", function(){
	Settings.change.subtitlesFontFamily($(this).css("font-family"));
});

$(".option-background-color").on("click", ".color", function(){
	Settings.change.subtitlesBackgroundColor($(this).attr("class").replace("color ", ""));
});

$(".option-text-color").on("click", ".color", function(){
	Settings.change.subtitlesColor($(this).attr("class").replace("color ", ""));
});