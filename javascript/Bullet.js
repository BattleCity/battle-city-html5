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
    var x1, y1, x2, y2;
    switch (this.direction) {
      case 'up':
        currentY -= 1;
        x1 = parseInt(currentX / this.cellWidth);
        x2 = parseInt((currentX + this.width - 1) / this.cellWidth);
        y1 = y2 = parseInt(currentY / this.cellWidth);
        break;
      case 'down':
        currentY += this.height;
        x1 = parseInt(currentX / this.cellWidth);
        x2 = parseInt((currentX + this.width - 1) / this.cellWidth);
        y1 = y2 = parseInt(currentY / this.cellWidth);
        break;
      case 'left':
        currentX -= 1;
        y1 = parseInt(currentY / this.cellWidth);
        y2 = parseInt((currentY + this.height - 1) / this.cellWidth);
        x1 = x2 = parseInt(currentX / this.cellWidth);
        break;
      case 'right':
        currentX += this.width;
        y1 = parseInt(currentY / this.cellWidth);
        y2 = parseInt((currentY + this.height - 1) / this.cellWidth);
        x1 = x2 = parseInt(currentX / this.cellWidth);
        break;
    }
    return this.map.hitBullet(x1, y1, x2, y2, this.direction);
  }

  function _enemyTest() {
    var that = this;
    var list = this.screen._displayList;
    for (var i = 0; i < list.length; i++) {
      var target = list[i];
      if (target.destroyed || target.dead || target.spawning) continue;
      var isTarget = (that.from === 'player' && target.type === 'enemy') ||
                     (that.from === 'enemy' && target.type === 'player');
      if (!isTarget) continue;
      if (target.hitTest(that)) {
        var isDead = typeof target.hit === 'function' ? target.hit() : true;
        if (isDead) {
          target.destroy();
        }
        return {
          type: isDead ? null : 'shield',
          target: target
        };
      }
    }
    return false;
  }

  function _bulletTest() {
    var that = this;
    var list = this.screen._displayList;
    for (var i = 0; i < list.length; i++) {
      var target = list[i];
      if (target === that) continue;
      if (target.destroyed || target.type !== 'bullet') continue;
      if (target.from === that.from) continue;
      if (!target.hitTest(that)) continue;

      var width = Math.max(that.width, target.width);
      var height = Math.max(that.height, target.height);
      var centerX = (that.offsetX + that.width / 2 + target.offsetX + target.width / 2) / 2;
      var centerY = (that.offsetY + that.height / 2 + target.offsetY + target.height / 2) / 2;
      target.destroy();
      return {
        type: 'bullet',
        target: {
          offsetX: centerX - width / 2,
          offsetY: centerY - height / 2,
          width: width,
          height: height
        }
      };
    }
    return false;
  }

  function _hitTest() {
    var edgeTest = _edgeTest.call(this);
    if (edgeTest) return edgeTest;
    var mapTest = _mapTest.call(this);
    if (mapTest) return mapTest;
    var bulletTest = _bulletTest.call(this);
    if (bulletTest) return bulletTest;
    var enemyTest = _enemyTest.call(this);
    if (enemyTest) return enemyTest;
  }

  function Bullet(options) {
    var opt = {
      type: 'bullet',
      speed: 1,
      direction: 'up',
      y: 0,
      x: 0,
      owner: null,
      app: null
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
    Bullet.sup.call(this, opt);
  }

  var proto = {};

  proto.update = function() {
    if (this.app && !this.app.isPlaying()) {
      this.destroy();
      return;
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

    var hitTest = this.test();
    if (hitTest) {
      this.destroy();
      var type = typeof hitTest === 'string' ? hitTest : hitTest.type;
      var target = hitTest.target;
      var offsetX = target ? target.offsetX + target.width / 2 : this.offsetX + this.width / 2;
      var offsetY = target ? target.offsetY + target.height / 2 : this.offsetY + this.height / 2;
      var baseWidth = target ? target.width : this.cellWidth;
      var baseHeight = target ? target.height : this.cellWidth;

      if (type === 'home') {
        baseWidth = this.cellWidth * 2;
        baseHeight = this.cellWidth * 2;
      }

      if (type === 'home' && this.app && this.app.homeDestroyed) {
        this.app.homeDestroyed();
      }

      if (type) {
        this.screen.add(new Explostion({
          offsetX: offsetX,
          offsetY: offsetY,
          baseWidth: baseWidth,
          baseHeight: baseHeight,
          sounds: this.sounds,
          graphics: this.graphics,
          screen: this.screen,
          scale: this.scale,
          type: type
        }));
      }
    }
  }

  proto.test = function() {
    return _hitTest.call(this);
  }

  proto.destroy = function() {
    if (this.destroyed) return;
    this.destroyed = true;
    if (this.owner && this.owner._activeBullets > 0) {
      this.owner._activeBullets--;
    }
  }

  Util.augment(Bullet, proto);
  Util.inherit(Bullet, Sprite);
  exports.Bullet = Bullet;
})(this);
