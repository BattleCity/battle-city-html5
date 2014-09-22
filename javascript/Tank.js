'use strict';

(function(exports, undefined) {

  var config = {};

  function Tank(options) {
    var opt = {
      direction: 'up',
      speed: 1,
      superman: false,
      dead: false,
      life: 1,
      position: {
        x: 0,
        y: 0
      }
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
    Tank.sup.call(this, options);
    this.init();
  }

  var proto = {};

  proto.init = function() {
  }

  Util.augment(Tank, proto);
  Util.inherit(Tank, Sprite);
  exports.Tank = Tank;
})(this);

