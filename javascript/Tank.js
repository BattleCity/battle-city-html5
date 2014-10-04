'use strict';

(function(exports, undefined) {

  var logger = new Logger();

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
    this.born();
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
        var offsetY = this.offsetY + this.width - graphics.height;
        var x = 2;
        break;
      case 'left':
        var offsetX = this.offsetX;
        var offsetY = this.offsetY + this.width / 2 - graphics.width / 8;
        var x = 3;
        break;
      case 'right':
        var offsetX = this.offsetX + this.width - graphics.width / 4;
        var offsetY = this.offsetY + this.width / 2 - graphics.width / 8;
        var x = 1;
        break;
    }

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
      cellWidth: this.cellWidth,
      sounds: this.sounds,
      graphics: this.graphics,
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
      x: 0,
      y: 0
    });

    bornAnim.update = function() {
      counter ++;
      if (counter % 10 === 0) {
        this.x ++;
        if (this.x === 3) this.x = 0;
      }

      if (counter === 120) {
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
    that.visible = true;
    var shieldAnim = new Sprite({
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      image: shield.image,
      height: shield.height / 2,
      width: shield.width,
      x: 0,
      y: 0
    });

    shieldAnim.update = function() {
      counter ++;
      if (counter % 10 === 0) {
        this.y = this.y === 0 ? 1 : 0;
      }

      if (counter === 80) {
        this.destroy();
      }
    }

    this.screen.add(shieldAnim);
  }

  proto.test = function() {
    return _hitTest.call(this);
  }

  Util.augment(Tank, proto);
  Util.inherit(Tank, Sprite);
  exports.Tank = Tank;
})(this);

