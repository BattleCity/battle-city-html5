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
    opt.offsetX += opt.position.x * opt.cellWidth;
    opt.offsetY += opt.position.y * opt.cellWidth;
    opt.speed *= opt.scale;
    Tank.sup.call(this, opt);
    this.init();
  }

  var proto = {};

  proto.init = function() {
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
    this.sounds['move'].sound.play();
    if (this.directtion !== direct) {
      this.direction = direct;
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
  }

  proto.shot = function() {
    this.sounds['fire'].sound.play();
    this.screen.add(new Bullet({
      image: this.graphics.bullet.image,
      width: this.graphics.bullet.width / 4,
      height: this.graphics.bullet.height,
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
    var image = this.graphics.shield.image;
    var width = this.graphics.shield.width;
    var height = this.graphics.shield.height;
    
  }

  Util.augment(Tank, proto);
  Util.inherit(Tank, Sprite);
  exports.Tank = Tank;
})(this);

