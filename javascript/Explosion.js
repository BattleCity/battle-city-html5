'use strict';

(function(exports, undefined) {
  function Explostion(options) {
    var opt = {
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
    Sound.sup.call(this);
    this.init();
  }

  var proto = {};

  proto.init = function() {
    this.boom();
  }

  proto.boom = function() {
    this.sounds['hitnone'].sound.play();
  }

  Util.augment(Explostion, proto);
  Util.inherit(Explostion, Sprite);
  exports.Explostion = Explostion;
})(this);

