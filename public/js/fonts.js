function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
ready(function(){
  WebFont.load({
    google: {
      families: ['Merriweather:300,700:latin', 'Lato:300,700:latin'] //, 'Droid Serif:400'
    }
  })
});
