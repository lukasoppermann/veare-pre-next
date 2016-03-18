var WebFontConfig = {
	google: {
		families: [ 'Merriweather:300,700:latin', 'Lato:300,700:latin' ]
	},
	timeout: 2000
};

(function(){
	var wf = document.createElement("script");
	wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
		'://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	wf.async = 'true';
	document.head.appendChild(wf);
})();
