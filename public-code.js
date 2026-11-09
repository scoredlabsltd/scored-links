/* Public-code routing only. No credentials, resolver fetch or customer activation. */
(function (root) {
  'use strict';
  var pattern = /^[A-HJ-NP-Z2-9]{8}$/;
  function entry(location, storage) {
    var params = new URLSearchParams(location.search || '');
    if (['t','token'].some(function (k) { return params.has(k) && (params.get(k) || '').length === 8; })) return { kind: 'invalid', code: null };
    if (params.has('customerCode')) {
      var code = params.get('customerCode');
      var valid = pattern.test(code || '') && params.get('purpose') === 'public-code' &&
        Array.from(params.keys()).every(function (k) { return ['customerCode', 'purpose'].indexOf(k) >= 0 && params.getAll(k).length === 1; }) && !location.hash;
      return { kind: valid ? 'public-code' : 'invalid', code: valid ? code : null };
    }
    if (params.toString() || location.hash) return null; // Never override explicit legacy links.
    try {
      var saved = storage && storage.getItem('scored.public-code.v1');
      if (saved && pattern.test(saved)) return { kind: 'public-code', code: saved };
    } catch (_) { /* Storage refusal never creates a credential fallback. */ }
    return null;
  }
  function links(code) {
    if (!pattern.test(code || '')) throw Error('Invalid public code');
    var query = 'customerCode=' + encodeURIComponent(code) + '&purpose=public-code';
    return { canonical: 'HTTPS://LINKS.SCOREDLABS.COM/' + code, app: 'scored://open?' + query, universal: 'https://links.scoredlabs.com/open?' + query };
  }
  function landing(value, win, doc, iosInstall, androidInstall) {
    var card = doc.createElement('main'); card.className = 'card';
    function text(tag, value) { var el = doc.createElement(tag); el.textContent = value; card.appendChild(el); return el; }
    text('h1', value.kind === 'public-code' ? 'Open your Scored scoreboard' : 'Code unavailable');
    if (value.kind !== 'public-code') { text('p', 'Use the current customer QR or permanent code. Older eight-character codes have been retired.'); doc.body.appendChild(card); return; }
    var target = links(value.code);
    text('p', value.code); text('p', 'Keep this page open. After installing Scored, return here and choose Open Scored.');
    function button(label, href) { var a = text('a', label); a.className = 'button'; a.href = href; return a; }
    button('Open Scored', target.app); button('Install for iPhone', iosInstall); button('Install for Android', androidInstall);
    try { win.sessionStorage.setItem('scored.public-code.v1', value.code); } catch (_) { /* URL remains the recovery reference. */ }
    doc.body.appendChild(card);
    // A user gesture is retained for browsers that deny automatic custom-scheme launch.
    // No bearer/code exchange, external redirect or install-referrer promise occurs.
  }
  var api = { entry: entry, links: links, landing: landing };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.ScoredPublicCode = api;
})(typeof window !== 'undefined' ? window : globalThis);
