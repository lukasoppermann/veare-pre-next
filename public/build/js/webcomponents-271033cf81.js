/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

// minimal template polyfill
(function() {

  var needsTemplate = (typeof HTMLTemplateElement === 'undefined');

  // NOTE: Patch document.importNode to work around IE11 bug that
  // casues children of a document fragment imported while
  // there is a mutation observer to not have a parentNode (!?!)
  // It's important that this is the first patch to `importNode` so that
  // dom produced for later patches is correct.
  if (/Trident/.test(navigator.userAgent)) {
    (function() {
      var Native_importNode = Document.prototype.importNode;
      Document.prototype.importNode = function() {
        var n = Native_importNode.apply(this, arguments);
        // Copy all children to a new document fragment since
        // this one may be broken
        if (n.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          var f = this.createDocumentFragment();
          f.appendChild(n);
          return f;
        } else {
          return n;
        }
      };
    })();
  }

  // NOTE: we rely on this cloneNode not causing element upgrade.
  // This means this polyfill must load before the CE polyfill and
  // this would need to be re-worked if a browser supports native CE
  // but not <template>.
  var Native_cloneNode = Node.prototype.cloneNode;
  var Native_createElement = Document.prototype.createElement;
  var Native_importNode = Document.prototype.importNode;

  // returns true if nested templates cannot be cloned (they cannot be on
  // some impl's like Safari 8 and Edge)
  // OR if cloning a document fragment does not result in a document fragment
  var needsCloning = (function() {
    if (!needsTemplate) {
      var t = document.createElement('template');
      var t2 = document.createElement('template');
      t2.content.appendChild(document.createElement('div'));
      t.content.appendChild(t2);
      var clone = t.cloneNode(true);
      return (clone.content.childNodes.length === 0 || clone.content.firstChild.content.childNodes.length === 0
        || !(document.createDocumentFragment().cloneNode() instanceof DocumentFragment));
    }
  })();

  var TEMPLATE_TAG = 'template';
  var PolyfilledHTMLTemplateElement = function() {};

  if (needsTemplate) {

    var contentDoc = document.implementation.createHTMLDocument('template');
    var canDecorate = true;

    var templateStyle = document.createElement('style');
    templateStyle.textContent = TEMPLATE_TAG + '{display:none;}';

    var head = document.head;
    head.insertBefore(templateStyle, head.firstElementChild);

    /**
      Provides a minimal shim for the <template> element.
    */
    PolyfilledHTMLTemplateElement.prototype = Object.create(HTMLElement.prototype);


    // if elements do not have `innerHTML` on instances, then
    // templates can be patched by swizzling their prototypes.
    var canProtoPatch =
      !(document.createElement('div').hasOwnProperty('innerHTML'));

    /**
      The `decorate` method moves element children to the template's `content`.
      NOTE: there is no support for dynamically adding elements to templates.
    */
    PolyfilledHTMLTemplateElement.decorate = function(template) {
      // if the template is decorated, return fast
      if (template.content) {
        return;
      }
      template.content = contentDoc.createDocumentFragment();
      var child;
      while (child = template.firstChild) {
        template.content.appendChild(child);
      }
      // NOTE: prefer prototype patching for performance and
      // because on some browsers (IE11), re-defining `innerHTML`
      // can result in intermittent errors.
      if (canProtoPatch) {
        template.__proto__ = PolyfilledHTMLTemplateElement.prototype;
      } else {
        template.cloneNode = function(deep) {
          return PolyfilledHTMLTemplateElement._cloneNode(this, deep);
        };
        // add innerHTML to template, if possible
        // Note: this throws on Safari 7
        if (canDecorate) {
          try {
            defineInnerHTML(template);
          } catch (err) {
            canDecorate = false;
          }
        }
      }
      // bootstrap recursively
      PolyfilledHTMLTemplateElement.bootstrap(template.content);
    };

    function defineInnerHTML(obj) {
      Object.defineProperty(obj, 'innerHTML', {
        get: function() {
          var o = '';
          for (var e = this.content.firstChild; e; e = e.nextSibling) {
            o += e.outerHTML || escapeData(e.data);
          }
          return o;
        },
        set: function(text) {
          contentDoc.body.innerHTML = text;
          PolyfilledHTMLTemplateElement.bootstrap(contentDoc);
          while (this.content.firstChild) {
            this.content.removeChild(this.content.firstChild);
          }
          while (contentDoc.body.firstChild) {
            this.content.appendChild(contentDoc.body.firstChild);
          }
        },
        configurable: true
      });
    }

    defineInnerHTML(PolyfilledHTMLTemplateElement.prototype);

    /**
      The `bootstrap` method is called automatically and "fixes" all
      <template> elements in the document referenced by the `doc` argument.
    */
    PolyfilledHTMLTemplateElement.bootstrap = function(doc) {
      var templates = doc.querySelectorAll(TEMPLATE_TAG);
      for (var i=0, l=templates.length, t; (i<l) && (t=templates[i]); i++) {
        PolyfilledHTMLTemplateElement.decorate(t);
      }
    };

    // auto-bootstrapping for main document
    document.addEventListener('DOMContentLoaded', function() {
      PolyfilledHTMLTemplateElement.bootstrap(document);
    });

    // Patch document.createElement to ensure newly created templates have content
    Document.prototype.createElement = function() {
      'use strict';
      var el = Native_createElement.apply(this, arguments);
      if (el.localName === 'template') {
        PolyfilledHTMLTemplateElement.decorate(el);
      }
      return el;
    };

    var escapeDataRegExp = /[&\u00A0<>]/g;

    function escapeReplace(c) {
      switch (c) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '\u00A0':
          return '&nbsp;';
      }
    }

    function escapeData(s) {
      return s.replace(escapeDataRegExp, escapeReplace);
    }
  }

  // make cloning/importing work!
  if (needsTemplate || needsCloning) {

    PolyfilledHTMLTemplateElement._cloneNode = function(template, deep) {
      var clone = Native_cloneNode.call(template, false);
      // NOTE: decorate doesn't auto-fix children because they are already
      // decorated so they need special clone fixup.
      if (this.decorate) {
        this.decorate(clone);
      }
      if (deep) {
        // NOTE: use native clone node to make sure CE's wrapped
        // cloneNode does not cause elements to upgrade.
        clone.content.appendChild(
            Native_cloneNode.call(template.content, true));
        // now ensure nested templates are cloned correctly.
        this.fixClonedDom(clone.content, template.content);
      }
      return clone;
    };

    PolyfilledHTMLTemplateElement.prototype.cloneNode = function(deep) {
      return PolyfilledHTMLTemplateElement._cloneNode(this, deep);
    }

    // Given a source and cloned subtree, find <template>'s in the cloned
    // subtree and replace them with cloned <template>'s from source.
    // We must do this because only the source templates have proper .content.
    PolyfilledHTMLTemplateElement.fixClonedDom = function(clone, source) {
      // do nothing if cloned node is not an element
      if (!source.querySelectorAll) return;
      // these two lists should be coincident
      var s$ = source.querySelectorAll(TEMPLATE_TAG);
      var t$ = clone.querySelectorAll(TEMPLATE_TAG);
      for (var i=0, l=t$.length, t, s; i<l; i++) {
        s = s$[i];
        t = t$[i];
        if (this.decorate) {
          this.decorate(s);
        }
        t.parentNode.replaceChild(s.cloneNode(true), t);
      }
    };

    // override all cloning to fix the cloned subtree to contain properly
    // cloned templates.
    Node.prototype.cloneNode = function(deep) {
      var dom;
      // workaround for Edge bug cloning documentFragments
      // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8619646/
      if (this instanceof DocumentFragment) {
        if (!deep) {
          return this.ownerDocument.createDocumentFragment();
        } else {
          dom = this.ownerDocument.importNode(this, true);
        }
      } else {
        dom = Native_cloneNode.call(this, deep);
      }
      // template.content is cloned iff `deep`.
      if (deep) {
        PolyfilledHTMLTemplateElement.fixClonedDom(dom, this);
      }
      return dom;
    };

    // NOTE: we are cloning instead of importing <template>'s.
    // However, the ownerDocument of the cloned template will be correct!
    // This is because the native import node creates the right document owned
    // subtree and `fixClonedDom` inserts cloned templates into this subtree,
    // thus updating the owner doc.
    Document.prototype.importNode = function(element, deep) {
      if (element.localName === TEMPLATE_TAG) {
        return PolyfilledHTMLTemplateElement._cloneNode(element, deep);
      } else {
        var dom = Native_importNode.call(this, element, deep);
        if (deep) {
          PolyfilledHTMLTemplateElement.fixClonedDom(dom, element);
        }
        return dom;
      }
    };

    if (needsCloning) {
      window.HTMLTemplateElement.prototype.cloneNode = function(deep) {
        return PolyfilledHTMLTemplateElement._cloneNode(this, deep);
      };
    }
  }

  if (needsTemplate) {
    window.HTMLTemplateElement = PolyfilledHTMLTemplateElement;
  }

})();

/*

 Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
'use strict';(function(){function c(){function a(){b.C=!0;b.b(f.childNodes)}var b=this;this.a=new Map;this.j=new Map;this.h=new Map;this.m=new Set;this.v=new MutationObserver(this.A.bind(this));this.f=null;this.B=new Set;this.enableFlush=!0;this.C=!1;this.G=this.c(f);window.HTMLImports?window.HTMLImports.whenReady(a):a()}function g(){return h.customElements}function k(a){if(!/^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(a)||-1!==q.indexOf(a))return Error("The element name '"+a+"' is not valid.")}function l(a,
b,d,e){var c=g();a=r.call(a,b,d);(b=c.a.get(b.toLowerCase()))&&c.D(a,b,e);c.c(a);return a}function m(a,b,d,e){b=b.toLowerCase();var c=a.getAttribute(b);e.call(a,b,d);1==a.__$CE_upgraded&&(e=g().a.get(a.localName),d=e.w,(e=e.i)&&0<=d.indexOf(b)&&(d=a.getAttribute(b),d!==c&&e.call(a,b,c,d,null)))}var f=document,h=window;if(g()&&(g().g=function(){},!g().forcePolyfill))return;var q="annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" ");
c.prototype.K=function(a,b){function d(a){var b=g[a];if(void 0!==b&&"function"!==typeof b)throw Error(c+" '"+a+"' is not a Function");return b}if("function"!==typeof b)throw new TypeError("constructor must be a Constructor");var e=k(a);if(e)throw e;if(this.a.has(a))throw Error("An element with name '"+a+"' is already defined");if(this.j.has(b))throw Error("Definition failed for '"+a+"': The constructor is already used.");var c=a,g=b.prototype;if("object"!==typeof g)throw new TypeError("Definition failed for '"+
a+"': constructor.prototype must be an object");var e=d("connectedCallback"),h=d("disconnectedCallback"),n=d("attributeChangedCallback");this.a.set(c,{name:a,localName:c,constructor:b,o:e,s:h,i:n,w:n&&b.observedAttributes||[]});this.j.set(b,c);this.C&&this.b(f.childNodes);if(a=this.h.get(c))a.resolve(void 0),this.h.delete(c)};c.prototype.get=function(a){return(a=this.a.get(a))?a.constructor:void 0};c.prototype.L=function(a){var b=k(a);if(b)return Promise.reject(b);if(this.a.has(a))return Promise.resolve();
if(b=this.h.get(a))return b.M;var d,e=new Promise(function(a){d=a}),b={M:e,resolve:d};this.h.set(a,b);return e};c.prototype.g=function(){this.enableFlush&&(this.l(this.G.takeRecords()),this.A(this.v.takeRecords()),this.m.forEach(function(a){this.l(a.takeRecords())},this))};c.prototype.I=function(a){this.f=a};c.prototype.c=function(a){if(null!=a.__$CE_observer)return a.__$CE_observer;a.__$CE_observer=new MutationObserver(this.l.bind(this));a.__$CE_observer.observe(a,{childList:!0,subtree:!0});this.enableFlush&&
this.m.add(a.__$CE_observer);return a.__$CE_observer};c.prototype.J=function(a){null!=a.__$CE_observer&&(a.__$CE_observer.disconnect(),this.enableFlush&&this.m.delete(a.__$CE_observer),a.__$CE_observer=null)};c.prototype.l=function(a){for(var b=0;b<a.length;b++){var d=a[b];if("childList"===d.type){var e=d.removedNodes;this.b(d.addedNodes);this.H(e)}}};c.prototype.b=function(a,b){b=b||new Set;for(var d=0;d<a.length;d++){var e=a[d];if(e.nodeType===Node.ELEMENT_NODE){this.J(e);e=f.createTreeWalker(e,
NodeFilter.SHOW_ELEMENT,null,!1);do this.F(e.currentNode,b);while(e.nextNode())}}};c.prototype.F=function(a,b){if(!b.has(a)){b.add(a);var d=this.a.get(a.localName);if(d){a.__$CE_upgraded||this.D(a,d,!0);var e;if(e=a.__$CE_upgraded&&!a.__$CE_attached)a:{e=a;do{if(e.__$CE_attached||e.nodeType===Node.DOCUMENT_NODE){e=!0;break a}e=e.parentNode||e.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&e.host}while(e);e=!1}e&&(a.__$CE_attached=!0,d.o&&d.o.call(a))}a.shadowRoot&&this.b(a.shadowRoot.childNodes,b);"LINK"===
a.tagName&&a.rel&&-1!==a.rel.toLowerCase().split(" ").indexOf("import")&&this.u(a,b)}};c.prototype.u=function(a,b){var d=a.import;if(d)b.has(d)||(b.add(d),d.__$CE_observer||this.c(d),this.b(d.childNodes,b));else if(b=a.href,!this.B.has(b)){this.B.add(b);var e=this,c=function(){a.removeEventListener("load",c);a.import.__$CE_observer||e.c(a.import);e.b(a.import.childNodes)};a.addEventListener("load",c)}};c.prototype.H=function(a){for(var b=0;b<a.length;b++){var d=a[b];if(d.nodeType===Node.ELEMENT_NODE){this.c(d);
d=f.createTreeWalker(d,NodeFilter.SHOW_ELEMENT,null,!1);do{var e=d.currentNode;if(e.__$CE_upgraded&&e.__$CE_attached){e.__$CE_attached=!1;var c=this.a.get(e.localName);c&&c.s&&c.s.call(e)}}while(d.nextNode())}}};c.prototype.D=function(a,b,d){a.__proto__=b.constructor.prototype;d&&(this.I(a),new b.constructor,a.__$CE_upgraded=!0,console.assert(!this.f));d=b.w;if((b=b.i)&&0<d.length){this.v.observe(a,{attributes:!0,attributeOldValue:!0,attributeFilter:d});for(var e=0;e<d.length;e++){var c=d[e];if(a.hasAttribute(c)){var f=
a.getAttribute(c);b.call(a,c,null,f,null)}}}};c.prototype.A=function(a){for(var b=0;b<a.length;b++){var d=a[b];if("attributes"===d.type){var e=d.target,c=this.a.get(e.localName),f=d.attributeName,g=d.oldValue,h=e.getAttribute(f);h!==g&&c.i.call(e,f,g,h,d.attributeNamespace)}}};window.CustomElementRegistry=c;c.prototype.define=c.prototype.K;c.prototype.get=c.prototype.get;c.prototype.whenDefined=c.prototype.L;c.prototype.flush=c.prototype.g;c.prototype.polyfilled=!0;c.prototype._observeRoot=c.prototype.c;
c.prototype._addImport=c.prototype.u;var t=h.HTMLElement;h.HTMLElement=function(){var a=g();if(a.f){var b=a.f;a.f=null;return b}if(this.constructor)return a=a.j.get(this.constructor),l(f,a,void 0,!1);throw Error("Unknown constructor. Did you call customElements.define()?");};h.HTMLElement.prototype=Object.create(t.prototype,{constructor:{value:h.HTMLElement,configurable:!0,writable:!0}});var r=f.createElement;f.createElement=function(a,b){return l(f,a,b,!0)};var u=f.createElementNS;f.createElementNS=
function(a,b){return"http://www.w3.org/1999/xhtml"===a?f.createElement(b):u.call(f,a,b)};var p=Element.prototype.attachShadow;p&&Object.defineProperty(Element.prototype,"attachShadow",{value:function(a){a=p.call(this,a);g().c(a);return a}});var v=f.importNode;f.importNode=function(a,b){a=v.call(f,a,b);g().b(a.nodeType===Node.ELEMENT_NODE?[a]:a.childNodes);return a};var w=Element.prototype.setAttribute;Element.prototype.setAttribute=function(a,b){m(this,a,b,w)};var x=Element.prototype.removeAttribute;
Element.prototype.removeAttribute=function(a){m(this,a,null,x)};Object.defineProperty(window,"customElements",{value:new c,configurable:!0,enumerable:!0});window.CustomElements={takeRecords:function(){g().g&&g().g()}}})();

//# sourceMappingURL=custom-elements.min.js.map

(function () {
'use strict';

/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

var settings = window.ShadyDOM || {};

settings.hasNativeShadowDOM = Boolean(Element.prototype.attachShadow && Node.prototype.getRootNode);

settings.inUse = settings.force || !settings.hasNativeShadowDOM;

function isShadyRoot(obj) {
  return Boolean(obj.__localName === 'ShadyRoot');
}

var p = Element.prototype;
var matches = p.matches || p.matchesSelector ||
  p.mozMatchesSelector || p.msMatchesSelector ||
  p.oMatchesSelector || p.webkitMatchesSelector;

function matchesSelector(element, selector) {
  return matches.call(element, selector);
}

function copyOwnProperty(name, source, target) {
  var pd = Object.getOwnPropertyDescriptor(source, name);
  if (pd) {
    Object.defineProperty(target, name, pd);
  }
}

function extend(target, source) {
  if (target && source) {
    var n$ = Object.getOwnPropertyNames(source);
    for (var i=0, n; (i<n$.length) && (n=n$[i]); i++) {
      copyOwnProperty(n, source, target);
    }
  }
  return target || source;
}

function extendAll(target) {
  var sources = [], len = arguments.length - 1;
  while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];

  for (var i=0; i < sources.length; i++) {
    extend(target, sources[i]);
  }
  return target;
}

function mixin(target, source) {
  for (var i in source) {
    target[i] = source[i];
  }
  return target;
}

var setPrototypeOf = Object.setPrototypeOf || function(obj, proto) {
  obj.__proto__ = proto;
  return obj;
}

function patchPrototype(obj, mixin) {
  var proto = Object.getPrototypeOf(obj);
  if (!proto.hasOwnProperty('__patchProto')) {
    var patchProto = Object.create(proto);
    patchProto.__sourceProto = proto;
    extend(patchProto, mixin);
    proto.__patchProto = patchProto;
  }
  setPrototypeOf(obj, proto.__patchProto);
}



var common = {};

// TODO(sorvell): actually rely on a real Promise polyfill...
var promish;
if (window.Promise) {
  promish = Promise.resolve();
} else {
  promish = {
    then: function(cb) {
      var twiddle = document.createTextNode('');
      var observer = new MutationObserver(function() {
        observer.disconnect();
        cb();
      });
      observer.observe(twiddle, {characterData: true});
    }
  }
}

/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

function newSplice(index, removed, addedCount) {
  return {
    index: index,
    removed: removed,
    addedCount: addedCount
  };
}

var EDIT_LEAVE = 0;
var EDIT_UPDATE = 1;
var EDIT_ADD = 2;
var EDIT_DELETE = 3;

var ArraySplice = {

  // Note: This function is *based* on the computation of the Levenshtein
  // "edit" distance. The one change is that "updates" are treated as two
  // edits - not one. With Array splices, an update is really a delete
  // followed by an add. By retaining this, we optimize for "keeping" the
  // maximum array items in the original array. For example:
  //
  //   'xxxx123' -> '123yyyy'
  //
  // With 1-edit updates, the shortest path would be just to update all seven
  // characters. With 2-edit updates, we delete 4, leave 3, and add 4. This
  // leaves the substring '123' intact.
  calcEditDistances: function calcEditDistances(current, currentStart, currentEnd,
                              old, oldStart, oldEnd) {
    var this$1 = this;

    // "Deletion" columns
    var rowCount = oldEnd - oldStart + 1;
    var columnCount = currentEnd - currentStart + 1;
    var distances = new Array(rowCount);

    // "Addition" rows. Initialize null column.
    for (var i = 0; i < rowCount; i++) {
      distances[i] = new Array(columnCount);
      distances[i][0] = i;
    }

    // Initialize null row
    for (var j = 0; j < columnCount; j++)
      distances[0][j] = j;

    for (var i$1 = 1; i$1 < rowCount; i$1++) {
      for (var j$1 = 1; j$1 < columnCount; j$1++) {
        if (this$1.equals(current[currentStart + j$1 - 1], old[oldStart + i$1 - 1]))
          distances[i$1][j$1] = distances[i$1 - 1][j$1 - 1];
        else {
          var north = distances[i$1 - 1][j$1] + 1;
          var west = distances[i$1][j$1 - 1] + 1;
          distances[i$1][j$1] = north < west ? north : west;
        }
      }
    }

    return distances;
  },

  // This starts at the final weight, and walks "backward" by finding
  // the minimum previous weight recursively until the origin of the weight
  // matrix.
  spliceOperationsFromEditDistances: function spliceOperationsFromEditDistances(distances) {
    var i = distances.length - 1;
    var j = distances[0].length - 1;
    var current = distances[i][j];
    var edits = [];
    while (i > 0 || j > 0) {
      if (i == 0) {
        edits.push(EDIT_ADD);
        j--;
        continue;
      }
      if (j == 0) {
        edits.push(EDIT_DELETE);
        i--;
        continue;
      }
      var northWest = distances[i - 1][j - 1];
      var west = distances[i - 1][j];
      var north = distances[i][j - 1];

      var min;
      if (west < north)
        min = west < northWest ? west : northWest;
      else
        min = north < northWest ? north : northWest;

      if (min == northWest) {
        if (northWest == current) {
          edits.push(EDIT_LEAVE);
        } else {
          edits.push(EDIT_UPDATE);
          current = northWest;
        }
        i--;
        j--;
      } else if (min == west) {
        edits.push(EDIT_DELETE);
        i--;
        current = west;
      } else {
        edits.push(EDIT_ADD);
        j--;
        current = north;
      }
    }

    edits.reverse();
    return edits;
  },

  /**
   * Splice Projection functions:
   *
   * A splice map is a representation of how a previous array of items
   * was transformed into a new array of items. Conceptually it is a list of
   * tuples of
   *
   *   <index, removed, addedCount>
   *
   * which are kept in ascending index order of. The tuple represents that at
   * the |index|, |removed| sequence of items were removed, and counting forward
   * from |index|, |addedCount| items were added.
   */

  /**
   * Lacking individual splice mutation information, the minimal set of
   * splices can be synthesized given the previous state and final state of an
   * array. The basic approach is to calculate the edit distance matrix and
   * choose the shortest path through it.
   *
   * Complexity: O(l * p)
   *   l: The length of the current array
   *   p: The length of the old array
   */
  calcSplices: function calcSplices(current, currentStart, currentEnd,
                        old, oldStart, oldEnd) {
    var prefixCount = 0;
    var suffixCount = 0;
    var splice;

    var minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
    if (currentStart == 0 && oldStart == 0)
      prefixCount = this.sharedPrefix(current, old, minLength);

    if (currentEnd == current.length && oldEnd == old.length)
      suffixCount = this.sharedSuffix(current, old, minLength - prefixCount);

    currentStart += prefixCount;
    oldStart += prefixCount;
    currentEnd -= suffixCount;
    oldEnd -= suffixCount;

    if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0)
      return [];

    if (currentStart == currentEnd) {
      splice = newSplice(currentStart, [], 0);
      while (oldStart < oldEnd)
        splice.removed.push(old[oldStart++]);

      return [ splice ];
    } else if (oldStart == oldEnd)
      return [ newSplice(currentStart, [], currentEnd - currentStart) ];

    var ops = this.spliceOperationsFromEditDistances(
        this.calcEditDistances(current, currentStart, currentEnd,
                               old, oldStart, oldEnd));

    splice = undefined;
    var splices = [];
    var index = currentStart;
    var oldIndex = oldStart;
    for (var i = 0; i < ops.length; i++) {
      switch(ops[i]) {
        case EDIT_LEAVE:
          if (splice) {
            splices.push(splice);
            splice = undefined;
          }

          index++;
          oldIndex++;
          break;
        case EDIT_UPDATE:
          if (!splice)
            splice = newSplice(index, [], 0);

          splice.addedCount++;
          index++;

          splice.removed.push(old[oldIndex]);
          oldIndex++;
          break;
        case EDIT_ADD:
          if (!splice)
            splice = newSplice(index, [], 0);

          splice.addedCount++;
          index++;
          break;
        case EDIT_DELETE:
          if (!splice)
            splice = newSplice(index, [], 0);

          splice.removed.push(old[oldIndex]);
          oldIndex++;
          break;
      }
    }

    if (splice) {
      splices.push(splice);
    }
    return splices;
  },

  sharedPrefix: function sharedPrefix(current, old, searchLength) {
    var this$1 = this;

    for (var i = 0; i < searchLength; i++)
      if (!this$1.equals(current[i], old[i]))
        return i;
    return searchLength;
  },

  sharedSuffix: function sharedSuffix(current, old, searchLength) {
    var index1 = current.length;
    var index2 = old.length;
    var count = 0;
    while (count < searchLength && this.equals(current[--index1], old[--index2]))
      count++;

    return count;
  },

  calculateSplices: function calculateSplices$1(current, previous) {
    return this.calcSplices(current, 0, current.length, previous, 0,
                            previous.length);
  },

  equals: function equals(currentValue, previousValue) {
    return currentValue === previousValue;
  }

};

