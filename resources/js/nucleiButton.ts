/* global HTMLElement CustomEvent */
'use strict'

declare const ShadyCSS // eslint-disable-line
let template = document.createElement('template')
template.innerHTML = `<style>
  :host{
    position: relative;
    cursor: pointer;
    line-height: 100%;
    font-family: var(--font-montserrat);
    font-weight: var(--font-montserrat-semibold);
    font-size: var(--size-l);
  }
  #button{
    display: block;
    position: relative;
    color: var(--nuclei-button-text-color, #fff);
    text-decoration: none;
    padding: 0;
    transition: transform .35s ease;
  }
  #background{
    display: block;
    top: 0;
    left: 0;
    position: absolute;
    background: var(--nuclei-button-color, var(--blue));
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  #text{
    display: inline-block;
    z-index: 10;
    position: relative;
    padding: 13px 16px;
  }
  #shadow{
    position: absolute;
    z-index: 0;
    width: calc(100% - 20px);
    left: 10px;
    height: 60%;
    background: var(--nuclei-button-color, var(--blue));
    bottom: 0;
    box-shadow: 0 5px 20px 0 var(--nuclei-button-color, var(--blue)),
                0 0px 5px 0 var(--nuclei-button-color, var(--blue)),
                0 0px 70px 0 var(--nuclei-button-color, var(--blue));
    border-radius: 5px;
    opacity: .5;
    transition: opacity .5s ease, box-shadow .5s ease, width .5s ease;
  }
  :host(:hover) #shadow{
    width: calc(100% - 10px);
    opacity: .75;
    box-shadow: 0 2px 10px 0 var(--nuclei-button-color, var(--blue)),
                0 0px 3px 0 var(--nuclei-button-color, var(--blue)),
                0 0px 50px 0 var(--nuclei-button-color, var(--blue));
  }
  :host(:hover) #button{
    transform: translateY(1px);
  }
  </style>
  <a id="button">
    <div id="text"><slot slot="text"></slot></div>
    <div id="background"></div>
    <div id="shadow"></div>
  </a>
  `

class nucleiButton extends HTMLElement { // eslint-disable-line no-unused-vars
  /* Typescript: declare variables */
  private _href: string = '' // eslint-disable-line no-undef
  private _rel: string = '' // eslint-disable-line no-undef
  private _target: string = '' // eslint-disable-line no-undef

  constructor () {
    // If you define a constructor, always call super() first!
    // This is specific to CE and required by the spec.
    super()
    // create shadowRoot
    let shadowRoot = this.attachShadow({mode: 'open'})
    // check if polyfill is used
    if (typeof ShadyCSS !== 'undefined') {
      ShadyCSS.prepareTemplate(template, 'nuclei-button') // eslint-disable-line no-undef
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
    return ['href', 'rel', 'target', 'disabled']
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
    let link = this.shadowRoot.querySelector('#button')
    link.setAttribute('href', this.href)
    link.setAttribute('target', this.target)
    link.setAttribute('rel', this.rel)
    // menuIcon on click
    // this.shadowRoot.querySelector('#menuIcon').addEventListener('click', this.toggleOverlay.bind(this))
  }
  /**
  * @method setter href
  * @description set the href property
   */
  set href (href: string) {
    if (this._href === href) return
    this._href = href
  }
  /**
   * @method getter href
   * @description get the href property
   */
  get href () {
    return this._href
  }
  /**
  * @method setter target
  * @description set the target property
   */
  set target (target: string) {
    if (this._target === target) return
    this._target = target
  }
  /**
   * @method getter target
   * @description get the target property
   */
  get target () {
    return this._target
  }
  /**
  * @method setter rel
  * @description set the rel property
   */
  set rel (rel: string) {
    if (this._rel === rel) return
    this._rel = rel
  }
  /**
   * @method getter rel
   * @description get the rel property
   */
  get rel () {
    return this._rel
  }
}

window.customElements.define('nuclei-button', nucleiButton)
