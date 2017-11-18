Array.prototype.forEach.call(document.querySelectorAll('pre > code'), function (item) {
  item.classList.add('line-numbers')
  item.parentElement.setAttribute('columns', item.getAttribute('columns'))
  item.parentElement.setAttribute('start-column', item.getAttribute('start-column'))
})