var calculateSplices = function (current, previous) { return ArraySplice.calculateSplices(current, previous); };

/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

// TODO(sorvell): circular (patch loads tree and tree loads patch)
// for now this is stuck on `utils`
//import {patchNode} from './patch'
// native add/remove
var nativeInsertBefore = Element.prototype.insertBefore;
var nativeAppendChild = Element.prototype.appendChild;
var nativeRemoveChild = Element.prototype.removeChild;

/**
 * `tree` is a dom manipulation library used by ShadyDom to
 * manipulate composed and logical trees.
 */
var tree = {

  // sad but faster than slice...
  arrayCopyChildNodes: function arrayCopyChildNodes(parent) {
    var copy=[], i=0;
    for (var n=parent.firstChild; n; n=n.nextSibling) {
      copy[i++] = n;
    }
    return copy;
  },

  arrayCopyChildren: function arrayCopyChildren(parent) {
    var copy=[], i=0;
    for (var n=parent.firstElementChild; n; n=n.nextElementSibling) {
      copy[i++] = n;
    }
    return copy;
  },

  arrayCopy: function arrayCopy(a$) {
    var l = a$.length;
    var copy = new Array(l);
    for (var i=0; i < l; i++) {
      copy[i] = a$[i];
    }
    return copy;
  },

  saveChildNodes: function saveChildNodes(node) {
    tree.Logical.saveChildNodes(node);
    if (!tree.Composed.hasParentNode(node)) {
      tree.Composed.saveComposedData(node);
      //tree.Composed.saveParentNode(node);
    }
    tree.Composed.saveChildNodes(node);
  }

};

tree.Logical = {

  hasParentNode: function hasParentNode(node) {
    return Boolean(node.__dom && node.__dom.parentNode);
  },

  hasChildNodes: function hasChildNodes(node) {
    return Boolean(node.__dom && node.__dom.childNodes !== undefined);
  },

  getChildNodes: function getChildNodes(node) {
    // note: we're distinguishing here between undefined and false-y:
    // hasChildNodes uses undefined check to see if this element has logical
    // children; the false-y check indicates whether or not we should rebuild
    // the cached childNodes array.
    return this.hasChildNodes(node) ? this._getChildNodes(node) :
      tree.Composed.getChildNodes(node);
  },

  _getChildNodes: function _getChildNodes(node) {
    if (!node.__dom.childNodes) {
      node.__dom.childNodes = [];
      for (var n=this.getFirstChild(node); n; n=this.getNextSibling(n)) {
        node.__dom.childNodes.push(n);
      }
    }
    return node.__dom.childNodes;
  },

  // NOTE: __dom can be created under 2 conditions: (1) an element has a
  // logical tree, or (2) an element is in a logical tree. In case (1), the
  // element will store firstChild/lastChild, and in case (2), the element
  // will store parentNode, nextSibling, previousSibling. This means that
  // the mere existence of __dom is not enough to know if the requested
  // logical data is available and instead we do an explicit undefined check.
  getParentNode: function getParentNode(node) {
    return node.__dom && node.__dom.parentNode !== undefined ?
      node.__dom.parentNode : tree.Composed.getParentNode(node);
  },

  getFirstChild: function getFirstChild(node) {
    return node.__dom && node.__dom.firstChild !== undefined ?
      node.__dom.firstChild : tree.Composed.getFirstChild(node);
  },

  getLastChild: function getLastChild(node) {
    return node.__dom && node.__dom.lastChild  !== undefined ?
      node.__dom.lastChild : tree.Composed.getLastChild(node);
  },

  getNextSibling: function getNextSibling(node) {
    return node.__dom && node.__dom.nextSibling  !== undefined ?
      node.__dom.nextSibling : tree.Composed.getNextSibling(node);
  },

  getPreviousSibling: function getPreviousSibling(node) {
    return node.__dom && node.__dom.previousSibling  !== undefined ?
      node.__dom.previousSibling : tree.Composed.getPreviousSibling(node);
  },

  getFirstElementChild: function getFirstElementChild(node) {
    return node.__dom && node.__dom.firstChild !== undefined ?
      this._getFirstElementChild(node) :
      tree.Composed.getFirstElementChild(node);
  },

  _getFirstElementChild: function _getFirstElementChild(node) {
    var n = node.__dom.firstChild;
    while (n && n.nodeType !== Node.ELEMENT_NODE) {
      n = n.__dom.nextSibling;
    }
    return n;
  },

  getLastElementChild: function getLastElementChild(node) {
    return node.__dom && node.__dom.lastChild !== undefined ?
      this._getLastElementChild(node) :
      tree.Composed.getLastElementChild(node);
  },

  _getLastElementChild: function _getLastElementChild(node) {
    var n = node.__dom.lastChild;
    while (n && n.nodeType !== Node.ELEMENT_NODE) {
      n = n.__dom.previousSibling;
    }
    return n;
  },

  getNextElementSibling: function getNextElementSibling(node) {
    return node.__dom && node.__dom.nextSibling !== undefined ?
      this._getNextElementSibling(node) :
      tree.Composed.getNextElementSibling(node);
  },

  _getNextElementSibling: function _getNextElementSibling(node) {
    var this$1 = this;

    var n = node.__dom.nextSibling;
    while (n && n.nodeType !== Node.ELEMENT_NODE) {
      n = this$1.getNextSibling(n);
    }
    return n;
  },

  getPreviousElementSibling: function getPreviousElementSibling(node) {
    return node.__dom && node.__dom.previousSibling !== undefined ?
      this._getPreviousElementSibling(node) :
      tree.Composed.getPreviousElementSibling(node);
  },

  _getPreviousElementSibling: function _getPreviousElementSibling(node) {
    var this$1 = this;

    var n = node.__dom.previousSibling;
    while (n && n.nodeType !== Node.ELEMENT_NODE) {
      n = this$1.getPreviousSibling(n);
    }
    return n;
  },

  // Capture the list of light children. It's important to do this before we
  // start transforming the DOM into "rendered" state.
  // Children may be added to this list dynamically. It will be treated as the
  // source of truth for the light children of the element. This element's
  // actual children will be treated as the rendered state once this function
  // has been called.
  saveChildNodes: function saveChildNodes$1(node) {
    if (!this.hasChildNodes(node)) {
      node.__dom = node.__dom || {};
      node.__dom.firstChild = node.firstChild;
      node.__dom.lastChild = node.lastChild;
      var c$ = node.__dom.childNodes = tree.arrayCopyChildNodes(node);
      for (var i=0, n; (i<c$.length) && (n=c$[i]); i++) {
        n.__dom = n.__dom || {};
        n.__dom.parentNode = node;
        n.__dom.nextSibling = c$[i+1] || null;
        n.__dom.previousSibling = c$[i-1] || null;
        common.patchNode(n);
      }
    }
  },

  // TODO(sorvell): may need to patch saveChildNodes iff the tree has
  // already been distributed.
  // NOTE: ensure `node` is patched...
  recordInsertBefore: function recordInsertBefore(node, container, ref_node) {
    var this$1 = this;

    container.__dom.childNodes = null;
    // handle document fragments
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      var c$ = tree.arrayCopyChildNodes(node);
      for (var i=0; i < c$.length; i++) {
        this$1._linkNode(c$[i], container, ref_node);
      }
      // cleanup logical dom in doc fragment.
      node.__dom = node.__dom || {};
      node.__dom.firstChild = node.__dom.lastChild = null;
      node.__dom.childNodes = null;
    } else {
      this._linkNode(node, container, ref_node);
    }
  },

  _linkNode: function _linkNode(node, container, ref_node) {
    common.patchNode(node);
    ref_node = ref_node || null;
    node.__dom = node.__dom || {};
    container.__dom = container.__dom || {};
    if (ref_node) {
      ref_node.__dom = ref_node.__dom || {};
    }
    // update ref_node.previousSibling <-> node
    node.__dom.previousSibling = ref_node ? ref_node.__dom.previousSibling :
      container.__dom.lastChild;
    if (node.__dom.previousSibling) {
      node.__dom.previousSibling.__dom.nextSibling = node;
    }
    // update node <-> ref_node
    node.__dom.nextSibling = ref_node;
    if (node.__dom.nextSibling) {
      node.__dom.nextSibling.__dom.previousSibling = node;
    }
    // update node <-> container
    node.__dom.parentNode = container;
    if (ref_node) {
      if (ref_node === container.__dom.firstChild) {
        container.__dom.firstChild = node;
      }
    } else {
      container.__dom.lastChild = node;
      if (!container.__dom.firstChild) {
        container.__dom.firstChild = node;
      }
    }
    // remove caching of childNodes
    container.__dom.childNodes = null;
  },

  recordRemoveChild: function recordRemoveChild(node, container) {
    node.__dom = node.__dom || {};
    container.__dom = container.__dom || {};
    if (node === container.__dom.firstChild) {
      container.__dom.firstChild = node.__dom.nextSibling;
    }
    if (node === container.__dom.lastChild) {
      container.__dom.lastChild = node.__dom.previousSibling;
    }
    var p = node.__dom.previousSibling;
    var n = node.__dom.nextSibling;
    if (p) {
      p.__dom = p.__dom || {};
      p.__dom.nextSibling = n;
    }
    if (n) {
      n.__dom = n.__dom || {};
      n.__dom.previousSibling = p;
    }
    // When an element is removed, logical data is no longer tracked.
    // Explicitly set `undefined` here to indicate this. This is disginguished
    // from `null` which is set if info is null.
    node.__dom.parentNode = node.__dom.previousSibling =
      node.__dom.nextSibling = null;
    // remove caching of childNodes
    container.__dom.childNodes = null;
  }

}


