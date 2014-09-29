'use strict';

(function(exports, undefined) {

  /**
   * @constructor     Sprite
   * @param {Object}  options
   * @return {Object} instance
   */
  function Sprite(options) {
    /* @name  options
     * @param {Number}  x
     * @param {Number}  y
     * @param {Image}   image
     */
    var opt = {
      x: 0,
      y: 0,
      image: null
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
    Sprite.sup.call(this, opt);
  }

  function _draw(screen) {
    screen.ctx.drawImage(this.image, this.x * this.width, this.y * this.height, this.width, this.height, 0, 0, this.width * this.scale, this.height * this.scale);
  }

  var proto = {};

  proto._draw = function(screen) {
    _draw.call(this, screen);
  }

  Util.augment(Sprite, proto);
  Util.inherit(Sprite, DisplayObject);
  exports.Sprite = Sprite;
})(this);
