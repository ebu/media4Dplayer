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

function onLoad() {
	top.resizeTo(window.screen.availWidth, window.screen.availHeight);
	top.moveTo(0,0);

	document.addEventListener("keydown", handleKey, false);
	createSelecteur();
	setTimeout(function() {
		document.body.removeChild(document.getElementById("splashscreen"));
		myUser.init();
	}, 2000);
};

window.onload = onLoad;