Array.prototype.forEach.call(document.querySelectorAll('pre > code'), function(item){
    item.classList.add('line-numbers');
});
function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
ready(function(){
    var imgContainer = document.getElementsByClassName('js-blogImage')[0];
    var leftColum = document.getElementsByClassName('o-blog-listing__left')[0];
    var hidden = leftColum.currentStyle ? leftColum.currentStyle.display :
                              getComputedStyle(leftColum, null).display;
    if( imgContainer !== undefined && hidden !== 'none' ){
        var img = new Image();
        img.onload = function () {
            imgContainer.appendChild(img);
            window.setTimeout(function(){
                img.classList.add('is-loaded');
            },1);
        };
        img.src = imgContainer.getAttribute('data-img-url');
        img.classList.add('js-blog-img');

    }
});
