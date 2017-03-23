(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
    (i[r].q = i[r].q || []).push(arguments);
  }, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m);
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-7074034-1', 'auto', { 'allowLinker': true });
ga('require', 'linker');
ga('linker:autoLink', ['veare.de', 'lukasoppermann.com', 'lukasoppermann.de', 'lukas-oppermann.de']);
ga('require', 'linkid');
ga('set', 'anonymizeIp', true);
ga('send', 'pageview');
function ready(fn) {
	if (document.readyState != 'loading') {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}
// -----------------------
// open sidebar
ready(function () {
	document.querySelector('#menu_icon').addEventListener('click', function (e) {
		var $body = document.querySelector('body');
		if ($body.classList.contains('menu-active')) {
			$body.classList.remove('menu-active');
		} else {
			$body.classList.add('menu-active');
		}
	});
});
"use strict";

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
	return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
	return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _templateObject = _taggedTemplateLiteral(["<style>\n\t\t\t\t      :host{\n\t\t\t\t        display: flex;\n\t\t\t\t        flex-direction: column;\n\t\t\t\t        flex-wrap: nowrap;\n\t\t\t\t      }\n\t\t\t\t    </style>\n\t\t\t\t    <slot></slot>\n\t\t\t\t  "], ["<style>\n\t\t\t\t      :host{\n\t\t\t\t        display: flex;\n\t\t\t\t        flex-direction: column;\n\t\t\t\t        flex-wrap: nowrap;\n\t\t\t\t      }\n\t\t\t\t    </style>\n\t\t\t\t    <slot></slot>\n\t\t\t\t  "]),
    _templateObject2 = _taggedTemplateLiteral(["<style>\n\t\t\t\t      :host{\n\t\t\t\t          display: inline-block;\n\t\t\t\t          flex: 0 1 auto;\n\t\t\t\t      }\n\t\t\t\t      :host(:not([flexible])){\n\t\t\t\t          box-sizing: border-box;\n\t\t\t\t          width: 100%;\n\t\t\t\t          min-height: 100vh;\n\t\t\t\t      }\n\t\t\t\t      :host([flexible]){\n\t\t\t\t          margin-left: 50%;\n\t\t\t\t          transform: translateX(-50%);\n\t\t\t\t      }\n\t\t\t\t    </style>\n\t\t\t\t    <slot></slot>\n\t\t\t\t  "], ["<style>\n\t\t\t\t      :host{\n\t\t\t\t          display: inline-block;\n\t\t\t\t          flex: 0 1 auto;\n\t\t\t\t      }\n\t\t\t\t      :host(:not([flexible])){\n\t\t\t\t          box-sizing: border-box;\n\t\t\t\t          width: 100%;\n\t\t\t\t          min-height: 100vh;\n\t\t\t\t      }\n\t\t\t\t      :host([flexible]){\n\t\t\t\t          margin-left: 50%;\n\t\t\t\t          transform: translateX(-50%);\n\t\t\t\t      }\n\t\t\t\t    </style>\n\t\t\t\t    <slot></slot>\n\t\t\t\t  "]);

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof2(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _CustomElement() {
	return Reflect.construct(HTMLElement, [], this.__proto__.constructor);
}

;
Object.setPrototypeOf(_CustomElement.prototype, HTMLElement.prototype);
Object.setPrototypeOf(_CustomElement, HTMLElement);

function _taggedTemplateLiteral(strings, raw) {
	return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}

// This file was generated by modules-webmake (modules for web) project.
// See: https://github.com/medikoo/modules-webmake

(function (modules) {
	'use strict';

	var _resolve,
	    getRequire,
	    wmRequire,
	    notFoundError,
	    findFile,
	    extensions = { ".js": [], ".json": [], ".css": [], ".html": [] },
	    envRequire = typeof require === 'function' ? require : null;

	notFoundError = function notFoundError(path) {
		var error = new Error("Could not find module '" + path + "'");
		error.code = 'MODULE_NOT_FOUND';
		return error;
	};
	findFile = function findFile(scope, name, extName) {
		var i, ext;
		if (typeof scope[name + extName] === 'function') return name + extName;
		for (i = 0; ext = extensions[extName][i]; ++i) {
			if (typeof scope[name + ext] === 'function') return name + ext;
		}
		return null;
	};
	_resolve = function resolve(scope, tree, path, fullPath, state, id) {
		var name, dir, exports, module, fn, found, ext;
		path = path.split('/');
		name = path.pop();
		if (name === '.' || name === '..') {
			path.push(name);
			name = '';
		}
		while ((dir = path.shift()) != null) {
			if (!dir || dir === '.') continue;
			if (dir === '..') {
				scope = tree.pop();
				id = id.slice(0, id.lastIndexOf('/'));
			} else {
				tree.push(scope);
				scope = scope[dir];
				id += '/' + dir;
			}
			if (!scope) throw notFoundError(fullPath);
		}
		if (name && typeof scope[name] !== 'function') {
			found = findFile(scope, name, '.js');
			if (!found) found = findFile(scope, name, '.json');
			if (!found) found = findFile(scope, name, '.css');
			if (!found) found = findFile(scope, name, '.html');
			if (found) {
				name = found;
			} else if (state !== 2 && _typeof(scope[name]) === 'object') {
				tree.push(scope);
				scope = scope[name];
				id += '/' + name;
				name = '';
			}
		}
		if (!name) {
			if (state !== 1 && scope[':mainpath:']) {
				return _resolve(scope, tree, scope[':mainpath:'], fullPath, 1, id);
			}
			return _resolve(scope, tree, 'index', fullPath, 2, id);
		}
		fn = scope[name];
		if (!fn) throw notFoundError(fullPath);
		if (fn.hasOwnProperty('module')) return fn.module.exports;
		exports = {};
		fn.module = module = { exports: exports, id: id + '/' + name };
		fn.call(exports, exports, module, getRequire(scope, tree, id));
		return module.exports;
	};
	wmRequire = function wmRequire(scope, tree, fullPath, id) {
		var name,
		    path = fullPath,
		    t = fullPath.charAt(0),
		    state = 0;
		if (t === '/') {
			path = path.slice(1);
			scope = modules['/'];
			if (!scope) {
				if (envRequire) return envRequire(fullPath);
				throw notFoundError(fullPath);
			}
			id = '/';
			tree = [];
		} else if (t !== '.') {
			name = path.split('/', 1)[0];
			scope = modules[name];
			if (!scope) {
				if (envRequire) return envRequire(fullPath);
				throw notFoundError(fullPath);
			}
			id = name;
			tree = [];
			path = path.slice(name.length + 1);
			if (!path) {
				path = scope[':mainpath:'];
				if (path) {
					state = 1;
				} else {
					path = 'index';
					state = 2;
				}
			}
		}
		return _resolve(scope, tree, path, fullPath, state, id);
	};
	getRequire = function getRequire(scope, tree, id) {
		return function (path) {
			return wmRequire(scope, [].concat(tree), path, id);
		};
	};
	return getRequire(modules, [], '');
})({
	"page-sections": {
		"src": {
			"make-template.js": function makeTemplateJs(exports, module, require) {
				var makeTemplate = function makeTemplate(strings) {
					var html = '';

					for (var _len = arguments.length, substs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
						substs[_key - 1] = arguments[_key];
					}

					for (var i = 0; i < substs.length; i++) {
						html += strings[i];
						html += substs[i];
					}
					html += strings[strings.length - 1];
					var template = document.createElement('template');
					template.innerHTML = html;
					return template;
				};
				/**
     * export make template function
     */
				module.exports = makeTemplate;
			},
			"page-section-container.js": function pageSectionContainerJs(exports, module, require) {
				/* global HTMLElement CustomEvent Event */
				(function () {
					var makeTemplate = require('./make-template');
					var template = makeTemplate(_templateObject);

					var PageSections = function (_CustomElement2) {
						_inherits(PageSections, _CustomElement2);

						function PageSections() {
							_classCallCheck(this, PageSections);

							// create shadowRoot
							var _this = _possibleConstructorReturn(this, (PageSections.__proto__ || Object.getPrototypeOf(PageSections)).call(this));
							// If you define a ctor, always call super() first!
							// This is specific to CE and required by the spec.


							var shadowRoot = _this.attachShadow({ mode: 'open' });
							// check if polyfill is used
							if (typeof ShadyCSS !== 'undefined') {
								ShadyCSS.prepareTemplate(template, 'page-sections'); // eslint-disable-line no-undef
								// apply css polyfill
								ShadyCSS.styleElement(_this); // eslint-disable-line no-undef
							}
							// add content to shadowRoot
							shadowRoot.appendChild(document.importNode(template.content, true));
							return _this;
						}
						/**
      * @method connectedCallback
      * @description When element is added to DOM
       */

						_createClass(PageSections, [{
							key: "connectedCallback",
							value: function connectedCallback() {
								var element = this;
								var fn;
								// setup scroll event to check for active elements
								window.addEventListener('scroll', function () {
									clearTimeout(fn);
									fn = setTimeout(function () {
										element.setActiveState();
									}, 10);
								});
								// initialize activated state
								setTimeout(function () {
									element.setActiveState();
								}, 1);
							}
							/**
        * @method _inView
        * @description check if element is in view
        */

						}, {
							key: "setActiveState",

							/**
        * @method setActiveState
        * @description set _active property & add/remove active attr
        */
							value: function setActiveState() {
								if (this._inView) {
									this._setActive();
									// Get all child elements and activate visible ones
									// stop once an inactive item follows an active item
									Array.prototype.slice.call(this.querySelectorAll('page-section')).map(function (item, index, array) {
										item.parent = item;
										item.setActiveState();
										// abort if current element is NOT in view, but previous was in view
										if (index > 0 && !item.hasAttribute('active') && array[index - 1].hasAttribute('active')) {
											return;
										}
									});
								} else {
									this._setUnactive();
								}
							}
							/**
        * _setActive
        */

						}, {
							key: "_setActive",
							value: function _setActive() {
								if (this.hasAttribute('active')) return;
								// set attribute
								this.setAttribute('active', '');
								// Dispatch the event.
								this.dispatchEvent(new CustomEvent('activated', { 'detail': {
										'wasActivated': this.getAttribute('wasActivated') !== null
									} }));
							}
							/**
        * _setUnactive
        */

						}, {
							key: "_setUnactive",
							value: function _setUnactive() {
								// set 'wasActivated' attribute, if element was active
								if (this.hasAttribute('active') && !this.hasAttribute('wasActivated')) {
									this.setAttribute('wasActivated', '');
								}
								// remove 'active' attribute
								this.removeAttribute('active');
								// Dispatch the event.
								this.dispatchEvent(new Event('deactivated'));
							}
						}, {
							key: "_inView",
							get: function get() {
								return this.getBoundingClientRect().bottom > 0 && this.getBoundingClientRect().top < window.innerHeight;
							}
						}]);

						return PageSections;
					}(_CustomElement);
					/**
      * export for commonjs module
      */

					module.exports = PageSections;
				})();
			},
			"page-section.js": function pageSectionJs(exports, module, require) {
				/* global HTMLElement CustomEvent Event */
				(function () {
					// function to create template-element from template tag on the fly
					var makeTemplate = require('./make-template');
					var template = makeTemplate(_templateObject2);

					var PageSection = function (_CustomElement3) {
						_inherits(PageSection, _CustomElement3);

						function PageSection() {
							_classCallCheck(this, PageSection);

							// Attach a shadow root to the element.
							var _this2 = _possibleConstructorReturn(this, (PageSection.__proto__ || Object.getPrototypeOf(PageSection)).call(this));
							// If you define a ctor, always call super() first!
							// This is specific to CE and required by the spec.


							var shadowRoot = _this2.attachShadow({ mode: 'open' });
							// check if polyfill is used
							if (typeof ShadyCSS !== 'undefined') {
								ShadyCSS.prepareTemplate(template, 'page-section'); // eslint-disable-line no-undef
								// apply css polyfill
								ShadyCSS.styleElement(_this2); // eslint-disable-line no-undef
							}
							// add content to shadowRoot
							shadowRoot.appendChild(document.importNode(template.content, true));
							return _this2;
						}
						/**
       * @method _inView
       * @description check if element is in view
       */

						_createClass(PageSection, [{
							key: "setActiveState",

							/**
        * @method setActiveState
        * @description set active if in viewport or unactive if not
        */
							value: function setActiveState() {
								if (this._inView) {
									this._setActive();
								} else {
									this._setUnactive();
								}
							}
							/**
        * _setActive
        */

						}, {
							key: "_setActive",
							value: function _setActive() {
								if (this.hasAttribute('active')) return;
								// set attribute
								this.setAttribute('active', '');
								// Dispatch the event.
								this.dispatchEvent(new CustomEvent('activated', { 'detail': {
										'wasActivated': this.getAttribute('wasActivated') !== null
									} }));
							}
							/**
        * _setUnactive
        */

						}, {
							key: "_setUnactive",
							value: function _setUnactive() {
								// set 'wasActivated' attribute, if element was active
								if (this.hasAttribute('active') && !this.hasAttribute('wasActivated')) {
									this.setAttribute('wasActivated', '');
								}
								// remove 'active' attribute
								this.removeAttribute('active');
								// Dispatch the event.
								this.dispatchEvent(new Event('deactivated'));
							}
						}, {
							key: "_inView",
							get: function get() {
								// minimum visible percent of the element to be considered active
								var minVisible = Math.min(1, parseFloat(this.getAttribute('requiredVisible')) || parseFloat(this.parent.getAttribute('requiredVisible')) || 0.6);
								// px value of element that can be hidden
								var requiredVisiblePx = minVisible * Math.min(this.getBoundingClientRect().height, window.innerHeight);
								// calculate visible height
								var visibleHeight = this.getBoundingClientRect().height;
								// substract part that is outside screen to top
								visibleHeight += Math.min(0, this.getBoundingClientRect().top);
								// substract part that is outside screen to bottom
								visibleHeight -= Math.max(0, this.getBoundingClientRect().bottom - window.innerHeight);
								// return if element is visible or not
								return visibleHeight >= requiredVisiblePx;
							}
						}]);

						return PageSection;
					}(_CustomElement);

					/**
      * export for commonjs module
      */

					module.exports = PageSection;
				})();
			},
			"page-sections.js": function pageSectionsJs(exports, module, require) {
				(function () {
					var PageSectionContainer = require('./page-section-container');
					var PageSection = require('./page-section');

					window.customElements.define('page-sections', PageSectionContainer);
					window.customElements.define('page-section', PageSection);
				})();
			}
		}
	}
})("page-sections/src/page-sections");
//# sourceMappingURL=page-sections.js.map
//# sourceMappingURL=common.js.map
