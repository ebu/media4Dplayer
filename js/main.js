var myUser = new userScreen();
var myHome = new homeScreen();
var myTopbar = new topbar();
var myFav = new favoriteScreen();
var myDash = new dashboardScreen();
var mySett = new settingsScreen();
var myPlayer = new playerScreen();
var myComingSoon = new comingSoonScreen();
var myTextHelper = new textHelperScreen();
var backToPlayerFromSettings = false;
var defaultVolumeValue = 70;

function onLoad() {
	top.resizeTo(window.screen.availWidth, window.screen.availHeight);
	top.moveTo(0,0);
	
	var defaultValue = getCookie("volumeValue") || defaultVolumeValue;
	$( "#slider" ).slider();
	var slider = $('#slider');
	slider.slider({
        range: "min",
        min: 0,
        value: defaultValue,
 
        start: function(event,ui) {
          tooltip.fadeIn('fast');
        },
 
        slide: function(event, ui) {
			
            var value = ui.value,//slider.slider('value'),
                volume = $('.volume');
 
            tooltip.css('left', value+5).text(ui.value);
 
            if(value <= 5) { 
                volume.css('background-position', '0 0');
            } 
            else if (value <= 25) {
                volume.css('background-position', '0 -25px');
            } 
            else if (value <= 75) {
                volume.css('background-position', '0 -50px');
            } 
            else {
                volume.css('background-position', '0 -75px');
            }
			
			try{
				if(!value){
					myPlayer.setMute();
				}else{
					eraseCookie("muteEnabled");
					setCookie("volumeValue", value);
					myPlayer.setVolume(audioGainNode, videoGainNode, value);		
					$(document.getElementById("playerOptionAudioCurrentValue")).html(Media.audiosList[Media.currentAudioIndex]);
				}
			}catch(e){
				console.error(e);
			}			
        },
 
        stop: function(event, ui) {
          tooltip.fadeOut('fast');
        }
	});
	var tooltip = $('.tooltip');
	tooltip.hide();

	document.addEventListener("keydown", handleKey, false);
	createSelecteur();
	setTimeout(function() {
		document.body.removeChild(document.getElementById("splashscreen"));
		myUser.init();
	}, 2000);
};

window.onload = onLoad;