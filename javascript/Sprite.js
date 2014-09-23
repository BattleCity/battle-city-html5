'use strict';

(function(exports, undefined) {

  /**
   * @constructor     Sprite
   * @param {Object}  options
   * @return {Object} instance
   */
  function Sprite(options) {
    Sprite.sup.call(this);
    /* @name  options
     * @param {Object}  context
     * @param {Image}   image
     * @param {Number}  scaleX
     * @param {Number}  scaleY
     * @param {Number}  alpha
     * @param {Number}  offseX
     * @param {Number}  offsetY
     * @param {Number}  width
     * @param {Number}  height
     * @param {Number}  x
     * @param {Number}  y
     * @param {Number}  rotation
     * @param {Boolean} visible
     * @param {Boolean} debug
     */
    var opt = {
      image: null,
      scale: 1,
      alpha: 1,
      offsetX: 0,
      offsetY: 0,
      width: 300,
      height: 150,
      x: 0,
      y: 0,
      rotation: 0,
      visible: true,
      debug: false
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
  }

  function _draw(ctx) {
    if (!this.visible) return;
    this.update();
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.rotate(this.rotation * Math.PI/180);
    ctx.translate(this.offsetX * this.scale, this.offsetY * this.scale);
    ctx.drawImage(this.image, this.x * this.width, this.y * this.height, this.width, this.height, 0, 0, this.width * this.scale, this.height * this.scale);
    ctx.restore();
  }

  function _hitTest(obj) {
    var minx = this.x > obj.x ? this.x :obj.x;
    var maxx = this.x + this.width < obj.x + obj.width ? this.x + this.width : obj.x + obj.width;
    var miny = this.y > obj.y ? this.y : obj.y;
    var maxy = this.y + this.width < obj.y + obj.width ? this.y + this.width : obj.y + obj.width;
    return minx <= maxx && miny <= maxy;
  }

  var proto = {};

  proto.draw = function(ctx) {
    _draw.call(this, ctx);
  }

  proto.hitTest = function(obj) {
    _hitTest.call(this, obj);
  }

  proto.update = function() {}

  Util.augment(Sprite, proto);
  Util.inherit(Sprite, Base);
  exports.Sprite = Sprite;
})(this);

