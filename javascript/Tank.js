'use strict';

(function(exports, undefined) {

  var config = {};

  function Tank(image, scale, x, y, width, height, posX, posY) {
    this.direction = 'up';
    this.speed = 1;
    this.superman = false;
    this.dead = false;
    this.life = 1;
    this.position = {
      x: 0,
      y: 0
    };
    Tank.sup.call(this, image, scale, x, y, width, height, posX, posY);
    this.init();
  }

  var proto = {};

  proto.init = function() {
  }

  Util.augment(Tank, proto);
  Util.inherit(Tank, Sprite);
  exports.Tank = Tank;
})(this);

