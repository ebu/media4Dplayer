function userScreen() {
	var myUserScreen = this;
	this.activeScreen = false;
	this.userSelectScreen = document.getElementById("userSelectScreen");
	this.userChoiceDom = document.getElementById("userChoice");
	this.userList = null;
	
	this.createUser = function() {
		userButton = function(index, user) {
			var userButton = createButton("user_" + index, myUserScreen.userChoiceDom, "userChoice", index, 0, "userButton");
			createImg(null, userButton, user.picture);
			createDiv(null, userButton, user.name);
			return userButton;
		};
		
		var cpt = 0;
		var btn = null;
		for(var i in myUserScreen.userList.user) {
			btn = userButton(cpt, myUserScreen.userList.user[i]);
			btn.setAttribute("tabindex", cpt + 1);
			cpt++;
		}
	};

	this.init = function() {
		myUserScreen.cleanPage();
		myUserScreen.userList = getUser();
		myUserScreen.createUser();
		myUserScreen.show();
	};
	
	this.show = function() {
		this.userSelectScreen.style.display = "block";
		this.activeScreen = true;
	};
	
	this.hide = function() {
		this.userSelectScreen.style.display = "none";
		this.activeScreen = false;
	};
	
	this.validUser = function() {
		this.hide();
		myHome.init();
	};
	
	this.cleanPage = function() {
		emptyElem(myUserScreen.userChoiceDom);
	};

	return this;
};

