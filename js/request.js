getUser = function() {
	var userList = {
		user: [
			{
		    	name: "invité",
		    	picture: "media/avatar/avatar.png"
		    },

/*		
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
*/		    
		]
	};
	return userList;
};

getFav = function() {
	var favList = {
		fav: [
		    {
		    	title: "Le monde de Jamy",
		    	subtitle: "Des volcans et des hommes",
		    	detail: "Émission du 07/05/2014 | 60 min",
		    	picture: "media/favoris/LMDJ2.png"
		    },
		    {
		    	title: "Le JT de France 2",
		    	subtitle: "FRANCE2",
		    	detail: "Émission du 10/02/2016 | 38 min",
		    	picture: "media/favoris/JT_20h00.png"
		    },
		    {
		    	title: "Tchoupi",
		    	subtitle: "",
		    	detail: "série d'animation | 5 min",
				picture: "media/favoris/TCHOUPI.png"
		    },
		    {
		    	title: "La météo",
		    	subtitle: "",
		    	detail: "Emission du 08/02/2016 | 5 minutes",
		    	picture: "media/favoris/MÉTÉO.png"
		    }


		]
	};
	return favList;
};

getContentDashboard = function(index) {
	var contentDashboard = [
	{
    	title: "Le monde de jamy",
    	subtitle: "Des volcans et des hommes",
    	detail: "Émission du 07/05/2014 | 60 min",
    	picture: "media/dashboard/LMDJ2.png",
    	facebook: 16,
    	twitter: 1,
    	signe: true,
    	view: true,
    	sub: true,
    	audio: true,
    	synopsis: "Pour ce premier numéro consacré aux volcans, Jamy nous convie à un voyage extraordinaire à la découverte d’une planète qui vit, gronde et palpite." +
    			" Des lieux et des territoires en fusion dont les secrets, les mystères et les légendes nous sont révélés par ceux qui les connaissent le mieux." + 
    			"<br />" +
    			"Ces hommes et ces femmes avec lesquels Jamy a rendez-vous in situ sont chercheurs, scientifiques, historiens ou simples témoins d’un phénomène redouté mais qui fascine pourtant depuis la nuit des temps." +
    			"<br />" +
    			"Toujours attentif pour rendre simple et intelligible les phénomènes les plus complexes, c’est un Jamy impliqué que  nous découvrons au cours de ce voyage plein de surprises et de rebondissements, un Jamy " +
    			"aventurier aussi qui ne craint pas de s'approcher au plus près  de la lave, d’un spectaculaire volcan d’Éthiopie ou de se poser sur un cratère instable de l’île de Montserrat." +
    			"<br />" +
    			"L’Éthiopie, les Antilles, l’Italie du Sud et Hawaï, autant d’étapes sur un parcours exceptionnel qui conjugue passion, émotion et envie d’apprendre et de transmettre. Un véritable tour du monde filmé comme un grand spectacle de la nature."
    			,
    	resume: "",
    	link: [
	       {
	    	   title: "Le Monde de Jamy : A couper le souffle.",
	    	   subtitle: "Des forêts et des hommes",
	    	   picture: "media/dashboard/icone_pt_video_soufle.png"
	       },
	       {
	    	   title: "Le repas des koalas",
	    	   subtitle: "Des forêts et des hommes",
	    	   picture: "media/dashboard/icone_pt_video_koala.png"
	       },
	       {
	    	   title: "Attention sangsue !",
	    	   subtitle: "Des forêts et des hommes",
	    	   picture: "media/dashboard/icone_pt_video_sangsue.png"
	       }
    	]
	},

	{
    	title: "Le JT de France 2",
    	subtitle: "JT du 20h du mercredi 10 Février 2016",
    	detail: "Émission du 10/02/2016",
    	picture: "media/dashboard/JT_20h00.png",
    	facebook: 16,
    	twitter: 1,
    	signe: true,
    	view: true,
    	sub: true,
    	audio: true,
    	synopsis: "Le journal de 20 Heures est le grand rendez-vous de l'actualité de la journée sur France 2. Du lundi au jeudi, David Pujadas est au commande de ce journal TV de 40 minutes." +
    			"<br />" +
    			"Le 20 Heures propose un tour d'horizon complet de l'actualité de la journée, enrichi par les nombreux reportages et duplex des envoyés spéciaux en France et à l’étranger," +
    			"ainsi que les interventions des correspondants à travers le monde pour raconter et analyser l’actualité internationale." +
    			"Après la présentation des titres, la rédaction décrypte les événements forts de l’actualité avec des infographies, des chroniques, des invités, et des experts sur le plateau pour expliquer les sujets qui font la Une." +
    			"Ce programme est disponible ici en direct vidéo ou en replay après sa diffusion pour voir et revoir les précédentes éditions à volonté."
    			,
    	resume: "",
    	link: [
	       {
	    	   title: "Le JT de France 3",
	    	   subtitle: "Émission du 15/11/2015",
	    	   picture: "media/dashboard/icone_pt_video_JTFR3.png"
	       },
	       {
	    	   title: "Le JT de France 2",
	    	   subtitle: "Émission du 14/11/2015",
	    	   picture: "media/dashboard/icone_pt_video_JTFR2.png"
	       },
	       {
	    	   title: "Le JT de France 2",
	    	   subtitle: "Émission du 13/11/2015",
	    	   picture: "media/dashboard/icone_pt_video_JTFR2.png"
	       }
    	]
	},
	{
    	title: "Tchoupi",
    	subtitle: "",
    	detail: "série d'animation | 5 min",
    	picture: "media/dashboard/TCHOUPI.png",
    	facebook: 16,
    	twitter: 1,
    	signe: true,
    	view: true,
    	sub: true,
    	audio: true,
    	synopsis: "T'choupi et Doudou est une série d'animation canado–belgo–française en 65 épisodes de 5 minutes, adaptée de la série de littérature de jeunesse T'choupi. <br/>En France, la série a été diffusée en 1999 sur Canal J, rediffusée en 2000 sur TiJi puis sur France 5 dans Zouzous depuis le 29 octobre 2012 et sur France 4 également dans Zouzous."
    			,
    	resume: "",
    	link: []
	},
	{
    	title: "La météo",
    	subtitle: "",
    	detail: "Emission du 08/02/2016 | 5 minutes",
    	picture: "media/dashboard/MÉTÉO.png",
    	facebook: 16,
    	twitter: 1,
    	signe: true,
    	view: true,
    	sub: true,
    	audio: true,
    	synopsis: "Le journal de 20 Heures est le grand rendez-vous de l'actualité de la journée sur France 2. Du lundi au jeudi, David Pujadas est au commande de ce journal TV de 40 minutes." +
    			"<br />" +
    			"Le 20 Heures propose un tour d'horizon complet de l'actualité de la journée, enrichi par les nombreux reportages et duplex des envoyés spéciaux en France et à l’étranger," +
    			"ainsi que les interventions des correspondants à travers le monde pour raconter et analyser l’actualité internationale." +
    			"Après la présentation des titres, la rédaction décrypte les événements forts de l’actualité avec des infographies, des chroniques, des invités, et des experts sur le plateau pour expliquer les sujets qui font la Une." +
    			"Ce programme est disponible ici en direct vidéo ou en replay après sa diffusion pour voir et revoir les précédentes éditions à volonté."
    			,
    	resume: "",
    	link: []
	}
	];
	return contentDashboard[index];
};