'use strict';

(function(exports, undefined) {

  function loader(item) {
    var that = this;
    var image = new Image();
    image.crossOrigin = '*';
    image.onload = function() {
      that.num ++;
      that.graphics[item.id] = {
        index: that.num,
        src: item.src,
        image: image,
        width: image.width,
        height: image.height
      };

      if (that.num === that.size()) {
        that.emit('complete', that.graphics);
      } else {
        that.emit('success', that.graphics[item.id]);
      }
    }
    image.src = item.src;
  }

  function Graphics() {
    this.graphics = {};
    this.num = 0;
    Graphics.sup.call(this);
  }

  var proto = {};

  proto.load = function(items) {
    var that = this;
    this.items = items;
    Util.each(this.items, function(item) {
      loader.call(that, item);
    });
    return this;
  }

  proto.size = function() {
    return this.items.length;
  }

  Util.augment(Graphics, proto);
  Util.inherit(Graphics, Base);
  exports.Graphics = Graphics;
})(this);
