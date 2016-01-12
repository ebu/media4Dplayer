function createDiv(idElement, parent, texte, style){
	var element = document.createElement("div");
	if(idElement != null) {		
		element.id = idElement;
	}
	if(style != null) {		
		element.className = style;
	}
	if(texte != null) {
		element.innerHTML = texte;
	}
	if(parent != null) {		
		parent.appendChild(element);		
	}
	return element;
}

function createDivAriaDesc(idElement, parent, texte){
	var element = createDiv(idElement, parent, texte);
	element.style.display = "none";
	//element.setAttribute("aria-describedby", idElement);
	return element;
}

function createImg(idElement, parent, src, style, alt){
	var element = document.createElement("img");
	if(idElement != null)
		element.id = idElement;
	if(style != null)
		element.className = style;
	if(alt != null)
		element.alt = alt;

	element.src = src;
	parent.appendChild(element);
	return element;
}

function createButtonWithActionFunction(idElement, parent, zone, style, actionFunction) {
	var bt = createButton(idElement, parent, zone, 0, 0, style);
	bt.clickAction = actionFunction;
	return bt;
} 

function createButton(idElement, parent, zone, x, y, style){
	var button = createDiv(idElement, parent, null, style);
	button.setAttribute("zone", zone);
	button.setAttribute("x", x);
	button.setAttribute("y", y);
	button.setAttribute("onMouseOver", "moveSelecteur('"+button.id+"');");
	button.setAttribute("onFocus", "moveSelecteur('"+button.id+"');");
	button.onSelect = function() {
		if(button.clickAction) {
			button.clickAction();
		}
		else {
			move('enter', button);
		}
	}
	button.setAttribute("onClick", "this.onSelect();");
	return button;
}

function createSelecteur() {
	selecteur = document.createElement("div");
	selecteur.setAttribute('id', "selecteur");
	selecteur.setAttribute('style', "position: absolute; z-index:0;");
	selecteur.setAttribute('zone', null);
	selecteur.setAttribute('x', null);
	selecteur.setAttribute('y', null);

	document.body.appendChild(selecteur);
	selecteur.style.display = "none";
};

function emptyElem(elem) {
	while (elem.firstChild) {
		elem.removeChild(elem.firstChild);
	}
}