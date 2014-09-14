'use strict';

(function(exports, undefined) {

  function SourceLoader() {
    SourceLoader.sup.call(this);
    this.hash = {};
  }

  function _imageLoader(item) {
    var that = this;
    var image = new Image();
    image.crossOrigin = '*';
    image.onload = function() {
      that.num ++;
      that.hash[item.id] = {
        image:image,
        width:image.width,
        height:image.height
      };

      if (that.num === that.size()) {
        that.emit('complete', that.hash);
      } else {
        that.emit('success', {
          index: that.num,
          item: image
        });
      }
    }
    image.src = item.src;
  }

  function _soundLoader() {}

  var proto = {};

  proto.load = function(query) {
    var that = this;
    this.num = 0;
    this.query = query;
    Util.each(this.query, function(i) {
      _imageLoader.call(that, i);
    });
  }

  proto.size = function() {
    return this.query.length;
  }

  Util.augment(SourceLoader, proto);
  Util.inherit(SourceLoader, Base);
  exports.SourceLoader = SourceLoader;
})(this);
