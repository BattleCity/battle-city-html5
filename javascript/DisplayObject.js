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
    // 使用缩放后的实际坐标进行碰撞检测
    var thisX = this.offsetX * (this.scale || 1);
    var thisY = this.offsetY * (this.scale || 1);
    var thisW = this.width * (this.scale || 1);
    var thisH = this.height * (this.scale || 1);
    
    var objX = obj.offsetX * (obj.scale || 1);
    var objY = obj.offsetY * (obj.scale || 1);
    var objW = obj.width * (obj.scale || 1);
    var objH = obj.height * (obj.scale || 1);
    
    // AABB碰撞检测
    return thisX < objX + objW &&
           thisX + thisW > objX &&
           thisY < objY + objH &&
           thisY + thisH > objY;
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
    this.debugRect(screen);
    screen.ctx.restore();
  }

  proto._draw = function(screen) {
  }

  proto.debugRect = function(screen) {
    if (!this.debug) return;
    screen.ctx.save();
    screen.ctx.lineWidth = 1;
    screen.ctx.strokeStyle = "#fff";
    screen.ctx.globalAlpha = 0.8;
    screen.ctx.beginPath();
    screen.ctx.moveTo(1, 1);
    screen.ctx.lineTo(this.width - 1, 1);
    screen.ctx.lineTo(this.width - 1, this.height - 1);
    screen.ctx.lineTo(1, this.height - 1);
    screen.ctx.lineTo(1, 1);
    screen.ctx.stroke();
    screen.ctx.closePath();
    screen.ctx.restore();
  }

  proto.hitTest = function(obj) {
    return _hitTest.call(this, obj);
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
