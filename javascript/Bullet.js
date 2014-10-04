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
    var currentX = this.offsetX - this.screen.offsetX;
    var currentY = this.offsetY - this.screen.offsetY;
    switch (this.direction) {
      case 'up':
        currentY -= 1;
        break;
      case 'down':
        currentY += 1;
        break;
      case 'left':
        currentX -= 1;
        break;
      case 'right':
        currentX += 1;
        break;
    }
    var x = parseInt(currentX / this.cellWidth);
    var y = parseInt(currentY / this.cellWidth);
    return this.map.hitBullet(x, y);
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
      y: 0,
      x: 0
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

    var hitTest = this.test();
    if (hitTest) {
      this.destroy();
      new Explostion({
        offsetX: this.offsetX,
        offsetY: this.offsetY,
        sounds: this.sounds,
        graphics: this.graphics,
        type: hitTest
      })
    }
  }

  proto.test = function() {
    return _hitTest.call(this);
  }

  Util.augment(Bullet, proto);
  Util.inherit(Bullet, Sprite);
  exports.Bullet = Bullet;
})(this);