// TODO(sorvell): composed tree manipulation is made available
// (1) to maninpulate the composed tree, and (2) to track changes
// to the tree for optional patching pluggability.
tree.Composed = {

  hasParentNode: function hasParentNode$1(node) {
    return Boolean(node.__dom && node.__dom.$parentNode !== undefined);
  },

  hasChildNodes: function hasChildNodes$1(node) {
    return Boolean(node.__dom && node.__dom.$childNodes !== undefined);
  },

  getChildNodes: function getChildNodes$1(node) {
    return this.hasChildNodes(node) ? this._getChildNodes(node) :
      (!node.__patched && tree.arrayCopy(node.childNodes));
  },

  _getChildNodes: function _getChildNodes$1(node) {
    if (!node.__dom.$childNodes) {
      node.__dom.$childNodes = [];
      for (var n=node.__dom.$firstChild; n; n=n.__dom.$nextSibling) {
        node.__dom.$childNodes.push(n);
      }
    }
    return node.__dom.$childNodes;
  },

  getComposedChildNodes: function getComposedChildNodes(node) {
    return node.__dom.$childNodes;
  },

  getParentNode: function getParentNode$1(node) {
    return this.hasParentNode(node) ? node.__dom.$parentNode :
      (!node.__patched && node.parentNode);
  },

  getFirstChild: function getFirstChild$1(node) {
    return node.__patched ? node.__dom.$firstChild : node.firstChild;
  },

  getLastChild: function getLastChild$1(node) {
    return node.__patched ? node.__dom.$lastChild : node.lastChild;
  },

  getNextSibling: function getNextSibling$1(node) {
    return node.__patched ? node.__dom.$nextSibling : node.nextSibling;
  },

  getPreviousSibling: function getPreviousSibling$1(node) {
    return node.__patched ? node.__dom.$previousSibling : node.previousSibling;
  },

  getFirstElementChild: function getFirstElementChild$1(node) {
    return node.__patched ? this._getFirstElementChild(node) :
      node.firstElementChild;
  },

  _getFirstElementChild: function _getFirstElementChild$1(node) {
    var n = node.__dom.$firstChild;
    while (n && n.nodeType !== Node.ELEMENT_NODE) {
      n = n.__dom.$nextSibling;
    }
    return n;
  },

  getLastElementChild: function getLastElementChild$1(node) {
    return node.__patched ? this._getLastElementChild(node) :
      node.lastElementChild;
  },

  _getLastElementChild: function _getLastElementChild$1(node) {
    var n = node.__dom.$lastChild;
    while (n && n.nodeType !== Node.ELEMENT_NODE) {
      n = n.__dom.$previousSibling;
    }
    return n;
  },

  getNextElementSibling: function getNextElementSibling$1(node) {
    return node.__patched ? this._getNextElementSibling(node) :
      node.nextElementSibling;
  },

  _getNextElementSibling: function _getNextElementSibling$1(node) {
    var this$1 = this;

    var n = node.__dom.$nextSibling;
    while (n && n.nodeType !== Node.ELEMENT_NODE) {
      n = this$1.getNextSibling(n);
    }
    return n;
  },

  getPreviousElementSibling: function getPreviousElementSibling$1(node) {
    return node.__patched ? this._getPreviousElementSibling(node) :
      node.previousElementSibling;
  },

  _getPreviousElementSibling: function _getPreviousElementSibling$1(node) {
    var this$1 = this;

    var n = node.__dom.$previousSibling;
    while (n && n.nodeType !== Node.ELEMENT_NODE) {
      n = this$1.getPreviousSibling(n);
    }
    return n;
  },

  saveChildNodes: function saveChildNodes$2(node) {
    var this$1 = this;

    if (!this.hasChildNodes(node)) {
      node.__dom = node.__dom || {};
      node.__dom.$firstChild = node.firstChild;
      node.__dom.$lastChild = node.lastChild;
      var c$ = node.__dom.$childNodes = tree.arrayCopyChildNodes(node);
      for (var i=0, n; (i<c$.length) && (n=c$[i]); i++) {
        this$1.saveComposedData(n);
      }
    }
  },

  saveComposedData: function saveComposedData(node) {
    node.__dom = node.__dom || {};
    if (node.__dom.$parentNode === undefined) {
      node.__dom.$parentNode = node.parentNode;
    }
    if (node.__dom.$nextSibling === undefined) {
      node.__dom.$nextSibling = node.nextSibling;
    }
    if (node.__dom.$previousSibling === undefined) {
      node.__dom.$previousSibling = node.previousSibling;
    }
  },

  recordInsertBefore: function recordInsertBefore$1(node, container, ref_node) {
    var this$1 = this;

    container.__dom.$childNodes = null;
    // handle document fragments
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      // TODO(sorvell): remember this for patching:
      // the act of setting this info can affect patched nodes
      // getters; therefore capture childNodes before patching.
      for (var n=this.getFirstChild(node); n; n=this.getNextSibling(n)) {
        this$1._linkNode(n, container, ref_node);
      }
    } else {
      this._linkNode(node, container, ref_node);
    }
  },

  _linkNode: function _linkNode$1(node, container, ref_node) {
    node.__dom = node.__dom || {};
    container.__dom = container.__dom || {};
    if (ref_node) {
      ref_node.__dom = ref_node.__dom || {};
    }
    // update ref_node.previousSibling <-> node
    node.__dom.$previousSibling = ref_node ? ref_node.__dom.$previousSibling :
      container.__dom.$lastChild;
    if (node.__dom.$previousSibling) {
      node.__dom.$previousSibling.__dom.$nextSibling = node;
    }
    // update node <-> ref_node
    node.__dom.$nextSibling = ref_node;
    if (node.__dom.$nextSibling) {
      node.__dom.$nextSibling.__dom.$previousSibling = node;
    }
    // update node <-> container
    node.__dom.$parentNode = container;
    if (ref_node) {
      if (ref_node === container.__dom.$firstChild) {
        container.__dom.$firstChild = node;
      }
    } else {
      container.__dom.$lastChild = node;
      if (!container.__dom.$firstChild) {
        container.__dom.$firstChild = node;
      }
    }
    // remove caching of childNodes
    container.__dom.$childNodes = null;
  },

  recordRemoveChild: function recordRemoveChild$1(node, container) {
    node.__dom = node.__dom || {};
    container.__dom = container.__dom || {};
    if (node === container.__dom.$firstChild) {
      container.__dom.$firstChild = node.__dom.$nextSibling;
    }
    if (node === container.__dom.$lastChild) {
      container.__dom.$lastChild = node.__dom.$previousSibling;
    }
    var p = node.__dom.$previousSibling;
    var n = node.__dom.$nextSibling;
    if (p) {
      p.__dom = p.__dom || {};
      p.__dom.$nextSibling = n;
    }
    if (n) {
      n.__dom = n.__dom || {};
      n.__dom.$previousSibling = p;
    }
    node.__dom.$parentNode = node.__dom.$previousSibling =
      node.__dom.$nextSibling = null;
    // remove caching of childNodes
    container.__dom.$childNodes = null;
  },

  clearChildNodes: function clearChildNodes(node) {
    var this$1 = this;

    var c$ = this.getChildNodes(node);
    for (var i=0, c; i < c$.length; i++) {
      c = c$[i];
      this$1.recordRemoveChild(c, node);
      nativeRemoveChild.call(node, c)
    }
  },

  saveParentNode: function saveParentNode(node) {
    node.__dom = node.__dom || {};
    node.__dom.$parentNode = node.parentNode;
  },

  insertBefore: function insertBefore(parentNode, newChild, refChild) {
    this.saveChildNodes(parentNode);
    // remove from current location.
    this._addChild(parentNode, newChild, refChild);
    return nativeInsertBefore.call(parentNode, newChild, refChild || null);
  },

  appendChild: function appendChild(parentNode, newChild) {
    this.saveChildNodes(parentNode);
    this._addChild(parentNode, newChild);
    return nativeAppendChild.call(parentNode, newChild);
  },

  removeChild: function removeChild(parentNode, node) {
    var currentParent = this.getParentNode(node);
    this.saveChildNodes(parentNode);
    this._removeChild(parentNode, node);
    if (currentParent === parentNode) {
      return nativeRemoveChild.call(parentNode, node);
    }
  },

  _addChild: function _addChild(parentNode, newChild, refChild) {
    var this$1 = this;

    var isFrag = (newChild.nodeType === Node.DOCUMENT_FRAGMENT_NODE);
    var oldParent = this.getParentNode(newChild);
    if (oldParent) {
      this._removeChild(oldParent, newChild);
    }
    if (isFrag) {
      var c$ = this.getChildNodes(newChild);
      for (var i=0; i < c$.length; i++) {
        var c = c$[i];
        // unlink document fragment children
        this$1._removeChild(newChild, c);
        this$1.recordInsertBefore(c, parentNode, refChild);
      }
    } else {
      this.recordInsertBefore(newChild, parentNode, refChild);
    }
  },

  _removeChild: function _removeChild(parentNode, node) {
    this.recordRemoveChild(node, parentNode);
  }

};

// for testing...
var descriptors = {};
function getNativeProperty(element, property) {
  if (!descriptors[property]) {
    descriptors[property] = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype, property) ||
    Object.getOwnPropertyDescriptor(
      Element.prototype, property) ||
    Object.getOwnPropertyDescriptor(
      Node.prototype, property);
  }
  return descriptors[property].get.call(element);
}

/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

// NOTE: normalize event contruction where necessary (IE11)
var NormalizedEvent = typeof Event === 'function' ? Event :
  function(inType, params) {
    params = params || {};
    var e = document.createEvent('Event');
    e.initEvent(inType, Boolean(params.bubbles), Boolean(params.cancelable));
    return e;
  };

var Distributor = (function () {
  function anonymous(root) {
    this.root = root;
    this.insertionPointTag = 'slot';
  }

  anonymous.prototype.getInsertionPoints = function getInsertionPoints () {
    return this.root.querySelectorAll(this.insertionPointTag);
  };

  anonymous.prototype.hasInsertionPoint = function hasInsertionPoint () {
    return Boolean(this.root._insertionPoints &&
      this.root._insertionPoints.length);
  };

  anonymous.prototype.isInsertionPoint = function isInsertionPoint (node) {
    return node.localName && node.localName == this.insertionPointTag;
  };

  anonymous.prototype.distribute = function distribute () {
    if (this.hasInsertionPoint()) {
      return this.distributePool(this.root, this.collectPool());
    }
    return [];
  };

  // Gather the pool of nodes that should be distributed. We will combine
  // these with the "content root" to arrive at the composed tree.
  anonymous.prototype.collectPool = function collectPool () {
    return tree.arrayCopy(
      tree.Logical.getChildNodes(this.root.host));
  };

  // perform "logical" distribution; note, no actual dom is moved here,
  // instead elements are distributed into storage
  // array where applicable.
  anonymous.prototype.distributePool = function distributePool (node, pool) {
    var this$1 = this;

    var dirtyRoots = [];
    var p$ = this.root._insertionPoints;
    for (var i=0, l=p$.length, p; (i<l) && (p=p$[i]); i++) {
      this$1.distributeInsertionPoint(p, pool);
      // provoke redistribution on insertion point parents
      // must do this on all candidate hosts since distribution in this
      // scope invalidates their distribution.
      // only get logical parent.
      var parent = tree.Logical.getParentNode(p);
      if (parent && parent.shadyRoot &&
          this$1.hasInsertionPoint(parent.shadyRoot)) {
        dirtyRoots.push(parent.shadyRoot);
      }
    }
    for (var i$1=0; i$1 < pool.length; i$1++) {
      var p$1 = pool[i$1];
      if (p$1) {
        p$1._assignedSlot = undefined;
        // remove undistributed elements from physical dom.
        var parent$1 = tree.Composed.getParentNode(p$1);
        if (parent$1) {
          tree.Composed.removeChild(parent$1, p$1);
        }
      }
    }
    return dirtyRoots;
  };

  anonymous.prototype.distributeInsertionPoint = function distributeInsertionPoint (insertionPoint, pool) {
    var this$1 = this;

    var prevAssignedNodes = insertionPoint._assignedNodes;
    if (prevAssignedNodes) {
      this.clearAssignedSlots(insertionPoint, true);
    }
    insertionPoint._assignedNodes = [];
    var needsSlotChange = false;
    // distribute nodes from the pool that this selector matches
    var anyDistributed = false;
    for (var i=0, l=pool.length, node; i < l; i++) {
      node=pool[i];
      // skip nodes that were already used
      if (!node) {
        continue;
      }
      // distribute this node if it matches
      if (this$1.matchesInsertionPoint(node, insertionPoint)) {
        if (node.__prevAssignedSlot != insertionPoint) {
          needsSlotChange = true;
        }
        this$1.distributeNodeInto(node, insertionPoint)
        // remove this node from the pool
        pool[i] = undefined;
        // since at least one node matched, we won't need fallback content
        anyDistributed = true;
      }
    }
    // Fallback content if nothing was distributed here
    if (!anyDistributed) {
      var children = tree.Logical.getChildNodes(insertionPoint);
      for (var j = 0, node$1; j < children.length; j++) {
        node$1 = children[j];
        if (node$1.__prevAssignedSlot != insertionPoint) {
          needsSlotChange = true;
        }
        this$1.distributeNodeInto(node$1, insertionPoint);
      }
    }
    // we're already dirty if a node was newly added to the slot
    // and we're also dirty if the assigned count decreased.
    if (prevAssignedNodes) {
      // TODO(sorvell): the tracking of previously assigned slots
      // could instead by done with a Set and then we could
      // avoid needing to iterate here to clear the info.
      for (var i$1=0; i$1 < prevAssignedNodes.length; i$1++) {
        prevAssignedNodes[i$1].__prevAssignedSlot = null;
      }
      if (insertionPoint._assignedNodes.length < prevAssignedNodes.length) {
        needsSlotChange = true;
      }
    }
    this.setDistributedNodesOnInsertionPoint(insertionPoint);
    if (needsSlotChange) {
      this._fireSlotChange(insertionPoint);
    }
  };

  anonymous.prototype.clearAssignedSlots = function clearAssignedSlots (slot, savePrevious) {
    var n$ = slot._assignedNodes;
    if (n$) {
      for (var i=0; i < n$.length; i++) {
        var n = n$[i];
        if (savePrevious) {
          n.__prevAssignedSlot = n._assignedSlot;
        }
        // only clear if it was previously set to this slot;
        // this helps ensure that if the node has otherwise been distributed
        // ignore it.
        if (n._assignedSlot === slot) {
          n._assignedSlot = null;
        }
      }
    }
  };

  anonymous.prototype.matchesInsertionPoint = function matchesInsertionPoint (node, insertionPoint) {
    var slotName = insertionPoint.getAttribute('name');
    slotName = slotName ? slotName.trim() : '';
    var slot = node.getAttribute && node.getAttribute('slot');
    slot = slot ? slot.trim() : '';
    return (slot == slotName);
  };

  anonymous.prototype.distributeNodeInto = function distributeNodeInto (child, insertionPoint) {
    insertionPoint._assignedNodes.push(child);
    child._assignedSlot = insertionPoint;
  };

  anonymous.prototype.setDistributedNodesOnInsertionPoint = function setDistributedNodesOnInsertionPoint (insertionPoint) {
    var this$1 = this;

    var n$ = insertionPoint._assignedNodes;
    insertionPoint._distributedNodes = [];
    for (var i=0, n; (i<n$.length) && (n=n$[i]) ; i++) {
      if (this$1.isInsertionPoint(n)) {
        var d$ = n._distributedNodes;
        if (d$) {
          for (var j=0; j < d$.length; j++) {
            insertionPoint._distributedNodes.push(d$[j]);
          }
        }
      } else {
        insertionPoint._distributedNodes.push(n$[i]);
      }
    }
  };

  anonymous.prototype._fireSlotChange = function _fireSlotChange (insertionPoint) {
    // NOTE: cannot bubble correctly here so not setting bubbles: true
    // Safari tech preview does not bubble but chrome does
    // Spec says it bubbles (https://dom.spec.whatwg.org/#mutation-observers)
    insertionPoint.dispatchEvent(new NormalizedEvent('slotchange'));
    if (insertionPoint._assignedSlot) {
      this._fireSlotChange(insertionPoint._assignedSlot);
    }
  };

  anonymous.prototype.isFinalDestination = function isFinalDestination (insertionPoint) {
    return !(insertionPoint._assignedSlot);
  };

  return anonymous;
}())

/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/**
  Implements a pared down version of ShadowDOM's scoping, which is easy to
  polyfill across browsers.
*/
var ShadyRoot = function ShadyRoot(host) {
  if (!host) {
    throw 'Must provide a host';
  }
  // NOTE: this strange construction is necessary because
  // DocumentFragment cannot be subclassed on older browsers.
  var frag = document.createDocumentFragment();
  frag.__proto__ = ShadyFragmentMixin;
  frag._init(host);
  return frag;
};

