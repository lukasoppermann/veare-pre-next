if (window.location.hostname !== "localhost") {
  (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments);
    }, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m);
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

  ga('create', 'UA-7074034-1', 'auto', { 'allowLinker': true });
  ga('require', 'linker');
  ga('linker:autoLink', ['veare.de', 'lukasoppermann.com', 'lukasoppermann.de', 'lukas-oppermann.de']);
  ga('set', 'anonymizeIp', true);
  ga('send', 'pageview');
}
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function throttle(callback, limit) {
  var wait = false; // Initially, we're not waiting
  return function () {
    // We return a throttled function
    if (!wait) {
      // If we're not waiting
      callback.call(); // Execute users function
      wait = true; // Prevent future invocations
      setTimeout(function () {
        // After a period of time
        wait = false; // And allow future invocations
      }, limit);
    }
  };
}

var Menu = function () {
  function Menu(menuSelector) {
    _classCallCheck(this, Menu);

    this._menu = document.querySelector(menuSelector);
  }

  _createClass(Menu, [{
    key: 'transitionOnScroll',
    value: function transitionOnScroll() {
      var menu = this.instance;
      var _scrollDone = void 0;

      var toggleClass = function toggleClass(posY) {
        if (posY > 150) {
          menu.classList.add('is-hidden');
        } else {
          menu.classList.remove('is-hidden');
        }
      };

      document.addEventListener('scroll', throttle(function () {
        var posY = window.pageYOffset;
        toggleClass(posY);

        _scrollDone = function scrollDone(posY) {
          if (posY === window.pageYOffset) {
            toggleClass(posY);
          } else {
            setTimeout(function () {
              _scrollDone();
            }, 50);
          }
        };

        setTimeout(function () {
          _scrollDone();
        }, 50);
      }, 20));
    }
  }, {
    key: 'instance',
    get: function get() {
      return this._menu;
    }
  }]);

  return Menu;
}();
(function (document, window) {
    window.ready = function (fn) {
        if (document.readyState != 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    };
})(document, window);

ready(function () {
    var menu = new Menu('.o-nav');
    menu.transitionOnScroll();

    document.querySelector('.o-nav__icon').addEventListener('click', function () {
        document.body.classList.toggle('is-active--overlay-menu');
        this.classList.toggle('is-active');
    });
});
//# sourceMappingURL=common.js.map
