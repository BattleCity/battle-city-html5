'use strict';

(function(exports, undefined) {
  function Gift() {
    Sound.sup.call(this);
  }

  var proto = {};

  Util.augment(Gift, proto);
  Util.inherit(Gift, Sprite);
  exports.Gift = Gift;
})(this);
