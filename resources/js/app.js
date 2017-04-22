(function(document, window){
    window.ready = function(fn) {
        if (document.readyState != 'loading'){
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
}(document, window));

ready(function(){
  const menu = new Menu('.o-nav')
  menu.transitionOnScroll()

  document.querySelector('.o-nav__icon').addEventListener('click', function () {
    document.body.classList.toggle('is-active--overlay-menu')
    this.classList.toggle('is-active')
  })
})
