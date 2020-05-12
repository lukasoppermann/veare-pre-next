const responsiveMenu = menu => {
  /**
  * @method throttle
  * @description throttle function
   */
  const throttle = (callback: any, limit: number) => {
    let wait = false
    return function () {
      if (!wait) {
        callback.call()
        wait = true
        setTimeout(function () {
          wait = false
        }, limit)
      }
    }
  }
  /**
  * @method toggleExtendedOnY
  * @description toggle extended attribute when scrollPosY is bigger than this._thresholdY
   */
  const toggleExtended = () => {
    if (window.pageYOffset > 150) {
      return menu.removeAttribute('extended')
    }
    if (document.documentElement.clientWidth < 800) {
      return menu.removeAttribute('extended')
    }
    menu.setAttribute('extended', '')
  }
  /**
   * @method _hideOverlay
   * @description hides the overlay
   */
  const _hideOverlay = () => {
    // hide overlay
    menu.querySelector('#background').classList.remove('is-active')
    menu.classList.remove('is-active')

    setTimeout(() => {
      menu.removeAttribute('overlayVisible')
      document.body.style.overflow = 'auto'
    }, 300)
  }
  /**
   * @method toggleOverlay
   * @description everything tha happens when toggling the overlay
   */
  const toggleOverlay = () => {
    // show overlay
    if (!menu.hasAttribute('overlayVisible')) {
      document.body.style.overflow = 'hidden'
      menu.querySelector('#background').classList.add('is-active')
      menu.classList.add('is-active')
      menu.setAttribute('overlayVisible', '')
    } else {
      _hideOverlay()
    }
  }
  // hide / show on scroll
  let scrollEnded
  document.addEventListener('scroll', throttle(function () {
    toggleExtended()
    // scrollEnded
    clearTimeout(scrollEnded)
    scrollEnded = setTimeout(() => {
      toggleExtended()
    }, 300)
  }, 20))
  // re-evaluate on resize
  window.addEventListener('resize', throttle(function () {
    toggleExtended()
  }, 20))
  // add click event to menuIcon
  menu.querySelector('.Menu__icon').addEventListener('mouseover', () => {
    console.debug('over')
    menu.classList.add('is-hovered')
  })
  menu.querySelector('.Menu__icon').addEventListener('mouseout', () => {
    console.debug('out')
    menu.classList.remove('is-hovered')
  })
  menu.querySelector('#menuIcon').addEventListener('click', toggleOverlay)
  // close menu on link click
  menu.querySelectorAll('.responsive-menu__item').forEach(link => {
    link.addEventListener('click', (e) => {
      if (e.target.href.indexOf('#') > -1) {
        _hideOverlay()
      }
    })
  })
  // init
  toggleExtended()
}
//
responsiveMenu(document.querySelector('.Menu'))
