const responsiveMenu = menu => {
  // add click event to menuIcon
  menu.querySelector('.Menu__icon').addEventListener('mouseover', () => {
    menu.classList.add('is-hovered')
  })
  menu.querySelector('.Menu__icon').addEventListener('mouseout', () => {
    menu.classList.remove('is-hovered')
  })
  menu.querySelector('.Menu__icon').addEventListener('click', () => {
    if (menu.classList.contains('is-active')) {
      // as active class is needed to adjust transition speed for black bubble when hovering vs when deactivating
      menu.classList.add('was-active')
      setTimeout(() => {
        menu.classList.remove('was-active')
      }, 1000)
      // remove is-active class
      menu.classList.remove('is-active')
    } else {
      menu.classList.add('is-active')
      menu.classList.remove('was-active')
    }
    menu.classList.remove('is-hovered')
  })
  // close menu on link click
  menu.querySelectorAll('.Menu__items a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (e.target.href.indexOf('#') > -1) {
        menu.classList.remove('is-active')
      }
    })
  })
}
//
responsiveMenu(document.querySelector('.Menu__overlay'))
