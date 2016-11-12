// ----------------------------------------------------
// jQuery fs_tiles fn
// ----------------------------------------------------
// define functions 
;(function( $, window )
{
	// define vars
	var plugin_name = 'fs_tiles',
			_this,
			items_pos = {},
			arrange,
			arrange_done;
	
	// define methods
	var methods = {
		// settings object
		settings: {},
		// initialize class
		init: function( settings ) 
		{ 
			// Extend default options with those provided
			methods.settings = $.extend({}, $.fn[plugin_name].defaults, settings);
			// cache selection
			_this = $(this);
			// get items
			methods.settings.items = _this.find(methods.settings.item);
			// run arrange method
			methods.arrange();
		},
		// arrange
		arrange: function( )
		{
			arrange_done = false;
			// get first item
			methods.settings.first = methods.settings.items.first();
			// get columns
			column = Math.floor(_this.width()/methods.settings.first.outerWidth(true));
			// only if more than 1 column is present, the object need to be recalculated
			if( column > 1 )
			{
				methods.settings.column = column;
				// find biggest item in first row
				var tmp_height = 0;
				var index = 0;
				methods.settings.items.slice(0,methods.settings.column).each(function(i, item)
				{
					var height = $(this).outerHeight(false);
					if( height > tmp_height )
					{
						tmp_height = height;
						index = i;
					}
				});
				// get margin
				methods.settings.margin = methods.settings.items.eq(index+methods.settings.column).position().top-(methods.settings.items.eq(index).position().top+methods.settings.items.eq(index).outerHeight(false));
				// arrange items
				methods.settings.items.each( function( index, item )
				{
					if( methods.settings.stop == true )
					{
						// set stop to false
						methods.settings.stop = false;
						
						// remove top from items
						methods.settings.items.stop().css('top','');
						
						// run stopfn
						methods.stopfn();
						
						// exit loop
						return false;
					}
			
					var _this = $(this);
			
					items_pos[index] = {};
					items_pos[index].top = _this.position().top;
					items_pos[index].bottom = items_pos[index].top+_this.outerHeight(false);
	
					if( items_pos[index-methods.settings.column] !== undefined )
					{
						if(items_pos[index-methods.settings.column].bottom + methods.settings.margin == items_pos[index].top)
						{
							items_pos[index].offset = 0;
						}
						else
						{
							items_pos[index].offset = (items_pos[index].top-items_pos[index-methods.settings.column].bottom);
							_this.animate({'top':"-"+(items_pos[index].offset-methods.settings.margin)});
							items_pos[index].top -= (items_pos[index].offset-methods.settings.margin);
							items_pos[index].bottom = items_pos[index].top+_this.outerHeight(false);
						}
					}
					else
					{
						items_pos[index].offset = 0;
					}
				
				});
			}
		
			// if only 1 column is used, remove all styles
			else if( column <= 1 )
			{
				methods.settings.items.css('top','');
			}
			
			// set arrabe_done true so that the stopfn is still runs
			arrange_done = true;
		},
		stop: function( fn )
		{
			// set stop true
			methods.settings.stop = true;
			
			// get fn
			if( typeof(fn) == 'string' )
			{
				methods.stopfn = methods[fn];
			}
			else
			{
				methods.stopfn = fn;
			}
			
			// if arrange is already done
			if( arrange_done === true)
			{
				methods.settings.stop = false;
				methods.settings.items.stop().css('top','');
				
				methods.stopfn();
			}
		},
		stopfn: function(){}
	};
	
	//-------------------------------------------
	// fn wrapper
	$.fn[plugin_name] = function( method ){
		// Method calling logic
		if ( methods[method] ) 
		{
			if( _this != undefined )
			{
				return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
			}
		} 
		else if ( typeof method === 'object' || ! method ) 
		{
			return methods.init.apply( this, arguments );
		}
		else
		{
			$.error( 'Method ' +  method + ' does not exist on jQuery.'+[plugin_name] );
		}
	}
	
	//-------------------------------------------
	// default options
	$.fn[plugin_name].defaults = {
		item: '.card',
		callback: function(){}
	};

})( jQuery, window);
