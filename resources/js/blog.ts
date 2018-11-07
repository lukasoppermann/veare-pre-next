import '../../node_modules/prismjs/prism.js'
import '../../node_modules/prismjs/components/prism-bash.js'

Array.prototype.forEach.call(document.querySelectorAll('pre > code'), function (item) {
  item.classList.add('line-numbers')
  item.parentElement.classList.add('c-article__code')
})
