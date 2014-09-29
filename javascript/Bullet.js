'use strict';

(function(exports, undefined) {

  function Bullet(options) {
    var opt = {
      speed: 1,
      direction: 'up',
      y: 0
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
    Bullet.sup.call(this, opt);
  }

  var proto = {};

  proto.update = function() {
    switch (this.direction) {
      case 'up':
        this.offsetY -= this.speed;
        this.x = 0;
        break;
      case 'down':
        this.offsetY += this.speed;
        this.x = 2;
        break;
      case 'left':
        this.offsetX -= this.speed;
        this.x = 3;
        break;
      case 'right':
        this.offsetX += this.speed;
        this.x = 1;
        break;
    }
  }

  Util.augment(Bullet, proto);
  Util.inherit(Bullet, Sprite);
  exports.Bullet = Bullet;
})(this);
