'use strict';

(function(exports, undefined) {

  function Sprite(image, scale, x, y, width, height, posX, posY) {
    this.scale = scale || 1;
    this.x = x * this.scale;
    this.y = y * this.scale;
    this.image = image.image;
    this.originWidth = width || image.width;
    this.originHeight = height || image.height;
    this.width = this.originWidth * this.scale;
    this.height = this.originHeight * this.scale;
    this.posX = posX || 0;
    this.posY = posY || 0;
    Sprite.sup.call(this);
    return this;
  }

  var proto = {};

  proto.hitTest = function(obj) {
    var minx = this.x > obj.x ? this.x :obj.x;
    var maxx = this.x + this.width < obj.x + obj.width ? this.x + this.width : obj.x + obj.width;
    var miny = this.y > obj.y ? this.y : obj.y;
    var maxy = this.y + this.width < obj.y + obj.width ? this.y + this.width : obj.y + obj.width;
    return minx <= maxx && miny <= maxy;
  }

  proto.draw = function(ctx) {
    var offsetX = this.posX * this.originWidth;
    var offsetY = this.posY * this.originHeight;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.drawImage(this.image, offsetX, offsetY, this.originWidth, this.originHeight, 0, 0, this.width, this.height);
    ctx.restore();
  }

  proto.destroy = function() {

  }

  proto.update = function() {}

  Util.augment(Sprite, proto);
  Util.inherit(Sprite, Base);
  exports.Sprite = Sprite;
})(this);
