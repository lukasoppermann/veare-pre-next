function throttle (callback, limit) {
  let wait = false                 // Initially, we're not waiting
  return function () {              // We return a throttled function
    if (!wait) {                  // If we're not waiting
      callback.call()          // Execute users function
      wait = true               // Prevent future invocations
      setTimeout(function () {  // After a period of time
        wait = false         // And allow future invocations
      }, limit)
    }
  }
}

export class Menu { // eslint-disable-line no-unused-vars
  constructor (menuSelector) {
    this._menu = document.querySelector(menuSelector)
  }

  get instance () {
    return this._menu
  }

  transitionOnScroll () {
    let menu = this.instance
    let scrollDone

    let toggleClass = (posY) => {
      if (posY > 150) {
        menu.classList.add('is-hidden')
      } else {
        menu.classList.remove('is-hidden')
      }
    }

    document.addEventListener('scroll', throttle(function () {
      let posY = window.pageYOffset
      toggleClass(posY)

      scrollDone = (posY) => {
        if (posY === window.pageYOffset) {
          toggleClass(posY)
        } else {
          setTimeout(function () {
            scrollDone()
          }, 50)
        }
      }

      setTimeout(function () {
        scrollDone()
      }, 50)
    }, 20))
  }
}
