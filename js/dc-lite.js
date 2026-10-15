/* Runtime minimo per le pagine interattive del sito MD Edil Group.
   Supporta {{valore}}, {{oggetto.campo}}, <sc-for list="{{lista}}" as="x"> e onClick / onChange. */
(function () {
  class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {}; }
    setState(patch) { Object.assign(this.state, patch); if (this._render) this._render(); }
  }
  window.DCLogic = DCLogic;

  var HOLE = /\{\{\s*([\w.]+)\s*\}\}/g;
  function lookup(scope, path) {
    var parts = path.split('.'), v = scope;
    for (var i = 0; i < parts.length; i++) { if (v == null) return undefined; v = v[parts[i]]; }
    return v;
  }
  function fill(str, scope) {
    return str.replace(HOLE, function (_, p) { var v = lookup(scope, p); return v == null ? '' : String(v); });
  }
  function exact(str) { var m = /^\s*\{\{\s*([\w.]+)\s*\}\}\s*$/.exec(str); return m ? m[1] : null; }

  function walk(node, scope) {
    if (node.nodeType === 3) {
      if (node.nodeValue.indexOf('{{') >= 0) node.nodeValue = fill(node.nodeValue, scope);
      return;
    }
    if (node.nodeType !== 1 && node.nodeType !== 11) return;
    if (node.nodeType === 1 && node.localName === 'sc-for') {
      var listPath = exact(node.getAttribute('list') || ''), as = node.getAttribute('as') || 'item';
      var list = listPath ? lookup(scope, listPath) : [];
      var frag = document.createDocumentFragment();
      (list || []).forEach(function (item) {
        var s = Object.create(scope); s[as] = item;
        var part = document.createDocumentFragment();
        Array.prototype.forEach.call(node.childNodes, function (c) { part.appendChild(c.cloneNode(true)); });
        walk(part, s);
        frag.appendChild(part);
      });
      node.parentNode.replaceChild(frag, node);
      return;
    }
    if (node.nodeType === 1) {
      Array.prototype.slice.call(node.attributes).forEach(function (a) {
        if (a.value.indexOf('{{') < 0) return;
        var name = a.name.toLowerCase();
        if (name === 'onclick' || name === 'onchange' || name === 'oninput') {
          var fn = lookup(scope, exact(a.value) || '');
          node.removeAttribute(a.name);
          if (typeof fn === 'function') node.addEventListener(name.slice(2), fn);
          if (name === 'onchange' && typeof fn === 'function') node.addEventListener('input', fn);
          return;
        }
        var val = fill(a.value, scope);
        if (name === 'value') { node.value = val; }
        node.setAttribute(a.name, val);
      });
    }
    Array.prototype.slice.call(node.childNodes).forEach(function (c) { walk(c, scope); });
  }

  window.DCLite = {
    mount: function (Component, tpl, host) {
      var comp = new Component({});
      var rendering = false;
      comp._render = function () {
        if (rendering) return; rendering = true;
        // conserva campo attivo e cursore durante il ridisegno
        var act = document.activeElement, key = null, sel = null;
        if (act && host.contains(act) && act.closest('label')) {
          key = act.closest('label').firstChild.textContent.trim().slice(0, 40);
          try { sel = act.selectionStart; } catch (e) {}
        }
        var frag = tpl.content.cloneNode(true);
        walk(frag, comp.renderVals());
        host.replaceChildren(frag);
        if (key) {
          var labels = host.querySelectorAll('label');
          for (var i = 0; i < labels.length; i++) {
            if (labels[i].firstChild && labels[i].firstChild.textContent.trim().slice(0, 40) === key) {
              var inp = labels[i].querySelector('input');
              if (inp) { inp.focus(); try { if (sel != null) inp.setSelectionRange(sel, sel); } catch (e) {} }
              break;
            }
          }
        }
        rendering = false;
      };
      comp._render();
    }
  };
})();
