/* global HTMLElement CustomEvent */
'use strict'

declare const ShadyCSS // eslint-disable-line no-unused-vars
let template = document.createElement('template')
template.innerHTML = `<style>
  :host{
    pointer-events: none;
    display: flex;
    position: fixed;
    justify-content: flex-end;
    top: 0;
    left: 0;
    z-index: 990;
    transform: translateZ(100px); /* safari hack */
    width: 100vw;
    height: 66px;
  }
  /*Firefox bug: responsive-menu > [slot="items"]*/
  nav [slot="items"],
  ::slotted([slot="items"]){
    pointer-events: auto;
    padding: var(--size-xl, 20px) var(--size-s, 10px) var(--size-m, 10px);
    margin: 0 var(--size-xs);
    text-decoration: none;
    text-transform: uppercase;
    overflow: hidden;
    position: relative;
    font-size: var(--size-l);
    font-family: var(--sans-serif);
    font-weight: var(--sans-serif-bold);
  }
  nav{
    display: flex;
    position: absolute;
    height: 66px;
    top: -66px;
    right: 0;
    opacity: 0;
    transition-property: opacity, top;
    transition-duration: .35s;
  }
  :host([extended]) nav{
    top: 0;
    opacity: 1;
  }
  .o-nav.is-hidden .o-nav__icon{
    display: flex;
    top: 30px;
    padding-right: 10px;
  }
  .o-nav__icon svg {
    width: 60px;
    height: 60px;
    transform: translate3d(4px, 0, 0);
  }
  #info{
    display: none;
  }
  </style>
  <div id="info">
    <slot name="info"></slot>
  </div>
  <nav>
    <slot name="items"></slot>
  </nav>
  `

class ResponsiveMenu extends HTMLElement { // eslint-disable-line no-unused-vars
  /* Typescript: declare variables */
  private _thresholdY: number = 150 // eslint-disable-line no-undef

  constructor () {
    // If you define a constructor, always call super() first!
    // This is specific to CE and required by the spec.
    super()
    // create shadowRoot
    let shadowRoot = this.attachShadow({mode: 'open'})
    // check if polyfill is used
    if (typeof ShadyCSS !== 'undefined') {
      ShadyCSS.prepareTemplate(template, 'responsive-menu') // eslint-disable-line no-undef
      // apply css polyfill
      ShadyCSS.styleElement(this) // eslint-disable-line no-undef
    }
    // add content to shadowRoot
    shadowRoot.appendChild(document.importNode(template.content, true))
  }
  /**
  * @method observedAttributes
  * @description return attributes that should be watched for updates
   */
  static get observedAttributes () {
    return []
  }
  /**
  * @method observedAttributes
  * @description return attributes that should be watched for updates
   */
  attributeChangedCallback (attrName: string, oldVal: any, newVal: any) { // eslint-disable-line no-unused-vars
    this[attrName] = newVal
  }

  /**
  * @method connectedCallback
  * @description When element is added to DOM
   */
  connectedCallback () {
    // initial run
    this.toggleClassOnY(window.pageYOffset)
    // onScrollEvent
    this.transitionOnScroll()
  }
  /**
  * @method throttle
  * @description throttle function
   */
  throttle (callback: any, limit: number) {
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
  * @method transitionOnScroll
  * @description transitioning the menu when scrolling past a specified point
   */
  transitionOnScroll () {
    let posY = window.pageYOffset

    document.addEventListener('scroll', this.throttle(function () {

      if(Math.abs(posY - window.pageYOffset) > 4) {
        this.toggleClassOnY(window.pageYOffset)
      }

    }.bind(this), 20))
  }
  /**
  * @method toggleClassOnY
  * @description toggle class when scrollPosY is bigger than this._thresholdY
   */
  toggleClassOnY (posY) {
    if (posY > this._thresholdY) {
      return this.removeAttribute('extended')
    }
    this.setAttribute('extended', '')
  }
}

window.customElements.define('responsive-menu', ResponsiveMenu)
