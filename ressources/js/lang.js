LANG = {
		codeLang:null,
		langData : null,
		getStr: function(){

			var str = arguments[0];
			delete arguments[0];

			if (!LANG.langData){
				console.log(' NO LANG DATA ');
				return str;
			}

			var translated = LANG.langData[str];

			if (typeof translated === "string"){
				for (var i in arguments){
					if(arguments.hasOwnProperty(i)){
						var argument = arguments[i];                           
						translated = translated.replace("%s", argument);
					}
				}
			}
			return translated ? translated : str;
		},
		init: function(params){

			params = params instanceof Object ? params : {};
			var langFile = params.langFile;
			// var rand = Math.floor(Math.random() * (10000)) ;
			// langFile += "?v=" + rand;
			var callback = function(data) {
				if(typeOf(data) === "object"){
					
					LANG.cache = data;
					LANG.langData = data[params.codeLang];
					LANG.codeLang = params.codeLang;
					
					if (typeOf(params.onComplete) === "function"){
						params.onComplete();
					}
				}
			};
			var _onError = function(){
				
				json.load({
					url: "ressources/json/translations_" + Config.version + ".json",
					callback: callback
				});
			};
							
			if(LANG.cache){			
				callback(LANG.cache);
				
			}else{
				json.load({url:langFile, callback:callback, onError:_onError, headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}});
			}			
		},
		getMsg: function(fullMessage){
			if(fullMessage){
				var title = "", text = "";
				var arrayMsg = fullMessage.split(" - ");
				if(arrayMsg.length > 1){
					title = arrayMsg[0];
					text = arrayMsg[1];
				}else{
					text = arrayMsg[0];
				}
				var i = 1;
				while (arguments[i]){
					var exp = arguments[i];
					var replacement = arguments[i+1];
					text = text?exp&&replacement?text.replace(exp, replacement):text:"";
					i+=2;
				}
				return [title||"",text];
			}
		},
		setDirection: function(){
			$("html").attr("dir", (this.codeLang === "ar") ? "rtl" : "auto");
		},
		isRTL: function(){
			return this.codeLang === "ar";
		},
		switchLang:function(){
			if(this.isRTL()){
				this.codeLang = "en";
			}else{
				this.codeLang = "ar";
			}
			setHtmlStorage("lang", this.codeLang, 60 * 60 * 24 * 365);
		},
		getLanguagePath:function(){
			return "&lang="+this.codeLang;
		}
};