var ShadyMixin = {

  _init: function _init(host) {
    // NOTE: set a fake local name so this element can be
    // distinguished from a DocumentFragment when patching.
    // FF doesn't allow this to be `localName`
    this.__localName = 'ShadyRoot';
    // root <=> host
    host.shadyRoot = this;
    this.host = host;
    // logical dom setup
    tree.Logical.saveChildNodes(host);
    tree.Logical.saveChildNodes(this);
    // state flags
    this._clean = true;
    this._hasRendered = false;
    this._distributor = new Distributor(this);
    this.update();
  },

  // async render the "top" distributor (this is all that is needed to
  // distribute this host).
  update: function update() {
    // TODO(sorvell): instead the root should always be enqueued to helps record that it is dirty.
    // Then, in `render`, the top most (in the distribution tree) "dirty" root should be rendered.
    var distributionRoot = this._findDistributionRoot(this.host);
    //console.log('update from', this.host, 'root', distributionRoot.host, distributionRoot._clean);
    if (distributionRoot._clean) {
      distributionRoot._clean = false;
      enqueue(function() {
        distributionRoot.render();
      });
    }
  },

  // TODO(sorvell): this may not return a shadowRoot (for example if the element is in a docFragment)
  // this should only return a shadowRoot.
  // returns the host that's the top of this host's distribution tree
  _findDistributionRoot: function _findDistributionRoot(element) {
    var root = element.shadyRoot;
    while (element && this._elementNeedsDistribution(element)) {
      root = element.getRootNode();
      element = root && root.host;
    }
    return root;
  },

  // Return true if a host's children includes
  // an insertion point that selects selectively
  _elementNeedsDistribution: function _elementNeedsDistribution(element) {
    var this$1 = this;

    var c$ = tree.Logical.getChildNodes(element);
    for (var i=0, c; i < c$.length; i++) {
      c = c$[i];
      if (this$1._distributor.isInsertionPoint(c)) {
        return element.getRootNode();
      }
    }
  },

  render: function render() {
    if (!this._clean) {
      this._clean = true;
      if (!this._skipUpdateInsertionPoints) {
        this.updateInsertionPoints();
      } else if (!this._hasRendered) {
        this._insertionPoints = [];
      }
      this._skipUpdateInsertionPoints = false;
      // TODO(sorvell): previous ShadyDom had a fast path here
      // that would avoid distribution for initial render if
      // no insertion points exist. We cannot currently do this because
      // it relies on elements being in the physical shadowRoot element
      // so that native methods will be used. The current append code
      // simply provokes distribution in this case and does not put the
      // nodes in the shadowRoot. This could be done but we'll need to
      // consider if the special processing is worth the perf gain.
      // if (!this._hasRendered && !this._insertionPoints.length) {
      //   tree.Composed.clearChildNodes(this.host);
      //   tree.Composed.appendChild(this.host, this);
      // } else {
      // logical
      this.distribute();
      // physical
      this.compose();
      this._hasRendered = true;
    }
  },

  forceRender: function forceRender() {
    this._clean = false;
    this.render();
  },

  distribute: function distribute() {
    var dirtyRoots = this._distributor.distribute();
    for (var i=0; i<dirtyRoots.length; i++) {
      dirtyRoots[i].forceRender();
    }
  },

  updateInsertionPoints: function updateInsertionPoints() {
    var this$1 = this;

    var i$ = this.__insertionPoints;
    // if any insertion points have been removed, clear their distribution info
    if (i$) {
      for (var i=0, c; i < i$.length; i++) {
        c = i$[i];
        if (c.getRootNode() !== this$1) {
          this$1._distributor.clearAssignedSlots(c);
        }
      }
    }
    i$ = this._insertionPoints = this._distributor.getInsertionPoints();
    // ensure insertionPoints's and their parents have logical dom info.
    // save logical tree info
    // a. for shadyRoot
    // b. for insertion points (fallback)
    // c. for parents of insertion points
    for (var i$1=0, c$1; i$1 < i$.length; i$1++) {
      c$1 = i$[i$1];
      tree.Logical.saveChildNodes(c$1);
      tree.Logical.saveChildNodes(tree.Logical.getParentNode(c$1));
    }
  },

  get _insertionPoints() {
    if (!this.__insertionPoints) {
      this.updateInsertionPoints();
    }
    return this.__insertionPoints || (this.__insertionPoints = []);
  },

  set _insertionPoints(insertionPoints) {
    this.__insertionPoints = insertionPoints;
  },

  hasInsertionPoint: function hasInsertionPoint() {
    return this._distributor.hasInsertionPoint();
  },

  compose: function compose() {
    // compose self
    // note: it's important to mark this clean before distribution
    // so that attachment that provokes additional distribution (e.g.
    // adding something to your parentNode) works
    this._composeTree();
    // TODO(sorvell): See fast paths here in Polymer v1
    // (these seem unnecessary)
  },

  // Reify dom such that it is at its correct rendering position
  // based on logical distribution.
  _composeTree: function _composeTree() {
    var this$1 = this;

    this._updateChildNodes(this.host, this._composeNode(this.host));
    var p$ = this._insertionPoints || [];
    for (var i=0, l=p$.length, p, parent; (i<l) && (p=p$[i]); i++) {
      parent = tree.Logical.getParentNode(p);
      if ((parent !== this$1.host) && (parent !== this$1)) {
        this$1._updateChildNodes(parent, this$1._composeNode(parent));
      }
    }
  },

  // Returns the list of nodes which should be rendered inside `node`.
  _composeNode: function _composeNode(node) {
    var this$1 = this;

    var children = [];
    var c$ = tree.Logical.getChildNodes(node.shadyRoot || node);
    for (var i = 0; i < c$.length; i++) {
      var child = c$[i];
      if (this$1._distributor.isInsertionPoint(child)) {
        var distributedNodes = child._distributedNodes ||
          (child._distributedNodes = []);
        for (var j = 0; j < distributedNodes.length; j++) {
          var distributedNode = distributedNodes[j];
          if (this$1.isFinalDestination(child, distributedNode)) {
            children.push(distributedNode);
          }
        }
      } else {
        children.push(child);
      }
    }
    return children;
  },

  isFinalDestination: function isFinalDestination(insertionPoint, node) {
    return this._distributor.isFinalDestination(
      insertionPoint, node);
  },

  // Ensures that the rendered node list inside `container` is `children`.
  _updateChildNodes: function _updateChildNodes(container, children) {
    var composed = tree.Composed.getChildNodes(container);
    var splices = calculateSplices(children, composed);
    // process removals
    for (var i=0, d=0, s; (i<splices.length) && (s=splices[i]); i++) {
      for (var j=0, n; (j < s.removed.length) && (n=s.removed[j]); j++) {
        // check if the node is still where we expect it is before trying
        // to remove it; this can happen if we move a node and
        // then schedule its previous host for distribution resulting in
        // the node being removed here.
        if (tree.Composed.getParentNode(n) === container) {
          tree.Composed.removeChild(container, n);
        }
        composed.splice(s.index + d, 1);
      }
      d -= s.addedCount;
    }
    // process adds
    for (var i$1=0, s$1, next; (i$1<splices.length) && (s$1=splices[i$1]); i$1++) { //eslint-disable-line no-redeclare
      next = composed[s$1.index];
      for (var j$1=s$1.index, n$1; j$1 < s$1.index + s$1.addedCount; j$1++) {
        n$1 = children[j$1];
        tree.Composed.insertBefore(container, n$1, next);
        // TODO(sorvell): is this splice strictly needed?
        composed.splice(j$1, 0, n$1);
      }
    }
  },

  getInsertionPointTag: function getInsertionPointTag() {
    return this._distributor.insertionPointTag;
  }

}

var ShadyFragmentMixin = Object.create(DocumentFragment.prototype);
extend(ShadyFragmentMixin, ShadyMixin);

// let needsUpgrade = window.CustomElements && !CustomElements.useNative;

// function upgradeLogicalChildren(children) {
//   if (needsUpgrade && children) {
//     for (let i=0; i < children.length; i++) {
//       CustomElements.upgrade(children[i]);
//     }
//   }
// }

// render enqueuer/flusher
var customElements = window.customElements;
var flushList = [];
var scheduled;
var flushCount = 0;
var flushMax = 100;
function enqueue(callback) {
  if (!scheduled) {
    scheduled = true;
    promish.then(flush$1);
  }
  flushList.push(callback);
}

function flush$1() {
  scheduled = false;
  flushCount++;
  while (flushList.length) {
    flushList.shift()();
  }
  if (customElements && customElements.flush) {
    customElements.flush();
  }
  // continue flushing after elements are upgraded...
  var isFlushedMaxed = (flushCount > flushMax);
  if (flushList.length && !isFlushedMaxed) {
      flush$1();
  }
  flushCount = 0;
  if (isFlushedMaxed) {
    throw new Error('Loop detected in ShadyDOM distribution, aborting.')
  }
}

flush$1.list = flushList;

/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

// Cribbed from ShadowDOM polyfill
// https://github.com/webcomponents/webcomponentsjs/blob/master/src/ShadowDOM/wrappers/HTMLElement.js#L28
/////////////////////////////////////////////////////////////////////////////
// innerHTML and outerHTML

// http://www.whatwg.org/specs/web-apps/current-work/multipage/the-end.html#escapingString
var escapeAttrRegExp = /[&\u00A0"]/g;
var escapeDataRegExp = /[&\u00A0<>]/g;

function escapeReplace(c) {
  switch (c) {
    case '&':
      return '&amp;';
    case '<':
      return '&lt;';
    case '>':
      return '&gt;';
    case '"':
      return '&quot;';
    case '\u00A0':
      return '&nbsp;';
  }
}

function escapeAttr(s) {
  return s.replace(escapeAttrRegExp, escapeReplace);
}

function escapeData(s) {
  return s.replace(escapeDataRegExp, escapeReplace);
}

function makeSet(arr) {
  var set = {};
  for (var i = 0; i < arr.length; i++) {
    set[arr[i]] = true;
  }
  return set;
}

// http://www.whatwg.org/specs/web-apps/current-work/#void-elements
var voidElements = makeSet([
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
]);

var plaintextParents = makeSet([
  'style',
  'script',
  'xmp',
  'iframe',
  'noembed',
  'noframes',
  'plaintext',
  'noscript'
]);

function getOuterHTML(node, parentNode, composed) {
  switch (node.nodeType) {
    case Node.ELEMENT_NODE: {
      var tagName = node.localName;
      var s = '<' + tagName;
      var attrs = node.attributes;
      for (var i = 0, attr; (attr = attrs[i]); i++) {
        s += ' ' + attr.name + '="' + escapeAttr(attr.value) + '"';
      }
      s += '>';
      if (voidElements[tagName]) {
        return s;
      }
      return s + getInnerHTML(node, composed) + '</' + tagName + '>';
    }
    case Node.TEXT_NODE: {
      var data = node.data;
      if (parentNode && plaintextParents[parentNode.localName]) {
        return data;
      }
      return escapeData(data);
    }
    case Node.COMMENT_NODE: {
      return '<!--' + node.data + '-->';
    }
    default: {
      window.console.error(node);
      throw new Error('not implemented');
    }
  }
}

function getInnerHTML(node, composed) {
  if (node.localName === 'template') {
    node = node.content;
  }
  var s = '';
  var c$ = composed ? composed(node) : node.childNodes;
  for (var i=0, l=c$.length, child; (i<l) && (child=c$[i]); i++) {
    s += getOuterHTML(child, node, composed);
  }
  return s;
}

/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

var mixinImpl = {

  // Try to add node. Record logical info, track insertion points, perform
  // distribution iff needed. Return true if the add is handled.
  addNode: function addNode(container, node, ref_node) {
    var ownerRoot = this.ownerShadyRootForNode(container);
    if (ownerRoot) {
      // optimization: special insertion point tracking
      if (node.__noInsertionPoint && ownerRoot._clean) {
        ownerRoot._skipUpdateInsertionPoints = true;
      }
      // note: we always need to see if an insertion point is added
      // since this saves logical tree info; however, invalidation state
      // needs
      var ipAdded = this._maybeAddInsertionPoint(node, container, ownerRoot);
      // invalidate insertion points IFF not already invalid!
      if (ipAdded) {
        ownerRoot._skipUpdateInsertionPoints = false;
      }
    }
    if (tree.Logical.hasChildNodes(container)) {
      tree.Logical.recordInsertBefore(node, container, ref_node);
    }
    // if not distributing and not adding to host, do a fast path addition
    var handled = this._maybeDistribute(node, container, ownerRoot) ||
      container.shadyRoot;
    return handled;
  },

  // Try to remove node: update logical info and perform distribution iff
  // needed. Return true if the removal has been handled.
  // note that it's possible for both the node's host and its parent
  // to require distribution... both cases are handled here.
  removeNode: function removeNode(node) {
    // important that we want to do this only if the node has a logical parent
    var logicalParent = tree.Logical.hasParentNode(node) &&
      tree.Logical.getParentNode(node);
    var distributed;
    var ownerRoot = this.ownerShadyRootForNode(node);
    if (logicalParent) {
      // distribute node's parent iff needed
      distributed = this.maybeDistributeParent(node);
      tree.Logical.recordRemoveChild(node, logicalParent);
      // remove node from root and distribute it iff needed
      if (ownerRoot && (this._removeDistributedChildren(ownerRoot, node) ||
        logicalParent.localName === ownerRoot.getInsertionPointTag())) {
        ownerRoot._skipUpdateInsertionPoints = false;
        ownerRoot.update();
      }
    }
    this._removeOwnerShadyRoot(node);
    return distributed;
  },


  _scheduleObserver: function _scheduleObserver(node, addedNode, removedNode) {
    var observer = node.__dom && node.__dom.observer;
    if (observer) {
      if (addedNode) {
        observer.addedNodes.push(addedNode);
      }
      if (removedNode) {
        observer.removedNodes.push(removedNode);
      }
      observer.schedule();
    }
  },

  removeNodeFromParent: function removeNodeFromParent(node, parent) {
    if (parent) {
      this._scheduleObserver(parent, null, node);
      this.removeNode(node);
    } else {
      this._removeOwnerShadyRoot(node);
    }
  },

  _hasCachedOwnerRoot: function _hasCachedOwnerRoot(node) {
    return Boolean(node.__ownerShadyRoot !== undefined);
  },

  getRootNode: function getRootNode$1(node) {
    if (!node || !node.nodeType) {
      return;
    }
    var root = node.__ownerShadyRoot;
    if (root === undefined) {
      if (isShadyRoot(node)) {
        root = node;
      } else {
        var parent = tree.Logical.getParentNode(node);
        root = parent ? this.getRootNode(parent) : node;
      }
      // memo-ize result for performance but only memo-ize
      // result if node is in the document. This avoids a problem where a root
      // can be cached while an element is inside a fragment.
      // If this happens and we cache the result, the value can become stale
      // because for perf we avoid processing the subtree of added fragments.
      if (document.documentElement.contains(node)) {
        node.__ownerShadyRoot = root;
      }
    }
    return root;
  },

  ownerShadyRootForNode: function ownerShadyRootForNode(node) {
    var root = this.getRootNode(node);
    if (isShadyRoot(root)) {
      return root;
    }
  },

  _maybeDistribute: function _maybeDistribute(node, container, ownerRoot) {
    // TODO(sorvell): technically we should check non-fragment nodes for
    // <content> children but since this case is assumed to be exceedingly
    // rare, we avoid the cost and will address with some specific api
    // when the need arises.  For now, the user must call
    // distributeContent(true), which updates insertion points manually
    // and forces distribution.
    var insertionPointTag = ownerRoot && ownerRoot.getInsertionPointTag() || '';
    var fragContent = (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) &&
      !node.__noInsertionPoint &&
      insertionPointTag && node.querySelector(insertionPointTag);
    var wrappedContent = fragContent &&
      (tree.Logical.getParentNode(fragContent).nodeType !==
      Node.DOCUMENT_FRAGMENT_NODE);
    var hasContent = fragContent || (node.localName === insertionPointTag);
    // There are 3 possible cases where a distribution may need to occur:
    // 1. <content> being inserted (the host of the shady root where
    //    content is inserted needs distribution)
    // 2. children being inserted into parent with a shady root (parent
    //    needs distribution)
    // 3. container is an insertionPoint
    if (hasContent || (container.localName === insertionPointTag)) {
      if (ownerRoot) {
        // note, insertion point list update is handled after node
        // mutations are complete
        ownerRoot.update();
      }
    }
    var needsDist = this._nodeNeedsDistribution(container);
    if (needsDist) {
      container.shadyRoot.update();
    }
    // Return true when distribution will fully handle the composition
    // Note that if a content was being inserted that was wrapped by a node,
    // and the parent does not need distribution, return false to allow
    // the nodes to be added directly, after which children may be
    // distributed and composed into the wrapping node(s)
    return needsDist || (hasContent && !wrappedContent);
  },

  /* note: parent argument is required since node may have an out
  of date parent at this point; returns true if a <content> is being added */
  _maybeAddInsertionPoint: function _maybeAddInsertionPoint(node, parent, root) {
    var this$1 = this;

    var added;
    var insertionPointTag = root.getInsertionPointTag();
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE &&
      !node.__noInsertionPoint) {
      var c$ = node.querySelectorAll(insertionPointTag);
      for (var i=0, n, np, na; (i<c$.length) && (n=c$[i]); i++) {
        np = tree.Logical.getParentNode(n);
        // don't allow node's parent to be fragment itself
        if (np === node) {
          np = parent;
        }
        na = this$1._maybeAddInsertionPoint(n, np, root);
        added = added || na;
      }
    } else if (node.localName === insertionPointTag) {
      tree.Logical.saveChildNodes(parent);
      tree.Logical.saveChildNodes(node);
      added = true;
    }
    return added;
  },

  _nodeNeedsDistribution: function _nodeNeedsDistribution(node) {
    return node && node.shadyRoot &&
      node.shadyRoot.hasInsertionPoint();
  },

  _removeDistributedChildren: function _removeDistributedChildren(root, container) {
    var this$1 = this;

    var hostNeedsDist;
    var ip$ = root._insertionPoints;
    for (var i=0; i<ip$.length; i++) {
      var insertionPoint = ip$[i];
      if (this$1._contains(container, insertionPoint)) {
        var dc$ = insertionPoint.assignedNodes({flatten: true});
        for (var j=0; j<dc$.length; j++) {
          hostNeedsDist = true;
          var node = dc$[j];
          var parent = tree.Composed.getParentNode(node);
          if (parent) {
            tree.Composed.removeChild(parent, node);
          }
        }
      }
    }
    return hostNeedsDist;
  },

  _contains: function _contains(container, node) {
    while (node) {
      if (node == container) {
        return true;
      }
      node = tree.Logical.getParentNode(node);
    }
  },

  _removeOwnerShadyRoot: function _removeOwnerShadyRoot(node) {
    var this$1 = this;

    // optimization: only reset the tree if node is actually in a root
    if (this._hasCachedOwnerRoot(node)) {
      var c$ = tree.Logical.getChildNodes(node);
      for (var i=0, l=c$.length, n; (i<l) && (n=c$[i]); i++) {
        this$1._removeOwnerShadyRoot(n);
      }
    }
    node.__ownerShadyRoot = undefined;
  },

  // TODO(sorvell): This will fail if distribution that affects this
  // question is pending; this is expected to be exceedingly rare, but if
  // the issue comes up, we can force a flush in this case.
  firstComposedNode: function firstComposedNode(insertionPoint) {
    var n$ = insertionPoint.assignedNodes({flatten: true});
    var root = this.getRootNode(insertionPoint);
    for (var i=0, l=n$.length, n; (i<l) && (n=n$[i]); i++) {
      // means that we're composed to this spot.
      if (root.isFinalDestination(insertionPoint, n)) {
        return n;
      }
    }
  },

  clearNode: function clearNode(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  },

  maybeDistributeParent: function maybeDistributeParent(node) {
    var parent = tree.Logical.getParentNode(node);
    if (this._nodeNeedsDistribution(parent)) {
      parent.shadyRoot.update();
      return true;
    }
  },

  maybeDistributeAttributeChange: function maybeDistributeAttributeChange(node, name) {
    if (name === 'slot') {
      this.maybeDistributeParent(node);
    } else if (node.localName === 'slot' && name === 'name') {
      var root = this.ownerShadyRootForNode(node);
      if (root) {
        root.update();
      }
    }
  },

  // NOTE: `query` is used primarily for ShadyDOM's querySelector impl,
  // but it's also generally useful to recurse through the element tree
  // and is used by Polymer's styling system.
  query: function query(node, matcher, halter) {
    var list = [];
    this._queryElements(tree.Logical.getChildNodes(node), matcher,
      halter, list);
    return list;
  },

  _queryElements: function _queryElements(elements, matcher, halter, list) {
    var this$1 = this;

    for (var i=0, l=elements.length, c; (i<l) && (c=elements[i]); i++) {
      if (c.nodeType === Node.ELEMENT_NODE &&
          this$1._queryElement(c, matcher, halter, list)) {
        return true;
      }
    }
  },

  _queryElement: function _queryElement(node, matcher, halter, list) {
    var result = matcher(node);
    if (result) {
      list.push(node);
    }
    if (halter && halter(result)) {
      return result;
    }
    this._queryElements(tree.Logical.getChildNodes(node), matcher,
      halter, list);
  },

  activeElementForNode: function activeElementForNode(node) {
    var this$1 = this;

    var active = document.activeElement;
    if (!active) {
      return null;
    }
    var isShadyRoot$$1 = !!(isShadyRoot(node));
    if (node !== document) {
      // If this node isn't a document or shady root, then it doesn't have
      // an active element.
      if (!isShadyRoot$$1) {
        return null;
      }
      // If this shady root's host is the active element or the active
      // element is not a descendant of the host (in the composed tree),
      // then it doesn't have an active element.
      if (node.host === active ||
          !node.host.contains(active)) {
        return null;
      }
    }
    // This node is either the document or a shady root of which the active
    // element is a (composed) descendant of its host; iterate upwards to
    // find the active element's most shallow host within it.
    var activeRoot = this.ownerShadyRootForNode(active);
    while (activeRoot && activeRoot !== node) {
      active = activeRoot.host;
      activeRoot = this$1.ownerShadyRootForNode(active);
    }
    if (node === document) {
      // This node is the document, so activeRoot should be null.
      return activeRoot ? null : active;
    } else {
      // This node is a non-document shady root, and it should be
      // activeRoot.
      return activeRoot === node ? active : null;
    }
  }

};

