/* pages-loader.js — mounts page HTML inserted by pages/*.js into placeholders.
   No fetch — works under file:// too. */
(function () {
  window.__RR_PAGES__ = window.__RR_PAGES__ || {};

  function mount(name) {
    var holder = document.querySelector('[data-page="' + name + '"]');
    var html = window.__RR_PAGES__[name];
    if (!holder || !html) return false;
    if (holder.getAttribute('data-mounted') === '1') return true;
    var tmp = document.createElement('div');
    tmp.innerHTML = html.trim();
    var node = tmp.firstElementChild;
    if (node) {
      holder.parentNode.replaceChild(node, holder);
      node.setAttribute('data-mounted', '1');
    } else {
      holder.innerHTML = html;
      holder.setAttribute('data-mounted', '1');
    }
    return true;
  }

  // Page scripts may run before their placeholder exists in the DOM
  // (since they are in <head> or above the placeholders). They call this
  // function; we mount immediately if the placeholder is ready, otherwise
  // we mount everything once the DOM is parsed.
  window.__RR_MOUNT_PAGE__ = function (name) {
    if (document.readyState === 'loading') return; // will be mounted on DOMContentLoaded
    mount(name);
  };

  function mountAll() {
    Object.keys(window.__RR_PAGES__).forEach(mount);
  }

  function bootApp() {
    var s = document.createElement('script');
    s.src = 'app.js';
    document.body.appendChild(s);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      mountAll();
      bootApp();
    });
  } else {
    mountAll();
    bootApp();
  }
})();
