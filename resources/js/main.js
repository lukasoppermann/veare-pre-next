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

    if( imgContainer !== undefined ){
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
