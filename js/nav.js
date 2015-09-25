move = function(action, event) {
	switch (selecteur.getAttribute("zone")) {
		case "userChoice":
			myUser.validUser();
			break;
		case "homeMenu":
			myHome.validVideo();
			break;
		case "favoriteChoice":
			myFav.validFavorite();
			break;
		case "dashboardPlay":
			myDash.validPlay();
			break;
		case "topbarZoneAccount":
			myTopbar.validAccount();
			break;
	}
};

function moveSelecteur(Obj) {
	try {
		pbSelecteur = false;
		if (typeof (Obj) != 'object') {
			Obj = document.getElementById(Obj);
		}

		var Obj_ref = Obj;
		var absoluteLeft = 0;
		var absoluteTop = 0;
		while (Obj_ref && Obj_ref.tagName != 'body') {
			absoluteLeft += Obj_ref.offsetLeft;
			absoluteTop += Obj_ref.offsetTop;
			Obj_ref = Obj_ref.offsetParent;
		}
		selecteur.setAttribute("zone", Obj.getAttribute("zone"));
		selecteur.setAttribute("x", Obj.getAttribute("x"));
		selecteur.setAttribute("y", Obj.getAttribute("y"));
		
		Obj.focus();
	} catch (err) {
		pbSelecteur = true;
	}
};