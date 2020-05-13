import throttle from './modules/throttle'

document.querySelectorAll('[data-toc]').forEach((toc) => {
  const sectionsContainer = toc.closest('page-sections')
  toc.querySelectorAll('a.Toc__chapter__link').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault()
      sectionsContainer.goTo(link.getAttribute('href').substr(1))
    })
  })
})

if (document.querySelector('body').classList.contains('Page--work')) {
  const paginationInit = throttle(() => {
    const paginationContainer = document.querySelector('.Project__pagination-container')
    const paginationItems = paginationContainer.querySelectorAll('.Pagination__item')
    const pageSections = document.querySelector('page-sections')
    const toc = document.querySelector('.Project__toc')
    const tocOffset = toc.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop)
    const padding = window.getComputedStyle(pageSections).getPropertyValue('--outer-padding')
    const footerHeight = window.getComputedStyle(document.querySelector('.Footer-Section')).getPropertyValue('height')
    paginationContainer.style.top = `${tocOffset}px`
    paginationContainer.style.left = padding
    paginationContainer.style.height = `calc(100% - ${tocOffset}px - ${footerHeight} - 190px)`
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
