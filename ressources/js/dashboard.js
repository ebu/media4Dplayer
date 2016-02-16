var Dash = {
	data:null
};

/**
 * @author Johny EUGENE (DOTSCREEN)
 * @description Resets the dashboard
 * @param {String} type The dashboard type
 */

Dash.reset = function(){
	
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

Dash.load = function(data, callback){

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

Dash.generate = function(){
	
	var mediaData = this.data;
	
	$(document.getElementById("epg-fiche-container")).children("h1").html(mediaData.title);
    $(document.getElementById("media-thumb")).attr("src", mediaData.picture);
	//$(document.getElementById("related-content")).empty();
	//$(document.getElementById("video-compatibilities-list")).children(".compatibility").hide();
    $(document.getElementById("synopsis")).html(mediaData.synopsis);
	$(document.getElementById("synopsis-and-social-icons-container")).children("h2").html(mediaData.subtitle).end().children(".program-date").html(mediaData.detail);
};