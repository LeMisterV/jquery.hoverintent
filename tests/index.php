<?php
$projName = 'jQuery.hoverIntent';

// Liste des fichiers JS qui composent ce projet
$projScripts = array(
/*	'path du script'				=> 'charset : utf-8 / iso-8859-1'*/
	'../../jquery.hoverIntent/libs/jquery.hoverIntent.js'		=> 'iso-8859-1'
);

// Liste des fichiers JS qui composent ce projet en mode compil�
$compilProjScripts = array(
/*	'path du script'				=> 'charset : utf-8 / iso-8859-1'*/
);






// Liste des fichiers JS dont d�pend le projet (penser � mettre aussi les d�pendences des d�pendences)
$depScripts = array(
/*	'path du script'					=> 'charset : utf-8 / iso-8859-1',*/
	'../../jquery-1.3.2.min.js'			=> 'iso-8859-1',
);

// Liste des fichiers JS dont d�pend le projet en mode compil�
$compilDepScripts = array(
/*	'path du script'					=> 'charset : utf-8 / iso-8859-1',*/
);



// Pour forcer le chargement des pubs, d�commenter la ligne suivante
# $loadPubs = true;

// Pour d�finir la liste de positions OAS par d�faut :
# $pubListPosDefault = 'Middle,Middle3'
// Pour forcer toujours une liste de positions OAS sp�cifique :
# $pubListPos = 'Middle,Middle3'

// Pour d�finir l'OAS site page par d�faut :
# $pubSitePage = 'www.francetv.fr/campagne/de/test'
// Pour forcer toujours un OAS site page sp�cifique :
# $pubSitePageDefault = 'www.francetv.fr/campagne/de/test'


require('../baseDoc.php');
