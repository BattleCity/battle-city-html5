'use strict';

(function(exports, undefined) {

  var config = {};

  function Tank() {
    this.direction = 'up';
    this.speed = 1;
    this.superman = false;
    this.dead = false;
    this.life = 1;
    this.position = {
      x: 0,
      y: 0
    };
    this.init();
    Tank.sup.call(this);
  }

  var proto = {};

  proto.init = function() {
  }

  Util.augment(Tank, proto);
  Util.inherit(Tank, Sprite);
  exports.Tank = Tank;
})(this);

