function textHelperScreen() {
	var myTextHelperScreen = this;
	var alreadyInit = false;
	this.textHelper = document.getElementById("textHelper");

	var textHelperContainer = null;
	var btClose = null;
	this.init = function() {
		textHelperContainer = createDiv("textHelperContainer", myTextHelperScreen.textHelper, "", "textHelperContainer");
		btClose = createButton("btClose", myTextHelperScreen.textHelper, "closeTextHelper", 0, 0, "textHelperButtonClose");
		alreadyInit = true;
	};
	
	this.show = function() {
		if(!alreadyInit) this.init();
		$("#textHelper").css("display","block");
		//myTextHelperScreen.textHelper.style.display = "block";
	};
	
	this.hide = function() {
		$("#textHelper").css("display","none");
		//myTextHelperScreen.textHelper.style.display = "none";
	};

	this.displayTextHelperWithText = function(text) {
		this.show();

		console.log("textHelperScreen - displayTextHelperWithText : ", text);
		textHelperContainer.innerHTML = text;

		$('.textHelperContainer').css({
        	'position' : 'absolute',
        	'left' : '50%',
        	'top' : '50%',
        	'margin-left' : -$('.textHelperContainer').outerWidth()/2,
        	'margin-top' : '-23%',
        	'padding-left' : '14px',
        	'padding-right' : '14px',

        });


	}

	return this;
};