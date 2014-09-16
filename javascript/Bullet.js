'use strict';

(function(exports, undefined) {

  function Bullet() {
    this.speed = 1;
    this.direction = 'left';
    this.init();
    Bullet.sup.call(this);
  }

  var proto = {};

  Bullet.init = function() {
  }

  Util.augment(Bullet, proto);
  Util.inherit(Bullet, Sprite);
  exports.Bullet = Bullet;
})(this);




