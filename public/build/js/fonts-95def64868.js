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
      families: ['Lato:400,700']
    }
  })
});