var nativeCloneNode = Element.prototype.cloneNode;
var nativeImportNode = Document.prototype.importNode;
var nativeSetAttribute$1 = Element.prototype.setAttribute;
var nativeRemoveAttribute = Element.prototype.removeAttribute;

var setAttribute = function(attr, value) {
  // avoid scoping elements in non-main document to avoid template documents
  if (window.ShadyCSS && attr === 'class' && this.ownerDocument === document) {
    window.ShadyCSS.setElementClass(this, value);
  } else {
    nativeSetAttribute$1.call(this, attr, value);
  }
}

var NodeMixin = {};

Object.defineProperties(NodeMixin, {

  parentElement: {
    get: function get() {
      return tree.Logical.getParentNode(this);
    },
    configurable: true
  },

  parentNode: {
    get: function get$1() {
      return tree.Logical.getParentNode(this);
    },
    configurable: true
  },

  nextSibling: {
    get: function get$2() {
      return tree.Logical.getNextSibling(this);
    },
    configurable: true
  },

  previousSibling: {
    get: function get$3() {
      return tree.Logical.getPreviousSibling(this);
    },
    configurable: true
  },

  nextElementSibling: {
    get: function get$4() {
      return tree.Logical.getNextElementSibling(this);
    },
    configurable: true
  },

  previousElementSibling: {
    get: function get$5() {
      return tree.Logical.getPreviousElementSibling(this);
    },
    configurable: true
  },

  assignedSlot: {
    get: function get$6() {
      return this._assignedSlot;
    },
    configurable: true
  }
});

var FragmentMixin = {

  appendChild: function appendChild(node) {
    return this.insertBefore(node);
  },

  // cases in which we may not be able to just do standard native call
  // 1. container has a shadyRoot (needsDistribution IFF the shadyRoot
  // has an insertion point)
  // 2. container is a shadyRoot (don't distribute, instead set
  // container to container.host.
  // 3. node is <content> (host of container needs distribution)
  insertBefore: function insertBefore(node, ref_node) {
    if (ref_node && tree.Logical.getParentNode(ref_node) !== this) {
      throw Error('The ref_node to be inserted before is not a child ' +
        'of this node');
    }
    // remove node from its current position iff it's in a tree.
    if (node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
      var parent = tree.Logical.getParentNode(node);
      mixinImpl.removeNodeFromParent(node, parent);
    }
    if (!mixinImpl.addNode(this, node, ref_node)) {
      if (ref_node) {
        // if ref_node is an insertion point replace with first distributed node
        var root = mixinImpl.ownerShadyRootForNode(ref_node);
        if (root) {
          ref_node = ref_node.localName === root.getInsertionPointTag() ?
            mixinImpl.firstComposedNode(ref_node) : ref_node;
        }
      }
      // if adding to a shadyRoot, add to host instead
      var container = isShadyRoot(this) ?
        this.host : this;
      if (ref_node) {
        tree.Composed.insertBefore(container, node, ref_node);
      } else {
        tree.Composed.appendChild(container, node);
      }
    }
    mixinImpl._scheduleObserver(this, node);
    return node;
  },

  /**
    Removes the given `node` from the element's `lightChildren`.
    This method also performs dom composition.
  */
  removeChild: function removeChild(node) {
    if (tree.Logical.getParentNode(node) !== this) {
      throw Error('The node to be removed is not a child of this node: ' +
        node);
    }
    if (!mixinImpl.removeNode(node)) {
      // if removing from a shadyRoot, remove form host instead
      var container = isShadyRoot(this) ?
        this.host :
        this;
      // not guaranteed to physically be in container; e.g.
      // undistributed nodes.
      var parent = tree.Composed.getParentNode(node);
      if (container === parent) {
        tree.Composed.removeChild(container, node);
      }
    }
    mixinImpl._scheduleObserver(this, null, node);
    return node;
  },

  replaceChild: function replaceChild(node, ref_node) {
    this.insertBefore(node, ref_node);
    this.removeChild(ref_node);
    return node;
  },

  // TODO(sorvell): consider doing native QSA and filtering results.
  querySelector: function querySelector(selector) {
    // match selector and halt on first result.
    var result = mixinImpl.query(this, function(n) {
      return matchesSelector(n, selector);
    }, function(n) {
      return Boolean(n);
    })[0];
    return result || null;
  },

  querySelectorAll: function querySelectorAll(selector) {
    return mixinImpl.query(this, function(n) {
      return matchesSelector(n, selector);
    });
  },

  cloneNode: function cloneNode(deep) {
    if (this.localName == 'template') {
      return nativeCloneNode.call(this, deep);
    } else {
      var n = nativeCloneNode.call(this, false);
      if (deep) {
        var c$ = this.childNodes;
        for (var i=0, nc; i < c$.length; i++) {
          nc = c$[i].cloneNode(true);
          n.appendChild(nc);
        }
      }
      return n;
    }
  },

  importNode: function importNode(externalNode, deep) {
    // for convenience use this node's ownerDoc if the node isn't a document
    var doc = this instanceof Document ? this :
      this.ownerDocument;
    var n = nativeImportNode.call(doc, externalNode, false);
    if (deep) {
      var c$ = tree.Logical.getChildNodes(externalNode);
      common.patchNode(n);
      for (var i=0, nc; i < c$.length; i++) {
        nc = doc.importNode(c$[i], true);
        n.appendChild(nc);
      }
    }
    return n;
  }
};

Object.defineProperties(FragmentMixin, {

  childNodes: {
    get: function get$7() {
      var c$ = tree.Logical.getChildNodes(this);
      return Array.isArray(c$) ? c$ : tree.arrayCopyChildNodes(this);
    },
    configurable: true
  },

  children: {
    get: function get$8() {
      if (tree.Logical.hasChildNodes(this)) {
        return Array.prototype.filter.call(this.childNodes, function(n) {
          return (n.nodeType === Node.ELEMENT_NODE);
        });
      } else {
        return tree.arrayCopyChildren(this);
      }
    },
    configurable: true
  },

  firstChild: {
    get: function get$9() {
      return tree.Logical.getFirstChild(this);
    },
    configurable: true
  },

  lastChild: {
    get: function get$10() {
      return tree.Logical.getLastChild(this);
    },
    configurable: true
  },

  firstElementChild: {
    get: function get$11() {
      return tree.Logical.getFirstElementChild(this);
    },
    configurable: true
  },

  lastElementChild: {
    get: function get$12() {
      return tree.Logical.getLastElementChild(this);
    },
    configurable: true
  },

  // TODO(srovell): strictly speaking fragments do not have textContent
  // or innerHTML but ShadowRoots do and are not easily distinguishable.
  // textContent / innerHTML
  textContent: {
    get: function get$13() {
      if (this.childNodes) {
        var tc = [];
        for (var i = 0, cn = this.childNodes, c; (c = cn[i]); i++) {
          if (c.nodeType !== Node.COMMENT_NODE) {
            tc.push(c.textContent);
          }
        }
        return tc.join('');
      }
      return '';
    },
    set: function set(text) {
      mixinImpl.clearNode(this);
      if (text) {
        this.appendChild(document.createTextNode(text));
      }
    },
    configurable: true
  },

  innerHTML: {
    get: function get$14() {
      return getInnerHTML(this);
    },
    set: function set$1(text) {
      var this$1 = this;

      mixinImpl.clearNode(this);
      var d = document.createElement('div');
      d.innerHTML = text;
      // here, appendChild may move nodes async so we cannot rely
      // on node position when copying
      var c$ = tree.arrayCopyChildNodes(d);
      for (var i=0; i < c$.length; i++) {
        this$1.appendChild(c$[i]);
      }
    },
    configurable: true
  }

});

var ElementMixin = {

  // TODO(sorvell): should only exist on <slot>
  assignedNodes: function assignedNodes(options) {
    return (options && options.flatten ? this._distributedNodes :
      this._assignedNodes) || [];
  },


  setAttribute: function setAttribute$1(name, value) {
    setAttribute.call(this, name, value);
    mixinImpl.maybeDistributeAttributeChange(this, name);
  },

  removeAttribute: function removeAttribute(name) {
    nativeRemoveAttribute.call(this, name);
    mixinImpl.maybeDistributeAttributeChange(this, name);
  }

};

Object.defineProperties(ElementMixin, {

  shadowRoot: {
    get: function get$15() {
      return this.shadyRoot;
    }
  },

  slot: {
    get: function get$16() {
      return this.getAttribute('slot');
    },
    set: function set$2(value) {
      this.setAttribute('slot', value);
    }
  }

});

var activeElementDescriptor = {
  get: function get$17() {
    return mixinImpl.activeElementForNode(this);
  }
}

var ActiveElementMixin = {};
Object.defineProperties(ActiveElementMixin, {
  activeElement: activeElementDescriptor
});

var UnderActiveElementMixin = {};
Object.defineProperties(UnderActiveElementMixin, {
  _activeElement: activeElementDescriptor
});

var Mixins = {

  Node: extendAll({__patched: 'Node'}, NodeMixin),

  Fragment: extendAll({__patched: 'Fragment'},
    NodeMixin, FragmentMixin, ActiveElementMixin),

  Element: extendAll({__patched: 'Element'},
    NodeMixin, FragmentMixin, ElementMixin, ActiveElementMixin),

  // Note: activeElement cannot be patched on document!
  Document: extendAll({__patched: 'Document'},
    NodeMixin, FragmentMixin, ElementMixin, UnderActiveElementMixin)

};

var getRootNode = function(node) {
  return mixinImpl.getRootNode(node);
}

function filterMutations(mutations, target) {
  var targetRootNode = getRootNode(target);
  return mutations.map(function(mutation) {
    var mutationInScope = (targetRootNode === getRootNode(mutation.target));
    if (mutationInScope && mutation.addedNodes) {
      var nodes = Array.from(mutation.addedNodes).filter(function(n) {
        return (targetRootNode === getRootNode(n));
      });
      if (nodes.length) {
        mutation = Object.create(mutation);
        Object.defineProperty(mutation, 'addedNodes', {
          value: nodes,
          configurable: true
        });
        return mutation;
      }
    } else if (mutationInScope) {
      return mutation;
    }
  }).filter(function(m) { return m});
}

// const promise = Promise.resolve();

var AsyncObserver = function AsyncObserver() {
  this._scheduled = false;
  this.addedNodes = [];
  this.removedNodes = [];
  this.callbacks = new Set();
};

AsyncObserver.prototype.schedule = function schedule () {
    var this$1 = this;

  if (!this._scheduled) {
    this._scheduled = true;
    promish.then(function () {
      this$1.flush();
    });
  }
};

AsyncObserver.prototype.flush = function flush () {
  if (this._scheduled) {
    this._scheduled = false;
    var mutations = this.takeRecords();
    if (mutations.length) {
      this.callbacks.forEach(function(cb) {
        cb(mutations);
      });
    }
  }
};

AsyncObserver.prototype.takeRecords = function takeRecords () {
  if (this.addedNodes.length || this.removedNodes.length) {
    var mutations = [{
      addedNodes: this.addedNodes,
      removedNodes: this.removedNodes
    }];
    this.addedNodes = [];
    this.removedNodes = [];
    return mutations;
  }
  return [];
};

var getComposedInnerHTML = function(node) {
  if (common.isNodePatched(node)) {
    return getInnerHTML(node, function(n) {
      return tree.Composed.getChildNodes(n);
    })
  } else {
    return node.innerHTML;
  }
}

var getComposedChildNodes$1 = function(node) {
  return common.isNodePatched(node) ?
    tree.Composed.getChildNodes(node) :
    node.childNodes;
}

// TODO(sorvell): consider instead polyfilling MutationObserver
// directly so that users do not have to fork their code.
// Supporting the entire api may be challenging: e.g. filtering out
// removed nodes in the wrong scope and seeing non-distributing
// subtree child mutations.
var observeChildren = function(node, callback) {
  common.patchNode(node);
  if (!node.__dom.observer) {
    node.__dom.observer = new AsyncObserver();
  }
  node.__dom.observer.callbacks.add(callback);
  var observer = node.__dom.observer;
  return {
    _callback: callback,
    _observer: observer,
    _node: node,
    takeRecords: function takeRecords() {
      return observer.takeRecords()
    }
  };
}

var unobserveChildren = function(handle) {
  var observer = handle && handle._observer;
  if (observer) {
    observer.callbacks.delete(handle._callback);
    if (!observer.callbacks.size) {
      handle._node.__dom.observer = null;
    }
  }
}

/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/**
 * Patches elements that interacts with ShadyDOM
 * such that tree traversal and mutation apis act like they would under
 * ShadowDOM.
 *
 * This import enables seemless interaction with ShadyDOM powered
 * custom elements, enabling better interoperation with 3rd party code,
 * libraries, and frameworks that use DOM tree manipulation apis.
 */

var patchedCount = 0;

var log = false;

var patchImpl = {

  canPatchNode: function(node) {
    switch (node) {
      case document.head:
      case document.documentElement:
        return false;
      default:
        return true;
    }
  },

  hasPrototypeDescriptors: Boolean(Object.getOwnPropertyDescriptor(
    window.Node.prototype, 'textContent')),

  patch: function(node) {
    patchedCount++;
    log && window.console.warn('patch node', node);
    if (this.hasPrototypeDescriptors) {
      patchPrototype(node, this.mixinForObject(node));
    } else {
      window.console.warn('Patching instance rather than prototype', node);
      extend(node, this.mixinForObject(node));
    }
  },

  mixinForObject: function(obj) {
    switch (obj.nodeType) {
      case Node.ELEMENT_NODE:
        return Mixins.Element;
      case Node.DOCUMENT_FRAGMENT_NODE:
        return Mixins.Fragment;
      case Node.DOCUMENT_NODE:
        return Mixins.Document;
      case Node.TEXT_NODE:
      case Node.COMMENT_NODE:
        return Mixins.Node;
    }
  },

  unpatch: function(obj) {
    if (obj.__sourceProto) {
      obj.__proto__ = obj.__sourceProto;

    }
    // TODO(sorvell): implement unpatching for non-proto patchable browsers
  }

};

