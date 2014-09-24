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

  proto.run = function() {
    switch (this.direction) {
      case 'up':
        this.y = 0;
        this.x = this.x ? 0 : 1;
        break;
      case 'down':
        this.y = 2;
        this.x = this.x ? 0 : 1;
        break;
      case 'left':
        this.y = 3;
        this.x = this.x ? 0 : 1;
        break;
      case 'right':
        this.y = 1;
        this.x = this.x ? 0 : 1;
        break;
    }
  }

  proto.forward = function(direct) {
    if (this.directtion !== direct) {
      this.direction = direct;
    }
    switch (this.direction) {
      case 'up':
        this.offsetY -= this.speed;
        break;
      case 'down':
        this.offsetY += this.speed;
        break;
      case 'left':
        this.offsetX -= this.speed;
        break;
      case 'right':
        this.offsetX += this.speed;
        break;
    }
  }

  Util.augment(Tank, proto);
  Util.inherit(Tank, Sprite);
  exports.Tank = Tank;
})(this);

