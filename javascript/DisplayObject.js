'use strict';

(function(exports, undefined) {
  function DisplayObject(options) {
    /* @name  options
     * @param {Object}  context
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
      debug: false,
      destory: false
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
    Sound.sup.call(this);
    this.init();
  }

  var proto = {};

  proto.init = function() {
  }

  proto.draw = function() {}

  proto.update = function() {}

  proto.destroy = function() {}

  Util.augment(DisplayObject, proto);
  Util.inherit(DisplayObject, Base);
  exports.DisplayObject = DisplayObject;
})(this);