function patchNode(node) {
  if (!settings.inUse) {
    return;
  }
  if (!isNodePatched(node) && patchImpl.canPatchNode(node)) {
    tree.saveChildNodes(node);
    patchImpl.patch(node);
  }
}

function canUnpatchNode() {
  return Boolean(patchImpl.hasPrototypeDescriptors);
}

function unpatchNode(node) {
  patchImpl.unpatch(node);
}

function isNodePatched(node) {
  return Boolean(node.__patched);
}

// TODO(sorvell): fake export
common.patchNode = patchNode;
common.canUnpatchNode = canUnpatchNode;
common.isNodePatched = isNodePatched;

/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

var origAddEventListener = Element.prototype.addEventListener;
var origRemoveEventListener = Element.prototype.removeEventListener;

// https://github.com/w3c/webcomponents/issues/513#issuecomment-224183937
var alwaysComposed = {
  blur: true,
  focus: true,
  focusin: true,
  focusout: true,
  click: true,
  dblclick: true,
  mousedown: true,
  mouseenter: true,
  mouseleave: true,
  mousemove: true,
  mouseout: true,
  mouseover: true,
  mouseup: true,
  wheel: true,
  beforeinput: true,
  input: true,
  keydown: true,
  keyup: true,
  compositionstart: true,
  compositionupdate: true,
  compositionend: true,
  touchstart: true,
  touchend: true,
  touchmove: true,
  touchcancel: true,
  pointerover: true,
  pointerenter: true,
  pointerdown: true,
  pointermove: true,
  pointerup: true,
  pointercancel: true,
  pointerout: true,
  pointerleave: true,
  gotpointercapture: true,
  lostpointercapture: true,
  dragstart: true,
  drag: true,
  dragenter: true,
  dragleave: true,
  dragover: true,
  drop: true,
  dragend: true,
  DOMActivate: true,
  DOMFocusIn: true,
  DOMFocusOut: true,
  keypress: true
};

function pathComposer(startNode, composed) {
  var composedPath = [];
  var current = startNode;
  var startRoot = startNode === window ? window : startNode.getRootNode();
  while (current) {
    composedPath.push(current);
    if (current.assignedSlot) {
      current = current.assignedSlot;
    } else if (current.nodeType === Node.DOCUMENT_FRAGMENT_NODE && current.host && (composed || current !== startRoot)) {
      current = current.host;
    } else {
      current = current.parentNode;
    }
  }
  // event composedPath includes window when startNode's ownerRoot is document
  if (composedPath[composedPath.length - 1] === document) {
    composedPath.push(window);
  }
  return composedPath;
}

function retarget(refNode, path) {
  if (!isShadyRoot) {
    return refNode;
  }
  // If ANCESTOR's root is not a shadow root or ANCESTOR's root is BASE's
  // shadow-including inclusive ancestor, return ANCESTOR.
  var refNodePath = pathComposer(refNode, true);
  var p$ = path;
  for (var i=0, ancestor, lastRoot, root, rootIdx; i < p$.length; i++) {
    ancestor = p$[i];
    root = ancestor === window ? window : ancestor.getRootNode();
    if (root !== lastRoot) {
      rootIdx = refNodePath.indexOf(root);
      lastRoot = root;
    }
    if (!isShadyRoot(root) || rootIdx > -1) {
      return ancestor;
    }
  }
}

var EventMixin = {

  __patched: 'Event',

  get composed() {
    if (this.isTrusted && this.__composed === undefined) {
      this.__composed = alwaysComposed[this.type];
    }
    return this.__composed || false;
  },

  composedPath: function composedPath() {
    if (!this.__composedPath) {
      this.__composedPath = pathComposer(this.__target, this.composed);
    }
    return this.__composedPath;
  },

  get target() {
    return retarget(this.currentTarget, this.composedPath());
  },

  // http://w3c.github.io/webcomponents/spec/shadow/#event-relatedtarget-retargeting
  get relatedTarget() {
    if (!this.__relatedTarget) {
      return null;
    }
    if (!this.__relatedTargetComposedPath) {
      this.__relatedTargetComposedPath = pathComposer(this.__relatedTarget, true);
    }
    // find the deepest node in relatedTarget composed path that is in the same root with the currentTarget
    return retarget(this.currentTarget, this.__relatedTargetComposedPath);
  },
  stopPropagation: function stopPropagation() {
    Event.prototype.stopPropagation.call(this);
    this.__propagationStopped = true;
  },
  stopImmediatePropagation: function stopImmediatePropagation() {
    Event.prototype.stopImmediatePropagation.call(this);
    this.__immediatePropagationStopped = true;
    this.__propagationStopped = true;
  }

};

function mixinComposedFlag(Base) {
  // NOTE: avoiding use of `class` here so that transpiled output does not
  // try to do `Base.call` with a dom construtor.
  var klazz = function(type, options) {
    var event = new Base(type, options);
    event.__composed = options && Boolean(options.composed);
    return event;
  }
  // put constructor properties on subclass
  mixin(klazz, Base);
  klazz.prototype = Base.prototype;
  return klazz;
}

var nonBubblingEventsToRetarget = {
  focus: true,
  blur: true
};

function fireHandlers(event, node, phase) {
  var hs = node.__handlers && node.__handlers[event.type] &&
    node.__handlers[event.type][phase];
  if (hs) {
    for (var i = 0, fn; (fn = hs[i]); i++) {
      fn.call(node, event);
      if (event.__immediatePropagationStopped) {
        return;
      }
    }
  }
}

function retargetNonBubblingEvent(e) {
  var path = e.composedPath();
  var node;
  // override `currentTarget` to let patched `target` calculate correctly
  Object.defineProperty(e, 'currentTarget', {
    get: function() {
      return node;
    },
    configurable: true
  });
  for (var i = path.length - 1; i >= 0; i--) {
    node = path[i];
    // capture phase fires all capture handlers
    fireHandlers(e, node, 'capture');
    if (e.__propagationStopped) {
      return;
    }
  }

  // set the event phase to `AT_TARGET` as in spec
  Object.defineProperty(e, 'eventPhase', {value: Event.AT_TARGET});

  // the event only needs to be fired when owner roots change when iterating the event path
  // keep track of the last seen owner root
  var lastFiredRoot;
  for (var i$1 = 0; i$1 < path.length; i$1++) {
    node = path[i$1];
    if (i$1 === 0 || (node.shadowRoot && node.shadowRoot === lastFiredRoot)) {
      fireHandlers(e, node, 'bubble');
      // don't bother with window, it doesn't have `getRootNode` and will be last in the path anyway
      if (node !== window) {
        lastFiredRoot = node.getRootNode();
      }
      if (e.__propagationStopped) {
        return;
      }
    }
  }
}

function addEventListener(type, fn, optionsOrCapture) {
  var this$1 = this;

  if (!fn) {
    return;
  }

  // The callback `fn` might be used for multiple nodes/events. Since we generate
  // a wrapper function, we need to keep track of it when we remove the listener.
  // It's more efficient to store the node/type/options information as Array in
  // `fn` itself rather than the node (we assume that the same callback is used
  // for few nodes at most, whereas a node will likely have many event listeners).
  // NOTE(valdrin) invoking external functions is costly, inline has better perf.
  var capture, once, passive;
  if (typeof optionsOrCapture === 'object') {
    capture = Boolean(optionsOrCapture.capture);
    once = Boolean(optionsOrCapture.once);
    passive = Boolean(optionsOrCapture.passive);
  } else {
    capture = Boolean(optionsOrCapture);
    once = false;
    passive = false;
  }
  if (fn.__eventWrappers) {
    // Stop if the wrapper function has already been created.
    for (var i = 0; i < fn.__eventWrappers.length; i++) {
      if (fn.__eventWrappers[i].node === this$1 &&
          fn.__eventWrappers[i].type === type &&
          fn.__eventWrappers[i].capture === capture &&
          fn.__eventWrappers[i].once === once &&
          fn.__eventWrappers[i].passive === passive) {
        return;
      }
    }
  } else {
    fn.__eventWrappers = [];
  }

  var wrapperFn = function(e) {
    // Support `once` option.
    if (once) {
      this.removeEventListener(type, fn, optionsOrCapture);
    }
    if (!e.__target) {
      e.__target = e.target;
      e.__relatedTarget = e.relatedTarget;
      patchPrototype(e, EventMixin);
    }
    // There are two critera that should stop events from firing on this node
    // 1. the event is not composed and the current node is not in the same root as the target
    // 2. when bubbling, if after retargeting, relatedTarget and target point to the same node
    if (e.composed || e.composedPath().indexOf(this) > -1) {
      if (e.eventPhase === Event.BUBBLING_PHASE) {
        if (e.target === e.relatedTarget) {
          e.stopImmediatePropagation();
          return;
        }
      }
      return fn(e);
    }
  };
  // Store the wrapper information.
  fn.__eventWrappers.push({
    node: this,
    type: type,
    capture: capture,
    once: once,
    passive: passive,
    wrapperFn: wrapperFn
  });

  if (nonBubblingEventsToRetarget[type]) {
    this.__handlers = this.__handlers || {};
    this.__handlers[type] = this.__handlers[type] || {capture: [], bubble: []};
    this.__handlers[type][capture ? 'capture' : 'bubble'].push(wrapperFn);
  } else {
    origAddEventListener.call(this, type, wrapperFn, optionsOrCapture);
  }
}

function removeEventListener(type, fn, optionsOrCapture) {
  var this$1 = this;

  if (!fn) {
    return;
  }

  // NOTE(valdrin) invoking external functions is costly, inline has better perf.
  var capture, once, passive;
  if (typeof optionsOrCapture === 'object') {
    capture = Boolean(optionsOrCapture.capture);
    once = Boolean(optionsOrCapture.once);
    passive = Boolean(optionsOrCapture.passive);
  } else {
    capture = Boolean(optionsOrCapture);
    once = false;
    passive = false;
  }
  // Search the wrapped function.
  var wrapperFn = undefined;
  if (fn.__eventWrappers) {
    for (var i = 0; i < fn.__eventWrappers.length; i++) {
      if (fn.__eventWrappers[i].node === this$1 &&
          fn.__eventWrappers[i].type === type &&
          fn.__eventWrappers[i].capture === capture &&
          fn.__eventWrappers[i].once === once &&
          fn.__eventWrappers[i].passive === passive) {
        wrapperFn = fn.__eventWrappers.splice(i, 1)[0].wrapperFn;
        // Cleanup.
        if (!fn.__eventWrappers.length) {
          fn.__eventWrappers = undefined;
        }
        break;
      }
    }
  }

  origRemoveEventListener.call(this, type, wrapperFn || fn, optionsOrCapture);
  if (wrapperFn && nonBubblingEventsToRetarget[type] &&
      this.__handlers && this.__handlers[type]) {
    var arr = this.__handlers[type][capture ? 'capture' : 'bubble'];
    var idx = arr.indexOf(wrapperFn);
    if (idx > -1) {
      arr.splice(idx, 1);
    }
  }
}

function activateFocusEventOverrides() {
  for (var ev in nonBubblingEventsToRetarget) {
    window.addEventListener(ev, function(e) {
      if (!e.__target) {
        e.__target = e.target;
        e.__relatedTarget = e.relatedTarget;
        patchPrototype(e, EventMixin);
        retargetNonBubblingEvent(e);
        e.stopImmediatePropagation();
      }
    }, true);
  }
}


var PatchedEvent = mixinComposedFlag(Event);
var PatchedCustomEvent = mixinComposedFlag(CustomEvent);
var PatchedMouseEvent = mixinComposedFlag(MouseEvent);

/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/**
 * Patches elements that interacts with ShadyDOM
 * such that tree traversal and mutation apis act like they would under
 * ShadowDOM.
 *
 * This import enables seemless interaction with ShadyDOM powered
 * custom elements, enabling better interoperation with 3rd party code,
 * libraries, and frameworks that use DOM tree manipulation apis.
 */

if (settings.inUse) {

  window.ShadyDOM = {
    tree: tree,
    getNativeProperty: getNativeProperty,
    patch: patchNode,
    isPatched: isNodePatched,
    getComposedInnerHTML: getComposedInnerHTML,
    getComposedChildNodes: getComposedChildNodes$1,
    unpatch: unpatchNode,
    canUnpatch: canUnpatchNode,
    isShadyRoot: isShadyRoot,
    enqueue: enqueue,
    flush: flush$1,
    inUse: settings.inUse,
    filterMutations: filterMutations,
    observeChildren: observeChildren,
    unobserveChildren: unobserveChildren
  };

  var createRootAndEnsurePatched = function(node) {
    // TODO(sorvell): need to ensure ancestors are patched but this introduces
    // a timing problem with gathering composed children.
    // (1) currently the child list is crawled and patched when patching occurs
    // (this needs to change)
    // (2) we can only patch when an element has received its parsed children
    // because we cannot detect them when inserted by parser.
    // let ancestor = node;
    // while (ancestor) {
    //   patchNode(ancestor);
    //   ancestor = ancestor.parentNode || ancestor.host;
    // }
    patchNode(node);
    var root = new ShadyRoot(node);
    patchNode(root);
    return root;
  }

  Element.prototype.attachShadow = function() {
    return createRootAndEnsurePatched(this);
  }

  Node.prototype.addEventListener = addEventListener;
  Node.prototype.removeEventListener = removeEventListener;
  Event = PatchedEvent;
  CustomEvent = PatchedCustomEvent;
  MouseEvent = PatchedMouseEvent;
  activateFocusEventOverrides();

  Object.defineProperty(Node.prototype, 'isConnected', {
    get: function get() {
      return document.documentElement.contains(this);
    },
    configurable: true
  });

  Node.prototype.getRootNode = function(options) {
    return getRootNode(this, options);
  }

  Object.defineProperty(Element.prototype, 'slot', {
    get: function get$1() {
      return this.getAttribute('slot');
    },
    set: function set(value) {
      this.setAttribute('slot', value);
    },
    configurable: true
  });

  Object.defineProperty(Node.prototype, 'assignedSlot', {
    get: function get$2() {
      return this._assignedSlot || null;
    },
    configurable: true
  });

  var nativeSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = setAttribute;
  // NOTE: expose native setAttribute to allow hooking native method
  // (e.g. this is done in ShadyCSS)
  Element.prototype.__nativeSetAttribute = nativeSetAttribute;

  var classNameDescriptor = {
    get: function get$3() {
      return this.getAttribute('class');
    },
    set: function set$1(value) {
      this.setAttribute('class', value);
    },
    configurable: true
  };

  // Safari 9 `className` is not configurable
  var cn = Object.getOwnPropertyDescriptor(Element.prototype, 'className');
  if (cn && cn.configurable) {
    Object.defineProperty(Element.prototype, 'className', classNameDescriptor);
  } else {
    // on IE `className` is on Element
    var h = window.customElements && window.customElements.nativeHTMLElement ||
      HTMLElement;
    cn = Object.getOwnPropertyDescriptor(h.prototype, 'className');
    if (cn && cn.configurable) {
      Object.defineProperty(h.prototype, 'className', classNameDescriptor);
    }
  }
}

}());

//# sourceMappingURL=shadydom.min.js.map

