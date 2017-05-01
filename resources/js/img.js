/* global Image */
let lazyImg = () => {
  let imgs = document.querySelectorAll('.o-figure--lazy-load')

  imgs.forEach((container) => {
    let downloadingImage = new Image()
    let img = container.querySelector('.o-figure__img')
    downloadingImage.onload = function () {
      img.src = this.src
      setTimeout(() => {
        container.classList.add('is-loaded')
      }, 10)
    }
    downloadingImage.src = img.getAttribute('img-src')
  })
}
