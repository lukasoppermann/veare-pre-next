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
      families: ['Lato:300,400,700'] //, 'Droid Serif:400'
    }
  })
});
