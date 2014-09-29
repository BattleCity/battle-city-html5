'use strict';

(function(exports, undefined) {
  function DisplayObject(options) {
    /* @name  options
     * @param {Number}  scaleX
     * @param {Number}  scaleY
     * @param {Number}  alpha
     * @param {Number}  offseX
     * @param {Number}  offsetY
     * @param {Number}  width
     * @param {Number}  height
     * @param {Number}  rotation
     * @param {Boolean} visible
     * @param {Boolean} debug
     * @param {Boolean} destroy
     */
    var opt = {
      scale: 1,
      alpha: 1,
      offsetX: 0,
      offsetY: 0,
      width: 0,
      height: 0,
      rotation: 0,
      visible: true,
      destroyed: false
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
    Sound.sup.call(this);
  }

  function _hitTest(obj) {
    var minx = this.x > obj.x ? this.x :obj.x;
    var maxx = this.x + this.width < obj.x + obj.width ? this.x + this.width : obj.x + obj.width;
    var miny = this.y > obj.y ? this.y : obj.y;
    var maxy = this.y + this.width < obj.y + obj.width ? this.y + this.width : obj.y + obj.width;
    return minx <= maxx && miny <= maxy;
  }

  var proto = {};

  proto.draw = function(screen) {
    if (!this.visible) return;
    this.update(screen);
    screen.ctx.save();
    screen.ctx.globalAlpha = this.alpha;
    screen.ctx.rotate(this.rotation * Math.PI / 180);
    screen.ctx.translate(this.offsetX * this.scale, this.offsetY * this.scale);
    this._draw(screen);
    screen.ctx.restore();
  }

  proto._draw = function(screen) {
  }

  proto.hitTest = function(obj) {
    _hitTest.call(this, obj);
  }

  proto.update = function(screen) {
  }

  proto.destroy = function() {
    this.destroyed = true;
  }

  Util.augment(DisplayObject, proto);
  Util.inherit(DisplayObject, Base);
  exports.DisplayObject = DisplayObject;
})(this);
