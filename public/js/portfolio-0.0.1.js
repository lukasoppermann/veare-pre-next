// document ready
$(function(){
	
	// tiles
	var _items = $('.items');
			
	_items.fs_tiles();
	
	_body.on('resolutionChange', function( resolution ){
		_items.fs_tiles('stop', 'arrange');
	});
	
	// filters
	$('.filters').fs_filter({
		url: $('body').data('url')+'portfolio/',
		title: "vea.re – visionary design | portfolio: "
	});

// close jquery
});