var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};!function(t,e){"function"==typeof define&&define.amd?define(e):"object"==("undefined"==typeof exports?"undefined":_typeof(exports))?module.exports=e():t.Minigrid=e()}(this,function(t){"use strict";function e(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t}var n=function t(n){var t=n.container instanceof Node?n.container:document.querySelector(n.container),o=n.item instanceof NodeList?n.item:t.querySelectorAll(n.item);this.props=e(n,{container:t,nodeList:o})};return n.prototype.mount=function(){if(!this.props.container)return!1;if(!this.props.nodeList||0===this.props.nodeList.length)return!1;var t="number"==typeof this.props.gutter&&isFinite(this.props.gutter)&&Math.floor(this.props.gutter)===this.props.gutter?this.props.gutter:0,e=this.props.done,n=this.props.container,o=this.props.nodeList;n.style.width="";var i=Array.prototype.forEach,r=n.getBoundingClientRect().width,s=o[0].getBoundingClientRect().width+t,p=Math.max(Math.floor((r-t)/s),1),u=0;r=s*p+t+"px",n.style.width=r,n.style.position="relative";for(var a=[],f=[],c=0;c<p;++c)f.push(c*s+t),a.push(t);this.props.rtl&&f.reverse(),i.call(o,function(e){var n=a.slice(0).sort(function(t,e){return t-e}).shift();n=a.indexOf(n);var o=parseInt(f[n]),i=parseInt(a[n]);e.style.position="absolute",e.style.webkitBackfaceVisibility=e.style.backfaceVisibility="hidden",e.style.transformStyle="preserve-3d",e.style.transform="translate3D("+o+"px,"+i+"px, 0)",a[n]+=e.getBoundingClientRect().height+t,u+=1}),n.style.display="";var d=a.slice(0).sort(function(t,e){return t-e}).pop();n.style.height=d+"px","function"==typeof e&&e(o)},n});var grid=new Minigrid({container:".js-cards",item:".js-card",gutter:10});document.addEventListener("DOMContentLoaded",function(){grid.mount()}),window.addEventListener("resize",function(){grid.mount()});
//# sourceMappingURL=portfolio.js.map
