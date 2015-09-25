var myUser = new userScreen();
var myHome = new homeScreen();
var myTopbar = new topbar();
var myFav = new favoriteScreen();
var myDash = new dashboardScreen();
var myPlayer = new playerScreen();

function onLoad() {
	document.addEventListener("keydown", handleKey, false);
	createSelecteur();
	setTimeout(function() {
		document.body.removeChild(document.getElementById("splashscreen"));
		myUser.init();
	}, 2000);
};

window.onload = onLoad;