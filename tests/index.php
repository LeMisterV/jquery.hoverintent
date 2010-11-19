<?php
$projName = 'jQuery.hoverIntent';

// Liste des fichiers JS qui composent ce projet
$projScripts = array(
/*	'path du script'				=> 'charset : utf-8 / iso-8859-1'*/
	'../../jquery.hoverIntent/libs/jquery.hoverIntent.js'		=> 'iso-8859-1'
);

// Liste des fichiers JS qui composent ce projet en mode compilé
$compilProjScripts = array(
/*	'path du script'				=> 'charset : utf-8 / iso-8859-1'*/
);






// Liste des fichiers JS dont dépend le projet (penser à mettre aussi les dépendences des dépendences)
$depScripts = array(
/*	'path du script'					=> 'charset : utf-8 / iso-8859-1',*/
	'../../jquery-1.3.2.min.js'			=> 'iso-8859-1',
);

// Liste des fichiers JS dont dépend le projet en mode compilé
$compilDepScripts = array(
/*	'path du script'					=> 'charset : utf-8 / iso-8859-1',*/
);



// Pour forcer le chargement des pubs, décommenter la ligne suivante
# $loadPubs = true;

// Pour définir la liste de positions OAS par défaut :
# $pubListPosDefault = 'Middle,Middle3'
// Pour forcer toujours une liste de positions OAS spécifique :
# $pubListPos = 'Middle,Middle3'

// Pour définir l'OAS site page par défaut :
# $pubSitePage = 'www.francetv.fr/campagne/de/test'
// Pour forcer toujours un OAS site page spécifique :
# $pubSitePageDefault = 'www.francetv.fr/campagne/de/test'


require('../baseDoc.php');
