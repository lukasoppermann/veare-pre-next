/* global Menu */

const menu = new Menu('.o-nav')
menu.transitionOnScroll()

document.querySelector('.o-nav__icon').addEventListener('click', function () {
  document.body.classList.toggle('is-active--overlay-menu')
  this.classList.toggle('is-active')
})

Array.prototype.forEach.call(document.querySelectorAll('pre > code'), function (item) {
  item.classList.add('line-numbers')
  item.parentElement.setAttribute('columns', item.getAttribute('columns'))
  item.parentElement.setAttribute('start-column', item.getAttribute('start-column'))
})
