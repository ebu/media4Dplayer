var Dashboard = {
	data:null
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Resets the dashboard
 * @param {String} type The dashboard type
 */

Dashboard.reset = function(){
	
	this.data = null;			
	$(document.getElementById("epg-fiche-container")).children("h1").empty();
    $(document.getElementById("media-thumb")).removeAttr("src");
	$(document.getElementById("related-content")).empty();
    $(document.getElementById("synopsis")).empty();
	$(document.getElementById("video-compatibilities-list")).children(".compatibility").hide();
	$(document.getElementById("synopsis-and-social-icons-container")).children("h2, .program-date").empty();
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Launches the initializing and the loading of the dashbord
 * @param {Object} params Contains parameters used to load the dashboard
 * @param {String} section The section's name
 * @param {Object} callbackList Contains a success and error callback
 */

Dashboard.load = function(data, callback){

    if(typeOf(data) === "object"){
		
        this.reset();
		
		this.data = data;		
		this.generate();
		
		if(typeOf(callback) === "function"){
			callback();
		}
    }
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Inserts the media infos in the dashboard
 */

Dashboard.generate = function(){
	
	var mediaData = this.data;
	
	$(document.getElementById("epg-fiche-container")).children("h1").html(mediaData.title);
    $(document.getElementById("media-thumb")).attr("src", mediaData.picture);
	
    $(document.getElementById("synopsis")).html(mediaData.synopsis);
	$(document.getElementById("synopsis-and-social-icons-container")).children("h2").html(mediaData.subtitle).end().children(".program-date").html(mediaData.detail);
	
	/* RELATED CONTENT */
	var list = mediaData.relatedContent;
	if(typeOf(list) === "array"){

		var $item, i, l = list.length, $ctn = $(document.getElementById("related-content")), item;
		for(i=0;i<l;i++){
			item = list[i];
			$item = $('<div class="item btn"><img src="'+item.picture+'" alt="Lire la vidéo '+item.title+'"/><div class="title">'+item.title+'</div><div class="subtitle">'+item.subtitle+'</div></div>').appendTo($ctn);
		}
	}
	
	/* OPTIONS ACCESSIBILITEES */
	$ctn = $(document.getElementById("video-compatibilities-list"));
	if(mediaData.video.links.dataAD && mediaData.video.links.dataAD.url){
		$ctn.children(".ad").show();
	}
	
	if(mediaData.video.links.dataLS && mediaData.video.links.dataLS.url){
		$ctn.children(".ls").show();
	}
	
	if(mediaData.video.links.dataSub && mediaData.video.links.dataSub.url){
		$ctn.children(".subtitle").show();
	}
	
	if(mediaData.video.links.dataMain && mediaData.video.links.dataMain.url){
		$ctn.children(".audio").show();
	}
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Inserts the media infos in the dashboard
 */

Dashboard.generateFullscreenSynopsis = function(){
	
	var mediaData = Dashboard.data;
	$(document.getElementById("full-synopsis")).children("h2").html('<span tabindex="2" class="selectable-by-chromevox">'+mediaData.subtitle+'</span>').end()
		.children(".program-date").html('<span tabindex="3" class="selectable-by-chromevox">'+mediaData.detail+'</span>');
	
    $(document.getElementById("synopsis2")).html(mediaData.synopsis);
};