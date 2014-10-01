'use strict';

(function(exports, undefined) {

  function Tank(options) {
    var opt = {
      direction: 'up',
      speed: 1,
      dead: false,
      life: 1,
      position: {
        x: 0,
        y: 0
      },
      cellWidth: 0
    };
    Util.merge(opt, options);
    Tank.sup.call(this, opt);
    this.init();
  }

  function _mapTest() {
    var currentX = this.offsetX - this.screen.offsetX;
    var currentY = this.offsetY - this.screen.offsetY;
    switch (this.direction) {
      case 'up':
        currentY -= 1;
        var xleft = parseInt(currentX / this.cellWidth);
        var yleft = parseInt(currentY / this.cellWidth);
        var xright = parseInt((currentX + this.width) / this.cellWidth);
        var yright = parseInt(currentY / this.cellWidth);
        break;
      case 'down':
        currentY += 1;
        var xleft = parseInt(currentX / this.cellWidth);
        var yleft = parseInt((currentY + this.width) / this.cellWidth);
        var xright = parseInt((currentX + this.width) / this.cellWidth);
        var yright = parseInt((currentY + this.width) / this.cellWidth);
        break;
      case 'left':
        currentX -= 1;
        var xleft = parseInt(currentX / this.cellWidth);
        var yleft = parseInt((currentY + this.width) / this.cellWidth);
        var xright = parseInt(currentX / this.cellWidth);
        var yright = parseInt(currentY / this.cellWidth);
        break;
      case 'right':
        currentX += 1;
        var xleft = parseInt((currentX + this.width) / this.cellWidth);
        var yleft = parseInt(currentY / this.cellWidth);
        var xright = parseInt((currentX + this.width) / this.cellWidth);
        var yright = parseInt((currentY + this.width) / this.cellWidth);
        break;
    }
    return this.map.hitTest(xleft, yleft, xright, yright);
  }

  function _hitTest() {
    var edgeTest = _edgeTest.call(this);
    if (edgeTest) return edgeTest;
    var mapTest = _mapTest.call(this);
    if (mapTest) return mapTest;
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
    this.shield();
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
    var that = this;
    this.sounds['move'].sound.play();

    if (this.directtion !== direct) {
      this.direction = direct;
    }

    switch (this.direction) {
      case 'up':
        if (this.test()) return;
        this.offsetY -= this.speed;
        break;
      case 'down':
        if (this.test()) return;
        this.offsetY += this.speed;
        break;
      case 'left':
        if (this.test()) return;
        this.offsetX -= this.speed;
        break;
      case 'right':
        if (this.test()) return;
        this.offsetX += this.speed;
        break;
    }
  }

  proto.shot = function() {
    this.sounds['fire'].sound.play();
    this.screen.add(new Bullet({
      image: this.graphics['bullet'].image,
      width: this.graphics['bullet'].width / 4,
      height: this.graphics['bullet'].height,
      x: 0,
      y: 0,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      scale: this.scale,
      direction: this.direction,
      speed: 2
    }));
  }

  proto.shield = function() {
    var image = this.graphics['shield'].image;
    var width = this.graphics['shield'].width;
    var height = this.graphics['shield'].height;
  }

  proto.test = function() {
    return _hitTest.call(this);
  }

  Util.augment(Tank, proto);
  Util.inherit(Tank, Sprite);
  exports.Tank = Tank;
})(this);

