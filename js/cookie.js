function setCookie(name, value, days) {
	var expires_date = new Date();
	if(!days)
	{
		days = 1800;
	}
	expires_date.setTime(expires_date.getTime() + (days * 24 * 60 * 60 * 1000));
	var expires = "; expires=" + expires_date.toGMTString();
	value = typeof (value) == 'object' ? JSON.stringify(value) : value;

	document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
	var nameEQ = name + "=";
	var tabCookie = document.cookie.split(';');
	for(var i = 0; i < tabCookie.length; i++) {
		var cook = tabCookie[i];
		while(cook.charAt(0) == ' ') {
			cook = cook.substring(1, cook.length);
		}
		if(cook.indexOf(nameEQ) == 0)
			return cook.substring(nameEQ.length, cook.length);
	}
	return null;
}

function eraseCookie(name) {
	setCookie(name, "", -1);
}