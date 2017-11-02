/* global HTMLElement CustomEvent */
'use strict'

declare const ShadyCSS // eslint-disable-line no-unused-vars
let template = document.createElement('template')
template.innerHTML = `<style>

  </style>
  Hello: <slot></slot>`

class ResponsiveMenu extends HTMLElement { // eslint-disable-line no-unused-vars
  /* Typescript: declare variables */
  private _name: string = '' // eslint-disable-line no-undef

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
    return ['name']
  }
  /**
  * @method observedAttributes
  * @description return attributes that should be watched for updates
   */
  attributeChangedCallback (attrName: string, oldVal, newVal) {
    this[attrName] = newVal
  }

  /**
  * @method connectedCallback
  * @description When element is added to DOM
   */
  connectedCallback () {
    this.shadowRoot.querySelector('#name').addEventListener('click', this.onClick.bind(this))
  }
  /**
  * @method setter name
  * @description set the name property
   */
  set name (name: string) {
    if (this._name === name) return
    this._name = name

    this.shadowRoot.querySelector('#name').innerHTML = name
  }
  /**
  * @method getter name
  * @description get the name property
   */
  get name () {
    return this._name
  }
  /**
  * @method onClick
  * @description react to click event
   */
  onClick (e: object) {
    this.dispatchEvent(new CustomEvent('name-clicked', {
      detail: { name: this.shadowRoot.querySelector('#name').innerHTML }, bubbles: false
    }))
  }
}

window.customElements.define('responsive-menu', ResponsiveMenu)
