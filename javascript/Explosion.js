'use strict';

(function(exports, undefined) {
  function Explostion() {
    Sound.sup.call(this);
  }

  var proto = {};

  Util.augment(Explostion, proto);
  Util.inherit(Explostion, Sprite);
  exports.Explostion = Explostion;
})(this);

