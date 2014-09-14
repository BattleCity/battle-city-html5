'use strict';

(function(exports, undefined) {
  window.sss = 20;
  function Sprite(image, scale, x, y, width, height, posX, posY) {
    this.scale = scale || 1;
    this.x = x * this.scale;
    this.y = y * this.scale;
    this.image = image.image;
    this.width = (width || image.width) * this.scale;
    this.height = (height || image.height) * this.scale;
    this.posX = posX;
    this.posY = posY;
    Sprite.sup.call(this);
    return this;
  }

  var proto = {};

  proto.hitTestObject = function(obj) {
    var minx = this.x > obj.x ? this.x :obj.x;
    var maxx = this.x + this.width < obj.x + obj.width ? this.x + this.width : obj.x + obj.width;
    var miny = this.y > obj.y ? this.y : obj.y;
    var maxy = this.y + this.width < obj.y + obj.width ? this.y + this.width : obj.y + obj.width;
    return minx <= maxx && miny <= maxy;
  }

  proto.draw = function(ctx) {
    this.offsetX = (this.posX || 0) * this.scale * this.width;
    this.offsetY = (this.posY || 0) * this.scale * this.height;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.drawImage(this.image, this.offsetX, this.offsetY, this.width, this.height, 0, 0, this.width, this.height);
    ctx.restore();
  }

  proto.update = function() {}

  Util.augment(Sprite, proto);
  Util.inherit(Sprite, Base);
  exports.Sprite = Sprite;
})(this);
