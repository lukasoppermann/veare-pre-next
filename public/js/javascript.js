var win, resolution, _body, _html,
		pixelRatio = !!window.devicePixelRatio ? window.devicePixelRatio : '1'; // get Pixel Ratio
		// jquery ready
$(function(){
	// -----------------------
	// define variables
		win = $(window);
		_body = $('body');
		_html = $('html');
		resolution = 'mobile';
		var	_logo = $('#logo'),
			_menu_icon = $('#menu_icon'),
			i = 1,
			screen = {};
	// -----------------------
	// add Pixel Ratio to body
	_body.addClass('x'+pixelRatio);
	// -----------------------
	// define functions
	// -----------------------
	// img loading
	$.fn.imageLoad = function(fn){
		this.load(fn);
		this.each( function()
		{
			if ( this.complete && this.naturalWidth !== 0 ) {
				$(this).trigger('load');
			}
		});
		return this;
	}
	// -------------------------------------------------------------------------------------------------------------
	// min padding
	var minPadding = function(){
		$('.min-padding').each(function(){
			var _this 			= $(this),
					padding 		= _this.data('minpadding'),
					heightdiff	= _this.outerHeight() - _this.children().first().outerHeight();
			// check for mobile
			if( resolution == 'mobile' && _this.data('minpadding-mobile') != undefined )
			{
				padding = _this.data('minpadding-mobile');
			}
			// calc
			if( heightdiff < padding*2 )
			{
				_this.css({'paddingTop':padding-(heightdiff/2), 'paddingBottom':padding-(heightdiff/2)});
			}
		});
	};
	// -------------------------------------------------------------------------------------------------------------
	// load images depending on ratio
	$('.async-img').each(function(){
		var _this 	= $(this),
				src 		= _this.data('src-x'+pixelRatio),
				alt_src = _this.data('src');

		_this.addClass('loading').imageLoad(function()
		{
			if( src != undefined )
			{
				_this.css({'width':'auto','height':'auto'});
				var width = this.naturalWidth/pixelRatio;
				var height = this.naturalHeight/pixelRatio;
				_this.css({'width':width,'height':height});
			}
		});


		if( src != undefined )
		{
			_this.attr('src',src).addClass('loaded').removeClass('loading');
		}
		else if( alt_src != undefined )
		{
			_this.attr('src',alt_src).addClass('loaded').removeClass('loading');
		}

	});
	// -----------------------
	// query actions
	var query_actions = function( res )
	{
		resolution = res;
		minPadding();
		_body.trigger('resolutionChange', res);
	};
	// -----------------------
	// media queries
	var queries = [
		{
			context: 'mobile-portrait',
			match: function() {
				_body.addClass('mobile portrait').removeClass('hovers tablet small landscape screen wide-screen');
				query_actions('mobile');
			}
		},
		{
			context: 'mobile-landscape',
			match: function() {
				_body.addClass('mobile landscape').removeClass('hovers tablet small portrait screen wide-screen');
				query_actions('mobile');
			}
		},
		{
			context: 'tablet-small',
			match: function() {
				_body.addClass('tablet small').removeClass('portrait landscape hovers mobile screen wide-screen');
				if( !_body.hasClass('loaded-tablet') )
				{
					_body.addClass('hovers');
				}
				query_actions('tablet-small');
			}
		},
		{
			context: 'tablet',
			match: function() {
				_body.addClass('tablet').removeClass('portrait landscape hovers small mobile screen wide-screen');
				if( !_body.hasClass('loaded-tablet') )
				{
					_body.addClass('hovers');
				}
				query_actions('tablet');
			}
		},
		{
			context: 'screen',
			match: function() {
				_body.addClass('hovers screen').removeClass('portrait landscape tablet small mobile wide-screen min-screen');
				query_actions('screen');
			}
		},
		{
			context: 'wide-screen',
			match: function() {
				_body.addClass('hovers screen wide-screen').removeClass('portrait landscape tablet small mobile min-screen');
				query_actions('wide-screen');
			}
 		}
	];
	// Go!
	MQ.init(queries);
	// -----------------------
	// run min padding
	minPadding();
	// -----------------------
	// open sidebar
	$(document).on('click', '#menu_icon', function(e)
	{
		e.stopPropagation();
		if( _body.hasClass('menu-active') )
		{
			_body.removeClass('menu-active');
			_html.removeClass('menu-active');
			$(document).off('.noElastic');
		}
		else
		{
			_body.addClass('menu-active');
			if( _body.hasClass('mobile') )
			{
				_html.addClass('menu-active');
				$(document).on('touchmove.noElastic', function(e){
					e.preventDefault();
				});
			}

		}
	});
// -------------------------------------------------------------------------------------------------------------
// maps
	var lat = 52.546167,
			lng = 13.4145,
		 	zoom = 14,
			map;
	// -----------------------
	// Define styles
	var style = [
	{
		"stylers": [{
			"visibility": "off"
		}]
	},
  {
		"featureType": "road.local",
		"elementType": "labels",
		"stylers": [
			{ "visibility": "off" }
		]
	},
	{
		"featureType": "road",
		"elementType": "geometry",
		"stylers": [
			{ "visibility": "on" },
			{ "color": "#ffffff" }
		]
	},
  {
		"featureType": "road",
		"elementType": "labels.icon",
		"stylers": [
			{ "visibility": "off" }
		]
	},
	{
		"featureType": "road",
		"elementType": "labels.text.stroke",
		"stylers": [
			{ "visibility": "off" },
			{ "color": "#ffffff" }
		]
	},
	{
		"featureType": "road.arterial",
		"stylers": [
			{"visibility": "on"},
			{"color": "#f5e655"}
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "labels.text.fill",
		"stylers": [
			{ "visibility": "on"},
			{ "color":"#7e7733"}
		]
	},
  {
		"featureType": "road.arterial",
		"elementType": "labels.icon",
		"stylers": [
			{ "visibility": "off" }
		]
	},
	{
		"featureType": "road.highway",
		"stylers": [
			{"visibility": "on"},
			{"color": "#f5e655"}
			]
	},
	{
		"featureType": "road.highway",
		"elementType": "labels.text.fill",
		"stylers": [
			{"visibility": "on"},
			{"color": "#7e7733"}
		]
	},
  {
		"featureType": "road.highway",
		"elementType": "labels.icon",
		"stylers": [
			{ "visibility": "off" }
		]
	},
	{
		"featureType": "water",
		"elementType": "geometry.fill",
		"stylers": [
			{ "visibility": "on" },
			{ "color": "#469bb4" }
		]
	},
	{
 		"featureType": "landscape",
		"elementType": "geometry",
		"stylers": [
			{ "visibility": "on" },
			{ "color": "#ebf0f0" }
		]
 	},
	{
 		"featureType": "landscape.man_made",
		"elementType": "geometry",
		"stylers": [
			{ "visibility": "off" }
		]
 	},
	{
 		"featureType": "landscape",
		"elementType": "labels",
		"stylers": [
			{ "visibility": "off" }
		]
 	},
	{
		"featureType": "poi.park",
		"elementType": "geometry",
		"stylers": [
			{"visibility": "on"},
			{"color": "#74c2a6"}
		]
	},
	{
		"featureType": "poi",
		"elementType": "labels",
		"stylers": [
			{"visibility": "off"}
		]
	}
	];

	var _map = $('#veare_map');

	if( _map.length > 0 && resolution != 'mobile')
	{
				_map.height(_map.parent().css('height'));
		// hide pins
		$('.pins').hide();
		// once everything is loaded
		win.load(function() {
			// -----------------------
			// Create GMaps object
			map = new GMaps({
				div: '#veare_map',
				lat: lat, // lat: 52.546167, - neu:  52.5354,13.43315
				lng: lng, // lng: 13.415201,
				zoom: 14,
				disableDefaultUI: true,
				draggable: false,
				scrollwheel: false
				// tilesloaded: function(){
				// }
			});
			// Add styling
			map.setOptions({
				styles: style
			});
			// social media pins
			var socialMedia = {
				'dribble': {
					lat: 52.54090,
					lng: 13.40389,
					'wide-screen': {
						lat: 52.53195,
						lng: 13.40280,
					},
					content: '<a id="dribbble" class="dribbble pin in-map" href="http://dribbble.com/lukasoppermann" target="_blank"><div class="veare-sprite icon-big"></div><div class="pin-body pink"></div></a>'
				},
			  'twitter': {
					lat: 52.54666,
			  	lng: 13.40574,
			  	content: '<a class="twitter pin blue-pseudo" href="https://twitter.com/lukasoppermann" target="_blank"><div class="veare-sprite icon-big"></div><div class="pin-body blue"></div></a>'
				},
				'github': {
				  lat: 52.55630,
				  lng: 13.38660,
					'screen': {
						lat: 52.55604,
						lng: 13.37000
					},
					'wide-screen': {
						lat: 52.54534,
						lng: 13.37000
					},
				  content: '<a class="github pin" href="https://github.com/lukasoppermann" target="_blank"><div class="veare-sprite icon-big"></div><div class="pin-body orange"></div></a>'
				},
				'xing': {
				  lat: 52.55490,
				  lng: 13.40149,
				  content: '<a class="xing pin" href="https://www.xing.com/profile/Lukas_Oppermann" target="_blank"><div class="veare-sprite icon-big"></div><div class="pin-body turquoise"></div></a>'
				},
				'linkedin': {
				  lat: 52.54049,
				  lng: 13.39475,
					'screen': {
					  lat: 52.54049,
					  lng: 13.38475,
					},
					'wide-screen': {
						lat: 52.55831,
						lng: 13.36568,
					},
				  content: '<a class="linkedin pin" href="http://de.linkedin.com/in/lukasoppermann/" target="_blank"><div class="veare-sprite icon-big"></div><div class="pin-body light-red"></div></a>'
				}
			};
			// loop through social media obj
			$.each(socialMedia, function(index, social) {
				// check for resolution
				if( resolution != undefined && social[resolution] != undefined)
				{
					social.lat = social[resolution].lat;
					social.lng = social[resolution].lng;
				}
				// Add map markers
				map.drawOverlay({
				  lat: social.lat,
				  lng: social.lng,
					verticalAlign: 'top',
				  content: social.content
				});
			});


		$.fs_resize(function(){
			_map.height(_map.parent().css('height'));
			map.setCenter(lat, lng);
			// remove map markers
			map.removeOverlays();
			// add markers
			$.each(socialMedia, function(index, social) {
				// check for resolution
				if( resolution != undefined && social[resolution] != undefined)
				{
					var lat = social[resolution].lat;
					var lng = social[resolution].lng;
				}
				else
				{
					var lat = social.lat;
					var lng = social.lng;
				}
				// Add map markers
				map.drawOverlay({
				  lat: lat,
				  lng: lng,
					verticalAlign: 'top',
				  content: social.content
				});
			});
		});

		});
	}
// close jquery ready
});

function viewport() {
  var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
  	//Non-IE
  	myWidth = window.innerWidth;
  	myHeight = window.innerHeight;
  }
	if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
  	//IE 6+ in 'standards compliant mode'
  	myWidth = document.documentElement.clientWidth;
  	myHeight = document.documentElement.clientHeight;
  }
/* To Track Width x Height, leave this section uncommented */
  ga('send',
   'event',
   'Viewport',
   'Size',
   myWidth+'x'+myHeight,
   {'nonInteraction': 1});
}
