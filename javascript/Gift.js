'use strict';

(function(exports, undefined) {
  function Gift(options) {
    Gift.sup.call(this, options);
  }

  var proto = {};

  Util.augment(Gift, proto);
  Util.inherit(Gift, Sprite);
  exports.Gift = Gift;
})(this);
