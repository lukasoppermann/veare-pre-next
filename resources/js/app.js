function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
// -----------------------
// open sidebar
ready(function(){
	document.querySelector('#menu_icon').addEventListener('click', function(e)
	{
		var $body = document.querySelector('body');
		if( $body.classList.contains('menu-active') )
		{
			$body.classList.remove('menu-active');
		}
		else
		{
			$body.classList.add('menu-active');
		}
	});
});
