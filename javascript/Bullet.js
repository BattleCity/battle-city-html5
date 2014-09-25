'use strict';

(function(exports, undefined) {

  function Bullet(options) {
    var opt = {
      speed: 1,
      direction: 'up'
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
    Bullet.sup.call(this, opt);
    this.init();
  }

  var proto = {};

  proto.init = function() {
    
  }

  proto.update = function() {
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
        this.offsetY += this.speed;
        break;
    }
  }

  proto.destroy = function() {
  }

  Util.augment(Bullet, proto);
  Util.inherit(Bullet, Sprite);
  exports.Bullet = Bullet;
})(this);
