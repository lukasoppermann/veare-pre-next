import {default as throttle} from './modules/throttle'

document.querySelectorAll('[data-toc]').forEach((toc) => {
  let sectionsContainer = toc.closest('page-sections')
  toc.querySelectorAll('a.Toc__chapter__link').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault()
      sectionsContainer.goTo(link.getAttribute('href').substr(1))
    })
  })
})

if (document.querySelector('body').classList.contains('Page--work')) {
  let paginationInit = throttle(() => {
    let paginationContainer = document.querySelector('.Project__pagination-container')
    let paginationItems = paginationContainer.querySelectorAll('.Pagination__item')
    let pageSections = document.querySelector('page-sections')
    let toc = document.querySelector('.Project__toc')
    let tocOffset = toc.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop)
    let padding = window.getComputedStyle(pageSections).getPropertyValue('--outer-padding');
    let footerHeight = window.getComputedStyle(document.querySelector('.Footer-Section')).getPropertyValue('height')
    paginationContainer.style.top = `${tocOffset}px`
    paginationContainer.style.left = padding
    paginationContainer.style.height = `calc(100% - ${tocOffset}px - ${footerHeight} - 200px)`
    pageSections.addEventListener('activateSection', (event) => {
      paginationItems.forEach((item) => {
        if (item.querySelector('a').getAttribute('href').substr(1) === event.detail.sectionName) {
          item.classList.add('active')
        } else {
          item.classList.remove('active')
        }
      })
    })
    paginationItems.forEach((item) => {
      item.addEventListener('click', (event) => {
        pageSections.goTo(item.querySelector('a').getAttribute('href').substr(1))
      })
    })
  }, 100)
  
  paginationInit()
  window.addEventListener('resize', paginationInit)
}
