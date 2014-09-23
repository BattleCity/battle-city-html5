'use strict';

(function(exports, undefined) {

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
      },
      cellWidth: 0
    };
    Util.merge(opt, options);
    opt.offsetX += opt.position.x * opt.cellWidth;
    opt.offsetY += opt.position.y * opt.cellWidth;
    Tank.sup.call(this, opt);
    this.init();
  }

  var proto = {};

  proto.init = function() {
  }

  Util.augment(Tank, proto);
  Util.inherit(Tank, Sprite);
  exports.Tank = Tank;
})(this);

