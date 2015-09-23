var VK_ENTER = 13;
var VK_BACK = 8;

handleKey = function handleKey(event) {
	switch (event.keyCode) {
		case VK_ENTER:
			move("enter");
			break;
		case 8:
		case 27:
		case VK_BACK:
			move("back", event);
			event.preventDefault(); 
			event.stopPropagation();
			break;
		default:
			break;
	};
};