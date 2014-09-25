'use strict';

(function(exports, undefined) {
  function Explostion(options) {
    var opt = {};
    Util.merge(opt, options);
    Util.merge(this, opt);
    Sound.sup.call(this);
  }

  var proto = {};

  Util.augment(Explostion, proto);
  Util.inherit(Explostion, Sprite);
  exports.Explostion = Explostion;
})(this);

