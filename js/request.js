getUser = function() {
	var userList = {
		user: [
			{
		    	name: "Jean-Cristophe",
		    	picture: "media/avatar/avatar_homme_1.png"
		    },
		    {
		    	name: "Marie",
		    	picture: "media/avatar/avatar_femme.png"
		    },
		    {
		    	name: "Nicolas",
		    	picture: "media/avatar/avatar_homme_2.png"
		    }
		]
	};
	return userList;
};

getFav = function() {
	var favList = {
		fav: [
			{
		    	title: "Jardins suspendus de la canopée",
		    	subtitle: "DES FORÊTS ET DES HOMMES",
		    	detail: "Emission du 15/07/2015 | 50 min",
		    	picture: "media/fav.png"
		    },
		    {
		    	title: "ALEX HUGO - la mort et la belle vie",
		    	subtitle: "",
		    	detail: "film policier | 90 min",
		    	picture: "media/fav.png"
		    },
		    {
		    	title: "Robinsons chouettes - Saison 2 - Episode 59",
		    	subtitle: "LA CHOUETTE ET CIE",
		    	detail: "Emission du 17/09/2015 | 07 min",
		    	picture: "media/fav.png"
		    },
		    {
		    	title: "Jt du 20h",
		    	subtitle: "FRANCE2",
		    	detail: "Emission du 15/09/2015 | 40 min",
		    	picture: "media/fav.png"
		    }
		]
	};
	return favList;
};

getContentDashboard = function() {
	var contentDashboard = {
    	title: "Jardins suspendus de la canopée",
    	subtitle: "DES FORÊTS ET DES HOMMES",
    	detail: "Emission du 15/07/2015 | 50 min",
    	picture: "media/fav.png",
    	facebook: 16,
    	twitter: 1,
    	signe: true,
    	view: true,
    	sub: true,
    	audio: true,
    	synopsis: "Certains grands arbres de la forêt tropicale sont de véritables immeubles. Ils hébergent une multitude d'autres plantes qui vont chercher la lumière à leur sommet, " +
    			"des lianes mais aussi des épiphytes. Ces plantes vivent accrochées aux branches et forment des jardins suspendus, habités par toute une faune.",
    	resume: "Les forêts recouvrent un tiers des terres émergées de la Terre. Bien qu'elles soient vitales pour la planète, leur surface ne cesse de se réduire. Jamy Gourmaud propose" +
    			" de découvrir les pouvoirs méconnus et les richesses de trois forêts exceptionnelles. L'exploration débute par la forêt amazonienne, en Guyane, qui abrite une biodiversité" +
    			" incroyable. Toujours en Guyane, la mangrove sert, quant à elle, de véritable bouclier contre l'érosion du littoral et les cyclones. On y découvre que le crabe violoniste" +
    			" constitue un allié de choix dans la préservation de l'environnement. Enfin, sur la côte Est de l'Australie, une immense forêt d'eucalyptus fait obstacle à l'avancée" +
    			" du désert.",
    	link: [
	       {
	    	   title: "Le Monde de Jamy : A couper le souffle.",
	    	   subtitle: "Des forêts et des hommes",
	    	   picture: "media/fav.png"
	       },
	       {
	    	   title: "Le repas des koalas",
	    	   subtitle: "Des forêts et des hommes",
	    	   picture: "media/fav.png"
	       },
	       {
	    	   title: "Attention sangsue !",
	    	   subtitle: "Des forêts et des hommes",
	    	   picture: "media/fav.png"
	       }
    	]
	};
	return contentDashboard;
};