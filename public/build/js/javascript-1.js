var win, resolution, _body, _html;
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
// close jquery ready
});
