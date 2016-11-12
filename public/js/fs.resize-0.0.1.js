// ----------------------------------------------------
// FS_Resize Function
//
// @description: This fn debounces the resize event so it fires every 100ms only,
// because if it fires to often it can cause problems in some browsers.
// ----------------------------------------------------
// define functions 
;(function( $ )
{
	// ----------------------------------------------------
	// debounced resize event (fires once every 100ms)
	$.fs_resize = function( c, t, f )
	{
		if( t == undefined ){ t = 100; }
		window.onresize = function(){
			clearTimeout( f );
			f = setTimeout( c, t)
		};
		return c;
	};	
	// ----------------------------------------------------
// add jquery to scope	
})( jQuery );