(function(){'use strict';/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/function e(De){return De=a(De),u(d(De),De)}function a(De){return De.replace(X.comments,'').replace(X.port,'')}function d(De){let ke={start:0,end:De.length},Ue=ke;for(let Ke=0,Xe=De.length;Ke<Xe;Ke++)if(De[Ke]===U){Ue.rules||(Ue.rules=[]);let Ve=Ue,je=Ve.rules[Ve.rules.length-1];Ue={start:Ke+1,parent:Ve,previous:je},Ve.rules.push(Ue)}else De[Ke]===K&&(Ue.end=Ke+1,Ue=Ue.parent||ke);return ke}function u(De,ke){let Ue=ke.substring(De.start,De.end-1);if(De.parsedCssText=De.cssText=Ue.trim(),De.parent){let Xe=De.previous?De.previous.end:De.parent.start;Ue=ke.substring(Xe,De.start-1),Ue=y(Ue),Ue=Ue.replace(X.multipleSpaces,' '),Ue=Ue.substring(Ue.lastIndexOf(';')+1);let Ve=De.parsedSelector=De.selector=Ue.trim();De.atRule=0===Ve.indexOf('@'),De.atRule?0===Ve.indexOf('@media')?De.type=k.MEDIA_RULE:Ve.match(X.keyframesRule)&&(De.type=k.KEYFRAMES_RULE,De.keyframesName=De.selector.split(X.multipleSpaces).pop()):0===Ve.indexOf(V)?De.type=k.MIXIN_RULE:De.type=k.STYLE_RULE}let Ke=De.rules;if(Ke)for(let je,Xe=0,Ve=Ke.length;Xe<Ve&&(je=Ke[Xe]);Xe++)u(je,ke);return De}function y(De){return De.replace(/\\([0-9a-f]{1,6})\s/gi,function(){let ke=arguments[1],Ue=6-ke.length;for(;Ue--;)ke='0'+ke;return'\\'+ke})}function _(De,ke,Ue){Ue=Ue||'';let Ke='';if(De.cssText||De.rules){let Xe=De.rules;if(Xe&&!S(Xe))for(let Be,Ve=0,je=Xe.length;Ve<je&&(Be=Xe[Ve]);Ve++)Ke=_(Be,ke,Ke);else Ke=ke?De.cssText:h(De.cssText),Ke=Ke.trim(),Ke&&(Ke='  '+Ke+'\n')}return Ke&&(De.selector&&(Ue+=De.selector+' '+U+'\n'),Ue+=Ke,De.selector&&(Ue+=K+'\n\n')),Ue}function S(De){return 0===De[0].selector.indexOf(V)}function h(De){return De=g(De),C(De)}function g(De){return De.replace(X.customProp,'').replace(X.mixinProp,'')}function C(De){return De.replace(X.mixinApply,'').replace(X.varApply,'')}function E(De){De&&(B=B&&!De.shimcssproperties,j=j&&!De.shimshadow)}function A(De,ke){return'string'==typeof De&&(De=e(De)),ke&&R(De,ke),_(De,B)}function T(De){return!De.__cssRules&&De.textContent&&(De.__cssRules=e(De.textContent)),De.__cssRules}function N(De){return De.parent&&De.parent.type===k.KEYFRAMES_RULE}function R(De,ke,Ue,Ke){if(De){let Xe=!1;if(Ke&&De.type===k.MEDIA_RULE){let je=De.selector.match(q.MEDIA_MATCH);je&&!window.matchMedia(je[1]).matches&&(Xe=!0)}De.type===k.STYLE_RULE?ke(De):Ue&&De.type===k.KEYFRAMES_RULE?Ue(De):De.type===k.MIXIN_RULE&&(Xe=!0);let Ve=De.rules;if(Ve&&!Xe)for(let Ye,je=0,Be=Ve.length;je<Be&&(Ye=Ve[je]);je++)R(Ye,ke,Ue,Ke)}}function P(De,ke,Ue,Ke){let Xe=O(De,ke);return I(Xe,Ue,Ke)}function I(De,ke,Ue){ke=ke||document.head;let Ke=Ue&&Ue.nextSibling||ke.firstChild;return G=De,ke.insertBefore(De,Ke)}function O(De,ke){let Ue=document.createElement('style');return ke&&Ue.setAttribute('scope',ke),Ue.textContent=De,Ue}function M(De){let ke=document.createComment(' Shady DOM styles for '+De+' '),Ue=G?G.nextSibling:null,Ke=document.head;return Ke.insertBefore(ke,Ue||Ke.firstChild),G=ke,ke}function b(De,ke){let Ue=0;for(let Ke=ke,Xe=De.length;Ke<Xe;Ke++)if('('===De[Ke])Ue++;else if(')'===De[Ke]&&0==--Ue)return Ke;return-1}function w(De,ke){let Ue=De.indexOf('var(');if(-1===Ue)return ke(De,'','','');let Ke=b(De,Ue+3),Xe=De.substring(Ue+4,Ke),Ve=De.substring(0,Ue),je=w(De.substring(Ke+1),ke),Be=Xe.indexOf(',');if(-1===Be)return ke(Ve,Xe.trim(),'',je);let Ye=Xe.substring(0,Be).trim(),Ge=Xe.substring(Be+1).trim();return ke(Ve,Ye,Ge,je)}function L(De,ke){De.__nativeSetAttribute?De.__nativeSetAttribute('class',ke):De.setAttribute('class',ke)}function H(De,ke){let Ue=parseInt(De/32);ke[Ue]=(ke[Ue]||0)|1<<De%32}function F(){we||(we=!0,window.HTMLImports?window.HTMLImports.whenReady(D):'complete'===document.readyState?D():document.addEventListener('readystatechange',()=>{'complete'===document.readyState&&D()}))}function D(){requestAnimationFrame(()=>{(we||be._elementsHaveApplied)&&be.updateStyles(),we=!1})}let k={STYLE_RULE:1,KEYFRAMES_RULE:7,MEDIA_RULE:4,MIXIN_RULE:1e3},U='{',K='}',X={comments:/\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,port:/@import[^;]*;/gim,customProp:/(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,mixinProp:/(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,mixinApply:/@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,varApply:/[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,keyframesRule:/^@[^\s]*keyframes/,multipleSpaces:/\s+/g},V='--',j=!(window.ShadyDOM&&window.ShadyDOM.inUse),B=!navigator.userAgent.match('AppleWebKit/601')&&window.CSS&&CSS.supports&&CSS.supports('box-shadow','0 0 0 var(--foo)'),Y=!1;window.ShadyCSS?E(window.ShadyCSS):window.WebComponents&&E(window.WebComponents.flags);let G=null,q={VAR_ASSIGN:/(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:([^;{]*)|{([^}]*)})(?:(?=[;\s}])|$)/gi,MIXIN_MATCH:/(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi,VAR_CONSUMED:/(--[\w-]+)\s*([:,;)]|$)/gi,ANIMATION_MATCH:/(animation\s*:)|(animation-name\s*:)/,MEDIA_MATCH:/@media[^(]*(\([^)]*\))/,IS_VAR:/^--/,BRACKETED:/\{[^}]*\}/g,HOST_PREFIX:'(?:^|[^.#[:])',HOST_SUFFIX:'($|[.:[\\s>+~])'};const W='style-scope';class z{get SCOPE_NAME(){return W}dom(De,ke,Ue){De.__styleScoped?De.__styleScoped=null:this._transformDom(De,ke||'',Ue)}_transformDom(De,ke,Ue){De.nodeType===Node.ELEMENT_NODE&&this.element(De,ke,Ue);let Ke='template'===De.localName?(De.content||De._content).childNodes:De.children||De.childNodes;if(Ke)for(let Xe=0;Xe<Ke.length;Xe++)this._transformDom(Ke[Xe],ke,Ue)}element(De,ke,Ue){if(ke)if(De.classList)Ue?(De.classList.remove(W),De.classList.remove(ke)):(De.classList.add(W),De.classList.add(ke));else if(De.getAttribute){let Ke=De.getAttribute('class');if(!Ue){let Xe=(Ke?Ke+' ':'')+W+' '+ke;L(De,Xe)}else if(Ke){let Xe=Ke.replace(W,'').replace(ke,'');L(De,Xe)}}}elementStyles(De,ke,Ue){let Ke=De.__cssBuild,Xe=j||'shady'===Ke?A(ke,Ue):this.css(ke,De.is,De.extends,Ue)+'\n\n';return Xe.trim()}css(De,ke,Ue,Ke){let Xe=this._calcHostScope(ke,Ue);ke=this._calcElementScope(ke);let Ve=this;return A(De,function(je){je.isScoped||(Ve.rule(je,ke,Xe),je.isScoped=!0),Ke&&Ke(je,ke,Xe)})}_calcElementScope(De){return De?'.'+De:''}_calcHostScope(De,ke){return ke?'[is='+De+']':De}rule(De,ke,Ue){this._transformRule(De,this._transformComplexSelector,ke,Ue)}_transformRule(De,ke,Ue,Ke){De.selector=De.transformedSelector=this._transformRuleCss(De,ke,Ue,Ke)}_transformRuleCss(De,ke,Ue,Ke){let Xe=De.selector.split(Z);if(!N(De))for(let Be,Ve=0,je=Xe.length;Ve<je&&(Be=Xe[Ve]);Ve++)Xe[Ve]=ke.call(this,Be,Ue,Ke);return Xe.join(Z)}_transformComplexSelector(De,ke,Ue){let Ke=!1;return De=De.trim(),De=De.replace($,(Xe,Ve,je)=>`:${Ve}(${je.replace(/\s/g,'')})`),De=De.replace(re,`${te} $1`),De=De.replace(J,(Xe,Ve,je)=>{if(!Ke){let Be=this._transformCompoundSelector(je,Ve,ke,Ue);Ke=Ke||Be.stop,Ve=Be.combinator,je=Be.value}return Ve+je}),De}_transformCompoundSelector(De,ke,Ue,Ke){let Xe=De.indexOf(se);0<=De.indexOf(te)?De=this._transformHostSelector(De,Ke):0!==Xe&&(De=Ue?this._transformSimpleSelector(De,Ue):De);let Ve=!1;0<=Xe&&(ke='',Ve=!0);let je;return Ve&&(je=!0,Ve&&(De=De.replace(oe,(Be,Ye)=>` > ${Ye}`))),De=De.replace(le,(Be,Ye,Ge)=>`[dir="${Ge}"] ${Ye}, ${Ye}[dir="${Ge}"]`),{value:De,combinator:ke,stop:je}}_transformSimpleSelector(De,ke){let Ue=De.split(ae);return Ue[0]+=ke,Ue.join(ae)}_transformHostSelector(De,ke){let Ue=De.match(ne),Ke=Ue&&Ue[2].trim()||'';if(Ke){if(!Ke[0].match(ee)){let Xe=Ke.split(ee)[0];return Xe===ke?Ke:'should_not_match'}return De.replace(ne,function(Xe,Ve,je){return ke+je})}return De.replace(te,ke)}documentRule(De){De.selector=De.parsedSelector,this.normalizeRootSelector(De),this._transformRule(De,this._transformDocumentSelector)}normalizeRootSelector(De){':root'===De.selector&&(De.selector='html')}_transformDocumentSelector(De){return De.match(se)?this._transformComplexSelector(De,Q):this._transformSimpleSelector(De.trim(),Q)}}let $=/:(nth[-\w]+)\(([^)]+)\)/,Q=`:not(.${W})`,Z=',',J=/(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=\[])+)/g,ee=/[[.:#*]/,te=':host',se='::slotted',re=/^(::slotted)/,ne=/(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,oe=/(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,le=/(.*):dir\((?:(ltr|rtl))\)/,ae=':';var ie=new z,pe={};const de=Promise.resolve();class me{static get(De){return De.__styleInfo}static set(De,ke){return De.__styleInfo=ke,ke}static invalidate(De){pe[De]&&(pe[De]._applyShimInvalid=!0)}static startValidating(De){const ke=pe[De];ke._validating||(ke._validating=!0,de.then(()=>{ke._applyShimInvalid=!1,ke._validating=!1}))}constructor(De,ke,Ue,Ke,Xe,Ve){this.styleRules=De||null,this.placeholder=ke||null,this.ownStylePropertyNames=Ue||[],this.overrideStyleProperties=null,this.elementName=Ke||'',this.cssBuild=Ve||'',this.typeExtension=Xe||'',this.styleProperties=null,this.scopeSelector=null,this.customStyle=null}}const ue=window.Element.prototype,ye=ue.matches||ue.matchesSelector||ue.mozMatchesSelector||ue.msMatchesSelector||ue.oMatchesSelector||ue.webkitMatchesSelector,_e=navigator.userAgent.match('Trident'),fe='x-scope';class Se{get XSCOPE_NAME(){return fe}decorateStyles(De){let ke=this,Ue={},Ke=[],Xe=0;R(De,function(je){ke.decorateRule(je),je.index=Xe++,ke.collectPropertiesInCssText(je.propertyInfo.cssText,Ue)},function(Be){Ke.push(Be)}),De._keyframes=Ke;let Ve=[];for(let je in Ue)Ve.push(je);return Ve}decorateRule(De){if(De.propertyInfo)return De.propertyInfo;let ke={},Ue={},Ke=this.collectProperties(De,Ue);return Ke&&(ke.properties=Ue,De.rules=null),ke.cssText=this.collectCssText(De),De.propertyInfo=ke,ke}collectProperties(De,ke){let Ue=De.propertyInfo;if(!Ue){let Ke,Xe=q.VAR_ASSIGN,Ve=De.parsedCssText,je,Be;for(;Ke=Xe.exec(Ve);)je=(Ke[2]||Ke[3]).trim(),('inherit'!==je||'unset'!==je)&&(ke[Ke[1].trim()]=je),Be=!0;return Be}else if(Ue.properties)return Object.assign(ke,Ue.properties),!0}collectCssText(De){return this.collectConsumingCssText(De.parsedCssText)}collectConsumingCssText(De){return De.replace(q.BRACKETED,'').replace(q.VAR_ASSIGN,'')}collectPropertiesInCssText(De,ke){for(let Ue;Ue=q.VAR_CONSUMED.exec(De);){let Ke=Ue[1];':'!==Ue[2]&&(ke[Ke]=!0)}}reify(De){let ke=Object.getOwnPropertyNames(De);for(let Ke,Ue=0;Ue<ke.length;Ue++)Ke=ke[Ue],De[Ke]=this.valueForProperty(De[Ke],De)}valueForProperty(De,ke){if(De)if(0<=De.indexOf(';'))De=this.valueForProperties(De,ke);else{let Ue=this;De=w(De,function(Ke,Xe,Ve,je){if(!Xe)return Ke+je;let Be=Ue.valueForProperty(ke[Xe],ke);return Be&&'initial'!==Be?'apply-shim-inherit'===Be&&(Be='inherit'):Be=Ue.valueForProperty(ke[Ve]||Ve,ke)||Ve,Ke+(Be||'')+je})}return De&&De.trim()||''}valueForProperties(De,ke){let Ue=De.split(';');for(let Xe,Ve,Ke=0;Ke<Ue.length;Ke++)if(Xe=Ue[Ke]){if(q.MIXIN_MATCH.lastIndex=0,Ve=q.MIXIN_MATCH.exec(Xe),Ve)Xe=this.valueForProperty(ke[Ve[1]],ke);else{let je=Xe.indexOf(':');if(-1!==je){let Be=Xe.substring(je);Be=Be.trim(),Be=this.valueForProperty(Be,ke)||Be,Xe=Xe.substring(0,je)+Be}}Ue[Ke]=Xe&&Xe.lastIndexOf(';')===Xe.length-1?Xe.slice(0,-1):Xe||''}return Ue.join(';')}applyProperties(De,ke){let Ue='';De.propertyInfo||this.decorateRule(De),De.propertyInfo.cssText&&(Ue=this.valueForProperties(De.propertyInfo.cssText,ke)),De.cssText=Ue}applyKeyframeTransforms(De,ke){let Ue=De.cssText,Ke=De.cssText;if(null==De.hasAnimations&&(De.hasAnimations=q.ANIMATION_MATCH.test(Ue)),De.hasAnimations){let Xe;if(null==De.keyframeNamesToTransform)for(let Ve in De.keyframeNamesToTransform=[],ke)Xe=ke[Ve],Ke=Xe(Ue),Ue!==Ke&&(Ue=Ke,De.keyframeNamesToTransform.push(Ve));else{for(let Ve=0;Ve<De.keyframeNamesToTransform.length;++Ve)Xe=ke[De.keyframeNamesToTransform[Ve]],Ue=Xe(Ue);Ke=Ue}}De.cssText=Ke}propertyDataFromStyles(De,ke){let Ue={},Ke=this,Xe=[];return R(De,function(Ve){Ve.propertyInfo||Ke.decorateRule(Ve);let je=Ve.transformedSelector||Ve.parsedSelector;ke&&Ve.propertyInfo.properties&&je&&ye.call(ke,je)&&(Ke.collectProperties(Ve,Ue),H(Ve.index,Xe))},null,!0),{properties:Ue,key:Xe}}whenHostOrRootRule(De,ke,Ue,Ke){if(ke.propertyInfo||this.decorateRule(ke),!!ke.propertyInfo.properties){let Xe=De.is?ie._calcHostScope(De.is,De.extends):'html',Ve=ke.parsedSelector,je=':host > *'===Ve||'html'===Ve,Be=0===Ve.indexOf(':host')&&!je;if('shady'===Ue&&(je=Ve===Xe+' > *.'+Xe||-1!==Ve.indexOf('html'),Be=!je&&0===Ve.indexOf(Xe)),'shadow'===Ue&&(je=':host > *'===Ve||'html'===Ve,Be=Be&&!je),je||Be){let Ye=Xe;Be&&(j&&!ke.transformedSelector&&(ke.transformedSelector=ie._transformRuleCss(ke,ie._transformComplexSelector,ie._calcElementScope(De.is),Xe)),Ye=ke.transformedSelector||Xe),Ke({selector:Ye,isHost:Be,isRoot:je})}}}hostAndRootPropertiesForScope(De,ke){let Ue={},Ke={},Xe=this,Ve=ke&&ke.__cssBuild;return R(ke,function(je){Xe.whenHostOrRootRule(De,je,Ve,function(Be){let Ye=De._element||De;ye.call(Ye,Be.selector)&&(Be.isHost?Xe.collectProperties(je,Ue):Xe.collectProperties(je,Ke))})},null,!0),{rootProps:Ke,hostProps:Ue}}transformStyles(De,ke,Ue){let Ke=this,Xe=ie._calcHostScope(De.is,De.extends),Ve=De.extends?'\\'+Xe.slice(0,-1)+'\\]':Xe,je=new RegExp(q.HOST_PREFIX+Ve+q.HOST_SUFFIX),Be=me.get(De).styleRules,Ye=this._elementKeyframeTransforms(De,Be,Ue);return ie.elementStyles(De,Be,function(Ge){Ke.applyProperties(Ge,ke),j||N(Ge)||!Ge.cssText||(Ke.applyKeyframeTransforms(Ge,Ye),Ke._scopeSelector(Ge,je,Xe,Ue))})}_elementKeyframeTransforms(De,ke,Ue){let Ke=ke._keyframes,Xe={};if(!j&&Ke)for(let Ve=0,je=Ke[Ve];Ve<Ke.length;je=Ke[++Ve])this._scopeKeyframes(je,Ue),Xe[je.keyframesName]=this._keyframesRuleTransformer(je);return Xe}_keyframesRuleTransformer(De){return function(ke){return ke.replace(De.keyframesNameRx,De.transformedKeyframesName)}}_scopeKeyframes(De,ke){De.keyframesNameRx=new RegExp(De.keyframesName,'g'),De.transformedKeyframesName=De.keyframesName+'-'+ke,De.transformedSelector=De.transformedSelector||De.selector,De.selector=De.transformedSelector.replace(De.keyframesName,De.transformedKeyframesName)}_scopeSelector(De,ke,Ue,Ke){De.transformedSelector=De.transformedSelector||De.selector;let Xe=De.transformedSelector,Ve='.'+Ke,je=Xe.split(',');for(let Ge,Be=0,Ye=je.length;Be<Ye&&(Ge=je[Be]);Be++)je[Be]=Ge.match(ke)?Ge.replace(Ue,Ve):Ve+' '+Ge;De.selector=je.join(',')}applyElementScopeSelector(De,ke,Ue){let Ke=De.getAttribute('class')||'',Xe=Ke;Ue&&(Xe=Ke.replace(new RegExp('\\s*'+fe+'\\s*'+Ue+'\\s*','g'),' ')),Xe+=(Xe?' ':'')+fe+' '+ke,Ke!==Xe&&(De.__nativeSetAttribute?De.__nativeSetAttribute('class',Xe):De.setAttribute('class',Xe))}applyElementStyle(De,ke,Ue,Ke){let Xe=Ke?Ke.textContent||'':this.transformStyles(De,ke,Ue),Ve=me.get(De),je=Ve.customStyle;return je&&!j&&je!==Ke&&(je._useCount--,0>=je._useCount&&je.parentNode&&je.parentNode.removeChild(je)),j?Ve.customStyle?(Ve.customStyle.textContent=Xe,Ke=Ve.customStyle):Xe&&(Ke=P(Xe,Ue,De.shadowRoot,Ve.placeholder)):Ke?!Ke.parentNode&&I(Ke,null,Ve.placeholder):Xe&&(Ke=P(Xe,Ue,null,Ve.placeholder)),Ke&&(Ke._useCount=Ke._useCount||0,Ve.customStyle!=Ke&&Ke._useCount++,Ve.customStyle=Ke),_e&&(Ke.textContent=Ke.textContent),Ke}applyCustomStyle(De,ke){let Ue=T(De),Ke=this;De.textContent=A(Ue,function(Xe){let Ve=Xe.cssText=Xe.parsedCssText;Xe.propertyInfo&&Xe.propertyInfo.cssText&&(Ve=g(Ve),Xe.cssText=Ke.valueForProperties(Ve,ke))})}}var he=new Se;let ge={};const xe=window.customElements;if(xe&&!j){const De=xe.define;xe.define=function(ke,Ue,Ke){return ge[ke]=M(ke),De.call(xe,ke,Ue,Ke)}}let Ce=q.MIXIN_MATCH,Ee=q.VAR_ASSIGN,Ae=/;\s*/m,Te=/^\s*(initial)|(inherit)\s*$/,Ne='_-_';class ve{constructor(){this._map={}}set(De,ke){De=De.trim(),this._map[De]={properties:ke,dependants:{}}}get(De){return De=De.trim(),this._map[De]}}class Re{constructor(){this._currentTemplate=null,this._measureElement=null,this._map=new ve,this._separator=Ne,this._boundProduceCssProperties=(De,ke,Ue,Ke)=>this._produceCssProperties(De,ke,Ue,Ke)}detectMixin(De){const ke=Ce.test(De)||Ee.test(De);return Ce.lastIndex=0,Ee.lastIndex=0,ke}transformStyle(De,ke){let Ue=T(De);return this.transformRules(Ue,ke),Ue}transformRules(De,ke){this._currentTemplate=pe[ke],R(De,Ue=>{this.transformRule(Ue)}),this._currentTemplate=null}transformRule(De){De.cssText=this.transformCssText(De.parsedCssText),':root'===De.selector&&(De.selector=':host > *')}transformCssText(De){return De=De.replace(Ee,this._boundProduceCssProperties),this._consumeCssProperties(De)}_getInitialValueForProperty(De){return this._measureElement||(this._measureElement=document.createElement('meta'),this._measureElement.style.all='initial',document.head.appendChild(this._measureElement)),window.getComputedStyle(this._measureElement).getPropertyValue(De)}_consumeCssProperties(De){for(let ke;ke=Ce.exec(De);){let Ue=ke[0],Ke=ke[1],Xe=ke.index,Ve=Xe+Ue.indexOf('@apply'),je=Xe+Ue.length,Be=De.slice(0,Ve),Ye=De.slice(je),Ge=this._cssTextToMap(Be),qe=this._atApplyToCssProperties(Ke,Ge);De=[Be,qe,Ye].join(''),Ce.lastIndex=Xe+qe.length}return De}_atApplyToCssProperties(De,ke){De=De.replace(Ae,'');let Ue=[],Ke=this._map.get(De);if(Ke||(this._map.set(De,{}),Ke=this._map.get(De)),Ke){this._currentTemplate&&(Ke.dependants[this._currentTemplate.name]=this._currentTemplate);let Xe,Ve,je;for(Xe in Ke.properties)je=ke&&ke[Xe],Ve=[Xe,': var(',De,Ne,Xe],je&&Ve.push(',',je),Ve.push(')'),Ue.push(Ve.join(''))}return Ue.join('; ')}_replaceInitialOrInherit(De,ke){let Ue=Te.exec(ke);return Ue&&(Ue[1]?ke=Re._getInitialValueForProperty(De):ke='apply-shim-inherit'),ke}_cssTextToMap(De){let ke=De.split(';'),Ue,Ke,Xe={};for(let je,Be,Ve=0;Ve<ke.length;Ve++)je=ke[Ve],je&&(Be=je.split(':'),1<Be.length&&(Ue=Be[0].trim(),Ke=this._replaceInitialOrInherit(Ue,Be.slice(1).join(':')),Xe[Ue]=Ke));return Xe}_invalidateMixinEntry(De){for(let ke in De.dependants)this._currentTemplate&&ke===this._currentTemplate.name||me.invalidate(ke)}_produceCssProperties(De,ke,Ue,Ke){if(Ue&&w(Ue,(Qe,Ze)=>{Ze&&this._map.get(Ze)&&(Ke='@apply '+Ze+';')}),!Ke)return De;let Xe=this._consumeCssProperties(Ke),Ve=De.slice(0,De.indexOf('--')),je=this._cssTextToMap(Xe),Be=je,Ye=this._map.get(ke),Ge=Ye&&Ye.properties;Ge?Be=Object.assign(Object.create(Ge),je):this._map.set(ke,Be);let We,ze,qe=[],$e=!1;for(We in Be)ze=je[We],void 0==ze&&(ze='initial'),Ge&&!(We in Ge)&&($e=!0),qe.push(ke+Ne+We+': '+ze);return $e&&this._invalidateMixinEntry(Ye),Ye&&(Ye.properties=Be),Ue&&(Ve=De+';'+Ve),Ve+qe.join('; ')+';'}}let Pe=new Re;window.ApplyShim=Pe;let Ie=function(){};if(!j){let De=Ve=>{return Ve.classList&&!Ve.classList.contains(ie.SCOPE_NAME)||Ve instanceof SVGElement&&(!Ve.hasAttribute('class')||0>Ve.getAttribute('class').indexOf(ie.SCOPE_NAME))},ke=Ve=>{for(let je=0;je<Ve.length;je++){let Be=Ve[je];if(Be.target!==document.documentElement&&Be.target!==document.head){for(let Ye=0;Ye<Be.addedNodes.length;Ye++){let Ge=Be.addedNodes[Ye];if(De(Ge)){let qe=Ge.getRootNode();if(qe.nodeType===Node.DOCUMENT_FRAGMENT_NODE){let We=qe.host;if(We){let ze=We.is||We.localName;ie.dom(Ge,ze)}}}}for(let Ye=0;Ye<Be.removedNodes.length;Ye++){let Ge=Be.removedNodes[Ye];if(Ge.nodeType===Node.ELEMENT_NODE){let qe;if(Ge.classList?qe=Array.from(Ge.classList):Ge.hasAttribute('class')&&(qe=Ge.getAttribute('class').split(/\s+/)),void 0!=qe){let We=qe.indexOf(ie.SCOPE_NAME);if(0<=We){let ze=qe[We+1];ze&&ie.dom(Ge,ze,!0)}}}}}}},Ue=new MutationObserver(ke),Ke=Ve=>{Ue.observe(Ve,{childList:!0,subtree:!0})},Xe=window.customElements&&!window.customElements.flush;if(Xe)Ke(document);else{let Ve=()=>{Ke(document.body)};window.HTMLImports?window.HTMLImports.whenReady(Ve):requestAnimationFrame(function(){if('loading'===document.readyState){let je=function(){Ve(),document.removeEventListener('readystatechange',je)};document.addEventListener('readystatechange',je)}else Ve()})}Ie=function(){ke(Ue.takeRecords())}}let Oe=new class{constructor(ke=100){this.cache={},this.typeMax=ke}_validate(ke,Ue,Ke){for(let Xe=0;Xe<Ke.length;Xe++){let Ve=Ke[Xe];if(ke.properties[Ve]!==Ue[Ve])return!1}return!0}store(ke,Ue,Ke,Xe){let Ve=this.cache[ke]||[];Ve.push({properties:Ue,styleElement:Ke,scopeSelector:Xe}),Ve.length>this.typeMax&&Ve.shift(),this.cache[ke]=Ve}fetch(ke,Ue,Ke){let Xe=this.cache[ke];if(Xe)for(let Ve=Xe.length-1;0<=Ve;Ve--){let je=Xe[Ve];if(this._validate(je,Ue,Ke))return je}}};class Me{constructor(){this._scopeCounter={},this._documentOwner=document.documentElement,this._documentOwnerStyleInfo=me.set(document.documentElement,new me({rules:[]})),this._elementsHaveApplied=!1}get nativeShadow(){return j}get nativeCss(){return B}get nativeCssApply(){return Y}flush(){Ie()}_generateScopeSelector(De){let ke=this._scopeCounter[De]=(this._scopeCounter[De]||0)+1;return`${De}-${ke}`}getStyleAst(De){return T(De)}styleAstToString(De){return A(De)}_gatherStyles(De){let ke=De.content.querySelectorAll('style'),Ue=[];for(let Ke=0;Ke<ke.length;Ke++){let Xe=ke[Ke];Ue.push(Xe.textContent),Xe.parentNode.removeChild(Xe)}return Ue.join('').trim()}_getCssBuild(De){let ke=De.content.querySelector('style');return ke?ke.getAttribute('css-build')||'':''}prepareTemplate(De,ke,Ue){if(!De._prepared){De._prepared=!0,De.name=ke,De.extends=Ue,pe[ke]=De;let Ke=this._getCssBuild(De),Xe=this._gatherStyles(De),Ve={is:ke,extends:Ue,__cssBuild:Ke};this.nativeShadow||ie.dom(De.content,ke);let je=Pe.detectMixin(Xe),Be=e(Xe);je&&this.nativeCss&&!this.nativeCssApply&&Pe.transformRules(Be,ke),De._styleAst=Be;let Ye=[];if(this.nativeCss||(Ye=he.decorateStyles(De._styleAst,Ve)),!Ye.length||this.nativeCss){let Ge=this.nativeShadow?De.content:null,qe=ge[ke],We=this._generateStaticStyle(Ve,De._styleAst,Ge,qe);De._style=We}De._ownPropertyNames=Ye}}_generateStaticStyle(De,ke,Ue,Ke){let Xe=ie.elementStyles(De,ke);if(Xe.length)return P(Xe,De.is,Ue,Ke)}_prepareHost(De){let Ue,ke=De.getAttribute('is')||De.localName;ke!==De.localName&&(Ue=De.localName);let Ve,je,Be,Ke=ge[ke],Xe=pe[ke];return Xe&&(Ve=Xe._styleAst,je=Xe._ownPropertyNames,Be=Xe._cssBuild),me.set(De,new me(Ve,Ke,je,ke,Ue,Be))}applyStyle(De,ke){let Ue=De.getAttribute('is')||De.localName,Ke=me.get(De),Xe=!!Ke;if(Ke||(Ke=this._prepareHost(De)),this._isRootOwner(De)||(this._elementsHaveApplied=!0),window.CustomStyle){let Ve=window.CustomStyle;if(Ve._documentDirty){if(Ve.findStyles(),this.nativeCss?!this.nativeCssApply&&Ve._revalidateApplyShim():this._updateProperties(this._documentOwner,this._documentOwnerStyleInfo),Ve.applyStyles(),!this._elementsHaveApplied)return;if(!this.nativeCss&&(this.updateStyles(),Xe))return}}if(ke&&(Ke.overrideStyleProperties=Ke.overrideStyleProperties||{},Object.assign(Ke.overrideStyleProperties,ke)),this.nativeCss){Ke.overrideStyleProperties&&this._updateNativeProperties(De,Ke.overrideStyleProperties);let Ve=pe[Ue];if(!Ve&&!this._isRootOwner(De))return;if(Ve&&Ve._applyShimInvalid&&Ve._style){if(Ve._validating||(Pe.transformRules(Ve._styleAst,Ue),Ve._style.textContent=ie.elementStyles(De,Ke.styleRules),me.startValidating(Ue)),this.nativeShadow){let je=De.shadowRoot;if(je){let Be=je.querySelector('style');Be.textContent=ie.elementStyles(De,Ke.styleRules)}}Ke.styleRules=Ve._styleAst}}else this._updateProperties(De,Ke),Ke.ownStylePropertyNames&&Ke.ownStylePropertyNames.length&&this._applyStyleProperties(De,Ke);if(Xe){let Ve=this._isRootOwner(De)?De:De.shadowRoot;Ve&&this._applyToDescendants(Ve)}}_applyToDescendants(De){let ke=De.children;for(let Ke,Ue=0;Ue<ke.length;Ue++)Ke=ke[Ue],Ke.shadowRoot&&this.applyStyle(Ke),this._applyToDescendants(Ke)}_styleOwnerForNode(De){let ke=De.getRootNode(),Ue=ke.host;return Ue?me.get(Ue)?Ue:this._styleOwnerForNode(Ue):this._documentOwner}_isRootOwner(De){return De===this._documentOwner}_applyStyleProperties(De,ke){let Ue=De.getAttribute('is')||De.localName,Ke=Oe.fetch(Ue,ke.styleProperties,ke.ownStylePropertyNames),Xe=Ke&&Ke.scopeSelector,Ve=Ke?Ke.styleElement:null,je=ke.scopeSelector;ke.scopeSelector=Xe||this._generateScopeSelector(Ue);let Be=he.applyElementStyle(De,ke.styleProperties,ke.scopeSelector,Ve);return this.nativeShadow||he.applyElementScopeSelector(De,ke.scopeSelector,je),Ke||Oe.store(Ue,ke.styleProperties,Be,ke.scopeSelector),Be}_updateProperties(De,ke){let Ue=this._styleOwnerForNode(De),Ke=me.get(Ue),Xe=Ke.styleProperties,Ve=Object.create(Xe||null),je=he.hostAndRootPropertiesForScope(De,ke.styleRules),Be=he.propertyDataFromStyles(Ke.styleRules,De),Ye=Be.properties;Object.assign(Ve,je.hostProps,Ye,je.rootProps),this._mixinOverrideStyles(Ve,ke.overrideStyleProperties),he.reify(Ve),ke.styleProperties=Ve}_mixinOverrideStyles(De,ke){for(let Ue in ke){let Ke=ke[Ue];(Ke||0===Ke)&&(De[Ue]=Ke)}}_updateNativeProperties(De,ke){for(let Ue in ke)null===Ue?De.style.removeProperty(Ue):De.style.setProperty(Ue,ke[Ue])}updateStyles(De){this.applyStyle(this._documentOwner,De)}_transformCustomStyleForDocument(De){let ke=T(De);R(ke,Ue=>{j?ie.normalizeRootSelector(Ue):ie.documentRule(Ue),this.nativeCss&&!this.nativeCssApply&&Pe.transformRule(Ue)}),this.nativeCss?De.textContent=A(ke):this._documentOwnerStyleInfo.styleRules.rules.push(ke)}_revalidateApplyShim(De){if(this.nativeCss&&!this.nativeCssApply){let ke=T(De);Pe.transformRules(ke),De.textContent=A(ke)}}_applyCustomStyleToDocument(De){this.nativeCss||he.applyCustomStyle(De,this._documentOwnerStyleInfo.styleProperties)}getComputedStyleValue(De,ke){let Ue;if(!this.nativeCss){let Ke=me.get(De)||me.get(this._styleOwnerForNode(De));Ue=Ke.styleProperties[ke]}return Ue=Ue||window.getComputedStyle(De).getPropertyValue(ke),Ue.trim()}setElementClass(De,ke){let Ue=De.getRootNode(),Ke=ke?ke.split(/\s/):[],Xe=Ue.host&&Ue.host.localName;if(!Xe){var Ve=De.getAttribute('class');if(Ve){let je=Ve.split(/\s/);for(let Be=0;Be<je.length;Be++)if(je[Be]===ie.SCOPE_NAME){Xe=je[Be+1];break}}}if(Xe&&Ke.push(ie.SCOPE_NAME,Xe),!this.nativeCss){let je=me.get(De);je&&je.scopeSelector&&Ke.push(he.XSCOPE_NAME,je.scopeSelector)}L(De,Ke.join(' '))}_styleInfoForNode(De){return me.get(De)}}window.ShadyCSS=new Me;let be=window.ShadyCSS,we=!1,Le=[],He=null;class Fe extends HTMLElement{static get _customStyles(){return Le}static get processHook(){return He}static set processHook(De){He=De}static get _documentDirty(){return we}static findStyles(){for(let De=0;De<Le.length;De++){let ke=Le[De];if(!ke._style){let Ue=ke.querySelector('style');if(!Ue)continue;if(Ue.__appliedElement)for(let Ke=0;Ke<Ue.attributes.length;Ke++){let Xe=Ue.attributes[Ke];Ue.__appliedElement.setAttribute(Xe.name,Xe.value)}ke._style=Ue.__appliedElement||Ue,He&&He(ke._style),be._transformCustomStyleForDocument(ke._style)}}}static _revalidateApplyShim(){for(let De=0;De<Le.length;De++){let ke=Le[De];ke._style&&be._revalidateApplyShim(ke._style)}}static applyStyles(){for(let De=0;De<Le.length;De++){let ke=Le[De];ke._style&&be._applyCustomStyleToDocument(ke._style)}we=!1}constructor(){super(),Le.push(this),F()}}window.CustomStyle=Fe,window.customElements.define('custom-style',Fe)})();
//# sourceMappingURL=shadycss.min.js.map

//# sourceMappingURL=webcomponents.js.map
