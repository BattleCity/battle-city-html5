'use strict';

(function(exports, undefined) {

  var logger = new Logger();

  function Tank(options) {
    var opt = {
      direction: 'up',
      speed: 1,
      dead: false,
      life: 1,
      invincible: false,
      spawning: true,
      bulletLimit: 1,
      app: null,
      onDestroy: null,
      position: {
        x: 0,
        y: 0
      },
      cellWidth: 0,
      visible: false
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
    Tank.sup.call(this, opt);
    this.init();
  }

  function _mapTest() {
    var currentX = this.offsetX - this.screen.offsetX;
    var currentY = this.offsetY - this.screen.offsetY;
    var left = currentX;
    var right = currentX + this.width - 1;
    var top = currentY;
    var bottom = currentY + this.height - 1;
    switch (this.direction) {
      case 'up':
        top -= this.speed;
        var xleft = parseInt(left / this.cellWidth);
        var yleft = parseInt(top / this.cellWidth);
        var xright = parseInt(right / this.cellWidth);
        var yright = parseInt(top / this.cellWidth);
        break;
      case 'down':
        bottom += this.speed;
        var xleft = parseInt(left / this.cellWidth);
        var yleft = parseInt(bottom / this.cellWidth);
        var xright = parseInt(right / this.cellWidth);
        var yright = parseInt(bottom / this.cellWidth);
        break;
      case 'left':
        left -= this.speed;
        var xleft = parseInt(left / this.cellWidth);
        var yleft = parseInt(bottom / this.cellWidth);
        var xright = parseInt(left / this.cellWidth);
        var yright = parseInt(top / this.cellWidth);
        break;
      case 'right':
        right += this.speed;
        var xleft = parseInt(right / this.cellWidth);
        var yleft = parseInt(top / this.cellWidth);
        var xright = parseInt(right / this.cellWidth);
        var yright = parseInt(bottom / this.cellWidth);
        break;
    }
    return this.map.hitTest(xleft, yleft, xright, yright);
  }

  function _tankTest() {
    var list = this.screen._tanks;  // Use typed list instead of full displayList (#10)
    var nextX = this.offsetX;
    var nextY = this.offsetY;

    switch (this.direction) {
      case 'up':    nextY -= this.speed; break;
      case 'down':  nextY += this.speed; break;
      case 'left':  nextX -= this.speed; break;
      case 'right': nextX += this.speed; break;
    }

    for (var i = 0; i < list.length; i++) {
      var other = list[i];
      if (other === this) continue;
      if (other.destroyed || other.dead || other.spawning) continue;

      if (nextX < other.offsetX + other.width &&
          nextX + this.width > other.offsetX &&
          nextY < other.offsetY + other.height &&
          nextY + this.height > other.offsetY) {
        return true;
      }
    }
    return false;
  }

  function _hitTest() {
    var edgeTest = _edgeTest.call(this);
    if (edgeTest) return edgeTest;
    var mapTest = _mapTest.call(this);
    if (mapTest) return mapTest;
    var tankTest = _tankTest.call(this);
    if (tankTest) return tankTest;
  }

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

  var proto = {};

  proto.init = function() {
    this.offsetX += this.position.x * this.cellWidth;
    this.offsetY += this.position.y * this.cellWidth;
    this.speed *= this.scale;
    this._activeBullets = 0;
    this.born();
  }

  proto.canAct = function() {
    return !this.spawning &&
      !this.destroyed &&
      !this.dead &&
      (!this.app || this.app.isPlaying());
  }

  proto.syncEffects = function() {
    if (this._bornAnim && !this._bornAnim.destroyed) {
      this._bornAnim.offsetX = this.offsetX;
      this._bornAnim.offsetY = this.offsetY;
    }

    if (this._shieldAnim && !this._shieldAnim.destroyed) {
      this._shieldAnim.offsetX = this.offsetX;
      this._shieldAnim.offsetY = this.offsetY;
    }
  }

  proto.move = function(offsetX, offsetY) {
    this.offsetX += offsetX || 0;
    this.offsetY += offsetY || 0;
    this.syncEffects();
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

  proto.shot = function() {
    if (!this.canAct()) return;
    if (this._activeBullets >= this.bulletLimit) return;

    this.sounds['fire'].sound.play();
    var graphics = this.graphics['bullet'];
    switch (this.direction) {
      case 'up':
        var offsetX = this.offsetX + this.width / 2 - graphics.width / 8;
        var offsetY = this.offsetY;
        var x = 0;
        break;
      case 'down':
        var offsetX = this.offsetX + this.width / 2 - graphics.width / 8;
        var offsetY = this.offsetY + this.height - graphics.height;
        var x = 2;
        break;
      case 'left':
        var offsetX = this.offsetX;
        var offsetY = this.offsetY + this.height / 2 - graphics.width / 8;
        var x = 3;
        break;
      case 'right':
        var offsetX = this.offsetX + this.width - graphics.width / 4;
        var offsetY = this.offsetY + this.height / 2 - graphics.width / 8;
        var x = 1;
        break;
    }

    this._activeBullets++;
    this.screen.add(new Bullet({
      image: graphics.image,
      map: this.map,
      width: graphics.width / 4,
      height: graphics.height,
      x: x,
      y: 0,
      offsetX: offsetX,
      offsetY: offsetY,
      scale: this.scale,
      direction: this.direction,
      speed: 3,
      screen: this.screen,
      app: this.app,
      cellWidth: this.cellWidth,
      sounds: this.sounds,
      graphics: this.graphics,
      from: this.type,
      owner: this,
      debug: false
    }));
  }

  proto.born = function() {
    var that = this;
    var born = this.graphics['born'];
    var counter = 0;
    var bornAnim = new Sprite({
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      image: born.image,
      height: born.height,
      width: born.width / 4,
      scale: this.scale,
      x: 0,
      y: 0
    });
    this._bornAnim = bornAnim;

    bornAnim.update = function() {
      this.offsetX = that.offsetX;
      this.offsetY = that.offsetY;
      counter ++;
      if (counter % 10 === 0) {
        this.x ++;
        if (this.x === 3) this.x = 0;
      }

      if (counter === 120) {
        that.spawning = false;
        that._bornAnim = null;
        this.destroy();
        setTimeout(function() {
          that.shield();
        }, 16);
      }
    };
    this.screen.add(bornAnim);
  }

  proto.shield = function() {
    var that = this;
    var shield = this.graphics['shield'];
    var counter = 0;
    that.invincible = true;
    that.visible = true;
    var shieldAnim = new Sprite({
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      image: shield.image,
      height: shield.height / 2,
      width: shield.width,
      scale: this.scale,
      x: 0,
      y: 0
    });
    this._shieldAnim = shieldAnim;

    shieldAnim.update = function() {
      this.offsetX = that.offsetX;
      this.offsetY = that.offsetY;
      counter ++;
      if (counter % 10 === 0) {
        this.y = this.y === 0 ? 1 : 0;
      }

      if (counter === 80) {
        that.invincible = false;
        that._shieldAnim = null;
        this.destroy();
      }
    }

    this.screen.add(shieldAnim);
  }

  proto.test = function() {
    return _hitTest.call(this);
  }

  proto.hit = function() {
    return !this.invincible;
  }

  proto.explode = function() {
    if (!this.screen || !this.graphics || !this.sounds) return;
    this.screen.add(new Explostion({
      offsetX: this.offsetX + this.width / 2,
      offsetY: this.offsetY + this.height / 2,
      baseWidth: this.width,
      baseHeight: this.height,
      sounds: this.sounds,
      graphics: this.graphics,
      screen: this.screen,
      scale: this.scale,
      type: 'tank'
    }));
  }

  proto.destroy = function() {
    if (this.destroyed) return;
    this.explode();
    this.destroyed = true;
    this.dead = true;
    this.visible = false;
    this.invincible = false;
    if (this._bornAnim && !this._bornAnim.destroyed) this._bornAnim.destroy();
    if (this._shieldAnim && !this._shieldAnim.destroyed) this._shieldAnim.destroy();
    this._bornAnim = null;
    this._shieldAnim = null;
    if (typeof this.onDestroy === 'function') {
      this.onDestroy(this);
    }
  }

  Util.augment(Tank, proto);
  Util.inherit(Tank, Sprite);
  exports.Tank = Tank;
})(this);
