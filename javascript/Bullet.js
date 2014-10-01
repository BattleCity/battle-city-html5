'use strict';

(function(exports, undefined) {

  function _edgeTest() {
    switch (this.direction) {
      case 'up':
        return this.screen.offsetY >= this.offsetY * this.scale;
        break;
      case 'down':
        return this.screen.offsetY + this.cellWidth * 26 * this.scale - this.height * this.scale <= this.offsetY * this.scale;
        break;
      case 'left':
        return this.screen.offsetX >= this.offsetX * this.scale;
        break;
      case 'right':
        return this.screen.offsetX + this.cellWidth * 26 * this.scale - this.width * this.scale <= this.offsetX * this.scale;
        break;
    }
  }

  function _mapTest() {
    return false;
  }

  function _enemyTest() {
    return false;
  }

  function _hitTest() {
    var edgeTest = _edgeTest.call(this);
    if (edgeTest) return edgeTest;
    var mapTest = _mapTest.call(this);
    if (mapTest) return mapTest;
    var enemyTest = _enemyTest.call(this);
    if (enemyTest) return enemyTest;
  }

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
    if (this.test()) {
      this.destroy();
      return new Explostion({
        offsetX: this.offsetX,
        offsetY: this.offsetY,
        sounds: this.sounds,
        graphics: this.graphics
      })
    }
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

  proto.test = function() {
    return _hitTest.call(this);
  }

  Util.augment(Bullet, proto);
  Util.inherit(Bullet, Sprite);
  exports.Bullet = Bullet;
})(this);
