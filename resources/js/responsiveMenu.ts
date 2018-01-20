/* global HTMLElement CustomEvent */
'use strict'

// import { shape, timeline, render, play } from 'wilderness'

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
    color: inherit;
    pointer-events: auto;
    padding: var(--size-xl, 20px) var(--size-s, 10px) var(--size-m, 10px);
    margin: 0 var(--size-xs);
    text-decoration: none;
    text-transform: uppercase;
    overflow: hidden;
    position: relative;
    font-size: var(--size-l);
    font-family: var(--font-montserrat);
    font-weight: var(--font-montserrat-bold);
    transition: color .35s var(--easeInOutQuad);
  }
  nav [slot="items"]:hover,
  ::slotted([slot="items"]:hover){
    color: var(--black);
  }
  nav [slot="items"]:before,
  ::slotted([slot="items"])::before{
    display: block;
    content: "";
    position: absolute;
    width: 0;
    height: 7px;
    top: calc(50% + 5px);
    transform: translateY(-50%);
    left: -4px;
    z-index: -1;
    opacity: 1;
    background-color: var(--veare-orange);
    transition: width .35s var(--easeInOutQuad);
  }
  nav [slot="items"]:hover:before,
  ::slotted([slot="items"]:hover)::before,
  nav [slot="items"]:focus:before,
  ::slotted([slot="items"]:focus)::before{
    width: calc(100% + 8px);
  }
  footer [slot="footer"],
  ::slotted([slot="footer"]){
    color: rgba(var(--white-rgb), .6) !important;
    position: relative;
    display: inline-block;
    font-size: 16px;
    text-decoration: none;
    padding: var(--size-m, 10px) var(--size-s, 10px);
    margin: 0;
    transition: color .35s var(--easeInOutQuad);
  }
  footer [slot="footer"]:hover,
  ::slotted([slot="footer"]:hover){
    color: var(--white) !important;
  }
  nav{
    display: flex;
    position: absolute;
    z-index: 10;
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
  #menuIcon {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 100;
    pointer-events: all;
    cursor: pointer;
    width: 60px;
    height: 60px;
    transform: translate3d(4px, 0, 0);
  }
  #menuIcon path, :host([extended][overlayvisible]) #menuIcon path{
    fill: none;
    stroke-width: 40px;
    stroke: var(--responsive-menu-menu-icon, rgb(33,37,41));
    stroke-dashoffset: 0;
    opacity: 1;
    transition: opacity .5s .2s ease, stroke-dashoffset .5s .2s ease, stroke .3s ease;
  }
  :host([extended]) #menuIcon path {
    transition: stroke-dashoffset 0.5s cubic-bezier(0.25, -0.25, 0.75, 1.25), stroke-dasharray 0.5s cubic-bezier(0.25, -0.25, 0.75, 1.25), stroke .3s ease;
    stroke-dashoffset: 240px;
    opacity: 0;
  }
  #menuIcon path#top,
  #menuIcon path#bottom {
    stroke-dasharray: 270px 950px;
  }
  #menuIcon path#middle {
    stroke-dasharray: 270px 270px;
  }
  :host([overlayVisible]) #menuIcon path#top,
  :host([overlayVisible]) #menuIcon path#bottom {
    stroke-dashoffset: -666px;
  }
  :host([overlayVisible]) #menuIcon path#middle {
    stroke-dashoffset: -270px;
  }
  :host([overlayVisible]) #menuIcon path{
    stroke: var(--responsive-menu-close-icon, rgb(255,255,255));
  }
  :host([overlayVisible]){
    height: 100%;
  }
  :host([overlayVisible]) nav{
    flex-direction: column;
    align-items: flex-start;
    height: 100%;
    width: 30%;
    min-width: 300px;
    opacity: 0;
    padding-top: var(--size-xl);
  }
  :host(.is-active) nav{
    opacity: 1;
    top: 0;
  }
  /*Firefox bug: responsive-menu > [slot="items"]*/
  :host([overlayVisible]) nav [slot="items"],
  :host([overlayVisible]) ::slotted([slot="items"]){
    font-size: var(--size-xl);
    color: rgba(var(--white-rgb), .75) !important;
  }
  :host([overlayVisible]) nav [slot="items"]:hover,
  :host([overlayVisible]) ::slotted([slot="items"]:hover){
    color: rgba(var(--white-rgb), 1) !important;
  }
  :host([overlayVisible]) nav [slot="items"]:before,
  :host([overlayVisible]) ::slotted([slot="items"])::before{
    background-color: rgba(var(--black-rgb), .5);
  }
  #info{
    display: flex;
    justify-content: center;
    flex-direction: column;
    pointer-events: none;
    position: absolute;
    z-index: 10;
    opacity: 0;
    bottom: -50px;
    left: 0;
    transition: bottom .3s ease, opacity .3s ease;
    width: 70%;
    height: 100%;
    max-width: calc(100% - 300px);
    background: rgb(255,255,255);
  }
  :host([overlayVisible]) #info{
    opacity: 0;
    bottom: -50px;
    pointer-events: all;
    transition: bottom .3s ease, opacity .3s ease;
  }
  :host(.is-active) #info{
    opacity: 1;
    bottom: 0px;
    transition: bottom .3s ease, opacity .3s ease;
  }
  @media(max-width: 700px){
    :host([overlayVisible]) #info{
      display: none;
    }
  }
  #background{
    z-index: 1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    transition: background-color .3s ease;
  }
  #background.is-active{
    background-color: var(--blue);
  }
  footer{
    display: none;
    pointer-events: all;
  }
  :host([overlayVisible]) footer{
    display: block;
    position: absolute;
    right: 0;
    bottom: -50px;
    z-index: 10;
    height: 50px;
    width: calc(30% - 2 * var(--size-xs));
    min-width: calc(300px - 2 * var(--size-xs));
    opacity: 0;
    margin: 0 var(--size-xs);
    transition: bottom .3s ease, opacity .3s ease;
  }
  :host(.is-active) footer{
    bottom: 0;
    opacity: 1;
  }
  </style>
  <svg id="menuIcon" viewBox="0 0 800 500">
    <path d="M270,220 C300,220 520,220 540,220 C740,220 640,540 520,420 C440,340 300,200 300,200" id="top"></path>
    <path d="M270,320 L540,320" id="middle"></path>
    <path d="M270,210 C300,210 520,210 540,210 C740,210 640,530 520,410 C440,330 300,190 300,190" id="bottom" transform="translate(480, 320) scale(1, -1) translate(-480, -318) "></path>
  </svg>
  <div id="info">
    <slot name="info"></slot>
    <slot name="infoBackground"></slot>
  </div>
  <nav>
    <slot name="items"></slot>
    <slot name="navBackground"></slot>
  </nav>
  <footer>
    <slot name="footer"></slot>
  </footer>
  <div id="background">
    <slot name="background"></slot>
  </div>
  `

class ResponsiveMenu extends HTMLElement { // eslint-disable-line no-unused-vars
  /* Typescript: declare variables */
  private _thresholdY: number = 150 // eslint-disable-line no-undef
  private _collpaseSize: number = 700 // eslint-disable-line no-undef
  private _animateOverlayBg: boolean = true // eslint-disable-line no-undef
  private _hideOverlayDelay: number = 300 // eslint-disable-line no-undef

  constructor () {
    // If you define a constructor, always call super() first!
    // This is specific to CE and required by the spec.
    super()
    // create shadowRoot
    let shadowRoot = this.attachShadow({mode: 'open', delegatesFocus: false})
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
    return ['thresholdY', 'collpaseSize', 'hideOverlayDelay', 'animateOverlayBg']
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
    this.toggleExtended()
    // onScrollEvent
    let scrollEnded
    document.addEventListener('scroll', this.throttle(function () {
      this.toggleExtended()
      // scrollEnded
      clearTimeout(scrollEnded)
      scrollEnded = setTimeout(() => {
        this.toggleExtended()
      }, 300)
    }.bind(this), 20))
    // onResizeEvent
    window.addEventListener('resize', this.throttle(function () {
      this.toggleExtended()
    }.bind(this), 20))
    // menuIcon on click
    this.shadowRoot.querySelector('#menuIcon').addEventListener('click', this.toggleOverlay.bind(this))
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
  * @method toggleExtendedOnY
  * @description toggle extended attribute when scrollPosY is bigger than this._thresholdY
   */
  toggleExtended () {
    if (window.pageYOffset > this._thresholdY) {
      return this.removeAttribute('extended')
    }
    if(document.documentElement.clientWidth < this.collpaseSize) {
      return this.removeAttribute('extended')
    }
    this.setAttribute('extended', '')
  }
  /**
  * @method setter thresholdY
  * @description set the thresholdY property
   */
  set thresholdY (thresholdY: number) {
    if (this._thresholdY === thresholdY) return
    this._thresholdY = thresholdY
  }
  /**
   * @method getter thresholdY
   * @description get the thresholdY property
   */
  get thresholdY () {
    return this._thresholdY
  }
  /**
  * @method setter collpaseSize
  * @description set the collpaseSize property
   */
  set collpaseSize (collpaseSize: number) {
    if (this._collpaseSize === collpaseSize) return
    this._collpaseSize = collpaseSize
  }
  /**
   * @method getter collpaseSize
   * @description get the collpaseSize property
   */
  get collpaseSize () {
    return this._collpaseSize
  }
  /**
  * @method setter hideOverlayDelay
  * @description set the hideOverlayDelay property
   */
  set hideOverlayDelay (hideOverlayDelay: number) {
    if (this._hideOverlayDelay === hideOverlayDelay) return
    this._hideOverlayDelay = hideOverlayDelay
  }
  /**
   * @method getter hideOverlayDelay
   * @description get the hideOverlayDelay property
   */
  get hideOverlayDelay () {
    return this._hideOverlayDelay
  }
  /**
  * @method setter animateOverlayBg
  * @description set the animateOverlayBg property
   */
  set animateOverlayBg (animateOverlayBg: boolean) {
    if (this._animateOverlayBg === animateOverlayBg) return
    this._animateOverlayBg = animateOverlayBg
  }
  /**
   * @method getter animateOverlayBg
   * @description get the animateOverlayBg property
   */
  get animateOverlayBg () {
    return this._animateOverlayBg
  }
  /**
   * @method toggleOverlay
   * @description everything tha happens when toggling the overlay
   */
  toggleOverlay () {
    // show overlay
    if (! this.hasAttribute('overlayVisible')) {
      this.dispatchEvent(new CustomEvent('toggleOverlay', { detail: { visible: true } } ))
      document.body.style.overflow = 'hidden'
      if (this._animateOverlayBg === true) {
        this.shadowRoot.querySelector('#background').classList.add('is-active')
      }
      this.classList.add('is-active')
      return this.setAttribute('overlayVisible', '')
    }
    // hide overlay
    this.dispatchEvent(new CustomEvent('toggleOverlay', { detail: { visible: false } } ))
    if (this._animateOverlayBg === true) {
      this.shadowRoot.querySelector('#background').classList.remove('is-active')
    }
    this.classList.remove('is-active')

    setTimeout(() => {
      this.removeAttribute('overlayVisible')
      document.body.style.overflow = 'auto'
    }, this.hideOverlayDelay)
  }
}

window.customElements.define('responsive-menu', ResponsiveMenu)
