'use strict';

(function(exports, undefined) {
  var global = exports;

  var Util = {
    create: function(o) {
      if (Object.create) {
        return Object.create(o);
      } else {
        var F = function() {};
        F.prototype = o;
        return new F();
      }
    },
    $: function(id) {
      return document.getElementById(id);
    },
    extend: function() {
      var args = this.slice.call(arguments);
      var object = args.shift();
      for (var i = 0, l = args.length; i < l; i++) {
        var props = args[i];
        for (var key in props) {
          object[key] = props[key];
        }
      }
      return object;
    },
    inherit: function(sub, sup) {
      var temp = sub.prototype;
      sub.prototype = this.create(sup.prototype);
      for (var i in temp) {
        sub.prototype[i] = temp[i];
      }
      sub.prototype.constructor = sub;
      sub.sup = sup;
    },
    augment: function(r, s) {
      this.each(s, function(v, k) {
        r.prototype[k]= v;
      });
    },
    log: function(l) {
      console && (this.type(console.log) == 'function') && console.log(l);
    },
    merge: function(r, s) {
      for (var i in s) {
        r[i] = s[i];
      };
      return r;
    },
    each: function(object, fn) {
      if (!object) return;
      for (var i in object) {
        if (object.hasOwnProperty(i)) {
          fn.call(this,object[i],i);
        }
      }
      return object;
    },
    removeValue: function(arr, val) {
      var index = this.indexOf(arr, val);
      if (index !== -1) {
        return arr.splice(index, 1)[0];
      }
    },
    type: function(c) {
      if (c === null || typeof c === "undefined") {
        return String(c);
      } else {
        return Object.prototype.toString.call(c).replace(/\[object |\]/g, '').toLowerCase();
      }
    },
    slice: Array.prototype.slice,
    bind: function(e, handler) {
      if (global.addEventListener) {
        global.addEventListener(e, handler, false);
      } else if (document.attachEvent) {
        document.attachEvent('on' + e, handler);
      }
    }
  };

  exports.Util = exports._ = Util;
})(this);
