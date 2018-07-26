(function () {
    'use strict';

    /* global HTMLElement CustomEvent pageSection */
    let template = document.createElement('template');
    template.innerHTML = `<style>
  :host{
    display: flex;
    flex-direction: column;
    flex: 0 1 auto;
    box-sizing: border-box;
    width: 100%;
    height: auto;
    min-height: 100vh;
    align-self: center;
  }
</style>
<slot></slot>
`;
    class PageSections extends HTMLElement {
        constructor() {
            // If you define a constructor, always call super() first!
            // This is specific to CE and required by the spec.
            super();
            // create shadowRoot
            let shadowRoot = this.attachShadow({ mode: 'open' });
            // check if polyfill is used
            if (typeof ShadyCSS !== 'undefined') {
                ShadyCSS.prepareTemplate(template, 'page-sections'); // eslint-disable-line no-undef
                // apply css polyfill
                ShadyCSS.styleElement(this); // eslint-disable-line no-undef
            }
            // add content to shadowRoot
            shadowRoot.appendChild(document.importNode(template.content, true));
            // setup scroll event to check for active elements
            let element = this;
            let fn;
            window.addEventListener('scroll', function () {
                clearTimeout(fn);
                fn = setTimeout(function () {
                    element.setActiveState();
                }, 10);
            });
        }
        /**
        * @method connectedCallback
        * @description When element is added to DOM
         */
        connectedCallback() {
            let element = this;
            // initialize activated state
            setTimeout(function () {
                element.setActiveState();
            }, 1);
        }
        /**
         * @method setActiveState
         * @description set _active property & add/remove active attr
         */
        setActiveState() {
            if (this._inView) {
                this._setActive();
                // Get all child elements and activate visible ones
                // stop once an inactive item follows an active item
                Array.prototype.slice.call(this.querySelectorAll('page-section')).map(function (item, index, array) {
                    item.parent = item;
                    item.setActiveState();
                    // abort if current element is NOT in view, but previous was in view
                    // if (index > 0 && !item.hasAttribute('active') && array[index - 1].hasAttribute('active')) {
                    //   return
                    // }
                });
            }
            else {
                this._setUnactive();
            }
        }
        /**
         * @method next
         * @description jump to next page section
         */
        next() {
            let next = this.getActiveSection().nextElementSibling;
            while (next !== null && next.isPageSection !== true) {
                next = next.nextElementSibling;
            }
            if (next !== null && next.isPageSection) {
                next.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
            }
        }
        /**
         * @method previous
         * @description jump to previous page section
         */
        previous() {
            let previous = this.getActiveSection(true).previousElementSibling;
            while (previous !== null && previous.isPageSection !== true) {
                previous = previous.previousElementSibling;
            }
            if (previous !== null && previous.isPageSection) {
                previous.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
            }
        }
        /**
         * @method goTo
         * @description jump to specified page section
         */
        goTo(sectionName) {
            // get desired section
            let section = this.querySelector('page-section[name=' + sectionName + ']');
            // abort if section doesn't exists or is already active
            if (!section || section.hasAttribute('active'))
                return;
            // otherwise move to section
            section.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
        /**
         * @method getActiveSection
         * @description get the current active section from within this element
         * @param top (default: false) if true, the first active section will be returned, else the last
         */
        getActiveSection(top = false) {
            let activeItems = Array.from(this.querySelectorAll('page-section[active]'));
            if (top === false) {
                return activeItems[activeItems.length - 1];
            }
            return activeItems[0];
        }
        /**
         * @method getter isPageSections
         * @description tells that it is a isPageSections
         */
        get isPageSections() {
            return true;
        }
        /**
         * _setActive
         */
        _setActive() {
            if (this.hasAttribute('active'))
                return;
            // set attribute
            this.setAttribute('active', '');
            // Dispatch the event.
            this.dispatchEvent(new CustomEvent('activated'));
        }
        /**
         * _setUnactive
         */
        _setUnactive() {
            // set 'wasActivated' attribute, if element was active
            if (this.hasAttribute('active') && !this.hasAttribute('activated')) {
                this.setAttribute('activated', '');
            }
            // remove 'active' attribute
            this.removeAttribute('active');
            // Dispatch the event.
            this.dispatchEvent(new CustomEvent('deactivated'));
        }
        /**
         * @method _inView
         * @description check if element is in view
         */
        get _inView() {
            return this.getBoundingClientRect().bottom > 0 && this.getBoundingClientRect().top < window.innerHeight;
        }
        /**
         * @method _activateSection
         * @description fire activateSection event
         */
        _activateSection(section) {
            // dispatch event
            this.dispatchEvent(new CustomEvent('activateSection', {
                detail: {
                    section: section,
                    sectionName: section.getAttribute('name'),
                    sectionIndex: Array.from(this.querySelectorAll('page-section')).findIndex((item) => item === section)
                }
            }));
        }
        /**
         * @method _deactivateSection
         * @description fire deactivateSection event
         */
        _deactivateSection(section) {
            // dispatch event
            this.dispatchEvent(new CustomEvent('deactivateSection', {
                detail: {
                    section: section,
                    sectionName: section.getAttribute('name'),
                    sectionIndex: Array.from(this.querySelectorAll('page-section')).findIndex((item) => item === section)
                }
            }));
        }
    }

    /* global HTMLElement CustomEvent pageSections */
    let template$1 = document.createElement('template');
    template$1.innerHTML = `<style>
    :host{
      position: relative;
      display: flex;
      flex-direction: column;
      flex: 0 1 auto;
      box-sizing: border-box;
      height: auto;
      align-self: auto;
    }
    :host([fullscreen]){
      min-height: 100vh;
    }
    :host([centered]){
      align-items: stretch;
      flex-direction: row;
      justify-content: center;
    }
    :host([centered]) > #content{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1 1 auto;
    }
    #content{
      position: relative;
      width: var(--page-section-width, auto);
      height: var(--page-section-height, auto);
      min-width: var(--page-section-min-width, auto);
      min-height: var(--page-section-min-height, auto);
      max-width: var(--page-section-max-width, auto);
      max-height: var(--page-section-max-height, auto);
    }
  </style>
  <div id="content">
    <slot></slot>
  </div>
`;
    class PageSection extends HTMLElement {
        constructor() {
            // If you define a constructor, always call super() first!
            // This is specific to CE and required by the spec.
            super();
            this._fullscreen = false; // eslint-disable-line no-undef
            this._maxwidth = null; // eslint-disable-line no-undef
            this._minwidth = null; // eslint-disable-line no-undef
            this._width = null; // eslint-disable-line no-undef
            // create shadowRoot
            let shadowRoot = this.attachShadow({ mode: 'open' });
            // check if polyfill is used
            if (typeof ShadyCSS !== 'undefined') {
                ShadyCSS.prepareTemplate(template$1, 'page-section'); // eslint-disable-line no-undef
                // apply css polyfill
                ShadyCSS.styleElement(this); // eslint-disable-line no-undef
            }
            // add content to shadowRoot
            shadowRoot.appendChild(document.importNode(template$1.content, true));
        }
        /**
        * @method connectedCallback
        * @description When element is added to DOM
         */
        connectedCallback() {
            // get the parent page-sections element
        }
        /**
        * @method observedAttributes
        * @description return attributes that should be watched for updates
         */
        static get observedAttributes() {
            return ['src', 'fullscreen', 'maxwidth', 'minwidth', 'width'];
        }
        /**
        * @method observedAttributes
        * @description return attributes that should be watched for updates
         */
        attributeChangedCallback(attrName, oldVal, newVal) {
            this[attrName] = newVal;
        }
        /**
         * @method _inView
         * @description check if element is in view
         */
        get _inView() {
            // minimum visible percent of the element to be considered active
            var minVisible = Math.min(1, (parseFloat(this.getAttribute('requiredVisible')) || parseFloat(this.parent.getAttribute('requiredVisible')) || 0.6)); // eslint-disable-line no-undef
            // px value of element that can be hidden
            var requiredVisiblePx = minVisible * Math.min(this.getBoundingClientRect().height, window.innerHeight);
            // calculate visible height
            var visibleHeight = this.getBoundingClientRect().height;
            // substract part that is outside screen to top
            visibleHeight += Math.min(0, this.getBoundingClientRect().top);
            // substract part that is outside screen to bottom
            visibleHeight -= Math.max(0, (this.getBoundingClientRect().bottom - window.innerHeight));
            // return if element is visible or not
            return visibleHeight >= requiredVisiblePx;
        }
        /**
         * @method setActiveState
         * @description set active if in viewport or unactive if not
         */
        setActiveState() {
            if (this._inView) {
                this._setActive();
            }
            else {
                this._setUnactive();
            }
        }
        /**
         * _setActive
         */
        _setActive() {
            if (this.hasAttribute('active'))
                return;
            this._parent()._activateSection(this);
            // set attribute
            this.setAttribute('active', '');
            // Dispatch the event.
            this.dispatchEvent(new CustomEvent('activated'));
        }
        /**
         * @method _parent
         * @description return the parent page-sections element
         */
        _parent() {
            let parent = this.closest('page-sections');
            // abort if no parent found
            if (parent === null)
                return null;
            return parent;
        }
        /**
         * _setUnactive
         */
        _setUnactive() {
            this._parent()._deactivateSection(this);
            // set 'activated' attribute, if element was active
            if (this.hasAttribute('active') && !this.hasAttribute('activated')) {
                this.setAttribute('activated', '');
            }
            // remove 'active' attribute
            this.removeAttribute('active');
            // Dispatch the event.
            this.dispatchEvent(new CustomEvent('deactivated'));
        }
        /**
        * @method setter fullscreen
        * @description set the fullscreen property
         */
        set fullscreen(fullscreen) {
            if (this._fullscreen === this._isTruthy(fullscreen))
                return;
            this._fullscreen = this._isTruthy(fullscreen);
            if (this._fullscreen) {
                this.setAttribute('fullscreen', '');
            }
            else {
                this.removeAttribute('fullscreen');
            }
        }
        /**
         * @method getter fullscreen
         * @description get the fullscreen property
         */
        get fullscreen() {
            return this._fullscreen;
        }
        /**
        * @method setter maxwidth
        * @description set the maxwidth property
         */
        set maxwidth(maxwidth) {
            if (this._maxwidth === maxwidth)
                return;
            this._maxwidth = maxwidth;
            let contentElement = this.shadowRoot.querySelector('#content');
            if (this._maxwidth !== null && this._maxwidth !== 'none') {
                contentElement.style.maxWidth = maxwidth;
                this.setAttribute('maxWidth', maxwidth);
            }
            else {
                contentElement.style.maxWidth = 'auto';
                this.removeAttribute('maxWidth');
            }
        }
        /**
         * @method getter maxwidth
         * @description get the maxwidth property
         */
        get maxwidth() {
            return this._maxwidth;
        }
        /**
        * @method setter minwidth
        * @description set the minwidth property
         */
        set minwidth(minwidth) {
            if (this._minwidth === minwidth)
                return;
            this._minwidth = minwidth;
            let contentElement = this.shadowRoot.querySelector('#content');
            if (this._minwidth !== null && this._minwidth !== 'none') {
                contentElement.style.minWidth = minwidth;
                this.setAttribute('minWidth', minwidth);
            }
            else {
                contentElement.style.minWidth = 'auto';
                this.removeAttribute('minWidth');
            }
        }
        /**
         * @method getter minwidth
         * @description get the minwidth property
         */
        get minwidth() {
            return this._minwidth;
        }
        /**
        * @method setter width
        * @description set the width property
         */
        set width(width) {
            if (this._width === width)
                return;
            this._width = width;
            let contentElement = this.shadowRoot.querySelector('#content');
            if (this._width !== null && this._width !== 'none') {
                contentElement.style.width = width;
                this.setAttribute('width', width);
            }
            else {
                contentElement.style.width = 'auto';
                this.removeAttribute('width');
            }
        }
        /**
         * @method getter width
         * @description get the width property
         */
        get width() {
            return this._width;
        }
        /**
         * @method _isTruthy
         * @description returns true if value is truthy or empty
         */
        _isTruthy(value) {
            if (value === true || value === 'true' || value === '') {
                return true;
            }
            return false;
        }
        /**
         * @method getter isPageSection
         * @description tells that it is a isPageSection
         */
        get isPageSection() {
            return true;
        }
    }

    window.customElements.define('page-sections', PageSections);
    window.customElements.define('page-section', PageSection);

}());
