'use strict';

(function(exports, undefined) {
  var global = exports;
  var noop = function(){};
  var KEYS = {
      A:65,
      B:66,
      C:67,
      D:68,
      E:69,
      F:70,
      G:71,
      H:72,
      I:73,
      J:74,
      K:75,
      L:76,
      M:77,
      N:78,
      O:79,
      P:80,
      Q:81,
      R:82,
      S:83,
      T:84,
      U:85,
      V:86,
      W:87,
      X:88,
      Y:89,
      Z:90,
      ZERO:48,
      ONE:49,
      TWO:50,
      THREE:51,
      FOUR:52,
      FIVE:53,
      SIX:54,
      SEVEN:55,
      EIGHT:56,
      NINE:57,
      F1:112,
      F2:113,
      F3:114,
      F4:115,
      F5:116,
      F6:117,
      F7:118,
      F8:119,
      F9:120,
      F10:121,
      F11:122,
      F12:123,
      LEFT:37,
      UP:38,
      RIGHT:39,
      DOWN:40,
      BACKSPACE:8,
      TAB:9,
      ENTER:13,
      SHIFT:16,
      CTRL:17,
      ALT:18,
      ESC:27,
      SPACE:32
  };

  var _KEYS = Util.transpose(KEYS);

  var keysDown = [];

  function bindOrFire (key, handlerName, opt_handler) {
    if (opt_handler) {
      key[handlerName] = opt_handler;
    } else {
      key[handlerName]();
    }
  }

  function Key (keyCode) {
    this.keyCode = keyCode;
  }
  var proto = {
    _downHandler : noop,
    _upHandler: noop,
    _pressHandler: noop,
    isDown: function() {
      return Util.indexOf(keysDown, this.keyCode) !== -1;
    },
    down:function(opt_handler) {
      bindOrFire(this, '_downHandler', opt_handler);
    },
    up: function(opt_handler) {
      bindOrFire(this, '_upHandler', opt_handler);
    },
    press: function(opt_handler) {
      bindOrFire(this, '_pressHandler', opt_handler);
    },
    unbindDown: function() {
      this._downHandler = noop;
    },
    unbindUp: function() {
      this._upHandler = noop;
    },
    unbindPress: function() {
      this._pressHandler = noop;
    }
  };

  Util.augment(Key, proto);

  var Keyboard = {};

  Keyboard.Key = Key;

  var running = false;

  proto = {
    simulate: function() {
      var i, len = keysDown.length;
      for (i = 0; i < len; i++) {
        var keyCode = keysDown[i];
        var keyName = _KEYS[keyCode];
        if (keyName) {
          Keyboard[keyName].down();
        }
      }
    },
    run: function(handler) {
      running = true;
      Util.requestAnimationFrame.call(global, function() {
        if (!running) return;
        Keyboard.run(handler);
        handler();
      });
    },
    stop: function() {
      running = false;
    }
  }

  Util.extend(Keyboard,proto);

  Util.each(KEYS, function(keyCode, keyName) {
    Keyboard[keyName] = new Key(keyCode);
  });

  Util.bind('keydown', function(evt) {
    var keyCode = evt.keyCode;
    var keyName = _KEYS[keyCode];
    var isNew = Util.pushUnique(keysDown, keyCode);
    if (isNew && Keyboard[keyName]) {
      Keyboard[keyName].press();
    }
  });

  Util.bind('keyup', function(evt) {
    var keyCode = Util.removeValue(keysDown, evt.keyCode);
    var keyName = _KEYS[keyCode];
    if (keyName) {
      Keyboard[keyName].up();
    }
  });

  Util.bind('blur', function(evt) {
    keysDown.length = 0;
  });

  exports.Keyboard = Keyboard;
})(this);
