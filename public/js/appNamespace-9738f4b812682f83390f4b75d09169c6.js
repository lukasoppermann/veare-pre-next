!function(){"use strict";const e=function(e,t,o,r,n,c,i){c=t.createElement(o),i=t.getElementsByTagName(o)[0],c.appendChild(t.createTextNode(r.text)),c.onload=n(r),i?i.parentNode.insertBefore(c,i):t.head.appendChild(c)};
/**
   * Fetch Inject module.
   *
   * @module fetchInject
   * @license Zlib
   * @param {(USVString[]|Request[])} inputs Resources you wish to fetch.
   * @param {Promise} [promise] A promise to await before attempting injection.
   * @throws {Promise<ReferenceError>} Rejects with error when given no arguments.
   * @throws {Promise<TypeError>} Rejects with error on invalid arguments.
   * @throws {Promise<Error>} Whatever `fetch` decides to throw.
   * @throws {SyntaxError} Via DOM upon attempting to parse unexpected tokens.
   * @returns {Promise<Object[]>} A promise which resolves to an `Array` of
   *     Objects containing `Response` `Body` properties used by the module.
   */window.app={baseUrl:`${window.location.protocol}//${window.location.host}`,fetchInject:function(t,o){if(!arguments.length)return Promise.reject(new ReferenceError("Failed to execute 'fetchInject': 1 argument required but only 0 present."));if(arguments[0]&&arguments[0].constructor!==Array)return Promise.reject(new TypeError("Failed to execute 'fetchInject': argument 1 must be of type 'Array'."));if(arguments[1]&&arguments[1].constructor!==Promise)return Promise.reject(new TypeError("Failed to execute 'fetchInject': argument 2 must be of type 'Promise'."));const r=[],n=o?[].concat(o):[],c=[];return t.forEach(e=>n.push(window.fetch(e).then(e=>[e.clone().text(),e.blob()]).then(e=>Promise.all(e).then(e=>{r.push({text:e[0],blob:e[1]})})))),Promise.all(n).then(()=>(r.forEach(t=>{c.push({then:o=>{t.blob.type.includes("text/css")?e(window,document,"style",t,o):e(window,document,"script",t,o)}})}),Promise.all(c)))}}}();
