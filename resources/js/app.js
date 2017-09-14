/* global ready Menu Image */
(function (document, window) {
  window.ready = function (fn) {
    if (document.readyState !== 'loading') {
      fn()
    } else {
      document.addEventListener('DOMContentLoaded', fn)
    }
  }
}(document, window))

ready(function () {
  const menu = new Menu('.o-nav')
  menu.transitionOnScroll()

  document.querySelector('.o-nav__icon').addEventListener('click', function () {
    document.body.classList.toggle('is-active--overlay-menu')
    this.classList.toggle('is-active')
  })
})

Array.prototype.forEach.call(document.querySelectorAll('pre > code'), function (item) {
  item.classList.add('line-numbers')
})
ready(function () {
  var imgContainer = document.getElementsByClassName('js-blogImage')[0]
  var leftColum = document.getElementsByClassName('o-blog-listing__left')[0]
  var hidden = false
  if (leftColum !== undefined) {
    hidden = leftColum.currentStyle ? leftColum.currentStyle.display
                              : window.getComputedStyle(leftColum, null).display
  }
  if (imgContainer !== undefined && hidden !== 'none') {
    var img = new Image()
    img.onload = function () {
      imgContainer.appendChild(img)
      window.setTimeout(function () {
        img.classList.add('is-loaded')
      }, 1)
    }
    img.src = imgContainer.getAttribute('data-img-url')
    img.classList.add('js-blog-img')
  }
})
